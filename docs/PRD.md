# Krystal — Product Requirements Document

**Status:** Living doc · v1.0 · 2026-06-02
**Owner:** Gigi Hsu

---

## 1. Vision

Krystal helps people answer a question most of us struggle with: *"How am I actually feeling?"* It is a daily mobile practice that combines mindfulness, emotional intelligence, and reflective journaling into a single calm, non-judgmental experience.

Over time, Krystal aims to help users see how their emotions move week to week, month to month, and across seasons of life — turning daily reflection into the raw material for genuine self-understanding. (Deeper analytics like week-over-week comparisons and seasonal patterns are post-v1; the daily practice comes first so there's something real to look back on.)

## 2. Target user

**Anyone, especially people who are strapped for time.**

Krystal is designed for a wide audience: students, working adults, parents, anyone who has 3 minutes a day and a vague sense that "I should probably check in with myself more." It is deliberately **low-effort**. The whole flow should feel like the easiest possible version of paying attention to yourself — never homework, never a chore.

People who might use it:

- Someone between meetings who wants a quick pause before the next thing
- A student who can't get themselves to journal but can tap through a guided flow
- A parent of small children who has 4 minutes between bedtime and collapsing on the couch
- Anyone in therapy who wants something to bring back to a session
- Anyone not in therapy who wants a private, gentle place to notice what's going on

The user is **the only audience for their own data.** No followers, no friends, no share features. What you reflect on stays with you.

## 3. Product philosophy

### The core idea

**Being aware of your emotions is, in part, about reconnecting with your kid-self.** The part of you that felt things openly before learning to manage, optimize, and suppress. Krystal's job is to make that reconnection feel safe and inviting — not clinical, not aspirational, not productized.

That belief drives every aesthetic and tonal decision below.

### Aesthetic commitments

These are non-negotiable.

- **Calm.** Visuals, motion, and copy reduce arousal, never raise it.
- **Warm.** The product feels like a friend, not a tool. Soft edges, warm palette, gentle motion.
- **Encouraging.** Microcopy is supportive without being saccharine. "Nice work" lives here; "You crushed it!" doesn't.
- **Cute, but not childish.** Picture a thoughtful cartoon game — *Untitled Goose Game* or a quieter *Animal Crossing* — not a kids' app. Cute in the service of opening people up, never in the service of looking young.
- **Reflective.** The product asks more than it tells. Users do the work; we hold the structure.
- **Safe.** No diagnostic language. No claims of certainty about what emotions "mean." Possibility-framed copy throughout.
- **Non-judgmental.** No "right" emotions. No optimization metaphors. No good/bad framing of scores.

### Visual direction (starting point)

Cartoon-game aesthetic, dialed soft:

- Hand-drawn-feeling shapes, slightly imperfect lines
- Warm, slightly desaturated palette (cream base, see Architecture §12)
- Light, playful illustrations woven into transitions, never overwhelming the reflection itself
- Type that feels approachable and unstuffy (final pairing TBD in Phase 5)

### Companion: a small purple grape

Krystal has a quiet companion — **a cute purple grape character** — who appears alongside the user through the daily flow. Not a mascot, not a coach: a small friend who's present and warm. Some principles for the grape:

- **Quiet by default.** It doesn't narrate, lecture, or pop up with tips. Presence over instruction.
- **Reactive, not proactive.** It softens in response to what the user does (e.g. a slow blink during grounding, a gentle wave on confirmation), but doesn't demand attention.
- **Never judges.** It doesn't react more positively to "good" emotion choices or higher scores.
- **One character, not a roster.** No unlockable variants, no "evolutions," no shop. The grape just is.

A name and exact look come in the design phase. For now: small, round, purple, with eyes.

### Anti-patterns

Five things Krystal will never do:

- No social features
- No gamification (badges, levels, points, leaderboards)
- No streak pressure (no "you broke your streak!" notifications)
- No competitive mechanics
- No engagement-maximizing design (no infinite scroll, no notifications designed to pull users back)

## 4. The daily reflection — five-step flow

The core experience. Each step is one screen.

### Step 1 — Grounding

Three guided breaths before any data entry. A short pause to bring awareness to the present moment.

- No skip button. The pause is the point.
- Gentle scale/opacity animation matching breath pacing (~4s in, ~2s hold, ~6s out).
- "Continue" appears after the three breaths complete.

### Step 2 — Mind, Body, Heart check-in

Three sliders, 1–10 each, with low/high anchor examples shown contextually.

- **Mind:** "How are your thoughts today?" *(Low: worried, racing, foggy. High: focused, clear, present.)*
- **Body:** "How does your body feel right now?" *(Low: fatigue, pain, tension. High: relaxed, alive, active.)*
- **Heart:** "How emotionally connected and open do you feel today?" *(Low: numb, closed off. High: open, connected.)*

Stored as `mind_score`, `body_score`, `heart_score`.

### Step 3 — Emotion identification

The product's primary emotional-awareness feature. Three-level progressive selection using **Plutchik's wheel** — chosen because its three rings represent low-to-high intensity of each primary emotion (e.g. *serenity → joy → ecstasy*), making the picker itself a calibration exercise.

- **Level 1 (primary):** 8 options from Plutchik's basic emotions (joy, trust, fear, surprise, sadness, disgust, anger, anticipation).
- **Level 2 (secondary):** mid-intensity variants per primary.
- **Level 3 (specific):** highest-intensity variants per primary (Plutchik's outer ring).

Stored as `emotion_primary`, `emotion_secondary`, `emotion_specific`. All three are required.

Atlas of Emotions content is *not* surfaced as a wheel choice in the picker. It is editorially mapped to each Plutchik tertiary by Gigi (manually, post-seed) and surfaces in the next screen.

Color-coded by primary emotion, used as supportive context only (not the dominant visual element):

- Joy → gold/yellow
- Sadness → blue
- Anger → red
- Fear → purple
- Trust → green
- Disgust → brown
- Surprise → cyan
- Anticipation → orange

### Step 4 — Understanding + journaling (single screen)

The educational content and the journaling prompts live on the same screen. The Atlas-of-Emotions-style content (editorially mapped to the chosen Plutchik tertiary) appears not as something to read, but as **prompts to reflect against**. The user is invited to journal in response to each piece of educational framing.

The selected emotion path is shown at the top: *"Today you identified: Fear → Anxiety → Overwhelmed."*

Then, sequentially:

- **Similar words** for this emotion (e.g. *worried, uneasy, nervous*) — shown as context, no input. Helps the user feel "yes, that's the one" or "actually, the closer word is…"
- **Sensations** (educational): a short list of how this emotion commonly shows up in the body (e.g. *tight chest, restlessness, jittery energy*) — followed by a journal prompt: *"How are you experiencing this in your body right now?"* → `journal_sensation`
- **What this emotion may be telling you** (educational, possibility-framed: *"Anxiety may be telling you that something important to you feels uncertain or at risk."*) — followed by a journal prompt: *"What might it be telling you in your life?"* → `journal_meaning`
- **How this emotion can help you** (educational, possibility-framed: *"Anxiety can help identify risks, prepare for challenges, and clarify priorities."*) — followed by a journal prompt: *"How might it be helping you?"* → `journal_helpfulness`

Each journal field accepts 1–2 sentences (soft cap, not enforced). Each is **optional individually** — a user can leave any single prompt blank.

Two persistent affordances on this screen:

- **"Explore more"** — opens a deeper read-only view of the emotion's educational content (longer description, citations). For users who want context, not journaling.
- **"Done"** — submits whatever was entered (including nothing).

**Critical copy rule:** never make diagnostic claims. Always *"may be telling you,"* *"can sometimes help by,"* *"often, but not always."* If a copy decision creates ambiguity, err toward less certainty.

The act of identifying the emotion is itself the practice — finishing with empty journal fields is a complete reflection.

### Step 5 — Save + insights summary

On submit:

- Write one `daily_checkins` row + optional `journal_entries` row to Supabase (when online) or local queue (when offline).
- Show a calm confirmation screen with one observed pattern, if any (e.g. *"This is your third fear-related entry this week."*).
- One-tap return home.

> Originally the flow was six steps. With Understanding and Journaling now merged into a single screen, the flow is **five steps**: Grounding → Check-in → Emotion Identification → Understanding + Journaling → Save.

## 5. Insights system

The highest-value feature **after** journaling. The purpose is emotional clarity through pattern discovery — not metrics, not gamification.

### v1 scope: rule-based insights

No ML for MVP. Hand-written rule observations like:

- *"Your lowest Heart scores often occur on weekdays."*
- *"Fear-related emotions appear most often after low Body scores."*
- *"Joy-related emotions appear more frequently when you've checked in for two days in a row."*
- *"Anxiety entries commonly mention work."* *(requires simple keyword scan over journal entries)*
- *"Body scores are highest on Saturdays."*

Insights only display once a user has at least **5 entries** (avoid premature pattern-claiming).

Each insight is framed as observation, never prescription. Never *"you should…"* or *"try to…"*.

### Future (post-v1)

- Weekly summary screen
- Monthly emotional trend visualization
- Optional therapist-export feature (PDF of last 30 days)

## 6. v1 (MVP) scope

**In scope:**

- The six-step daily flow
- Emotion taxonomy with hybrid Plutchik + Atlas content
- Daily check-in storage (Supabase, RLS-protected)
- Offline-first reflection (queues locally, syncs when online)
- Email magic-link authentication
- Insights screen with 5–8 rule-based observations
- Calm home screen with daily entry CTA
- Simple settings (sign out, delete all data, view privacy info)

**Explicitly out of scope for v1:**

- Social features of any kind
- Push notifications (reflection should be self-initiated)
- Reminders (revisit in v2 after observing how people actually use it)
- Multiple users per account
- Export / sharing
- AI-generated reflections or suggestions
- Mood charts / trend lines (v1 keeps insights textual)
- Apple Health / fitness integrations
- Apple Watch app
- Web version
- Dark mode toggle (the entire app uses a single thoughtful palette)
- Custom emotion definitions
- Voice journaling

## 7. Success criteria

We deliberately do **not** define success by engagement metrics (DAU, retention, time-in-app). Those would push the product toward the very anti-patterns we're avoiding.

Instead, v1 success means:

- A user can complete the full reflection flow in under 3 minutes on a stable connection.
- The flow works end-to-end offline.
- Insights surface only meaningful, evidence-backed observations (no false patterns).
- Privacy is verifiable: a user can confirm only they see their data (transparent RLS, clear data-deletion).
- The product feels calm to actual users. (Qualitative; collected via 1:1 conversations, not in-app surveys.)

## 8. Open questions for later

- Should there be a "skip a day" affordance, or do we just allow gaps silently? (Currently: silent gaps.)
- Should Mind/Body/Heart scores allow decimals or be integer-only? (Default: integer 1–10.)
- What's the response if a user tries to do two reflections in one day? (Default: overwrite the day's existing entry, with a soft "you already reflected today, this will replace it" confirm.)
- Do we eventually offer prompts in additional languages? (Out of scope for v1, worth tracking.)
- Therapist-export feature (PDF, last N days) — high user-request potential, but adds compliance considerations (HIPAA depending on positioning).
