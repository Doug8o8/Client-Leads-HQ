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

## Project structure

```
app/                 # Next.js App Router routes (app shell + ivory report)
components/
  app/               # command-center UI (shell, charts, leads explorer, wizard)
  report/            # ivory report UI (cover, charts, lead cards, primitives)
  ui/                # shared primitives (badges, buttons, panels)
lib/
  types.ts           # data models (Supabase-ready)
  scoring.ts         # reusable 0–100 scoring logic + label/verification defs
  csv.ts             # reusable CSV export utility
  mock-data.ts       # isolated demo data (clearly marked)
  data.ts            # data-access seam (swap for a backend later)
docs/                # PRODUCT_SPEC, MVP_SCOPE, DATABASE_SCHEMA, LEAD_SCORING,
                     # BUILD_PHASES, DEPLOYMENT
```

## The trust principle

> Never pitch on a guess you thought was a fact.

Confirmed facts, estimates, and AI inferences are always visually distinct — in
the lead drawer, the verification charts, and the report. See `docs/` for the
full spec and roadmap.
