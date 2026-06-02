# Krystal — Build Roadmap

**Status:** Living doc · v1.0 · 2026-06-02

A phased path from "scaffold" to "TestFlight-ready MVP." Each phase has clear deliverables and a definition of done so we know when to move on.

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
- [x] `supabase/migrations/README.md` — how to run them in the dashboard
- [ ] **Gigi runs all three in Supabase SQL Editor**
- [ ] Manual verification: tables visible in Table Editor, RLS confirmed by test query

Definition of done:
- Schema runs cleanly on a fresh Supabase project
- A test user can only read their own rows
- The smoke-test emotion appears in `emotion_details`

Estimated work: ~1.5 hours

---

## Phase 4 · Emotion taxonomy content

**Goal:** A fully populated emotion database covering hybrid Plutchik + Atlas content.

Deliverables:
- [ ] `supabase/seed/emotions.ts` — TypeScript file producing INSERT statements
- [ ] 8 primaries × ~4 secondaries × ~4 tertiaries ≈ **~120 emotion entries**
- [ ] Every entry has: name, similar_words (3–5), sensations (3–5), what_it_tells_you, how_it_helps_you
- [ ] All copy possibility-framed (no diagnostic claims)
- [ ] Sources cited in comments (Plutchik, Atlas of Emotions, etc.)
- [ ] **Gigi reviews 10 random entries for tone before bulk approval**

Definition of done:
- Seed runs; all rows present in Supabase
- Gigi has read a random 10 and approved
- Copy passes the tone check: no "you should," no "always," no diagnostic language

Estimated work: ~2–3 hours (mostly content, not code)

---

## Phase 5 · Daily reflection screens

**Goal:** All six steps of the daily flow built, polished, and runnable end-to-end on device.

Built **one screen at a time**, each as its own focused work session. Each screen commits separately.

- [ ] **5.1 Grounding** — `app/(flow)/grounding.tsx` · breath animation · ~200 LOC · 1 hr
- [ ] **5.2 Check-in** — `app/(flow)/check-in.tsx` · three sliders with anchor examples · 1 hr
- [ ] **5.3 Emotion picker** — `app/(flow)/emotion/{primary,secondary,specific}.tsx` · 3 sub-screens · color-coded tiles · **2–3 hrs (the hardest screen)**
- [ ] **5.4 Reflect** — `app/(flow)/reflect.tsx` · merged Understanding + Journaling · educational content paired with three journal prompts (sensation, meaning, helpfulness) · "Explore more" affordance · ~2 hrs
- [ ] **5.5 Done / confirmation** — `app/(flow)/done.tsx` · save handler + one pattern preview · 1 hr

Definition of done:
- Full flow runs end-to-end in Expo Go
- All state preserved across screen transitions via `useReflectionStore`
- Visual pacing matches the calm philosophy (Gigi judges)
- No network calls until the Done screen

Estimated work: ~7–8 hours, ideally spread across 2 weeks

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

## Phase 7 · Ship to TestFlight

**Prerequisite:** Apple Developer account ($99/yr) active.

Deliverables:
- [ ] App icon + splash (replace defaults)
- [ ] Real app metadata (name, description, screenshots)
- [ ] EAS Build configured (`eas.json`)
- [ ] First successful `eas build --platform ios`
- [ ] First TestFlight upload
- [ ] At least 3 invited testers
- [ ] PostHog wired up (post-launch — only after we know what we want to measure)

Definition of done:
- Krystal is installable from TestFlight on a tester's phone
- One full reflection flow completed on a TestFlight build

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
