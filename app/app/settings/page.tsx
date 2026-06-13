"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { PageHeader, Panel, Button } from "@/components/ui/primitives";
import { Chip } from "@/components/ui/badges";
import { ThemeToggle } from "@/components/ThemeToggle";
import { useDashboardStats } from "@/lib/store/useStore";
import { resetDemo } from "@/lib/store/store";
import { isStorageAvailable } from "@/lib/store/storage";

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
        title="Workspace settings"
        subtitle="Phase 2A runs on local, in-browser persistence. Real accounts, billing, and integrations arrive in later phases."
      />

      {/* Appearance */}
      <Panel className="p-6">
        <h2 className="text-sm font-semibold uppercase tracking-wider text-faint">Appearance</h2>
        <div className="mt-4 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <p className="text-sm font-medium text-app">Theme</p>
            <p className="text-xs text-muted">
              Dark command-center or light executive. The report stays ivory.
            </p>
          </div>
          <div className="sm:w-56">
            <ThemeToggle />
          </div>
        </div>
      </Panel>

      {/* Workspace */}
      <Panel className="p-6">
        <h2 className="text-sm font-semibold uppercase tracking-wider text-faint">Workspace</h2>
        <div className="mt-4 divide-y divide-[color:var(--line)]">
          {[
            ["Organization", "Lone Star Legacy Insurance"],
            ["Mode", "Demo · saved locally in this browser"],
            ["Local storage", storageOk ? "Available" : "Unavailable (in-memory only)"],
            ["Saved projects", String(stats.projectCount)],
            ["Total leads", String(stats.totalLeads)],
          ].map(([label, value]) => (
            <div key={label} className="flex items-center justify-between py-3 first:pt-0">
              <span className="text-sm text-muted">{label}</span>
              <span className="text-sm font-medium text-app">{value}</span>
            </div>
          ))}
        </div>
      </Panel>

      {/* Integrations */}
      <Panel className="p-6">
        <h2 className="text-sm font-semibold uppercase tracking-wider text-faint">Integrations</h2>
        <div className="mt-4 divide-y divide-[color:var(--line)]">
          {[
            ["Supabase", "Not connected"],
            ["Google Places API", "Not connected"],
            ["AI scoring", "Mock (rule-based)"],
            ["Stripe billing", "Not connected"],
          ].map(([label, value]) => (
            <div key={label} className="flex items-center justify-between py-3 first:pt-0">
              <span className="text-sm text-muted">{label}</span>
              <span className="text-sm font-medium text-app">{value}</span>
            </div>
          ))}
        </div>
      </Panel>

      {/* Reset demo data */}
      <Panel className="p-6">
        <h2 className="text-sm font-semibold uppercase tracking-wider text-faint">Demo data</h2>
        <div className="mt-4 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div className="max-w-lg">
            <p className="text-sm font-medium text-app">Reset to the original demo</p>
            <p className="mt-1 text-sm text-muted">
              Restores the seeded sample project and leads, and discards any
              projects, edits, notes, or selections saved in this browser.
            </p>
          </div>
          {confirming ? (
            <div className="flex shrink-0 items-center gap-2">
              <Button variant="secondary" onClick={() => setConfirming(false)}>
                Cancel
              </Button>
              <Button variant="primary" onClick={doReset}>
                Yes, reset
              </Button>
            </div>
          ) : (
            <Button variant="secondary" onClick={() => setConfirming(true)} className="shrink-0">
              Reset demo data
            </Button>
          )}
        </div>
      </Panel>

      {/* Coming later */}
      <Panel className="p-6">
        <h2 className="text-sm font-semibold uppercase tracking-wider text-faint">Coming in later phases</h2>
        <div className="mt-4 flex flex-wrap gap-2">
          {[
            "Authentication",
            "Supabase persistence",
            "Live web search",
            "Google Places",
            "AI lead scoring",
            "Source verification",
            "HTML-to-PDF export",
            "Stripe billing",
            "Team seats",
          ].map((f) => (
            <Chip key={f}>{f}</Chip>
          ))}
        </div>
      </Panel>
    </div>
  );
}
