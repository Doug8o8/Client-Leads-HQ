# Database Schema (Supabase-ready)

Phase 1 uses in-memory mock data shaped to map cleanly onto these tables. The
TypeScript source of truth is `lib/types.ts`. When Supabase is added (Phase 2),
these become Postgres tables with the same field names.

## Entity relationships

```
organizations 1───* profiles
organizations 1───* projects
projects      1───* leads
leads         1───* lead_evidence
projects      1───* reports
projects      1───* exports
```

## Tables

### organizations
| column | type | notes |
| --- | --- | --- |
| id | uuid (pk) | |
| name | text | |
| created_at | timestamptz | |

### profiles
| column | type | notes |
| --- | --- | --- |
| id | uuid (pk) | maps to auth.users in Phase 2 |
| org_id | uuid (fk → organizations) | |
| full_name | text | |
| email | text | |
| role | text | `owner` \| `member` |

### projects
| column | type | notes |
| --- | --- | --- |
| id | uuid (pk) | |
| org_id | uuid (fk) | |
| name | text | |
| status | text | `Draft` \| `Researching` \| `Ready` \| `Report sent` |
| business | jsonb | `{ businessName, website, industry, location }` |
| target | jsonb | `{ description, idealIndustries[], companySize, geography }` |
| signals | jsonb | `{ idealSignals[], badFitSignals[], services[] }` |
| report | jsonb | `{ reportName, goal, leadsDesired }` |
| created_at / updated_at | timestamptz | |

> `business/target/signals/report` may be normalized into their own tables
> later; jsonb keeps Phase 1↔2 migration simple.

### leads
| column | type | notes |
| --- | --- | --- |
| id | uuid (pk) | |
| project_id | uuid (fk) | |
| company, website, public_profile_url | text | |
| location, city, state, industry | text | |
| phone | text | |
| email | text null | |
| score | int | 0–100, derived from breakdown |
| score_label | text | `Excellent` \| `Strong` \| `Review` \| `Weak` \| `Remove` |
| breakdown | jsonb | `ScoreBreakdown` (see LEAD_SCORING.md) |
| why_it_fits, need_reason | text | |
| decision_maker | text | enum, see types |
| decision_maker_name | text null | |
| business_age | text | enum |
| verification | text | `Verified` \| `Estimated` \| `Inferred` \| `Unknown` |
| outreach | jsonb | `{ hook, rationale }` |
| risk_notes | text | |
| included_in_report | bool | |

### lead_evidence
| column | type | notes |
| --- | --- | --- |
| id | uuid (pk) | |
| lead_id | uuid (fk) | |
| label, detail | text | |
| confidence | text | `Confirmed` \| `Estimated` \| `Inferred` |
| source_url, source_label | text | |

> In Phase 1 evidence is embedded in the lead object as `evidence[]`.

### reports
| column | type | notes |
| --- | --- | --- |
| id | uuid (pk) | |
| project_id | uuid (fk) | |
| title | text | |
| generated_at | timestamptz | |
| stats | jsonb | `{ totalReviewed, strongLeads, averageScore, verifiedCount }` |

### exports
| column | type | notes |
| --- | --- | --- |
| id | uuid (pk) | |
| project_id | uuid (fk) | |
| format | text | `csv` |
| rows | int | |
| created_at | timestamptz | |

## Row-Level Security (Phase 2)

Every table carries `org_id` (directly or via `project_id`). RLS policies scope
all reads/writes to the caller's organization.
