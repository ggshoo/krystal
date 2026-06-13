# Workflows

Multi-step procedures that combine skills, file edits, and human handoffs. Workflows are higher-level than skills — a workflow can invoke multiple skills.

## Available workflows

| Workflow | When to use |
|---|---|
| [`new-feature.md`](./new-feature.md) | Adding a new user-facing feature |
| [`add-reward-item.md`](./add-reward-item.md) | Adding a new backpack item (hat, scarf, glasses, etc.) |
| [`emergency-rollback.md`](./emergency-rollback.md) | Production site is broken, need to get back to a known-good state |

## How to use a workflow

Open the workflow's markdown file. Each contains a numbered checklist. Walk through it top to bottom — do not skip steps unless explicitly marked optional.

## How to add a new workflow

1. Create a new `.md` file in this folder.
2. Use this structure:

```markdown
# Workflow — your-workflow-name

## When to use
## Prerequisites
## Steps
  1. ...
  2. ...
## Verification
## Failure recovery
```

3. Add a row to the table above.
4. Reference the workflow in `ai_context/handoff.md` if it's likely to be needed in the next session.
