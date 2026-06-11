import { Redirect, useRouter } from "expo-router";
import { Pressable, ScrollView, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

import { FadeIn } from "@/components/FadeIn";
import { findPrimary, findSecondary } from "@/lib/emotions";
import { useReflectionStore } from "@/store/useReflectionStore";

/**
 * Phase 5.2c — Pick the specific (tertiary) emotion.
 */
export default function PickSpecific() {
  const router = useRouter();
  const draft = useReflectionStore((s) => s.draft);
  const setEmotionSpecific = useReflectionStore((s) => s.setEmotionSpecific);

  const primary = findPrimary(draft.emotion_primary);
  const secondary = findSecondary(draft.emotion_primary, draft.emotion_secondary);

  if (!primary) return <Redirect href="/emotion/primary" />;
  if (!secondary) return <Redirect href="/emotion/secondary" />;

  const pick = (slug: string) => {
    setEmotionSpecific(slug);
    router.push("/emotion/intensity");
  };

  return (
    <SafeAreaView className="flex-1 bg-cream dark:bg-cream-dark" edges={["top", "bottom"]}>
      <ScrollView
        className="flex-1"
        contentContainerStyle={{
          paddingHorizontal: 24,
          paddingTop: 32,
          paddingBottom: 56,
        }}
      >
        <FadeIn delay={0}>
          <View className="mb-3 flex-row items-center">
            <View
              className="mr-2 h-3 w-3 rounded-full"
              style={{ backgroundColor: primary.color }}
            />
            <Text className="text-xs font-semibold uppercase tracking-widest text-muted dark:text-muted-dark">
              {primary.name} · {secondary.name}
            </Text>
          </View>
        </FadeIn>

        <FadeIn delay={80}>
          <Text className="mb-3 text-3xl font-semibold tracking-tight text-ink dark:text-ink-dark">
            Closer to…
          </Text>
        </FadeIn>

        <FadeIn delay={160}>
          <Text className="mb-10 text-base leading-relaxed text-muted dark:text-muted-dark">
            The word that fits best. There's no wrong answer.
          </Text>
        </FadeIn>

        {secondary.tertiaries.map((t, i) => {
          const selected = t.slug === draft.emotion_specific;
          return (
            <FadeIn key={t.slug} delay={260 + i * 90}>
              <Pressable
                accessibilityRole="button"
                accessibilityLabel={t.name}
                accessibilityState={{ selected }}
                onPress={() => pick(t.slug)}
                className="mb-4 h-24 items-center justify-center rounded-tile transition-all duration-300 hover:scale-[1.08] hover:shadow-2xl active:scale-[0.98] active:opacity-70"
                style={{
                  backgroundColor: primary.color + (selected ? "55" : "26"),
                  borderWidth: selected ? 2 : 0,
                  borderColor: primary.color,
                  shadowColor: primary.color,
                  shadowOpacity: 0.12,
                  shadowRadius: 12,
                  shadowOffset: { width: 0, height: 4 },
                }}
              >
                <Text className="text-xl font-medium capitalize text-ink dark:text-ink-dark">
                  {t.name}
                </Text>
              </Pressable>
            </FadeIn>
          );
        })}
      </ScrollView>
    </SafeAreaView>
  );
}
