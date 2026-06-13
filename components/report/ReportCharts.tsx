import type { ScoreLabel, VerificationStatus } from "@/lib/types";

// Muted, print-friendly palette tuned for the ivory report.
const SCORE_COLOR: Record<ScoreLabel, string> = {
  Excellent: "#3f7d5a",
  Strong: "#16243f",
  Review: "#b8923c",
  Weak: "#c08a3e",
  Remove: "#a05a52",
};

const VERIF_COLOR: Record<VerificationStatus, string> = {
  Verified: "#3f7d5a",
  Estimated: "#16243f",
  Inferred: "#b8923c",
  Unknown: "#9a8f78",
};

export function ReportScoreDistribution({
  data,
}: {
  data: Array<{ label: ScoreLabel; count: number }>;
}) {
  const max = Math.max(1, ...data.map((d) => d.count));
  return (
    <div className="flex flex-col gap-3.5">
      {data.map((d) => (
        <div key={d.label} className="flex items-center gap-4">
          <span className="w-20 shrink-0 text-sm font-medium text-[#44506b]">
            {d.label}
          </span>
          <div className="h-3 flex-1 overflow-hidden rounded-full bg-[#efe7d4]">
            <div
              className="h-full rounded-full"
              style={{
                width: `${(d.count / max) * 100}%`,
                backgroundColor: SCORE_COLOR[d.label],
                minWidth: d.count > 0 ? "8px" : "0",
              }}
            />
          </div>
          <span className="w-6 shrink-0 text-right text-sm font-semibold tabular-nums text-[#16243f]">
            {d.count}
          </span>
        </div>
      ))}
    </div>
  );
}

export function ReportVerificationDonut({
  data,
}: {
  data: Array<{ status: VerificationStatus; count: number }>;
}) {
  const total = data.reduce((s, d) => s + d.count, 0) || 1;
  const radius = 52;
  const circumference = 2 * Math.PI * radius;

  // Accumulate dash offsets without mutating outer state after render.
  const segments = data
    .filter((d) => d.count > 0)
    .reduce<
      {
        running: number;
        items: Array<{
          status: VerificationStatus;
          dasharray: string;
          dashoffset: number;
          color: string;
        }>;
      }
    >(
      (acc, d) => {
        const dash = (d.count / total) * circumference;
        acc.items.push({
          status: d.status,
          dasharray: `${dash} ${circumference - dash}`,
          dashoffset: -acc.running,
          color: VERIF_COLOR[d.status],
        });
        return { running: acc.running + dash, items: acc.items };
      },
      { running: 0, items: [] }
    ).items;

  const verified = data.find((d) => d.status === "Verified")?.count ?? 0;

  return (
    <div className="flex items-center gap-6">
      <div className="relative shrink-0">
        <svg width="140" height="140" viewBox="0 0 140 140" className="-rotate-90">
          <circle cx="70" cy="70" r={radius} fill="none" stroke="#efe7d4" strokeWidth="16" />
          {segments.map((s) => (
            <circle
              key={s.status}
              cx="70"
              cy="70"
              r={radius}
              fill="none"
              stroke={s.color}
              strokeWidth="16"
              strokeDasharray={s.dasharray}
              strokeDashoffset={s.dashoffset}
            />
          ))}
        </svg>
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <span className="text-2xl font-bold text-[#16243f]">{verified}</span>
          <span className="text-[11px] font-medium uppercase tracking-wide text-[#8a7e64]">
            Verified
          </span>
        </div>
      </div>

      <div className="flex flex-1 flex-col gap-2.5">
        {data.map((d) => (
          <div key={d.status} className="flex items-center gap-2.5">
            <span
              className="h-2.5 w-2.5 shrink-0 rounded-sm"
              style={{ backgroundColor: VERIF_COLOR[d.status] }}
            />
            <span className="text-sm text-[#44506b]">{d.status}</span>
            <span className="ml-auto text-sm font-semibold tabular-nums text-[#16243f]">
              {d.count}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}

export function ReportScoreMeter({ score }: { score: number }) {
  return (
    <div className="h-2 w-full overflow-hidden rounded-full bg-[#efe7d4]">
      <div
        className="h-full rounded-full"
        style={{
          width: `${score}%`,
          background: "linear-gradient(90deg, #b8923c, #16243f)",
        }}
      />
    </div>
  );
}
