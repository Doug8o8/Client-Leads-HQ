# Client Leads HQ — Product Spec

**Tagline:** Find better local business leads. Score them. Verify them. Turn them into polished prospecting reports.

Client Leads HQ (CLHQ) is an AI-powered local prospecting command center for
service businesses. A business describes who it is and who it wants to reach;
the app helps it find local business leads, score them out of 100, verify the
sources behind each one, organize the shortlist, and generate a premium,
print-ready prospecting report.

This is **not** a CRM. There are no pipelines, deal stages, email sequences,
inbox sync, or task management. The product is a research-and-reporting tool.

## Who it's for

Service businesses that sell to other local businesses and live or die by the
quality of their prospect research — insurance agencies, B2B service firms,
agencies, advisors, commercial lenders, and similar.

The Phase 1 demo scenario is **Lone Star Legacy Insurance**, a Texas life &
business insurance agency prospecting owner-led small businesses for key-person,
buy-sell, loan-protection, and executive coverage.

## Core workflow

```
Business intake
   → saved prospecting project
      → candidate leads
         → lead scoring (0–100)
            → source verification audit
               → report builder
                  → polished HTML report  ──► browser print → PDF
                  → CSV export
```

## Trust principle (the heart of the product)

> Never pitch on a guess you thought was a fact.

Every data point carries a confidence level. **Confirmed facts**, **estimates**,
and **AI inferences** are always visually distinct — in the lead drawer, in the
verification charts, and in the report. We never present an inference as a fact.

## Brand & visual direction

- **App name:** Client Leads HQ · **Logo text:** CLHQ
- **Tone:** premium, confident, sharp, useful. No cheesy AI buzzwords.
- **App UI:** bold premium dark command-center — deep navy/charcoal, muted gold
  and electric-blue accents, large confident typography, score pills,
  verification badges, evidence drawers.
- **Report:** warm ivory editorial document — navy text, muted gold accents,
  serif display type, tasteful HTML/CSS/SVG data visualization, print-optimized.

## Primary screens (Phase 1)

| Screen | Route |
| --- | --- |
| Landing | `/` |
| Dashboard | `/app` |
| New project wizard | `/app/projects/new` |
| Project command center | `/app/projects/[projectId]` |
| Lead review (table/cards + drawer) | `/app/projects/[projectId]/leads` |
| Report builder | `/app/projects/[projectId]/report` |
| Polished HTML report | `/reports/[reportId]` |
| Settings (placeholder) | `/app/settings` |

## Deliverables

1. **Polished HTML report** — flagship. Editorial, premium, print-to-PDF clean.
2. **CSV export** — the full shortlist with all key fields.

See `MVP_SCOPE.md` for what is and isn't in Phase 1, `LEAD_SCORING.md` for the
scoring model, `DATABASE_SCHEMA.md` for the data model, and `BUILD_PHASES.md`
for the roadmap.
