import type {
  EvidenceConfidence,
  ScoreLabel,
  VerificationStatus,
} from "@/lib/types";
import { cn } from "@/lib/utils";

// ---------------------------------------------------------------------
// Score pill — theme-aware (light + dark)
// ---------------------------------------------------------------------
const SCORE_STYLES: Record<ScoreLabel, string> = {
  Excellent: "badge-emerald",
  Strong: "badge-blue",
  Review: "badge-gold",
  Weak: "badge-amber",
  Remove: "badge-rose",
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
        "inline-flex items-center gap-2 rounded-full px-3 py-1 text-sm font-semibold",
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
  Verified: { ring: "badge-emerald", dot: "bg-emerald-500" },
  Estimated: { ring: "badge-blue", dot: "bg-electric" },
  Inferred: { ring: "badge-gold", dot: "bg-gold" },
  Unknown: { ring: "badge-neutral", dot: "bg-slate-400" },
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
        "inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-medium",
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
  Confirmed: "badge-emerald",
  Estimated: "badge-blue",
  Inferred: "badge-gold",
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
        "inline-flex items-center rounded-md px-2 py-0.5 text-[11px] font-semibold uppercase tracking-wide",
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
