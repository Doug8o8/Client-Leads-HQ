// =====================================================================
// Organization / profile bootstrap (best-effort, idempotent).
//
// The PRIMARY bootstrap path is the `handle_new_user` Postgres trigger
// (see supabase/migrations/0001_init.sql), which creates an organization
// + owner profile automatically the moment a user signs up. This helper
// is a safety net for users who predate the trigger, or environments
// where the trigger hasn't been applied. Call it after a successful
// sign-in from a Server Component / Route Handler.
//
// It NEVER throws — bootstrap failures must not block the demo-capable app.
// =====================================================================
import { getSupabaseServerClient } from "./server";

export async function ensureOrgAndProfile(): Promise<void> {
  const supabase = await getSupabaseServerClient();
  if (!supabase) return;

  try {
    const {
      data: { user },
    } = await supabase.auth.getUser();
    if (!user) return;

    // Already bootstrapped? Nothing to do.
    const { data: existing } = await supabase
      .from("profiles")
      .select("id")
      .eq("id", user.id)
      .maybeSingle();
    if (existing) return;

    const orgName =
      (user.user_metadata?.org_name as string | undefined) ||
      `${(user.email ?? "My").split("@")[0]}'s workspace`;

    const { data: org, error: orgErr } = await supabase
      .from("organizations")
      .insert({ name: orgName })
      .select("id")
      .single();
    if (orgErr || !org) return;

    await supabase.from("profiles").insert({
      id: user.id,
      org_id: org.id,
      full_name: (user.user_metadata?.full_name as string | undefined) ?? "",
      email: user.email ?? "",
      role: "owner",
    });
  } catch {
    // Swallow — the trigger is the real mechanism; this is only a fallback.
  }
}
