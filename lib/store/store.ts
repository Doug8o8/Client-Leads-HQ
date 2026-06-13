// =====================================================================
// Local persistence store (Phase 2A).
// A tiny external store (subscribe / getSnapshot) backed by localStorage,
// consumable via React's useSyncExternalStore. Swap this module's guts
// for Supabase calls in Phase 3 without touching components.
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
  uniqueProjectId,
  type PersistedState,
} from "./persisted";
import { readRaw, writeRaw } from "./storage";

// A referentially-stable seed used for SSR + first hydration paint.
const serverSeed: PersistedState = buildSeedState();

let cache: PersistedState | null = null;
const listeners = new Set<() => void>();

// ---------------------------------------------------------------------
// Snapshot access
// ---------------------------------------------------------------------
function hydrate(): PersistedState {
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

export function getSnapshot(): PersistedState {
  if (cache === null) cache = hydrate();
  return cache;
}

export function getServerSnapshot(): PersistedState {
  return serverSeed;
}

export function subscribe(listener: () => void): () => void {
  listeners.add(listener);
  return () => listeners.delete(listener);
}

function persist(state: PersistedState) {
  writeRaw(STORE_KEY, JSON.stringify(state));
}

function commit(next: PersistedState) {
  cache = next;
  persist(next);
  listeners.forEach((l) => l());
}

/** Apply an immutable update to the current state. */
function update(fn: (state: PersistedState) => PersistedState) {
  commit(fn(getSnapshot()));
}

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
  const id = uniqueProjectId(input.report.reportName || input.business.businessName, state.projects);
  const now = new Date().toISOString();

  const project: Project = {
    id,
    orgId: "org_demo",
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
  const starterLeads = cloneLeadsForProject(serverSeed.leads, id, input.report.leadsDesired);

  commit({
    ...state,
    projects: [project, ...state.projects],
    leads: [...starterLeads, ...state.leads],
  });
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
  desired: number
): Lead[] {
  const count = Math.max(1, Math.min(source.length, desired || source.length));
  return source.slice(0, count).map((lead, i) => ({
    ...lead,
    id: `lead_${projectId}_${String(i + 1).padStart(2, "0")}`,
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
}

// ---------------------------------------------------------------------
// Mutations — leads
// ---------------------------------------------------------------------
export function updateLead(leadId: string, patch: Partial<Lead>) {
  update((state) => ({
    ...state,
    leads: state.leads.map((l) => (l.id === leadId ? { ...l, ...patch } : l)),
  }));
}

export function toggleLeadIncluded(leadId: string) {
  update((state) => ({
    ...state,
    leads: state.leads.map((l) =>
      l.id === leadId
        ? {
            ...l,
            includedInReport: !l.includedInReport,
            // Keep status loosely in sync with inclusion for clarity.
            status: !l.includedInReport ? "Approved" : "Open",
          }
        : l
    ),
  }));
}

// ---------------------------------------------------------------------
// Meta + reset
// ---------------------------------------------------------------------
export function recordExport() {
  update((state) => ({
    ...state,
    meta: { ...state.meta, exportCount: state.meta.exportCount + 1 },
  }));
}

export function resetDemo() {
  commit(buildSeedState());
}
