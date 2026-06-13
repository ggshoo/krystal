# START HERE — AI Agent Constitution

You are an AI coding assistant entering the Krystal project. Read this entire file before doing anything. It defines what is expected of you and what every other agent who came before or comes after will do.

---

## The Constitution

These principles apply to every AI agent — Claude, Codex, ChatGPT, Cursor, Windsurf, Gemini, and any future agent. They are non-negotiable.

### 1. Every AI agent is a generalist.

You are responsible for **planning, architecture, coding, testing, documentation, debugging, and the handoff to the next AI**. Do not assume another agent will pick up any of these. You own all of it for the duration of your session.

If you don't know how to do one of them, learn it from the docs in this repo, or ask the human. Do not defer it to the next agent.

### 2. Read `current_state.md` before beginning work.

`ai_context/current_state.md` is the source of truth. Any AI that starts work without reading it is operating on assumptions. Assumptions cause regressions.

### 3. Update project memory before ending work.

Before you log off, update these four files **without exception**:

1. `ai_context/current_state.md`
2. `ai_context/active_tasks.md`
3. `ai_context/handoff.md`
4. `ai_context/session_log.md`

Project memory is the only thing that survives across sessions. Conversation memory does not. Treat the files as more important than this chat.

### 4. Project memory is more important than conversation memory.

The previous agent's conversation is gone. Yours will be gone too. The only persistent state is the repo. Write everything down. Write it for a competent stranger who has none of your context.

### 5. Leave the project in a better state than you found it.

If you noticed something broken, document it (`docs/known_issues.md`). If you fixed something undocumented, document the fix. If you discovered a useful pattern, capture it in the right doc. Small contributions to project memory compound.

### 6. Document decisions, not just code changes.

A line of code shows *what* changed. A decision record shows *why*. Future agents will need the why. When you make a non-obvious choice — a tradeoff, a library pick, a refactor direction — write it in `docs/DECISIONS.md` as a new ADR. When you defer a decision, write it in `ai_context/current_state.md → Open Decisions` so the next agent doesn't quietly make it for you.

### 7. Assume future AI agents know nothing about prior conversations.

This is the most important principle. Every prompt you write to the next agent must be self-contained. Every handoff note must include file paths, exact commands, and the "why" behind decisions. If your note assumes the next AI remembers something from a chat — your note is broken.

---

## What this project is

Krystal — a daily emotional reflection web/mobile app. Expo + React Native + TypeScript + Supabase, deployed as web to Vercel. Live at https://krystal-one.vercel.app. One human owner: Gigi Hsu.

Full project summary in `ai_context/current_state.md → Project Summary`.

---

## Read order at session start

| Order | File | Time | Why |
|---|---|---|---|
| 1 | This file (`START_HERE.md`) | 2 min | The constitution |
| 2 | `ai_context/current_state.md` | 3 min | Source of truth |
| 3 | `ai_context/handoff.md` | 1 min | Previous AI's notes |
| 4 | `ai_context/active_tasks.md` | 1 min | Prioritized backlog |
| On demand | `docs/ARCHITECTURE.md`, `docs/DECISIONS.md`, `ai_context/glossary.md`, `docs/known_issues.md` | varies | When you need them |

Steps 1–3 are mandatory. Step 4 is mandatory if you intend to do work.

---

## Coding standards

- **TypeScript strict mode.** Run `npx tsc --noEmit` before pushing. Tolerated pre-existing errors: 2 warnings in `components/EmotionWheel.tsx` only.
- **NativeWind 4 utility classes** for styling. Existing tokens (`bg-cream`, `text-ink`, `text-muted`, `bg-accent`, `bg-surface`) + their `dark:` variants. Add new tokens to `tailwind.config.js`.
- **Zustand stores** under `store/`. Never select a method that returns a fresh array — causes infinite re-renders. Use `byId`-style stable selectors + `useMemo` derivations. Canonical example: `useEquippedSlugs` in `store/useInventoryStore.ts`.
- **Expo Router** for navigation. Routes are file-system based under `app/`.
- **Supabase RLS** on every user-owned table. Every new table needs a migration in `supabase/00N_*.sql` with policies.
- **Comments explain WHY, not WHAT.** The code shows what. Earn the comment with tradeoffs, constraints, and non-obvious decisions.
- **No emojis in committed code** unless the human asks.
- **Lowercase copy.** The product voice is lowercase, soft, conversational.

---

## Testing expectations

- No automated test suite (acknowledged tech debt — `D-001` in `docs/known_issues.md`).
- Verification path: `npx tsc --noEmit` → visual smoke test in browser or Expo Go → push → Vercel auto-deploys → human verifies on live site.
- For visual changes, render inline in chat using `show_widget` (if available) before pushing.
- For SVG changes, double-check Y-axis math: Y increases downward, smile = control Y *larger* than endpoint Y. (We've shipped a frown thinking it was a smile. Don't be that agent.)

---

## Handoff process (end of session)

This is non-negotiable. Before logging off, do all four:

### 1. Update `ai_context/current_state.md`

- Bump `Last Updated By` and `Last Updated Date` at the top.
- Move new work into "Features Complete" or "Features In Progress".
- Add a row to the top of "Recent Changes" (keep last 10 — older rows move to `session_log.md`).
- If you introduced a tradeoff requiring human decision, add it to "Open Decisions" as `D-NNN`.

### 2. Update `ai_context/active_tasks.md`

- Mark completed tasks (move to `session_log.md`).
- Add discovered tasks in the right priority bucket.
- Reorder if priorities shifted.

### 3. Overwrite `ai_context/handoff.md`

- This file is overwritten each session — the audit trail lives in `session_log.md`.
- Use the existing structure.
- Include file paths, exact commands, blockers, gotchas.
- Write for a competent stranger.

### 4. Append to `ai_context/session_log.md`

- Newest entry at the top.
- Use the template at the bottom of the file.
- Append-only — never delete prior entries.

If you don't have time for all four, minimum: `current_state.md` + `handoff.md`. The other two can be partially reconstructed; the state file cannot.

---

## Prompt library

`ai_context/ai_prompts.md` contains standardized prompts the human uses to instruct AI agents. Common ones:

| Prompt | When the human uses it |
|---|---|
| Standard Project Kickoff | New AI session on this project |
| Fresh AI Takeover | Switching from one AI system to another |
| Emergency Handoff | About to lose context |
| Continue Working | Most common — just "continue" |
| Review and Audit | Wants a critique, not new code |
| Project Recovery | Project state is unclear, needs rebuild |

You should recognize these patterns even when the human paraphrases. If the human says "continue", treat it as the Continue Working prompt — read project memory, pick up the highest-priority task.

---

## What NOT to do

- Don't push code, run trades, or change Supabase RLS on the human's behalf without explicit per-session permission. Provide the commands; she runs them.
- Don't edit `LOVABLE.md` or `STATUS.md` — those are marked archival.
- Don't create a second source-of-truth file (`status.md`, `progress.md`, `notes.md` — all forbidden). If `current_state.md` is missing a section you need, add it there.
- Don't silently fix things you noticed but weren't asked about. Log them in `docs/known_issues.md` and surface to the human.
- Don't generate unsolicited large refactors. Incremental, reversible changes.
- Don't quote prior conversations in your handoff. Conversations are gone. Write to the file.

---

## Quick map of important files

```
ai_context/                            ← persistent project memory
  START_HERE.md                        the constitution (this file)
  current_state.md                     ⭐ source of truth — read first
  handoff.md                           previous AI's notes for the next
  active_tasks.md                      prioritized backlog
  session_log.md                       historical record (append-only)
  ai_prompts.md                        prompt library
  communication_protocol.md            how agents collaborate via repo
  glossary.md                          project vocabulary

docs/                                  ← human-facing docs
  ARCHITECTURE.md                      system shape, folder map, data model
  PRD.md                               product requirements
  DECISIONS.md                         ADR log (append-only)
  technical_decisions.md               pointer at DECISIONS.md
  ROADMAP.md                           phased build plan (lightly stale)
  known_issues.md                      bugs, tech debt, opportunities
  grape_image_prompts.md               AI-image generation playbook

.ai/                                   ← AI runtime config
  skills/                              named procedures (context-load, session-end, ship)
  hooks/                               event triggers (on-session-start, on-session-end, …)
  workflows/                           multi-step plays (new-feature, add-reward-item, emergency-rollback)

app/                                   Expo Router screens
components/                            shared React components
store/                                 Zustand stores
lib/                                   pure utility modules (no JSX)
supabase/                              SQL migrations
```

---

Welcome. Read `current_state.md` next, then `handoff.md`. Make yourself useful. Write your handoff before you log off.
