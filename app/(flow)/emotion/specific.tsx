import { Redirect, useRouter } from "expo-router";
import { Pressable, ScrollView, Text, View } from "react-native";

import { FadeIn } from "@/components/FadeIn";
import { Scene } from "@/components/Scene";
import { shadeHex } from "@/lib/color";
import { findPrimary, findSecondary } from "@/lib/emotions";
import { currentScene } from "@/lib/scene";
import { useReflectionStore } from "@/store/useReflectionStore";

/**
 * Phase 5.2c — Pick the specific (tertiary) emotion.
 */
export default function PickSpecific() {
  const router = useRouter();
  const draft = useReflectionStore((s) => s.draft);
  const setEmotionSpecific = useReflectionStore((s) => s.setEmotionSpecific);
  const scene = currentScene();

  const primary = findPrimary(draft.emotion_primary);
  const secondary = findSecondary(draft.emotion_primary, draft.emotion_secondary);

  if (!primary) return <Redirect href="/emotion/primary" />;
  if (!secondary) return <Redirect href="/emotion/secondary" />;

  const pick = (slug: string) => {
    setEmotionSpecific(slug);
    router.push("/emotion/intensity");
  };

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
              {primary.name} · {secondary.name}
            </Text>
          </View>
        </FadeIn>

        <FadeIn delay={80}>
          <Text
            className="mb-3 font-display text-4xl font-extrabold tracking-tight"
            style={{ color: scene.ink }}
          >
            Closer to…
          </Text>
        </FadeIn>

        <FadeIn delay={160}>
          <Text
            className="mb-10 font-body text-base font-semibold leading-relaxed"
            style={{ color: scene.subInk }}
          >
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
                className="mb-4 h-24 items-center justify-center rounded-tile transition-all duration-300 hover:scale-[1.03] active:scale-[0.98]"
                style={{
                  backgroundColor: primary.color + (selected ? "FF" : "D0"),
                  borderWidth: 2,
                  borderColor: primary.color,
                  borderBottomWidth: selected ? 4 : 6,
                  borderBottomColor: shadeHex(primary.color),
                }}
              >
                <Text className="font-display text-xl font-extrabold capitalize text-white">
                  {t.name}
                </Text>
              </Pressable>
            </FadeIn>
          );
        })}
      </ScrollView>
    </Scene>
  );
}
