# Krystal — Build Roadmap

**Status:** Living doc · v1.1 · 2026-06-02

A ship-first path. v0.1 gets a working app into friends' hands as fast as possible. v0.2+ adds the calmer/richer features. Each phase has clear deliverables and a definition of done so we know when to move on.

## What we're shipping when

- **v0.1 — friends-can-download.** Sign in → Mind/Body/Heart → Plutchik picker → Save. EAS Internal Distribution. **Target: 1 week of focused work.**
- **v0.2 — the calmer one.** Add Grounding screen + Reflect screen (Understanding + Journaling) + full Atlas-mapped emotion content + the grape companion.
- **v0.3 — the smarter one.** Add Insights screen with rule-based pattern observations. Settings (sign out, delete data).
- **v1.0 — TestFlight.** Polish, real icon/splash, App Store submission via TestFlight.

---

## Phase 1 · Bootstrap ✅

**Status:** complete (`7327257 chore: bootstrap Expo project`)

What we shipped:
- Expo SDK 54 project with TypeScript + Expo Router + NativeWind 4
- Zustand store stub for reflection draft
- Supabase client stub
- Placeholder home screen rendering on phone via Expo Go
- `.env.example`, `.gitignore`, `README`

---

## Phase 2 · Architecture docs ⬅ current

**Status:** in progress

Deliverables:
- [x] `docs/PRD.md` — product spec
- [x] `docs/ARCHITECTURE.md` — folder structure, data flow, decisions
- [x] `docs/ROADMAP.md` — this file
- [x] `docs/DECISIONS.md` — append-only decision log
- [ ] Updated `README.md` (SDK 54, link to docs)

Definition of done:
- All four docs committed
- Gigi has read each one and pushed back where wrong
- README reflects current stack

---

## Phase 3 · Database schema + Row Level Security ⬅ current

**Goal:** A Supabase project with all v1 tables, RLS policies, and a smoke-test seed.

Deliverables:
- [x] Mermaid ER diagram (in chat — to be archived in `docs/ARCHITECTURE.md` if needed)
- [x] `supabase/migrations/001_init.sql` — `profiles`, `daily_checkins`, `journal_entries`, `emotion_categories`, `emotion_subcategories`, `emotion_details`, auth-trigger
- [x] `supabase/migrations/002_rls.sql` — RLS policies on every user-owned table
- [x] `supabase/migrations/003_seed_smoke.sql` — Fear → Anxiety → Overwhelmed smoke test
- [x] `supabase/migrations/004_simplify_checkin_emotion.sql` — collapse 3 emotion FKs to 1
- [x] `supabase/migrations/README.md` — how to run them in the dashboard
- [ ] **Gigi runs all four in Supabase SQL Editor**
- [ ] Manual verification: tables visible in Table Editor, RLS confirmed by test query

Definition of done:
- Schema runs cleanly on a fresh Supabase project
- A test user can only read their own rows
- The smoke-test emotion appears in `emotion_details`

Estimated work: ~1.5 hours

---

## Phase 4 · Emotion taxonomy — minimal seed (v0.1 scope)

**Goal:** Enough emotion names to make the picker work. Atlas content is deferred to v0.2 when the Reflect screen exists to surface it.

Deliverables:
- [x] `supabase/migrations/005_seed_plutchik_minimal.sql` — 8 × 3 × 3 = 72 emotions (names only)
- [x] Adds `sort_order` column to `emotion_details` (lets the picker order tertiaries by intensity)
- [ ] **Gigi runs `005` in Supabase SQL Editor**

Definition of done:
- `select count(*) from public.emotion_categories` returns 8
- `select count(*) from public.emotion_subcategories` returns 24
- `select count(*) from public.emotion_details` returns 72

### Phase 4b · Atlas content backfill (deferred to v0.2)

For each tertiary, edit-in: similar_words, sensations, what_it_tells_you, how_it_helps_you. Done by Gigi after Plutchik mapping; Cowork drafts copy that Gigi refines for tone.

---

## Phase 5 · v0.1 screens (ship-first)

**Goal:** A working daily flow that friends can use. Check-in → Picker → Save. No grounding screen, no Reflect screen, no insights — those come in v0.2.

Built **one screen at a time**, each as its own focused work session. Each commits separately.

- [ ] **5.1 Check-in** — `app/(flow)/check-in.tsx` · three sliders (Mind, Body, Heart) with anchor examples · ~1 hr
- [ ] **5.2 Emotion picker** — `app/(flow)/emotion/{primary,secondary,specific}.tsx` · 3 sub-screens · color-coded tiles drawn from Plutchik seed · **2–3 hrs (the hardest screen)**
- [ ] **5.3 Done / confirmation** — `app/(flow)/done.tsx` · save handler · simple "saved" message · ~45 min
- [ ] **5.4 Home wired up** — Home's "Begin" button navigates into the flow · ~15 min

Definition of done:
- Full flow runs end-to-end in Expo Go
- All draft state preserved across screen transitions via `useReflectionStore`
- A reflection saves successfully to Supabase

Estimated work: ~5 hours.

## Phase 5.5 (v0.2) · The calmer screens

After v0.1 ships, layered on:

- [ ] **Grounding** — `app/(flow)/grounding.tsx` · three-breath animation · ~1 hr
- [ ] **Reflect** — `app/(flow)/reflect.tsx` · Understanding + Journaling merged · ~2 hrs
- [ ] **Atlas content backfill** for all 72 emotions
- [ ] **Grape companion** — sketch, then implement

---

## Phase 6 · Auth, persistence, insights

**Goal:** A real, usable app — sign in, save reflections, see patterns.

Sub-phases done in order:

### 6.1 Auth
- [ ] `app/(auth)/sign-in.tsx` — email magic-link UI
- [ ] `lib/auth.ts` — sign in / out / current user helpers
- [ ] Deep-link callback handling (`krystal://auth/callback`)
- [ ] Protected `(flow)` group — redirect to sign-in if no session

### 6.2 Persistence
- [ ] Submit handler in `done.tsx` writes `daily_checkins` + `journal_entries` to Supabase
- [ ] RLS verification: confirm test user A cannot read user B's data
- [ ] Idempotent inserts (UUIDv4 from client)

### 6.3 Offline sync
- [ ] `lib/sync.ts` — queue in AsyncStorage, NetInfo listener, flush on reconnect
- [ ] Failed submit falls back to queue silently
- [ ] Manual test: airplane mode → reflect → return online → row appears in DB

### 6.4 Insights
- [ ] `lib/insights.ts` — 5–8 rule functions
- [ ] `app/insights.tsx` — list of `InsightCard`s
- [ ] Empty state if user has <5 entries
- [ ] Verified each rule produces sensible output on test data

### 6.5 Settings
- [ ] `app/settings.tsx` — sign out + delete all data + privacy info

Definition of done:
- A fresh test user can sign up, complete 7 days of reflections, see at least one insight
- All RLS verified by attempting cross-user reads (should fail)
- Offline submission demonstrably works

Estimated work: ~1.5–2 weeks part-time

---

## Phase 7 · Ship — EAS Internal Distribution (v0.1 finish line)

**Prerequisite:** None. Free Expo account is enough.

Deliverables:
- [ ] `eas.json` configured for `internal` distribution
- [ ] First successful `eas build --platform ios --profile preview`
- [ ] Install link shared with at least 3 friends
- [ ] At least 1 friend completes a real reflection on their own phone

Definition of done:
- Friend taps a link, gets the app on their phone, signs in, completes a reflection — without you helping.

## Phase 8 · TestFlight (v1.0)

**Prerequisite:** Apple Developer account ($99/yr) active.

Deliverables:
- [ ] App icon + splash (replace defaults)
- [ ] Real app metadata (name, description, screenshots)
- [ ] First successful `eas build --platform ios --profile production`
- [ ] First TestFlight upload
- [ ] PostHog wired up (post-launch — only after we know what we want to measure)

Definition of done:
- Krystal is installable from TestFlight
- A tester completes a full reflection on a TestFlight build

---

## Things NOT on this roadmap (and why)

- **Android version** — focusing iOS for v1; Expo lets us pivot when wanted.
- **Push notifications** — explicitly out of scope per PRD philosophy.
- **Apple Health / Watch integration** — defer until we know the user pattern.
- **AI-generated reflections** — would change the product fundamentally; revisit only after seeing real usage.
- **Web app** — different product. Stay focused.
- **Multi-language** — important eventually, not v1.

---

## How to use this roadmap

- One phase active at a time. Don't multitask phases.
- Check off boxes as you go.
- When a phase completes, commit with `feat(phaseN): ...` and update this doc.
- When something planned turns out wrong, edit this doc and note in `DECISIONS.md`.

Plans are useful, not sacred.
