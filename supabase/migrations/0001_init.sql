-- =====================================================================
-- Client Leads HQ — Phase 3A schema
-- Migration 0001: tables, indexes, and the new-user bootstrap trigger.
--
-- Apply via the Supabase SQL editor or the Supabase CLI:
--   supabase db push           (CLI, recommended)
--   or paste this file into Dashboard → SQL Editor → Run
--
-- RLS policies live in 0002_rls.sql — run that immediately after.
-- =====================================================================

create extension if not exists "pgcrypto";

-- ---------------------------------------------------------------------
-- organizations — the account/workspace boundary
-- ---------------------------------------------------------------------
create table if not exists public.organizations (
  id          uuid primary key default gen_random_uuid(),
  name        text not null,
  created_at  timestamptz not null default now()
);

-- ---------------------------------------------------------------------
-- profiles — one per auth user, linked to an organization
-- ---------------------------------------------------------------------
create table if not exists public.profiles (
  id          uuid primary key references auth.users (id) on delete cascade,
  org_id      uuid not null references public.organizations (id) on delete cascade,
  full_name   text not null default '',
  email       text not null default '',
  role        text not null default 'owner' check (role in ('owner', 'member')),
  created_at  timestamptz not null default now()
);
create index if not exists profiles_org_id_idx on public.profiles (org_id);

-- ---------------------------------------------------------------------
-- projects — a saved prospecting campaign
-- (business/target/signals/report kept as jsonb for easy Phase 2↔3 mapping)
-- ---------------------------------------------------------------------
create table if not exists public.projects (
  id          uuid primary key default gen_random_uuid(),
  org_id      uuid not null references public.organizations (id) on delete cascade,
  name        text not null,
  status      text not null default 'Draft'
              check (status in ('Draft', 'Researching', 'Ready', 'Report sent')),
  business    jsonb not null default '{}'::jsonb,
  target      jsonb not null default '{}'::jsonb,
  signals     jsonb not null default '{}'::jsonb,
  report      jsonb not null default '{}'::jsonb,
  created_at  timestamptz not null default now(),
  updated_at  timestamptz not null default now()
);
create index if not exists projects_org_id_idx on public.projects (org_id);

-- ---------------------------------------------------------------------
-- lead_searches — a discovery run tied to a project (Phase 4 will populate)
-- ---------------------------------------------------------------------
create table if not exists public.lead_searches (
  id            uuid primary key default gen_random_uuid(),
  org_id        uuid not null references public.organizations (id) on delete cascade,
  project_id    uuid not null references public.projects (id) on delete cascade,
  query         text not null default '',
  params        jsonb not null default '{}'::jsonb,
  status        text not null default 'pending'
                check (status in ('pending', 'running', 'complete', 'error')),
  result_count  int not null default 0,
  created_at    timestamptz not null default now()
);
create index if not exists lead_searches_project_id_idx on public.lead_searches (project_id);
create index if not exists lead_searches_org_id_idx on public.lead_searches (org_id);

-- ---------------------------------------------------------------------
-- leads — a candidate prospect
-- ---------------------------------------------------------------------
create table if not exists public.leads (
  id                  uuid primary key default gen_random_uuid(),
  org_id              uuid not null references public.organizations (id) on delete cascade,
  project_id          uuid not null references public.projects (id) on delete cascade,
  search_id           uuid references public.lead_searches (id) on delete set null,
  company             text not null default '',
  website             text not null default '',
  public_profile_url  text not null default '',
  location            text not null default '',
  city                text not null default '',
  state               text not null default '',
  industry            text not null default '',
  phone               text not null default '',
  email               text,
  score               int not null default 0 check (score between 0 and 100),
  score_label         text not null default 'Review'
                      check (score_label in ('Excellent', 'Strong', 'Review', 'Weak', 'Remove')),
  breakdown           jsonb not null default '{}'::jsonb,
  why_it_fits         text not null default '',
  need_reason         text not null default '',
  decision_maker      text not null default 'Unknown',
  decision_maker_name text,
  business_age        text not null default 'Unknown',
  verification        text not null default 'Unknown'
                      check (verification in ('Verified', 'Estimated', 'Inferred', 'Unknown')),
  risk_notes          text not null default '',
  included_in_report  boolean not null default false,
  status              text not null default 'Open'
                      check (status in ('Open', 'Approved', 'Passed')),
  notes               text not null default '',
  created_at          timestamptz not null default now(),
  updated_at          timestamptz not null default now()
);
create index if not exists leads_project_id_idx on public.leads (project_id);
create index if not exists leads_org_id_idx on public.leads (org_id);

-- ---------------------------------------------------------------------
-- lead_verifications — evidence items behind a lead (the trust principle)
-- ---------------------------------------------------------------------
create table if not exists public.lead_verifications (
  id            uuid primary key default gen_random_uuid(),
  org_id        uuid not null references public.organizations (id) on delete cascade,
  lead_id       uuid not null references public.leads (id) on delete cascade,
  label         text not null default '',
  detail        text not null default '',
  confidence    text not null default 'Inferred'
                check (confidence in ('Confirmed', 'Estimated', 'Inferred')),
  source_url    text not null default '',
  source_label  text not null default '',
  created_at    timestamptz not null default now()
);
create index if not exists lead_verifications_lead_id_idx on public.lead_verifications (lead_id);
create index if not exists lead_verifications_org_id_idx on public.lead_verifications (org_id);

-- ---------------------------------------------------------------------
-- lead_scores — per-dimension score breakdown (also supports score history)
-- ---------------------------------------------------------------------
create table if not exists public.lead_scores (
  id                uuid primary key default gen_random_uuid(),
  org_id            uuid not null references public.organizations (id) on delete cascade,
  lead_id           uuid not null references public.leads (id) on delete cascade,
  icp_fit           int not null default 0,
  need_signal       int not null default 0,
  verification      int not null default 0,
  decision_maker    int not null default 0,
  outreach_quality  int not null default 0,
  contactability    int not null default 0,
  risk_penalty      int not null default 0,
  total             int not null default 0,
  created_at        timestamptz not null default now()
);
create index if not exists lead_scores_lead_id_idx on public.lead_scores (lead_id);
create index if not exists lead_scores_org_id_idx on public.lead_scores (org_id);

-- ---------------------------------------------------------------------
-- outreach_angles — suggested outreach hook(s) per lead
-- ---------------------------------------------------------------------
create table if not exists public.outreach_angles (
  id          uuid primary key default gen_random_uuid(),
  org_id      uuid not null references public.organizations (id) on delete cascade,
  lead_id     uuid not null references public.leads (id) on delete cascade,
  hook        text not null default '',
  rationale   text not null default '',
  created_at  timestamptz not null default now()
);
create index if not exists outreach_angles_lead_id_idx on public.outreach_angles (lead_id);
create index if not exists outreach_angles_org_id_idx on public.outreach_angles (org_id);

-- ---------------------------------------------------------------------
-- reports — a generated prospecting report (snapshot of stats)
-- ---------------------------------------------------------------------
create table if not exists public.reports (
  id            uuid primary key default gen_random_uuid(),
  org_id        uuid not null references public.organizations (id) on delete cascade,
  project_id    uuid not null references public.projects (id) on delete cascade,
  title         text not null default '',
  stats         jsonb not null default '{}'::jsonb,
  generated_at  timestamptz not null default now()
);
create index if not exists reports_project_id_idx on public.reports (project_id);
create index if not exists reports_org_id_idx on public.reports (org_id);

-- ---------------------------------------------------------------------
-- report_leads — which leads were included in a report, and in what order
-- ---------------------------------------------------------------------
create table if not exists public.report_leads (
  id          uuid primary key default gen_random_uuid(),
  org_id      uuid not null references public.organizations (id) on delete cascade,
  report_id   uuid not null references public.reports (id) on delete cascade,
  lead_id     uuid not null references public.leads (id) on delete cascade,
  position    int not null default 0,
  created_at  timestamptz not null default now()
);
create index if not exists report_leads_report_id_idx on public.report_leads (report_id);
create index if not exists report_leads_org_id_idx on public.report_leads (org_id);

-- ---------------------------------------------------------------------
-- exports — a record of a CSV export
-- ---------------------------------------------------------------------
create table if not exists public.exports (
  id          uuid primary key default gen_random_uuid(),
  org_id      uuid not null references public.organizations (id) on delete cascade,
  project_id  uuid not null references public.projects (id) on delete cascade,
  format      text not null default 'csv' check (format in ('csv')),
  rows        int not null default 0,
  created_at  timestamptz not null default now()
);
create index if not exists exports_project_id_idx on public.exports (project_id);
create index if not exists exports_org_id_idx on public.exports (org_id);

-- ---------------------------------------------------------------------
-- usage_events — lightweight usage/analytics log
-- ---------------------------------------------------------------------
create table if not exists public.usage_events (
  id          uuid primary key default gen_random_uuid(),
  org_id      uuid not null references public.organizations (id) on delete cascade,
  profile_id  uuid references public.profiles (id) on delete set null,
  event_type  text not null,
  metadata    jsonb not null default '{}'::jsonb,
  created_at  timestamptz not null default now()
);
create index if not exists usage_events_org_id_idx on public.usage_events (org_id);

-- =====================================================================
-- New-user bootstrap: create an organization + owner profile on sign-up.
-- SECURITY DEFINER so it can write to public tables under RLS.
-- =====================================================================
create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
declare
  new_org_id uuid;
begin
  insert into public.organizations (name)
  values (
    coalesce(
      nullif(new.raw_user_meta_data ->> 'org_name', ''),
      split_part(new.email, '@', 1) || '''s workspace'
    )
  )
  returning id into new_org_id;

  insert into public.profiles (id, org_id, full_name, email, role)
  values (
    new.id,
    new_org_id,
    coalesce(new.raw_user_meta_data ->> 'full_name', ''),
    coalesce(new.email, ''),
    'owner'
  );

  return new;
end;
$$;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute function public.handle_new_user();

-- ---------------------------------------------------------------------
-- updated_at maintenance
-- ---------------------------------------------------------------------
create or replace function public.set_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

drop trigger if exists projects_set_updated_at on public.projects;
create trigger projects_set_updated_at
  before update on public.projects
  for each row execute function public.set_updated_at();

drop trigger if exists leads_set_updated_at on public.leads;
create trigger leads_set_updated_at
  before update on public.leads
  for each row execute function public.set_updated_at();
