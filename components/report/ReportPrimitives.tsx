import type {
  EvidenceConfidence,
  ScoreLabel,
  VerificationStatus,
} from "@/lib/types";

// ---------------------------------------------------------------------
// Section header — kicker + serif title + gold rule
// ---------------------------------------------------------------------
export function ReportSection({
  index,
  kicker,
  title,
  intro,
  children,
  breakBefore = false,
}: {
  index?: string;
  kicker: string;
  title: string;
  intro?: string;
  children: React.ReactNode;
  breakBefore?: boolean;
}) {
  return (
    <section className={breakBefore ? "page-break-before pt-2" : ""}>
      <div className="flex items-baseline gap-3">
        {index && (
          <span className="report-serif text-sm font-semibold text-[#b8923c]">
            {index}
          </span>
        )}
        <span className="report-kicker">{kicker}</span>
      </div>
      <h2 className="report-serif mt-2 text-[28px] font-semibold leading-tight text-[#16243f]">
        {title}
      </h2>
      <div className="report-rule-gold mt-3" />
      {intro && (
        <p className="mt-4 max-w-2xl text-[15px] leading-relaxed text-[#44506b]">
          {intro}
        </p>
      )}
      <div className="mt-6">{children}</div>
    </section>
  );
}

// ---------------------------------------------------------------------
// Ivory score badge
// ---------------------------------------------------------------------
const SCORE_BADGE: Record<ScoreLabel, { bg: string; text: string; ring: string }> = {
  Excellent: { bg: "#e8f0ea", text: "#2f5e43", ring: "#cfe1d5" },
  Strong: { bg: "#e7ebf3", text: "#1d3258", ring: "#cdd7e8" },
  Review: { bg: "#f5ecd6", text: "#8a6a23", ring: "#e6d4a6" },
  Weak: { bg: "#f3e7d4", text: "#8a5f24", ring: "#e3cda3" },
  Remove: { bg: "#f1e0dc", text: "#8a463d", ring: "#e3c6bf" },
};

export function ReportScoreBadge({
  score,
  label,
}: {
  score: number;
  label: ScoreLabel;
}) {
  const s = SCORE_BADGE[label];
  return (
    <span
      className="inline-flex items-center gap-2 rounded-full px-3 py-1 text-sm font-semibold"
      style={{ backgroundColor: s.bg, color: s.text, boxShadow: `inset 0 0 0 1px ${s.ring}` }}
    >
      <span className="tabular-nums">{score}</span>
      <span className="opacity-40">·</span>
      <span>{label}</span>
    </span>
  );
}

// ---------------------------------------------------------------------
// Ivory verification badge
// ---------------------------------------------------------------------
const VERIF_BADGE: Record<VerificationStatus, { bg: string; text: string; dot: string }> = {
  Verified: { bg: "#e8f0ea", text: "#2f5e43", dot: "#3f7d5a" },
  Estimated: { bg: "#e7ebf3", text: "#1d3258", dot: "#2b3a59" },
  Inferred: { bg: "#f5ecd6", text: "#8a6a23", dot: "#b8923c" },
  Unknown: { bg: "#eee9dd", text: "#6b6350", dot: "#9a8f78" },
};

export function ReportVerifBadge({ status }: { status: VerificationStatus }) {
  const s = VERIF_BADGE[status];
  return (
    <span
      className="inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-semibold"
      style={{ backgroundColor: s.bg, color: s.text }}
    >
      <span className="h-1.5 w-1.5 rounded-full" style={{ backgroundColor: s.dot }} />
      {status}
    </span>
  );
}

export function ReportConfidenceChip({
  confidence,
}: {
  confidence: EvidenceConfidence;
}) {
  const map: Record<EvidenceConfidence, { bg: string; text: string }> = {
    Confirmed: { bg: "#e8f0ea", text: "#2f5e43" },
    Estimated: { bg: "#e7ebf3", text: "#1d3258" },
    Inferred: { bg: "#f5ecd6", text: "#8a6a23" },
  };
  const s = map[confidence];
  return (
    <span
      className="inline-flex items-center rounded px-1.5 py-0.5 text-[10px] font-bold uppercase tracking-wide"
      style={{ backgroundColor: s.bg, color: s.text }}
    >
      {confidence}
    </span>
  );
}

// ---------------------------------------------------------------------
// KPI stat card
// ---------------------------------------------------------------------
export function ReportStat({
  label,
  value,
  sub,
}: {
  label: string;
  value: React.ReactNode;
  sub?: string;
}) {
  return (
    <div className="report-stat-card rounded-2xl border border-[#e7dcc4] bg-[#fffdf8] px-5 py-5">
      <p className="text-[11px] font-semibold uppercase tracking-[0.14em] text-[#8a7e64]">
        {label}
      </p>
      <p className="report-serif mt-2 text-[34px] font-semibold leading-none text-[#16243f] tabular-nums">
        {value}
      </p>
      {sub && <p className="mt-1.5 text-xs text-[#7c7058]">{sub}</p>}
    </div>
  );
}
