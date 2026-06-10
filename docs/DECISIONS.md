# Decisions log

Append-only. When we make a real product or technical decision, add a one-liner here with the date and the reasoning. Future you (and future me) will thank present us.

Format: `YYYY-MM-DD — Decision — Why`

---

## 2026

### 2026-06-02 — Stack: Expo SDK 54 + Expo Router + NativeWind 4 + Zustand + Supabase
Chosen as the simplest path to a calm, polished mobile app with file-based routing and a real backend. Expo's managed workflow avoids native build complexity for v1.

### 2026-06-02 — Emotion framework: Hybrid Plutchik + Atlas
Plutchik provides the 3-level hierarchy users navigate (8 primaries → secondaries → tertiaries). Atlas of Emotions style provides the descriptive content (similar words, sensations, what-it-tells-you, how-it-helps). Schema (`framework` column on `emotion_details`) supports adding more wheels later without migration.

### 2026-06-02 — Privacy: DB encryption at rest + Row Level Security
Supabase's default AES-256 at rest plus per-row RLS scoped to `auth.uid()`. End-to-end encryption was considered and deferred — it would block server-side insights and add significant key-management work for what is, in v1, a single-user-per-device app.

### 2026-06-02 — Offline strategy: offline-first with sync queue
Daily reflections can be completed without internet; submissions queue in AsyncStorage and flush on reconnect. Matches mindfulness use cases (planes, retreats, transit dead zones). Idempotency via client-generated UUIDv4.

### 2026-06-02 — Auth: Email magic link only
Passwordless via Supabase Auth `signInWithOtp`. Lowest UX surface, no password management, no social-login App Store mandates (Apple requires Sign in with Apple only if other social logins are present — we have none). Deep link `krystal://auth/callback` returns user to the app.

### 2026-06-02 — Auth (revised for v0.1): anonymous sessions on first launch
Reversed earlier decision for ship-first reasons. v0.1 silently creates an anonymous Supabase session on app launch — no sign-in screen, no email step, friends can use the app immediately. Data persists on-device. v0.2 will add an "upgrade to email" flow in settings that converts the anonymous session to a real one via `supabase.auth.linkIdentity`, preserving existing reflections. The original magic-link decision is the long-term destination — anonymous is the on-ramp.

### 2026-06-02 — Draft state: Zustand in memory, never persisted
Intermediate steps of a reflection are not written to Supabase. The atomic unit is the submitted reflection. Keeps the DB clean, the flow fast, and avoids orphan rows.

### 2026-06-02 — Insights: rule-based, not ML, for v1
A pipeline of hand-written TypeScript functions in `lib/insights.ts`. Each rule is a pure function over the user's last 30 days. ML is explicitly out of scope until we have real usage data to learn from. Insights only show after ≥5 entries to avoid false patterns.

### 2026-06-02 — Out-of-scope for v1: notifications, streaks, social, mood charts
The product philosophy forbids these. Reflection must be self-initiated. We will not add reminders to "boost retention" — that would defeat the purpose.

### 2026-06-02 — Vision: long-term analytics in scope (post-v1)
Week-over-week emotion comparisons, monthly trends, and seasonal pattern surfacing are part of the long-term vision — not v1. The PRD's framing of "not a mood tracker" was removed because the eventual product is mood tracking *plus* a reflective practice on top.

### 2026-06-02 — Audience: wide, low-effort
Reframed from "adults seeking structured emotional self-awareness" to **anyone with 3 minutes**, especially people strapped for time. The whole flow must feel like the easiest possible version of paying attention to yourself.

### 2026-06-02 — Aesthetic: kid-like cartoon-game, not childish
Visual direction is warm, hand-drawn, slightly playful — picture a quieter *Animal Crossing* or *Untitled Goose Game*. Anchored in the belief that emotional awareness is partly about reconnecting with your kid-self. The aesthetic invites that openness without being a kids' app.

### 2026-06-02 — Companion character: a quiet purple grape
Krystal has a small cute purple grape companion that's present through the daily flow. Quiet by default, reactive (not proactive), never judging, never gamified. No variants, no evolutions, no shop. One character, just present.

### 2026-06-02 — Grape is nameless
Some companion characters have names (Duo, Mira, Clippy). The grape doesn't. Keeps the focus on the user's relationship with themselves, not with the character.

### 2026-06-02 — Plutchik chosen as the only user-facing wheel; Atlas content surfaces in journaling
The user picks emotions exclusively from Plutchik's wheel (chosen for its low-to-high intensity rings). Atlas-of-Emotions content is editorially mapped by Gigi to each Plutchik tertiary and appears on the Understanding+Journaling screen — never as a "which wheel?" choice. Mapping is manual post-seed.

### 2026-06-02 — Understanding and Journaling screens merge → 5-step flow (was 6)
The educational content for the chosen emotion (similar words, sensations, what-it-tells-you, how-it-helps-you) is presented as journal prompts to reflect against, not as a passive read followed by separate generic prompts. Reduces the flow from 6 screens to 5 and tightens the reflection loop.

### 2026-06-02 — Journal prompts reframed: sensation + meaning + helpfulness
Original three prompts were cause / purpose / sensation. New prompts are: sensation (body), meaning (what it tells you), helpfulness (how it helps). The original "cause" prompt is dropped — it's largely subsumed by "what is it telling you" and the user can describe the trigger naturally within that.

### 2026-06-02 — `daily_checkins` stores only the specific emotion (one FK, not three)
Originally `daily_checkins` had `emotion_primary_id`, `emotion_secondary_id`, `emotion_specific_id` for fast filtering. Simplified to a single `emotion_id` FK to `emotion_details`. Primary and secondary derive via JOIN through the emotion hierarchy. Tradeoff: insights queries need a 3-table JOIN instead of a single column read — negligible at our scale. Eliminates the possibility of the three columns ever drifting out of sync. Migration `004_simplify_checkin_emotion.sql` applies this change.

### 2026-06-02 — Ship-first strategy: v0.1 = Check-in + Picker + Save only
Gigi's priority is a working mobile app friends can download, not a feature-complete one. v0.1 scope cut to: sign-in → home → mind/body/heart sliders → 3-level Plutchik picker → save. Cut from v0.1 (added in v0.2+): grounding breaths, Reflect screen (understanding + journaling), insights, grape companion polish, full Atlas-mapped emotion content. Distribution path: EAS Internal Distribution first (no Apple Developer needed, ~100-tester limit), TestFlight later.

### 2026-06-02 — Emotion taxonomy seeded minimally for v0.1
Migration `005_seed_plutchik_minimal.sql` seeds 8 primaries × 3 secondaries × 3 tertiaries = 72 emotion names. No Atlas content (similar_words, sensations, what-it-tells-you, how-it-helps-you) yet — those are backfilled in v0.2 when the Reflect screen exists to surface them.

### 2026-06-02 — v0.2 design notes for Check-in screen
For v0.2: split the Mind/Body/Heart prompts onto **one screen per dimension** (currently all three are stacked on one scrollable screen). The single-question pacing matches the calm aesthetic better than a "fill out this form" feel. Also: needs to be **prettier, smoother, more colorful** overall — current rendering is functional but minimal. Real design pass comes with the grape companion + the cartoon-game polish work.

### 2026-06-02 — v0.2 design notes for Emotion picker
Colors and structure work for v0.1. For v0.2:
- **Calm motion** — tiles should fade in and out slowly when transitioning between screens (evokes calm, not snap)
- **Title and copy rewrite** — current headers ("What's coming up for you?", "Which kind?", "Closer to…") are placeholders
- **Tile sizing** — likely needs adjustment, TBD with design
- **Eventually: the actual Plutchik wheel visualization** instead of a grid of tiles, so the user picks by selecting a wedge of the wheel. Grid-of-tiles is the ship-fast version; the wheel is the destination.

### 2026-06-02 — Dark mode (v0.3+)
Gigi wants dark mode eventually. Deferred to v0.3 after the v0.2 visual polish is done. Implementation: use NativeWind's `dark:` variants + React Native's `useColorScheme()`. Palette will need parallel dark tokens (cream → near-black warm brown, ink → cream, accent stays terracotta but lower opacity, emotion colors slightly desaturated).

### 2026-06-02 — History view + analytics (v0.3)
Gigi wants users to access their reflection history after "logging in" — see past entries, eventually analytics on patterns. Two-part build:
- **History list** (v0.3 early): a `/history` route that lists the user's `daily_checkins` rows in reverse chronological order. Each row shows date, MBH scores, and the emotion path. Tap a row to see detail. Requires real auth (anonymous → email upgrade) so history persists across devices — otherwise it's per-browser only.
- **Analytics / insights** (v0.3 later): the rule-based Insights screen from PRD §5. Pattern observations over the last 30 days. Already specced in the PRD; just defer build until after history works.

### 2026-06-02 — Primary emotion picker → wheel format
User-facing UX changes from an 8-tile grid to a Plutchik-style 8-wedge wheel (SVG). Opposite emotions sit across from each other (joy↔sadness, trust↔disgust, fear↔anger, surprise↔anticipation). Tap a wedge to select. Built in `components/EmotionWheel.tsx`. Secondary and specific pickers stay as tiles for now — they'll get a wheel-or-list treatment in a later pass.

### 2026-06-02 — Emotion framework changed: Plutchik → Geoffrey Roberts
The Plutchik 8-primary wheel was replaced with the Geoffrey Roberts feelings wheel (7 primaries: Happy, Surprised, Bad, Fearful, Angry, Disgusted, Sad). Roberts' taxonomy is richer (variable secondaries per primary, 4–9 each; 80+ tertiaries total) and matches the wheel Gigi prefers conceptually. The change is destructive: migration `006_replace_taxonomy.sql` wipes the old Plutchik data + any daily_checkins that referenced it and reseeds. The `emotion_details.framework` column is now set to `'roberts'`. Secondary picker dropped the intensity-ordering UI (Roberts wheel isn't intensity-based, it's thematic).

### 2026-06-09 — History view + journal-gating (this session)
Built `/history` route that lists past daily_checkins with inline-expandable journal answers. Today's entry sits at top. Home screen detects today's entry via `lib/history.fetchTodaysEntry` and shows a **"View history" link only after today's journal_entries row exists** (per Gigi's gating rule). If daily_checkin exists but journal doesn't, Home shows "Continue today's journal" instead. Journal screen now hydrates from Supabase if a user returns mid-flow in a fresh session (draft state empty but daily_checkin row exists). **Edit mode for today's entry is still pending** — deferred to next iteration.

### 2026-06-09 — Journal screen + Plutchik educational content
After Done, user can "Continue to journal". New `/journal` screen surfaces six write prompts (reflection, why-feeling, body sensations, what-is-hard, what-is-life-giving, what-do-you-need) alongside read-only Plutchik educational content (similar words, sensations, what-it-tells-you, how-it-helps-you, from `lib/plutchikContent.ts` — 8 primary entries). Journal entries link to the just-saved daily_checkin via `daily_checkin_id`. SQL migration `008_journal_fields.sql` adds the new columns. All journal fields optional.

### 2026-06-02 — Second emotion layer: Plutchik intensity ladder
After picking a Roberts tertiary, the user picks an intensity level on a Plutchik ladder (low / mid / high). Each ladder is the standard Plutchik intensity gradient (e.g. Sadness: Pensiveness → Sadness → Grief). Roberts-to-Plutchik mapping with subcategory overrides on Happy:
- Sad → Sadness ladder
- Bad → Disgust ladder
- Disgusted → Disgust ladder
- Angry → Anger ladder
- Fearful → Fear ladder
- Surprised → Surprise ladder
- Happy → Joy ladder (default)
- Happy / Trusting → Trust ladder (override)
- Happy / Proud → Trust ladder (override)
- Happy / Interested → Anticipation ladder (override)

Stored in `daily_checkins.plutchik_emotion` (text, nullable). New screen `app/(flow)/emotion/intensity.tsx`. Mapping logic in `lib/plutchik.ts`. SQL migration `007_add_plutchik_emotion.sql` adds the column. The done screen shows both labels: the Roberts tertiary (large) and the Plutchik emotion in smaller subtitle below.

---

## Template for future entries

```
### YYYY-MM-DD — [Decision title]
[Two-to-four sentences. What did we decide, what were the alternatives, why this one.]
```
