"use client";

import Link from "next/link";
import type { Project } from "@/lib/types";
import { useDashboardStats, useProjectAggregates, useProjects } from "@/lib/store/useStore";
import { ButtonLink, PageHeader, Panel, StatCard } from "@/components/ui/primitives";
import { Chip } from "@/components/ui/badges";
import { formatShortDate } from "@/lib/utils";

const STATUS_STYLES: Record<string, string> = {
  Draft: "text-faint",
  Researching: "text-electric-soft",
  Ready: "text-emerald-300",
  "Report sent": "text-gold-soft",
};

export default function DashboardPage() {
  const stats = useDashboardStats();
  const projects = useProjects();

  return (
    <div className="flex flex-col gap-8">
      <PageHeader
        kicker="Command center"
        title="Welcome back"
        subtitle="Your prospecting projects, leads, and reports — at a glance."
        actions={
          <ButtonLink href="/app/projects/new" variant="gold">
            + Create prospecting report
          </ButtonLink>
        }
      />

      {/* Stat row */}
      <div className="grid grid-cols-2 gap-4 lg:grid-cols-5">
        <StatCard label="Saved projects" value={stats.projectCount} />
        <StatCard label="Total leads" value={stats.totalLeads} />
        <StatCard label="Strong leads" value={stats.strongLeads} accent="emerald" sub="Score 70+" />
        <StatCard label="Reports created" value={stats.reportsCreated} accent="gold" />
        <StatCard label="CSV exports" value={stats.exportCount} accent="electric" />
      </div>

      {/* Projects */}
      <section>
        <div className="mb-4 flex items-center justify-between">
          <h2 className="text-lg font-semibold text-app">Recent projects</h2>
          <ButtonLink href="/app/projects/new" variant="ghost">
            New project →
          </ButtonLink>
        </div>

        {projects.length === 0 ? (
          <EmptyProjects />
        ) : (
          <div className="grid gap-4 lg:grid-cols-2">
            {projects.map((project) => (
              <ProjectCard key={project.id} project={project} />
            ))}
          </div>
        )}
      </section>
    </div>
  );
}

function ProjectCard({ project }: { project: Project }) {
  const agg = useProjectAggregates(project.id);
  return (
    <Link href={`/app/projects/${project.id}`}>
      <Panel className="group h-full p-6 transition hover:ring-app">
        <div className="flex items-start justify-between gap-4">
          <div className="min-w-0">
            <p className="text-xs font-medium uppercase tracking-wider text-faint">
              {project.business.businessName}
            </p>
            <h3 className="mt-1 truncate text-lg font-semibold text-app group-hover:text-gold-soft">
              {project.name}
            </h3>
          </div>
          <span
            className={`shrink-0 rounded-full surface-1 ring-app px-2.5 py-1 text-xs font-medium ${
              STATUS_STYLES[project.status]
            }`}
          >
            {project.status}
          </span>
        </div>

        <div className="mt-4 flex flex-wrap gap-2">
          <Chip>{project.business.location}</Chip>
          <Chip>{agg.totalLeads} leads</Chip>
          <Chip>{agg.strongLeads} strong</Chip>
        </div>

        <div className="mt-5 grid grid-cols-3 gap-3 border-t hairline pt-4">
          <div>
            <p className="text-xs text-faint">Avg score</p>
            <p className="mt-0.5 text-lg font-semibold tabular-nums text-app">
              {agg.averageScore}
            </p>
          </div>
          <div>
            <p className="text-xs text-faint">In report</p>
            <p className="mt-0.5 text-lg font-semibold tabular-nums text-app">
              {agg.includedCount}
            </p>
          </div>
          <div>
            <p className="text-xs text-faint">Updated</p>
            <p className="mt-0.5 text-sm font-medium text-muted">
              {formatShortDate(project.updatedAt)}
            </p>
          </div>
        </div>
      </Panel>
    </Link>
  );
}

function EmptyProjects() {
  return (
    <Panel className="flex flex-col items-center justify-center gap-4 p-14 text-center">
      <div className="grid h-12 w-12 place-items-center rounded-2xl surface-1 ring-app text-gold-soft">
        <svg className="h-6 w-6" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
          <path d="M12 5v14M5 12h14" strokeLinecap="round" />
        </svg>
      </div>
      <div>
        <p className="text-lg font-semibold text-app">No projects yet</p>
        <p className="mt-1 max-w-sm text-sm text-muted">
          Create your first prospecting project to start finding, scoring, and
          reporting on local leads.
        </p>
      </div>
      <ButtonLink href="/app/projects/new" variant="gold">
        + Create prospecting report
      </ButtonLink>
    </Panel>
  );
}
