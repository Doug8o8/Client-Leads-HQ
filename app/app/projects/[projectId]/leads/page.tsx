import Link from "next/link";
import { notFound } from "next/navigation";
import { getProject, getLeads } from "@/lib/data";
import { LeadsExplorer } from "@/components/app/LeadsExplorer";

export default async function LeadsPage({
  params,
  searchParams,
}: {
  params: Promise<{ projectId: string }>;
  searchParams: Promise<{ lead?: string }>;
}) {
  const { projectId } = await params;
  const { lead: selectedLead } = await searchParams;
  const project = getProject(projectId);
  if (!project) notFound();
  const leads = getLeads(projectId);

  return (
    <div className="flex flex-col gap-6">
      <div>
        <Link
          href={`/app/projects/${projectId}`}
          className="text-sm text-muted hover:text-white"
        >
          ← {project.name}
        </Link>
        <h1 className="mt-3 text-2xl font-semibold tracking-tight text-white sm:text-3xl">
          Lead review
        </h1>
        <p className="mt-2 text-sm text-muted">
          Filter, sort, and curate the shortlist. Toggle leads in or out of the
          report. Open any lead for the full scoring + evidence audit.
        </p>
      </div>

      <LeadsExplorer
        projectId={projectId}
        initialLeads={leads}
        initialSelectedId={selectedLead ?? null}
      />
    </div>
  );
}
