"use client";

// =====================================================================
// Supabase browser client (App Router / @supabase/ssr).
//
// Returns `null` when Supabase isn't configured so callers can fall back
// to the localStorage demo store. The client is created lazily and cached.
// =====================================================================
import { createBrowserClient } from "@supabase/ssr";
import { SUPABASE_ANON_KEY, SUPABASE_URL, isSupabaseConfigured } from "./env";

type BrowserClient = ReturnType<typeof createBrowserClient>;

let cached: BrowserClient | null = null;

/** The Supabase browser client, or `null` in Local Demo Mode. */
export function getSupabaseBrowserClient(): BrowserClient | null {
  if (!isSupabaseConfigured()) return null;
  if (!cached) {
    cached = createBrowserClient(SUPABASE_URL, SUPABASE_ANON_KEY);
  }
  return cached;
}
