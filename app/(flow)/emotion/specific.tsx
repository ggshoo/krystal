import { Redirect, useRouter } from "expo-router";
import { Pressable, ScrollView, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

import { findPrimary, findSecondary } from "@/lib/emotions";
import { useReflectionStore } from "@/store/useReflectionStore";

/**
 * Phase 5.2c — Pick the specific (tertiary) emotion.
 *
 * The final picker step. Picking one navigates to /done (Phase 5.3,
 * not yet built — landing there will currently show a not-found screen).
 */
export default function PickSpecific() {
  const router = useRouter();
  const draft = useReflectionStore((s) => s.draft);
  const setEmotionSpecific = useReflectionStore((s) => s.setEmotionSpecific);

  const primary = findPrimary(draft.emotion_primary);
  const secondary = findSecondary(draft.emotion_primary, draft.emotion_secondary);

  // Guards: if upstream selections missing, send the user back to start
  if (!primary) return <Redirect href="/emotion/primary" />;
  if (!secondary) return <Redirect href="/emotion/secondary" />;

  const pick = (slug: string) => {
    setEmotionSpecific(slug);
    router.push("/done");
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
            {primary.name} · {secondary.name}
          </Text>
        </View>

        <Text className="mb-2 text-2xl font-semibold text-ink">
          Closer to…
        </Text>
        <Text className="mb-8 text-base text-muted">
          The word that fits best. There's no wrong answer.
        </Text>

        {secondary.tertiaries.map((t) => {
          const selected = t.slug === draft.emotion_specific;
          return (
            <Pressable
              key={t.slug}
              accessibilityRole="button"
              accessibilityLabel={t.name}
              accessibilityState={{ selected }}
              onPress={() => pick(t.slug)}
              className="mb-3 h-20 items-center justify-center rounded-3xl active:opacity-70"
              style={{
                backgroundColor: primary.color + (selected ? "55" : "26"),
                borderWidth: selected ? 2 : 0,
                borderColor: primary.color,
              }}
            >
              <Text className="text-lg font-medium capitalize text-ink">
                {t.name}
              </Text>
            </Pressable>
          );
        })}
      </ScrollView>
    </SafeAreaView>
  );
}
