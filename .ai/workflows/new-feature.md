# Workflow — `new-feature`

Adding a new user-facing feature end-to-end.

## When to use

When the user describes a new feature and you've decided to build it.

## Prerequisites

- `current_state.md` is up to date (so you know what's already there).
- Any open decisions touching this feature are resolved or scoped.
- You have a clear definition of "done" — what the user will see when it works.

## Steps

### 1. Capture the feature in writing first

Before writing code, write a paragraph at the top of `ai_context/active_tasks.md` describing:

- What it does.
- What success looks like.
- Files likely to change.
- Any open decisions blocking it.

If the feature has product / UX significance, also add a section to `docs/PRD.md`.

### 2. Decide on data model changes

- Does this need a new Supabase table or column? → Write a new migration `supabase/00N_*.sql`. Add RLS policies. Tell the user she'll need to run it.
- Does this change existing TypeScript types? → Update `lib/history.ts` or relevant lib first.
- Does this need a new Zustand store? → Add under `store/`. Follow the `useEquippedSlugs` pattern: select stable `byId` map, derive arrays via `useMemo` hook.

### 3. Build incrementally

Order of work that's worked well for this project:

1. Pure utility functions (no JSX) in `lib/` — easy to test by reading.
2. Zustand store changes (state + reducers).
3. Shared components (`components/`).
4. Screen wiring (`app/`).
5. Visual polish (animations, dark mode variants).

### 4. Verify each layer

- `npx tsc --noEmit` after each change. Catch type errors early.
- For visual changes, render via `show_widget` in chat so the user can react before pushing.
- For Supabase changes, verify RLS policies allow the intended read/write before pushing.

### 5. Update the four mandatory files

Use the `session-end` skill. Don't skip.

### 6. Ship

Use the `ship` skill. Remind the user of any pending migrations.

## Verification

After deploy:

- Hard-refresh the live site.
- Walk through the user-facing flow as a normal user would.
- Confirm no regressions in adjacent features (especially the reflection flow and home page — touched by almost every change).

## Failure recovery

If something breaks in production:

- Use the `emergency-rollback` workflow.
- Then debug locally, fix, push again.
- Update `docs/known_issues.md` with what went wrong, so the next agent doesn't repeat it.
