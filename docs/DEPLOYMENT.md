# Deployment

## Stack

- Next.js (App Router) · TypeScript · Tailwind CSS
- React 19 · `next/font` (Inter + Fraunces, self-hosted at build — no external
  font requests at runtime)
- Supabase (`@supabase/supabase-js`, `@supabase/ssr`) — **optional**. Without
  env vars the app runs in Local Demo Mode (localStorage) with no backend.

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

## Two run modes

The app detects its mode from env vars (`lib/supabase/env.ts`):

| Mode | Trigger | Behavior |
| --- | --- | --- |
| **Local Demo Mode** | no Supabase env vars | localStorage persistence, no login, works offline. Default. |
| **Supabase Mode** | both `NEXT_PUBLIC_SUPABASE_*` set | auth pages active; cloud data sync lands in Phase 3B. |

### Local Demo Mode (default — nothing to configure)

```bash
npm install
npm run dev
# http://localhost:3000  — no env vars needed
```

### Enable Supabase Mode

1. Create a Supabase project, then apply the SQL in `supabase/migrations/`
   (`0001_init.sql` then `0002_rls.sql`). See `supabase/README.md`.
2. Copy `.env.example` → `.env.local` and fill in:

   ```
   NEXT_PUBLIC_SUPABASE_URL=         # required — Project Settings → API
   NEXT_PUBLIC_SUPABASE_ANON_KEY=    # required — anon public key
   SUPABASE_SERVICE_ROLE_KEY=        # optional — server-only seed/admin scripts
   ```

3. In Supabase **Authentication → URL Configuration**, add your site URL and
   `…/auth/callback` to the redirect allow-list. Email + password is the default
   auth method (you can disable "Confirm email" for frictionless local testing).
4. Restart `npm run dev`. Visit `/auth/sign-up` to create an account; an
   organization + profile are created automatically.

On Vercel, set the same variables under **Project → Settings → Environment
Variables**. Never expose `SUPABASE_SERVICE_ROLE_KEY` to the client.

> **Phase 3B** swaps the `lib/store/` internals to read/write Supabase when in
> Supabase Mode; until then the UI loads from localStorage in both modes.
