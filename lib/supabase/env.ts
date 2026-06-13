// =====================================================================
// Supabase environment + app-mode detection.
//
// The whole point of this module: the app must run perfectly with NO
// Supabase env vars (Local Demo Mode, localStorage), and light up extra
// capabilities when they ARE present (Supabase Mode). Nothing here ever
// throws — missing config is a normal, supported state.
//
// NEXT_PUBLIC_* vars are inlined at build time, so these are readable on
// both the server and the client. The service-role key is intentionally
// NOT read here (server-only scripts read it directly from process.env).
// =====================================================================

export const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL ?? "";
export const SUPABASE_ANON_KEY = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ?? "";

/** True only when both public Supabase vars are present. */
export function isSupabaseConfigured(): boolean {
  return SUPABASE_URL.length > 0 && SUPABASE_ANON_KEY.length > 0;
}

export type AppMode = "supabase" | "local-demo";

/** Which persistence mode the app is running in right now. */
export function getAppMode(): AppMode {
  return isSupabaseConfigured() ? "supabase" : "local-demo";
}
