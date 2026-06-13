// =====================================================================
// Store orchestrator (Phase 3B).
//
// Keeps a synchronous in-memory `cache` (the snapshot React reads via
// useSyncExternalStore) and routes persistence to one of two backends:
//
//   • Local Demo Mode   — localStorage (default; Phase 2A behavior).
//   • Supabase Mode      — Postgres, when Supabase is configured AND a
//                          user is signed in. Mutations update the cache
//                          optimistically, then write to Supabase async.
//
// The hooks in useStore.ts and the entire UI are untouched: same exported
// functions, same return types. Backend selection happens here at runtime.
// =====================================================================
import type {
  BusinessProfile,
  Lead,
  Project,
  ProspectSignals,
  ReportSettings,
  TargetCustomer,
} from "@/lib/types";
import {
  buildSeedState,
  normalizeState,
  STORE_KEY,
  STORE_VERSION,
  uniqueProjectId,
  type PersistedState,
} from "./persisted";
import { readRaw, writeRaw } from "./storage";
import { getSupabaseBrowserClient } from "@/lib/supabase/client";
import { isSupabaseConfigured } from "@/lib/supabase/env";
import * as supa from "./supabaseStore";

// A referentially-stable seed used for SSR + first hydration paint.
const serverSeed: PersistedState = buildSeedState();

type Backend = "local" | "supabase";

let cache: PersistedState | null = null;
const listeners = new Set<() => void>();

// Supabase runtime context (only set once a signed-in session resolves).
let backend: Backend = "local";
let resolveStarted = false;
let supabaseClient: supa.DB | null = null;
let supabaseOrgId: string | null = null;
let supabaseProfileId: string | null = null;

// ---------------------------------------------------------------------
// Snapshot access
// ---------------------------------------------------------------------
function emptyState(): PersistedState {
  return {
    version: STORE_VERSION,
    projects: [],
    leads: [],
    meta: { reportsCreated: 0, exportCount: 0 },
  };
}

/** Local hydrate — read localStorage, seeding from mock data if empty. */
function localHydrate(): PersistedState {
  const raw = readRaw(STORE_KEY);
  if (raw) {
    try {
      return normalizeState(JSON.parse(raw));
    } catch {
      /* fall through to seed */
    }
  }
  const seeded = buildSeedState();
  persist(seeded);
  return seeded;
}

/**
 * First synchronous snapshot. In Local Demo Mode this seeds from mock data
 * exactly as before. When Supabase is configured we DON'T seed yet (auth is
 * resolved asynchronously) — we show any existing local data or an empty
 * workspace, then `resolveBackend()` fills it in.
 */
function initialHydrate(): PersistedState {
  if (!isSupabaseConfigured()) return localHydrate();
  const raw = readRaw(STORE_KEY);
  if (raw) {
    try {
      return normalizeState(JSON.parse(raw));
    } catch {
      /* ignore */
    }
  }
  return emptyState();
}

export function getSnapshot(): PersistedState {
  if (cache === null) {
    cache = initialHydrate();
    void resolveBackend();
  }
  return cache;
}

export function getServerSnapshot(): PersistedState {
  return serverSeed;
}

export function subscribe(listener: () => void): () => void {
  listeners.add(listener);
  return () => listeners.delete(listener);
}

function notify() {
  listeners.forEach((l) => l());
}

function persist(state: PersistedState) {
  writeRaw(STORE_KEY, JSON.stringify(state));
}

function setCache(next: PersistedState) {
  cache = next;
  notify();
}

/** Commit a new state: always update the cache; persist to localStorage in local mode. */
function commit(next: PersistedState) {
  cache = next;
  if (backend === "local") persist(next);
  notify();
}

/** Apply an immutable update to the current state. */
function update(fn: (state: PersistedState) => PersistedState) {
  commit(fn(getSnapshot()));
}

// ---------------------------------------------------------------------
// Backend resolution (async, runs once on the client)
// ---------------------------------------------------------------------
async function resolveBackend(): Promise<void> {
  if (resolveStarted || typeof window === "undefined" || !isSupabaseConfigured()) {
    return;
  }
  resolveStarted = true;

  const supabase = getSupabaseBrowserClient();
  if (!supabase) return;

  const {
    data: { session },
  } = await supabase.auth.getSession();

  if (session) {
    await activateSupabase(supabase, session.user.id);
  } else {
    // Configured but signed out → behave like Local Demo Mode.
    ensureLocalSeed();
  }

  // React to later sign-in / sign-out without a reload.
  supabase.auth.onAuthStateChange((_event, next) => {
    if (next) {
      void activateSupabase(supabase, next.user.id);
    } else {
      revertToLocal();
    }
  });
}

async function activateSupabase(supabase: supa.DB, userId: string): Promise<void> {
  const { data: profile } = await supabase
    .from("profiles")
    .select("id, org_id")
    .eq("id", userId)
    .maybeSingle();

  const orgId = profile?.org_id ?? null;
  if (!orgId) {
    // No profile yet (trigger pending) — stay local for now.
    ensureLocalSeed();
    return;
  }

  supabaseClient = supabase;
  supabaseOrgId = orgId;
  supabaseProfileId = profile?.id ?? userId;
  backend = "supabase";

  try {
    const cloud = await supa.fetchPersistedState(supabase, orgId);
    setCache(cloud);
  } catch {
    // On fetch failure, don't wipe the view; leave whatever was shown.
  }
}

function revertToLocal() {
  backend = "local";
  supabaseClient = null;
  supabaseOrgId = null;
  supabaseProfileId = null;
  setCache(localHydrate());
}

/** Seed the local demo data if the (configured, signed-out) cache is empty. */
function ensureLocalSeed() {
  if (cache && cache.projects.length === 0) {
    setCache(localHydrate());
  }
}

const isSupabase = () => backend === "supabase" && !!supabaseClient && !!supabaseOrgId;

// ---------------------------------------------------------------------
// Mutations — projects
// ---------------------------------------------------------------------
export interface NewProjectInput {
  business: BusinessProfile;
  target: TargetCustomer;
  signals: ProspectSignals;
  report: ReportSettings;
}

/** Create a project, seed it with a starter set of demo leads, return its id. */
export function createProject(input: NewProjectInput): string {
  const state = getSnapshot();
  const sb = isSupabase();
  const now = new Date().toISOString();

  const id = sb
    ? crypto.randomUUID()
    : uniqueProjectId(input.report.reportName || input.business.businessName, state.projects);
  const orgId = sb ? supabaseOrgId! : "org_demo";

  const project: Project = {
    id,
    orgId,
    name: deriveProjectName(input),
    status: "Ready",
    createdAt: now,
    updatedAt: now,
    business: input.business,
    target: input.target,
    signals: input.signals,
    report: input.report,
  };

  // Seed the new project with cloned demo leads so the downstream
  // workflow (leads → report → CSV) is immediately explorable.
  const starterLeads = cloneLeadsForProject(
    serverSeed.leads,
    id,
    input.report.leadsDesired,
    sb
  );

  commit({
    ...state,
    projects: [project, ...state.projects],
    leads: [...starterLeads, ...state.leads],
  });

  if (sb) {
    void supa.insertProjectWithLeads(supabaseClient!, supabaseOrgId!, project, starterLeads);
  }

  return id;
}

function deriveProjectName(input: NewProjectInput): string {
  const geo = input.target.geography?.split(/[,(]/)[0]?.trim();
  if (geo) return `${geo} — ${input.business.industry}`;
  return input.report.reportName || `${input.business.businessName} prospects`;
}

function cloneLeadsForProject(
  source: Lead[],
  projectId: string,
  desired: number,
  useUuid: boolean
): Lead[] {
  const count = Math.max(1, Math.min(source.length, desired || source.length));
  return source.slice(0, count).map((lead, i) => ({
    ...lead,
    id: useUuid ? crypto.randomUUID() : `lead_${projectId}_${String(i + 1).padStart(2, "0")}`,
    projectId,
  }));
}

export function updateProject(id: string, patch: Partial<Project>) {
  update((state) => ({
    ...state,
    projects: state.projects.map((p) =>
      p.id === id ? { ...p, ...patch, updatedAt: new Date().toISOString() } : p
    ),
  }));
  if (isSupabase()) {
    void supa.updateProjectRow(supabaseClient!, id, patch);
  }
}

// ---------------------------------------------------------------------
// Mutations — leads
// ---------------------------------------------------------------------
export function updateLead(leadId: string, patch: Partial<Lead>) {
  update((state) => ({
    ...state,
    leads: state.leads.map((l) => (l.id === leadId ? { ...l, ...patch } : l)),
  }));
  if (isSupabase()) {
    void supa.updateLeadRow(supabaseClient!, leadId, supabaseOrgId!, patch);
  }
}

export function toggleLeadIncluded(leadId: string) {
  const current = getSnapshot().leads.find((l) => l.id === leadId);
  const nextIncluded = current ? !current.includedInReport : true;
  const nextStatus: Lead["status"] = nextIncluded ? "Approved" : "Open";

  update((state) => ({
    ...state,
    leads: state.leads.map((l) =>
      l.id === leadId
        ? { ...l, includedInReport: nextIncluded, status: nextStatus }
        : l
    ),
  }));

  if (isSupabase()) {
    void supa.updateLeadRow(supabaseClient!, leadId, supabaseOrgId!, {
      includedInReport: nextIncluded,
      status: nextStatus,
    });
  }
}

// ---------------------------------------------------------------------
// Meta + activity
// ---------------------------------------------------------------------
export function recordExport(opts?: { projectId?: string; rows?: number }) {
  update((state) => ({
    ...state,
    meta: { ...state.meta, exportCount: state.meta.exportCount + 1 },
  }));
  if (isSupabase()) {
    void supa.insertExport(
      supabaseClient!,
      supabaseOrgId!,
      supabaseProfileId,
      opts?.projectId ?? null,
      opts?.rows ?? 0
    );
  }
}

export function recordReport(opts: {
  projectId: string;
  title: string;
  stats: Record<string, unknown>;
  includedLeadIds: string[];
}) {
  update((state) => ({
    ...state,
    meta: { ...state.meta, reportsCreated: state.meta.reportsCreated + 1 },
  }));
  if (isSupabase()) {
    void supa.insertReport(
      supabaseClient!,
      supabaseOrgId!,
      supabaseProfileId,
      opts.projectId,
      opts.title,
      opts.stats,
      opts.includedLeadIds
    );
  }
}

/**
 * "Reset local demo data." In Local Demo Mode this restores the seed. In
 * Supabase Mode it only resets the dormant localStorage copy (the cloud
 * workspace is left untouched).
 */
export function resetDemo() {
  if (isSupabase()) {
    persist(buildSeedState());
    return;
  }
  commit(buildSeedState());
}

// ---------------------------------------------------------------------
// Mode + migration helpers (consumed by Settings + the migration banner)
// ---------------------------------------------------------------------
export function isSupabaseActive(): boolean {
  return isSupabase();
}

const MIGRATED_PREFIX = "clhq.migrated.";

function isMigrated(orgId: string): boolean {
  return readRaw(`${MIGRATED_PREFIX}${orgId}`) === "1";
}

function markMigrated(orgId: string) {
  writeRaw(`${MIGRATED_PREFIX}${orgId}`, "1");
}

/** Local projects/leads available to import into the cloud, or null if none. */
export function getLocalDataForMigration(): { projects: Project[]; leads: Lead[] } | null {
  const raw = readRaw(STORE_KEY);
  if (!raw) return null;
  try {
    const state = normalizeState(JSON.parse(raw));
    if (state.projects.length === 0) return null;
    return { projects: state.projects, leads: state.leads };
  } catch {
    return null;
  }
}

/** True when signed in to Supabase with un-migrated local data present. */
export function canOfferMigration(): boolean {
  if (!isSupabase() || !supabaseOrgId) return false;
  if (isMigrated(supabaseOrgId)) return false;
  return getLocalDataForMigration() !== null;
}

/** Upload local projects/leads into the org, then refresh the cloud view. */
export async function migrateLocalToSupabase(): Promise<number> {
  if (!isSupabase() || !supabaseClient || !supabaseOrgId) return 0;
  const local = getLocalDataForMigration();
  if (!local) return 0;

  const count = await supa.uploadAll(
    supabaseClient,
    supabaseOrgId,
    local.projects,
    local.leads
  );
  markMigrated(supabaseOrgId);

  const cloud = await supa.fetchPersistedState(supabaseClient, supabaseOrgId);
  setCache(cloud);
  return count;
}

/** Dismiss the migration offer without importing. */
export function dismissMigration() {
  if (supabaseOrgId) markMigrated(supabaseOrgId);
  notify();
}
