"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { PageHeader, Panel, Button, ButtonLink } from "@/components/ui/primitives";
import { ThemeToggle } from "@/components/ThemeToggle";
import { useDashboardStats } from "@/lib/store/useStore";
import { resetDemo } from "@/lib/store/store";
import { isStorageAvailable } from "@/lib/store/storage";
import { getAppMode } from "@/lib/supabase/env";
import { useSupabaseSession } from "@/lib/supabase/useSession";

function SectionCard({
  label,
  title,
  desc,
  children,
}: {
  label: string;
  title: string;
  desc?: string;
  children: React.ReactNode;
}) {
  return (
    <Panel className="p-6">
      <p className="card-label">{label}</p>
      <h2 className="font-editorial mt-1 text-lg font-semibold text-app">{title}</h2>
      {desc && <p className="mt-1 text-sm text-muted">{desc}</p>}
      <div className="mt-5">{children}</div>
    </Panel>
  );
}

function Row({ label, value, accent }: { label: string; value: string; accent?: string }) {
  return (
    <div className="flex items-center justify-between py-3 first:pt-0">
      <span className="text-sm text-muted">{label}</span>
      <span className={`text-sm font-medium ${accent ?? "text-app"}`}>{value}</span>
    </div>
  );
}

export default function SettingsPage() {
  const stats = useDashboardStats();
  const router = useRouter();
  const [confirming, setConfirming] = useState(false);
  const storageOk = typeof window !== "undefined" ? isStorageAvailable() : true;

  const mode = getAppMode();
  const isSupabase = mode === "supabase";
  const { session, loading: sessionLoading } = useSupabaseSession();
  const signedIn = Boolean(session);

  const doReset = () => {
    resetDemo();
    setConfirming(false);
    router.push("/app");
  };

  const authStatus = !isSupabase
    ? "Not required (demo)"
    : sessionLoading
    ? "Checking…"
    : signedIn
    ? `Signed in${session?.user?.email ? ` — ${session.user.email}` : ""}`
    : "Signed out";

  return (
    <div className="flex flex-col gap-8">
      <PageHeader
        kicker="Settings"
        title="Workspace"
        subtitle={
          isSupabase
            ? "Connected to Supabase. Authentication is available; cloud data sync arrives in Phase 3B."
            : "Everything here runs locally in your browser. No account, billing, or external services are connected."
        }
      />

      {/* App mode banner */}
      <Panel className="flex flex-col gap-4 p-6 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-center gap-3">
          <span className="relative flex h-2.5 w-2.5">
            <span
              className={`absolute inline-flex h-full w-full animate-ping rounded-full ${
                isSupabase ? "bg-sky-400/60" : "bg-emerald-400/60"
              }`}
            />
            <span
              className={`relative inline-flex h-2.5 w-2.5 rounded-full ${
                isSupabase ? "bg-sky-400" : "bg-emerald-400"
              }`}
            />
          </span>
          <div>
            <p className="font-semibold text-app">
              {isSupabase ? "Supabase Mode" : "Local Demo Mode"}
            </p>
            <p className="text-sm text-muted">
              {isSupabase
                ? "Supabase is configured. Sign in to manage your account; data still loads from this browser until Phase 3B."
                : "Projects, leads, edits, and notes are saved to this browser only."}
            </p>
          </div>
        </div>
        <span
          className={`inline-flex items-center rounded-full px-3 py-1 text-xs font-semibold ${
            isSupabase ? "badge-blue" : "badge-emerald"
          }`}
        >
          Active
        </span>
      </Panel>

      {/* App mode + connection */}
      <SectionCard
        label="System"
        title="App mode & connection"
        desc="How Client Leads HQ is running right now."
      >
        <div className="divide-y divide-[color:var(--line)]">
          <Row
            label="App mode"
            value={isSupabase ? "Supabase Mode" : "Local Demo Mode"}
            accent={isSupabase ? "text-accent-blue" : "text-accent-emerald"}
          />
          <Row
            label="Supabase connection"
            value={isSupabase ? "Configured" : "Not configured"}
            accent={isSupabase ? "text-accent-emerald" : undefined}
          />
          <Row
            label="Auth status"
            value={authStatus}
            accent={signedIn ? "text-accent-emerald" : undefined}
          />
          <Row
            label="Browser localStorage"
            value={storageOk ? "Available — data persists" : "Unavailable — in-memory only"}
            accent={storageOk ? "text-accent-emerald" : "text-[color:var(--badge-amber-fg)]"}
          />
          <Row label="Storage key" value="clhq.store.v1" />
        </div>

        <div className="mt-5 flex flex-wrap gap-2">
          {isSupabase ? (
            signedIn ? (
              <form action="/auth/sign-out" method="post">
                <Button type="submit" variant="secondary">
                  Sign out
                </Button>
              </form>
            ) : (
              <ButtonLink href="/auth/sign-in" variant="secondary">
                Sign in
              </ButtonLink>
            )
          ) : (
            <p className="text-xs text-faint">
              Add Supabase env vars (see{" "}
              <span className="font-medium text-muted">.env.example</span>) to enable
              accounts. Auth pages still render at{" "}
              <Link href="/auth/sign-in" className="font-medium text-accent-blue">
                /auth/sign-in
              </Link>
              .
            </p>
          )}
        </div>
      </SectionCard>

      {/* Appearance */}
      <SectionCard
        label="Appearance"
        title="Theme"
        desc="Light premium executive (default) or dark command-center. The report stays ivory in both."
      >
        <div className="sm:max-w-xs">
          <ThemeToggle />
        </div>
      </SectionCard>

      {/* Data summary */}
      <SectionCard label="Your data" title="Workspace summary">
        <div className="divide-y divide-[color:var(--line)]">
          <Row label="Organization" value="Lone Star Legacy Insurance" />
          <Row label="Saved projects" value={String(stats.projectCount)} />
          <Row label="Total leads" value={String(stats.totalLeads)} />
          <Row label="Strong leads (70+)" value={String(stats.strongLeads)} accent="text-accent-emerald" />
          <Row label="CSV exports" value={String(stats.exportCount)} accent="text-accent-blue" />
        </div>
      </SectionCard>

      {/* Demo data */}
      <SectionCard
        label="Demo data"
        title="Reset to the original demo"
        desc="Restores the seeded sample project and leads, and discards any projects, edits, notes, or selections saved in this browser."
      >
        {confirming ? (
          <div className="flex items-center gap-2">
            <span className="text-sm text-muted">This can&apos;t be undone.</span>
            <Button variant="secondary" onClick={() => setConfirming(false)}>
              Cancel
            </Button>
            <Button variant="primary" onClick={doReset}>
              Yes, reset
            </Button>
          </div>
        ) : (
          <Button variant="secondary" onClick={() => setConfirming(true)}>
            Reset local demo data
          </Button>
        )}
      </SectionCard>

      {/* Future workflows */}
      <SectionCard
        label="Roadmap"
        title="Future workflows"
        desc="Planned for later phases — not active in this build."
      >
        <div className="grid gap-3 sm:grid-cols-2">
          {[
            {
              t: "Supabase data sync (Phase 3B)",
              d: "Persist projects, leads, and reports to Postgres when signed in — RLS scoped to your org.",
            },
            {
              t: "Lead discovery API",
              d: "Find real local businesses from your target + geography (Google Places / web search).",
            },
            {
              t: "AI scoring & verification",
              d: "Score each lead from real signals and confirm sources with honest confidence.",
            },
            {
              t: "PDF report builder",
              d: "Generate a downloadable PDF of the report with saved version history.",
            },
          ].map((f) => (
            <div key={f.t} className="surface-1 ring-app rounded-xl p-4">
              <div className="flex items-center justify-between">
                <p className="text-sm font-semibold text-app">{f.t}</p>
                <span className="badge-neutral inline-flex items-center rounded-full px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wide">
                  Planned
                </span>
              </div>
              <p className="mt-1.5 text-xs text-muted">{f.d}</p>
            </div>
          ))}
        </div>
        <p className="mt-4 text-xs text-faint">
          See <span className="font-medium text-muted">docs/FUTURE_API_WORKFLOWS.md</span> and{" "}
          <span className="font-medium text-muted">docs/BUILD_PHASES.md</span> for how these connect
          to the current architecture.
        </p>
      </SectionCard>
    </div>
  );
}
