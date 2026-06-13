# Skill — `session-end`

> A guided checklist for ending an AI work session correctly. Use this before logging off any session that touched code.

## Purpose

Forces the four mandatory end-of-session updates so the next agent doesn't lose context.

## When to invoke

- Before ending a session where any file in `app/`, `components/`, `lib/`, `store/`, or `supabase/` was modified.
- When the human says "wrap up", "we're done", "log off", or similar.
- Before any long-running async task you can't finish in the current turn.

## Inputs

- The list of files you changed this session.
- The current branch.
- Any decisions made or deferred.
- Any blockers you hit.

## Outputs

Updates to four files (in this exact order):

1. `ai_context/current_state.md` — bump `Last Updated By` + `Last Updated Date`; move work into Complete / In Progress; add to top of Recent Changes table (cap at 10 entries — older rows go to session_log).
2. `ai_context/active_tasks.md` — mark completed tasks done (move to session_log), add discovered tasks in the right priority bucket, reorder if priorities shifted.
3. `ai_context/handoff.md` — **overwrite entirely** with your handoff. Use the template at the top of the file.
4. `ai_context/session_log.md` — **append** a new dated entry (newest at top). Use the template at the bottom of that file.

## Procedure

```
1. List the files you changed this session.
2. Re-read current_state.md and identify which sections need updates.
3. Apply updates to current_state.md (work, recent changes, priorities, decisions).
4. Update active_tasks.md (mark done, add discovered, reorder).
5. Overwrite handoff.md with your handoff notes.
6. Append a dated entry to session_log.md.
7. Run `npx tsc --noEmit` to confirm no new TS errors before logging off.
8. Tell the human the exact git commands to push (do NOT push yourself):

   rm -f ~/code/krystal/.git/index.lock
   cd ~/code/krystal && git add . && git commit -m "<concise message>" && git push
```

## Example usage

```
User: alright that's enough for today, log off

AI: Running session-end skill.

[Updates current_state.md — moves backpack system from In Progress → Complete,
 adds to Recent Changes table, bumps timestamp]
[Updates active_tasks.md — marks T-005 done, adds discovered T-015]
[Overwrites handoff.md with notes for next AI]
[Appends new session_log.md entry dated 2026-06-12]

Done. Four mandatory files updated. To ship:

   rm -f ~/code/krystal/.git/index.lock
   cd ~/code/krystal && git add . && git commit -m "feat: backpack system" && git push
```

## Failure modes

- **Skipping any of the four files** breaks the next agent. Don't skip.
- **Writing handoff before updating current_state** can leave them inconsistent. Do current_state first.
- **Pushing on behalf of the user** is forbidden. Always give the commands and let her run them.
