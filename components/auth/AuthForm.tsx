"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/primitives";
import { getSupabaseBrowserClient } from "@/lib/supabase/client";
import { isSupabaseConfigured } from "@/lib/supabase/env";

type Mode = "sign-in" | "sign-up";

function Field({
  label,
  type,
  value,
  onChange,
  autoComplete,
  placeholder,
}: {
  label: string;
  type: string;
  value: string;
  onChange: (v: string) => void;
  autoComplete?: string;
  placeholder?: string;
}) {
  return (
    <label className="block">
      <span className="card-label">{label}</span>
      <input
        type={type}
        value={value}
        required
        autoComplete={autoComplete}
        placeholder={placeholder}
        onChange={(e) => onChange(e.target.value)}
        className="app-input mt-1.5 w-full rounded-xl px-3.5 py-2.5 text-sm"
      />
    </label>
  );
}

export function AuthForm({ mode }: { mode: Mode }) {
  const configured = isSupabaseConfigured();
  const router = useRouter();
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [pending, setPending] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [notice, setNotice] = useState<string | null>(null);

  const isSignUp = mode === "sign-up";

  // Local Demo Mode: no Supabase configured — render an honest info card
  // instead of a broken form. The app stays fully usable without auth.
  if (!configured) {
    return (
      <div className="flex flex-col gap-4">
        <div className="surface-1 ring-app rounded-xl p-4">
          <p className="text-sm font-semibold text-app">Local Demo Mode is active</p>
          <p className="mt-1.5 text-sm text-muted">
            Supabase isn&apos;t configured, so accounts aren&apos;t needed. Everything
            you do is saved in this browser. Add your Supabase env vars (see{" "}
            <span className="font-medium text-muted">.env.example</span>) to enable
            real accounts.
          </p>
        </div>
        <Link href="/app">
          <Button variant="gold" className="w-full">
            Continue to the app →
          </Button>
        </Link>
      </div>
    );
  }

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setNotice(null);
    const supabase = getSupabaseBrowserClient();
    if (!supabase) return;

    setPending(true);
    try {
      if (isSignUp) {
        const { data, error: signUpError } = await supabase.auth.signUp({
          email,
          password,
          options: {
            data: { full_name: fullName },
            emailRedirectTo:
              typeof window !== "undefined"
                ? `${window.location.origin}/auth/callback`
                : undefined,
          },
        });
        if (signUpError) {
          setError(signUpError.message);
          return;
        }
        // Email confirmation disabled → session present → straight in.
        if (data.session) {
          router.push("/app");
          router.refresh();
          return;
        }
        setNotice("Check your email to confirm your account, then sign in.");
      } else {
        const { error: signInError } = await supabase.auth.signInWithPassword({
          email,
          password,
        });
        if (signInError) {
          setError(signInError.message);
          return;
        }
        router.push("/app");
        router.refresh();
      }
    } finally {
      setPending(false);
    }
  }

  return (
    <form onSubmit={onSubmit} className="flex flex-col gap-4">
      {isSignUp && (
        <Field
          label="Full name"
          type="text"
          value={fullName}
          onChange={setFullName}
          autoComplete="name"
          placeholder="Jordan Rivera"
        />
      )}
      <Field
        label="Email"
        type="email"
        value={email}
        onChange={setEmail}
        autoComplete="email"
        placeholder="you@company.com"
      />
      <Field
        label="Password"
        type="password"
        value={password}
        onChange={setPassword}
        autoComplete={isSignUp ? "new-password" : "current-password"}
        placeholder="••••••••"
      />

      {error && (
        <p className="badge-rose rounded-lg px-3 py-2 text-sm" role="alert">
          {error}
        </p>
      )}
      {notice && (
        <p className="badge-emerald rounded-lg px-3 py-2 text-sm">{notice}</p>
      )}

      <Button type="submit" variant="gold" className="w-full" disabled={pending}>
        {pending
          ? "Working…"
          : isSignUp
          ? "Create account"
          : "Sign in"}
      </Button>

      <p className="text-center text-sm text-muted">
        {isSignUp ? (
          <>
            Already have an account?{" "}
            <Link href="/auth/sign-in" className="font-medium text-accent-blue">
              Sign in
            </Link>
          </>
        ) : (
          <>
            New to Client Leads HQ?{" "}
            <Link href="/auth/sign-up" className="font-medium text-accent-blue">
              Create an account
            </Link>
          </>
        )}
      </p>
    </form>
  );
}
