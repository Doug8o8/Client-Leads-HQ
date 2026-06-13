"use client";

import { useMemo, useSyncExternalStore } from "react";
import type { Lead, Project } from "@/lib/types";
import {
  computeAggregates,
  computeDashboardStats,
  type DashboardStats,
  type ProjectAggregates,
} from "@/lib/aggregates";
import { getServerSnapshot, getSnapshot, subscribe } from "./store";
import type { PersistedState } from "./persisted";

/** Whole-state subscription. Stable reference between mutations. */
export function useStoreState(): PersistedState {
  return useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);
}

const noopSubscribe = () => () => {};

/**
 * False during SSR and the first client paint, true thereafter. Implemented
 * with useSyncExternalStore so there's no setState-in-effect, and React
 * resolves the server/client difference without a hydration warning.
 */
export function useHydrated(): boolean {
  return useSyncExternalStore(
    noopSubscribe,
    () => true,
    () => false
  );
}

export function useProjects(): Project[] {
  const state = useStoreState();
  return state.projects;
}

export function useProject(projectId: string): Project | undefined {
  const state = useStoreState();
  return useMemo(
    () => state.projects.find((p) => p.id === projectId),
    [state.projects, projectId]
  );
}

export function useProjectLeads(projectId: string): Lead[] {
  const state = useStoreState();
  return useMemo(
    () =>
      state.leads
        .filter((l) => l.projectId === projectId)
        .sort((a, b) => b.score - a.score),
    [state.leads, projectId]
  );
}

export function useProjectAggregates(projectId: string): ProjectAggregates {
  const leads = useProjectLeads(projectId);
  return useMemo(() => computeAggregates(leads), [leads]);
}

export function useDashboardStats(): DashboardStats {
  const state = useStoreState();
  return useMemo(
    () => computeDashboardStats(state.projects, state.leads, state.meta),
    [state.projects, state.leads, state.meta]
  );
}
