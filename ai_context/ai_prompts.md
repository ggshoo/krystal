# AI Prompts Library

Copy-pasteable prompts for any AI tool (Claude, Codex, ChatGPT, Cursor, Windsurf, Gemini). Pick the prompt matching the situation, paste, send.

These prompts assume the AI has filesystem access to this repo. If your tool doesn't, attach the relevant `ai_context/*.md` files manually.

---

## 1. Standard Project Kickoff

> Use when an AI joins this project for the first time, or starts a new session on it.

```
You are joining the Krystal project as a generalist AI agent. You are
responsible for planning, architecture, coding, testing, documentation,
debugging, and the handoff to the next AI. Do not assume another agent
will do any of these — you own all of it for this session.

Step 1 — Read these files, in this exact order, before doing anything:
  1. ai_context/START_HERE.md   (the agent constitution)
  2. ai_context/current_state.md (the source of truth)
  3. ai_context/handoff.md       (what the previous AI was doing)
  4. ai_context/active_tasks.md  (prioritized backlog)

Step 2 — Confirm understanding by telling me, in 3–5 sentences:
  - The project in one sentence
  - The highest-priority task right now
  - What the previous AI left unfinished
  - Any blockers requiring my (human) action

Step 3 — Identify the next logical step from active_tasks.md (P0 first).
If nothing in P0 is unblocked, move to P1.

Step 4 — Execute that step. Ask me before making any decision that
contradicts an existing entry in docs/DECISIONS.md or that requires
my input (open D-NNN decisions in current_state.md).

Step 5 — Before ending the session, update these four files:
  - ai_context/current_state.md (timestamp + recent changes)
  - ai_context/active_tasks.md  (status updates)
  - ai_context/handoff.md       (overwrite with notes for next AI)
  - ai_context/session_log.md   (append a new dated entry)

Begin with Step 1.
```

---

## 2. Fresh AI Takeover

> Use when switching from one AI system to another (Claude → Codex, Codex → ChatGPT, ChatGPT → Claude, etc.). Forces the new agent to *verify* what the prior agent left rather than trust it.

```
You are taking over the Krystal project from a different AI system. The
previous agent's notes may be incomplete, outdated, or wrong. Your job
is to verify before you continue.

Step 1 — Read the agent constitution and project state:
  1. ai_context/START_HERE.md
  2. ai_context/current_state.md
  3. ai_context/handoff.md
  4. ai_context/session_log.md (last 2 entries)

Step 2 — INDEPENDENTLY VERIFY. Do not trust prior conclusions.
  - Run `npx tsc --noEmit`. Are there errors beyond the two known
    EmotionWheel.tsx warnings?
  - Run `git log --oneline -10`. Do the recent commits match what
    current_state.md claims is "Recent Changes"?
  - Read the actual code in the files current_state.md says are
    "Features Complete". Are they actually working as described?
  - Check supabase/ for any unrun migrations referenced in code.
  - Spot-check at least one Open Decision (D-NNN) — has it silently
    been resolved without the docs being updated?

Step 3 — REPORT to me in writing:
  - What matches the docs ✓
  - What contradicts the docs ✗
  - What's unclear and needs the human to clarify
  - Any assumptions you're rejecting and why

Step 4 — Repair the docs to reflect reality. Update current_state.md.
Note your revisions in session_log.md under "Notable corrections".

Step 5 — ONLY after the repair, propose what to do next. Wait for my
go-ahead before executing.

The goal is to catch documentation rot before it propagates. Be skeptical.
```

---

## 3. Emergency Handoff

> Use when the AI is hitting context limits, about to be interrupted, or you can see the conversation drifting. Forces an immediate hand-off snapshot.

```
STOP coding. You are about to lose context (token limit, session timeout,
or other interruption). The next AI will have NO access to this conversation.

Immediately, before anything else, update these four files:

1. ai_context/current_state.md
   - Bump "Last Updated By" and "Last Updated Date"
   - Add anything completed this session to "Features Complete"
   - Add anything in progress to "Features In Progress" with status
   - Add a row to "Recent Changes" (top of the table)

2. ai_context/handoff.md
   - OVERWRITE this file entirely with YOUR notes for the next AI
   - List every file you touched this session
   - List exact commands the human should run
   - List blockers (who needs to do what)
   - List warnings (gotchas, footguns, half-finished work)
   - List the precise next steps

3. ai_context/session_log.md
   - APPEND a new dated entry at the top
   - Include what changed, what was decided, what's open

4. ai_context/active_tasks.md
   - Mark completed tasks done
   - Add discovered tasks
   - Update statuses

Write each update assuming the next AI is a competent stranger. Be specific.
File paths, command blocks, "see line X of Y.tsx".

If you've made code changes that aren't committed, tell the human the
exact `git add . && git commit -m "..." && git push` command at the
top of handoff.md.

Do this NOW. Then stop.
```

---

## 4. Continue Working

> The most-common prompt. One word. Expect this to be the bulk of usage.

```
Continue.
```

The AI is expected to interpret this as:

> Read `ai_context/current_state.md` and `ai_context/handoff.md`.
> Identify the next priority. Execute autonomously. Update project memory
> when done.

If the AI doesn't behave this way on "Continue", invoke the **Standard Project Kickoff** prompt instead — the agent constitution wasn't loaded.

Variants the AI should treat the same way:

- "What's next?"
- "Keep going."
- "Pick up where you left off."
- "Continue from the handoff."

---

## 5. Review and Audit

> Use when you want a critical pass over the project, not new code. Output is a report, not changes.

```
You are auditing the Krystal project. Do NOT write new feature code.
Your output is a written report.

Step 1 — Read context:
  1. ai_context/current_state.md
  2. docs/ARCHITECTURE.md
  3. docs/DECISIONS.md
  4. docs/known_issues.md

Step 2 — Audit dimensions:

  Architecture
    - Does the code organization match docs/ARCHITECTURE.md?
    - Are there cross-layer dependencies that shouldn't exist?
    - Are abstractions earning their complexity?

  Code quality
    - Run `npx tsc --noEmit`. Any new errors?
    - Naming conventions consistent?
    - Any obviously duplicated logic?
    - Any code paths that look unreachable?

  Documentation
    - Is current_state.md actually current? Spot-check 3 entries.
    - Are there features in code not documented anywhere?
    - Are there docs describing features that don't exist?
    - Is the glossary missing any project-specific terms?

  Security
    - Do all user-owned Supabase tables have RLS?
    - Are env vars handled correctly (no hardcoded keys)?
    - Is anonymous auth flow safe (no privilege escalation paths)?

  Testing
    - This project has no automated test suite (known). Is the manual
      verification path documented somewhere usable?

  Tech debt
    - Is docs/known_issues.md complete? What's missing?
    - Any "TODO" / "FIXME" / "HACK" comments in the code that aren't
      tracked?

Step 3 — Produce a report:

  1. Top 5 issues by impact (with file references)
  2. Top 5 improvement opportunities (with effort estimates)
  3. Anything missing from current_state.md
  4. Suggested updates to active_tasks.md
  5. Suggested new ADRs for docs/DECISIONS.md

Step 4 — Update docs/known_issues.md with any newly-discovered issues.
Use the existing ID prefix conventions (B-NNN, TS-NNN, D-NNN, I-NNN).

Do NOT begin remediation. The human reviews the report and prioritizes.
```

---

## 6. Project Recovery

> Use when project state is unclear, the docs feel stale, or you suspect documentation rot. Rebuilds project memory from the actual repo.

```
Project state is unclear. The documentation may be stale or wrong. Your
job is to rebuild ai_context/current_state.md from scratch based on what's
actually in the repository. Do NOT trust the existing docs until you've
verified them.

Step 1 — Inspect the actual repository.
  - `ls -la` at the root. What top-level directories exist?
  - `ls app/ app/(flow)/` — what screens exist?
  - `ls components/ lib/ store/ supabase/` — what modules exist?
  - `cat package.json` — what dependencies are pinned?
  - `git log --oneline -30` — what's been committed recently?
  - `npx tsc --noEmit` — does the project compile?

Step 2 — Read the existing docs (for comparison, not as truth):
  - ai_context/current_state.md
  - ai_context/handoff.md
  - docs/ARCHITECTURE.md
  - docs/DECISIONS.md

Step 3 — Identify discrepancies. For each:
  - Files in code that aren't in docs (missing documentation)
  - Features in docs not in code (over-promised documentation)
  - Recent commits that aren't in the Recent Changes table
  - Open Decisions that have been silently resolved
  - Anything in handoff.md that contradicts the current code state

Step 4 — Rebuild ai_context/current_state.md based on what's actually true.
Preserve the required section structure (see the existing file). Be honest
about what's complete, in progress, and broken.

Step 5 — Reset ai_context/handoff.md with a clean "recovery handoff" note
explaining that the project memory was rebuilt and what changed during the
recovery.

Step 6 — Append a session_log.md entry titled "Project Recovery" listing
every correction you made and why.

Be skeptical. Be thorough. Documentation rots silently — your job is to
catch it before another agent acts on a lie.
```

---

## Maintenance

When you add a new prompt template:

1. Number it (continue the sequence — 7, 8, 9…).
2. Title + one-sentence description above the code block.
3. The prompt itself must be a single, copy-pasteable block.
4. Test the prompt with at least one AI tool before adding it.
5. Update `START_HERE.md → Prompt library` if the new prompt is one any agent should know about.

When you retire a prompt that no longer makes sense, delete it. Don't leave dead templates cluttering the library.
