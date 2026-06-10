import { useRouter } from "expo-router";
import { useEffect, useState } from "react";
import { ActivityIndicator, Pressable, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

import { FadeIn } from "@/components/FadeIn";
import { fetchTodaysEntry, HistoryEntry } from "@/lib/history";
import { useAuthStore } from "@/store/useAuthStore";

/**
 * Home screen.
 *
 * Three states based on what's been done today:
 *
 * - No daily_checkin yet → "Begin reflection"
 * - daily_checkin exists, no journal_entries → "Continue today's journal"
 * - Both exist → "Edit today's journal" + "View history" link
 *
 * Once the check-in is saved, the wheel/intensity picker can NOT be re-done
 * today. The user's only post-check-in entry point is the journal, which
 * remains editable. This enforces "one reflection per day".
 */
export default function Home() {
  const router = useRouter();
  const user = useAuthStore((s) => s.user);
  const authInitialized = useAuthStore((s) => s.initialized);

  const [todaysEntry, setTodaysEntry] = useState<HistoryEntry | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!authInitialized) return;
    if (!user) {
      setLoading(false);
      return;
    }
    let cancelled = false;
    (async () => {
      const entry = await fetchTodaysEntry(user.id);
      if (!cancelled) {
        setTodaysEntry(entry);
        setLoading(false);
      }
    })();
    return () => {
      cancelled = true;
    };
  }, [authInitialized, user]);

  const hasCheckinToday = !!todaysEntry;
  const hasJournaledToday = !!todaysEntry?.journal;

  const primaryButtonLabel = !hasCheckinToday
    ? "Begin reflection"
    : hasJournaledToday
      ? "Edit today's journal"
      : "Continue today's journal";

  const primaryButtonOnPress = !hasCheckinToday
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
          <Text className="mb-16 max-w-xs text-center text-base leading-relaxed text-muted">
            A daily practice for emotional clarity.
          </Text>
        </FadeIn>

        {loading ? (
          <ActivityIndicator color="#C2876B" />
        ) : (
          <>
            <FadeIn delay={550} duration={500}>
              <Pressable
                accessibilityRole="button"
                className="rounded-full bg-accent px-10 py-5 shadow-sm transition-all duration-300 hover:scale-[1.15] hover:shadow-2xl active:opacity-70"
                onPress={primaryButtonOnPress}
              >
                <Text className="text-base font-medium tracking-wide text-white">
                  {primaryButtonLabel}
                </Text>
              </Pressable>
            </FadeIn>

            {/* Gentle reminder of today's emotion path if check-in done */}
            {hasCheckinToday && todaysEntry?.emotion && (
              <FadeIn delay={700} duration={500}>
                <View className="mt-6 flex-row items-center">
                  <View
                    className="mr-2 h-2 w-2 rounded-full"
                    style={{ backgroundColor: todaysEntry.emotion.primary_color }}
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

            {/* History link — only after today's journal is done */}
            {hasJournaledToday && (
              <FadeIn delay={800} duration={500}>
                <Pressable
                  accessibilityRole="button"
                  className="mt-4 px-4 py-2 transition-all duration-300 hover:opacity-70"
                  onPress={() => router.push("/history")}
                >
                  <Text className="text-sm text-muted underline">
                    View history
                  </Text>
                </Pressable>
              </FadeIn>
            )}
          </>
        )}
      </View>
    </SafeAreaView>
  );
}
