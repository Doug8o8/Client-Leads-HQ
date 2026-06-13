import type {
  EvidenceConfidence,
  ScoreLabel,
  VerificationStatus,
} from "@/lib/types";
import { cn } from "@/lib/utils";

// ---------------------------------------------------------------------
// Score pill — dark app variant
// ---------------------------------------------------------------------
const SCORE_STYLES: Record<ScoreLabel, string> = {
  Excellent: "bg-emerald-400/15 text-emerald-300 ring-emerald-400/30",
  Strong: "bg-electric/15 text-electric-soft ring-electric/30",
  Review: "bg-gold/15 text-gold-soft ring-gold/30",
  Weak: "bg-amber-500/10 text-amber-300/90 ring-amber-500/25",
  Remove: "bg-rose-500/10 text-rose-300/90 ring-rose-500/25",
};

export function ScorePill({
  score,
  label,
  className,
}: {
  score: number;
  label: ScoreLabel;
  className?: string;
}) {
  return (
    <span
      className={cn(
        "inline-flex items-center gap-2 rounded-full px-3 py-1 text-sm font-semibold ring-1",
        SCORE_STYLES[label],
        className
      )}
    >
      <span className="tabular-nums">{score}</span>
      <span className="opacity-50">·</span>
      <span>{label}</span>
    </span>
  );
}

// ---------------------------------------------------------------------
// Verification badge — dark app variant
// ---------------------------------------------------------------------
const VERIFICATION_STYLES: Record<
  VerificationStatus,
  { ring: string; dot: string }
> = {
  Verified: { ring: "bg-emerald-400/10 text-emerald-300 ring-emerald-400/30", dot: "bg-emerald-400" },
  Estimated: { ring: "bg-electric/10 text-electric-soft ring-electric/30", dot: "bg-electric" },
  Inferred: { ring: "bg-gold/10 text-gold-soft ring-gold/30", dot: "bg-gold" },
  Unknown: { ring: "surface-1 text-faint ring-app", dot: "bg-slate-400" },
};

export function VerificationBadge({
  status,
  className,
}: {
  status: VerificationStatus;
  className?: string;
}) {
  const s = VERIFICATION_STYLES[status];
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-medium ring-1",
        s.ring,
        className
      )}
    >
      <span className={cn("h-1.5 w-1.5 rounded-full", s.dot)} />
      {status}
    </span>
  );
}

// ---------------------------------------------------------------------
// Evidence confidence chip — distinguishes fact vs. estimate vs. AI guess
// ---------------------------------------------------------------------
const CONFIDENCE_STYLES: Record<EvidenceConfidence, string> = {
  Confirmed: "bg-emerald-400/10 text-emerald-300 ring-emerald-400/30",
  Estimated: "bg-electric/10 text-electric-soft ring-electric/30",
  Inferred: "bg-gold/10 text-gold-soft ring-gold/30",
};

export function ConfidenceChip({
  confidence,
  className,
}: {
  confidence: EvidenceConfidence;
  className?: string;
}) {
  return (
    <span
      className={cn(
        "inline-flex items-center rounded-md px-2 py-0.5 text-[11px] font-semibold uppercase tracking-wide ring-1",
        CONFIDENCE_STYLES[confidence],
        className
      )}
    >
      {confidence}
    </span>
  );
}

// ---------------------------------------------------------------------
// Generic status chip
// ---------------------------------------------------------------------
export function Chip({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1.5 rounded-full surface-1 ring-app px-2.5 py-1 text-xs text-muted",
        className
      )}
    >
      {children}
    </span>
  );
}
