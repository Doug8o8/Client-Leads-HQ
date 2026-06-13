# Client Leads HQ — CLHQ

**Find better local business leads. Score them. Verify them. Turn them into
polished prospecting reports.**

An AI-powered local prospecting command center for service businesses. Describe
who you are and who you want to reach; CLHQ helps you find local leads, score
them out of 100, verify the sources behind each one, curate a shortlist, and
generate a premium, print-ready prospecting report.

This is **not** a CRM — no pipelines, sequences, or inboxes. It's a research and
reporting tool. It runs in **two modes**:

- **Local Demo Mode** (default) — no env vars, no database. Everything persists
  in the browser via `localStorage`. Deploys to Vercel as-is.
- **Supabase Mode** — set the Supabase env vars to enable authentication and
  (in Phase 3B) cloud persistence. The app never crashes when they're missing.

## Quick start

```bash
npm install
npm run dev
# http://localhost:3000
```

Then explore:

- `/` — landing
- `/app` — dashboard (command center)
- `/app/projects/new` — intake wizard
- `/app/projects/proj_lonestar` — project command center
- `/app/projects/proj_lonestar/leads` — lead review + evidence drawer
- `/app/projects/proj_lonestar/report` — report builder
- `/reports/proj_lonestar` — the flagship printable report

## Scripts

```bash
npm run dev | build | start | typecheck | lint
```

## Local demo persistence (Phase 2A)

The app is fully interactive on localhost with **no backend** — state is saved
in your browser via `localStorage`:

- On first load, the store seeds itself from the mock data (the Texas
  life-insurance scenario).
- Creating a project, toggling leads in/out of the report, changing a lead's
  review status, editing the outreach angle, and writing notes all **persist**.
- The report and CSV export always reflect your current included leads.
- **Settings → Reset demo data** restores the original seed and clears your
  local edits.
- If `localStorage` is unavailable (private mode, etc.), the app degrades
  gracefully to in-memory state for the session.

The persistence layer lives in `lib/store/` and is intentionally isolated so its
internals can be swapped for Supabase in Phase 3B without touching the UI.

## Supabase Mode (Phase 3A foundation)

The backend foundation is in place — auth, schema, and RLS — without disturbing
the local demo. To enable it:

1. Create a Supabase project and run the SQL in `supabase/migrations/`
   (`0001_init.sql`, then `0002_rls.sql`). See `supabase/README.md`.
2. Copy `.env.example` → `.env.local` and set:

   ```
   NEXT_PUBLIC_SUPABASE_URL=        # required for Supabase Mode
   NEXT_PUBLIC_SUPABASE_ANON_KEY=   # required for Supabase Mode
   SUPABASE_SERVICE_ROLE_KEY=       # optional — server-only seed/admin scripts
   ```

3. Restart `npm run dev`, then visit `/auth/sign-up`. An organization + profile
   are created automatically on first sign-up (Postgres trigger).

With **no** Supabase env vars the app stays in Local Demo Mode — auth pages
still render (showing a "no account needed" card), and nothing breaks. The
Settings page always shows the current mode, connection, and auth status.

> **Phase 3A** = auth + schema + RLS foundation. **Phase 3B** wires the store to
> Supabase so projects/leads/reports persist server-side. See
> `docs/BUILD_PHASES.md`.

## Light & dark themes

A **light premium executive theme is the default** — a soft **baby-blue**
canvas with deep-navy text, muted gold and subtle blue accents, white cards,
soft borders, and refined shadows. The **dark command-center theme** remains available via the
toggle in the sidebar (and Settings); it shows a sun icon on light, a moon icon on
dark. Styling is CSS-variable driven (including theme-aware accent + badge
tokens), so both modes stay high-contrast and premium. The **report is always
ivory**.

## Project structure

```
app/                 # Next.js App Router routes (app shell + ivory report)
  auth/              # sign-in / sign-up / callback / sign-out (Supabase Mode)
components/
  app/               # command-center UI (shell, charts, leads explorer, wizard)
  auth/              # AuthForm (email + password, demo-aware)
  report/            # ivory report UI (cover, charts, lead cards, primitives)
  ui/                # shared primitives (badges, buttons, panels)
  ThemeToggle.tsx    # dark/light theme switch
lib/
  types.ts           # data models (Supabase-ready)
  scoring.ts         # reusable 0–100 scoring logic + label/verification defs
  aggregates.ts      # pure derivation helpers (distributions, dashboard stats)
  csv.ts             # reusable CSV export utility
  theme.ts           # theme tokens + no-flash apply
  mock-data.ts       # isolated demo seed data (clearly marked)
  store/             # local persistence seam (swap for Supabase in 3B)
    persisted.ts     #   persisted shape + seed + id/slug helpers
    storage.ts       #   safe localStorage access
    store.ts         #   store singleton + mutations (createProject, updateLead…)
    useStore.ts      #   React hooks (useSyncExternalStore)
  supabase/          # Supabase clients + app-mode detection (Phase 3A)
    env.ts           #   env vars + getAppMode() (local-demo | supabase)
    client.ts        #   browser client (null when unconfigured)
    server.ts        #   server client for the App Router
    useSession.ts    #   client session hook
    bootstrap.ts     #   idempotent org/profile bootstrap fallback
supabase/            # SQL migrations, RLS policies, seed (Phase 3A)
  migrations/        #   0001_init.sql, 0002_rls.sql
  seed.sql           #   optional demo rows
docs/                # PRODUCT_SPEC, MVP_SCOPE, DATABASE_SCHEMA, LEAD_SCORING,
                     # BUILD_PHASES, DEPLOYMENT, FUTURE_API_WORKFLOWS
```

## The trust principle

> Never pitch on a guess you thought was a fact.

Confirmed facts, estimates, and AI inferences are always visually distinct — in
the lead drawer, the verification charts, and the report. See `docs/` for the
full spec and roadmap.
