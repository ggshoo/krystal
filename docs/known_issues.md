# Known Issues

Bugs, technical debt, and improvement opportunities. Top of list is highest impact.

When you fix something here, delete the entry — the fix lives in commit history. When you discover something new, add it. Don't let this file grow without bound.

---

## Bugs

### B-001 · Streak / history mismatch confuses users · medium

The home page streak counts only days with non-empty journal content, but the history view shows every check-in regardless of journal content. So a user can have "3 days in history" and "2 days in a row" simultaneously.

**Where:** `lib/history.ts → computeJournalStreak` vs `fetchAllEntries`.

**Resolution path:** D-001 in `current_state.md → Open Decisions`. Gigi to choose strict vs lenient.

### B-002 · Sandbox leaves `.git/index.lock` behind · low (infra)

When AI agents run `git add` in the sandbox, the index.lock file sometimes persists with wrong permissions. Subsequent commits fail with "Unable to create '...index.lock': File exists."

**Where:** Sandbox runtime, not project code.

**Workaround:** Document in `ship` skill — every deploy block starts with `rm -f ~/code/krystal/.git/index.lock`.

**Real fix:** None possible at this layer. Live with it.

---

## Type warnings (pre-existing)

### TS-001 · `style` prop type on `Path` and `Text` from `react-native-svg`

```
components/EmotionWheel.tsx(138,15): error TS2322: ...
components/EmotionWheel.tsx(154,15): error TS2322: ...
```

These have been present since the EmotionWheel was first written. `react-native-svg`'s `Path` and `Text` typings don't include a `style` prop in their public types, but the prop works at runtime. The component uses inline style for hover scaling.

**Resolution path:** Refactor to use inline `transform` / `fontSize` props instead of the `style` object. Logged as T-009 in `active_tasks.md`.

---

## Technical debt

### D-001 · No automated test suite

There's no Jest / Vitest / Playwright config. Verification is manual (visual smoke test on the live site).

**Why it persists:** Solo project, fast iteration valued over coverage. The reflection flow is small enough to manually verify.

**When to address:** When a second contributor joins, or when a regression sneaks past us twice in a row.

### D-002 · No pre-commit hook

`npx tsc --noEmit` should run on every commit (rejecting commits that introduce new TS errors). Currently we rely on the agent to remember.

**Why it persists:** Husky or git hooks add friction; Gigi's a solo dev iterating fast.

**When to address:** After the next "build broke in production" incident, or when more agents start touching the repo regularly.

### D-003 · Vercel rewrite uses `:path*` instead of negative lookahead

`vercel.json` has a simple `/:path*` catch-all. Vercel doesn't support regex negative lookaheads, so we can't easily exclude `/_expo/` etc. from rewrites — fortunately the current setup works because Vercel serves static files before applying rewrites.

**Why it persists:** Current setup works. Future routing complexity (e.g. an API route at `/api/*`) might force this to be reworked.

**When to address:** First time we add an API route or static asset path that conflicts.

### D-004 · `STATUS.md` is stale, `LOVABLE.md` is historical

Both files predate the `ai_context/` framework. They're still in the repo but should not be treated as authoritative.

**Resolution path:** Archive them under `docs/archive/` once `current_state.md` has been the source of truth for a month and we're confident nothing references the old files.

### D-005 · Supabase anon JWT was pasted in chat earlier

Gigi pasted the Supabase URL + anon key in a chat session. Anon keys are designed to be public-safe (used in client-side code), but it's still a good habit to rotate keys that leaked.

**When to address:** Whenever Gigi feels like it. Low urgency.

---

## Improvement opportunities

### I-001 · Home page doesn't surface today's entry

Users have to navigate to History → tap today's row to see what they wrote today. Gigi observed confusion ("I journaled but I don't see it"). A small preview card on home would close this loop.

**Logged as:** T-006 in `active_tasks.md`.

### I-002 · No "claim reward" moment when an item unlocks

The hat just appears in the backpack on day 5. There's no celebratory moment, no animation, no "tap to claim" UX. Gigi's intent (per her language: "a hat in their backpack… they can give the grape a hat or not") implies a sense of agency that the current implementation doesn't deliver.

**Logged as:** T-010 in `active_tasks.md`.

### I-003 · The grape's emotion mirror in flow corner could be more dramatic

When the user picks an emotion in the wheel, the corner grape shifts color but the change is subtle on a small (52px) grape. A bigger reaction (face change + small wiggle) would make the cause-and-effect more legible.

**When to address:** Polish pass after Phase 3 items are built.

### I-004 · Anonymous-only users lose data if they clear browser storage

The Supabase session is in localStorage. If they clear cookies/localStorage, the anon user_id is gone and there's no recovery — their reflections are orphaned in the DB.

**Mitigation:** The email-upgrade flow exists but is buried behind a small icon. Could be more prominent after, say, the first week of streaks.

**When to address:** When email upgrade conversion is measurable (post-PostHog integration).

---

## Maintenance

When you add an entry, give it a stable ID prefix:

- `B-NNN` for bugs
- `TS-NNN` for type warnings
- `D-NNN` for tech debt
- `I-NNN` for improvement opportunities

(Note: `D-NNN` here is different from `D-NNN` in `current_state.md → Open Decisions`. Decisions are awaiting human input; tech debt is awaiting engineering time. Keep them in different files but the prefix overlap is acceptable since context disambiguates.)
