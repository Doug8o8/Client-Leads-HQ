import { notFound } from "next/navigation";
import { getProject, getLeads } from "@/lib/data";
import { VERIFICATION_DEFINITIONS, SCORE_LABEL_BANDS, isStrongLead } from "@/lib/scoring";
import type { ScoreLabel, VerificationStatus } from "@/lib/types";
import { formatDate, prettyUrl } from "@/lib/utils";
import { ReportToolbar } from "@/components/report/ReportToolbar";
import {
  ReportSection,
  ReportStat,
  ReportScoreBadge,
  ReportVerifBadge,
} from "@/components/report/ReportPrimitives";
import {
  ReportScoreDistribution,
  ReportVerificationDonut,
} from "@/components/report/ReportCharts";
import { ReportLeadCard } from "@/components/report/ReportLeadCard";

export default async function ReportPage({
  params,
}: {
  params: Promise<{ reportId: string }>;
}) {
  const { reportId } = await params;
  const project = getProject(reportId);
  if (!project) notFound();

  const allLeads = getLeads(reportId);
  const leads = allLeads.filter((l) => l.includedInReport);

  const total = leads.length;
  const avg = total ? Math.round(leads.reduce((s, l) => s + l.score, 0) / total) : 0;
  const strong = leads.filter((l) => isStrongLead(l.score)).length;
  const verified = leads.filter((l) => l.verification === "Verified").length;
  const generatedAt = new Date().toISOString();

  const scoreDistribution = SCORE_LABEL_BANDS.map((b) => ({
    label: b.label as ScoreLabel,
    count: leads.filter((l) => l.scoreLabel === b.label).length,
  }));

  const verifOrder: VerificationStatus[] = ["Verified", "Estimated", "Inferred", "Unknown"];
  const verificationDistribution = verifOrder.map((status) => ({
    status,
    count: leads.filter((l) => l.verification === status).length,
  }));

  const strongest = [...leads].sort((a, b) => b.score - a.score).slice(0, 3);

  return (
    <div className="report-root min-h-screen pb-16">
      <ReportToolbar leads={leads} filename={`${project.report.reportName}.csv`} />

      <div className="report-page report-shadow mx-auto mt-6 max-w-[940px] overflow-hidden rounded-2xl shadow-[0_30px_80px_-30px_rgba(20,33,61,0.25)] print:mt-0 print:rounded-none print:shadow-none">
        {/* ============================================================
            1. COVER / HERO
            ============================================================ */}
        <header className="relative overflow-hidden px-10 pb-12 pt-14 sm:px-14">
          {/* subtle corner accent */}
          <div className="pointer-events-none absolute right-0 top-0 h-40 w-40 -translate-y-12 translate-x-12 rounded-full bg-[#b8923c]/10 blur-2xl" />
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <span className="report-serif grid h-11 w-11 place-items-center rounded-xl bg-[#16243f] text-[15px] font-bold text-[#f1d99a]">
                CL
              </span>
              <div>
                <p className="report-serif text-sm font-semibold text-[#16243f]">
                  Client Leads HQ
                </p>
                <p className="text-[11px] uppercase tracking-[0.2em] text-[#8a7e64]">
                  Prospecting Intelligence
                </p>
              </div>
            </div>
            <p className="text-xs font-medium text-[#8a7e64]">
              Prepared {formatDate(generatedAt)}
            </p>
          </div>

          <div className="mt-12">
            <p className="report-kicker">Local Prospecting Report</p>
            <h1 className="report-serif mt-3 max-w-2xl text-[44px] font-semibold leading-[1.05] text-[#16243f] sm:text-[52px]">
              {project.report.reportName}
            </h1>
            <p className="mt-4 max-w-xl text-[15px] leading-relaxed text-[#44506b]">
              A verified, scored shortlist of owner-led businesses across{" "}
              {project.target.geography}, prepared for {project.business.businessName}
              {" "}— with the evidence and outreach angles behind every recommendation.
            </p>
          </div>

          {/* Cover meta strip */}
          <dl className="mt-10 grid grid-cols-2 gap-x-8 gap-y-5 border-t border-[#e7dcc4] pt-7 sm:grid-cols-4">
            <CoverMeta label="Prepared for" value={project.business.businessName} />
            <CoverMeta label="Market" value={project.business.location} />
            <CoverMeta label="Leads reviewed" value={String(allLeads.length)} />
            <CoverMeta label="Generated" value={formatDate(generatedAt)} />
          </dl>

          {/* Headline KPIs */}
          <div className="mt-8 grid grid-cols-2 gap-4 sm:grid-cols-4">
            <ReportStat label="In this report" value={total} sub="curated leads" />
            <ReportStat label="Strong leads" value={strong} sub="score 70+" />
            <ReportStat label="Average score" value={avg} sub="out of 100" />
            <ReportStat label="Verified facts" value={verified} sub="primary-source" />
          </div>
        </header>

        <div className="px-10 sm:px-14">
          <div className="report-divider" />
        </div>

        {/* ============================================================
            2. EXECUTIVE SUMMARY
            ============================================================ */}
        <div className="px-10 py-12 sm:px-14">
          <ReportSection
            index="01"
            kicker="Executive Summary"
            title="What we found"
            intro={project.report.goal}
          >
            <div className="grid gap-6 sm:grid-cols-3">
              <p className="text-[15px] leading-relaxed text-[#44506b] sm:col-span-2">
                We reviewed {allLeads.length} candidate businesses against{" "}
                {project.business.businessName}&apos;s ideal customer profile and
                prospect signals, and advanced {total} into this report.{" "}
                {strong} qualify as strong leads (score 70+), led by partner-owned
                and owner-dependent businesses with concrete continuity exposure —
                recent loans, key operators, and buy-sell structures. Each lead
                below separates what is <strong className="text-[#16243f]">confirmed</strong>{" "}
                from what is estimated or inferred, so your team can open every
                conversation on solid ground.
              </p>
              <div className="rounded-2xl border border-[#e7dcc4] bg-[#fffdf8] p-5">
                <p className="text-[11px] font-semibold uppercase tracking-[0.14em] text-[#8a7e64]">
                  Top recommendation
                </p>
                {strongest[0] && (
                  <>
                    <p className="report-serif mt-2 text-lg font-semibold text-[#16243f]">
                      {strongest[0].company}
                    </p>
                    <p className="mt-1 text-sm text-[#44506b]">
                      {strongest[0].outreach.hook}
                    </p>
                    <div className="mt-3">
                      <ReportScoreBadge score={strongest[0].score} label={strongest[0].scoreLabel} />
                    </div>
                  </>
                )}
              </div>
            </div>
          </ReportSection>
        </div>

        <div className="px-10 sm:px-14">
          <div className="report-divider" />
        </div>

        {/* ============================================================
            3. METHODOLOGY
            ============================================================ */}
        <div className="px-10 py-12 sm:px-14">
          <ReportSection
            index="02"
            kicker="Methodology"
            title="How leads were scored"
            intro="Every business is scored out of 100 across six weighted dimensions, minus a risk penalty. Scores map to plain-language tiers so the shortlist is easy to act on."
          >
            <div className="grid gap-8 sm:grid-cols-2">
              <div>
                <p className="text-[11px] font-semibold uppercase tracking-[0.14em] text-[#8a7e64]">
                  Scoring model
                </p>
                <ul className="mt-3 space-y-2.5">
                  {[
                    ["ICP fit", "25"],
                    ["Need signal", "25"],
                    ["Verification", "20"],
                    ["Outreach quality", "15"],
                    ["Decision-maker clarity", "10"],
                    ["Contactability", "5"],
                    ["Risk penalty", "up to −20"],
                  ].map(([label, pts]) => (
                    <li key={label} className="flex items-center justify-between border-b border-[#efe7d4] pb-2 text-sm">
                      <span className="text-[#44506b]">{label}</span>
                      <span className="report-serif font-semibold text-[#16243f]">{pts}</span>
                    </li>
                  ))}
                </ul>
              </div>
              <div>
                <p className="text-[11px] font-semibold uppercase tracking-[0.14em] text-[#8a7e64]">
                  Score tiers
                </p>
                <ul className="mt-3 space-y-2">
                  {SCORE_LABEL_BANDS.map((b) => (
                    <li key={b.label} className="flex items-center justify-between rounded-lg bg-[#faf6ec] px-3 py-2 text-sm">
                      <ReportScoreBadge score={b.min} label={b.label} />
                      <span className="text-[#6b6350] tabular-nums">
                        {b.min}–{b.max}
                      </span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </ReportSection>
        </div>

        <div className="px-10 sm:px-14">
          <div className="report-divider" />
        </div>

        {/* ============================================================
            4 + 5. STATS + DISTRIBUTIONS
            ============================================================ */}
        <div className="px-10 py-12 sm:px-14">
          <ReportSection
            index="03"
            kicker="Portfolio Overview"
            title="The shortlist at a glance"
          >
            <div className="grid gap-6 lg:grid-cols-2">
              <div className="rounded-2xl border border-[#e7dcc4] bg-[#fffdf8] p-6">
                <p className="report-serif text-base font-semibold text-[#16243f]">
                  Score distribution
                </p>
                <p className="mt-1 text-xs text-[#8a7e64]">
                  How the {total} included leads break down by tier.
                </p>
                <div className="mt-5">
                  <ReportScoreDistribution data={scoreDistribution} />
                </div>
              </div>
              <div className="rounded-2xl border border-[#e7dcc4] bg-[#fffdf8] p-6">
                <p className="report-serif text-base font-semibold text-[#16243f]">
                  Verification mix
                </p>
                <p className="mt-1 text-xs text-[#8a7e64]">
                  Confirmed vs. estimated vs. inferred signals.
                </p>
                <div className="mt-5">
                  <ReportVerificationDonut data={verificationDistribution} />
                </div>
              </div>
            </div>
          </ReportSection>
        </div>

        <div className="px-10 sm:px-14">
          <div className="report-divider" />
        </div>

        {/* ============================================================
            6. STRONGEST LEADS HIGHLIGHT
            ============================================================ */}
        <div className="px-10 py-12 sm:px-14">
          <ReportSection
            index="04"
            kicker="Strongest Leads"
            title="Where to start"
            intro="The three highest-conviction opportunities, ranked by total score and supporting evidence."
          >
            <div className="grid gap-4 sm:grid-cols-3">
              {strongest.map((lead, i) => (
                <div key={lead.id} className="rounded-2xl border border-[#e7dcc4] bg-[#fffdf8] p-5">
                  <div className="flex items-center justify-between">
                    <span className="report-serif text-2xl font-semibold text-[#b8923c]">
                      0{i + 1}
                    </span>
                    <ReportScoreBadge score={lead.score} label={lead.scoreLabel} />
                  </div>
                  <p className="report-serif mt-3 text-lg font-semibold leading-tight text-[#16243f]">
                    {lead.company}
                  </p>
                  <p className="mt-1 text-xs text-[#8a7e64]">
                    {lead.city}, {lead.state} · {lead.industry}
                  </p>
                  <p className="mt-3 text-sm leading-relaxed text-[#44506b]">
                    {lead.needReason}
                  </p>
                  <div className="mt-3">
                    <ReportVerifBadge status={lead.verification} />
                  </div>
                </div>
              ))}
            </div>
          </ReportSection>
        </div>

        {/* ============================================================
            7. DETAILED LEAD CARDS
            ============================================================ */}
        <div className="page-break-before px-10 py-12 sm:px-14">
          <ReportSection
            index="05"
            kicker="Lead Dossiers"
            title="Detailed lead cards"
            intro="Each lead as a mini case summary: the fit, the need, the evidence behind it, the outreach angle, and the risks to confirm."
          >
            <div className="flex flex-col gap-5">
              {leads.map((lead, i) => (
                <ReportLeadCard key={lead.id} lead={lead} rank={i + 1} />
              ))}
            </div>
          </ReportSection>
        </div>

        {/* ============================================================
            8. CSV-STYLE APPENDIX TABLE
            ============================================================ */}
        <div className="page-break-before px-10 py-12 sm:px-14">
          <ReportSection
            index="06"
            kicker="Appendix"
            title="Data table"
            intro="The full shortlist in tabular form — the same fields available in the CSV export."
          >
            <div className="overflow-x-auto rounded-2xl border border-[#e7dcc4]">
              <table className="w-full min-w-[640px] border-collapse text-left text-sm">
                <thead>
                  <tr className="bg-[#16243f] text-[11px] uppercase tracking-wider text-[#e8dcc0]">
                    <th className="px-4 py-3 font-semibold">Company</th>
                    <th className="px-4 py-3 font-semibold">Location</th>
                    <th className="px-4 py-3 font-semibold">Industry</th>
                    <th className="px-4 py-3 font-semibold">Verification</th>
                    <th className="px-4 py-3 text-right font-semibold">Score</th>
                  </tr>
                </thead>
                <tbody>
                  {leads.map((lead, i) => (
                    <tr
                      key={lead.id}
                      style={{ backgroundColor: i % 2 === 0 ? "#fffdf8" : "#faf6ec" }}
                    >
                      <td className="border-t border-[#efe7d4] px-4 py-3 font-medium text-[#16243f]">
                        {lead.company}
                        <span className="block text-xs font-normal text-[#8a7e64]">
                          {prettyUrl(lead.website)}
                        </span>
                      </td>
                      <td className="border-t border-[#efe7d4] px-4 py-3 text-[#44506b]">
                        {lead.city}, {lead.state}
                      </td>
                      <td className="border-t border-[#efe7d4] px-4 py-3 text-[#44506b]">
                        {lead.industry}
                      </td>
                      <td className="border-t border-[#efe7d4] px-4 py-3">
                        <ReportVerifBadge status={lead.verification} />
                      </td>
                      <td className="border-t border-[#efe7d4] px-4 py-3 text-right">
                        <span className="report-serif font-semibold text-[#16243f] tabular-nums">
                          {lead.score}
                        </span>
                        <span className="block text-[11px] text-[#8a7e64]">{lead.scoreLabel}</span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </ReportSection>
        </div>

        {/* ============================================================
            9. VERIFICATION DEFINITIONS + NOTES + FOOTER
            ============================================================ */}
        <div className="px-10 py-12 sm:px-14">
          <ReportSection
            index="07"
            kicker="Trust & Notes"
            title="How to read this report"
            intro="We never present an inference as a fact. Every data point carries a confidence level so your team knows exactly what is confirmed and what to verify."
          >
            <div className="grid gap-3 sm:grid-cols-2">
              {VERIFICATION_DEFINITIONS.map((d) => (
                <div key={d.status} className="rounded-xl border border-[#e7dcc4] bg-[#fffdf8] p-4">
                  <ReportVerifBadge status={d.status} />
                  <p className="mt-2 text-sm leading-relaxed text-[#44506b]">{d.definition}</p>
                </div>
              ))}
            </div>

            <div className="mt-6 rounded-xl bg-[#f3ecda] px-5 py-4">
              <p className="text-xs leading-relaxed text-[#7c7058]">
                <strong className="text-[#6b5a33]">Demo data notice.</strong> This is
                a Phase 1 demonstration report. Company names, contact details, and
                source links are illustrative mock data and do not represent real
                businesses or verified sources. In production, sources are live and
                checkable.
              </p>
            </div>
          </ReportSection>
        </div>

        {/* Footer */}
        <footer className="border-t border-[#e7dcc4] bg-[#16243f] px-10 py-8 text-[#cdd7e8] sm:px-14">
          <div className="flex flex-col items-start justify-between gap-3 sm:flex-row sm:items-center">
            <div>
              <p className="report-serif text-base font-semibold text-[#faf6ec]">
                Client Leads HQ
              </p>
              <p className="mt-0.5 text-xs text-[#9fb0cd]">
                Prepared for {project.business.businessName} · {formatDate(generatedAt)}
              </p>
            </div>
            <p className="text-xs text-[#9fb0cd]">
              {total} leads · avg score {avg}/100 · {verified} verified
            </p>
          </div>
        </footer>
      </div>
    </div>
  );
}

function CoverMeta({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <dt className="text-[10px] font-semibold uppercase tracking-[0.16em] text-[#8a7e64]">
        {label}
      </dt>
      <dd className="report-serif mt-1 text-[15px] font-semibold text-[#16243f]">
        {value}
      </dd>
    </div>
  );
}
