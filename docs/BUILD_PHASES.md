# Build Phases

## Phase 1 — Premium MVP on mock data ✅ (this build)

Beautiful, working app with clean architecture and zero external dependencies.

- UI shell, landing, dashboard, wizard, command center, lead review, report
  builder, polished HTML report, CSV export, docs.
- Local mock data (Texas life-insurance scenario), reusable scoring + CSV.
- Typecheck / lint / build green. Vercel-safe.

## Phase 2 — Supabase persistence + auth

- Add Supabase (Postgres + Auth). Implement the schema in `DATABASE_SCHEMA.md`.
- Swap `lib/data.ts` mock reads for Supabase queries (UI untouched).
- Real projects persist; the wizard writes a row and routes to the new project.
- Row-Level Security scoped by `org_id`.
- Recommended starting prompt is in the project README / handoff.

## Phase 3 — Real lead sourcing

- Integrate Google Places API (+ a web-search provider) to discover candidate
  businesses from the project's target + geography.
- Normalize results into the `leads` shape with raw signals attached.

## Phase 4 — AI scoring + source verification

- Score each dimension from real signals (heuristics and/or an LLM) feeding the
  existing `scoreFromBreakdown` pipeline.
- Real source verification: fetch/confirm facts and assign honest confidence
  (`Confirmed` / `Estimated` / `Inferred`). Preserve the trust principle.

## Phase 5 — Monetization + scale

- Stripe billing, plans, usage limits, team seats.
- Saved/scheduled reports, shareable report links, branded report themes.
- Background jobs for sourcing/scoring; rate limiting and caching.

## Guiding constraints across phases

- Keep the report a flagship deliverable; never let it regress to a raw export.
- Keep confirmed facts visibly distinct from estimates and inferences.
- Keep `lib/` (types, scoring, csv, data) as the stable seam between UI and
  whatever backend powers it.
