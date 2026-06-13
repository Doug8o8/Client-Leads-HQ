"use client";

import type { Lead } from "@/lib/types";
import { downloadCsv, leadsToCsv } from "@/lib/csv";
import { recordExport } from "@/lib/store/store";
import { Button } from "@/components/ui/primitives";

export function ExportCsvButton({
  leads,
  filename,
  variant = "secondary",
  label = "Export CSV",
}: {
  leads: Lead[];
  filename: string;
  variant?: "primary" | "secondary" | "ghost" | "gold";
  label?: string;
}) {
  return (
    <Button
      variant={variant}
      disabled={leads.length === 0}
      onClick={() => {
        downloadCsv(filename, leadsToCsv(leads));
        recordExport();
      }}
    >
      <svg className="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
        <path d="M12 3v12m0 0 4-4m-4 4-4-4" strokeLinecap="round" strokeLinejoin="round" />
        <path d="M4 17v2a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-2" strokeLinecap="round" />
      </svg>
      {label}
    </Button>
  );
}
