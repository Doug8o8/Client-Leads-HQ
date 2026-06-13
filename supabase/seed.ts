// =====================================================================
// Client Leads HQ — TypeScript seed (Phase 3B)
//
// Mirrors lib/mock-data.ts into a Supabase project. Creates a demo
// organization and imports the demo project + leads (with evidence,
// outreach, and scores) using the same mappers the app uses.
//
// Run (service role required — bypasses RLS, server-only):
//
//   NEXT_PUBLIC_SUPABASE_URL=...  SUPABASE_SERVICE_ROLE_KEY=...  \
//     npx tsx supabase/seed.ts
//
//   …or, with values in .env.local:  npm run seed
//
// NOTE: ids are remapped to fresh uuids on insert, so this is safe to run
// more than once (it creates a new demo org each time).
// =====================================================================
import { createClient } from "@supabase/supabase-js";
import type { Database } from "@/lib/supabase/database.types";
import { LEADS, PROJECTS } from "@/lib/mock-data";
import { uploadAll } from "@/lib/store/supabaseStore";

const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!url || !serviceKey) {
  console.error(
    "Missing env. Set NEXT_PUBLIC_SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY."
  );
  process.exit(1);
}

const supabase = createClient<Database>(url, serviceKey, {
  auth: { persistSession: false, autoRefreshToken: false },
});

async function main() {
  const { data: org, error } = await supabase
    .from("organizations")
    .insert({ name: "Lone Star Legacy Insurance (seed)" })
    .select("id")
    .single();

  if (error || !org) {
    console.error("Failed to create organization:", error?.message);
    process.exit(1);
  }

  const count = await uploadAll(supabase, org.id, PROJECTS, LEADS);
  console.log(`✓ Seeded org ${org.id} with ${count} project(s) and ${LEADS.length} lead(s).`);
  console.log(
    "  To use it as your own, sign up then run:\n" +
      `    update public.profiles set org_id = '${org.id}' where id = auth.uid();`
  );
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
