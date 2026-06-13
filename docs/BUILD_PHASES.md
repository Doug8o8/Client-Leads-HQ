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

## Phase 2B — Theme polish ✅

- Light premium executive mode background moved from porcelain white to a soft
  **baby-blue** canvas (`app/globals.css` light `--app-bg`). White cards now sit
  on a cool blue wash. Dark mode + ivory report unchanged.

## Phase 3A — Supabase Auth + Database Foundation ✅ (this build)

The backend foundation — added carefully so Local Demo Mode still works with no
env vars.

- **Supabase clients** (`lib/supabase/`): browser (`client.ts`), server
  (`server.ts`), env/mode detection (`env.ts`), session hook (`useSession.ts`),
  bootstrap fallback (`bootstrap.ts`). Every entry point returns `null` when
  Supabase isn't configured, so the app falls back to localStorage.
- **Migrations** (`supabase/migrations/`): all app tables — `organizations`,
  `profiles`, `projects`, `lead_searches`, `leads`, `lead_verifications`,
  `lead_scores`, `outreach_angles`, `reports`, `report_leads`, `exports`,
  `usage_events` — plus a `handle_new_user` trigger and `updated_at` triggers.
- **Row Level Security** enabled on every table, scoped to the caller's org via
  `public.current_org_id()`. No public/unrestricted policies.
- **Auth pages** (`/auth/sign-in`, `/auth/sign-up`, `/auth/callback`,
  `/auth/sign-out`) in the premium ivory / baby-blue / navy style. Email +
  password. In Local Demo Mode they render an honest "no account needed" card.
- **Org/profile bootstrap** on sign-up via DB trigger (idempotent server-side
  fallback in `bootstrap.ts`).
- **App-mode awareness**: `getAppMode()` → `local-demo` | `supabase`. Settings
  shows app mode, Supabase connection, auth status, and storage status; the app
  shell badge reflects the mode.
- **Seed**: `supabase/seed.sql` + documented manual seed path.

> Local Demo Mode is unchanged: with no env vars the app behaves exactly as in
> Phase 2A/2B — projects, leads, edits, CSV export, theme toggle, and the report
> all work from localStorage with no login.

## Phase 3B — Supabase persistence (data sync)

- Swap `lib/store/store.ts` internals for Supabase queries **when in Supabase
  Mode** (the hooks in `lib/store/useStore.ts` and the whole UI stay untouched);
  keep the localStorage path for Local Demo Mode.
- Projects/leads/reports/exports persist server-side under RLS by `org_id`.
- Replace `supabase/seed.sql` with a TypeScript seed mirroring `lib/mock-data.ts`.
- Migrate a browser's existing localStorage data into Supabase on first sign-in.

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
