import { useRouter } from "expo-router";
import { useEffect, useMemo, useState } from "react";
import { ActivityIndicator, Pressable, Text, View } from "react-native";

import { ChunkyButton } from "@/components/ChunkyButton";
import { FadeIn } from "@/components/FadeIn";
import { GrapeCompanion } from "@/components/GrapeCompanion";
import { JourneyPill } from "@/components/JourneyPill";
import { Scene } from "@/components/Scene";
import { currentScene } from "@/lib/scene";
import { trackStreakSnapshot } from "@/lib/analytics";
import {
  computeJournalStreak,
  computeStreak,
  countJournaledDays,
  fetchAllEntries,
  HistoryEntry,
} from "@/lib/history";
import { GRAPE_UNLOCK_STREAK, nextUnlock } from "@/lib/inventory";
import {
  useEquippedSlugs,
  useInventoryStore,
} from "@/store/useInventoryStore";
import { supabase } from "@/lib/supabase";
import { useAuthStore } from "@/store/useAuthStore";

const GREETINGS = [
  "Hi",
  "Hello",
  "Hey there",
  "Hi again",
  "Welcome back",
  "Good to see you",
];

function pickGreeting(): string {
  return GREETINGS[Math.floor(Math.random() * GREETINGS.length)];
}

/**
 * Returns a one-time message bubble for the grape on the home page.
 *
 * Tied to journal streak milestones. Day 2 is the grape's debut — first time
 * the user has ever seen it on the home page, so it introduces itself.
 * Day 5 is the hat unlock — points the user to the backpack.
 */
function specialGrapeMessage(streak: number): string | undefined {
  if (streak === 2) return "hi! i'm crystal.";
  if (streak === 3) return "three days. nice.";
  if (streak === 5) return "a hat! check your backpack.";
  if (streak === 7) return "a whole week!";
  if (streak === 14) return "two weeks in.";
  if (streak === 30) return "a month. wow.";
  if (streak === 100) return "100 days.";
  return undefined;
}

/**
 * Home screen.
 *
 * Grape sits ABOVE the title, centered. First-time users see the crystal
 * wordmark; returning users see the personalized greeting.
 *
 * Top corners hold navigation (history left, account right).
 */
export default function Home() {
  const router = useRouter();
  const user = useAuthStore((s) => s.user);
  const authInitialized = useAuthStore((s) => s.initialized);

  const [entries, setEntries] = useState<HistoryEntry[] | null>(null);
  const [displayName, setDisplayName] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  const greeting = useMemo(() => pickGreeting(), []);
  const scene = currentScene();

  // Inventory: hydrate on load, reconcile when streak changes (so a new hat
  // appears the moment the user crosses day 5).
  const hydrateInventory = useInventoryStore((s) => s.hydrate);
  const reconcileInventory = useInventoryStore((s) => s.reconcile);
  const inventoryById = useInventoryStore((s) => s.byId);
  const equippedSlugs = useEquippedSlugs();
  const hasOwnedItems = Object.keys(inventoryById).length > 0;

  useEffect(() => {
    if (!authInitialized) return;
    if (!user) {
      setLoading(false);
      return;
    }
    let cancelled = false;
    (async () => {
      const [all, profileRes] = await Promise.all([
        fetchAllEntries(user.id),
        supabase
          .from("profiles")
          .select("display_name")
          .eq("id", user.id)
          .single(),
      ]);
      if (!cancelled) {
        setEntries(all);
        setDisplayName(profileRes.data?.display_name ?? null);
        setLoading(false);
      }
    })();
    return () => {
      cancelled = true;
    };
  }, [authInitialized, user]);

  // D-001 resolved: lenient streak. Home shows "N days in a row" based on any
  // day with a completed check-in, so history and streak count don't diverge
  // confusingly. The stricter journal-content streak is still available and
  // is what powers the north star measurement (see lib/analytics.ts) — we just
  // don't punish the user's motivation number by requiring depth.
  const streak = entries ? computeStreak(entries) : 0;
  const journalStreak = entries ? computeJournalStreak(entries) : 0;
  // All-time progress totals — one daily_checkin per day, so entries.length is
  // the number of days checked in. Journaled days is a subset.
  const totalCheckins = entries?.length ?? 0;
  const totalJournaled = entries ? countJournaledDays(entries) : 0;
  const isReturning = (entries?.length ?? 0) > 0;
  // Grape appears only once the user reaches the first streak milestone
  // (day 2). Before that the home is just the title + CTA. If the streak
  // later breaks, the grape disappears — they have to re-earn it.
  const grapeUnlocked = streak >= GRAPE_UNLOCK_STREAK;
  const upcoming = nextUnlock(streak);

  // Hydrate inventory once we know who the user is.
  useEffect(() => {
    if (user) void hydrateInventory(user.id);
  }, [user, hydrateInventory]);

  // Reconcile rewards whenever the streak changes — drops new items into
  // the backpack the moment the user crosses a threshold.
  useEffect(() => {
    if (user && entries) void reconcileInventory(user.id, streak);
  }, [user, entries, streak, reconcileInventory]);

  // Fire an analytics snapshot every time entries load. Both streak flavors
  // included so the PostHog dashboard can compute either cohort. See
  // docs/pm_portfolio/README.md for how the north star is derived from this.
  useEffect(() => {
    if (entries) {
      trackStreakSnapshot({
        checkin_streak: streak,
        journal_streak: journalStreak,
        is_returning: entries.length > 0,
      });
    }
  }, [entries, streak, journalStreak]);
  const todaysEntry = entries?.[0];
  const isTodaysEntry = (() => {
    if (!todaysEntry) return false;
    const d = new Date(todaysEntry.occurred_at);
    const today = new Date();
    return (
      d.getFullYear() === today.getFullYear() &&
      d.getMonth() === today.getMonth() &&
      d.getDate() === today.getDate()
    );
  })();
  const hasCheckinToday = isTodaysEntry;
  const hasJournaledToday = hasCheckinToday && !!todaysEntry?.journal;
  const todaysMode = todaysEntry?.capture_mode ?? null;
  const isAnonymous = !user?.email;

  // Home CTA state machine (v2.0 — Quick Capture is default; Deep is opt-in).
  // Ordered by likelihood the user is choosing this action right now.
  let primaryLabel: string;
  let primaryOnPress: () => void;
  let secondaryLabel: string | null;
  let secondaryOnPress: (() => void) | null;

  if (!hasCheckinToday) {
    // No entry today — offer the fast path first.
    primaryLabel = "quick check-in";
    primaryOnPress = () => router.push("/quick-capture");
    secondaryLabel = "take a deeper reflection";
    secondaryOnPress = () => router.push("/welcome");
  } else if (todaysMode === "quick") {
    // They did the fast path — nudge (softly) toward depth if they want.
    primaryLabel = "add a deeper reflection";
    primaryOnPress = () => router.push("/welcome");
    secondaryLabel = "edit quick check-in";
    secondaryOnPress = () => router.push("/quick-capture");
  } else if (hasJournaledToday) {
    primaryLabel = "Edit today's journal";
    primaryOnPress = () => router.push("/journal");
    secondaryLabel = "Change today's emotions";
    secondaryOnPress = () => router.push("/welcome");
  } else {
    // Deep check-in done, journal not written
    primaryLabel = "Continue today's journal";
    primaryOnPress = () => router.push("/journal");
    secondaryLabel = "Change today's emotions";
    secondaryOnPress = () => router.push("/welcome");
  }

  const avatarLetter =
    displayName?.trim()[0]?.toUpperCase() ??
    user?.email?.trim()[0]?.toUpperCase() ??
    "?";

  return (
    <Scene>
      {/* ── Top corners ── */}
      <View className="absolute left-0 right-0 top-0 z-10 flex-row justify-between px-5 pt-3">
        <View className="flex-row gap-2">
          {hasJournaledToday && (
            <FadeIn delay={600} duration={500}>
              <CornerButton
                label="View history"
                glyph="⌚"
                onPress={() => router.push("/history")}
              />
            </FadeIn>
          )}
          {/* Backpack — only appears once the user has earned at least one
              item (currently the hat at day 5). Empty backpack stays hidden
              so the home doesn't pre-tease an empty surface. */}
          {hasOwnedItems && (
            <FadeIn delay={700} duration={500}>
              <CornerButton
                label="Open backpack"
                glyph="🎒"
                onPress={() => router.push("/backpack")}
              />
            </FadeIn>
          )}
        </View>

        <FadeIn delay={500} duration={500}>
          <Pressable
            accessibilityRole="button"
            accessibilityLabel={isAnonymous ? "Sign in" : "Account"}
            onPress={() => router.push("/sign-in")}
            className="h-11 w-11 items-center justify-center rounded-full transition-all duration-300 hover:scale-110"
            style={{
              backgroundColor: isAnonymous ? "#FFF6E3" : "#E97451",
              borderWidth: 2,
              borderColor: isAnonymous ? "#C3C7CB" : "#B9502E",
            }}
          >
            <Text
              className="font-display text-sm font-semibold"
              style={{ color: isAnonymous ? "#6B5B44" : "#FFFFFF" }}
            >
              {isAnonymous ? "?" : avatarLetter}
            </Text>
          </Pressable>
        </FadeIn>
      </View>

      {/* ── Center column ── */}
      <View className="flex-1 items-center justify-center px-6">
        {loading ? (
          <ActivityIndicator color="#E97451" />
        ) : (
          <>
            {/* Grape above the title, centered. Only appears once the user
                has built a 2-day journal streak — before that the home is
                grape-less to make the day-2 reveal feel earned.
                The grape ALWAYS shows its pleasant default face here
                regardless of today's emotion. Emotion-mirroring lives inside
                the flow (Welcome → Check-in → Wheel) and on Done/Journal. */}
            {grapeUnlocked && (
              <FadeIn delay={0} duration={900}>
                <View className="mb-6">
                  <GrapeCompanion
                    size={isReturning ? 82 : 104}
                    message={specialGrapeMessage(streak)}
                    equipped={equippedSlugs}
                  />
                </View>
              </FadeIn>
            )}

            {/* Title: crystal for first-time, greeting for returning */}
            {!isReturning ? (
              <>
                <FadeIn delay={350} duration={900}>
                  <Text
                    className="mb-4 font-display text-6xl font-extrabold tracking-tight"
                    style={{ color: scene.ink }}
                  >
                    crystal
                  </Text>
                </FadeIn>
                <FadeIn delay={650} duration={900}>
                  <Text
                    className="mb-16 max-w-xs text-center font-body text-base font-semibold leading-relaxed"
                    style={{ color: scene.subInk }}
                  >
                    A cozy daily check-in — see where today finds you.
                  </Text>
                </FadeIn>
              </>
            ) : (
              <>
                <FadeIn delay={200} duration={650}>
                  <View className="mb-4">
                    <JourneyPill />
                  </View>
                </FadeIn>
                <FadeIn delay={300} duration={650}>
                  <Text
                    className="mb-3 text-center font-display text-4xl font-extrabold tracking-tight"
                    style={{ color: scene.ink }}
                  >
                    {greeting}
                    {displayName ? `, ${displayName}` : ""}.
                  </Text>
                </FadeIn>
                {streak > 0 ? (
                  <>
                    <FadeIn delay={500} duration={650}>
                      <Text
                        className="mb-1 font-body text-sm font-semibold"
                        style={{ color: scene.subInk }}
                      >
                        <Text
                          className="font-display font-extrabold"
                          style={{ color: scene.ink }}
                        >
                          {streak}
                        </Text>{" "}
                        {streak === 1 ? "day" : "days"} in a row
                        {/* Foreshadow the next unlock when one exists */}
                        {upcoming && (
                          <Text style={{ color: scene.subInk }}>
                            {" · "}
                            {upcoming.name.toLowerCase()} at day {upcoming.unlockStreak}
                          </Text>
                        )}
                      </Text>
                    </FadeIn>
                    <FadeIn delay={620} duration={650}>
                      <Text
                        className="mb-12 font-body text-xs font-semibold"
                        style={{ color: scene.subInk }}
                      >
                        {totalCheckins} {totalCheckins === 1 ? "check-in" : "check-ins"} ·{" "}
                        {totalJournaled} journaled
                      </Text>
                    </FadeIn>
                  </>
                ) : (
                  <FadeIn delay={500} duration={650}>
                    <View className="mb-12 items-center">
                      <Text
                        className="font-body text-sm font-semibold"
                        style={{ color: scene.ink }}
                      >
                        welcome back.
                      </Text>
                      <Text
                        className="mt-1 font-body text-xs font-semibold"
                        style={{ color: scene.subInk }}
                      >
                        {totalCheckins} {totalCheckins === 1 ? "check-in" : "check-ins"} ·{" "}
                        {totalJournaled} journaled · new streak starts today
                      </Text>
                    </View>
                  </FadeIn>
                )}
              </>
            )}

            {/* Primary CTA */}
            <FadeIn delay={isReturning ? 700 : 1000} duration={500}>
              <ChunkyButton
                label={primaryLabel}
                onPress={primaryOnPress}
                variant="primary"
              />
            </FadeIn>

            {/* Secondary — driven by the CTA state machine above.
                Always present in v2.0: it either offers depth (from Quick)
                or offers editing (from Deep) or offers the deeper flow
                (from a fresh visit). See PRD v2.0 §4 dual-mode. */}
            {secondaryLabel && secondaryOnPress && (
              <FadeIn delay={850} duration={500}>
                <Pressable
                  accessibilityRole="button"
                  className="mt-5 px-4 py-2 transition-all duration-300 hover:opacity-70"
                  onPress={secondaryOnPress}
                >
                  <Text
                    className="font-body text-sm font-bold underline"
                    style={{ color: scene.subInk }}
                  >
                    {secondaryLabel}
                  </Text>
                </Pressable>
              </FadeIn>
            )}
          </>
        )}
      </View>
    </Scene>
  );
}

/** Soft parchment corner chip, readable on any sky. */
function CornerButton({
  label,
  glyph,
  onPress,
}: {
  label: string;
  glyph: string;
  onPress: () => void;
}) {
  return (
    <Pressable
      accessibilityRole="button"
      accessibilityLabel={label}
      onPress={onPress}
      className="h-11 w-11 items-center justify-center rounded-full transition-all duration-300 hover:scale-110"
      style={{
        backgroundColor: "#FFF6E3",
        borderWidth: 2,
        borderColor: "#C3C7CB",
      }}
    >
      <Text className="text-xl">{glyph}</Text>
    </Pressable>
  );
}
