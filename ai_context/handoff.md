# Handoff — for the next AI

> Overwrite this file when you end your session. The audit trail lives in `session_log.md`.

**From:** Claude (Cowork) · `Sonnet 4.6`
**To:** Next agent (Claude / Codex / Cursor / Gemini / whoever)
**Date:** 2026-07-05
**Branch:** `main` (uncommitted local changes)

---

## Current objective

Gigi came back after a break to reboot the project. Four tasks were teed up. Three are code-complete in the folder; one (grape PNG generation) can't be done by AI. Everything's ready for her to run the human steps.

---

## What's in the folder, uncommitted

**D-001 resolved (lenient streak).** `app/index.tsx` now uses `computeStreak` for the "N days in a row" display. `computeJournalStreak` still runs alongside and fires as an event property so PostHog can measure the strict cohort separately.

**PostHog wired end-to-end.**
- `lib/analytics.ts` — the whole event surface, single source for tracking.
- `app/_layout.tsx` — `initAnalytics()` + `identifyUser()` on auth resolve.
- `app/(flow)/done.tsx` — fires `trackCheckinSaved` on save.
- `app/(flow)/journal.tsx` — fires `trackJournalSaved` with `filled_field_count`.
- `app/index.tsx` — fires `trackStreakSnapshot` on every home load with both streak flavors.
- `app/backpack.tsx` — fires `trackItemToggled` on equip/unequip.
- `package.json` — added `posthog-js`.
- `.env.example` — documented `EXPO_PUBLIC_POSTHOG_API_KEY` and `EXPO_PUBLIC_POSTHOG_HOST`.

**PM portfolio prep.**
- `docs/pm_portfolio/recruit_copy.md` — LinkedIn / Reddit / X / Discord recruit posts + follow-up DM template + recruit tracking table.
- `docs/pm_portfolio/grape_generation_checklist.md` — 20-minute Nano Banana playbook.

**Framework docs updated.**
- `ai_context/current_state.md` — D-001 marked resolved; new Recent Changes row; timestamp bumped.
- `ai_context/active_tasks.md` — PM-001 done, PM-001a new (Gigi runs PostHog signup), PM-010/PM-011 added.
- `ai_context/session_log.md` — new dated entry appended.

`npx tsc --noEmit` is clean except for:
- Two pre-existing `EmotionWheel.tsx` warnings (tolerated).
- One new `lib/analytics.ts` warning ("Cannot find module 'posthog-js'") — resolves the second Gigi runs `npm install`.

---

## What Gigi needs to do next, in order

### 1. Restore Supabase (blocks everything)

Dashboard → project `mtnallsztrulbrmbvbpf` → click Restore. ~2 min.

While there, check Table Editor for `user_inventory`. If absent, run `supabase/007_inventory.sql` in SQL Editor.

### 2. Install the new dependency

```
cd ~/code/crystal
npm install
```

Resolves the `posthog-js` TypeScript error and updates `package-lock.json`.

### 3. Create PostHog project + paste API key

- Sign up at https://app.posthog.com (free tier is fine)
- Create a project called "crystal"
- Copy the Project API Key from Settings → Project
- Paste into `.env`:
  ```
  EXPO_PUBLIC_POSTHOG_API_KEY=phc_...
  EXPO_PUBLIC_POSTHOG_HOST=https://us.i.posthog.com
  ```

Analytics silently no-ops if the key is blank (dev/preview builds keep working), so this is safe to do before OR after pushing.

### 4. Push the pending changes

```
rm -f ~/code/crystal/.git/index.lock
cd ~/code/crystal
git add .
git commit -m "feat: PostHog analytics + D-001 lenient streak + PM portfolio prep"
git push
```

### 5. Verify the live site

After Vercel deploys (~2 min), hard-refresh https://crystal.gigihsu.com with Cmd+Shift+R. Do one full pass through the reflection flow. Confirm nothing regressed.

### 6. Build the PostHog dashboard (10 min in the PostHog UI)

Once events start flowing (fire a couple manually by using the site), create these Insights in PostHog:

- **North star (metric):** cohort of unique users where `streak_snapshot.journal_streak >= 5` in the last 7 days, divided by cohort of unique users with any event in the last 7 days.
- **Day-1 retention (funnel):** users who fired `checkin_saved` → users who fired `checkin_saved` again the next day.
- **Day-2 retention (funnel):** same, filtered to `days_since_first_checkin = 1`.
- **Journal completion rate (trend):** % of `journal_saved` events with `has_content = true`.
- **Hat unlock rate (funnel):** users who reach `streak_snapshot.journal_streak >= 5`.

All five feed the north star. Pin them to a dashboard called "Crystal North Star".

### 7. Run the grape generation checklist (20 min external)

Open `docs/pm_portfolio/grape_generation_checklist.md` and follow it step-by-step in Google AI Studio. Save the 10 PNGs to `~/code/crystal/assets/grape/`.

### 8. Kick off user interview recruiting

Open `docs/pm_portfolio/recruit_copy.md`, pick the LinkedIn variant, post it. Then post the Reddit variant to r/journaling (after asking mods for permission). Track responses in the table at the bottom of that file.

---

## Blockers

| Blocker | Who | What we need |
|---|---|---|
| Supabase paused | Gigi | Click Restore in dashboard |
| PostHog account | Gigi | Sign up + paste API key |
| `posthog-js` module | Gigi | Run `npm install` |
| PNG grape assets | Gigi | Run generation checklist |

None of these are dev-blocked. All are awaiting human action.

---

## Context that's NOT obvious from the code

- **Two streaks now coexist.** `computeStreak` (lenient — any check-in) drives home display and grape gating. `computeJournalStreak` (strict — journal content) drives the north-star cohort in PostHog. Don't remove either.
- **Analytics fails open.** If the PostHog key is missing, `initAnalytics` logs a warning and every `track*` function no-ops. Dev builds don't need a key.
- **PostHog SDK choice.** I picked `posthog-js` (web) not `posthog-react-native`. Crystal is web-only right now. If Gigi ships native later, swap `lib/analytics.ts` — the public interface (named `track*` functions) stays the same.
- **Free-tier Supabase auto-pause is a persistent risk.** If Gigi steps away for another 7+ days, the site goes down until restored. Consider upgrading to a paid tier before the portfolio site drives traffic, OR add a scheduled task that pings the project.
- **The framework survived first contact.** Gigi came back after a break and I reconstituted full state from `current_state.md` + `handoff.md` without asking her to re-explain anything. Preserve this — it's the whole point of the AI Generalist system.

---

## How to update this file when you finish

Overwrite this file with your own handoff. Keep the same structure. Date + name yourself at the top. Then update `current_state.md` and `session_log.md` separately. The next AI is reading this cold — make it self-contained.
