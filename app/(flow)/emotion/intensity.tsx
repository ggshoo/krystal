import { Redirect, useRouter } from "expo-router";
import { Pressable, ScrollView, Text, View } from "react-native";

import { FadeIn } from "@/components/FadeIn";
import { Scene } from "@/components/Scene";
import { shadeHex } from "@/lib/color";
import { findPrimary, findSecondary, findTertiary } from "@/lib/emotions";
import { getPlutchikLadder, plutchikLevels } from "@/lib/plutchik";
import { currentScene } from "@/lib/scene";
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
  const scene = currentScene();

  const primary = findPrimary(draft.emotion_primary);
  const secondary = findSecondary(draft.emotion_primary, draft.emotion_secondary);
  const tertiary = findTertiary(
    draft.emotion_primary,
    draft.emotion_secondary,
    draft.emotion_specific
  );

  if (!primary) return <Redirect href="/emotion/primary" />;
  if (!secondary) return <Redirect href="/emotion/primary" />;
  if (!tertiary) return <Redirect href="/emotion/primary" />;

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
    <Scene edges={["top", "bottom"]}>
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
            <Text
              className="font-display text-xs font-bold uppercase tracking-widest"
              style={{ color: scene.subInk }}
            >
              {primary.name} · {secondary.name} · {tertiary.name}
            </Text>
          </View>
        </FadeIn>

        <FadeIn delay={80}>
          <Text
            className="mb-3 font-display text-4xl font-extrabold tracking-tight"
            style={{ color: scene.ink }}
          >
            How intense?
          </Text>
        </FadeIn>

        <FadeIn delay={160}>
          <Text
            className="mb-8 font-body text-base font-semibold leading-relaxed"
            style={{ color: scene.subInk }}
          >
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
                className="mb-4 h-28 items-center justify-center rounded-tile transition-all duration-300 hover:scale-[1.03] active:scale-[0.98]"
                style={{
                  backgroundColor: primary.color + (selected ? "FF" : "D0"),
                  borderWidth: 2,
                  borderColor: primary.color,
                  borderBottomWidth: selected ? 4 : 6,
                  borderBottomColor: shadeHex(primary.color),
                }}
              >
                <Text className="font-display text-2xl font-extrabold capitalize text-white">
                  {l.name}
                </Text>
                <Text className="mt-1 font-body text-xs font-bold uppercase tracking-widest text-white/85">
                  {intensityLabel(l.level)}
                </Text>
              </Pressable>
            </FadeIn>
          );
        })}
      </ScrollView>
    </Scene>
  );
}
