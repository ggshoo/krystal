import { useRouter } from "expo-router";
import { useState } from "react";
import { Text, View, useWindowDimensions } from "react-native";

import { ChunkyButton } from "@/components/ChunkyButton";
import { FadeIn } from "@/components/FadeIn";
import { FeelingsWheel } from "@/components/FeelingsWheel";
import { Scene } from "@/components/Scene";
import { findPrimary, findSecondary, findTertiary } from "@/lib/emotions";
import { currentScene } from "@/lib/scene";
import { useReflectionStore } from "@/store/useReflectionStore";

/**
 * The feelings wheel journey: inner wheel → middle ring → outer ring, all on
 * this one screen (components/FeelingsWheel.tsx). Replaces the old wheel +
 * two tile screens; emotion/secondary.tsx and emotion/specific.tsx are no
 * longer linked from the flow.
 */
export default function PickFeeling() {
  const router = useRouter();
  const draft = useReflectionStore((s) => s.draft);
  const setEmotionPrimary = useReflectionStore((s) => s.setEmotionPrimary);
  const setEmotionSecondary = useReflectionStore((s) => s.setEmotionSecondary);
  const setEmotionSpecific = useReflectionStore((s) => s.setEmotionSpecific);
  const scene = currentScene();
  const { width, height } = useWindowDimensions();
  const size = Math.min(width - 24, height * 0.6, 520);

  const [sel, setSel] = useState<{
    primary?: string;
    secondary?: string;
    tertiary?: string;
  }>({
    primary: draft.emotion_primary,
    secondary: draft.emotion_secondary,
    tertiary: draft.emotion_specific,
  });

  const P = findPrimary(sel.primary);
  const S = findSecondary(sel.primary, sel.secondary);
  const T = findTertiary(sel.primary, sel.secondary, sel.tertiary);

  const title = !P
    ? "What's coming up?"
    : !S
      ? `What kind of ${P.name.toLowerCase()}?`
      : T
        ? `${T.name}.`
        : "A little closer.";
  const subtitle = !P
    ? "Start in the middle. Tap the feeling closest to now."
    : !S
      ? "Tap the one that fits best, or the center to go back."
      : T
        ? `${P.name} · ${S.name} · ${T.name}`
        : `${P.name} · ${S.name}`;

  const confirm = () => {
    if (!P || !S || !T) return;
    setEmotionPrimary(P.slug);
    setEmotionSecondary(S.slug);
    setEmotionSpecific(T.slug);
    router.push("/emotion/intensity");
  };

  return (
    <Scene edges={["top", "bottom"]}>
      <View className="flex-1 items-center px-3 pt-10">
        <FadeIn delay={0}>
          <Text
            className="mb-2 text-center font-display text-4xl font-extrabold tracking-tight"
            style={{ color: scene.ink }}
          >
            {title}
          </Text>
        </FadeIn>
        <Text
          className="mb-6 max-w-xs text-center font-body text-base font-semibold leading-relaxed"
          style={{ color: scene.subInk }}
        >
          {subtitle}
        </Text>

        <FeelingsWheel
          size={size}
          primary={sel.primary}
          secondary={sel.secondary}
          tertiary={sel.tertiary}
          onChange={setSel}
        />

        <View className="mt-6" style={{ minHeight: 64 }}>
          {T && (
            <FadeIn delay={0} duration={400}>
              <ChunkyButton
                label="That's it"
                variant="primary"
                onPress={confirm}
              />
            </FadeIn>
          )}
        </View>
      </View>
    </Scene>
  );
}
