-- =====================================================================
-- Client Leads HQ — demo seed (OPTIONAL)
-- =====================================================================
-- This seeds a standalone demo organization + project + a couple of leads
-- so you can verify the schema and RLS in the Supabase dashboard. It does
-- NOT attach to an auth user (that link is created by the signup trigger).
--
-- HOW TO RUN
--   • Dashboard → SQL Editor → paste & Run (runs as the service role, so
--     it bypasses RLS — fine for seeding).
--   • Or `supabase db reset` will auto-run this after migrations (CLI).
--
-- To attach this org to YOUR signed-up user instead, after signing up run:
--   update public.profiles
--     set org_id = '00000000-0000-0000-0000-000000000001'
--     where id = auth.uid();
--
-- Phase 3B will replace this with a richer TypeScript seed that mirrors
-- lib/mock-data.ts exactly. Keep this minimal for now.
-- =====================================================================

insert into public.organizations (id, name)
values ('00000000-0000-0000-0000-000000000001', 'Lone Star Legacy Insurance')
on conflict (id) do nothing;

insert into public.projects (id, org_id, name, status, business, target, signals, report)
values (
  '00000000-0000-0000-0000-0000000000a1',
  '00000000-0000-0000-0000-000000000001',
  'Dallas–Fort Worth — Life insurance',
  'Ready',
  '{"businessName":"Lone Star Legacy Insurance","website":"lonestarlegacy.example","industry":"Life insurance","location":"Dallas, TX"}'::jsonb,
  '{"description":"Established local businesses whose owners need key-person / buy-sell coverage","idealIndustries":["Construction","Auto repair","Restaurants"],"companySize":"5–50 employees","geography":"Dallas–Fort Worth, TX"}'::jsonb,
  '{"idealSignals":["Owner-operated","5+ years in business"],"badFitSignals":["Franchise","National chain"],"services":["Term life","Buy-sell funding"]}'::jsonb,
  '{"reportName":"DFW Life Insurance Prospects","goal":"Book 10 discovery calls","leadsDesired":25}'::jsonb
)
on conflict (id) do nothing;

insert into public.leads
  (id, org_id, project_id, company, website, location, city, state, industry,
   phone, email, score, score_label, why_it_fits, need_reason, verification, status, included_in_report)
values
  ('00000000-0000-0000-0000-0000000000b1',
   '00000000-0000-0000-0000-000000000001',
   '00000000-0000-0000-0000-0000000000a1',
   'Bluebonnet Auto Repair', 'bluebonnetauto.example', 'Arlington, TX', 'Arlington', 'TX', 'Auto repair',
   '(817) 555-0142', null, 84, 'Strong',
   'Owner-operated shop, 12 years in business — classic buy-sell candidate.',
   'No succession plan signal found; aging owner profile.', 'Estimated', 'Approved', true),
  ('00000000-0000-0000-0000-0000000000b2',
   '00000000-0000-0000-0000-000000000001',
   '00000000-0000-0000-0000-0000000000a1',
   'Trinity Craft Builders', 'trinitycraft.example', 'Fort Worth, TX', 'Fort Worth', 'TX', 'Construction',
   '(682) 555-0199', null, 78, 'Strong',
   'Two principals, growing headcount — key-person exposure.',
   'Recent hiring suggests revenue concentration on owners.', 'Inferred', 'Open', true)
on conflict (id) do nothing;
