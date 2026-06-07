import { Redirect, useRouter } from "expo-router";
import { Pressable, ScrollView, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

import { FadeIn } from "@/components/FadeIn";
import { findPrimary } from "@/lib/emotions";
import { useReflectionStore } from "@/store/useReflectionStore";

/**
 * Phase 5.2b — Pick secondary (intensity cluster).
 *
 * Tiles are rendered ordered by intensity: top = most intense, bottom = least.
 * A small intensity indicator runs alongside the list.
 */
export default function PickSecondary() {
  const router = useRouter();
  const draft = useReflectionStore((s) => s.draft);
  const setEmotionSecondary = useReflectionStore((s) => s.setEmotionSecondary);

  const primary = findPrimary(draft.emotion_primary);
  if (!primary) return <Redirect href="/emotion/primary" />;

  const pick = (slug: string) => {
    setEmotionSecondary(slug);
    router.push("/emotion/specific");
  };

  // Reverse so highest intensity sits at top
  const orderedSecondaries = [...primary.secondaries].reverse();

  return (
    <SafeAreaView className="flex-1 bg-cream" edges={["top", "bottom"]}>
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
            <Text className="text-xs font-semibold uppercase tracking-widest text-muted">
              {primary.name}
            </Text>
          </View>
        </FadeIn>

        <FadeIn delay={80}>
          <Text className="mb-3 text-3xl font-semibold tracking-tight text-ink">
            Which kind?
          </Text>
        </FadeIn>

        <FadeIn delay={160}>
          <Text className="mb-8 text-base leading-relaxed text-muted">
            Pick the one closest to right now. Listed from most to least intense.
          </Text>
        </FadeIn>

        <View className="flex-row items-stretch gap-4">
          {/* Intensity scale on the left */}
          <FadeIn delay={220}>
            <View className="items-center justify-between py-2">
              <Text className="text-[10px] font-semibold uppercase tracking-widest text-muted">
                More
              </Text>
              <View
                className="my-2 w-px flex-1"
                style={{ backgroundColor: primary.color + "55" }}
              />
              <Text className="text-[10px] font-semibold uppercase tracking-widest text-muted">
                Less
              </Text>
            </View>
          </FadeIn>

          {/* Tiles, most intense first */}
          <View className="flex-1">
            {orderedSecondaries.map((s, i) => {
              const selected = s.slug === draft.emotion_secondary;
              return (
                <FadeIn key={s.slug} delay={260 + i * 90}>
                  <Pressable
                    accessibilityRole="button"
                    accessibilityLabel={s.name}
                    accessibilityState={{ selected }}
                    onPress={() => pick(s.slug)}
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
                    <Text className="text-xl font-medium capitalize text-ink">
                      {s.name}
                    </Text>
                  </Pressable>
                </FadeIn>
              );
            })}
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
