import { useRouter } from "expo-router";
import { useEffect, useState } from "react";
import { ActivityIndicator, Pressable, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

import { FadeIn } from "@/components/FadeIn";
import {
  computeStreak,
  fetchAllEntries,
  HistoryEntry,
} from "@/lib/history";
import { useAuthStore } from "@/store/useAuthStore";

/**
 * Home screen.
 *
 * Shows today's status + streak count + sign-in/upgrade affordance.
 *
 * - No check-in today → "Begin reflection"
 * - Check-in done → "Edit today's journal" (primary) + "Change today's emotions"
 * - Journal done → also adds "View history" link
 * - Anonymous account → "Save your reflections" link
 * - Signed-in account → email shown subtly
 */
export default function Home() {
  const router = useRouter();
  const user = useAuthStore((s) => s.user);
  const authInitialized = useAuthStore((s) => s.initialized);

  const [entries, setEntries] = useState<HistoryEntry[] | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!authInitialized) return;
    if (!user) {
      setLoading(false);
      return;
    }
    let cancelled = false;
    (async () => {
      const all = await fetchAllEntries(user.id);
      if (!cancelled) {
        setEntries(all);
        setLoading(false);
      }
    })();
    return () => {
      cancelled = true;
    };
  }, [authInitialized, user]);

  const streak = entries ? computeStreak(entries) : 0;
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

  return (
    <SafeAreaView className="flex-1 bg-cream">
      <View className="flex-1 items-center justify-center px-6">
        <FadeIn delay={0} duration={650}>
          <Text className="mb-4 text-5xl font-semibold tracking-tight text-ink">
            krystal
          </Text>
        </FadeIn>

        <FadeIn delay={250} duration={650}>
          <Text className="mb-6 max-w-xs text-center text-base leading-relaxed text-muted">
            A daily practice for emotional clarity.
          </Text>
        </FadeIn>

        {/* Streak — gentle, no pressure framing */}
        {streak > 0 && (
          <FadeIn delay={400} duration={650}>
            <Text className="mb-10 text-sm text-muted">
              <Text className="font-semibold text-ink">{streak}</Text>{" "}
              {streak === 1 ? "day" : "days"} in a row
            </Text>
          </FadeIn>
        )}

        {streak === 0 && (
          // Keep the spacing consistent
          <View className="mb-10" />
        )}

        {loading ? (
          <ActivityIndicator color="#C2876B" />
        ) : (
          <>
            <FadeIn delay={550} duration={500}>
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

            {hasCheckinToday && todaysEntry?.emotion && (
              <FadeIn delay={680} duration={500}>
                <View className="mt-6 flex-row items-center">
                  <View
                    className="mr-2 h-2 w-2 rounded-full"
                    style={{
                      backgroundColor: todaysEntry.emotion.primary_color,
                    }}
                  />
                  <Text className="text-xs capitalize text-muted">
                    Today:{" "}
                    <Text className="font-semibold text-ink">
                      {todaysEntry.emotion.specific_name}
                    </Text>
                    {todaysEntry.plutchik_emotion && (
                      <>
                        {" · "}
                        <Text className="font-semibold text-ink">
                          {todaysEntry.plutchik_emotion}
                        </Text>
                      </>
                    )}
                  </Text>
                </View>
              </FadeIn>
            )}

            {hasCheckinToday && (
              <FadeIn delay={760} duration={500}>
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

            {hasJournaledToday && (
              <FadeIn delay={830} duration={500}>
                <Pressable
                  accessibilityRole="button"
                  className="mt-2 px-4 py-2 transition-all duration-300 hover:opacity-70"
                  onPress={() => router.push("/history")}
                >
                  <Text className="text-sm text-muted underline">
                    View history
                  </Text>
                </Pressable>
              </FadeIn>
            )}

            {/* Sign-in / account status — bottom of screen, subtle */}
            <View className="mt-10">
              {isAnonymous ? (
                <FadeIn delay={900} duration={500}>
                  <Pressable
                    accessibilityRole="button"
                    className="px-4 py-2 transition-all duration-300 hover:opacity-70"
                    onPress={() => router.push("/sign-in")}
                  >
                    <Text className="text-xs text-muted underline">
                      Save your reflections across devices
                    </Text>
                  </Pressable>
                </FadeIn>
              ) : (
                <FadeIn delay={900} duration={500}>
                  <Text className="text-xs text-muted">
                    Signed in as{" "}
                    <Text className="text-ink">{user?.email}</Text>
                  </Text>
                </FadeIn>
              )}
            </View>
          </>
        )}
      </View>
    </SafeAreaView>
  );
}
