# Workflow — `emergency-rollback`

The live site is broken. Get back to a known-good state fast, then debug.

## When to use

- User reports "nothing loads" or a clearly broken behavior on https://krystal-one.vercel.app.
- The latest deploy on Vercel shows a build failure that the user needs out of immediately.
- You discover a recent commit introduced a regression.

## Prerequisites

- Vercel account access.
- The user is at her computer (you can't run Vercel actions for her).

## Steps

### 1. Confirm the symptom

Ask the user:

- What URL?
- Blank page, error message, loading spinner, or other?
- Browser console errors (Cmd+Option+I → Console tab, paste top of stack)?

If it's a cache issue (the deploy is fine, browser is showing old code), Cmd+Shift+R fixes it. Try that first before rolling back.

### 2. Roll back via Vercel (fast)

Tell the user:

1. Open https://vercel.com/ → krystal project → Deployments tab.
2. Find the most recent deploy with a green checkmark *before* the broken one.
3. Click the `...` menu on that deploy → **Promote to Production**.
4. Confirm.

Vercel swaps production to that deploy in ~10 seconds. The site is back.

This is the fastest path to restore service. Use it before debugging.

### 3. Roll back via git (slower, more permanent)

If the rollback needs to also revert the code (e.g. the broken commit is on `main`):

```bash
cd ~/code/krystal
git log --oneline -10                 # find the last good commit hash
git revert <bad-commit-hash>          # creates a new commit that undoes the bad one
git push                              # triggers a fresh GitHub Action → Vercel deploy
```

Don't use `git reset --hard` on `main`. It rewrites shared history.

### 4. Debug locally

With production safe, dig into what went wrong:

- Check the GitHub Actions tab for the failed build (if it failed at deploy).
- Check the browser console for runtime errors (if the build succeeded but the app crashed).
- Read the latest commits in `git log` to find candidates.

### 5. Fix forward

Once you understand the issue:

- Fix the code locally.
- `npx tsc --noEmit` to confirm clean.
- Use the `ship` skill to push.
- Verify the deploy.

### 6. Log it

Add the regression + fix to `docs/known_issues.md` so the next agent learns from it. Append a session_log entry describing what broke and what fixed it.

## Verification

- https://krystal-one.vercel.app loads in incognito (rules out cache).
- The reflection flow (Welcome → Check-in → Wheel → Done → Journal) works end-to-end.
- The home page renders the grape (if user has a streak ≥ 2).
- No console errors in dev tools.

## Common causes of "nothing loads"

From session_log:

- **Infinite re-render from a Zustand selector returning a fresh array.** Fixed by using stable `byId` selector + `useMemo` hook. Pattern in `useEquippedSlugs`.
- **Missing Supabase migration.** The store gracefully handles a missing table; rarely the actual cause. But check anyway.
- **TS error breaking the build.** GitHub Actions fails; production stuck on old deploy. Vercel deploys page shows the error.
- **Vercel rewrite pattern regression.** `vercel.json` has historically been fragile. Don't introduce regex lookaheads — Vercel doesn't support them.
