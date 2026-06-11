import { useRouter } from "expo-router";
import { Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

import { EmotionWheel } from "@/components/EmotionWheel";
import { FadeIn } from "@/components/FadeIn";
import { useReflectionStore } from "@/store/useReflectionStore";

/**
 * Phase 5.2a — Pick primary emotion (Plutchik wheel).
 */
export default function PickPrimary() {
  const router = useRouter();
  const setEmotionPrimary = useReflectionStore((s) => s.setEmotionPrimary);
  const currentPrimary = useReflectionStore((s) => s.draft.emotion_primary);

  const pick = (slug: string) => {
    setEmotionPrimary(slug);
    router.push("/emotion/secondary");
  };

  return (
    <SafeAreaView className="flex-1 bg-cream dark:bg-cream-dark" edges={["top", "bottom"]}>
      <View className="flex-1 items-center px-6 pt-12">
        <FadeIn delay={0}>
          <Text className="mb-3 text-center text-3xl font-semibold tracking-tight text-ink dark:text-ink-dark">
            What's coming up?
          </Text>
        </FadeIn>

        <FadeIn delay={120}>
          <Text className="mb-10 max-w-xs text-center text-base leading-relaxed text-muted dark:text-muted-dark">
            Tap the closest emotion. We'll narrow down from there.
          </Text>
        </FadeIn>

        <FadeIn delay={260}>
          <View className="items-center justify-center">
            <EmotionWheel onPick={pick} selected={currentPrimary} />
          </View>
        </FadeIn>
      </View>
    </SafeAreaView>
  );
}
