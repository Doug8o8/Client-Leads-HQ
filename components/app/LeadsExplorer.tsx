"use client";

import { useEffect, useMemo, useState } from "react";
import type { Lead, LeadStatus, ScoreLabel, VerificationStatus } from "@/lib/types";
import { SCORE_LABEL_BANDS } from "@/lib/scoring";
import { useProjectLeads } from "@/lib/store/useStore";
import { toggleLeadIncluded, updateLead } from "@/lib/store/store";
import { cn, prettyUrl } from "@/lib/utils";
import {
  ScorePill,
  VerificationBadge,
  ConfidenceChip,
  Chip,
} from "@/components/ui/badges";
import { Button, ButtonLink, Panel } from "@/components/ui/primitives";
import { ScoreBreakdownBars } from "@/components/app/ScoreBreakdownBars";
import { ExportCsvButton } from "@/components/app/ExportCsvButton";

type ScoreFilter = ScoreLabel | "All";
type VerifFilter = VerificationStatus | "All";
type View = "cards" | "table";

const VERIF_OPTIONS: VerifFilter[] = ["All", "Verified", "Estimated", "Inferred", "Unknown"];
const STATUSES: LeadStatus[] = ["Open", "Approved", "Passed"];

export function LeadsExplorer({
  projectId,
  initialSelectedId = null,
}: {
  projectId: string;
  initialSelectedId?: string | null;
}) {
  const leads = useProjectLeads(projectId);
  const [search, setSearch] = useState("");
  const [scoreFilter, setScoreFilter] = useState<ScoreFilter>("All");
  const [verifFilter, setVerifFilter] = useState<VerifFilter>("All");
  const [view, setView] = useState<View>("cards");
  const [sortDesc, setSortDesc] = useState(true);
  const [selectedId, setSelectedId] = useState<string | null>(initialSelectedId);

  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase();
    return leads
      .filter((l) => (scoreFilter === "All" ? true : l.scoreLabel === scoreFilter))
      .filter((l) => (verifFilter === "All" ? true : l.verification === verifFilter))
      .filter((l) =>
        q === ""
          ? true
          : `${l.company} ${l.industry} ${l.city} ${l.needReason}`.toLowerCase().includes(q)
      )
      .sort((a, b) => (sortDesc ? b.score - a.score : a.score - b.score));
  }, [leads, search, scoreFilter, verifFilter, sortDesc]);

  const selected = leads.find((l) => l.id === selectedId) ?? null;
  const includedCount = leads.filter((l) => l.includedInReport).length;

  return (
    <div className="flex flex-col gap-5">
      {/* Toolbar */}
      <Panel className="p-4">
        <div className="flex flex-col gap-4">
          <div className="flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
            <div className="relative w-full lg:max-w-xs">
              <svg className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-faint" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
                <circle cx="11" cy="11" r="7" />
                <path d="m20 20-3-3" strokeLinecap="round" />
              </svg>
              <input
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search company, industry, need…"
                className="app-input w-full rounded-xl py-2.5 pl-9 pr-3 text-sm"
              />
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={() => setSortDesc((s) => !s)}
                className="surface-1 ring-app inline-flex items-center gap-1.5 rounded-xl px-3 py-2.5 text-xs font-medium text-muted hover:text-app"
              >
                Score {sortDesc ? "↓" : "↑"}
              </button>
              <div className="surface-1 ring-app flex rounded-xl p-1">
                {(["cards", "table"] as View[]).map((v) => (
                  <button
                    key={v}
                    onClick={() => setView(v)}
                    className={cn(
                      "rounded-lg px-3 py-1.5 text-xs font-medium capitalize transition",
                      view === v ? "surface-1 text-app ring-app" : "text-faint hover:text-muted"
                    )}
                  >
                    {v}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Filter chips */}
          <div className="flex flex-col gap-2 border-t hairline pt-4 sm:flex-row sm:items-center sm:gap-6">
            <div className="flex flex-wrap items-center gap-1.5">
              <span className="mr-1 text-xs font-medium text-faint">Score</span>
              <FilterChip active={scoreFilter === "All"} onClick={() => setScoreFilter("All")}>
                All
              </FilterChip>
              {SCORE_LABEL_BANDS.map((b) => (
                <FilterChip key={b.label} active={scoreFilter === b.label} onClick={() => setScoreFilter(b.label)}>
                  {b.label}
                </FilterChip>
              ))}
            </div>
            <div className="flex flex-wrap items-center gap-1.5">
              <span className="mr-1 text-xs font-medium text-faint">Verification</span>
              {VERIF_OPTIONS.map((v) => (
                <FilterChip key={v} active={verifFilter === v} onClick={() => setVerifFilter(v)}>
                  {v}
                </FilterChip>
              ))}
            </div>
          </div>
        </div>
      </Panel>

      {/* Result summary */}
      <div className="flex flex-wrap items-center justify-between gap-3">
        <p className="text-sm text-muted">
          Showing <span className="font-semibold text-app">{filtered.length}</span> of {leads.length} leads ·{" "}
          <span className="font-semibold text-accent-emerald">{includedCount}</span> in report
        </p>
        <div className="flex gap-2">
          <ExportCsvButton
            leads={leads.filter((l) => l.includedInReport)}
            filename={`leads-${projectId}.csv`}
          />
          <ButtonLink href={`/app/projects/${projectId}/report`} variant="gold">
            Build report →
          </ButtonLink>
        </div>
      </div>

      {/* Content */}
      {filtered.length === 0 ? (
        <Panel className="p-12 text-center text-sm text-muted">
          No leads match these filters.
        </Panel>
      ) : view === "cards" ? (
        <div className="grid gap-3 lg:grid-cols-2">
          {filtered.map((lead) => (
            <LeadCard
              key={lead.id}
              lead={lead}
              onOpen={() => setSelectedId(lead.id)}
              onToggle={() => toggleLeadIncluded(lead.id)}
            />
          ))}
        </div>
      ) : (
        <LeadTable leads={filtered} onOpen={setSelectedId} onToggle={(id) => toggleLeadIncluded(id)} />
      )}

      {/* Drawer */}
      {selected && (
        <LeadDrawer
          lead={selected}
          onClose={() => setSelectedId(null)}
          onToggle={() => toggleLeadIncluded(selected.id)}
        />
      )}
    </div>
  );
}

function FilterChip({
  active,
  onClick,
  children,
}: {
  active: boolean;
  onClick: () => void;
  children: React.ReactNode;
}) {
  return (
    <button
      onClick={onClick}
      className={cn(
        "rounded-full px-3 py-1 text-xs font-medium transition",
        active ? "surface-1 text-app ring-app" : "text-faint surface-1-hover hover:text-muted"
      )}
    >
      {children}
    </button>
  );
}

const STATUS_DOT: Record<LeadStatus, string> = {
  Open: "bg-slate-400",
  Approved: "bg-emerald-400",
  Passed: "bg-rose-400",
};

function LeadCard({ lead, onOpen, onToggle }: { lead: Lead; onOpen: () => void; onToggle: () => void }) {
  return (
    <Panel className="flex flex-col p-5">
      <div className="flex items-start justify-between gap-3">
        <button onClick={onOpen} className="min-w-0 text-left">
          <p className="truncate font-semibold text-app hover:text-accent-gold">{lead.company}</p>
          <p className="mt-0.5 truncate text-xs text-muted">
            {lead.industry} · {lead.city}, {lead.state}
          </p>
        </button>
        <ScorePill score={lead.score} label={lead.scoreLabel} />
      </div>

      <p className="mt-3 line-clamp-2 text-sm text-muted">{lead.needReason}</p>

      <div className="mt-3 flex flex-wrap items-center gap-1.5">
        <VerificationBadge status={lead.verification} />
        <Chip>
          <span className={cn("h-1.5 w-1.5 rounded-full", STATUS_DOT[lead.status])} />
          {lead.status}
        </Chip>
        {lead.notes.trim() !== "" && (
          <Chip>
            <svg className="h-3 w-3 text-accent-blue" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
              <path d="M4 5h16M4 12h16M4 19h10" strokeLinecap="round" />
            </svg>
            Note
          </Chip>
        )}
      </div>

      <div className="mt-4 flex items-center justify-between border-t hairline pt-3">
        <button onClick={onOpen} className="text-xs font-medium text-accent-blue hover:underline">
          View audit →
        </button>
        <IncludeToggle included={lead.includedInReport} onToggle={onToggle} />
      </div>
    </Panel>
  );
}

function IncludeToggle({ included, onToggle }: { included: boolean; onToggle: () => void }) {
  return (
    <button
      onClick={onToggle}
      className={cn(
        "inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-semibold transition ring-1",
        included
          ? "bg-emerald-400/10 text-accent-emerald ring-emerald-400/30"
          : "surface-1 text-faint ring-app hover:text-muted"
      )}
    >
      <span className={cn("h-1.5 w-1.5 rounded-full", included ? "bg-emerald-400" : "bg-slate-500")} />
      {included ? "In report" : "Excluded"}
    </button>
  );
}

function LeadTable({
  leads,
  onOpen,
  onToggle,
}: {
  leads: Lead[];
  onOpen: (id: string) => void;
  onToggle: (id: string) => void;
}) {
  return (
    <Panel className="overflow-x-auto">
      <table className="w-full min-w-[720px] text-left text-sm">
        <thead>
          <tr className="border-b hairline text-xs uppercase tracking-wider text-faint">
            <th className="px-4 py-3 font-medium">Company</th>
            <th className="px-4 py-3 font-medium">Industry</th>
            <th className="px-4 py-3 font-medium">Verification</th>
            <th className="px-4 py-3 font-medium">Score</th>
            <th className="px-4 py-3 font-medium text-right">In report</th>
          </tr>
        </thead>
        <tbody>
          {leads.map((lead) => (
            <tr key={lead.id} className="border-b hairline transition surface-1-hover">
              <td className="px-4 py-3">
                <button onClick={() => onOpen(lead.id)} className="text-left font-medium text-app hover:text-accent-gold">
                  {lead.company}
                </button>
                <p className="text-xs text-faint">
                  {lead.city}, {lead.state}
                </p>
              </td>
              <td className="px-4 py-3 text-muted">{lead.industry}</td>
              <td className="px-4 py-3">
                <VerificationBadge status={lead.verification} />
              </td>
              <td className="px-4 py-3">
                <ScorePill score={lead.score} label={lead.scoreLabel} />
              </td>
              <td className="px-4 py-3 text-right">
                <IncludeToggle included={lead.includedInReport} onToggle={() => onToggle(lead.id)} />
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </Panel>
  );
}

function LeadDrawer({ lead, onClose, onToggle }: { lead: Lead; onClose: () => void; onToggle: () => void }) {
  useEffect(() => {
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = "";
    };
  }, []);

  return (
    <div className="fixed inset-0 z-50 flex justify-end">
      <div className="absolute inset-0 bg-ink-950/70 backdrop-blur-sm" onClick={onClose} />
      <div
        className="relative flex h-full w-full max-w-xl flex-col overflow-y-auto border-l hairline shadow-2xl"
        style={{ backgroundColor: "var(--drawer-bg)" }}
      >
        {/* Header */}
        <div
          className="sticky top-0 z-10 flex items-start justify-between gap-4 border-b hairline px-6 py-5 backdrop-blur"
          style={{ backgroundColor: "var(--drawer-bg)" }}
        >
          <div className="min-w-0">
            <p className="text-xs font-medium uppercase tracking-wider text-faint">{lead.industry}</p>
            <h2 className="mt-1 text-xl font-semibold text-app">{lead.company}</h2>
            <p className="mt-0.5 text-sm text-muted">{lead.location}</p>
          </div>
          <button
            onClick={onClose}
            className="grid h-9 w-9 shrink-0 place-items-center rounded-lg text-muted surface-1-hover hover:text-app"
          >
            <svg className="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
              <path d="M6 6l12 12M18 6 6 18" strokeLinecap="round" />
            </svg>
          </button>
        </div>

        <div className="flex flex-col gap-6 px-6 py-6">
          {/* Score + verification + status */}
          <div className="flex flex-wrap items-center gap-2">
            <ScorePill score={lead.score} label={lead.scoreLabel} />
            <VerificationBadge status={lead.verification} />
            <IncludeToggle included={lead.includedInReport} onToggle={onToggle} />
          </div>

          {/* Your workspace — the editable, persisted controls, up top */}
          <section className="app-panel rounded-2xl p-5">
            <div className="flex items-center justify-between">
              <h3 className="card-label">Your workspace</h3>
              <span className="inline-flex items-center gap-1 text-[11px] text-accent-emerald">
                <svg className="h-3 w-3" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4">
                  <path d="M20 6 9 17l-5-5" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
                Saved locally
              </span>
            </div>

            {/* Review status */}
            <div className="mt-4">
              <p className="card-label mb-2">Review status</p>
              <div className="surface-1 ring-app inline-flex rounded-xl p-1">
                {STATUSES.map((s) => (
                  <button
                    key={s}
                    onClick={() => updateLead(lead.id, { status: s })}
                    className={cn(
                      "inline-flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-xs font-medium transition",
                      lead.status === s ? "surface-1 text-app ring-app" : "text-faint hover:text-muted"
                    )}
                  >
                    <span className={cn("h-1.5 w-1.5 rounded-full", STATUS_DOT[s])} />
                    {s}
                  </button>
                ))}
              </div>
            </div>

            {/* Outreach angle (editable) */}
            <div className="mt-5">
              <div className="mb-2 flex items-center gap-1.5">
                <PencilIcon />
                <p className="card-label">Outreach angle</p>
              </div>
              <textarea
                value={lead.outreach.hook}
                onChange={(e) => updateLead(lead.id, { outreach: { ...lead.outreach, hook: e.target.value } })}
                rows={2}
                className="app-input w-full rounded-lg px-3 py-2 text-sm"
                placeholder="How would you open this conversation?"
              />
              <p className="mt-1.5 text-xs text-muted">{lead.outreach.rationale}</p>
            </div>

            {/* Private notes (editable) */}
            <div className="mt-5">
              <div className="mb-2 flex items-center gap-1.5">
                <PencilIcon />
                <p className="card-label">Private notes</p>
              </div>
              <textarea
                value={lead.notes}
                onChange={(e) => updateLead(lead.id, { notes: e.target.value })}
                rows={3}
                placeholder="Add a private note for this lead…"
                className="app-input w-full rounded-lg px-3 py-2.5 text-sm"
              />
              <p className="mt-1.5 text-[11px] text-faint">
                Notes save automatically to this browser and appear in your CSV export.
              </p>
            </div>
          </section>

          {/* Score breakdown */}
          <section>
            <h3 className="mb-3 text-sm font-semibold text-app">Score breakdown</h3>
            <Panel className="p-4">
              <ScoreBreakdownBars breakdown={lead.breakdown} />
              <div className="mt-3 flex items-center justify-between border-t hairline pt-3 text-sm">
                <span className="text-muted">Total</span>
                <span className="font-semibold text-app">{lead.score} / 100</span>
              </div>
            </Panel>
          </section>

          {/* Why it fits / need */}
          <section className="grid gap-3">
            <DrawerBlock title="Why it fits">{lead.whyItFits}</DrawerBlock>
            <DrawerBlock title="Need reason">{lead.needReason}</DrawerBlock>
          </section>

          {/* Key facts */}
          <section className="grid grid-cols-2 gap-3">
            <FactCell label="Decision maker" value={lead.decisionMaker} sub={lead.decisionMakerName ?? undefined} />
            <FactCell label="Business age" value={lead.businessAge} />
            <FactCell label="Phone" value={lead.phone} />
            <FactCell label="Email" value={lead.email ?? "Not public"} />
          </section>

          {/* Links */}
          <section className="flex flex-wrap gap-2">
            <a href={lead.website} target="_blank" rel="noreferrer" className="surface-1 ring-app inline-flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-xs text-muted hover:text-app">
              ↗ {prettyUrl(lead.website)}
            </a>
            <a href={lead.publicProfileUrl} target="_blank" rel="noreferrer" className="surface-1 ring-app inline-flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-xs text-muted hover:text-app">
              ↗ Public profile
            </a>
          </section>

          {/* Evidence audit */}
          <section>
            <div className="mb-3 flex items-center justify-between">
              <h3 className="text-sm font-semibold text-app">Evidence &amp; source audit</h3>
              <span className="text-[11px] text-faint">Demo sources</span>
            </div>
            <div className="flex flex-col gap-2">
              {lead.evidence.map((ev, i) => (
                <Panel key={i} className="p-4">
                  <div className="flex items-center justify-between gap-2">
                    <p className="text-sm font-semibold text-app">{ev.label}</p>
                    <ConfidenceChip confidence={ev.confidence} />
                  </div>
                  <p className="mt-1.5 text-sm text-muted">{ev.detail}</p>
                  <a href={ev.sourceUrl} target="_blank" rel="noreferrer" className="mt-2 inline-block text-xs text-accent-blue hover:underline">
                    {ev.sourceLabel} ↗
                  </a>
                </Panel>
              ))}
            </div>
            <p className="mt-2 text-[11px] text-faint">
              Confirmed = checkable fact · Estimated = reliable proxy · Inferred = AI deduction to verify. Sources shown are demo data.
            </p>
          </section>

          {/* Risk notes (read-only) */}
          <section>
            <div
              className="rounded-xl p-4"
              style={{ backgroundColor: "var(--badge-amber-bg)", boxShadow: "inset 0 0 0 1px var(--badge-amber-ring)" }}
            >
              <p className="card-label" style={{ color: "var(--badge-amber-fg)" }}>Risk notes</p>
              <p className="mt-1.5 text-sm text-muted">{lead.riskNotes}</p>
            </div>
          </section>
        </div>

        <div
          className="sticky bottom-0 mt-auto flex gap-2 border-t hairline px-6 py-4 backdrop-blur"
          style={{ backgroundColor: "var(--drawer-bg)" }}
        >
          <Button variant={lead.includedInReport ? "secondary" : "gold"} onClick={onToggle} className="flex-1">
            {lead.includedInReport ? "Remove from report" : "Add to report"}
          </Button>
          <Button variant="ghost" onClick={onClose}>
            Close
          </Button>
        </div>
      </div>
    </div>
  );
}

function PencilIcon() {
  return (
    <svg className="h-3.5 w-3.5 text-accent-blue" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
      <path d="M12 20h9" strokeLinecap="round" />
      <path d="M16.5 3.5a2.12 2.12 0 0 1 3 3L7 19l-4 1 1-4Z" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

function DrawerBlock({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div>
      <p className="text-xs font-semibold uppercase tracking-wider text-faint">{title}</p>
      <p className="mt-1.5 text-sm text-muted">{children}</p>
    </div>
  );
}

function FactCell({ label, value, sub }: { label: string; value: string; sub?: string }) {
  return (
    <div className="surface-1 ring-app rounded-xl p-3">
      <p className="text-[11px] font-medium uppercase tracking-wider text-faint">{label}</p>
      <p className="mt-1 text-sm font-medium text-app">{value}</p>
      {sub && <p className="text-xs text-muted">{sub}</p>}
    </div>
  );
}
