# Krystal — Migration to Lovable

> **ARCHIVAL — historical reference only.** This file documented a one-time exploration of migrating Krystal to the Lovable platform. The project stayed in Expo. The Supabase data model + emotion taxonomy described here are still accurate and useful as reference. The Lovable-specific instructions are obsolete. Live project state is in [`ai_context/current_state.md`](./ai_context/current_state.md).

**Purpose of this doc:** everything you need to rebuild Krystal in Lovable. Self-contained — you should never need to open another file in this repo to use it. Paste the relevant sections into Lovable as prompts.

---

## Quick start (5 minutes)

1. **Create a new Lovable project** at lovable.dev. Don't pick a template — start blank.
2. **Connect your existing Supabase project** (`mtnallsztrulbrmbvbpf`) via Lovable's Supabase integration. **Don't create a new Supabase project** — the existing one already has all the tables, RLS, and the 72-emotion seed.
3. **Paste the "Initial context prompt"** (§2 below) as your very first message to Lovable. This sets the entire product context.
4. **Then work through the "Sequenced build prompts"** (§3 below), one at a time. Don't paste them all at once.
5. **Keep this doc open** — when Lovable suggests something that contradicts a decision we made, refer to §10 (Decisions Log) to push back.

### What's already done in Supabase

Don't redo any of this. It's live on `https://mtnallsztrulbrmbvbpf.supabase.co`:

- `profiles`, `daily_checkins`, `journal_entries`, `emotion_categories`, `emotion_subcategories`, `emotion_details` tables
- Row Level Security policies on every user-owned table
- A trigger that auto-creates a `profiles` row when an auth user signs up
- 8 primary + 24 secondary + 72 tertiary emotions seeded
- `daily_checkins.emotion_id` is a single FK to `emotion_details` (with primary/secondary derivable via JOIN)

If you DO need to recreate it from scratch (different Supabase project), the SQL migrations are in `supabase/migrations/001_init.sql` through `005_seed_plutchik_minimal.sql`. Run them in order in the Supabase SQL Editor.

### What we're leaving behind

The Expo/React Native code in this repo (`app/`, `lib/`, `store/`) is mobile-specific and not portable to Lovable's web stack. You're rebuilding the UI in Lovable. The backend, the data model, the design decisions, and the emotion taxonomy all carry over.

---

## 1. Project at a glance

**Krystal** is a daily emotional reflection app. Users check in with their Mind, Body, and Heart (1–10 each), then identify a specific emotion they're feeling via a 3-level Plutchik-wheel hierarchy (e.g. *Fear → Anxiety → Overwhelmed*). The reflection is saved to a database; future versions add journaling, insights, and pattern observations.

**The aesthetic is critical:** kid-like cartoon-game vibe (think *quieter Animal Crossing*), warm and encouraging, never clinical, never gamified. The product belief: *being aware of your emotions is partly about reconnecting with your kid-self.*

**There is a quiet purple grape character** that's present alongside the user through the flow. No name. Doesn't talk. Just present.

---

## 2. Initial context prompt — paste this into Lovable first

> I'm building a daily emotional reflection web app called **Krystal**. The aesthetic is calm, warm, slightly playful — think a quieter *Animal Crossing* or *Untitled Goose Game*. Not childish, but kid-like in spirit, because the product's core belief is that emotional awareness is partly about reconnecting with your kid-self. The vibe is "cute cartoon-game," not "wellness clinical."
>
> **Stack:** React + Vite + Tailwind + shadcn/ui. Use a connected Supabase project (already created — the schema is already in place). Use the Supabase JS client. Use anonymous Supabase sessions on first launch (no sign-in screen for v0.1).
>
> **Daily reflection flow (5 screens):**
> 1. **Home** — single "Begin reflection" button.
> 2. **Check-in** — three sliders or tap-to-rate 1–10 dials, one each for Mind, Body, Heart. Each with a short prompt and example anchors at low/high ends.
> 3. **Emotion picker** — 3 progressive steps using Plutchik's wheel. First step: 8 primary emotions as color-coded tiles. Second: pick from 3 sub-clusters of the chosen primary. Third: pick a specific feeling (3 options). All hierarchy data is already seeded in Supabase.
> 4. **Done** — saves the reflection to Supabase under the user's anonymous session, shows "Saved. See you tomorrow."
>
> **What's NOT in v0.1** (do not build these — they're for later versions): notifications, streaks, social, mood charts, gamification, badges, insights, the journaling step after emotion selection, the grounding breath screen, and the cute grape companion character (will be added in v0.2).
>
> **There IS a small cute purple grape character planned for v0.2** — quiet, never talks, present alongside the user. Don't add it yet. I want v0.1 to ship first.
>
> **Design tokens — starting palette:**
> - Background: cream `#FAF7F2`
> - Primary text: ink `#1F1F23`
> - Muted text / borders: `#6B6F76`
> - Accent CTA: subdued blue-gray `#7B8FA1` (this color is likely to evolve)
> - Per-emotion colors: joy `#E8C547`, trust `#6FAE8E`, fear `#8E6FB5`, surprise `#6FB5AE`, sadness `#5B7CC4`, disgust `#A48069`, anger `#C45B5B`, anticipation `#D9985A`. Used as supportive tints, not dominant page color.
>
> **Database tables already in Supabase** (don't recreate):
> - `emotion_categories` — 8 rows: name, color, sort_order
> - `emotion_subcategories` — 24 rows, FK to category
> - `emotion_details` — 72 rows, FK to subcategory. Has columns for `name`, `framework`, `similar_words` (array), `sensations` (array), `what_it_tells_you`, `how_it_helps_you`, `description`, `sort_order`. Most content fields are empty for now — that's intentional, filled in v0.2.
> - `daily_checkins` — `user_id`, `created_at`, `occurred_at`, `mind_score`, `body_score`, `heart_score`, `emotion_id` (single FK to `emotion_details`, derive primary/secondary via JOIN), `client_uuid` (idempotency key).
> - `journal_entries` — exists for v0.2; not used in v0.1.
> - All tables have Row Level Security: user can only read/write their own rows. Emotion taxonomy tables allow SELECT for any authenticated user, no writes from client.
>
> **What I want you to build first:** a basic React + Vite + Tailwind project scaffold with the Home screen only. Just a centered "Krystal" wordmark, a tagline ("A daily practice for emotional clarity"), and a "Begin reflection" button. Cream background, calm spacing. Don't build the other screens yet — I'll prompt you for each.

---

## 3. Sequenced build prompts (paste one at a time)

After Lovable has the scaffold from §2, walk through these in order. **Wait for Lovable to finish each one before sending the next.** Test after each.

### Prompt 3.1 — Anonymous auth bootstrap

> Add anonymous Supabase auth that runs on app launch. On first load, check if there's an existing session in local storage. If not, call `supabase.auth.signInAnonymously()`. Show a brief loading state while this resolves. Store the session in a React context or Zustand store so other components can read the current user. Do not show any sign-in screen — this should be invisible to the user.
>
> Make sure "Anonymous Sign-Ins" is enabled in the Supabase project (it should already be — if it's not, prompt me to enable it in the dashboard).

### Prompt 3.2 — Check-in screen

> Build a `/check-in` route with three rating sections, one each for Mind, Body, Heart. Each section has:
> - A small uppercase label ("Mind" / "Body" / "Heart")
> - A short question:
>   - Mind: "How are your thoughts today?"
>   - Body: "How does your body feel right now?"
>   - Heart: "How emotionally connected do you feel?"
> - A row of 10 tap-to-select circular buttons (1–10). Selected one is filled in the accent color; others are outlined.
> - Two small anchor labels below the row:
>   - Mind: low = "worried · racing · foggy", high = "focused · clear · present"
>   - Body: low = "fatigue · pain · tension", high = "relaxed · alive · active"
>   - Heart: low = "numb · closed off", high = "open · connected"
>
> A "Continue" button at the bottom, disabled until all three are rated. When tapped, navigate to `/emotion/primary`.
>
> Header copy: "Check in with yourself" / "Three quick questions. There are no wrong answers."
>
> Store the three scores in a Zustand store called `useReflectionStore` (or similar) — these are draft state for the in-progress reflection, not yet saved to the database.

### Prompt 3.3 — Emotion picker, step 1 (primary)

> Build a `/emotion/primary` route. Show an 8-tile grid (2 columns × 4 rows) of the Plutchik primary emotions. Each tile is the emotion's color at ~15% opacity, with a small colored circle indicator and the emotion name. Tapping a tile saves the choice to draft state (in the reflection store), clears any downstream emotion selections, and navigates to `/emotion/secondary`.
>
> The 8 primaries (color in parens):
> - Joy (`#E8C547`)
> - Trust (`#6FAE8E`)
> - Fear (`#8E6FB5`)
> - Surprise (`#6FB5AE`)
> - Sadness (`#5B7CC4`)
> - Disgust (`#A48069`)
> - Anger (`#C45B5B`)
> - Anticipation (`#D9985A`)
>
> Header copy: "What's coming up for you?" / "Start broad. We'll narrow down together."
>
> Fetch the primary emotions from `emotion_categories` table on mount. Order by `sort_order`.

### Prompt 3.4 — Emotion picker, step 2 (secondary)

> Build a `/emotion/secondary` route. Show the 3 sub-clusters of whichever primary the user picked in the previous screen. Each is a stacked tile in the parent's color (~15% opacity). Tapping one saves the choice to draft state, clears the specific selection, and navigates to `/emotion/specific`.
>
> Header: a small label showing the chosen primary (e.g. a colored dot + "Fear"), then "Which kind?" / "Pick the one closest to right now."
>
> Fetch secondaries from `emotion_subcategories` where `category_id` matches the chosen primary. Order by `sort_order`. If the user navigates here without having picked a primary, redirect to `/emotion/primary`.

### Prompt 3.5 — Emotion picker, step 3 (specific)

> Build a `/emotion/specific` route. Same pattern as the secondary picker but one level deeper — show the 3 tertiary emotions under the chosen secondary, fetched from `emotion_details` (where `subcategory_id` matches and `framework = 'plutchik'`), ordered by `sort_order`.
>
> Header: small breadcrumb (dot + "Fear · Anxiety"), then "Closer to..." / "The word that fits best. There's no wrong answer."
>
> Tapping a tile saves the choice to draft state, then navigates to `/done`. Guards: redirect upstream if primary or secondary missing.

### Prompt 3.6 — Done screen (saves to Supabase)

> Build a `/done` route. On mount:
> 1. Verify all required fields are in draft state (`mind_score`, `body_score`, `heart_score`, `emotion_primary`, `emotion_secondary`, `emotion_specific`). If missing, redirect to `/check-in`.
> 2. Verify the auth session is initialized. If not, wait. If anonymous sign-in failed, show an error with a "Try again" button.
> 3. Look up the `emotion_details.id` by querying through the hierarchy — the tertiary slug filtered by the parent secondary's slug filtered by the parent primary's slug.
> 4. Insert a row into `daily_checkins` with: `user_id` (from session), the three scores, `emotion_id`, and a client-generated UUIDv4 as `client_uuid` (for idempotency on offline retries).
> 5. On success, show a calm confirmation:
>    - A small colored dot + breadcrumb "Fear · Anxiety"
>    - The chosen specific emotion in larger text ("Overwhelmed")
>    - "Saved." (large) / "See you tomorrow." (subtle)
>    - A "Return home" button that clears the draft state and navigates to `/`
> 6. On error, show the error message and a "Try again" button that resets state and retries the save.
>
> Use `useEffect` with a ref guard to prevent double-submission. Generate UUIDs with `crypto.randomUUID()` (fallback to a Math.random shim if unavailable).

### Prompt 3.7 — Wire up Home

> Update the Home screen so the "Begin reflection" button navigates to `/check-in`.

### Prompt 3.8 — Deploy

> Deploy this to a Lovable preview URL so I can share it with friends. The current state should be v0.1 — Home → Check-in → Picker (primary, secondary, specific) → Done. Working end-to-end against the connected Supabase.

---

## 4. v0.2 prompts (after v0.1 is shared and validated)

Save these for later. Don't paste yet.

### Prompt 4.1 — Add grounding screen

> Insert a new screen at `/grounding` between Home and Check-in. Three slow guided breaths. Soft scale-and-fade animation (~4s in, ~2s hold, ~6s out, x3). No "skip" button. After the third breath, show a "Continue" button that navigates to `/check-in`. Update Home's button to push to `/grounding` instead.

### Prompt 4.2 — Add Reflect screen (Understanding + Journaling merged)

> Insert a new screen at `/reflect` between the emotion-specific picker and `/done`. On this screen, fetch the chosen emotion's `emotion_details` row from Supabase (which has `similar_words`, `sensations`, `what_it_tells_you`, `how_it_helps_you`). Display:
> - Top breadcrumb: "Today you identified: Fear → Anxiety → Overwhelmed"
> - Similar words section (no input)
> - Sensations section (the educational list) + a journal prompt textbox: "How are you experiencing this in your body right now?"
> - "What this emotion may be telling you" section (educational copy) + a journal prompt textbox: "What might it be telling you in your life?"
> - "How this emotion can help you" section (educational copy) + a journal prompt textbox: "How might it be helping you?"
> - Two buttons: "Explore more" (placeholder for now) and "Done"
>
> When the user taps Done, store the three journal field values in draft state, then navigate to `/done`. Update `/done`'s save handler to also write a `journal_entries` row linked to the `daily_checkins` row when any journal field is non-empty.

### Prompt 4.3 — Add the purple grape companion

> Add a small cute purple grape character to all screens of the daily flow. The grape is a small SVG illustration in the corner of the screen (bottom right works). Quiet by default. Subtle reactive animations: a slow blink during grounding, a gentle wave on the Done screen. Never speaks, never has dialog text. Picture a tiny round purple grape with two small eyes. One character only — no variants, no evolution. Keep it small enough not to distract from the reflection.

### Prompt 4.4 — Backfill Atlas content

> Help me write the content for each of the 72 emotions in `emotion_details`. For each one, I need:
> - similar_words: array of 4–5 related emotion words
> - sensations: array of 4–5 body sensations someone might feel
> - what_it_tells_you: 1–2 sentence prose, possibility-framed (use "may be telling you," "might")
> - how_it_helps_you: 1–2 sentence prose, possibility-framed (use "can sometimes help by")
>
> Never use diagnostic language ("you should," "always," "this means"). Tone is warm, non-judgmental, possibility-framed. Source: Atlas of Emotions framework (Ekman) and Plutchik's wheel.
>
> Generate the SQL to update all 72 rows. Show me the first 5 rows for me to react to tone before generating the rest.

### Prompt 4.5 — Add Insights screen

> Build an `/insights` route. Query the user's last 30 days of `daily_checkins` and run a set of hand-written rules over them. Show 3–5 textual observations as calm card components. Examples:
> - "Your lowest Heart scores often happen on weekdays."
> - "Fear-related emotions come up most often when your Body score is low."
> - "Your Body scores are highest on Saturdays."
>
> Don't show insights if the user has fewer than 5 entries — show an empty state instead. Insights are observations, never prescriptions: never use "you should." Add a link in the home screen header to navigate to insights.

### Prompt 4.6 — Settings: upgrade anonymous to email

> Add a `/settings` route with: sign-out button, "Delete all my data" button (transactional delete via Supabase), and "Save your account with email" upgrade. The upgrade uses `supabase.auth.linkIdentity` to convert the current anonymous session into a real email-authenticated one without losing data. Magic-link only — no passwords.

---

## 5. Reference: Full PRD

(Paste this into Lovable if it needs the full product spec.)

### Vision

Krystal helps people answer a question most of us struggle with: *"How am I actually feeling?"* It is a daily mobile practice that combines mindfulness, emotional intelligence, and reflective journaling into a single calm, non-judgmental experience.

Over time, Krystal aims to help users see how their emotions move week to week, month to month, and across seasons of life — turning daily reflection into the raw material for genuine self-understanding. Deeper analytics (week-over-week comparisons, seasonal patterns) are post-v1.

### Target user

Anyone, especially people who are strapped for time. Designed for a wide audience: students, working adults, parents, anyone who has 3 minutes a day and a vague sense that "I should probably check in with myself more." Deliberately **low-effort**. The whole flow should feel like the easiest possible version of paying attention to yourself — never homework, never a chore.

The user is **the only audience for their own data.** No followers, no friends, no share features.

### Product philosophy

**Core idea:** Being aware of your emotions is partly about reconnecting with your kid-self. The part of you that felt things openly before learning to manage, optimize, and suppress. Krystal's job is to make that reconnection feel safe and inviting — not clinical, not aspirational, not productized.

Aesthetic commitments (non-negotiable):

- **Calm.** Visuals, motion, and copy reduce arousal, never raise it.
- **Warm.** The product feels like a friend, not a tool.
- **Encouraging.** Microcopy is supportive without being saccharine.
- **Cute, but not childish.** Cartoon-game aesthetic dialed soft.
- **Reflective.** The product asks more than it tells.
- **Safe.** No diagnostic language. Possibility-framed copy throughout.
- **Non-judgmental.** No "right" emotions. No optimization metaphors.

Visual direction: hand-drawn-feeling shapes, slightly imperfect lines, warm/desaturated palette, type that feels approachable.

Companion: a small quiet purple grape character. Quiet, reactive (not proactive), never judges, no name, one character (no roster/evolution). Adds in v0.2.

Anti-patterns Krystal will NEVER do:

- No social features
- No gamification (badges, levels, points, leaderboards)
- No streak pressure
- No competitive mechanics
- No engagement-maximizing design

### The daily flow (5 steps in v0.2 final, 3 in v0.1 ship)

**v0.1 ship-fast:** Check-in → Emotion picker (×3 sub-screens) → Save

**v0.2 full:** Grounding → Check-in → Emotion picker → Understanding + Journaling (Reflect) → Save

#### Step 1: Grounding (v0.2)

Three guided breaths. No skip. Gentle animation matching breath pacing.

#### Step 2: Mind-Body-Heart check-in

Three sliders/dials 1–10. Anchor examples per dimension:

- **Mind:** "How are your thoughts today?" Low = worried/racing/foggy, High = focused/clear/present
- **Body:** "How does your body feel right now?" Low = fatigue/pain/tension, High = relaxed/alive/active
- **Heart:** "How emotionally connected do you feel?" Low = numb/closed off, High = open/connected

Stored as `mind_score`, `body_score`, `heart_score`.

#### Step 3: Emotion identification (Plutchik wheel, 3 levels)

Hierarchy: 8 primaries → 3 sub-clusters each → 3 specific feelings each = 72 tertiaries.

Color-coded by primary. Atlas of Emotions content is editorially mapped to each tertiary and surfaces in Step 4.

#### Step 4: Understanding + Journaling — merged (v0.2)

Educational content (similar words, sensations, what-it-tells-you, how-it-helps-you) appears as journal prompts. Three nullable text fields: sensation, meaning, helpfulness. Optional skip per field.

Critical copy rule: never diagnostic. Always "may be telling you," "can sometimes help by."

#### Step 5: Save + confirmation

Write to Supabase (with offline queue fallback). Calm confirmation message + return home.

### Insights system (v0.3)

Rule-based pattern observations over user's last 30 days of entries. Examples:

- "Your lowest Heart scores often occur on weekdays."
- "Fear-related emotions come up more often when Body score is low."

No ML. No insights shown until user has 5+ entries.

### Long-term out of scope

Push notifications. Streaks. Social. Apple Health integration. Apple Watch app. AI-generated reflections. Custom emotion definitions. Voice journaling. Mood charts (textual only in v0.3).

---

## 6. Reference: Architecture for web (adapted for Lovable)

### Tech stack (Lovable defaults work)

- React 18 + Vite + TypeScript
- Tailwind CSS + shadcn/ui
- Zustand for client state (draft reflection, auth session)
- Supabase JS client for backend
- React Router (or whatever Lovable wires by default)

### Folder structure (Lovable will scaffold this; here's the intent)

```
src/
├── pages/                       # Route components
│   ├── home.tsx
│   ├── check-in.tsx
│   ├── emotion/
│   │   ├── primary.tsx
│   │   ├── secondary.tsx
│   │   └── specific.tsx
│   └── done.tsx
├── components/                  # Reusable UI
│   ├── ui/                      # shadcn primitives
│   ├── EmotionTile.tsx
│   └── ScoreDial.tsx
├── lib/
│   ├── supabase.ts              # Supabase client
│   ├── emotions.ts              # (Optional) hardcoded taxonomy fallback
│   └── uuid.ts
├── store/
│   ├── useReflectionStore.ts    # Draft state
│   └── useAuthStore.ts          # Anonymous session
└── App.tsx
```

### State management

- **Reflection draft** in Zustand. Reset on submit.
- **Auth session** in Zustand. Initialized on app launch via `supabase.auth.signInAnonymously()` (idempotent — reuses existing session from local storage if present).
- **Server state** fetched per-screen with simple async functions. Add TanStack Query later if needed.

### Data flow for one reflection

1. User opens app → anonymous session initialized (silent, invisible)
2. User taps Begin → enters Check-in
3. Scores stored in `useReflectionStore` draft
4. Picker walks 3 levels, slugs stored in draft
5. Done screen: look up `emotion_id` via JOIN, insert `daily_checkins` row, show confirmation
6. Reset draft, return home

### Privacy posture

- Anonymous sessions tied to device-local storage. Data persists per-device.
- Row Level Security on every user-owned table: `auth.uid() = user_id`.
- AES-256 at rest (Supabase default).
- No third-party data sharing.

---

## 7. Reference: Database schema (already in Supabase)

These SQL definitions are already applied to `mtnallsztrulbrmbvbpf.supabase.co`. Don't re-run unless you're targeting a fresh project.

```sql
-- Profiles (1:1 with auth.users)
create table public.profiles (
  id           uuid primary key references auth.users(id) on delete cascade,
  display_name text,
  created_at   timestamptz not null default now()
);

-- Auto-create profile on auth signup
create or replace function public.handle_new_user()
returns trigger language plpgsql security definer set search_path = public as $$
begin
  insert into public.profiles (id) values (new.id);
  return new;
end;
$$;
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute function public.handle_new_user();

-- Emotion taxonomy
create table public.emotion_categories (
  id uuid primary key default gen_random_uuid(),
  name text not null unique,
  color text not null,
  sort_order smallint not null default 0
);

create table public.emotion_subcategories (
  id uuid primary key default gen_random_uuid(),
  category_id uuid not null references public.emotion_categories(id) on delete cascade,
  name text not null,
  sort_order smallint not null default 0,
  unique (category_id, name)
);

create table public.emotion_details (
  id uuid primary key default gen_random_uuid(),
  subcategory_id uuid not null references public.emotion_subcategories(id) on delete cascade,
  name text not null,
  framework text not null default 'plutchik',
  similar_words text[] not null default '{}',
  sensations text[] not null default '{}',
  what_it_tells_you text,
  how_it_helps_you text,
  description text,
  sort_order smallint not null default 0,
  unique (subcategory_id, name, framework)
);

-- Daily check-ins
create table public.daily_checkins (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  created_at timestamptz not null default now(),
  occurred_at timestamptz not null default now(),
  mind_score smallint not null check (mind_score between 1 and 10),
  body_score smallint not null check (body_score between 1 and 10),
  heart_score smallint not null check (heart_score between 1 and 10),
  emotion_id uuid not null references public.emotion_details(id) on delete restrict,
  client_uuid uuid not null unique
);

-- Journal entries (v0.2)
create table public.journal_entries (
  id uuid primary key default gen_random_uuid(),
  daily_checkin_id uuid not null unique references public.daily_checkins(id) on delete cascade,
  user_id uuid not null references auth.users(id) on delete cascade,
  sensation text,
  meaning text,
  helpfulness text,
  created_at timestamptz not null default now()
);
```

### RLS (already applied)

Every user-owned table: `auth.uid() = user_id` for SELECT/INSERT/UPDATE/DELETE.
Every emotion taxonomy table: SELECT allowed for `authenticated`, no writes from client.

---

## 8. Reference: Full emotion taxonomy (ready to paste as TypeScript)

This mirrors what's in Supabase. Useful if Lovable wants a local copy for type safety or fallback.

```ts
export type EmotionTertiary = { slug: string; name: string };
export type EmotionSecondary = { slug: string; name: string; tertiaries: EmotionTertiary[] };
export type EmotionPrimary = {
  slug: string;
  name: string;
  color: string;
  secondaries: EmotionSecondary[];
};

const cap = (s: string) => s.charAt(0).toUpperCase() + s.slice(1);
const tier = (slugs: string[]): EmotionTertiary[] =>
  slugs.map((slug) => ({ slug, name: cap(slug) }));

export const EMOTIONS: EmotionPrimary[] = [
  { slug: "joy", name: "Joy", color: "#E8C547", secondaries: [
    { slug: "serenity", name: "Serenity", tertiaries: tier(["content", "peaceful", "at ease"]) },
    { slug: "joy", name: "Joy", tertiaries: tier(["happy", "delighted", "grateful"]) },
    { slug: "ecstasy", name: "Ecstasy", tertiaries: tier(["elated", "overjoyed", "euphoric"]) },
  ]},
  { slug: "trust", name: "Trust", color: "#6FAE8E", secondaries: [
    { slug: "acceptance", name: "Acceptance", tertiaries: tier(["safe", "open", "accepting"]) },
    { slug: "trust", name: "Trust", tertiaries: tier(["connected", "secure", "supported"]) },
    { slug: "admiration", name: "Admiration", tertiaries: tier(["inspired", "reverent", "awed"]) },
  ]},
  { slug: "fear", name: "Fear", color: "#8E6FB5", secondaries: [
    { slug: "apprehension", name: "Apprehension", tertiaries: tier(["cautious", "uneasy", "worried"]) },
    { slug: "anxiety", name: "Anxiety", tertiaries: tier(["anxious", "overwhelmed", "on edge"]) },
    { slug: "terror", name: "Terror", tertiaries: tier(["afraid", "panicked", "frozen"]) },
  ]},
  { slug: "surprise", name: "Surprise", color: "#6FB5AE", secondaries: [
    { slug: "distraction", name: "Distraction", tertiaries: tier(["distracted", "unfocused", "scattered"]) },
    { slug: "surprise", name: "Surprise", tertiaries: tier(["surprised", "startled", "caught off guard"]) },
    { slug: "amazement", name: "Amazement", tertiaries: tier(["astonished", "stunned", "speechless"]) },
  ]},
  { slug: "sadness", name: "Sadness", color: "#5B7CC4", secondaries: [
    { slug: "pensiveness", name: "Pensiveness", tertiaries: tier(["pensive", "wistful", "reflective"]) },
    { slug: "sadness", name: "Sadness", tertiaries: tier(["sad", "lonely", "disappointed"]) },
    { slug: "grief", name: "Grief", tertiaries: tier(["grieving", "heartbroken", "despairing"]) },
  ]},
  { slug: "disgust", name: "Disgust", color: "#A48069", secondaries: [
    { slug: "boredom", name: "Boredom", tertiaries: tier(["bored", "disinterested", "flat"]) },
    { slug: "disgust", name: "Disgust", tertiaries: tier(["repulsed", "put off", "uncomfortable"]) },
    { slug: "loathing", name: "Loathing", tertiaries: tier(["revolted", "contemptuous", "disgusted"]) },
  ]},
  { slug: "anger", name: "Anger", color: "#C45B5B", secondaries: [
    { slug: "annoyance", name: "Annoyance", tertiaries: tier(["annoyed", "irritated", "impatient"]) },
    { slug: "anger", name: "Anger", tertiaries: tier(["angry", "frustrated", "resentful"]) },
    { slug: "rage", name: "Rage", tertiaries: tier(["furious", "enraged", "seething"]) },
  ]},
  { slug: "anticipation", name: "Anticipation", color: "#D9985A", secondaries: [
    { slug: "interest", name: "Interest", tertiaries: tier(["curious", "intrigued", "attentive"]) },
    { slug: "anticipation", name: "Anticipation", tertiaries: tier(["anticipating", "eager", "hopeful"]) },
    { slug: "vigilance", name: "Vigilance", tertiaries: tier(["focused", "watchful", "intent"]) },
  ]},
];
```

---

## 9. Reference: Design tokens

### Palette

| Token | Hex | Use |
|---|---|---|
| cream | `#FAF7F2` | Default background |
| ink | `#1F1F23` | Primary text |
| muted | `#6B6F76` | Secondary text, borders, helper copy |
| accent | `#7B8FA1` | CTA buttons (likely to evolve toward something warmer) |

### Emotion palette (supportive context only)

| Emotion | Hex |
|---|---|
| Joy | `#E8C547` (gold) |
| Trust | `#6FAE8E` (green) |
| Fear | `#8E6FB5` (purple) |
| Surprise | `#6FB5AE` (cyan) |
| Sadness | `#5B7CC4` (blue) |
| Disgust | `#A48069` (brown) |
| Anger | `#C45B5B` (red) |
| Anticipation | `#D9985A` (warm orange) |

Tile usage pattern: background = color at ~15% opacity (`+26` hex alpha), selected state = ~33% opacity (`+55` hex alpha) with a 2px border in the full color.

### Typography (TBD — pick during design pass)

- Display: a soft, slightly playful serif or rounded sans-serif. Not Helvetica.
- Body: clean, accessible sans-serif.
- Suggested pairings to try: *Instrument Serif* + *Inter*, or *Fraunces* + *Manrope*.

### Motion

- Durations: 200–400ms, ease-in-out
- Avoid: bounces, spring overshoot, parallax
- v0.2: tile fade-in/fade-out transitions between picker screens (the user wants "calm motion")

---

## 10. Decisions log — what we've already committed to

When Lovable suggests something that contradicts one of these, push back.

| Date | Decision | Why |
|---|---|---|
| 2026-06-02 | Stack: React + Tailwind + shadcn + Supabase (adapted from Expo for Lovable) | Calm, polished, simple to ship |
| 2026-06-02 | Emotion framework: hybrid Plutchik (hierarchy) + Atlas (content) | Plutchik for picker structure; Atlas content surfaces in Reflect screen |
| 2026-06-02 | Privacy: Supabase DB encryption + RLS, no E2E | Pragmatic for v1; can revisit later |
| 2026-06-02 | Offline-first with sync queue | Reflection must be possible without internet |
| 2026-06-02 | Auth: anonymous on first launch, magic-link upgrade later | Lowest friction for v0.1 ship; real accounts come in v0.2 |
| 2026-06-02 | Draft state in Zustand, never persisted to DB until submit | Keeps the DB clean, avoids orphan rows |
| 2026-06-02 | Insights: rule-based, not ML | No ML until we have real usage data |
| 2026-06-02 | Out of scope for v1: notifications, streaks, social, mood charts | Anti-engagement-loop by design |
| 2026-06-02 | Long-term analytics in scope post-v1 | The "not a mood tracker" framing was removed |
| 2026-06-02 | Audience: wide, low-effort, time-strapped | Anyone with 3 minutes |
| 2026-06-02 | Aesthetic: kid-like cartoon-game, not childish | Reconnect-with-kid-self philosophy |
| 2026-06-02 | Quiet purple grape companion, nameless | Quiet, reactive (not proactive), never judges, one character |
| 2026-06-02 | Plutchik chosen as only user-facing wheel; Atlas surfaces only in journaling | User picks from Plutchik; Atlas content is the journaling structure |
| 2026-06-02 | Understanding + Journaling merged → 5-step flow | Educational content IS the journal prompts |
| 2026-06-02 | Journal prompts: sensation + meaning + helpfulness (no separate "cause") | "What's prompting this" is subsumed by "what is it telling you" |
| 2026-06-02 | `daily_checkins` stores single `emotion_id`, not three FKs | Normalized; primary/secondary derive via JOIN |
| 2026-06-02 | Ship-first strategy: v0.1 = Check-in + Picker + Save only | Friends can download a real thing fast |
| 2026-06-02 | Minimal Plutchik seed for v0.1 (names only, no Atlas content yet) | Content backfilled in v0.2 |

---

## 11. Things Lovable might try to suggest — push back on these

Push back politely if Lovable proposes any of:

- A streak counter or "X days in a row" feature
- A notification reminder
- A leaderboard, badge, or any gamification
- A "share to social" button
- A premium/paid tier overlay
- A clinical or diagnostic copy tone ("This means you have anxiety")
- A signup wall before the user can try the flow
- Multiple users / friends / following
- Push notifications of any kind
- A growth-hacking onboarding flow ("Invite 3 friends to unlock")

The product philosophy in §5 forbids all of these.

---

## 12. Useful prompts for getting unstuck

If Lovable does something you don't like:

> Revert that change. The product philosophy is "calm, warm, non-judgmental." That doesn't fit. Try again with [specific direction].

If Lovable's design is too generic:

> Make this feel more like a cartoon-game — softer corners, hand-drawn-feeling shapes, slightly playful. Not a wellness clinical app. Think quiet Animal Crossing, not Calm or Headspace.

If Lovable can't find a table:

> The table is in Supabase, schema `public`. Use the Supabase JS client. If you can't see the table, check the connection settings.

If Supabase queries fail with RLS errors:

> The user needs an authenticated session before this query. Make sure anonymous sign-in has completed before this component mounts. If it has, double-check that the `user_id` you're writing matches `auth.uid()`.

---

## 13. What to do if you change your mind and come back to React Native

If Lovable doesn't work out and you want to come back to the Expo/React Native version: everything's still here. The code in `app/`, `lib/`, `store/` is the v0.1 work. Open Cowork, share this folder, paste:

> "Working on Krystal. Folder is `~/code/krystal`. Read docs/PRD.md, docs/ARCHITECTURE.md, docs/ROADMAP.md, docs/DECISIONS.md and the current state of `app/`. We were in the middle of Phase 5.3 (the Done screen + anonymous auth). Pick up there."

The Supabase project, the schema, the seed — all of it works for either stack.

---

## 14. Why you might or might not love Lovable

I'm not in the business of talking you out of the move, but the honest tradeoffs:

**You'll likely like:**
- Iteration speed — visual changes from prompts is genuinely faster than hand-writing them
- No more `.env` hunting, no `npx expo install --fix`, no SDK version dances
- Built-in shadcn/ui means the design baseline is "polished" by default
- One URL to share with friends — no Expo Go, no TestFlight, no install instructions

**You might miss:**
- Mobile-native feel — Lovable builds web apps. The result will be a website friends open in a browser, not an icon on their home screen. (They can "Add to Home Screen" from Safari for a near-app experience, but it's not the same.)
- Push notifications — out of scope for v0.1 anyway, but worth knowing it's a web limitation.
- Fine-grained control — Lovable is opinionated. When you want something specific, you might need to be precise in prompts or accept "close enough."

**Hybrid option:** ship the web version on Lovable as v0.1 to validate the product with friends. Once you know the product works and want a "real app" feel, the Supabase backend is portable — you can come back to Expo or use Capacitor/Tauri to wrap the Lovable web app as an installable mobile shell. Many products do exactly this.

Good luck. The product is good.
