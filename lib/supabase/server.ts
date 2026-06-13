// =====================================================================
// Supabase server client (App Router / @supabase/ssr).
//
// Reads/writes the auth session via Next.js cookies. Returns `null` when
// Supabase isn't configured, so server code can degrade gracefully.
//
// NOTE: only safe to call from Server Components, Route Handlers, and
// Server Actions (anywhere `next/headers` cookies() is available).
// =====================================================================
import { cookies } from "next/headers";
import { createServerClient } from "@supabase/ssr";
import type { Database } from "./database.types";
import { SUPABASE_ANON_KEY, SUPABASE_URL, isSupabaseConfigured } from "./env";

type ServerClient = ReturnType<typeof createServerClient<Database>>;

/** The Supabase server client, or `null` in Local Demo Mode. */
export async function getSupabaseServerClient(): Promise<ServerClient | null> {
  if (!isSupabaseConfigured()) return null;

  const cookieStore = await cookies();

  return createServerClient<Database>(SUPABASE_URL, SUPABASE_ANON_KEY, {
    cookies: {
      getAll() {
        return cookieStore.getAll();
      },
      setAll(cookiesToSet) {
        try {
          for (const { name, value, options } of cookiesToSet) {
            cookieStore.set(name, value, options);
          }
        } catch {
          // `setAll` can be called from a Server Component where cookies
          // are read-only. Safe to ignore — the middleware/route refresh
          // path handles session persistence.
        }
      },
    },
  });
}
