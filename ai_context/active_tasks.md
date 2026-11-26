# Active Tasks

Prioritized backlog. Newest items go in their priority bucket, not at the bottom.

**Status legend:** `todo` · `in-progress` · `blocked` · `done` (move to `session_log.md` when done)

---

## P0 — Ship-blocking / immediate

| ID | Task | Status | Owner | Depends on |
|---|---|---|---|---|
| T-001 | User pushes pending commits (backpack + day-2 grape + mobile fix + AI framework + PostHog + v2.0 PRD + rename) | `blocked` | Gigi | Git lock removal + `npm install` |
| T-002 | User runs `supabase/007_inventory.sql` migration in Supabase SQL editor | `blocked` | Gigi | None — just needs human action |
| V4-001 | Build Quick Capture screen (`app/quick-capture.tsx` — big 8-emotion picker, optional one-line, save in ≤30s) | `todo` | next AI | PRD v2.0 approved (done) |
| V4-002 | Update home CTA: primary → "quick check-in", secondary link → "take a deeper reflection" | `todo` | next AI | V4-001 |

## P1 — Active work

| ID | Task | Status | Owner | Depends on |
|---|---|---|---|---|
| T-003 | Resolve D-001 streak rule (strict vs lenient) | `blocked` | Gigi to decide | None |
| T-004 | Refactor `GrapeCompanion` for hybrid PNG/SVG rendering | `blocked` | next AI | Gigi generating PNG assets |
| T-005 | Generate AI grape PNG variants (default + 7 emotions + 3 intensity) | `in-progress` | Gigi | None |

### PM portfolio (parallel track)

| ID | Task | Status | Owner | Depends on |
|---|---|---|---|---|
| PM-001 | Wire up PostHog + instrument north star + 4 input metrics | `done` | Claude | shipped 2026-07-05 — see session_log |
| PM-001a | Create PostHog account + paste API key into `.env` | `todo` | Gigi | None (posthog.com → new project → copy key) |
| PM-002 | Draft day-2 grape A/B test case study skeleton (before experiment runs) | `todo` | Gigi | None |
| PM-003 | Recruit 5 user interview participants | `in-progress` | Gigi | copy ready in `docs/pm_portfolio/recruit_copy.md` |
| PM-004 | Conduct 5 user interviews | `todo` | Gigi | PM-003 |
| PM-005 | Synthesize interview findings into `case_studies/5_interviews.md` | `todo` | Gigi | PM-004 |
| PM-006 | Run day-2 grape A/B test (6 weeks) | `blocked` | Gigi | PM-001a |
| PM-007 | Update day-2 case study with experiment results | `blocked` | Gigi | PM-006 |
| PM-008 | Build `/roadmap` public page on crystal.gigihsu.com | `todo` | next AI | None |
| PM-009 | Build `/process` page on portfolio site documenting AI Generalist workflow | `todo` | Gigi | gigihsu.com being live |
| PM-010 | Generate 10 AI grape PNG assets via Nano Banana | `in-progress` | Gigi | checklist ready in `docs/pm_portfolio/grape_generation_checklist.md` |
| PM-011 | Refactor `GrapeCompanion.tsx` for hybrid PNG (home) / SVG (corner) once PM-010 lands | `blocked` | next AI | PM-010 |

## P2 — Next reasonable improvements

| ID | Task | Status | Owner | Depends on |
|---|---|---|---|---|
| T-006 | Add "today's entry" preview card on home (user gets confused not seeing journal on home) | `todo` | next AI | T-003 (depends on streak rule UX) |
| T-007 | Build Phase 3 items: bow tie (day 10), scarf (day 21), glasses (day 30), crown (day 100) | `todo` | next AI | T-004 (item rendering needs to be established) |
| T-008 | Animation when an item is earned (sparkle + fly-into-backpack) | `todo` | next AI | T-007 |
| T-009 | Fix pre-existing TS warnings in `EmotionWheel.tsx` (style prop on Path/Text) | `todo` | next AI | None — small refactor, use inline style replacement |
| T-010 | "Claim reward" tap to make day-5 unlock feel like an event | `todo` | next AI | T-002 |

## P3 — Nice-to-have / explore later

| ID | Task | Status | Owner | Depends on |
|---|---|---|---|---|
| T-011 | PostHog analytics integration (logged in ROADMAP, never started) | `todo` | future | None |
| T-012 | Email push notification for journal-streak warning (don't break the chain) | `todo` | future | Email infra decision |
| T-013 | Export user data (GDPR-style, downloadable JSON) | `todo` | future | None |
| T-014 | "Helpdesk" grape — reusable companion in future help flows | `todo` | future | None (GrapeCompanion is already structured for this) |

## Dependencies graph

```
T-001 (push) ───┐
T-002 (migration) ──┤
                    ├─→ T-004 (hybrid PNG) ─→ T-007 (more items) ─→ T-008 (animations)
T-005 (generate) ───┘                                    └─→ T-010 (claim event)

T-003 (streak rule) ─→ T-006 (today's entry preview)
```

## Maintenance

- When you start a task, change status to `in-progress` and add your name as owner.
- When you finish a task, move it to `session_log.md` (under that session's "Completed" list) and delete it from here.
- Discovered work goes into the appropriate priority bucket. Don't pile everything into P3.
- Reorder tasks when priorities shift — match the order in `current_state.md → Current Priorities`.
