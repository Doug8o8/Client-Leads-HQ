import type { ScoreLabel, VerificationStatus } from "@/lib/types";
import { cn } from "@/lib/utils";

const SCORE_BAR: Record<ScoreLabel, string> = {
  Excellent: "bg-emerald-400",
  Strong: "bg-electric",
  Review: "bg-gold",
  Weak: "bg-amber-400",
  Remove: "bg-rose-400",
};

export function ScoreDistribution({
  data,
}: {
  data: Array<{ label: ScoreLabel; count: number }>;
}) {
  const max = Math.max(1, ...data.map((d) => d.count));
  return (
    <div className="flex flex-col gap-3">
      {data.map((d) => (
        <div key={d.label} className="flex items-center gap-3">
          <span className="w-20 shrink-0 text-xs font-medium text-muted">
            {d.label}
          </span>
          <div className="h-2.5 flex-1 overflow-hidden rounded-full bg-white/5">
            <div
              className={cn("h-full rounded-full", SCORE_BAR[d.label])}
              style={{ width: `${(d.count / max) * 100}%` }}
            />
          </div>
          <span className="w-6 shrink-0 text-right text-xs font-semibold tabular-nums text-white">
            {d.count}
          </span>
        </div>
      ))}
    </div>
  );
}

const VERIF_BAR: Record<VerificationStatus, string> = {
  Verified: "bg-emerald-400",
  Estimated: "bg-electric",
  Inferred: "bg-gold",
  Unknown: "bg-slate-500",
};

export function VerificationBreakdown({
  data,
}: {
  data: Array<{ status: VerificationStatus; count: number }>;
}) {
  const total = Math.max(1, data.reduce((s, d) => s + d.count, 0));
  return (
    <div>
      <div className="flex h-3 w-full overflow-hidden rounded-full bg-white/5">
        {data.map((d) =>
          d.count === 0 ? null : (
            <div
              key={d.status}
              className={cn("h-full", VERIF_BAR[d.status])}
              style={{ width: `${(d.count / total) * 100}%` }}
              title={`${d.status}: ${d.count}`}
            />
          )
        )}
      </div>
      <div className="mt-3 grid grid-cols-2 gap-2 sm:grid-cols-4">
        {data.map((d) => (
          <div key={d.status} className="flex items-center gap-2">
            <span className={cn("h-2 w-2 rounded-full", VERIF_BAR[d.status])} />
            <span className="text-xs text-muted">{d.status}</span>
            <span className="ml-auto text-xs font-semibold tabular-nums text-white">
              {d.count}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}
