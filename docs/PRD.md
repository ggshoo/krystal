# Crystal — Product Requirements Document

**Status:** Living doc · v2.0 · 2026-07-05
**Owner:** Gigi Hsu
**Codebase name:** `krystal` (internal). **Product name:** `crystal` (user-facing).

> **What changed in v2.0.** The v1.0 PRD (2026-06-02) was written for a broad "anyone with 3 minutes" audience and explicitly excluded reminders, watch integration, and multiple surfaces. v2.0 sharpens the target user, embraces multi-surface presence, and admits reminders back into scope — carefully. It also documents the streak / backpack reward system that shipped between v1 and v2. Anti-patterns and product philosophy are preserved.

---

## 1. Vision

Crystal helps busy young adults answer the question *"how am I actually feeling?"* — in the 30 seconds they can spare between meetings, not in the hour they don't have. It meets them wherever they are (phone, watch, computer, text) and captures a check-in before the moment passes.

Over time, the daily practice becomes emotional fluency: pattern recognition, richer vocabulary, and — for the many who are in therapy or considering it — a small artifact to bring back to a session.

## 2. Target user (ICP)

The primary user is a **busy young adult starting out in their career, still figuring themselves out.**

Specifically:
- **Age:** 22–32.
- **Life stage:** early to mid career. Full-time job or the equivalent grind (grad school, portfolio building, freelance). Life is happening fast.
- **Mental health context:** currently in therapy, has been in therapy in the last 12 months, or is seriously considering starting.
- **Behavior signal:** has tried a wellness app before (Reflectly, Daylio, Finch, Stoic, or the Notes app). Some of them stuck, most didn't.
- **Constraint:** genuinely does not have 20 minutes to journal daily. Has 30 seconds between subway stops.
- **Emotional posture:** wants to be better with feelings, feels behind on it, worries about "doing self-care wrong."

They are the only audience for their own data. No followers, no share features.

### Anti-target

We are **not** for:
- People who already have a robust daily journaling practice — they don't need us.
- Kids or teens (different product, different regulatory considerations).
- People in acute crisis — we're not a crisis app and shouldn't pretend to be. Copy should point users to real crisis resources when appropriate.

## 3. The core problem

The ICP faces three simultaneous forces:

1. **Distraction.** Notifications, meetings, deadlines, dating apps, family texts. There's no natural pause in the day where reflection is easy.
2. **Cognitive load.** Even a 3-minute journal feels like homework at 8pm when they're already fried.
3. **Perfectionism about self-care.** They've internalized that they *should* be journaling, meditating, doing gratitude lists. The gap between should and reality generates shame, which becomes another reason not to open a wellness app.

The unlock: a check-in that takes 30 seconds and doesn't feel like homework. The 30-second version is the *daily* version. The deeper version is the *sometimes* version.

## 4. Solution — dual-mode capture across every surface

Two capture modes, always available. The user picks in the moment.

### Quick Capture (default — 30 seconds)

- Open the app / widget / text.
- Big emotion picker: 8 primary emotions, one tap.
- Optional one-line "what's happening" (voice or text).
- Save. Grape acknowledges. Done.

This is the daily bar. If a user only ever does this, the product is working.

### Deep Reflection (opt-in — 5 minutes)

- The existing full flow: Mind / Body / Heart check-in → emotion wheel (primary → secondary → tertiary → intensity) → done → six journal prompts.
- Positioned as *"when you have time"* or *"for your next therapy session"*.
- Accessed via a secondary link on the home page: **"take a deeper reflection"**.

Both modes count toward the streak equally. The product does not moralize about depth.

### Seamless multi-surface access

Crystal is present wherever the user already is. Phased rollout:

| Surface | Mechanism | Phase |
|---|---|---|
| **Web (mobile + desktop)** | Live at krystal-one.vercel.app | ✓ shipped |
| **Progressive Web App** | Add manifest + service worker; installs to phone home screen. iOS 16.4+ supports web push. | Next |
| **iOS native** | Expo build → TestFlight → App Store. | Phase B |
| **iOS home screen widget** | WidgetKit extension. One tap opens Quick Capture. | Phase B |
| **Apple Watch** | watchOS companion app via WatchConnectivity. Mirror Quick Capture only. | Phase C |
| **SMS check-in** | Twilio number: text an emotion + one line → saved to your account. Great for on-the-go and low-friction. | Phase B (may leapfrog to A if Twilio account is easy) |
| **Android** | Same Expo build path as iOS. | Phase C |

**Design principle for every surface:** *the shortest path from thought to saved reflection.* No sign-in gates, no wheel scrolls, no 6-prompt gauntlet. Deep Reflection stays available but is never the required path.

## 5. Reminders — frequent but not annoying

Reminders are back in scope (they were out of scope in v1.0). The user explicitly asked for them. Design them well or don't ship them.

### Rules

- **User-chosen anchor time.** Never a marketing team's guess. The user picks their moment.
- **One reminder per day maximum.** Baseline. Even that's opt-in.
- **Content is the *action*, not the ask.** *"how's your body feeling?"* — not *"come back to Crystal!"*.
- **Voice matches the grape.** Small, quiet, warm. Never guilt-tripping.
- **Graceful escalation, then disengagement.**
  - Day 1 skip: nothing.
  - Day 2 skip: gentle nudge at the same anchor time.
  - Day 3 skip: gentle nudge with an easier ask (*"even just one word today?"*).
  - Day 7 skip: reminder turns off automatically. The user comes back when they're ready.
- **Surface-appropriate.** Watch = haptic tap only. Phone = notification. SMS = a short text from the crystal number. No email — that's noise.
- **Never streak-shaming.** A missed day never generates guilt copy. The product's job is to be there when you show up, not to punish absence.
- **Off is easy.** One-tap disable in settings. No dark patterns.

### Reminder anchor menu (initial set)

The user picks any subset. Times are user-configurable:

- **Morning coffee** (default 8:00 am)
- **Lunch pause** (default 12:30 pm)
- **Between meetings** (adaptive — TBD, out of scope for v0.3)
- **Before therapy** (user picks day + time; nudge fires 1 hour before)
- **Bedtime wind-down** (default 10:00 pm)

Default state at first launch: **all reminders off.** User must actively opt in. The absence of nagging IS a feature.

## 6. Product principles (preserved from v1.0)

These are non-negotiable and apply across every surface and mode.

- **Calm.** Visuals, motion, and copy reduce arousal.
- **Warm.** The product feels like a friend, not a tool.
- **Encouraging.** *"Nice work"* lives here; *"You crushed it!"* doesn't.
- **Cute, but not childish.** Thoughtful cartoon-game aesthetic. Untitled Goose Game energy, not kids' app.
- **Reflective.** The product asks more than it tells.
- **Safe.** No diagnostic language. Possibility-framed copy throughout (*"this may be telling you…"*).
- **Non-judgmental.** No "right" emotions. No optimization framing of scores.

### New v2.0 principle

- **Seamless.** The user should never have to *decide* to open Crystal — they should already be in it. Widgets, watches, texts. The shortest path wins.

## 7. Anti-patterns (updated for v2.0)

Five things Crystal will never do:

- **No social features.** No feed, no friends, no share to other users.
- **No gamification of guilt.** Streaks exist, but broken streaks never trigger notifications or shame copy.
- **No engagement-farming design.** No infinite scroll. No "you have 3 unread insights!" hooks.
- **No selling insights back to the user as a paywalled feature.** The pattern-observation stays free.
- **No diagnostic claims.** Never *"you have anxiety"* — always *"anxiety may be present."*

**What v2.0 changes vs. v1.0:** the flat *"no notifications, no reminders"* rule is retired. Reminders are now permitted under the rules in §5.

## 8. Companion — Crystal (the grape)

The purple grape character is the product's emotional anchor. The user's implicit friend. Renamed with the product from Krystal → Crystal.

Principles from v1.0 carry:

- **Quiet by default.** No unsolicited tips.
- **Reactive, not proactive.** Softens in response to what the user does.
- **Never judges.** Doesn't react more positively to "good" emotion choices.
- **One character.** No evolutions, no shops, no lore.

New in v2.0:

- **Backpack + rewards.** Users earn items (currently: a knit hat at 5-day streak) as small quiet moments of recognition. The user chooses whether to equip. This is *not* gamification of guilt — earned items stay in the backpack forever, and unearned days never punish.
- **Streak-gated on home.** The grape only appears on the home screen once the user has hit a 2-day streak. Before that, home is minimalist. The grape's arrival is the first reward.
- **Multi-surface.** The grape shows up wherever Crystal shows up — home screen widget, Apple Watch complication, SMS confirmation.

## 9. Metrics — north star + inputs

### North star

> **% of weekly active users who hit a 5-day journal streak.**

A journal streak is consecutive days with non-empty journal content. WAU = any user with a check-in in the last 7 days. This measures whether the ICP is finding *depth* alongside consistency.

The home-page "N days in a row" number is a separate, more lenient count (any check-in, quick or deep). That's the motivation surface; the north star is the analytics surface.

### Input metrics (dashboarded)

1. **Day-1 retention.** % of new users who check in on day 2.
2. **Day-2 retention.** Same, sliced to the day-2 grape unlock cohort.
3. **Journal completion rate.** % of check-ins where at least one journal prompt was filled.
4. **Hat unlock rate.** % of users who reach a 5-day journal streak.
5. **Quick Capture vs. Deep Reflection split.** % of check-ins that use each mode. The healthy state is *Quick Capture dominant* (that's the ICP win); Deep Reflection should be the sometimes mode.

Full definition + PostHog wiring in `docs/pm_portfolio/README.md`.

## 10. What's shipped (v0.3, live now)

- Welcome → Mind → Body → Heart → primary wheel → secondary → tertiary → intensity → done → journal (this is the Deep Reflection flow)
- One reflection per day per user (upsert pattern)
- Anonymous Supabase auth + email upgrade
- History view (expandable cards)
- Streak counting (both lenient and strict, both fired to analytics)
- Backpack + hat unlock at day 5
- Grape companion with per-emotion face variations
- Dark mode (system-following)
- Web build at krystal-one.vercel.app
- PostHog analytics (queued — needs account setup)

## 11. What's next (v0.4 build order)

Ordered by ICP leverage:

1. **Quick Capture mode.** New screen `app/quick-capture.tsx`. Big 8-emotion picker + optional one-line + save. Home page CTA becomes *"quick check-in"* (default) with *"take a deeper reflection"* as secondary link.
2. **PWA foundations.** `manifest.json`, favicon set, service worker for offline shell, "add to home screen" prompt. Makes the web app installable.
3. **Reminders v1.** Settings screen. Anchor time picker. Web push notifications (iOS 16.4+ Safari + Android). Rules in §5.
4. **SMS check-in via Twilio.** Register a number. Inbound SMS webhook → parse → save via existing Supabase RLS-scoped user. Requires linking a phone number to the user account.
5. **iOS TestFlight build.** Expo → EAS Build → TestFlight. Enables home screen widget and Apple Watch work later.
6. **Home screen widget (iOS).** WidgetKit extension calling Quick Capture.
7. **Apple Watch app.** watchOS companion mirroring Quick Capture.

Steps 1–4 unblock the "seamless" vision without leaving Expo/web. Steps 5–7 add native reach.

## 12. Success criteria (v2.0)

- **North star ≥ 20%** within 90 days of the ICP-refined recruit + PWA + Quick Capture shipping.
- **A first-time user can complete Quick Capture in under 30 seconds** on a mobile browser with a normal connection.
- **The web app works offline.** Reflections queue locally and sync on reconnect.
- **Reminder opt-in rate ≥ 40%** among users who complete their first Quick Capture. (Users who set a reminder are meaningfully choosing to invite Crystal into their day.)
- **≥ 5 real user interviews** in the ICP demographic completed and synthesized before any Deep Reflection UI is redesigned.
- **The product feels calm to actual users.** Qualitative signal from those interviews.

Explicitly NOT success criteria:

- DAU / MAU / time-in-app growth — those metrics push toward the anti-patterns in §7.

## 13. Open questions

Tracked as `D-NNN` open decisions in `ai_context/current_state.md`. Currently:

- **D-002 (grape rendering):** hybrid PNG (home) + SVG (in-flow corner). Agreed; awaiting PNG assets.
- **D-004 (resolved 2026-07-05):** Quick Capture allows "just checking in" with no emotion selected. Nothing is required except tapping save. Rationale: the ICP is distracted and time-pressed — friction cost of requiring a selection is higher than the analytical cost of null-emotion entries. Analytics can still slice by `emotion_primary is null`. Applied in `app/quick-capture.tsx`.
- **D-005 (new for v2.0):** Should therapy-export be a first-class feature or a nice-to-have? First-class strengthens the ICP fit; nice-to-have keeps scope tight.
- **D-006 (new for v2.0):** Should the SMS check-in charge us per message (Twilio) or be free-tier limited to N per day? Affects sustainability.

Answers land in `docs/DECISIONS.md` as ADRs when made.

## 14. Portfolio angle

Crystal is Gigi's headline PM portfolio piece. Every product decision documented in this PRD is a potential case study. The most portfolio-shaped moves in v0.4:

- **The dual-mode capture decision.** Why did we split Quick Capture from Deep Reflection instead of shortening the full flow? Trade-off case study.
- **The reminder design constraints.** Notifications are a hotly debated PM topic; documenting a principled framework (§5) is itself an artifact.
- **The multi-surface roadmap.** Sequencing PWA → SMS → Widget → Watch is a resource-constrained prioritization exercise. Recruiters love this.
- **The therapy-adjacent positioning.** A defensible target-user story that's *not* the wellness-app cliché.

Full skills mapping in `docs/pm_portfolio/skills.md`.
