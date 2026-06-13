"use client";

// =====================================================================
// Lightweight client hook for the current Supabase auth session.
//
// In Local Demo Mode (no Supabase) this resolves immediately to a
// signed-out, configured=false state — no network, no errors.
// =====================================================================
import { useEffect, useState } from "react";
import type { AuthChangeEvent, Session } from "@supabase/supabase-js";
import { getSupabaseBrowserClient } from "./client";
import { isSupabaseConfigured } from "./env";

export interface SessionState {
  /** Whether Supabase env vars are present. */
  configured: boolean;
  /** The active session, or null when signed out / demo mode. */
  session: Session | null;
  /** True until the first session check resolves. */
  loading: boolean;
}

export function useSupabaseSession(): SessionState {
  const configured = isSupabaseConfigured();
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState(configured);

  useEffect(() => {
    const supabase = getSupabaseBrowserClient();
    // When unconfigured, `loading` already initializes to false (= configured),
    // so there's nothing to do — avoid a synchronous setState in the effect.
    if (!supabase) return;

    let active = true;
    supabase.auth.getSession().then(({ data }: { data: { session: Session | null } }) => {
      if (!active) return;
      setSession(data.session);
      setLoading(false);
    });

    const { data: sub } = supabase.auth.onAuthStateChange(
      (_event: AuthChangeEvent, next: Session | null) => {
        setSession(next);
      }
    );

    return () => {
      active = false;
      sub.subscription.unsubscribe();
    };
  }, []);

  return { configured, session, loading };
}
