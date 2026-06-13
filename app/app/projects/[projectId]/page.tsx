"use client";

import Link from "next/link";
import { use } from "react";
import { useHydrated, useProject, useProjectAggregates, useProjectLeads } from "@/lib/store/useStore";
import { ButtonLink, PageHeader, Panel, StatCard } from "@/components/ui/primitives";
import { ScoreDistribution, VerificationBreakdown } from "@/components/app/Charts";
import { ScorePill, VerificationBadge, Chip } from "@/components/ui/badges";
import { ExportCsvButton } from "@/components/app/ExportCsvButton";
import { ProjectMissing, ProjectLoading } from "@/components/app/ProjectMissing";

export default function ProjectCommandCenter({
  params,
}: {
  params: Promise<{ projectId: string }>;
}) {
  const { projectId } = use(params);
  const hydrated = useHydrated();
  const project = useProject(projectId);
  const agg = useProjectAggregates(projectId);
  const leads = useProjectLeads(projectId);

  if (!hydrated) return <ProjectLoading />;
  if (!project) return <ProjectMissing />;

  const included = leads.filter((l) => l.includedInReport);

  return (
    <div className="flex flex-col gap-8">
      <div>
        <Link href="/app" className="text-sm text-muted hover:text-app">
          ← Dashboard
        </Link>
        <div className="mt-3">
          <PageHeader
            kicker={project.business.businessName}
            title={project.name}
            subtitle={project.report.goal}
            actions={
              <>
                <ButtonLink href={`/app/projects/${projectId}/leads`} variant="secondary">
                  Review leads
                </ButtonLink>
                <ButtonLink href={`/app/projects/${projectId}/report`} variant="gold">
                  Build report
                </ButtonLink>
              </>
            }
          />
        </div>
      </div>

      {/* Status / stat cards */}
      <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
        <StatCard label="Leads reviewed" value={agg.totalLeads} />
        <StatCard label="Strong leads" value={agg.strongLeads} accent="emerald" sub="Score 70+" />
        <StatCard label="Avg score" value={agg.averageScore} accent="electric" />
        <StatCard label="In report" value={agg.includedCount} accent="gold" sub={`${agg.removedCount} removed`} />
      </div>

      {/* Project brief */}
      <Panel className="p-6">
        <h2 className="card-label">
          Project brief
        </h2>
        <div className="mt-4 grid gap-6 md:grid-cols-3">
          <div>
            <p className="text-xs font-medium text-faint">Target customer</p>
            <p className="mt-1.5 text-sm text-muted">{project.target.description}</p>
            <div className="mt-3 flex flex-wrap gap-1.5">
              {project.target.companySize && <Chip>{project.target.companySize}</Chip>}
              {project.target.geography && <Chip>{project.target.geography}</Chip>}
            </div>
          </div>
          <div>
            <p className="text-xs font-medium text-faint">Ideal signals</p>
            {project.signals.idealSignals.length === 0 ? (
              <p className="mt-1.5 text-sm text-faint">None specified.</p>
            ) : (
              <ul className="mt-1.5 space-y-1">
                {project.signals.idealSignals.slice(0, 5).map((s) => (
                  <li key={s} className="flex gap-2 text-sm text-muted">
                    <span className="mt-1.5 h-1 w-1 shrink-0 rounded-full bg-emerald-400" />
                    {s}
                  </li>
                ))}
              </ul>
            )}
          </div>
          <div>
            <p className="text-xs font-medium text-faint">Bad-fit signals</p>
            {project.signals.badFitSignals.length === 0 ? (
              <p className="mt-1.5 text-sm text-faint">None specified.</p>
            ) : (
              <ul className="mt-1.5 space-y-1">
                {project.signals.badFitSignals.slice(0, 5).map((s) => (
                  <li key={s} className="flex gap-2 text-sm text-muted">
                    <span className="mt-1.5 h-1 w-1 shrink-0 rounded-full bg-rose-400" />
                    {s}
                  </li>
                ))}
              </ul>
            )}
          </div>
        </div>
      </Panel>

      {/* Charts */}
      <div className="grid gap-4 lg:grid-cols-2">
        <Panel className="p-6">
          <h2 className="card-label">
            Lead score distribution
          </h2>
          <div className="mt-5">
            <ScoreDistribution data={agg.scoreDistribution} />
          </div>
        </Panel>
        <Panel className="p-6">
          <h2 className="card-label">
            Verification mix
          </h2>
          <div className="mt-5">
            <VerificationBreakdown data={agg.verificationDistribution} />
          </div>
          <p className="mt-4 text-xs text-faint">
            Verified facts are checkable. Estimates and inferences are flagged so
            you never pitch on a guess.
          </p>
        </Panel>
      </div>

      {/* Strongest leads */}
      <section>
        <div className="mb-4 flex items-center justify-between">
          <h2 className="text-lg font-semibold text-app">Strongest leads</h2>
          <Link
            href={`/app/projects/${projectId}/leads`}
            className="text-sm text-muted hover:text-app"
          >
            View all {agg.totalLeads} →
          </Link>
        </div>
        {agg.strongest.length === 0 ? (
          <Panel className="p-6 text-sm text-muted">
            No strong leads (score 70+) yet in this project.
          </Panel>
        ) : (
          <div className="grid gap-3">
            {agg.strongest.map((lead) => (
              <Link key={lead.id} href={`/app/projects/${projectId}/leads?lead=${lead.id}`}>
                <Panel className="flex flex-col gap-3 p-5 transition hover:ring-app sm:flex-row sm:items-center sm:justify-between">
                  <div className="min-w-0">
                    <p className="truncate font-semibold text-app">{lead.company}</p>
                    <p className="mt-0.5 truncate text-sm text-muted">
                      {lead.industry} · {lead.city}, {lead.state}
                    </p>
                  </div>
                  <div className="flex shrink-0 items-center gap-2">
                    <VerificationBadge status={lead.verification} />
                    <ScorePill score={lead.score} label={lead.scoreLabel} />
                  </div>
                </Panel>
              </Link>
            ))}
          </div>
        )}
      </section>

      {/* Removed / weak */}
      {agg.removed.length > 0 && (
        <section>
          <h2 className="mb-4 text-lg font-semibold text-app">
            Removed from report{" "}
            <span className="text-sm font-normal text-faint">
              ({agg.removed.length})
            </span>
          </h2>
          <Panel className="divide-y divide-[color:var(--line)]">
            {agg.removed.map((lead) => (
              <div key={lead.id} className="flex items-center justify-between gap-3 p-4">
                <div className="min-w-0">
                  <p className="truncate text-sm font-medium text-muted">{lead.company}</p>
                  <p className="truncate text-xs text-faint">{lead.riskNotes}</p>
                </div>
                <ScorePill score={lead.score} label={lead.scoreLabel} />
              </div>
            ))}
          </Panel>
        </section>
      )}

      {/* Actions footer */}
      <Panel className="flex flex-col gap-4 p-6 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <p className="font-semibold text-app">Ready to ship?</p>
          <p className="text-sm text-muted">
            {included.length} leads are included in the report.
          </p>
        </div>
        <div className="flex flex-wrap gap-2">
          <ExportCsvButton leads={included} filename={`${project.report.reportName}.csv`} />
          <ButtonLink href={`/app/projects/${projectId}/report`} variant="secondary">
            Open report builder
          </ButtonLink>
          <ButtonLink href={`/reports/${projectId}`} variant="gold" target="_blank">
            View report ↗
          </ButtonLink>
        </div>
      </Panel>
    </div>
  );
}
