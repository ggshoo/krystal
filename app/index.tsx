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
 * Two states based on whether today's daily reflection has been done:
 *
 * - **No entry yet today** → only "Begin reflection" is shown.
 *   History stays hidden until the user has completed today's journal.
 *
 * - **Today's entry exists** → shows "View history" link.
 *   (Edit flow comes in a later iteration.)
 */
export default function Home() {
  const router = useRouter();
  const user = useAuthStore((s) => s.user);
  const authInitialized = useAuthStore((s) => s.initialized);

  const [todaysEntry, setTodaysEntry] = useState<HistoryEntry | null>(null);
  const [loading, setLoading] = useState(true);

  // On mount (and when auth finishes), check for today's entry.
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

  const hasJournaledToday = !!todaysEntry?.journal;

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
                onPress={() => router.push("/welcome")}
              >
                <Text className="text-base font-medium tracking-wide text-white">
                  {todaysEntry ? "Reflect again" : "Begin reflection"}
                </Text>
              </Pressable>
            </FadeIn>

            {/* History link — only after today's journal is done */}
            {hasJournaledToday && (
              <FadeIn delay={700} duration={500}>
                <Pressable
                  accessibilityRole="button"
                  className="mt-6 px-4 py-2 transition-all duration-300 hover:opacity-70"
                  onPress={() => router.push("/history")}
                >
                  <Text className="text-sm text-muted underline">
                    View history
                  </Text>
                </Pressable>
              </FadeIn>
            )}

            {/* Friendly nudge if check-in exists but journal doesn't */}
            {todaysEntry && !hasJournaledToday && (
              <FadeIn delay={700} duration={500}>
                <Pressable
                  accessibilityRole="button"
                  className="mt-6 px-4 py-2 transition-all duration-300 hover:opacity-70"
                  onPress={() => router.push("/journal")}
                >
                  <Text className="text-sm text-muted underline">
                    Continue today's journal
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
