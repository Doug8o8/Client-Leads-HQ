# Future API Workflows (placeholders)

This document reserves space for the real lead-discovery and PDF/report-builder
workflows. **Nothing here is implemented yet** — Phase 2A is local mock data
only. The point is to capture how these workflows will connect to the current
architecture so they can be dropped in without a rewrite.

## How future workflows connect to the current app

The app is deliberately layered so external services slot in behind stable seams:

```
UI (components, pages)
  → React hooks (lib/store/useStore.ts)        ← unchanged when backend changes
    → store actions (lib/store/store.ts)        ← swap localStorage for API/Supabase
      → pure logic (lib/scoring.ts, lib/aggregates.ts, lib/csv.ts)  ← reused as-is
        → data (lib/mock-data.ts today → APIs/DB later)
```

Guiding rule: **new capabilities should produce the existing `Lead` / `Project`
shapes** (`lib/types.ts`). If a discovery API or AI scorer outputs those types,
the entire UI keeps working untouched.

---

## Future Lead Discovery API Workflow

**Goal:** replace seeded demo leads with real candidate businesses discovered
from the project's target + signals, then scored and verified.

**Intended pipeline:**
1. Project intake (exists today) →
2. Lead discovery (Google Places / web search) → raw candidates
3. Normalization → `Lead` shape with raw signals attached
4. AI lead scoring → fills `ScoreBreakdown` → `scoreFromBreakdown()` (exists)
5. Source verification → sets honest `verification` + per-evidence `confidence`
6. Persist as a "run" tied to the project; surface in the leads view (exists)

**Where it plugs in:**
- New `lib/discovery/` module called from a store action like
  `runDiscovery(projectId)` (to be added in `lib/store/store.ts`).
- Keep results flowing through `computeAggregates()` and the existing leads UI.
- Honor the trust principle: never label an inference as `Verified`.

**Paste your exact Lead Discovery API prompt here:**

```
<!-- PASTE LEAD DISCOVERY / AI SCORING / VERIFICATION PROMPT HERE -->
```

---

## Future PDF / Report Builder Workflow

**Goal:** turn the existing HTML report (`/reports/[reportId]`) into a polished,
downloadable PDF, with saved versions.

**Intended pipeline:**
1. User clicks "Download PDF" in the report toolbar (button placeholder-ready)
2. Server route renders the report HTML (reuse the existing report components)
3. HTML → PDF via a headless renderer (e.g. Playwright/Chromium or a hosted
   HTML-to-PDF service)
4. Store the artifact + metadata as a `Report` version (see `DATABASE_SCHEMA.md`)
5. Show report version history per project

**Where it plugs in:**
- The report UI is already print-optimized and componentized
  (`components/report/*`), so the same components render server-side for PDF.
- Add a `lib/pdf/` module and a route like `app/api/reports/[id]/pdf`.
- Track generated reports in the `reports` table (already specced) and add an
  optional `version` + `artifact_url`.

**Paste your exact PDF / Report Builder prompt here:**

```
<!-- PASTE PDF / REPORT BUILDER PROMPT HERE -->
```

---

## Later capabilities this structure should support

- Real lead discovery APIs (Places / web search)
- AI lead scoring (per-dimension, feeding `scoreFromBreakdown`)
- Source verification (confirm facts, assign confidence)
- HTML-to-PDF generation
- Polished downloadable PDF reports
- Saved API runs (discovery runs tied to a project)
- Report version history
