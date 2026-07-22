import { useRouter } from "expo-router";
import { Text, View } from "react-native";

import { EmotionWheel } from "@/components/EmotionWheel";
import { FadeIn } from "@/components/FadeIn";
import { Scene } from "@/components/Scene";
import { currentScene } from "@/lib/scene";
import { useReflectionStore } from "@/store/useReflectionStore";

/**
 * Phase 5.2a — Pick primary emotion (Plutchik wheel).
 */
export default function PickPrimary() {
  const router = useRouter();
  const setEmotionPrimary = useReflectionStore((s) => s.setEmotionPrimary);
  const currentPrimary = useReflectionStore((s) => s.draft.emotion_primary);
  const scene = currentScene();

  const pick = (slug: string) => {
    setEmotionPrimary(slug);
    router.push("/emotion/secondary");
  };

  return (
    <Scene edges={["top", "bottom"]}>
      <View className="flex-1 items-center px-6 pt-12">
        <FadeIn delay={0}>
          <Text
            className="mb-3 text-center font-display text-4xl font-extrabold tracking-tight"
            style={{ color: scene.ink }}
          >
            What's coming up?
          </Text>
        </FadeIn>

        <FadeIn delay={120}>
          <Text
            className="mb-10 max-w-xs text-center font-body text-base font-semibold leading-relaxed"
            style={{ color: scene.subInk }}
          >
            Tap the closest feeling. We'll wander in from there.
          </Text>
        </FadeIn>

        <FadeIn delay={260}>
          <View className="items-center justify-center">
            <EmotionWheel onPick={pick} selected={currentPrimary} />
          </View>
        </FadeIn>
      </View>
    </Scene>
  );
}
