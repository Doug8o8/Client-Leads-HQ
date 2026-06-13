"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { PageHeader, Panel, Button } from "@/components/ui/primitives";
import { ThemeToggle } from "@/components/ThemeToggle";
import { useDashboardStats } from "@/lib/store/useStore";
import { resetDemo } from "@/lib/store/store";
import { isStorageAvailable } from "@/lib/store/storage";

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

  const doReset = () => {
    resetDemo();
    setConfirming(false);
    router.push("/app");
  };

  return (
    <div className="flex flex-col gap-8">
      <PageHeader
        kicker="Settings"
        title="Workspace"
        subtitle="Everything here runs locally in your browser. No account, billing, or external services are connected."
      />

      {/* App mode banner */}
      <Panel className="flex flex-col gap-4 p-6 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-center gap-3">
          <span className="relative flex h-2.5 w-2.5">
            <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400/60" />
            <span className="relative inline-flex h-2.5 w-2.5 rounded-full bg-emerald-400" />
          </span>
          <div>
            <p className="font-semibold text-app">Local Demo Mode</p>
            <p className="text-sm text-muted">
              Projects, leads, edits, and notes are saved to this browser only.
            </p>
          </div>
        </div>
        <span className="badge-emerald inline-flex items-center rounded-full px-3 py-1 text-xs font-semibold">
          Active
        </span>
      </Panel>

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

      {/* Local storage status */}
      <SectionCard
        label="Storage"
        title="Local storage status"
        desc="Where this demo keeps your data between visits."
      >
        <div className="divide-y divide-[color:var(--line)]">
          <Row
            label="Browser localStorage"
            value={storageOk ? "Available — data persists" : "Unavailable — in-memory only"}
            accent={storageOk ? "text-accent-emerald" : "text-[color:var(--badge-amber-fg)]"}
          />
          <Row label="Storage key" value="clhq.store.v1" />
          <Row label="Backend" value="None (Phase 2B)" />
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
            Reset demo data
          </Button>
        )}
      </SectionCard>

      {/* Future workflows */}
      <SectionCard
        label="Roadmap"
        title="Future workflows"
        desc="Planned for later phases — not active in this demo."
      >
        <div className="grid gap-3 sm:grid-cols-2">
          {[
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
            {
              t: "Supabase + accounts",
              d: "Cloud persistence, authentication, and team workspaces.",
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
          See <span className="font-medium text-muted">docs/FUTURE_API_WORKFLOWS.md</span> for how
          these connect to the current architecture.
        </p>
      </SectionCard>
    </div>
  );
}
