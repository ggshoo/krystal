# START HERE — AI Onboarding for Krystal

You are an AI coding assistant entering the Krystal project. **Read this file in full before doing anything else.** It will take you under two minutes.

---

## What this project is

Krystal is a daily emotional reflection app (Expo + React Native + Supabase, deployed as web to Vercel). One human owner: Gigi Hsu. Live at https://krystal-one.vercel.app.

## What to read, in this order

1. **`ai_context/current_state.md`** — the source of truth. Everything else exists to support this. **If anything contradicts it, this file wins.**
2. **`ai_context/handoff.md`** — what the previous AI was working on and what to do next.
3. **`ai_context/active_tasks.md`** — the prioritized backlog.
4. **`docs/ARCHITECTURE.md`** — folder map, data model, key flows. Read on demand when you touch unfamiliar code.

You can stop reading after step 1 + 2 if your task is small. Read deeper as needed.

## Source of truth

The single canonical state file is:

```
ai_context/current_state.md
```

Treat it as **higher priority than any other documentation in the repo**. If `README.md`, `STATUS.md`, `LOVABLE.md`, or anything in `docs/` contradicts `current_state.md`, the state file is correct — note the discrepancy in your session log and surface it to the human owner.

## Current priorities (snapshot)

These shift over time. Always re-check `current_state.md → Current Priorities` for the live version. As of this writing:

1. Push pending local commits (backpack system, day-2 grape unlock, mobile rating fix, infinite-re-render fix).
2. Run Supabase migration `007_inventory.sql` so the hat/backpack functions.
3. Resolve open streak-rule decision (`D-001`).
4. Refactor `GrapeCompanion.tsx` to PNG hybrid once Gigi delivers AI-generated assets.

## Coding standards

- **TypeScript strict mode.** All new code must compile under `npx tsc --noEmit` with no new errors (two pre-existing warnings in `EmotionWheel.tsx` are tolerated).
- **NativeWind 4 utility classes** for styling. Use existing tokens (`bg-cream`, `text-ink`, `text-muted`, `bg-accent`, `bg-surface`) plus their `dark:` variants. New colors go in `tailwind.config.js`.
- **Zustand stores** under `store/`. Never select a method that returns a fresh array — it causes infinite re-renders. Use `byId`-style stable selectors + `useMemo` derivations or dedicated hooks (see `useEquippedSlugs` for the canonical pattern).
- **Expo Router** for navigation. Routes are file-system based under `app/`.
- **Supabase RLS** on every user-owned table. Every new table needs a migration in `supabase/00N_*.sql` with policies.
- **Comments**: write WHY, not WHAT. Code shows what. Comments earn their keep by explaining tradeoffs, constraints, and non-obvious decisions.
- **No emojis in committed code** unless the human asks (the cream/ink palette is the visual language). Lowercase, lowercase, lowercase in copy.

## Testing expectations

- This project has no automated test suite (yet). The verification path is: `npx tsc --noEmit` → visual smoke test in browser at `localhost:8081` (web build) or Expo Go on phone → push → Vercel auto-deploys → human verifies on krystal-one.vercel.app.
- For meaningful changes, run `npx tsc --noEmit` and confirm output is clean (or only contains the two pre-existing `EmotionWheel.tsx` warnings).
- When you change SVG geometry or any visual component, render it inline in chat using the `show_widget` tool (if available) so the human can review before pushing.
- Don't push for the human. Tell her the exact `git add . && git commit -m "..." && git push` command; she runs it.

## Handoff process

Before ending your session you **must** update these four files. No exceptions.

1. **`ai_context/current_state.md`** — bump timestamp, move new work into "Features Complete" or "In Progress", add to "Recent Changes" table.
2. **`ai_context/active_tasks.md`** — mark tasks done, add discovered tasks, reorder priorities if applicable.
3. **`ai_context/handoff.md`** — overwrite with what you were doing, current branch, blockers, and explicit "next steps for the next AI".
4. **`ai_context/session_log.md`** — append a new dated entry summarizing the session. Don't delete prior entries.

If you skip these updates, the next agent loses context and the user pays for re-discovery. Don't skip.

## How agents communicate via the repo

Full protocol in `ai_context/communication_protocol.md`. The two-line summary:

- **Read** `current_state.md` + `handoff.md` first.
- **Write** to `current_state.md` (state changes), `handoff.md` (next-AI instructions), `active_tasks.md` (backlog), and `session_log.md` (append-only history).

## What NOT to do

- Don't push code, run trades, or change Supabase row-level security policies on the human's behalf without explicit per-session permission.
- Don't edit `LOVABLE.md` or `STATUS.md` — those are historical/archival.
- Don't introduce a second source of truth file. If `current_state.md` is missing a section you need, add it to `current_state.md`, not somewhere else.
- Don't silently fix things you noticed but weren't asked about. Log them in `docs/known_issues.md` and surface to the human.
- Don't generate large unsolicited refactors. This project values incremental, reversible changes.

## Quick map of important files

```
ai_context/
  current_state.md           ⭐ source of truth — read first
  START_HERE.md              you are here
  handoff.md                 last AI's notes for the next
  active_tasks.md            prioritized backlog
  session_log.md             historical record
  communication_protocol.md  how agents collaborate via repo
  glossary.md                vocabulary (Roberts wheel, Plutchik, etc.)

docs/
  ARCHITECTURE.md            folder map, data model, flows
  PRD.md                     product requirements
  DECISIONS.md               historical decisions log (ADRs)
  technical_decisions.md     symlink-style pointer to DECISIONS.md
  ROADMAP.md                 phased build plan (lightly stale)
  known_issues.md            bugs + tech debt

.ai/
  skills/                    Claude Code skills for this project
  hooks/                     hook documentation
  workflows/                 named multi-step workflows

app/                         Expo Router screens
components/                  shared React components
store/                       Zustand stores
lib/                         pure utility modules (no JSX)
supabase/                    SQL migrations
```

Welcome. Be useful, leave the repo cleaner than you found it, and write your handoff before you log off.
