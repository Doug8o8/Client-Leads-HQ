# Client Leads HQ — CLHQ

**Find better local business leads. Score them. Verify them. Turn them into
polished prospecting reports.**

An AI-powered local prospecting command center for service businesses. Describe
who you are and who you want to reach; CLHQ helps you find local leads, score
them out of 100, verify the sources behind each one, curate a shortlist, and
generate a premium, print-ready prospecting report.

This is **not** a CRM — no pipelines, sequences, or inboxes. It's a research and
reporting tool. **Phase 1 runs entirely on local mock data** (no API keys, no
database) and deploys to Vercel as-is.

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
internals can be swapped for Supabase in Phase 3 without touching the UI.

## Light & dark themes

A **light premium executive theme is the default** — a soft cool blue-ivory
canvas with deep-navy text, muted gold and subtle blue accents, soft borders, and
refined shadows. The **dark command-center theme** remains available via the
toggle in the sidebar (and Settings); it shows a sun icon on light, a moon icon on
dark. Styling is CSS-variable driven (including theme-aware accent + badge
tokens), so both modes stay high-contrast and premium. The **report is always
ivory**.

## Project structure

```
app/                 # Next.js App Router routes (app shell + ivory report)
components/
  app/               # command-center UI (shell, charts, leads explorer, wizard)
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
  store/             # local persistence seam (swap for Supabase later)
    persisted.ts     #   persisted shape + seed + id/slug helpers
    storage.ts       #   safe localStorage access
    store.ts         #   store singleton + mutations (createProject, updateLead…)
    useStore.ts      #   React hooks (useSyncExternalStore)
docs/                # PRODUCT_SPEC, MVP_SCOPE, DATABASE_SCHEMA, LEAD_SCORING,
                     # BUILD_PHASES, DEPLOYMENT, FUTURE_API_WORKFLOWS
```

## The trust principle

> Never pitch on a guess you thought was a fact.

Confirmed facts, estimates, and AI inferences are always visually distinct — in
the lead drawer, the verification charts, and the report. See `docs/` for the
full spec and roadmap.
