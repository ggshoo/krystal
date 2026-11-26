# Crystal — Current State (Source of Truth)

> **This file is the authoritative source of truth for the project.**
> If anything in `README.md`, `docs/`, `STATUS.md`, or `LOVABLE.md` contradicts this file, **this file is correct**. Note the discrepancy and surface it in the next session.
>
> Every AI agent must read this file first and update it after meaningful work.

**Last Updated By:** Claude (Cowork) · `Sonnet 4.6` (v2.0 positioning shift — ICP locked, dual-mode Quick Capture, multi-surface roadmap, user-facing rename to "crystal")
**Last Updated Date:** 2026-07-05

---

## Project Summary

**Crystal** is a daily emotional reflection web/mobile app. It guides users through a quick mind/body/heart check-in, then a Roberts wheel emotion picker, then a Plutchik intensity ladder, then optional journal prompts. Over time, users build a personal history of reflections and a "streak" relationship with a grape companion character.

**Live URL:** https://crystal.gigihsu.com
**Owner:** Gigi Hsu (`gigi.hsu@yale.edu`)
**Purpose:** Portfolio headline piece for job search + a personal reflection practice tool.

---

## Current Architecture

```
Expo SDK 54 (React Native + Web)
  └─ Expo Router (file-based routing under app/)
  └─ TypeScript strict mode
  └─ NativeWind 4 (Tailwind for RN, dark mode via media query)
  └─ Zustand (client state — reflection draft, auth, inventory)
  └─ react-native-svg (grape companion, emotion wheel)

Supabase (mtnallsztrulbrmbvbpf.supabase.co)
  └─ Postgres + RLS on every user-owned table
  └─ Anonymous auth (upgradeable to email via updateUser)
  └─ Tables: profiles, daily_checkins, journal_entries,
             emotion_categories/subcategories/details,
             user_inventory (pending migration 007)

Deploy
  └─ GitHub Actions → Vercel on push to main
  └─ Web build via `npx expo export` + `vercel deploy --prebuilt`
  └─ Secrets: VERCEL_TOKEN, VERCEL_ORG_ID, VERCEL_PROJECT_ID
```

Detailed schema and folder map in `docs/ARCHITECTURE.md`.

---

## Features Complete

**Core reflection loop:**
- Welcome (first-time name capture + returning greeting)
- Mind / Body / Heart check-in (3 screens, 1–10 ratings, auto-advance)
- Emotion wheel — Roberts 7 primaries (Plutchik-mapped)
- Secondary + tertiary pickers (variable per primary)
- Plutchik intensity ladder (3 levels per primary)
- Done confirmation
- Journal screen with 6 prompts (optional), educational content per emotion
- One reflection per day per user (upsert pattern)
- Anonymous auth with email upgrade
- History view (expandable cards, journal preview)

**Companion + rewards system:**
- Grape SVG companion with per-emotion face variations + color tint
- Glossy 3D-style rendering (radial gradients, multi-shine)
- Persistent corner grape on flow screens (pathname-aware)
- Journal-content streak counting (not just check-in)
- Day-2 grape unlock on home (first reward milestone)
- Inventory store with reconcile-on-load logic
- Backpack screen with equip/unequip
- Knit beanie ("hat") item unlocks at day 5 — code complete, **needs migration 007 to function**

**Platform polish:**
- Dark mode (system-following via NativeWind media query)
- Mobile-responsive rating row (flex-1 share, not fixed 44px)
- Per-screen FadeIn animations
- CSS keyframe grape float animation (web)
- GitHub Actions auto-deploy

---

## Features In Progress

| Feature | Status | Owner | Notes |
|---|---|---|---|
| AI-generated PNG grape variants | designing | Gigi | Decided on Google Nano Banana for character consistency; master prompt written; user needs to generate and drop into `assets/grape/` |
| Hybrid PNG + SVG grape architecture | not started | Claude (next session) | PNG for home hero, SVG for in-flow corner grape |
| Streak rule decision (lenient vs strict) | open | Gigi to decide | See **Open Decisions** below |
| Phase 3 reward items | designed | unscheduled | bow tie (day 10), scarf (day 21), glasses (day 30), crown (day 100) |
| Home "today's entry" preview card | proposed | Gigi to decide | Show today's journal content on home so user doesn't have to navigate to history |

### PM Portfolio track (parallel to product work)

| Feature | Status | Owner | Notes |
|---|---|---|---|
| North star metric defined | ✓ done | Gigi | % of WAU hitting 5-day journal streak. See `docs/pm_portfolio/README.md` |
| PostHog instrumentation | not started | next AI + Gigi | Wire up north star + 4 input metrics. ~90 min. P0 for portfolio track. |
| User interview round 1 (5 participants) | not started | Gigi | Playbook in `docs/pm_portfolio/user_interviews.md`. Recruiting first. |
| Day-2 grape A/B test | designed | Gigi to run | Design in `docs/pm_portfolio/ab_testing.md`. Blocked on PostHog. |
| First case study (day-2 grape) skeleton | not started | Gigi | Frame the hypothesis + design BEFORE the experiment finishes |
| Public `/roadmap` page on crystal.gigihsu.com | not started | next AI | Mirror `docs/ROADMAP.md` as a route |
| Portfolio site `/process` page | not started | Gigi | Document the AI Generalist workflow as her unfair advantage |
| Skills mapping tracker | ✓ initialized | Gigi maintains | `docs/pm_portfolio/skills.md` — update after each milestone |

---

## Known Issues

| # | Severity | Issue | Notes |
|---|---|---|---|
| 1 | medium | Streak counts journal-content days but History shows all check-in days — they diverge confusingly | User-facing confusion. See Open Decisions. |
| 2 | low | Pre-existing TS warnings in `components/EmotionWheel.tsx` (lines 138, 154) about `style` on `Path`/`Text` from react-native-svg | Works at runtime; harmless type complaint. |
| 3 | low | Vercel rewrite uses `:path*` (not negative lookahead) — works but limits future routing complexity | See `vercel.json`. |
| 4 | low | Anonymous auth keys posted in chat (Supabase anon key is public-safe but worth rotating) | Anon JWTs are designed for client exposure; not urgent. |
| 5 | infra | Sandbox bash sometimes leaves `.git/index.lock` behind. User has to `rm -f .git/index.lock` before pushing. | Workaround documented; not a code bug. |

Full list and tech debt in `docs/known_issues.md`.

---

## Current Priorities

In order:

1. **Run Supabase migration `007_inventory.sql`** to unlock the hat/backpack feature (code is shipped-ready but inert without the table).
2. **Decide streak rule** (strict journal-content vs lenient check-in) — Gigi to pick. See Open Decisions.
3. **Generate AI grape PNG assets** using the master prompt in `docs/grape_image_prompts.md` (Gigi's job — external tool). Then refactor `components/GrapeCompanion.tsx` for hybrid PNG/SVG.
4. **Push pending commits.** Code in folder includes infinite-re-render fix, backpack system, day-2 unlock, mobile rating fix, journal prompt rename. None of it is in production yet.
5. **Verify deployed site after push** (Cmd+Shift+R hard refresh). User reported "nothing loads" before fix — root cause was `equippedSlugs()` returning fresh array every render. Now fixed via `useEquippedSlugs` memoized hook.

---

## Active Branches

| Branch | Purpose | Status |
|---|---|---|
| `main` | Production. Auto-deploys to Vercel. | Behind local — has uncommitted backpack + grape fixes |

No feature branches active. All work happens on `main` with direct commits.

---

## Open Decisions

These need a human decision before a future AI can confidently proceed.

### D-001 · Streak rule: strict or lenient? — RESOLVED 2026-07-05

**Decision:** Lenient (any day with a check-in counts toward the "N days in a row" on home). Strict journal-content streak is retained as the north star measurement in PostHog. Two streaks now coexist: one for user motivation (lenient, on home), one for portfolio analytics (strict, in PostHog).

**Applied in:** `app/index.tsx` — now uses `computeStreak` for display; `computeJournalStreak` still available and fires alongside as `streak_snapshot.journal_streak`.

**Reversible by:** swap `computeStreak` back to `computeJournalStreak` in `app/index.tsx` if user data shows motivation drops when the strict rule is applied.

### D-002 · Grape rendering: SVG-only, PNG-only, or hybrid?

**Question:** The current SVG grape can't match the glossy 3D AI-rendered look of the reference images Gigi wants.

**Trade-off:**
- SVG: small, dynamic tinting, smooth crossfade. Looks cartoony.
- PNG: photorealistic glossy look. No dynamic tinting. Need 8+ assets.
- Hybrid: PNG for high-visibility surfaces (home), SVG for small dynamic ones (flow corner).

**Recommendation in code:** Hybrid. Gigi agreed verbally; awaiting PNG assets.

**Decided by:** Gigi (verbal). Awaiting assets.
**Action when assets land:** refactor `GrapeCompanion.tsx` to load PNG for size ≥ 80, SVG otherwise.

### D-003 · Image generation model

**Question:** Which image-gen model for consistent grape variants?

**Recommendation:** Google Nano Banana (Gemini 2.5 Flash Image) — free, strong character consistency.

**Decided by:** Gigi (verbal: "lets go with option 3" = hybrid + Nano Banana).
**Action:** Gigi generates PNGs externally and drops into `assets/grape/`.

---

## Next Recommended Tasks

For the next AI agent to pick up, ordered by impact:

1. **Read this file + `START_HERE.md` + `handoff.md`** before doing anything else.
2. **Help Gigi push pending code.** Tell her the exact command (`rm -f .git/index.lock && git add . && git commit -m "..." && git push`). She has the bug-fix + backpack + day-2-unlock all queued locally.
3. **Confirm migration 007 ran.** If not, walk Gigi through pasting `supabase/007_inventory.sql` into Supabase SQL editor.
4. **Pick up D-001** — ask Gigi to choose strict vs lenient streak, then apply the change.
5. **If Gigi delivers PNG grape assets**, refactor `GrapeCompanion.tsx` per D-002.
6. **Tackle the home "today's entry" preview** if Gigi mentions it again — she expressed confusion that her journal doesn't appear on home.

---

## Recent Changes

Newest first. See `ai_context/session_log.md` for full history.

| Date | Change | Files |
|---|---|---|
| 2026-07-05 | v2.0 positioning: ICP locked (busy early-career, therapy-adjacent), dual-mode capture (Quick + Deep), multi-surface roadmap (PWA → SMS → iOS → Watch), reminders framework, user-facing rename to "crystal" | `docs/PRD.md`, `app.json`, `app/index.tsx` (wordmark + grape message) |
| 2026-07-05 | Post-hiatus reboot: PostHog wired end-to-end; interview recruit copy drafted; grape generation checklist drafted; D-001 resolved (lenient) | `lib/analytics.ts`, `app/_layout.tsx`, `app/(flow)/done.tsx`, `app/(flow)/journal.tsx`, `app/index.tsx`, `app/backpack.tsx`, `package.json`, `.env.example`, `docs/pm_portfolio/recruit_copy.md`, `docs/pm_portfolio/grape_generation_checklist.md` |
| 2026-06-12 | PM portfolio track stood up: north star metric, user interview playbook, A/B testing guide, skills tracker | `docs/pm_portfolio/*` (4 files) |
| 2026-06-12 | AI Generalist extension: prompt library (`ai_prompts.md`) + constitution-style START_HERE | `ai_context/ai_prompts.md`, `ai_context/START_HERE.md`, `ai_context/communication_protocol.md` |
| 2026-06-12 | AI collaboration framework scaffolded (`ai_context/`, `.ai/`, this file) | `ai_context/*`, `.ai/*`, `README.md` |
| 2026-06-12 | Fixed infinite re-render in inventory store. Added `useEquippedSlugs` memoized hook. | `store/useInventoryStore.ts`, all GrapeCompanion consumers |
| 2026-06-12 | Backpack system built (Phase 2): migration, inventory store, backpack screen, hat SVG on grape | `supabase/007_inventory.sql`, `store/useInventoryStore.ts`, `app/backpack.tsx`, `components/GrapeCompanion.tsx`, `lib/inventory.ts` |
| 2026-06-12 | Day-2 grape unlock + day-5 hat foreshadow + day-1 "welcome" copy + streak switched to journal-content basis | `app/index.tsx`, `lib/history.ts`, `lib/inventory.ts` |
| 2026-06-12 | Mobile rating row fix: flex-1 share instead of fixed 44px (1-10 buttons cut off on phone) | `components/CheckInStep.tsx` |
| 2026-06-12 | Journal prompt rename: "What do you need?" → action-oriented agency prompt | `app/(flow)/journal.tsx`, `app/history.tsx` |
| 2026-06-11 | Dark mode infrastructure + dark variants across all screens | `tailwind.config.js`, `app/_layout.tsx`, `app/(flow)/_layout.tsx`, all screens |
| 2026-06-11 | Default grape rendering: pleasant closed smile (was rendering as frown — SVG Y-axis flipped) | `components/GrapeCompanion.tsx` |
| 2026-06-11 | Home grape always shows default — was mirroring today's emotion which read as "creepy" to Gigi | `app/index.tsx` |
| 2026-06-11 | Grape moved above title on home (centered) + persistent corner grape across flow | `app/index.tsx`, `app/(flow)/_layout.tsx` |
| 2026-06-10 | GitHub Actions auto-deploy + Vercel project link via env vars | `.github/workflows/deploy.yml`, `vercel.json` |

---

## Maintenance Note

When updating this file:

- Bump **Last Updated By** and **Last Updated Date** at the top.
- Move stale "In Progress" items to "Complete" or remove them.
- Move stale "Recent Changes" items to `ai_context/session_log.md` (keep last 10 here).
- Don't grow the "Known Issues" table forever — when a row is fixed, delete it (the fix lands in commit history).
- Anything that requires a human decision belongs in **Open Decisions**, not buried in prose.
