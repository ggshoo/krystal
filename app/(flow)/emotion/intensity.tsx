import { Redirect, useRouter } from "expo-router";
import { Pressable, ScrollView, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

import { FadeIn } from "@/components/FadeIn";
import { findPrimary, findSecondary, findTertiary } from "@/lib/emotions";
import { getPlutchikLadder, plutchikLevels } from "@/lib/plutchik";
import { useReflectionStore } from "@/store/useReflectionStore";

/**
 * Plutchik intensity picker. Shown after the user picks a Roberts tertiary.
 *
 * Roberts category + secondary determine which Plutchik ladder is shown
 * (see lib/plutchik.ts for the full mapping). User picks one of 3 intensity
 * levels (most → least intense, top to bottom).
 */
export default function PickIntensity() {
  const router = useRouter();
  const draft = useReflectionStore((s) => s.draft);
  const setField = useReflectionStore((s) => s.setField);

  const primary = findPrimary(draft.emotion_primary);
  const secondary = findSecondary(draft.emotion_primary, draft.emotion_secondary);
  const tertiary = findTertiary(
    draft.emotion_primary,
    draft.emotion_secondary,
    draft.emotion_specific
  );

  if (!primary) return <Redirect href="/emotion/primary" />;
  if (!secondary) return <Redirect href="/emotion/secondary" />;
  if (!tertiary) return <Redirect href="/emotion/specific" />;

  const ladder = getPlutchikLadder(primary.slug, secondary.slug);
  const levels = plutchikLevels(ladder);

  const pick = (slug: string) => {
    setField("plutchik_emotion", slug);
    router.push("/done");
  };

  const intensityLabel = (level: "high" | "mid" | "low") =>
    level === "high"
      ? "Most intense"
      : level === "low"
        ? "Least intense"
        : "In between";

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
              {primary.name} · {secondary.name} · {tertiary.name}
            </Text>
          </View>
        </FadeIn>

        <FadeIn delay={80}>
          <Text className="mb-3 text-3xl font-semibold tracking-tight text-ink">
            How intense?
          </Text>
        </FadeIn>

        <FadeIn delay={160}>
          <Text className="mb-8 text-base leading-relaxed text-muted">
            From the {ladder.primary} family, which feels closest? Listed from
            most to least intense.
          </Text>
        </FadeIn>

        {levels.map((l, i) => {
          const selected = l.slug === draft.plutchik_emotion;
          return (
            <FadeIn key={l.slug} delay={240 + i * 90}>
              <Pressable
                accessibilityRole="button"
                accessibilityLabel={`${l.name}, ${intensityLabel(l.level)}`}
                accessibilityState={{ selected }}
                onPress={() => pick(l.slug)}
                className="mb-4 h-28 items-center justify-center rounded-tile transition-all duration-300 hover:scale-[1.08] hover:shadow-2xl active:scale-[0.98] active:opacity-70"
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
                <Text className="text-2xl font-medium capitalize text-ink">
                  {l.name}
                </Text>
                <Text className="mt-1 text-xs uppercase tracking-widest text-muted">
                  {intensityLabel(l.level)}
                </Text>
              </Pressable>
            </FadeIn>
          );
        })}
      </ScrollView>
    </SafeAreaView>
  );
}
