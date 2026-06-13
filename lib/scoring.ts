// =====================================================================
// Lead scoring — reusable, deterministic logic.
// Total out of 100, composed from weighted dimensions minus a risk penalty.
// =====================================================================
import type { ScoreBreakdown, ScoreLabel, VerificationStatus } from "./types";

export const SCORE_WEIGHTS = {
  icpFit: 25,
  needSignal: 25,
  verification: 20,
  decisionMaker: 10,
  outreachQuality: 15,
  contactability: 5,
  riskPenalty: -20, // max penalty magnitude
} as const;

export const SCORE_DIMENSIONS: Array<{
  key: keyof ScoreBreakdown;
  label: string;
  max: number;
  description: string;
}> = [
  { key: "icpFit", label: "ICP fit", max: 25, description: "How closely the prospect matches the ideal customer profile." },
  { key: "needSignal", label: "Need signal", max: 25, description: "Strength of evidence that the prospect needs the service." },
  { key: "verification", label: "Verification", max: 20, description: "How well the underlying facts are confirmed vs. inferred." },
  { key: "decisionMaker", label: "Decision maker", max: 10, description: "Clarity on reaching the person who can say yes." },
  { key: "outreachQuality", label: "Outreach quality", max: 15, description: "Strength of the available angle and personalization." },
  { key: "contactability", label: "Contactability", max: 5, description: "Availability of a reliable way to make contact." },
  { key: "riskPenalty", label: "Risk penalty", max: -20, description: "Deductions for bad-fit signals, churn risk, or data gaps." },
];

/** Sum a breakdown into a clamped 0..100 total. */
export function scoreFromBreakdown(b: ScoreBreakdown): number {
  const raw =
    b.icpFit +
    b.needSignal +
    b.verification +
    b.decisionMaker +
    b.outreachQuality +
    b.contactability +
    b.riskPenalty;
  return Math.max(0, Math.min(100, Math.round(raw)));
}

/** Map a 0..100 score to its label band. */
export function labelForScore(score: number): ScoreLabel {
  if (score >= 85) return "Excellent";
  if (score >= 70) return "Strong";
  if (score >= 55) return "Review";
  if (score >= 40) return "Weak";
  return "Remove";
}

/** A lead counts as "strong" when it is report-worthy out of the gate. */
export function isStrongLead(score: number): boolean {
  return score >= 70;
}

export const SCORE_LABEL_BANDS: Array<{
  label: ScoreLabel;
  min: number;
  max: number;
}> = [
  { label: "Excellent", min: 85, max: 100 },
  { label: "Strong", min: 70, max: 84 },
  { label: "Review", min: 55, max: 69 },
  { label: "Weak", min: 40, max: 54 },
  { label: "Remove", min: 0, max: 39 },
];

export const VERIFICATION_DEFINITIONS: Array<{
  status: VerificationStatus;
  definition: string;
}> = [
  {
    status: "Verified",
    definition:
      "Confirmed against a primary, checkable source. Treated as fact.",
  },
  {
    status: "Estimated",
    definition:
      "Derived from a reliable proxy (e.g. headcount band, founding-year range). Directionally accurate, not exact.",
  },
  {
    status: "Inferred",
    definition:
      "An AI-assisted deduction from indirect signals. A hypothesis to confirm, not a fact.",
  },
  {
    status: "Unknown",
    definition: "No reliable signal available. Flagged for manual review.",
  },
];
