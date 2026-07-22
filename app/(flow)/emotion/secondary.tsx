import { Redirect, useRouter } from "expo-router";
import { Pressable, ScrollView, Text, View } from "react-native";

import { FadeIn } from "@/components/FadeIn";
import { Scene } from "@/components/Scene";
import { findPrimary } from "@/lib/emotions";
import { shadeHex } from "@/lib/color";
import { currentScene } from "@/lib/scene";
import { useReflectionStore } from "@/store/useReflectionStore";

/**
 * Phase 5.2b — Pick secondary emotion.
 *
 * Geoffrey Roberts wheel has variable secondaries per primary (4–9).
 * List scrolls if the parent has many secondaries.
 */
export default function PickSecondary() {
  const router = useRouter();
  const draft = useReflectionStore((s) => s.draft);
  const setEmotionSecondary = useReflectionStore((s) => s.setEmotionSecondary);
  const scene = currentScene();

  const primary = findPrimary(draft.emotion_primary);
  if (!primary) return <Redirect href="/emotion/primary" />;

  const pick = (slug: string) => {
    setEmotionSecondary(slug);
    router.push("/emotion/specific");
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
              {primary.name}
            </Text>
          </View>
        </FadeIn>

        <FadeIn delay={80}>
          <Text
            className="mb-3 font-display text-4xl font-extrabold tracking-tight"
            style={{ color: scene.ink }}
          >
            Which kind?
          </Text>
        </FadeIn>

        <FadeIn delay={160}>
          <Text
            className="mb-8 font-body text-base font-semibold leading-relaxed"
            style={{ color: scene.subInk }}
          >
            Pick the one closest to what you're feeling.
          </Text>
        </FadeIn>

        {primary.secondaries.map((s, i) => {
          const selected = s.slug === draft.emotion_secondary;
          return (
            <FadeIn key={s.slug} delay={240 + i * 60}>
              <Pressable
                accessibilityRole="button"
                accessibilityLabel={s.name}
                accessibilityState={{ selected }}
                onPress={() => pick(s.slug)}
                className="mb-3 h-20 items-center justify-center rounded-tile transition-all duration-300 hover:scale-[1.03] active:scale-[0.98]"
                style={{
                  backgroundColor: primary.color + (selected ? "FF" : "D0"),
                  borderWidth: 2,
                  borderColor: primary.color,
                  borderBottomWidth: selected ? 4 : 6,
                  borderBottomColor: shadeHex(primary.color),
                }}
              >
                <Text className="font-display text-xl font-extrabold capitalize text-white">
                  {s.name}
                </Text>
              </Pressable>
            </FadeIn>
          );
        })}
      </ScrollView>
    </Scene>
  );
}
