// =====================================================================
// Hand-written Supabase Database types (Phase 3B).
//
// Mirrors supabase/migrations/0001_init.sql. Used to type the browser and
// server clients so queries are checked against the real schema. jsonb
// columns reuse the app's domain interfaces from lib/types.
// =====================================================================
import type {
  BusinessProfile,
  ProspectSignals,
  ReportSettings,
  ReportStats,
  ScoreBreakdown,
  TargetCustomer,
} from "@/lib/types";

/** Insert/Update are permissive (partial) — we always build rows explicitly. */
type Table<Row> = {
  Row: Row;
  Insert: Partial<Row>;
  Update: Partial<Row>;
  Relationships: [];
};

export type OrganizationRow = {
  id: string;
  name: string;
  created_at: string;
}

export type ProfileRow = {
  id: string;
  org_id: string;
  full_name: string;
  email: string;
  role: "owner" | "member";
  created_at: string;
}

export type ProjectRow = {
  id: string;
  org_id: string;
  name: string;
  status: string;
  business: BusinessProfile;
  target: TargetCustomer;
  signals: ProspectSignals;
  report: ReportSettings;
  created_at: string;
  updated_at: string;
}

export type LeadSearchRow = {
  id: string;
  org_id: string;
  project_id: string;
  query: string;
  params: Record<string, unknown>;
  status: string;
  result_count: number;
  created_at: string;
}

export type LeadRow = {
  id: string;
  org_id: string;
  project_id: string;
  search_id: string | null;
  company: string;
  website: string;
  public_profile_url: string;
  location: string;
  city: string;
  state: string;
  industry: string;
  phone: string;
  email: string | null;
  score: number;
  score_label: string;
  breakdown: ScoreBreakdown;
  why_it_fits: string;
  need_reason: string;
  decision_maker: string;
  decision_maker_name: string | null;
  business_age: string;
  verification: string;
  risk_notes: string;
  included_in_report: boolean;
  status: string;
  notes: string;
  created_at: string;
  updated_at: string;
}

export type LeadVerificationRow = {
  id: string;
  org_id: string;
  lead_id: string;
  label: string;
  detail: string;
  confidence: string;
  source_url: string;
  source_label: string;
  created_at: string;
}

export type LeadScoreRow = {
  id: string;
  org_id: string;
  lead_id: string;
  icp_fit: number;
  need_signal: number;
  verification: number;
  decision_maker: number;
  outreach_quality: number;
  contactability: number;
  risk_penalty: number;
  total: number;
  created_at: string;
}

export type OutreachAngleRow = {
  id: string;
  org_id: string;
  lead_id: string;
  hook: string;
  rationale: string;
  created_at: string;
}

export type ReportRow = {
  id: string;
  org_id: string;
  project_id: string;
  title: string;
  stats: ReportStats | Record<string, unknown>;
  generated_at: string;
}

export type ReportLeadRow = {
  id: string;
  org_id: string;
  report_id: string;
  lead_id: string;
  position: number;
  created_at: string;
}

export type ExportRow = {
  id: string;
  org_id: string;
  project_id: string;
  format: string;
  rows: number;
  created_at: string;
}

export type UsageEventRow = {
  id: string;
  org_id: string;
  profile_id: string | null;
  event_type: string;
  metadata: Record<string, unknown>;
  created_at: string;
}

export interface Database {
  public: {
    Tables: {
      organizations: Table<OrganizationRow>;
      profiles: Table<ProfileRow>;
      projects: Table<ProjectRow>;
      lead_searches: Table<LeadSearchRow>;
      leads: Table<LeadRow>;
      lead_verifications: Table<LeadVerificationRow>;
      lead_scores: Table<LeadScoreRow>;
      outreach_angles: Table<OutreachAngleRow>;
      reports: Table<ReportRow>;
      report_leads: Table<ReportLeadRow>;
      exports: Table<ExportRow>;
      usage_events: Table<UsageEventRow>;
    };
    Views: Record<string, never>;
    Functions: Record<string, never>;
    Enums: Record<string, never>;
    CompositeTypes: Record<string, never>;
  };
}
