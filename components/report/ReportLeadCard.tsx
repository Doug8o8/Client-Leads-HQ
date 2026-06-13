import type { Lead } from "@/lib/types";
import { prettyUrl } from "@/lib/utils";
import {
  ReportScoreBadge,
  ReportVerifBadge,
  ReportConfidenceChip,
} from "@/components/report/ReportPrimitives";
import { ReportScoreMeter } from "@/components/report/ReportCharts";

export function ReportLeadCard({ lead, rank }: { lead: Lead; rank: number }) {
  return (
    <article className="report-lead-card overflow-hidden rounded-2xl border border-[#e7dcc4] bg-[#fffdf8]">
      {/* Header band */}
      <div className="flex items-start justify-between gap-4 border-b border-[#efe7d4] px-6 py-5">
        <div className="flex items-start gap-4">
          <span className="report-serif grid h-10 w-10 shrink-0 place-items-center rounded-full bg-[#16243f] text-base font-semibold text-[#faf6ec]">
            {String(rank).padStart(2, "0")}
          </span>
          <div>
            <h3 className="report-serif text-[20px] font-semibold leading-tight text-[#16243f]">
              {lead.company}
            </h3>
            <p className="mt-1 text-sm text-[#6b6350]">
              {lead.industry} · {lead.location}
            </p>
          </div>
        </div>
        <div className="flex shrink-0 flex-col items-end gap-2">
          <ReportScoreBadge score={lead.score} label={lead.scoreLabel} />
          <ReportVerifBadge status={lead.verification} />
        </div>
      </div>

      {/* Score meter */}
      <div className="px-6 pt-4">
        <ReportScoreMeter score={lead.score} />
      </div>

      {/* Body grid */}
      <div className="grid gap-x-8 gap-y-5 px-6 py-5 sm:grid-cols-2">
        <Block label="Why it fits">{lead.whyItFits}</Block>
        <Block label="Need reason">{lead.needReason}</Block>

        <div className="grid grid-cols-2 gap-4 sm:col-span-2">
          <MetaCell label="Decision maker" value={lead.decisionMaker} sub={lead.decisionMakerName ?? undefined} />
          <MetaCell label="Business age" value={lead.businessAge} />
          <MetaCell label="Phone" value={lead.phone} />
          <MetaCell label="Email" value={lead.email ?? "Not public"} />
        </div>

        {/* Evidence */}
        <div className="sm:col-span-2">
          <p className="text-[11px] font-semibold uppercase tracking-[0.14em] text-[#8a7e64]">
            Evidence &amp; sources
          </p>
          <ul className="mt-2.5 flex flex-col gap-2">
            {lead.evidence.map((ev, i) => (
              <li
                key={i}
                className="flex flex-wrap items-baseline gap-x-2 gap-y-1 rounded-lg bg-[#faf6ec] px-3 py-2"
              >
                <ReportConfidenceChip confidence={ev.confidence} />
                <span className="text-sm font-semibold text-[#16243f]">{ev.label}:</span>
                <span className="text-sm text-[#44506b]">{ev.detail}</span>
                <span className="ml-auto text-xs text-[#8a7e64]">{ev.sourceLabel}</span>
              </li>
            ))}
          </ul>
        </div>

        {/* Outreach + risk */}
        <div className="rounded-xl border border-[#cdd7e8] bg-[#eef2f8] px-4 py-3.5">
          <p className="text-[11px] font-semibold uppercase tracking-[0.14em] text-[#1d3258]">
            Outreach angle
          </p>
          <p className="mt-1.5 text-sm font-medium text-[#16243f]">{lead.outreach.hook}</p>
          <p className="mt-1 text-xs text-[#44506b]">{lead.outreach.rationale}</p>
        </div>
        <div className="rounded-xl border border-[#e3cda3] bg-[#f7f0df] px-4 py-3.5">
          <p className="text-[11px] font-semibold uppercase tracking-[0.14em] text-[#8a6a23]">
            Risk notes
          </p>
          <p className="mt-1.5 text-sm text-[#6b5a33]">{lead.riskNotes}</p>
        </div>
      </div>

      {/* Footer links */}
      <div className="flex flex-wrap items-center gap-x-5 gap-y-1 border-t border-[#efe7d4] bg-[#faf6ec] px-6 py-3 text-xs text-[#6b6350]">
        <span>
          <span className="font-semibold text-[#16243f]">Website:</span>{" "}
          {prettyUrl(lead.website)}
        </span>
        <span>
          <span className="font-semibold text-[#16243f]">Profile:</span>{" "}
          {prettyUrl(lead.publicProfileUrl)}
        </span>
      </div>
    </article>
  );
}

function Block({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div>
      <p className="text-[11px] font-semibold uppercase tracking-[0.14em] text-[#8a7e64]">
        {label}
      </p>
      <p className="mt-1.5 text-sm leading-relaxed text-[#44506b]">{children}</p>
    </div>
  );
}

function MetaCell({
  label,
  value,
  sub,
}: {
  label: string;
  value: string;
  sub?: string;
}) {
  return (
    <div>
      <p className="text-[10px] font-semibold uppercase tracking-[0.12em] text-[#8a7e64]">
        {label}
      </p>
      <p className="mt-0.5 text-sm font-medium text-[#16243f]">{value}</p>
      {sub && <p className="text-xs text-[#6b6350]">{sub}</p>}
    </div>
  );
}
