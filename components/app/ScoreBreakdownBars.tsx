import type { ScoreBreakdown } from "@/lib/types";
import { SCORE_DIMENSIONS } from "@/lib/scoring";
import { cn } from "@/lib/utils";

export function ScoreBreakdownBars({
  breakdown,
  className,
}: {
  breakdown: ScoreBreakdown;
  className?: string;
}) {
  return (
    <div className={cn("flex flex-col gap-2.5", className)}>
      {SCORE_DIMENSIONS.map((dim) => {
        const value = breakdown[dim.key];
        const isPenalty = dim.max < 0;
        const magnitude = Math.abs(value);
        const pct = Math.min(100, (magnitude / Math.abs(dim.max)) * 100);
        return (
          <div key={dim.key} className="flex items-center gap-3">
            <span className="w-28 shrink-0 text-xs text-muted">{dim.label}</span>
            <div className="h-2 flex-1 overflow-hidden rounded-full bg-white/5">
              <div
                className={cn(
                  "h-full rounded-full",
                  isPenalty ? "bg-rose-400/80" : "bg-electric"
                )}
                style={{ width: `${pct}%` }}
              />
            </div>
            <span
              className={cn(
                "w-12 shrink-0 text-right text-xs font-semibold tabular-nums",
                isPenalty && value < 0 ? "text-rose-300" : "text-white"
              )}
            >
              {value > 0 && !isPenalty ? value : value}
              <span className="text-faint">/{dim.max}</span>
            </span>
          </div>
        );
      })}
    </div>
  );
}
