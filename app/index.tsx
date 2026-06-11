import { useRouter } from "expo-router";
import { useEffect, useMemo, useState } from "react";
import { ActivityIndicator, Pressable, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

import { FadeIn } from "@/components/FadeIn";
import { GrapeCompanion } from "@/components/GrapeCompanion";
import {
  computeStreak,
  fetchAllEntries,
  HistoryEntry,
} from "@/lib/history";
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
 * Decides whether the grape should "speak" today. Most days it stays quiet.
 * Returns a string only on milestones; otherwise undefined → grape just sits.
 */
function specialGrapeMessage(
  streak: number,
  isReturning: boolean,
  hasCheckinToday: boolean
): string | undefined {
  // First-time visit, just landed on the app
  if (!isReturning) return "hi!";
  // Milestone streaks (today's reflection done)
  if (hasCheckinToday) {
    if (streak === 3) return "three days. nice.";
    if (streak === 7) return "a whole week!";
    if (streak === 14) return "two weeks in.";
    if (streak === 30) return "a month. wow.";
    if (streak === 100) return "100 days.";
  }
  return undefined;
}

/**
 * Home screen — minimal, focused.
 *
 * Layout:
 *   ┌──────────────────────────────────────────┐
 *   │  [⌚ history]              [👤 account]  │
 *   │                                          │
 *   │            Greeting                      │
 *   │            N days in a row               │
 *   │                                          │
 *   │            [Primary CTA]                 │
 *   │            change today's emotions       │
 *   │                                          │
 *   │                                  🍇     │
 *   └──────────────────────────────────────────┘
 *
 * Corner icons handle navigation (history + account) so the center stays
 * focused on the primary action. The grape companion sits in the bottom-right
 * corner and mirrors today's emotion (color + face).
 */
export default function Home() {
  const router = useRouter();
  const user = useAuthStore((s) => s.user);
  const authInitialized = useAuthStore((s) => s.initialized);

  const [entries, setEntries] = useState<HistoryEntry[] | null>(null);
  const [displayName, setDisplayName] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  const greeting = useMemo(() => pickGreeting(), []);

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

  const streak = entries ? computeStreak(entries) : 0;
  const isReturning = (entries?.length ?? 0) > 0;
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
  const isAnonymous = !user?.email;

  const primaryLabel = !hasCheckinToday
    ? "Begin reflection"
    : hasJournaledToday
      ? "Edit today's journal"
      : "Continue today's journal";

  const primaryOnPress = !hasCheckinToday
    ? () => router.push("/welcome")
    : () => router.push("/journal");

  // Avatar initial (first letter of name) or generic
  const avatarLetter =
    displayName?.trim()[0]?.toUpperCase() ??
    user?.email?.trim()[0]?.toUpperCase() ??
    "?";

  return (
    <SafeAreaView className="flex-1 bg-cream">
      {/* ── Top corners: history (left) + account (right) ── */}
      <View className="absolute left-0 right-0 top-0 z-10 flex-row justify-between px-5 pt-3">
        {/* History — only visible once today's journal is done */}
        <View className="w-10">
          {hasJournaledToday && (
            <FadeIn delay={600} duration={500}>
              <Pressable
                accessibilityRole="button"
                accessibilityLabel="View history"
                onPress={() => router.push("/history")}
                className="h-10 w-10 items-center justify-center rounded-full transition-all duration-300 hover:bg-ink/5"
              >
                <Text className="text-xl">⌚</Text>
              </Pressable>
            </FadeIn>
          )}
        </View>

        {/* Account — always visible */}
        <FadeIn delay={500} duration={500}>
          <Pressable
            accessibilityRole="button"
            accessibilityLabel={isAnonymous ? "Sign in" : "Account"}
            onPress={() => router.push("/sign-in")}
            className="h-10 w-10 items-center justify-center rounded-full transition-all duration-300 hover:scale-110"
            style={{
              backgroundColor: isAnonymous ? "#E8E0D3" : "#C2876B",
            }}
          >
            <Text
              className={`text-sm font-semibold ${
                isAnonymous ? "text-muted" : "text-white"
              }`}
            >
              {isAnonymous ? "?" : avatarLetter}
            </Text>
          </Pressable>
        </FadeIn>
      </View>

      {/* ── Center column ── */}
      <View className="flex-1 items-center justify-center px-6">
        {!loading && !isReturning && (
          <>
            <FadeIn delay={0} duration={900}>
              <Text className="mb-4 text-5xl font-semibold tracking-tight text-ink">
                krystal
              </Text>
            </FadeIn>
            <FadeIn delay={500} duration={900}>
              <Text className="mb-16 max-w-xs text-center text-base leading-relaxed text-muted">
                A daily practice for emotional clarity.
              </Text>
            </FadeIn>
          </>
        )}

        {!loading && isReturning && (
          <>
            {/* Grape sits to the left of the greeting */}
            <FadeIn delay={0} duration={650}>
              <View className="mb-3 flex-row items-center">
                <View className="mr-4">
                  <GrapeCompanion
                    emotionPrimary={todaysEntry?.emotion?.primary_name?.toLowerCase()}
                    size={68}
                    message={specialGrapeMessage(streak, isReturning, hasCheckinToday)}
                  />
                </View>
                <Text className="text-3xl font-semibold tracking-tight text-ink">
                  {greeting}
                  {displayName ? `, ${displayName}` : ""}.
                </Text>
              </View>
            </FadeIn>
            {streak > 0 && (
              <FadeIn delay={250} duration={650}>
                <Text className="mb-12 text-sm text-muted">
                  <Text className="font-semibold text-ink">{streak}</Text>{" "}
                  {streak === 1 ? "day" : "days"} in a row
                </Text>
              </FadeIn>
            )}
            {streak === 0 && <View className="mb-12" />}
          </>
        )}

        {loading ? (
          <ActivityIndicator color="#C2876B" />
        ) : (
          <>
            <FadeIn delay={isReturning ? 450 : 850} duration={500}>
              <Pressable
                accessibilityRole="button"
                className="rounded-full bg-accent px-10 py-5 shadow-sm transition-all duration-300 hover:scale-[1.15] hover:shadow-2xl active:opacity-70"
                onPress={primaryOnPress}
              >
                <Text className="text-base font-medium tracking-wide text-white">
                  {primaryLabel}
                </Text>
              </Pressable>
            </FadeIn>

            {hasCheckinToday && (
              <FadeIn delay={700} duration={500}>
                <Pressable
                  accessibilityRole="button"
                  className="mt-5 px-4 py-2 transition-all duration-300 hover:opacity-70"
                  onPress={() => router.push("/welcome")}
                >
                  <Text className="text-sm text-muted underline">
                    Change today's emotions
                  </Text>
                </Pressable>
              </FadeIn>
            )}
          </>
        )}
      </View>

      {/* For first-time visitors (no entries yet), show grape under the
          krystal wordmark as a small introduction. */}
      {!loading && !isReturning && (
        <View className="absolute" style={{ bottom: "20%", left: "10%" }}>
          <FadeIn delay={1100} duration={900}>
            <GrapeCompanion
              size={68}
              message={specialGrapeMessage(streak, isReturning, hasCheckinToday)}
            />
          </FadeIn>
        </View>
      )}
    </SafeAreaView>
  );
}
