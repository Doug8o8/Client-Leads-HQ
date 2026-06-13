"use client";

// =====================================================================
// First-sign-in offer to import local demo/work data into the cloud org.
// Shows ONLY in Supabase Mode when there's un-migrated local data. It's
// additive — in Local Demo Mode it renders nothing.
// =====================================================================
import { useState } from "react";
import { Button, Panel } from "@/components/ui/primitives";
import { useHydrated, useStoreState } from "@/lib/store/useStore";
import {
  canOfferMigration,
  dismissMigration,
  getLocalDataForMigration,
  migrateLocalToSupabase,
} from "@/lib/store/store";

export function MigrationBanner() {
  const hydrated = useHydrated();
  // Subscribe so we re-render when the backend resolves / data changes.
  useStoreState();
  const [busy, setBusy] = useState(false);
  const [done, setDone] = useState<string | null>(null);

  if (!hydrated || !canOfferMigration()) {
    return done ? (
      <Panel className="mb-6 flex items-center gap-3 p-4">
        <span className="badge-emerald inline-flex items-center rounded-full px-2.5 py-1 text-xs font-semibold">
          Imported
        </span>
        <p className="text-sm text-muted">{done}</p>
      </Panel>
    ) : null;
  }

  const local = getLocalDataForMigration();
  const projectCount = local?.projects.length ?? 0;

  const onImport = async () => {
    setBusy(true);
    try {
      const count = await migrateLocalToSupabase();
      setDone(`Imported ${count} ${count === 1 ? "project" : "projects"} into your workspace.`);
    } finally {
      setBusy(false);
    }
  };

  return (
    <Panel className="mb-6 flex flex-col gap-4 p-5 sm:flex-row sm:items-center sm:justify-between">
      <div>
        <p className="font-semibold text-app">Import your local data?</p>
        <p className="mt-1 text-sm text-muted">
          We found {projectCount} {projectCount === 1 ? "project" : "projects"} saved
          in this browser. Import {projectCount === 1 ? "it" : "them"} into your cloud
          workspace so {projectCount === 1 ? "it's" : "they're"} available everywhere.
        </p>
      </div>
      <div className="flex shrink-0 items-center gap-2">
        <Button variant="ghost" onClick={() => dismissMigration()} disabled={busy}>
          Not now
        </Button>
        <Button variant="gold" onClick={onImport} disabled={busy}>
          {busy ? "Importing…" : "Import to cloud"}
        </Button>
      </div>
    </Panel>
  );
}
