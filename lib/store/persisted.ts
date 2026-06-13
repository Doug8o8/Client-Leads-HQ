// =====================================================================
// Persisted state shape + seed.
// This is the single source of truth for what we keep in localStorage.
// Designed to map cleanly onto Supabase tables in Phase 3.
// =====================================================================
import type { Lead, Project } from "@/lib/types";
import { LEADS, PROJECTS } from "@/lib/mock-data";

export const STORE_KEY = "clhq.store.v1";
export const STORE_VERSION = 1;

export interface PersistedState {
  version: number;
  projects: Project[];
  leads: Lead[]; // flat across projects, filtered by projectId
  meta: {
    reportsCreated: number;
    exportCount: number;
  };
}

/** Fresh demo state, rebuilt from the static mock data. */
export function buildSeedState(): PersistedState {
  return {
    version: STORE_VERSION,
    // Deep clone so mutations never touch the imported mock arrays.
    projects: clone(PROJECTS),
    leads: clone(LEADS),
    meta: { reportsCreated: 3, exportCount: 7 },
  };
}

function clone<T>(value: T): T {
  return JSON.parse(JSON.stringify(value)) as T;
}

/** Validate/upgrade a parsed blob; fall back to a fresh seed if invalid. */
export function normalizeState(raw: unknown): PersistedState {
  if (!raw || typeof raw !== "object") return buildSeedState();
  const candidate = raw as Partial<PersistedState>;
  if (
    candidate.version !== STORE_VERSION ||
    !Array.isArray(candidate.projects) ||
    !Array.isArray(candidate.leads)
  ) {
    return buildSeedState();
  }
  return {
    version: STORE_VERSION,
    projects: candidate.projects as Project[],
    leads: candidate.leads as Lead[],
    meta: {
      reportsCreated: candidate.meta?.reportsCreated ?? 0,
      exportCount: candidate.meta?.exportCount ?? 0,
    },
  };
}

// ---------------------------------------------------------------------
// ID / slug helpers for newly created projects
// ---------------------------------------------------------------------
export function slugify(input: string): string {
  return input
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 48);
}

export function uniqueProjectId(name: string, existing: Project[]): string {
  const base = `proj_${slugify(name) || "untitled"}`;
  if (!existing.some((p) => p.id === base)) return base;
  let i = 2;
  while (existing.some((p) => p.id === `${base}-${i}`)) i += 1;
  return `${base}-${i}`;
}
