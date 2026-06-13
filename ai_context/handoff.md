# Handoff — for the next AI

> Overwrite this file when you end your session. The previous AI's notes get replaced — the audit trail lives in `session_log.md`.

**From:** Claude (Cowork) · `Sonnet 4.6`
**To:** Next agent (Claude / Codex / Cursor / Gemini / whoever)
**Date:** 2026-06-12
**Branch:** `main` (uncommitted local changes — see below)

---

## Current objective

Two parallel tracks were active when I logged off:

1. **Multi-AI collaboration framework** (this scaffolding). DONE — all `ai_context/` and `.ai/` files exist. Verify by reading `current_state.md`.
2. **Backpack + day-2 grape unlock system** — code complete in folder, not yet pushed, requires Supabase migration `007_inventory.sql` to function fully.

---

## What I left in a working state

- `app/index.tsx` — home page with grape gating, day-1/2/5 messages, backpack icon, streak now journal-content based
- `app/backpack.tsx` — new screen with live grape preview + equip/unequip
- `components/GrapeCompanion.tsx` — supports `equipped` prop, renders knit beanie when hat equipped
- `store/useInventoryStore.ts` — Zustand store with `useEquippedSlugs` memoized hook (fixed infinite re-render bug)
- `lib/inventory.ts` — items catalog (currently 1 item: hat at day 5)
- `lib/history.ts` — added `computeJournalStreak` (counts journal-content days)
- `supabase/007_inventory.sql` — migration for `user_inventory` table with RLS
- All flow grape consumers (`app/(flow)/_layout.tsx`, `done.tsx`, `journal.tsx`) now use `useEquippedSlugs()` so the hat shows everywhere
- Journal prompt renamed to "What can you do, in your control, to provide what you need right now?"
- Mobile rating row uses `flex-1` instead of fixed 44px (was cutting off buttons 9 + 10)
- Dark mode is live across all screens

`npx tsc --noEmit` runs clean (only the two pre-existing `EmotionWheel.tsx` style-prop warnings remain).

---

## What needs to happen next, in order

### 1. Get the user to push

There's a known git lock issue from the sandbox. Tell her:

```bash
rm -f ~/code/krystal/.git/index.lock
cd ~/code/krystal
git add .
git commit -m "feat: backpack system + day-2 grape + mobile fix + AI collab framework"
git push
```

Wait ~2 min for GitHub Action → Vercel. Hard refresh https://krystal-one.vercel.app (Cmd+Shift+R).

### 2. Run the inventory migration

The hat/backpack won't function until `user_inventory` exists in Supabase. Walk her through:

1. Open https://supabase.com/dashboard/project/mtnallsztrulbrmbvbpf/sql/new
2. Paste the contents of `supabase/007_inventory.sql`
3. Click Run

The store handles a missing table gracefully (empty inventory, no errors), so the app will load either way. The backpack icon just won't appear and the hat won't drop until the migration runs.

### 3. Resolve the streak rule decision (D-001)

See `current_state.md → Open Decisions`. Gigi noticed history shows 3 days but streak says 2. The cause: one of those days has no journal content. Current rule is strict (require content). She needs to pick:

- **Strict (current):** keep `computeJournalStreak` in `app/index.tsx`.
- **Lenient:** revert to `computeStreak` in `app/index.tsx`.

I recommended lenient. She hasn't decided yet.

### 4. Watch for the PNG grape handoff

She agreed to generate AI grape variants via Google Nano Banana. When she returns with PNGs in `assets/grape/`, refactor `GrapeCompanion.tsx` for hybrid PNG/SVG rendering. Master prompt is in `docs/grape_image_prompts.md`.

---

## Blockers

| Blocker | Who | What we need |
|---|---|---|
| `user_inventory` table missing in Supabase | Gigi to run migration | Paste `supabase/007_inventory.sql` in Supabase SQL editor |
| Streak rule decision (D-001) | Gigi to choose | Strict vs lenient streak |
| AI grape PNG assets | Gigi to generate | Use master prompt with Nano Banana, drop into `assets/grape/` |

None of these are dev-blocked. All are awaiting human action.

---

## Context that's NOT obvious from the code

- **Anonymous auth is the default**. Users get a Supabase anon JWT on first load (persisted in localStorage). They can later upgrade to email via `supabase.auth.updateUser({ email })` — the user_id stays the same so all their data carries over.
- **Local dev workflow** — Gigi doesn't run a local dev server. She pushes to `main` and tests on https://krystal-one.vercel.app after the GitHub Action finishes. Any local "did it work?" needs you to do `npx tsc --noEmit` and reason about correctness, not run the app.
- **SVG Y-axis traps everyone.** Y increases downward. I shipped a frown thinking it was a smile because I had the math backwards. There's now a comment in `GrapeCompanion.tsx` explaining the convention. Don't re-flip it.
- **The grape is dynamic, the hat is permanent.** The grape on home only shows if current journal streak ≥ 2. Break your streak → grape disappears. Items in backpack persist forever once earned. This was a deliberate design choice — see Gigi's wording in `session_log.md`.
- **The `(flow)` route group** wraps Welcome → Check-in → Wheel → Done → Journal. The corner grape lives in that layout, hidden on Done + Journal where a larger inline grape is already shown.

---

## How to update this file when you finish

1. Replace this entire file with your own handoff.
2. Keep the same structure (sections above).
3. Date + name yourself at the top.
4. Be specific about what's done, what's next, and what blockers exist.
5. Then update `current_state.md` and `session_log.md` separately.

The next AI is reading this cold. Make it self-contained.
