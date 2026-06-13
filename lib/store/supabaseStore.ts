// =====================================================================
// Supabase backend for the store (Phase 3B).
//
// Pure data-access: maps between the app's domain types (lib/types) and
// the Postgres rows (lib/supabase/database.types), and performs the
// inserts/updates/selects. store.ts orchestrates WHEN these run; this
// module never touches React or localStorage.
//
// All writes set org_id explicitly so Row Level Security passes.
// =====================================================================
import type { SupabaseClient } from "@supabase/supabase-js";
import type { Database, LeadRow, ProjectRow } from "@/lib/supabase/database.types";
import type { Lead, Project } from "@/lib/types";
import type { PersistedState } from "./persisted";
import { STORE_VERSION } from "./persisted";

export type DB = SupabaseClient<Database>;

// ---------------------------------------------------------------------
// Row → domain
// ---------------------------------------------------------------------
function rowToProject(row: ProjectRow): Project {
  return {
    id: row.id,
    orgId: row.org_id,
    name: row.name,
    status: row.status as Project["status"],
    createdAt: row.created_at,
    updatedAt: row.updated_at,
    business: row.business,
    target: row.target,
    signals: row.signals,
    report: row.report,
  };
}

function rowToLead(
  row: LeadRow,
  evidence: Lead["evidence"],
  outreach: Lead["outreach"]
): Lead {
  return {
    id: row.id,
    projectId: row.project_id,
    company: row.company,
    website: row.website,
    publicProfileUrl: row.public_profile_url,
    location: row.location,
    city: row.city,
    state: row.state,
    industry: row.industry,
    phone: row.phone,
    email: row.email,
    score: row.score,
    scoreLabel: row.score_label as Lead["scoreLabel"],
    breakdown: row.breakdown,
    whyItFits: row.why_it_fits,
    needReason: row.need_reason,
    decisionMaker: row.decision_maker as Lead["decisionMaker"],
    decisionMakerName: row.decision_maker_name,
    businessAge: row.business_age as Lead["businessAge"],
    verification: row.verification as Lead["verification"],
    evidence,
    outreach,
    riskNotes: row.risk_notes,
    includedInReport: row.included_in_report,
    status: row.status as Lead["status"],
    notes: row.notes,
  };
}

// ---------------------------------------------------------------------
// domain → row (insert payloads)
// ---------------------------------------------------------------------
function projectInsert(orgId: string, p: Project) {
  return {
    id: p.id,
    org_id: orgId,
    name: p.name,
    status: p.status,
    business: p.business,
    target: p.target,
    signals: p.signals,
    report: p.report,
    created_at: p.createdAt,
    updated_at: p.updatedAt,
  };
}

function leadInsert(orgId: string, projectId: string, l: Lead) {
  return {
    id: l.id,
    org_id: orgId,
    project_id: projectId,
    company: l.company,
    website: l.website,
    public_profile_url: l.publicProfileUrl,
    location: l.location,
    city: l.city,
    state: l.state,
    industry: l.industry,
    phone: l.phone,
    email: l.email,
    score: l.score,
    score_label: l.scoreLabel,
    breakdown: l.breakdown,
    why_it_fits: l.whyItFits,
    need_reason: l.needReason,
    decision_maker: l.decisionMaker,
    decision_maker_name: l.decisionMakerName,
    business_age: l.businessAge,
    verification: l.verification,
    risk_notes: l.riskNotes,
    included_in_report: l.includedInReport,
    status: l.status,
    notes: l.notes,
  };
}

function verificationInserts(orgId: string, leadId: string, l: Lead) {
  return l.evidence.map((e) => ({
    org_id: orgId,
    lead_id: leadId,
    label: e.label,
    detail: e.detail,
    confidence: e.confidence,
    source_url: e.sourceUrl,
    source_label: e.sourceLabel,
  }));
}

function outreachInsert(orgId: string, leadId: string, l: Lead) {
  return {
    org_id: orgId,
    lead_id: leadId,
    hook: l.outreach.hook,
    rationale: l.outreach.rationale,
  };
}

function scoreInsert(orgId: string, leadId: string, l: Lead) {
  const b = l.breakdown;
  return {
    org_id: orgId,
    lead_id: leadId,
    icp_fit: b.icpFit,
    need_signal: b.needSignal,
    verification: b.verification,
    decision_maker: b.decisionMaker,
    outreach_quality: b.outreachQuality,
    contactability: b.contactability,
    risk_penalty: b.riskPenalty,
    total: l.score,
  };
}

// ---------------------------------------------------------------------
// Reads
// ---------------------------------------------------------------------
/** Load the entire org workspace into the in-memory PersistedState shape. */
export async function fetchPersistedState(
  supabase: DB,
  orgId: string
): Promise<PersistedState> {
  const [projectsRes, leadsRes, evidenceRes, outreachRes, exportsRes, reportsRes] =
    await Promise.all([
      supabase.from("projects").select("*").eq("org_id", orgId).order("created_at", { ascending: false }),
      supabase.from("leads").select("*").eq("org_id", orgId),
      supabase.from("lead_verifications").select("*").eq("org_id", orgId),
      supabase.from("outreach_angles").select("*").eq("org_id", orgId).order("created_at", { ascending: true }),
      supabase.from("exports").select("id", { count: "exact", head: true }).eq("org_id", orgId),
      supabase.from("reports").select("id", { count: "exact", head: true }).eq("org_id", orgId),
    ]);

  const projects = (projectsRes.data ?? []).map(rowToProject);

  const evidenceByLead = new Map<string, Lead["evidence"]>();
  for (const e of evidenceRes.data ?? []) {
    const list = evidenceByLead.get(e.lead_id) ?? [];
    list.push({
      label: e.label,
      detail: e.detail,
      confidence: e.confidence as Lead["evidence"][number]["confidence"],
      sourceUrl: e.source_url,
      sourceLabel: e.source_label,
    });
    evidenceByLead.set(e.lead_id, list);
  }

  const outreachByLead = new Map<string, Lead["outreach"]>();
  for (const o of outreachRes.data ?? []) {
    // Keep the latest (rows are ascending, so last write wins).
    outreachByLead.set(o.lead_id, { hook: o.hook, rationale: o.rationale });
  }

  const leads = (leadsRes.data ?? []).map((row) =>
    rowToLead(
      row,
      evidenceByLead.get(row.id) ?? [],
      outreachByLead.get(row.id) ?? { hook: "", rationale: "" }
    )
  );

  return {
    version: STORE_VERSION,
    projects,
    leads,
    meta: {
      exportCount: exportsRes.count ?? 0,
      reportsCreated: reportsRes.count ?? 0,
    },
  };
}

// ---------------------------------------------------------------------
// Writes
// ---------------------------------------------------------------------
/** Insert a project plus its leads and all child rows (evidence/outreach/scores). */
export async function insertProjectWithLeads(
  supabase: DB,
  orgId: string,
  project: Project,
  leads: Lead[]
): Promise<void> {
  await supabase.from("projects").insert(projectInsert(orgId, project));

  if (leads.length === 0) return;

  await supabase.from("leads").insert(leads.map((l) => leadInsert(orgId, project.id, l)));

  const verifications = leads.flatMap((l) => verificationInserts(orgId, l.id, l));
  if (verifications.length) await supabase.from("lead_verifications").insert(verifications);

  const outreach = leads.map((l) => outreachInsert(orgId, l.id, l));
  if (outreach.length) await supabase.from("outreach_angles").insert(outreach);

  const scores = leads.map((l) => scoreInsert(orgId, l.id, l));
  if (scores.length) await supabase.from("lead_scores").insert(scores);
}

export async function updateProjectRow(
  supabase: DB,
  id: string,
  patch: Partial<Project>
): Promise<void> {
  const row: Partial<ProjectRow> = {};
  if (patch.name !== undefined) row.name = patch.name;
  if (patch.status !== undefined) row.status = patch.status;
  if (patch.business !== undefined) row.business = patch.business;
  if (patch.target !== undefined) row.target = patch.target;
  if (patch.signals !== undefined) row.signals = patch.signals;
  if (patch.report !== undefined) row.report = patch.report;
  if (Object.keys(row).length === 0) return;
  await supabase.from("projects").update(row).eq("id", id);
}

export async function updateLeadRow(
  supabase: DB,
  id: string,
  orgId: string,
  patch: Partial<Lead>
): Promise<void> {
  const row: Partial<LeadRow> = {};
  if (patch.status !== undefined) row.status = patch.status;
  if (patch.notes !== undefined) row.notes = patch.notes;
  if (patch.includedInReport !== undefined) row.included_in_report = patch.includedInReport;
  if (patch.score !== undefined) row.score = patch.score;
  if (patch.scoreLabel !== undefined) row.score_label = patch.scoreLabel;
  if (patch.verification !== undefined) row.verification = patch.verification;
  if (patch.breakdown !== undefined) row.breakdown = patch.breakdown;
  if (Object.keys(row).length) {
    await supabase.from("leads").update(row).eq("id", id);
  }

  // Outreach lives in its own table — replace the lead's angle.
  if (patch.outreach !== undefined) {
    await supabase.from("outreach_angles").delete().eq("lead_id", id);
    await supabase.from("outreach_angles").insert({
      org_id: orgId,
      lead_id: id,
      hook: patch.outreach.hook,
      rationale: patch.outreach.rationale,
    });
  }
}

/** Record a CSV export (exports row + usage_event). */
export async function insertExport(
  supabase: DB,
  orgId: string,
  profileId: string | null,
  projectId: string | null,
  rows: number
): Promise<void> {
  if (projectId) {
    await supabase.from("exports").insert({
      org_id: orgId,
      project_id: projectId,
      format: "csv",
      rows,
    });
  }
  await supabase.from("usage_events").insert({
    org_id: orgId,
    profile_id: profileId,
    event_type: "export_csv",
    metadata: { project_id: projectId, rows },
  });
}

/** Record a generated report (reports row + report_leads + usage_event). */
export async function insertReport(
  supabase: DB,
  orgId: string,
  profileId: string | null,
  projectId: string,
  title: string,
  stats: Record<string, unknown>,
  includedLeadIds: string[]
): Promise<void> {
  const { data } = await supabase
    .from("reports")
    .insert({ org_id: orgId, project_id: projectId, title, stats })
    .select("id")
    .single();

  const reportId = data?.id;
  if (reportId && includedLeadIds.length) {
    await supabase.from("report_leads").insert(
      includedLeadIds.map((leadId, i) => ({
        org_id: orgId,
        report_id: reportId,
        lead_id: leadId,
        position: i,
      }))
    );
  }

  await supabase.from("usage_events").insert({
    org_id: orgId,
    profile_id: profileId,
    event_type: "report_generated",
    metadata: { project_id: projectId, lead_count: includedLeadIds.length },
  });
}

/**
 * Bulk-import local demo/work data into the org, remapping local slug ids to
 * fresh uuids so they coexist with anything already in the cloud.
 */
export async function uploadAll(
  supabase: DB,
  orgId: string,
  projects: Project[],
  leads: Lead[]
): Promise<number> {
  for (const project of projects) {
    const newProjectId = crypto.randomUUID();
    const remappedProject: Project = { ...project, id: newProjectId, orgId };
    const projectLeads = leads
      .filter((l) => l.projectId === project.id)
      .map((l) => ({ ...l, id: crypto.randomUUID(), projectId: newProjectId }));
    await insertProjectWithLeads(supabase, orgId, remappedProject, projectLeads);
  }
  return projects.length;
}
