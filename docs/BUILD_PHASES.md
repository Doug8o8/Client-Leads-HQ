# Build Phases

## Phase 1 — Static polished MVP ✅

Beautiful, working app with clean architecture and zero external dependencies.

- UI shell, landing, dashboard, wizard, command center, lead review, report
  builder, polished HTML report, CSV export, docs.
- Local mock data (Texas life-insurance scenario), reusable scoring + CSV.
- Server-rendered from static mock arrays. Typecheck / lint / build green.

## Phase 2A — Local interactive persistence ✅ (this build)

Make the app feel real on localhost — still no backend.

- localStorage-backed store (`lib/store/*`) seeded from the mock data, consumed
  via `useSyncExternalStore` hooks. Graceful fallback when storage is
  unavailable; safe against hydration mismatches.
- The new-project wizard actually creates and persists a project (with a slug
  id and seeded starter leads) and routes to it.
- Lead interactions persist: include/remove, review status, notes, outreach edits.
- Report builder + report reflect saved selections; CSV exports the current
  included leads. "Demo Mode" indicator + reset-demo action in settings.
- Theme-ready styling via CSS variables + a dark/light toggle (report stays
  ivory). Empty states, loading states, and a missing-project fallback.

## Phase 3 — Supabase persistence + auth

- Add Supabase (Postgres + Auth). Implement the schema in `DATABASE_SCHEMA.md`.
- Swap the `lib/store/store.ts` localStorage internals for Supabase queries
  (the hooks in `lib/store/useStore.ts` and the whole UI stay untouched).
- Projects/leads persist server-side; Row-Level Security scoped by `org_id`.

## Phase 4 — Real lead discovery APIs

- Google Places API (+ a web-search provider) to discover candidates from the
  project's target + geography. Normalize into the `Lead` shape.
- See `FUTURE_API_WORKFLOWS.md` for the intended pipeline + prompt placeholders.

## Phase 5 — AI scoring + source verification

- Score each dimension from real signals (heuristics and/or an LLM) feeding the
  existing `scoreFromBreakdown` pipeline.
- Real source verification: fetch/confirm facts and assign honest confidence
  (`Confirmed` / `Estimated` / `Inferred`). Preserve the trust principle.

## Phase 6 — PDF + monetization + scale

- HTML-to-PDF generation and report version history (see `FUTURE_API_WORKFLOWS.md`).
- Stripe billing, plans, usage limits, team seats.
- Saved/scheduled reports, shareable report links, branded report themes.
- Background jobs for sourcing/scoring; rate limiting and caching.

## Guiding constraints across phases

- Keep the report a flagship deliverable; never let it regress to a raw export.
- Keep confirmed facts visibly distinct from estimates and inferences.
- Keep `lib/` (types, scoring, csv, aggregates, store) as the stable seam
  between UI and whatever backend powers it.
