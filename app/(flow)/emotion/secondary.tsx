import { Redirect, useRouter } from "expo-router";
import { Pressable, ScrollView, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

import { findPrimary } from "@/lib/emotions";
import { useReflectionStore } from "@/store/useReflectionStore";

/**
 * Phase 5.2b — Pick secondary (intensity cluster).
 *
 * Shows the 3 secondaries of whatever primary the user chose, tinted in the
 * primary's color. Guards against direct nav without a primary set.
 */
export default function PickSecondary() {
  const router = useRouter();
  const draft = useReflectionStore((s) => s.draft);
  const setEmotionSecondary = useReflectionStore((s) => s.setEmotionSecondary);

  const primary = findPrimary(draft.emotion_primary);

  // Guard: navigated here without picking a primary
  if (!primary) {
    return <Redirect href="/emotion/primary" />;
  }

  const pick = (slug: string) => {
    setEmotionSecondary(slug);
    router.push("/emotion/specific");
  };

  return (
    <SafeAreaView className="flex-1 bg-cream" edges={["top", "bottom"]}>
      <ScrollView
        className="flex-1"
        contentContainerStyle={{
          paddingHorizontal: 24,
          paddingTop: 24,
          paddingBottom: 48,
        }}
      >
        <View className="mb-2 flex-row items-center">
          <View
            className="mr-2 h-3 w-3 rounded-full"
            style={{ backgroundColor: primary.color }}
          />
          <Text className="text-xs font-semibold uppercase tracking-widest text-muted">
            {primary.name}
          </Text>
        </View>

        <Text className="mb-2 text-2xl font-semibold text-ink">
          Which kind?
        </Text>
        <Text className="mb-8 text-base text-muted">
          Pick the one closest to right now.
        </Text>

        {primary.secondaries.map((s) => {
          const selected = s.slug === draft.emotion_secondary;
          return (
            <Pressable
              key={s.slug}
              accessibilityRole="button"
              accessibilityLabel={s.name}
              accessibilityState={{ selected }}
              onPress={() => pick(s.slug)}
              className="mb-3 h-20 items-center justify-center rounded-3xl active:opacity-70"
              style={{
                backgroundColor: primary.color + (selected ? "55" : "26"),
                borderWidth: selected ? 2 : 0,
                borderColor: primary.color,
              }}
            >
              <Text className="text-lg font-medium capitalize text-ink">
                {s.name}
              </Text>
            </Pressable>
          );
        })}
      </ScrollView>
    </SafeAreaView>
  );
}
