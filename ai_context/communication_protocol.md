# AI Communication Protocol

How AI agents collaborate through this repository. Every agent — Claude, Codex, ChatGPT, Cursor, Windsurf, Gemini, or future ones — should follow this protocol.

---

## The source of truth

There is exactly one canonical state file:

```
ai_context/current_state.md
```

**No other file may claim to be the source of truth.** If you find one that does, fold its content into `current_state.md` and reduce the other to a pointer.

If two files contradict, `current_state.md` is correct by definition. Note the discrepancy in your session log and surface it to the human.

---

## Read order (start of session)

| Order | File | Why |
|---|---|---|
| 1 | `ai_context/START_HERE.md` | Onboarding, coding standards, handoff process |
| 2 | `ai_context/current_state.md` | Authoritative state |
| 3 | `ai_context/handoff.md` | What the previous AI was doing |
| 4 | `ai_context/active_tasks.md` | Prioritized backlog |
| 5 (on demand) | `docs/ARCHITECTURE.md`, `docs/DECISIONS.md` | When you need to touch unfamiliar code |
| 6 (on demand) | `ai_context/glossary.md` | When you see a term you don't recognize |
| 7 (on demand) | `ai_context/session_log.md` | When you need history beyond the last session |

Steps 1–3 are required. Steps 4+ as needed.

---

## Write rules (end of session)

Before logging off, **every** agent must update these four files:

| File | What to write | Style |
|---|---|---|
| `current_state.md` | Bump timestamp, move features Complete/In Progress, top of Recent Changes table | Overwrite sections, keep file under ~500 lines |
| `handoff.md` | Overwrite with YOUR notes for the next AI | Overwrite entirely |
| `active_tasks.md` | Mark done tasks, add discovered ones, reorder | Edit in place |
| `session_log.md` | Append a new dated entry. Don't delete prior entries. | Append-only |

If you don't have time to do all four, at minimum do `current_state.md` + `handoff.md`. The other two can be reconstructed; the state file cannot.

---

## File roles

| File | Role | Read | Write | Notes |
|---|---|---|---|---|
| `ai_context/START_HERE.md` | Onboarding | Every session | Rarely (when process changes) | Stable; don't edit casually |
| `ai_context/current_state.md` | ⭐ Source of truth | Every session | Every session | Mandatory updates |
| `ai_context/handoff.md` | Inter-AI notes | Every session | Every session | Overwrite each time |
| `ai_context/active_tasks.md` | Backlog | Every session | Every session | Edit in place |
| `ai_context/session_log.md` | Historical record | On demand | Every session | Append-only |
| `ai_context/communication_protocol.md` | This file | First session only | Rarely | When protocol itself changes |
| `ai_context/glossary.md` | Vocabulary | On demand | When you introduce new terms | Append-only |
| `docs/ARCHITECTURE.md` | System reference | When touching unfamiliar code | When architecture changes | Authoritative for system shape |
| `docs/PRD.md` | Product reqs | When scope questions arise | When product changes | Authoritative for product |
| `docs/DECISIONS.md` | ADR log | On demand | When making major decision | Append-only ADRs |
| `docs/known_issues.md` | Bug + debt list | On demand | When you find or fix issues | Edit in place |
| `docs/ROADMAP.md` | Phased plan | Rarely | Rarely | Lightly stale, lower priority |
| `README.md` | Public-facing overview | Optional | When setup/stack changes | Keep concise |
| `LOVABLE.md` | Historical | Never | Never | Archival; do not update |
| `STATUS.md` | Historical | Never | Never | Replaced by `current_state.md` |

---

## What goes where

### `current_state.md`

- Project summary (1 paragraph)
- Architecture overview (1 small code block)
- Features complete (bulleted, factual)
- Features in progress (with owner)
- Known issues (top 5 only — link to `docs/known_issues.md` for full list)
- Current priorities (numbered list)
- Open decisions (numbered D-NNN with trade-offs)
- Next recommended tasks (for the next AI)
- Recent changes (last 10 only — older move to `session_log.md`)

### `handoff.md`

- What you were doing
- What you left in a working state (file paths)
- What needs to happen next (specific commands)
- Blockers (who/what)
- Context that's not obvious from the code

### `session_log.md`

- One dated section per session
- What changed (files + summary)
- Decisions made (D-NNN references)
- Open at log-off (task IDs)
- Notable debugging / learnings (for future agents)

### `active_tasks.md`

- Prioritized backlog (P0 → P3)
- Status + owner + dependencies per task
- Dependency graph if non-trivial

---

## Leaving instructions for the next AI

Use `handoff.md`. Be specific:

- Name the files you touched.
- Name the commands the human should run.
- Name the blockers and who needs to act on them.
- Note any "gotcha" you discovered (e.g., SVG Y-axis, Zustand selector identity).

Don't be cute about it — the next AI doesn't have your context. Write like you're briefing a competent stranger.

---

## Resolving conflicts

If you find documentation in conflict:

1. Treat `current_state.md` as correct.
2. Update the other doc to match (or reduce it to a pointer at the state file).
3. Log the discrepancy in `session_log.md` under "Notable debugging / context."
4. If the conflict is itself a decision the human needs to make, add it as an Open Decision (D-NNN) in `current_state.md`.

---

## What NOT to write

- Don't introduce a competing state file. (`status.md`, `current.md`, `progress.md` — all forbidden.)
- Don't bloat `current_state.md` past ~500 lines. Move detail to specific docs.
- Don't write process documentation in `handoff.md` — that's for active situation only.
- Don't delete from `session_log.md`. Append-only. History matters.

---

## Authority

This protocol document itself is editable, but changes affect every future agent's behavior. If you propose a change, add it as an Open Decision in `current_state.md` and get the human to approve before editing this file.
