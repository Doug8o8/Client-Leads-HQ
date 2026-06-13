# Lead Scoring

Scores are **out of 100**, computed by a single reusable function in
`lib/scoring.ts`. Phase 1 uses authored breakdowns in the mock data; the same
function will consume model/heuristic output in later phases.

## Dimensions & weights

| Dimension | Max | What it measures |
| --- | --- | --- |
| ICP fit | 25 | Match to the ideal customer profile |
| Need signal | 25 | Evidence the prospect needs the service |
| Verification | 20 | How well facts are confirmed vs. inferred |
| Outreach quality | 15 | Strength of the available angle / personalization |
| Decision-maker clarity | 10 | Ability to reach the person who can say yes |
| Contactability | 5 | Availability of a reliable contact method |
| **Risk penalty** | **up to −20** | Deductions for bad-fit signals, churn risk, data gaps |

```
total = clamp(0, 100,
  icpFit + needSignal + verification + outreachQuality
  + decisionMaker + contactability + riskPenalty)
```

`riskPenalty` is stored as a value in `[-20, 0]`.

## Score labels

| Range | Label |
| --- | --- |
| 85–100 | Excellent |
| 70–84 | Strong |
| 55–69 | Review |
| 40–54 | Weak |
| 0–39 | Remove |

A lead is a **strong lead** when its score ≥ 70.

## Verification labels (trust)

| Label | Meaning |
| --- | --- |
| Verified | Confirmed against a primary, checkable source. Treated as fact. |
| Estimated | Derived from a reliable proxy (headcount band, founding-year range). Directionally accurate. |
| Inferred | AI-assisted deduction from indirect signals. A hypothesis to confirm. |
| Unknown | No reliable signal. Flagged for manual review. |

Evidence items carry their own confidence (`Confirmed` / `Estimated` /
`Inferred`) so a single lead can mix confirmed facts with inferences — and the
UI shows the difference everywhere.

## Key functions (`lib/scoring.ts`)

- `scoreFromBreakdown(breakdown)` → clamped 0–100 total
- `labelForScore(score)` → `ScoreLabel`
- `isStrongLead(score)` → boolean (≥ 70)
- `SCORE_DIMENSIONS`, `SCORE_LABEL_BANDS`, `VERIFICATION_DEFINITIONS` — shared
  constants used by the breakdown bars, methodology section, and report.

## Why scores are derived, not stored raw

Mock leads define a `breakdown`; the total `score` and `scoreLabel` are computed
from it (`lib/mock-data.ts → buildLead`). This guarantees the number always ties
out to the visualized breakdown — no drift between the badge and the bars.

## Phase 2+ direction

Replace authored breakdowns with: web-search/Places-derived signals → heuristic
or LLM scoring per dimension → the same `scoreFromBreakdown` pipeline, so the UI
never changes when real scoring lands.
