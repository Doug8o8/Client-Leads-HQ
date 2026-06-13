"use client";

import Link from "next/link";
import type { Lead } from "@/lib/types";
import { downloadCsv, leadsToCsv } from "@/lib/csv";
import { recordExport } from "@/lib/store/store";

export function ReportToolbar({
  leads,
  filename,
}: {
  leads: Lead[];
  filename: string;
}) {
  return (
    <div className="no-print sticky top-0 z-30 border-b border-[#e7dcc4] bg-[#faf6ec]/90 backdrop-blur">
      <div className="mx-auto flex max-w-[940px] items-center justify-between px-5 py-3">
        <Link
          href="/app"
          className="text-sm font-medium text-[#44506b] transition hover:text-[#16243f]"
        >
          ← Back to command center
        </Link>
        <div className="flex items-center gap-2">
          <button
            onClick={() => {
              downloadCsv(filename, leadsToCsv(leads));
              recordExport({ projectId: leads[0]?.projectId, rows: leads.length });
            }}
            className="inline-flex items-center gap-1.5 rounded-lg border bg-white px-3.5 py-2 text-sm font-semibold text-[#16243f] shadow-sm transition hover:border-[#b8923c] hover:text-[#b8923c]"
            style={{ borderColor: "#e0d3ab" }}
          >
            Export CSV
          </button>
          <button
            onClick={() => window.print()}
            className="inline-flex items-center gap-1.5 rounded-lg bg-[#16243f] px-4 py-2 text-sm font-semibold text-[#faf6ec] shadow-sm transition hover:bg-[#1f3157]"
          >
            <svg className="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
              <path d="M6 9V3h12v6M6 18H4a2 2 0 0 1-2-2v-4a2 2 0 0 1 2-2h16a2 2 0 0 1 2 2v4a2 2 0 0 1-2 2h-2" strokeLinecap="round" strokeLinejoin="round" />
              <rect x="6" y="14" width="12" height="7" rx="1" />
            </svg>
            Print / Save as PDF
          </button>
        </div>
      </div>
    </div>
  );
}
