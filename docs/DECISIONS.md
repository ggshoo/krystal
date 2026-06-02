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

---

## Template for future entries

```
### YYYY-MM-DD — [Decision title]
[Two-to-four sentences. What did we decide, what were the alternatives, why this one.]
```
