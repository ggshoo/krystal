# Glossary

Vocabulary specific to this project. If a new agent sees one of these terms and isn't sure what it means, it should be in here.

---

## Domain

**Reflection** — One day's complete emotional check-in: scores + emotion choice + optional journal. One per user per day.

**Check-in** — The Mind / Body / Heart 1–10 rating step. Always required.

**Journal** — The 6 written prompts after the emotion picker. Always optional in the flow but increasingly emphasized as the practice deepens.

**Streak** — Consecutive days the user has shown up. **Current definition (D-001 pending):** days with non-empty journal content. May be reverted to "any day with a check-in".

## Emotion taxonomy

**Roberts wheel** — Geoffrey Roberts's emotion wheel: 7 primaries → variable secondaries → 2 tertiaries each. Source for the in-flow emotion picker. Total ~72 emotions.

**Plutchik** — Robert Plutchik's wheel of emotions. We use it for **intensity ladders only** — 3 levels per primary, mapped from the Roberts primary. Lives in `lib/plutchik.ts` and `lib/plutchikContent.ts`.

**Primary / Secondary / Specific (tertiary)** — The three levels of the Roberts wheel. `emotion_categories` / `emotion_subcategories` / `emotion_details` in Supabase.

**Pensiveness / Sadness / Grief** — Low / mid / high intensity of Plutchik's Sadness family. Each Roberts primary has its own 3-level ladder.

## App-specific concepts

**Grape companion / Krystal** — The purple grape character with a brown twiggy stem and two leaves. Lives in `components/GrapeCompanion.tsx`. Has per-emotion face variations.

**Backpack** — Persistent inventory of items the user has earned by hitting streak milestones. Lives in `user_inventory` table (migration 007).

**Hat** — First backpack item. Knit burgundy beanie. Unlocks at journal streak 5.

**Equipped** — Whether a backpack item is currently being worn by the grape. Toggle per item in the backpack screen.

**Flow** — The reflection flow: Welcome → Check-in (Mind / Body / Heart) → Wheel (primary → secondary → tertiary → intensity) → Done → Journal. Lives under `app/(flow)/`.

**Corner grape** — The small persistent grape in the top-right of every flow screen. Lives in `app/(flow)/_layout.tsx`. Progressively mirrors the user's emotion as they pick.

**Home grape** — The grape that appears above the title on the home page. Only renders once the user has built a 2-day journal streak. Always shows the pleasant default face (doesn't mirror today's emotion).

## Technical

**RLS** — Row Level Security. Supabase policy mechanism. Every user-owned table has per-row policies enforcing `auth.uid() = user_id`.

**Anonymous auth** — Supabase's `signInAnonymously()`. Users start anonymous; same `user_id` survives email upgrade via `auth.updateUser({ email })`.

**Upsert pattern** — How we enforce one-reflection-per-day without DB-level uniqueness (would break with timezones). The app does a SELECT first; if today's row exists, UPDATE; else INSERT. Lives in `app/(flow)/done.tsx`.

**`(flow)`** — Expo Router route group. Parentheses mean "don't include this segment in the URL". So `/welcome` actually resolves to `app/(flow)/welcome.tsx`.

**FadeIn** — Custom animation wrapper at `components/FadeIn.tsx`. Used for the staggered cascade effect on screen mount. Takes `delay` and `duration` props.

**NativeWind 4** — Tailwind for React Native. Same class names as web Tailwind, compiled to RN styles via the preset in `tailwind.config.js`. Dark mode via `media` (system-following).

**Zustand store** — Lives in `store/`. Each store is `useXxxStore`. Selectors must return stable references — methods returning fresh arrays cause infinite re-renders (we hit this with `equippedSlugs()`; lesson encoded in `store/useInventoryStore.ts`).

**Day key** — `${year}-${month}-${date}` (local time) used to compare entries day-by-day. Defined inline in `lib/history.ts → computeStreak / computeJournalStreak`.

## Workflow

**Source of truth** — `ai_context/current_state.md`. If anything contradicts it, the state file is right.

**Handoff** — Process of one AI ending its session and leaving notes for the next. Lives in `ai_context/handoff.md`. Overwrite each session.

**Open Decisions (D-NNN)** — Numbered decisions requiring human input before code can move. Tracked in `current_state.md → Open Decisions`. Format: `D-001`, `D-002`, etc.

**Migration NNN** — SQL file `supabase/00N_*.sql`. Run manually in the Supabase SQL editor by the human owner.

**Ship** — Push to `main` → GitHub Action runs → Vercel build + deploy. End-to-end ~2 min.
