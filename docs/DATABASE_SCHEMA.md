# Database Schema (Supabase)

The TypeScript source of truth for the app's runtime types is `lib/types.ts`.
The **SQL source of truth** is `supabase/migrations/` — this doc describes those
tables. Phase 3A ships the schema, RLS, and auth; the app UI still reads/writes
`localStorage` until Phase 3B wires the store to these tables.

Implemented in:

- `supabase/migrations/0001_init.sql` — tables, indexes, signup trigger
- `supabase/migrations/0002_rls.sql` — RLS + org-scoped policies
- `supabase/seed.sql` — optional demo rows

## Entity relationships

```
auth.users    1───1 profiles
organizations 1───* profiles
organizations 1───* projects
projects      1───* lead_searches
projects      1───* leads          (a lead may also point at a lead_search)
leads         1───* lead_verifications
leads         1───* lead_scores
leads         1───* outreach_angles
projects      1───* reports
reports       1───* report_leads ───* leads
projects      1───* exports
organizations 1───* usage_events
```

Every app table carries `org_id` (denormalized where needed) so RLS policies are
simple and index-friendly: access is granted only when
`org_id = public.current_org_id()`.

## Tables

### organizations
| column | type | notes |
| --- | --- | --- |
| id | uuid (pk) | |
| name | text | |
| created_at | timestamptz | |

### profiles
| column | type | notes |
| --- | --- | --- |
| id | uuid (pk) | references `auth.users(id)` |
| org_id | uuid (fk → organizations) | |
| full_name | text | |
| email | text | |
| role | text | `owner` \| `member` |
| created_at | timestamptz | |

> Created automatically by the `handle_new_user` trigger on sign-up (with a new
> organization). `lib/supabase/bootstrap.ts` is an idempotent fallback.

### projects
| column | type | notes |
| --- | --- | --- |
| id | uuid (pk) | |
| org_id | uuid (fk) | |
| name | text | |
| status | text | `Draft` \| `Researching` \| `Ready` \| `Report sent` |
| business | jsonb | `{ businessName, website, industry, location }` |
| target | jsonb | `{ description, idealIndustries[], companySize, geography }` |
| signals | jsonb | `{ idealSignals[], badFitSignals[], services[] }` |
| report | jsonb | `{ reportName, goal, leadsDesired }` |
| created_at / updated_at | timestamptz | `updated_at` maintained by trigger |

### lead_searches
A discovery run tied to a project (populated by the Phase 4 lead-discovery API).

| column | type | notes |
| --- | --- | --- |
| id | uuid (pk) | |
| org_id | uuid (fk) | |
| project_id | uuid (fk) | |
| query | text | |
| params | jsonb | provider params snapshot |
| status | text | `pending` \| `running` \| `complete` \| `error` |
| result_count | int | |
| created_at | timestamptz | |

### leads
| column | type | notes |
| --- | --- | --- |
| id | uuid (pk) | |
| org_id | uuid (fk) | |
| project_id | uuid (fk) | |
| search_id | uuid null (fk → lead_searches) | source run, if any |
| company, website, public_profile_url | text | |
| location, city, state, industry | text | |
| phone | text | |
| email | text null | |
| score | int | 0–100 |
| score_label | text | `Excellent` \| `Strong` \| `Review` \| `Weak` \| `Remove` |
| breakdown | jsonb | `ScoreBreakdown` (mirrors lib/types) |
| why_it_fits, need_reason | text | |
| decision_maker | text | enum, see types |
| decision_maker_name | text null | |
| business_age | text | enum |
| verification | text | `Verified` \| `Estimated` \| `Inferred` \| `Unknown` |
| risk_notes | text | |
| included_in_report | bool | |
| status | text | `Open` \| `Approved` \| `Passed` |
| notes | text | user's private note |
| created_at / updated_at | timestamptz | `updated_at` maintained by trigger |

### lead_verifications
The evidence behind a lead (the trust principle). One row per evidence item.

| column | type | notes |
| --- | --- | --- |
| id | uuid (pk) | |
| org_id | uuid (fk) | |
| lead_id | uuid (fk) | |
| label, detail | text | |
| confidence | text | `Confirmed` \| `Estimated` \| `Inferred` |
| source_url, source_label | text | |
| created_at | timestamptz | |

### lead_scores
Per-dimension breakdown (also supports score history — multiple rows per lead).

| column | type | notes |
| --- | --- | --- |
| id | uuid (pk) | |
| org_id | uuid (fk) | |
| lead_id | uuid (fk) | |
| icp_fit, need_signal, verification, decision_maker, outreach_quality, contactability, risk_penalty | int | the `ScoreBreakdown` dimensions |
| total | int | 0–100 |
| created_at | timestamptz | |

### outreach_angles
| column | type | notes |
| --- | --- | --- |
| id | uuid (pk) | |
| org_id | uuid (fk) | |
| lead_id | uuid (fk) | |
| hook | text | |
| rationale | text | |
| created_at | timestamptz | |

### reports
| column | type | notes |
| --- | --- | --- |
| id | uuid (pk) | |
| org_id | uuid (fk) | |
| project_id | uuid (fk) | |
| title | text | |
| stats | jsonb | `{ totalReviewed, strongLeads, averageScore, verifiedCount }` |
| generated_at | timestamptz | |

### report_leads
Which leads were included in a report snapshot, and in what order.

| column | type | notes |
| --- | --- | --- |
| id | uuid (pk) | |
| org_id | uuid (fk) | |
| report_id | uuid (fk) | |
| lead_id | uuid (fk) | |
| position | int | ordering |
| created_at | timestamptz | |

### exports
| column | type | notes |
| --- | --- | --- |
| id | uuid (pk) | |
| org_id | uuid (fk) | |
| project_id | uuid (fk) | |
| format | text | `csv` |
| rows | int | |
| created_at | timestamptz | |

### usage_events
Lightweight usage/analytics log (CSV exported, report generated, etc.).

| column | type | notes |
| --- | --- | --- |
| id | uuid (pk) | |
| org_id | uuid (fk) | |
| profile_id | uuid null (fk → profiles) | actor |
| event_type | text | |
| metadata | jsonb | |
| created_at | timestamptz | |

## Row-Level Security

RLS is **enabled on every table**, default-deny, scoped to the caller's org via
the `public.current_org_id()` helper (reads the caller's `profiles.org_id`).
Policies grant `authenticated` users full CRUD on rows where
`org_id = current_org_id()`. `profiles` additionally lets a user see peers in
their org but edit only their own row. There are **no public/unrestricted
policies**, and the `service_role` key (which bypasses RLS) is server-only.

## Mapping note (Phase 3B)

`lib/types.ts` keeps `evidence[]`, `breakdown`, and `outreach` embedded on the
`Lead` object. When the store is wired to Supabase (Phase 3B), those map to
`lead_verifications`, `lead_scores`/`leads.breakdown`, and `outreach_angles`
respectively. The jsonb columns (`breakdown`, `business/target/signals/report`,
`stats`) keep the Phase 2↔3 migration low-risk.
