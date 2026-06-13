# Session Log

Append-only historical record of major work sessions. Newest entries at the top.

Each entry should answer: what changed, what was decided, what's left.

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
