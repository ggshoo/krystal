import { useRouter } from "expo-router";
import { useEffect, useState } from "react";
import { Pressable, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

import { FadeIn } from "@/components/FadeIn";
import { useReflectionStore } from "@/store/useReflectionStore";

type DimensionKey = "mind_score" | "body_score" | "heart_score";

type Props = {
  /** 1 / 2 / 3 — drives the progress indicator. */
  step: 1 | 2 | 3;
  /** Field on the reflection draft to write to. */
  dimensionKey: DimensionKey;
  label: string;
  question: string;
  low: string;
  high: string;
  /** Where to go after the user makes a selection. */
  nextRoute: string;
};

/**
 * Shared one-question check-in screen. Renders a single dimension
 * (Mind / Body / Heart) with 1–10 tap-to-select circles.
 *
 * Soft staggered fade-in on mount. Auto-advances ~280ms after selection
 * so the user sees their tap register before the fade to the next step.
 */
export function CheckInStep({
  step,
  dimensionKey,
  label,
  question,
  low,
  high,
  nextRoute,
}: Props) {
  const router = useRouter();
  const value = useReflectionStore((s) => s.draft[dimensionKey]);
  const setField = useReflectionStore((s) => s.setField);

  const [pending, setPending] = useState<number | undefined>(value);

  useEffect(() => {
    setPending(value);
  }, [value]);

  const handleSelect = (n: number) => {
    setField(dimensionKey, n);
    setPending(n);
    const t = setTimeout(() => router.push(nextRoute), 500);
    return () => clearTimeout(t);
  };

  return (
    <SafeAreaView className="flex-1 bg-cream" edges={["top", "bottom"]}>
      <View className="flex-1 px-6 pt-10">
        <FadeIn delay={0}>
          <View className="mb-16 flex-row justify-center gap-2">
            {[1, 2, 3].map((i) => (
              <View
                key={i}
                className={`h-1.5 w-10 rounded-full ${
                  i <= step ? "bg-accent" : "bg-ink/10"
                }`}
              />
            ))}
          </View>
        </FadeIn>

        <FadeIn delay={100}>
          <Text className="mb-3 text-xs font-semibold uppercase tracking-widest text-muted">
            {label}
          </Text>
        </FadeIn>

        <FadeIn delay={180}>
          <Text className="mb-16 text-3xl font-semibold leading-snug tracking-tight text-ink">
            {question}
          </Text>
        </FadeIn>

        <FadeIn delay={300}>
          <View className="mb-4 flex-row items-center justify-between">
            {Array.from({ length: 10 }, (_, i) => i + 1).map((n) => {
              const selected = pending === n;
              return (
                <Pressable
                  key={n}
                  accessibilityRole="button"
                  accessibilityLabel={`${label} ${n} of 10`}
                  accessibilityState={{ selected }}
                  onPress={() => handleSelect(n)}
                  className={`h-11 w-11 items-center justify-center rounded-full border transition-all duration-300 ${
                    selected
                      ? "scale-125 border-accent bg-accent shadow-lg"
                      : "border-ink/15 bg-cream hover:scale-125 hover:border-accent/60 hover:bg-accent/10 hover:shadow-md active:scale-95 active:bg-ink/5"
                  }`}
                >
                  <Text
                    className={
                      selected
                        ? "text-base font-semibold text-white"
                        : "text-base text-muted"
                    }
                  >
                    {n}
                  </Text>
                </Pressable>
              );
            })}
          </View>
        </FadeIn>

        <FadeIn delay={400}>
          <View className="mt-4 flex-row justify-between gap-6">
            <View className="flex-1">
              <Text className="mb-1 text-[10px] font-semibold uppercase tracking-widest text-muted">
                Low
              </Text>
              <Text className="text-sm leading-relaxed text-muted">{low}</Text>
            </View>
            <View className="flex-1">
              <Text className="mb-1 text-right text-[10px] font-semibold uppercase tracking-widest text-muted">
                High
              </Text>
              <Text className="text-right text-sm leading-relaxed text-muted">
                {high}
              </Text>
            </View>
          </View>
        </FadeIn>
      </View>
    </SafeAreaView>
  );
}
