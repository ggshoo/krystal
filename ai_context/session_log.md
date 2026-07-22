# Session Log

Append-only historical record of major work sessions. Newest entries at the top.

Each entry should answer: what changed, what was decided, what's left.

---

## 2026-07-05 (late-late) · Quick Capture shipped — dual-mode is live in code

**Agent:** Claude (Cowork) · `Sonnet 4.6`
**Branch:** `main` (uncommitted local changes)

### Completed

- **D-004 resolved** — nothing required in Quick Capture (no emotion, no note — just tap save). Updated in PRD §13.
- **Migration `supabase/008_quick_capture.sql`** — made `mind_score / body_score / heart_score / emotion_id` nullable on `daily_checkins`; added `capture_mode` discriminator ('quick' | 'deep' with default 'deep'), `quick_emotion_primary` (constrained text), `quick_note` (text). Existing rows default to 'deep' safely.
- **`lib/history.ts`** — HistoryEntry gains capture_mode + quick_* fields; deep fields are nullable. Switched joins from `!inner` to left joins so Quick Capture rows don't get filtered out. shapeRow handles all new fields.
- **`lib/analytics.ts`** — `trackCheckinSaved` signature updated to require `capture_mode`; mind/body/heart/emotion_primary are now optional so Quick Capture can fire without them.
- **`app/(flow)/done.tsx`** — passes `capture_mode: 'deep'` on save.
- **`app/quick-capture.tsx`** — new screen. 7 primary emotion buttons in a wrap grid (2 rows), optional one-line text, big save button. Saves via upsert against `daily_checkins`. Renders success state with grape mirroring picked emotion. "Take a deeper reflection instead" secondary link on success screen.
- **`app/index.tsx`** — home CTA rewired as state machine: no-entry → "quick check-in" (primary) + "take a deeper reflection" (secondary). Quick-only-today → "add a deeper reflection" (primary) + "edit quick check-in" (secondary). Deep-today variants unchanged.
- **`app/history.tsx`** — Quick captures render distinctly: no Mind/Body/Heart triplet (hidden when null), a "Quick" pill next to the date, quick_emotion_primary shown as color chip + name, quick_note shown as a quote. "just checking in" fallback when no emotion picked.
- **`app/(flow)/journal.tsx` + `welcome.tsx`** — hydrate sites updated to coalesce `null` → `undefined` since HistoryEntry types widened.

`npx tsc --noEmit` clean except the two pre-existing `EmotionWheel.tsx` warnings and the expected `posthog-js` unresolved (goes away on `npm install`).

### Decisions made

- **D-004 (Quick Capture requires nothing).** Documented + applied.
- **Data model:** unified — Quick Capture and Deep Reflection share `daily_checkins`. Alternatives considered: separate `quick_captures` table (rejected — would fork one-per-day + streak logic).
- **Quick emotion storage:** free-text with CHECK constraint on the 7 primary slugs, rather than a FK to `emotion_categories`. Rationale: primary catalog is tiny + static; text avoids an extra join on every history read.
- **CTA state machine:** four states (no entry / quick only / deep no journal / deep + journal). Preserves the existing Deep Reflection UX while making Quick Capture the default for fresh visits.

### Open at log-off

- **Blocked on human action:** Supabase restore, `npm install`, PostHog account creation, migration 007 + 008 runs, PNG grape generation, push.
- **Reminders (all surfaces)** — user confirmed direction, but explicitly said "wait until Quick Capture is shipped." Next session.
- **SMS check-in** — explicitly deferred to after Quick Capture ships.
- **`grape` foreignKey `!inner` change** — I switched to left join. Should still work for Deep Reflection (row has an emotion_id, so the join resolves). Verify in production once migration 008 lands.

### Notable

- The whole Quick Capture flow is one screen and ~250 lines. Compared to the 9-screen Deep flow, this IS the ICP win — even before we ship it, the code size tells the story.
- The home CTA state machine is portfolio material. Four-state decision logic with clear user-value ranking. Would be a nice diagram for the case study.
- Migration 008 is architecturally interesting: dual-mode-in-one-table pattern is common in real products but rarely written up. Worth flagging for the case-study library later.

---

## 2026-07-05 (late) · v2.0 positioning shift — ICP, dual-mode, multi-surface, rename

**Agent:** Claude (Cowork) · `Sonnet 4.6`
**Branch:** `main` (uncommitted local changes stack, on top of the earlier 2026-07-05 work)
**Context:** Gigi came back after another break. Named her ICP: busy young adult, early career, still figuring themselves out, in therapy or considering it. Wants seamless multi-surface access + frequent but not annoying reminders. Also renaming Krystal → Crystal (user-facing only).

### Completed

- **User-facing rename Krystal → crystal.** Touched: `app.json` (expo.name), `app/index.tsx` (wordmark + grape's day-2 message). Internal identifiers (folder, slug, bundle IDs, git remote, Supabase project) unchanged — full internal rename deferred to when Gigi registers a proper domain.
- **PRD v2.0 shipped.** `docs/PRD.md` fully rewritten:
  - Sharpened target user from "anyone" to specific ICP (§2).
  - Added core problem framing (distraction, cognitive load, perfectionism about self-care) (§3).
  - Added dual-mode capture: Quick Capture (30s default) + Deep Reflection (5min opt-in) (§4).
  - Multi-surface roadmap: Web → PWA → SMS → iOS TestFlight → Widget → Watch → Android (§4).
  - Reminders framework — carefully designed, escalation-to-disengagement rules, off-by-default (§5).
  - Preserved calm/warm/encouraging soul from v1.0 (§6). Added "seamless" as new principle.
  - Documented current state (v0.3) + v0.4 build order (§10, §11).
  - New open decisions D-004, D-005, D-006 (Quick Capture rules, therapy-export scope, SMS cost model).
- Updated project memory: `current_state.md → Last Updated + Recent Changes`, `active_tasks.md` (added V4-001 and V4-002 for Quick Capture as new P0).

### Decisions made / captured

- **ICP is locked** as of this session. Documented in PRD §2.
- **Dual-mode over single-mode-simplification** — keep the depth of the current flow but demote it to "sometimes mode". Default becomes Quick Capture. Documented in PRD §4.
- **Reminders are back in scope** (v1.0 explicitly excluded them). But designed under strict rules (§5): user-picked anchor time, one/day max, graceful escalation-to-off, action-oriented content, off-by-default at first launch. Explicitly disallows streak-shaming copy.
- **Multi-surface phased approach** — PWA + SMS are the near-term wins that don't require leaving Expo/web. iOS native + Widget + Watch are Phase B/C, gated on either time or actual demand from users.
- **Full internal rename deferred.** Change what users see today; do the folder/slug/URL sweep when Gigi registers `crystal.app` or similar.

### Open at log-off

- All prior uncommitted work still queued (PostHog, D-001, framework docs, portfolio prep).
- **Supabase still paused** — needs restore.
- **PostHog account** — needs signup + key paste.
- **npm install** — pending (posthog-js not resolved yet).
- **V4-001 (Quick Capture screen)** — not started. Next session's biggest lift.
- **PWA setup** — not started.

### Notable

- The old PRD's "explicitly out of scope: notifications, reminders, Apple Watch, web version, dark mode" list was directly contradicted by user's new requirements. That's not a failure — it's healthy product evolution. Preserved the calm-tone principles that WEREN'T contradicted.
- The reminders §5 framework is portfolio material. It's a defensible position on a hotly debated PM topic (should wellness apps push notifications at all?) with a specific rules-based answer. Worth turning into a mini case study later.
- "crystal" reads visually softer than "krystal" — the K was doing work for uniqueness but against warmth. Right call.

---

## 2026-07-05 · Post-hiatus reboot — PostHog wired, D-001 resolved, portfolio prep

**Agent:** Claude (Cowork) · `Sonnet 4.6`
**Branch:** `main` (uncommitted local changes)
**Context:** Gigi returning after a break. Supabase project was paused (free-tier auto-pause after ~7 days idle). Framework held up — she came back and I could reconstitute the full state from `current_state.md` + `handoff.md` in one read.

### Completed

- **D-001 resolved** — flipped to lenient (`computeStreak` on home). Both streak flavors coexist: lenient for user-facing motivation, strict (`computeJournalStreak`) for the north-star measurement in PostHog. Justification: history + streak should match to avoid the "I have 3 in history but 2 on home" confusion Gigi hit. Depth signal is captured in analytics rather than punished in UX.

- **PostHog wired end-to-end** (PM-001 done):
  - Added `posthog-js` to `package.json` (needs `npm install`).
  - Created `lib/analytics.ts` — thin named-event wrapper. Silent no-op when key is missing.
  - Init + identify in `app/_layout.tsx`.
  - `trackCheckinSaved` fires in `app/(flow)/done.tsx` after successful save.
  - `trackJournalSaved` fires in `app/(flow)/journal.tsx` with `filled_field_count` for depth cohorting.
  - `trackStreakSnapshot` fires on every home load with both streak flavors.
  - `trackItemToggled` fires when equipping/unequipping the hat.
  - Env vars documented in `.env.example`.

- **Interview recruit copy drafted** (PM-003 unblocked): `docs/pm_portfolio/recruit_copy.md` with LinkedIn, Reddit, X, Discord variants + the follow-up DM template + a recruit tracking table.

- **Grape generation checklist drafted** (PM-010 unblocked): `docs/pm_portfolio/grape_generation_checklist.md` with a 20-minute run-of-show for Nano Banana. Includes fallback tactics for character-drift issues.

### Decisions made

- **D-001 (lenient streak):** documented in `current_state.md` and applied.
- **PostHog integration approach:** thin abstraction layer (`lib/analytics.ts`) rather than raw SDK calls at every site. Payoff: renaming events later doesn't require a repo-wide sweep, and swapping providers is a single-file change.
- **PostHog SDK choice:** `posthog-js` (web) rather than `posthog-react-native`. Krystal ships to web only right now; if she goes native later, the abstraction file swaps trivially.

### Open at log-off

- **PM-001a** — Gigi needs to create a PostHog project and paste the key into `.env`. Analytics silently no-ops until this happens (dev/preview builds still work).
- **Supabase pause** — Gigi needs to restore the paused project via the Supabase dashboard before the deploy works.
- **PNG grape assets** (PM-010) — Gigi runs the checklist externally in Google AI Studio.
- **npm install needed** — the `posthog-js` dependency won't resolve until she runs it.
- **Migration 007** — unclear if it was ever actually applied. Verify in Supabase Table Editor after restore.

### Notable

- The framework paid off on the first real test — she said "I haven't worked on this in a while" and I could pick up the state from `current_state.md` + `handoff.md` without asking her to re-explain anything. The AI Generalist principle "assume future AI agents know nothing about prior conversations" survived contact with reality.
- The `lib/analytics.ts` file has a top-of-file docstring explaining the whole event vocabulary — so any future agent editing tracking has a single point of orientation.
- Interview recruit copy explicitly warns against paying $50+ for participants — cheap trap for solo founders.

---

## 2026-06-12 · PM portfolio track stood up

**Agent:** Claude (Cowork) · `Sonnet 4.6`
**Branch:** `main`

### Completed
- Created `docs/pm_portfolio/` with 4 files: README, user_interviews, ab_testing, skills.
- Locked in north star: % of WAU hitting 5-day journal streak.
- Locked in 4 input metrics: day-1 retention, day-2 retention, journal completion rate, hat unlock rate.
- Wrote a user-interviews playbook from scratch (Gigi has never done research interviews).
- Wrote an A/B testing beginner's guide with the day-2 grape experiment worked example end-to-end.
- Initialized the skills mapping tracker with claim/evidence/status for ~15 PM skills.
- Added the PM portfolio sub-track to `current_state.md → Features In Progress`.
- Added 9 PM tasks (PM-001 through PM-009) to `active_tasks.md`.

### Decisions made
- Skills tracker uses traffic-light system: 🟢 evidence-backed (safe to claim), 🟡 in progress, 🔴 don't lead with this.
- Two-moves-this-week framing: PostHog + day-2 case study skeleton first, then interviews + experiment.
- For Krystal's traffic level, accept directional A/B tests + qualitative pairing rather than chasing statistical purity.

### Open at log-off
- Same as previous entries plus the new PM-NNN tasks.

### Notable
- Day-2 grape unlock is now positioned as the FIRST experiment, not just a feature. The work she's already done becomes a portfolio artifact, not just a build item.
- The AI Generalist framework itself was marked as a 🟢 evidence-backed PM skill (AI fluency). The thing we built today is recursively useful for her job hunt.

---

## 2026-06-12 · AI Generalist framework extension

**Agent:** Claude (Cowork) · `Sonnet 4.6`
**Branch:** `main`

### Completed
- Created `ai_context/ai_prompts.md` with 6 standardized prompts (Kickoff, Takeover, Emergency Handoff, Continue, Audit, Recovery).
- Rewrote `ai_context/START_HERE.md` as a 7-principle constitution: every AI is a generalist, project memory beats conversation memory, write for a competent stranger.
- Updated `ai_context/communication_protocol.md` to add `ai_prompts.md` to the file role table.
- Added `Prompt library` section to `START_HERE.md` so agents recognize prompt patterns even when the human paraphrases.

### Decisions made
- The protocol now explicitly treats prompt templates as part of the agent infrastructure, not just documentation.
- The constitution principles are listed in `START_HERE.md` as non-negotiable for all agents (Claude / Codex / ChatGPT / Cursor / Windsurf / Gemini).

### Open at log-off
- Same as previous entry: T-001 (push pending), T-002 (migration), T-003 (streak rule), T-005 (PNG assets).

### Notable
- The "Continue Working" prompt is intentionally one word. If an agent doesn't behave correctly on a bare "continue", the constitution wasn't loaded and the human should re-invoke the Kickoff prompt.

---

## 2026-06-12 · AI collaboration framework + backpack system + bug fixes

**Agent:** Claude (Cowork) · `Sonnet 4.6`
**Branch:** `main`
**Duration:** Long session, multiple compactions

### Completed

- Set up `ai_context/`, `.ai/`, and `docs/known_issues.md` for multi-AI collaboration
- Built backpack + inventory system end-to-end (migration + store + screen + grape SVG hat + home wiring)
- Added day-2 grape unlock + day-1 "welcome" message + day-5 hat foreshadow
- Switched home streak to journal-content basis (`computeJournalStreak`)
- Fixed mobile rating row (was cutting off 9 & 10 at 375px viewport)
- Renamed journal prompt: "What do you need?" → "What can you do, in your control, to provide what you need right now?"
- Fixed default grape mouth — was rendering as a frown (SVG Y-axis math was inverted). Added explanatory comment so the next agent doesn't re-flip it.
- Removed default brows (reference shows brow-less pleasant face).
- Upgraded stem to brown twiggy + added a second leaf.
- Stopped home grape from mirroring today's emotion (was reading "creepy"). Home grape is now permanently default.
- Fixed inventory store infinite re-render: `equippedSlugs()` method returned fresh array each call → React saw new identity → re-rendered → called again → page froze. Replaced with `useEquippedSlugs()` memoized hook on `byId`.
- Dark mode infrastructure across all screens (system-following via NativeWind media query)
- Grape moved above the title on home, centered. Corner grape persists across flow.
- Auto-deploy via GitHub Actions to Vercel was already working from earlier sessions.

### Decisions made

- **D-002 (grape rendering):** Hybrid PNG + SVG. PNG for home hero, SVG for in-flow corner grape. Gigi agreed verbally.
- **D-003 (image-gen model):** Google Nano Banana for character consistency. Gigi to generate externally.
- **Streak rule:** Currently strict (content-required). D-001 is open — Gigi may flip to lenient.

### Open at log-off

- T-001: User hasn't pushed yet (git lock issue from sandbox; clear with `rm -f .git/index.lock`).
- T-002: Migration 007 hasn't been applied in Supabase.
- T-003: Streak rule decision pending.
- T-005: AI grape PNG assets pending.

### Notable debugging

- Spent significant time on the "smile/frown" bug. The default mouth path I shipped was actually a frown. Root cause: SVG Y increases downward, so a smile needs control-point Y *larger* than endpoint Y (curve dips down in middle = ∪ = smile). The previous code had control Y *smaller* than endpoints (∩ = frown). I rendered a live preview widget in chat to confirm visually before changing code.
- The "nothing loads" crash had a different root cause: a Zustand selector returning a fresh array every render → infinite loop. Future agents: never select a method from a Zustand store that returns an array. Use a derived hook with `useMemo`.

---

## Pre-2026-06-12 · Foundation (summarized from `STATUS.md` and `DECISIONS.md`)

This log entry consolidates ~6 months of pre-framework work that was previously tracked in `STATUS.md` (now archival) and `docs/DECISIONS.md` (still authoritative for the historical record).

### Built

- Expo + TS + Expo Router + NativeWind + Zustand + Supabase scaffold
- Anonymous auth + RLS on all user-owned tables
- Roberts emotion wheel (7 primaries, ~72 emotions in catalog)
- Plutchik intensity ladders
- Welcome → Check-in (Mind/Body/Heart) → Wheel → Done → Journal flow
- One-reflection-per-day enforcement (upsert pattern)
- History view (expandable cards)
- Email upgrade flow from anonymous
- GitHub Actions auto-deploy to Vercel
- Grape companion (initial SVG version with multiple emotion variants)

### Outdated docs to retire eventually

- `STATUS.md` — was the original snapshot file. Replaced by `ai_context/current_state.md`. Keep around for now but don't update it.
- `LOVABLE.md` — historical migration plan to Lovable platform. Project stayed in Expo; this doc is obsolete but useful as a reference for the data model. Mark as archival.

---

## Template for new entries

```markdown
## YYYY-MM-DD · One-line summary

**Agent:** Name + model (e.g. "Claude (Cowork) · Sonnet 4.6")
**Branch:** branch name
**Duration:** rough time / # of compactions

### Completed
- bullet
- bullet

### Decisions made
- D-NNN reference if it touched an open decision

### Open at log-off
- references to active task IDs

### Notable debugging / context worth preserving
- anything the next agent will thank you for
```
