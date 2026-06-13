import Link from "next/link";
import { notFound } from "next/navigation";
import { getProject, getProjectAggregates, getLeads } from "@/lib/data";
import { ButtonLink, PageHeader, Panel, StatCard } from "@/components/ui/primitives";
import { ScorePill, VerificationBadge } from "@/components/ui/badges";
import { ExportCsvButton } from "@/components/app/ExportCsvButton";

export default async function ReportBuilderPage({
  params,
}: {
  params: Promise<{ projectId: string }>;
}) {
  const { projectId } = await params;
  const project = getProject(projectId);
  if (!project) notFound();

  const agg = getProjectAggregates(projectId);
  const leads = getLeads(projectId);
  const included = leads.filter((l) => l.includedInReport);
  const excluded = leads.filter((l) => !l.includedInReport);

  return (
    <div className="flex flex-col gap-8">
      <div>
        <Link
          href={`/app/projects/${projectId}`}
          className="text-sm text-muted hover:text-white"
        >
          ← {project.name}
        </Link>
        <div className="mt-3">
          <PageHeader
            kicker="Report builder"
            title={project.report.reportName}
            subtitle="Review what ships. Generate the polished HTML report or export the shortlist as CSV."
            actions={
              <>
                <ExportCsvButton
                  leads={included}
                  filename={`${project.report.reportName}.csv`}
                />
                <ButtonLink href={`/reports/${projectId}`} variant="gold" target="_blank">
                  Generate report ↗
                </ButtonLink>
              </>
            }
          />
        </div>
      </div>

      {/* Report stats */}
      <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
        <StatCard label="Included leads" value={included.length} accent="gold" />
        <StatCard label="Strong leads" value={agg.strongLeads} accent="emerald" />
        <StatCard label="Avg score" value={agg.averageScore} accent="electric" />
        <StatCard label="Verified facts" value={agg.verifiedCount} />
      </div>

      <div className="grid gap-4 lg:grid-cols-2">
        {/* Included */}
        <Panel className="p-6">
          <div className="flex items-center justify-between">
            <h2 className="font-semibold text-white">
              Included <span className="text-faint">({included.length})</span>
            </h2>
            <span className="text-xs text-emerald-300">Ships in report</span>
          </div>
          <div className="mt-4 flex flex-col divide-y divide-white/5">
            {included.map((lead) => (
              <Link
                key={lead.id}
                href={`/app/projects/${projectId}/leads?lead=${lead.id}`}
                className="flex items-center justify-between gap-3 py-3 first:pt-0"
              >
                <div className="min-w-0">
                  <p className="truncate text-sm font-medium text-white">{lead.company}</p>
                  <p className="truncate text-xs text-faint">{lead.city}, {lead.state}</p>
                </div>
                <div className="flex shrink-0 items-center gap-2">
                  <VerificationBadge status={lead.verification} />
                  <ScorePill score={lead.score} label={lead.scoreLabel} />
                </div>
              </Link>
            ))}
          </div>
        </Panel>

        {/* Excluded */}
        <Panel className="p-6">
          <div className="flex items-center justify-between">
            <h2 className="font-semibold text-white">
              Excluded <span className="text-faint">({excluded.length})</span>
            </h2>
            <span className="text-xs text-faint">Held back</span>
          </div>
          {excluded.length === 0 ? (
            <p className="mt-4 text-sm text-muted">Nothing excluded.</p>
          ) : (
            <div className="mt-4 flex flex-col divide-y divide-white/5">
              {excluded.map((lead) => (
                <Link
                  key={lead.id}
                  href={`/app/projects/${projectId}/leads?lead=${lead.id}`}
                  className="flex items-center justify-between gap-3 py-3 first:pt-0 opacity-70 hover:opacity-100"
                >
                  <div className="min-w-0">
                    <p className="truncate text-sm font-medium text-muted">{lead.company}</p>
                    <p className="truncate text-xs text-faint">{lead.riskNotes}</p>
                  </div>
                  <ScorePill score={lead.score} label={lead.scoreLabel} />
                </Link>
              ))}
            </div>
          )}
          <p className="mt-4 text-xs text-faint">
            Adjust inclusion from the{" "}
            <Link href={`/app/projects/${projectId}/leads`} className="text-electric-soft hover:underline">
              lead review
            </Link>{" "}
            screen.
          </p>
        </Panel>
      </div>

      {/* Generate CTA */}
      <Panel className="flex flex-col items-start gap-4 p-8 sm:flex-row sm:items-center sm:justify-between">
        <div className="max-w-lg">
          <h2 className="text-xl font-semibold text-white">Your prospecting report is ready</h2>
          <p className="mt-2 text-sm text-muted">
            A premium, print-ready HTML report for {project.business.businessName} —
            cover, executive summary, methodology, visual stats, lead cards, and a
            CSV-style appendix.
          </p>
        </div>
        <ButtonLink href={`/reports/${projectId}`} variant="gold" target="_blank" className="shrink-0 px-5 py-3 text-base">
          Generate &amp; view report ↗
        </ButtonLink>
      </Panel>
    </div>
  );
}
