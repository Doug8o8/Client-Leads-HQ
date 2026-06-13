// =====================================================================
// OAuth / email-confirmation callback.
// Exchanges the `code` for a session, runs org/profile bootstrap as a
// safety net, then redirects into the app.
// =====================================================================
import { NextResponse } from "next/server";
import { getSupabaseServerClient } from "@/lib/supabase/server";
import { ensureOrgAndProfile } from "@/lib/supabase/bootstrap";

export async function GET(request: Request) {
  const { searchParams, origin } = new URL(request.url);
  const code = searchParams.get("code");
  const next = searchParams.get("next") ?? "/app";

  if (code) {
    const supabase = await getSupabaseServerClient();
    if (supabase) {
      const { error } = await supabase.auth.exchangeCodeForSession(code);
      if (!error) {
        await ensureOrgAndProfile();
        return NextResponse.redirect(`${origin}${next}`);
      }
    }
  }

  return NextResponse.redirect(`${origin}/auth/sign-in?error=callback`);
}
