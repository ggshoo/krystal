# Skill — `context-load`

> Load the current project state into the agent's context as efficiently as possible at the start of a session.

## Purpose

A new agent (or the same agent after a compaction) needs to rebuild a working understanding of Krystal fast. This skill defines the minimal-read path.

## When to invoke

- First turn of every session.
- After any context compaction.
- When the user says "what's the state of this project?" or similar.

## Inputs

- Nothing. This is a read-only kickoff.

## Outputs

- Internal context: project summary, current priorities, open decisions, blockers, next recommended tasks.
- Optional: a 3–5 line out-loud summary for the human confirming what you understood.

## Procedure

Read these files, in this order, until you have enough context:

```
1. ai_context/START_HERE.md         (~2 min — onboarding, standards)
2. ai_context/current_state.md      (~3 min — source of truth)
3. ai_context/handoff.md            (~1 min — previous AI's notes)
4. ai_context/active_tasks.md       (~1 min — backlog)
```

Stop after step 3 for small tasks. Continue to step 4+ for bigger work.

If the user asks a specific question (e.g. "how does auth work?"), jump straight to the relevant doc:

- Architecture questions → `docs/ARCHITECTURE.md`
- Product / scope questions → `docs/PRD.md`
- "Why did we…" questions → `docs/DECISIONS.md`
- Vocabulary → `ai_context/glossary.md`
- Bugs / debt → `docs/known_issues.md`

## Example usage

```
User: (starts new session) hey

AI: [reads START_HERE.md, current_state.md, handoff.md]

Caught up. Quick recap:
- Backpack system code is complete but unpushed locally. You need to push and
  run migration 007 in Supabase to make the hat function.
- D-001 (streak rule) is awaiting your decision.
- I can keep going on the PNG grape refactor if you've generated the assets.

What's the next thing you want to tackle?
```

## Failure modes

- **Reading every doc in the repo** wastes the user's tokens and your context. Stop at step 3 unless deeper context is needed.
- **Restating verbatim** what's in the docs back to the user. Summarize.
- **Skipping handoff.md** loses everything the previous agent learned. Always read it.
