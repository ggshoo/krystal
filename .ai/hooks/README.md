# Hooks

Hooks are AI-runtime triggers that fire on specific events (session start, file edit, etc.). This folder documents which hooks would be valuable for Krystal so any AI runtime can be configured consistently.

## Recommended hooks

### `on-session-start`

**Trigger:** When a new agent session begins.

**Action:** Auto-invoke the `context-load` skill (reads `START_HERE.md`, `current_state.md`, `handoff.md` in that order).

**Why:** Ensures every agent starts from the same baseline of context. Saves the user from having to ask "do you know what we were working on?"

**Maintenance:** If you change the read order in `context-load`, this hook automatically picks up the change. No edits needed here.

### `on-session-end`

**Trigger:** When the agent is about to log off (user says "we're done", session naturally ends, etc.).

**Action:** Auto-invoke the `session-end` skill (updates `current_state.md`, `active_tasks.md`, `handoff.md`, `session_log.md`).

**Why:** The single biggest failure mode in multi-AI handoff is the previous agent forgetting to write its notes. This hook makes that update non-optional.

**Maintenance:** Update if the list of mandatory end-of-session files changes.

### `pre-commit` (project-level, not AI-specific)

**Trigger:** Before any git commit.

**Action:** Run `npx tsc --noEmit` and reject the commit if new TS errors appear (the two `EmotionWheel.tsx` warnings are allowed; anything beyond that fails).

**Why:** Production deploys via GitHub Actions; a broken build leaves the live site stuck on the last successful version. Cheaper to catch at commit time.

**Maintenance:** This would be implemented as a `.husky/pre-commit` or `.git/hooks/pre-commit` script — not yet installed. Logged as T-009-adjacent in `ai_context/active_tasks.md`.

### `on-file-edit:supabase/`

**Trigger:** When any file in `supabase/` is modified by the AI.

**Action:** Prompt the AI to remind the user that the migration must be run manually in the Supabase SQL editor before the next deploy.

**Why:** Code changes that depend on a new table/column are silent failures otherwise — the deploy succeeds but the feature is inert until the migration runs.

**Maintenance:** If we ever automate migration execution, this hook can be retired.

### `on-file-edit:store/`

**Trigger:** When any Zustand store under `store/` is modified.

**Action:** Inject a reminder into the AI's context: "Never select a method that returns a fresh array — use a `byId`-style stable selector + `useMemo`. See `useEquippedSlugs` for the canonical pattern."

**Why:** We hit an infinite re-render bug from `equippedSlugs()` returning a new array each call. Easy mistake to repeat. This hook prevents recurrence.

**Maintenance:** Update if a new anti-pattern in Zustand usage is discovered.

## Implementation status

These are **specifications**. Not all of them are wired to any specific AI runtime yet. The `session-end` and `context-load` hooks are the highest leverage — if you're configuring a new agent, start with those.

## How to add a new hook

1. Document it in this file with: Trigger / Action / Why / Maintenance.
2. Implement it in whichever runtime your agent uses (Claude Code, Cursor, etc.).
3. Note the change in `ai_context/session_log.md`.
4. If the hook references a skill, make sure the skill exists in `.ai/skills/`.
