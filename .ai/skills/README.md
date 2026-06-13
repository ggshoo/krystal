# Skills

Reusable AI procedures specific to this project. Each skill is a focused, named procedure that any agent can invoke.

## Available skills

| Skill | When to use |
|---|---|
| [`context-load`](./context-load.md) | First turn of every session — rebuild project context efficiently |
| [`session-end`](./session-end.md) | Before logging off any session that touched code |
| [`ship`](./ship.md) | When the user wants to push to production |

## How to use a skill

If your AI runtime supports skills natively (e.g. Claude Code), invoke them by name. Otherwise, follow the procedure in the linked file.

## How to add a new skill

1. Create a new `.md` file in this folder.
2. Use this structure (matches the existing files):

```markdown
# Skill — `your-skill-name`

> One-sentence summary.

## Purpose
## When to invoke
## Inputs
## Outputs
## Procedure
## Example usage
## Failure modes
```

3. Add a row to the table above.
4. Mention the new skill in `ai_context/handoff.md` so future agents discover it.

## Maintenance

If a skill stops being useful, delete it — don't leave dead skills cluttering the catalog. Note the removal in `ai_context/session_log.md`.
