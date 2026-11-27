import { AnalyticsClient, startPostHog } from "./posthogClient";

/**
 * Crystal — analytics wrapper around PostHog.
 *
 * Thin, name-your-events layer. Every place in the app that fires an event
 * calls a named function here (e.g. `trackCheckinSaved({...})`) — the raw
 * `posthog.capture(...)` API is only used inside this module. Benefits:
 *
 *   1. One place to see every event Crystal ever fires (grep this file).
 *   2. Rename an event without touching every call site.
 *   3. Silently no-op when the PostHog key is missing (dev / preview builds
 *      keep working without analytics).
 *   4. Swap PostHog for another provider (Amplitude, Mixpanel) by rewriting
 *      just this file.
 *
 * If you're wiring in a new event: add a named function here first, then call
 * it from the screen. Never call PostHog directly outside this file.
 *
 * Metrics dashboard reference (docs/pm_portfolio/README.md):
 *   - North star: % of WAU hitting 5-day journal streak
 *   - Inputs: day-1 retention, day-2 retention, journal completion rate,
 *             hat unlock rate
 * These metrics are computed in PostHog from the events below — this file
 * just fires the raw signal.
 */

let initialized = false;
let client: AnalyticsClient | null = null;

// ─── Lifecycle ──────────────────────────────────────────────────────────────

/**
 * Initialize PostHog. Idempotent — safe to call multiple times.
 * Runs from app/_layout.tsx on app boot.
 */
export function initAnalytics(): void {
  if (initialized) return;
  const key = process.env.EXPO_PUBLIC_POSTHOG_API_KEY;
  const host =
    process.env.EXPO_PUBLIC_POSTHOG_HOST ?? "https://us.i.posthog.com";

  if (!key) {
    // No key configured — silently no-op. All track functions below check
    // `initialized` and return early. This keeps dev + preview builds clean.
    if (typeof console !== "undefined") {
      console.info(
        "[analytics] EXPO_PUBLIC_POSTHOG_API_KEY not set — analytics disabled"
      );
    }
    return;
  }

  // Web uses posthog-js, iOS/Android use posthog-react-native. Metro picks
  // the right file (posthogClient.ts vs posthogClient.native.ts).
  client = startPostHog(key, host);
  if (!client) return;

  initialized = true;
}

/**
 * Attach the current user identity to the analytics session.
 * Called after Supabase anonymous auth resolves.
 */
export function identifyUser(userId: string, isAnonymous: boolean): void {
  if (!initialized) return;
  client!.identify(userId, { anonymous: isAnonymous });
}

/**
 * Called on sign-out to reset the analytics identity.
 */
export function resetAnalytics(): void {
  if (!initialized) return;
  client!.reset();
}

// ─── Domain events ──────────────────────────────────────────────────────────

/**
 * Fired every time a daily_checkins row is saved (insert OR update).
 * The `capture_mode` field distinguishes Quick Capture (30s flow) from
 * Deep Reflection (full 5min flow). Quick captures may omit mind/body/heart
 * and the emotion.
 */
export function trackCheckinSaved(props: {
  capture_mode: "quick" | "deep";
  mind?: number | null;
  body?: number | null;
  heart?: number | null;
  emotion_primary?: string | null;
  has_note?: boolean;
  is_edit: boolean;
}): void {
  if (!initialized) return;
  client!.capture("checkin_saved", props);
}

/** Fired every time a journal_entries row is saved (insert OR update). */
export function trackJournalSaved(props: {
  filled_field_count: number;
  has_content: boolean;
  is_edit: boolean;
}): void {
  if (!initialized) return;
  client!.capture("journal_saved", props);
}

/**
 * Fired on every home-page load once entries are hydrated. Includes both
 * streak flavors so the PostHog dashboard can compute either lenient (any
 * check-in) or strict (journal content) cohorts without a code change.
 *
 * The north-star cohort ("hit 5-day journal streak") is defined in the
 * PostHog UI as: users where max(streak_snapshot.journal_streak) >= 5.
 */
export function trackStreakSnapshot(props: {
  checkin_streak: number;
  journal_streak: number;
  is_returning: boolean;
}): void {
  if (!initialized) return;
  client!.capture("streak_snapshot", props);
}

/**
 * Fired the first time the user reaches a milestone (grape unlock at 2,
 * hat unlock at 5, etc). Home computes "did we cross a threshold this
 * session?" and fires accordingly.
 */
export function trackMilestoneReached(props: {
  milestone: "grape_unlocked" | "hat_unlocked";
  streak_at_unlock: number;
}): void {
  if (!initialized) return;
  client!.capture("milestone_reached", props);
}

/** Fired when a backpack item is equipped or unequipped. */
export function trackItemToggled(props: {
  item_slug: string;
  equipped: boolean;
}): void {
  if (!initialized) return;
  client!.capture("item_toggled", props);
}
