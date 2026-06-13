# MVP Scope — Phase 1

Phase 1 is a **beautiful, working app on local mock data** with clean,
Supabase-ready architecture. It runs locally and deploys to Vercel immediately,
with no API keys required.

## In scope (Phase 1)

- ✅ Premium dark command-center UI shell
- ✅ Landing page
- ✅ Dashboard (projects, totals, strong leads, reports, exports, CTA)
- ✅ New project intake wizard (4 steps)
- ✅ Project command center (summary, status cards, distributions, strongest/removed)
- ✅ Lead review experience (table/card toggle, search, filters, sortable score,
  include/remove toggle, lead detail drawer with score breakdown + evidence audit)
- ✅ Report builder (included/excluded, stats, generate, CSV)
- ✅ Polished, print-ready HTML report (the flagship)
- ✅ CSV export utility (reusable)
- ✅ Reusable scoring logic (out of 100)
- ✅ Realistic mock data (clearly marked demo)
- ✅ Settings placeholder
- ✅ Typecheck + lint + production build pass
- ✅ Docs in `/docs`

## Explicitly NOT in scope (Phase 1)

- ❌ Supabase / any database persistence
- ❌ Authentication (no existing auth to preserve)
- ❌ Stripe / billing
- ❌ Real web search, Google Places, Maps/LinkedIn scraping
- ❌ Real AI / API calls
- ❌ Real source verification
- ❌ Sales pipelines, deal stages, email sequences, inbox sync, task management,
  cold email sending
- ❌ Complex admin dashboards

## Mock-data rules

- Mock data must feel like a **real** prospecting report for a local service
  business (Texas life-insurance scenario).
- Mock sources are **visibly demo data** (`*.example.com`, "(demo)" labels, and a
  "Demo data notice" in the report). We never fabricate citations that pretend to
  be real sources.

## Architecture guardrails

- Data access goes through `lib/data.ts` so a real backend can be swapped in
  without touching UI.
- Types live in `lib/types.ts`; scoring in `lib/scoring.ts`; CSV in `lib/csv.ts`;
  mock data isolated in `lib/mock-data.ts`.
- Components are modular and grouped (`components/app`, `components/report`,
  `components/ui`).
- No external image assets that can break; all graphics are HTML/CSS/SVG.

## Definition of done

`npm run typecheck`, `npm run lint`, and `npm run build` all pass; every route
returns 200; the report looks premium both on screen and when printed to PDF.
