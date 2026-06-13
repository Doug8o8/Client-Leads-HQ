// =====================================================================
// CSV export — reusable, dependency-free utility.
// Works on the client (download) and is safe to reuse server-side.
// =====================================================================
import type { Lead } from "./types";

export const CSV_COLUMNS = [
  "Company",
  "Website",
  "Public Profile",
  "Phone",
  "Email",
  "Address",
  "City",
  "State",
  "Industry",
  "Score",
  "Score Label",
  "Need Reason",
  "Decision Maker Status",
  "Business Age Status",
  "Verification Status",
  "Outreach Angle",
  "Source URL",
  "Notes",
] as const;

function escapeCell(value: string | number | null | undefined): string {
  const s = value === null || value === undefined ? "" : String(value);
  if (s.includes('"') || s.includes(",") || s.includes("\n")) {
    return `"${s.replace(/"/g, '""')}"`;
  }
  return s;
}

export function leadsToCsv(leads: Lead[]): string {
  const header = CSV_COLUMNS.join(",");
  const rows = leads.map((lead) => {
    const primarySource = lead.evidence[0]?.sourceUrl ?? "";
    return [
      lead.company,
      lead.website,
      lead.publicProfileUrl,
      lead.phone,
      lead.email ?? "",
      lead.location,
      lead.city,
      lead.state,
      lead.industry,
      lead.score,
      lead.scoreLabel,
      lead.needReason,
      lead.decisionMaker,
      lead.businessAge,
      lead.verification,
      lead.outreach.hook,
      primarySource,
      lead.riskNotes,
    ]
      .map(escapeCell)
      .join(",");
  });
  return [header, ...rows].join("\n");
}

/** Trigger a browser download of CSV text. Client-only. */
export function downloadCsv(filename: string, csv: string): void {
  const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = filename.endsWith(".csv") ? filename : `${filename}.csv`;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}
