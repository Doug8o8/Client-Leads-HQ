// =====================================================================
// Pure derivation helpers — take lead/project arrays, return aggregates.
// No data source coupling, so both the seed and the live store use them.
// =====================================================================
import type { Lead, Project, ScoreLabel, VerificationStatus } from "./types";
import { isStrongLead, SCORE_LABEL_BANDS } from "./scoring";

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

export function computeAggregates(leads: Lead[]): ProjectAggregates {
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

  const sorted = [...leads].sort((a, b) => b.score - a.score);

  return {
    totalLeads: total,
    strongLeads: leads.filter((l) => isStrongLead(l.score)).length,
    averageScore,
    verifiedCount: leads.filter((l) => l.verification === "Verified").length,
    includedCount: leads.filter((l) => l.includedInReport).length,
    removedCount: leads.filter((l) => !l.includedInReport).length,
    scoreDistribution,
    verificationDistribution,
    strongest: sorted.filter((l) => l.score >= 70).slice(0, 4),
    removed: sorted.filter((l) => !l.includedInReport),
  };
}

export interface DashboardStats {
  projectCount: number;
  totalLeads: number;
  strongLeads: number;
  reportsCreated: number;
  exportCount: number;
}

export function computeDashboardStats(
  projects: Project[],
  leads: Lead[],
  meta: { reportsCreated: number; exportCount: number }
): DashboardStats {
  return {
    projectCount: projects.length,
    totalLeads: leads.length,
    strongLeads: leads.filter((l) => isStrongLead(l.score)).length,
    reportsCreated: meta.reportsCreated,
    exportCount: meta.exportCount,
  };
}
