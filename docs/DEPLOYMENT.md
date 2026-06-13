# Deployment

## Stack

- Next.js (App Router) · TypeScript · Tailwind CSS
- React 19 · `next/font` (Inter + Fraunces, self-hosted at build — no external
  font requests at runtime)
- No database, no env vars required for Phase 1.

## Run locally

```bash
npm install
npm run dev
# open http://localhost:3000
```

Other scripts:

```bash
npm run build      # production build
npm run start      # serve the production build
npm run typecheck  # tsc --noEmit
npm run lint       # eslint .
```

## Deploy to Vercel

1. Push this repo to GitHub.
2. In Vercel, **New Project → Import** the repo.
3. Framework preset: **Next.js** (auto-detected). Build command `next build`,
   output handled automatically.
4. No environment variables are needed for Phase 1.
5. Deploy. The landing page, app, and `/reports/[reportId]` route work out of
   the box on mock data.

## Routes

| Route | Rendering |
| --- | --- |
| `/` | static |
| `/app`, `/app/projects/new`, `/app/settings` | static |
| `/app/projects/[projectId]` and children | dynamic (server-rendered) |
| `/reports/[reportId]` | dynamic (server-rendered) |

Sample data ships with project id **`proj_lonestar`**, so
`/reports/proj_lonestar` renders the full demo report.

> **Phase 2A note:** project/lead state is persisted per-browser in
> `localStorage` (seeded from the mock data on first load), so the project pages
> and report read their data on the client. New projects created in the wizard
> exist only in the browser that created them. No server env or database is
> required. Phase 3 swaps `lib/store/` internals for Supabase.

## Printing the report to PDF

Open a report → **Print / Save as PDF**. The print stylesheet (`app/globals.css`,
`@media print`) sets clean margins, preserves accent colors
(`print-color-adjust: exact`), avoids breaking lead cards/tables across pages,
and hides interactive chrome (`.no-print`). Tested for A4 and US Letter.

## Phase 2 env (future)

When Supabase is added, expect:

```
NEXT_PUBLIC_SUPABASE_URL=
NEXT_PUBLIC_SUPABASE_ANON_KEY=
SUPABASE_SERVICE_ROLE_KEY=
```

…plus provider keys for Places / web search / AI in later phases. None are
required today.
