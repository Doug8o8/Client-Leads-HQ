# Supabase (Phase 3A foundation)

This folder holds the SQL to stand up the Client Leads HQ backend. **None of
it is required to run the app** — with no Supabase env vars the app runs in
**Local Demo Mode** (localStorage), exactly as before.

## Contents

```
supabase/
  migrations/
    0001_init.sql   # tables, indexes, signup-bootstrap trigger, updated_at
    0002_rls.sql    # enable RLS + org-scoped policies on every table
  seed.sql          # optional demo org/project/leads for dashboard testing
  README.md         # this file
```

## Apply the schema

### Option A — Supabase Dashboard (simplest)

1. Create a project at https://supabase.com.
2. **SQL Editor → New query** → paste `migrations/0001_init.sql` → **Run**.
3. New query → paste `migrations/0002_rls.sql` → **Run**.
4. (Optional) New query → paste `seed.sql` → **Run** for demo rows.

### Option B — Supabase CLI

```bash
supabase link --project-ref <your-ref>
supabase db push        # applies migrations/*.sql in order
supabase db reset       # (local) re-runs migrations + seed.sql
```

## Get your env vars

In the Supabase dashboard: **Project Settings → API**.

| Variable | Where | Required? |
| --- | --- | --- |
| `NEXT_PUBLIC_SUPABASE_URL` | Project URL | Yes (Supabase Mode) |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | `anon` public key | Yes (Supabase Mode) |
| `SUPABASE_SERVICE_ROLE_KEY` | `service_role` secret key | Only for server-side seed/admin scripts |

Put them in `.env.local` (see `.env.example`). Restart `npm run dev`.

## Auth settings

For the simplest reliable local setup, the app uses **email + password** auth.

- **Authentication → Providers → Email**: ensure Email is enabled.
- For frictionless local testing you can **disable "Confirm email"** so sign-up
  logs you straight in. If confirmation stays on, the confirmation link routes
  back through `/auth/callback`.
- **Authentication → URL Configuration**: add your site URL (e.g.
  `http://localhost:3000`) and `…/auth/callback` to the redirect allow-list.

## Tables

`organizations`, `profiles`, `projects`, `lead_searches`, `leads`,
`lead_verifications`, `lead_scores`, `outreach_angles`, `reports`,
`report_leads`, `exports`, `usage_events`.

See `docs/DATABASE_SCHEMA.md` for the full column reference.

## Security notes

- RLS is **enabled on every table** and scoped to the caller's organization via
  `public.current_org_id()`. There are no public/unrestricted policies.
- The `service_role` key bypasses RLS — keep it server-side only, never in
  `NEXT_PUBLIC_*` and never shipped to the browser.

## What's next (Phase 3B)

The schema + auth exist now, but the app UI still reads/writes localStorage.
Phase 3B swaps `lib/store/store.ts` internals to read/write these tables when
in Supabase Mode (the React hooks and UI stay untouched). See
`docs/BUILD_PHASES.md`.
