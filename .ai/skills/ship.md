# Skill — `ship`

> Walk the user through pushing local commits to production.

## Purpose

Standardize the deploy flow. Push to `main` → GitHub Action → Vercel → live in ~2 min. The sandbox sometimes leaves a `.git/index.lock` behind, so this skill includes the cleanup step.

## When to invoke

- After completing meaningful code changes, when the user wants to ship.
- When the user says "ship", "push", "deploy", or "publish".
- At the end of a `session-end` flow.

## Inputs

- A concise commit message (5–10 words, present tense, prefixed with `feat:` / `fix:` / `chore:`).

## Outputs

- A copy-pasteable terminal block for the user.
- Post-push verification instructions.

## Procedure

1. Confirm `npx tsc --noEmit` is clean (only pre-existing `EmotionWheel.tsx` warnings are allowed).
2. Confirm the user's `current_state.md` reflects what's about to ship.
3. Produce a single shell block the user can paste:

```bash
rm -f ~/code/krystal/.git/index.lock
cd ~/code/krystal
git add .
git commit -m "<message>"
git push
```

4. After they push, tell them:
   - Wait ~2 minutes for the GitHub Action → Vercel.
   - Hard-refresh https://krystal-one.vercel.app with Cmd+Shift+R (bypass browser cache).
   - If the build fails, check GitHub Actions tab on the repo for the error.

5. If there's an unrun Supabase migration (e.g. `007_inventory.sql`), remind the user to:
   - Open https://supabase.com/dashboard/project/mtnallsztrulbrmbvbpf/sql/new
   - Paste the migration SQL
   - Click Run
   - Do this BEFORE the deploy lands, so the new code finds the table it expects.

## Example usage

```
User: ok let's ship

AI: Running ship skill.

[Verifies npx tsc --noEmit is clean]
[Confirms current_state.md reflects the changes]

Ship steps:

  rm -f ~/code/krystal/.git/index.lock
  cd ~/code/krystal
  git add .
  git commit -m "feat: pleasant default grape + dark mode"
  git push

Wait ~2 min, then hard-refresh https://krystal-one.vercel.app (Cmd+Shift+R).

Note: migration 007 should be run in Supabase BEFORE this deploy lands so the
backpack feature works on the first load. Want me to walk through that?
```

## Failure modes

- **Auto-running git commands** is forbidden. Always give the user the block; she runs it.
- **Forgetting the index.lock cleanup** means the push fails with a confusing error. Always include the `rm -f`.
- **Skipping the migration reminder** when one is pending breaks the deploy. Always check `supabase/` for unrun migrations.
