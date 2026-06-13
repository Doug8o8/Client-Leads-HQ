import { PageHeader, Panel } from "@/components/ui/primitives";
import { Chip } from "@/components/ui/badges";

const SECTIONS = [
  {
    title: "Workspace",
    rows: [
      ["Organization", "Lone Star Legacy Insurance"],
      ["Plan", "Phase 1 — Demo workspace"],
      ["Region", "Austin, TX"],
    ],
  },
  {
    title: "Integrations",
    rows: [
      ["Supabase", "Not connected"],
      ["Google Places API", "Not connected"],
      ["AI scoring", "Mock (rule-based)"],
      ["Stripe billing", "Not connected"],
    ],
  },
];

export default function SettingsPage() {
  return (
    <div className="flex flex-col gap-8">
      <PageHeader
        kicker="Settings"
        title="Workspace settings"
        subtitle="Placeholder for Phase 1. Real account, billing, and integration settings land in later phases."
      />

      {SECTIONS.map((section) => (
        <Panel key={section.title} className="p-6">
          <h2 className="text-sm font-semibold uppercase tracking-wider text-faint">
            {section.title}
          </h2>
          <div className="mt-4 divide-y divide-white/5">
            {section.rows.map(([label, value]) => (
              <div key={label} className="flex items-center justify-between py-3 first:pt-0">
                <span className="text-sm text-muted">{label}</span>
                <span className="text-sm font-medium text-white">{value}</span>
              </div>
            ))}
          </div>
        </Panel>
      ))}

      <Panel className="p-6">
        <h2 className="text-sm font-semibold uppercase tracking-wider text-faint">
          Coming in later phases
        </h2>
        <div className="mt-4 flex flex-wrap gap-2">
          {[
            "Authentication",
            "Supabase persistence",
            "Live web search",
            "Google Places",
            "AI lead scoring",
            "Source verification",
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
