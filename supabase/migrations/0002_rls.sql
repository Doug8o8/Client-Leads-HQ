-- =====================================================================
-- Client Leads HQ — Phase 3A Row Level Security
-- Migration 0002: enable RLS on every app table and scope all access to
-- the caller's organization. No public/unrestricted policies.
--
-- Run AFTER 0001_init.sql.
-- =====================================================================

-- ---------------------------------------------------------------------
-- Helper: the org_id of the currently authenticated user.
-- SECURITY DEFINER so it can read profiles regardless of the caller's
-- own RLS, and STABLE so the planner can cache it per statement.
-- ---------------------------------------------------------------------
create or replace function public.current_org_id()
returns uuid
language sql
stable
security definer
set search_path = public
as $$
  select org_id from public.profiles where id = auth.uid()
$$;

-- =====================================================================
-- Enable RLS everywhere (default-deny once enabled).
-- =====================================================================
alter table public.organizations      enable row level security;
alter table public.profiles           enable row level security;
alter table public.projects           enable row level security;
alter table public.lead_searches      enable row level security;
alter table public.leads              enable row level security;
alter table public.lead_verifications enable row level security;
alter table public.lead_scores        enable row level security;
alter table public.outreach_angles    enable row level security;
alter table public.reports            enable row level security;
alter table public.report_leads       enable row level security;
alter table public.exports            enable row level security;
alter table public.usage_events       enable row level security;

-- =====================================================================
-- organizations — a user sees/edits only their own org.
-- =====================================================================
drop policy if exists organizations_select on public.organizations;
create policy organizations_select on public.organizations
  for select to authenticated
  using (id = public.current_org_id());

drop policy if exists organizations_update on public.organizations;
create policy organizations_update on public.organizations
  for update to authenticated
  using (id = public.current_org_id())
  with check (id = public.current_org_id());

-- Inserts happen via the SECURITY DEFINER signup trigger and the
-- bootstrap fallback; allow an authenticated user to create an org.
drop policy if exists organizations_insert on public.organizations;
create policy organizations_insert on public.organizations
  for insert to authenticated
  with check (true);

-- =====================================================================
-- profiles — a user sees their own row and others in their org;
-- can only modify their own row.
-- =====================================================================
drop policy if exists profiles_select on public.profiles;
create policy profiles_select on public.profiles
  for select to authenticated
  using (id = auth.uid() or org_id = public.current_org_id());

drop policy if exists profiles_insert on public.profiles;
create policy profiles_insert on public.profiles
  for insert to authenticated
  with check (id = auth.uid());

drop policy if exists profiles_update on public.profiles;
create policy profiles_update on public.profiles
  for update to authenticated
  using (id = auth.uid())
  with check (id = auth.uid());

-- =====================================================================
-- Org-scoped tables — identical pattern: full CRUD within your org.
-- =====================================================================
-- projects
drop policy if exists projects_all on public.projects;
create policy projects_all on public.projects
  for all to authenticated
  using (org_id = public.current_org_id())
  with check (org_id = public.current_org_id());

-- lead_searches
drop policy if exists lead_searches_all on public.lead_searches;
create policy lead_searches_all on public.lead_searches
  for all to authenticated
  using (org_id = public.current_org_id())
  with check (org_id = public.current_org_id());

-- leads
drop policy if exists leads_all on public.leads;
create policy leads_all on public.leads
  for all to authenticated
  using (org_id = public.current_org_id())
  with check (org_id = public.current_org_id());

-- lead_verifications
drop policy if exists lead_verifications_all on public.lead_verifications;
create policy lead_verifications_all on public.lead_verifications
  for all to authenticated
  using (org_id = public.current_org_id())
  with check (org_id = public.current_org_id());

-- lead_scores
drop policy if exists lead_scores_all on public.lead_scores;
create policy lead_scores_all on public.lead_scores
  for all to authenticated
  using (org_id = public.current_org_id())
  with check (org_id = public.current_org_id());

-- outreach_angles
drop policy if exists outreach_angles_all on public.outreach_angles;
create policy outreach_angles_all on public.outreach_angles
  for all to authenticated
  using (org_id = public.current_org_id())
  with check (org_id = public.current_org_id());

-- reports
drop policy if exists reports_all on public.reports;
create policy reports_all on public.reports
  for all to authenticated
  using (org_id = public.current_org_id())
  with check (org_id = public.current_org_id());

-- report_leads
drop policy if exists report_leads_all on public.report_leads;
create policy report_leads_all on public.report_leads
  for all to authenticated
  using (org_id = public.current_org_id())
  with check (org_id = public.current_org_id());

-- exports
drop policy if exists exports_all on public.exports;
create policy exports_all on public.exports
  for all to authenticated
  using (org_id = public.current_org_id())
  with check (org_id = public.current_org_id());

-- usage_events
drop policy if exists usage_events_all on public.usage_events;
create policy usage_events_all on public.usage_events
  for all to authenticated
  using (org_id = public.current_org_id())
  with check (org_id = public.current_org_id());
