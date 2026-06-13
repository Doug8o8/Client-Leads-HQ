import { ButtonLink, Panel } from "@/components/ui/primitives";

export function ProjectLoading() {
  return (
    <div className="flex min-h-[40vh] items-center justify-center">
      <div className="flex flex-col items-center gap-3 text-muted">
        <span className="h-6 w-6 animate-spin rounded-full border-2 border-[color:var(--line)] border-t-gold-soft" />
        <p className="text-sm">Loading…</p>
      </div>
    </div>
  );
}

export function ProjectMissing() {
  return (
    <Panel className="mx-auto mt-8 flex max-w-lg flex-col items-center gap-4 p-12 text-center">
      <p className="text-sm font-semibold uppercase tracking-[0.22em] text-accent-gold">
        Not found
      </p>
      <h1 className="text-2xl font-semibold text-app">This project isn&apos;t here</h1>
      <p className="max-w-sm text-sm text-muted">
        It may have been removed, or this link points to a project saved in a
        different browser. Demo data lives locally on each device.
      </p>
      <div className="flex gap-2">
        <ButtonLink href="/app" variant="gold">
          Go to dashboard
        </ButtonLink>
        <ButtonLink href="/app/projects/new" variant="secondary">
          New project
        </ButtonLink>
      </div>
    </Panel>
  );
}
