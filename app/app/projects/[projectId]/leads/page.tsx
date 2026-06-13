"use client";

import Link from "next/link";
import { use } from "react";
import { useHydrated, useProject } from "@/lib/store/useStore";
import { LeadsExplorer } from "@/components/app/LeadsExplorer";
import { ProjectMissing, ProjectLoading } from "@/components/app/ProjectMissing";

export default function LeadsPage({
  params,
  searchParams,
}: {
  params: Promise<{ projectId: string }>;
  searchParams: Promise<{ lead?: string }>;
}) {
  const { projectId } = use(params);
  const { lead: selectedLead } = use(searchParams);
  const hydrated = useHydrated();
  const project = useProject(projectId);

  if (!hydrated) return <ProjectLoading />;
  if (!project) return <ProjectMissing />;

  return (
    <div className="flex flex-col gap-6">
      <div>
        <Link
          href={`/app/projects/${projectId}`}
          className="text-sm text-muted hover:text-app"
        >
          ← {project.name}
        </Link>
        <h1 className="font-editorial mt-3 text-[28px] font-semibold leading-tight text-app sm:text-[34px]">
          Lead review
        </h1>
        <p className="mt-2 text-sm text-muted">
          Filter, sort, and curate the shortlist. Toggle leads in or out of the
          report, add notes, and open any lead for the full scoring + evidence
          audit. Changes save automatically.
        </p>
      </div>

      <LeadsExplorer projectId={projectId} initialSelectedId={selectedLead ?? null} />
    </div>
  );
}
