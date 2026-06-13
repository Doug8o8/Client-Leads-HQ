// =====================================================================
// Data access layer — wraps mock data behind functions so a real
// backend (Supabase) can be swapped in later without touching the UI.
// =====================================================================
import type { Lead, Project, ScoreLabel, VerificationStatus } from "./types";
import { LEADS, PROJECTS } from "./mock-data";
import { isStrongLead, SCORE_LABEL_BANDS } from "./scoring";

export function getProjects(): Project[] {
  return PROJECTS;
}

export function getProject(projectId: string): Project | undefined {
  return PROJECTS.find((p) => p.id === projectId);
}

export function getLeads(projectId: string): Lead[] {
  return LEADS.filter((l) => l.projectId === projectId).sort(
    (a, b) => b.score - a.score
  );
}

export function getLead(projectId: string, leadId: string): Lead | undefined {
  return LEADS.find((l) => l.projectId === projectId && l.id === leadId);
}

export function getIncludedLeads(projectId: string): Lead[] {
  return getLeads(projectId).filter((l) => l.includedInReport);
}

// ---------------------------------------------------------------------
// Derived aggregates
// ---------------------------------------------------------------------
export interface ProjectAggregates {
  totalLeads: number;
  strongLeads: number;
  averageScore: number;
  verifiedCount: number;
  includedCount: number;
  removedCount: number;
  scoreDistribution: Array<{ label: ScoreLabel; count: number }>;
  verificationDistribution: Array<{ status: VerificationStatus; count: number }>;
  strongest: Lead[];
  removed: Lead[];
}

export function getProjectAggregates(projectId: string): ProjectAggregates {
  const leads = getLeads(projectId);
  const total = leads.length;
  const averageScore =
    total === 0
      ? 0
      : Math.round(leads.reduce((sum, l) => sum + l.score, 0) / total);

  const scoreDistribution = SCORE_LABEL_BANDS.map((band) => ({
    label: band.label,
    count: leads.filter((l) => l.scoreLabel === band.label).length,
  }));

  const verificationOrder: VerificationStatus[] = [
    "Verified",
    "Estimated",
    "Inferred",
    "Unknown",
  ];
  const verificationDistribution = verificationOrder.map((status) => ({
    status,
    count: leads.filter((l) => l.verification === status).length,
  }));

  return {
    totalLeads: total,
    strongLeads: leads.filter((l) => isStrongLead(l.score)).length,
    averageScore,
    verifiedCount: leads.filter((l) => l.verification === "Verified").length,
    includedCount: leads.filter((l) => l.includedInReport).length,
    removedCount: leads.filter((l) => !l.includedInReport).length,
    scoreDistribution,
    verificationDistribution,
    strongest: leads.filter((l) => l.score >= 70).slice(0, 4),
    removed: leads.filter((l) => !l.includedInReport),
  };
}

// ---------------------------------------------------------------------
// Org-wide dashboard aggregates
// ---------------------------------------------------------------------
export interface DashboardStats {
  projectCount: number;
  totalLeads: number;
  strongLeads: number;
  reportsCreated: number;
  exportCount: number;
}

export function getDashboardStats(): DashboardStats {
  const projects = getProjects();
  const allLeads = projects.flatMap((p) => getLeads(p.id));
  return {
    projectCount: projects.length,
    totalLeads: allLeads.length,
    strongLeads: allLeads.filter((l) => isStrongLead(l.score)).length,
    // Demo counts — reports/exports are not persisted in Phase 1.
    reportsCreated: 3,
    exportCount: 7,
  };
}
