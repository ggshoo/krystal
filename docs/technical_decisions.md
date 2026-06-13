# Technical Decisions

> **The canonical decision log is `docs/DECISIONS.md`.** This file exists only because the AI collaboration framework spec asks for a `technical_decisions.md`. The actual ADRs live in `DECISIONS.md` — go read that.

If you find yourself updating this file, **stop**. Update `DECISIONS.md` instead, then come back here and make sure this pointer is still accurate.

---

## How to add a new Architecture Decision Record

1. Open `docs/DECISIONS.md`.
2. Append a new ADR following the existing format:

```markdown
## DECISION-NNN · Title

**Date:** YYYY-MM-DD
**Status:** Accepted | Superseded | Reversed

**Context:** What problem is this solving?

**Decision:** What did we choose?

**Alternatives considered:** What else did we look at?

**Trade-offs:** What are we giving up?

**Reasons for final choice:** Why this over the alternatives?
```

3. If the decision affects current behavior, also update `ai_context/current_state.md → Recent Changes`.

## Decisions awaiting input

Decisions that need human input live in `ai_context/current_state.md → Open Decisions` (D-001, D-002, ...). They graduate to `DECISIONS.md` once made.
