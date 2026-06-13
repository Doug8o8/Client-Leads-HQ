// =====================================================================
// Client Leads HQ — Core data models
// Phase 1 uses local mock data. These types are intentionally
// Supabase-friendly (snake-free, flat ids) so they can map to DB rows.
// =====================================================================

export type VerificationStatus =
  | "Verified"
  | "Estimated"
  | "Inferred"
  | "Unknown";

export type ScoreLabel =
  | "Excellent"
  | "Strong"
  | "Review"
  | "Weak"
  | "Remove";

export type DecisionMakerStatus =
  | "Confirmed owner/principal"
  | "Likely decision maker"
  | "Gatekeeper / unclear"
  | "Unknown";

export type BusinessAgeStatus =
  | "Established (5+ yrs)"
  | "Growing (2–5 yrs)"
  | "Early (<2 yrs)"
  | "Unknown";

export type EvidenceConfidence = "Confirmed" | "Estimated" | "Inferred";

// ---------------------------------------------------------------------
// Organization & Profile (the account using the app)
// ---------------------------------------------------------------------
export interface Organization {
  id: string;
  name: string;
  createdAt: string;
}

export interface Profile {
  id: string;
  orgId: string;
  fullName: string;
  email: string;
  role: "owner" | "member";
}

// ---------------------------------------------------------------------
// Project — a saved prospecting campaign
// ---------------------------------------------------------------------
export interface BusinessProfile {
  businessName: string;
  website: string;
  industry: string;
  location: string;
}

export interface TargetCustomer {
  description: string;
  idealIndustries: string[];
  companySize: string;
  geography: string;
}

export interface ProspectSignals {
  idealSignals: string[];
  badFitSignals: string[];
  services: string[];
}

export interface ReportSettings {
  reportName: string;
  goal: string;
  leadsDesired: number;
}

export type ProjectStatus = "Draft" | "Researching" | "Ready" | "Report sent";

export interface Project {
  id: string;
  orgId: string;
  name: string;
  status: ProjectStatus;
  createdAt: string;
  updatedAt: string;
  business: BusinessProfile;
  target: TargetCustomer;
  signals: ProspectSignals;
  report: ReportSettings;
}

// ---------------------------------------------------------------------
// Lead — a candidate prospect
// ---------------------------------------------------------------------
export interface ScoreBreakdown {
  icpFit: number; // out of 25
  needSignal: number; // out of 25
  verification: number; // out of 20
  decisionMaker: number; // out of 10
  outreachQuality: number; // out of 15
  contactability: number; // out of 5
  riskPenalty: number; // 0..-20
}

export interface EvidenceItem {
  label: string;
  detail: string;
  confidence: EvidenceConfidence;
  // Mock/demo source. Clearly marked as non-real in the UI.
  sourceUrl: string;
  sourceLabel: string;
}

export interface OutreachAngle {
  hook: string;
  rationale: string;
}

export interface Lead {
  id: string;
  projectId: string;
  company: string;
  website: string;
  publicProfileUrl: string;
  location: string;
  city: string;
  state: string;
  industry: string;
  phone: string;
  email: string | null;
  score: number; // 0..100
  scoreLabel: ScoreLabel;
  breakdown: ScoreBreakdown;
  whyItFits: string;
  needReason: string;
  decisionMaker: DecisionMakerStatus;
  decisionMakerName: string | null;
  businessAge: BusinessAgeStatus;
  verification: VerificationStatus;
  evidence: EvidenceItem[];
  outreach: OutreachAngle;
  riskNotes: string;
  includedInReport: boolean;
}

// ---------------------------------------------------------------------
// Report & Export (generated artifacts)
// ---------------------------------------------------------------------
export interface ReportStats {
  totalReviewed: number;
  strongLeads: number;
  averageScore: number;
  verifiedCount: number;
}

export interface Report {
  id: string;
  projectId: string;
  title: string;
  generatedAt: string;
  stats: ReportStats;
}

export interface Export {
  id: string;
  projectId: string;
  format: "csv";
  rows: number;
  createdAt: string;
}
