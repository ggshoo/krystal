import { useRouter } from "expo-router";
import { ReactNode, useEffect, useState } from "react";
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
  /** Big hero word — "Mind" / "Body" / "Heart". */
  label: string;
  /**
   * Sub-question prose. Pass JSX to bold the key emotional word, e.g.
   * `<>How are your <Text className="font-semibold text-ink">thoughts</Text> today?</>`
   */
  question: ReactNode;
  low: string;
  high: string;
  /** Where to go after the user makes a selection. */
  nextRoute: string;
};

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
    <SafeAreaView className="flex-1 bg-cream dark:bg-cream-dark" edges={["top", "bottom"]}>
      <View className="flex-1 px-6 pt-10">
        <FadeIn delay={0}>
          <View className="mb-12 flex-row justify-center gap-2">
            {[1, 2, 3].map((i) => (
              <View
                key={i}
                className={`h-1.5 w-10 rounded-full ${
                  i <= step ? "bg-accent dark:bg-accent-dark" : "bg-ink/10 dark:bg-ink-dark/15"
                }`}
              />
            ))}
          </View>
        </FadeIn>

        {/* HERO label — Mind / Body / Heart */}
        <FadeIn delay={150}>
          <Text className="mb-5 text-center text-6xl font-semibold tracking-tight text-ink dark:text-ink-dark">
            {label}
          </Text>
        </FadeIn>

        {/* Sub-question with bolded key word passed as JSX */}
        <FadeIn delay={350}>
          <Text className="mb-16 text-center text-xl leading-relaxed text-muted dark:text-muted-dark">
            {question}
          </Text>
        </FadeIn>

        <FadeIn delay={550}>
          {/* Rating row.
              Mobile constraint: 10 buttons × fixed 44px = 440px, which
              overflows ~327px content width on a phone (cuts off 9 & 10).
              Each button now lives in a flex-1 wrapper so the row scales
              to fit, capped at 44px per button on wider screens so the
              row doesn't sprawl on a desktop. Selected scale reduced to
              1.15 so it doesn't overlap neighbors at tight widths. */}
          <View className="mb-4 flex-row items-center">
            {Array.from({ length: 10 }, (_, i) => i + 1).map((n) => {
              const selected = pending === n;
              return (
                <View key={n} className="flex-1 items-center px-0.5">
                  <Pressable
                    accessibilityRole="button"
                    accessibilityLabel={`${label} ${n} of 10`}
                    accessibilityState={{ selected }}
                    onPress={() => handleSelect(n)}
                    className={`aspect-square w-full max-w-11 items-center justify-center rounded-full border transition-all duration-300 ${
                      selected
                        ? "scale-110 border-accent dark:border-accent-dark bg-accent dark:bg-accent-dark shadow-lg"
                        : "border-ink/15 dark:border-ink-dark/20 bg-cream dark:bg-cream-dark hover:scale-110 hover:border-accent/60 hover:bg-accent/10 hover:shadow-md active:scale-95 active:bg-ink/5"
                    }`}
                  >
                    <Text
                      className={
                        selected
                          ? "text-base font-semibold text-white"
                          : "text-base text-muted dark:text-muted-dark"
                      }
                    >
                      {n}
                    </Text>
                  </Pressable>
                </View>
              );
            })}
          </View>
        </FadeIn>

        <FadeIn delay={700}>
          <View className="mt-4 flex-row justify-between gap-6">
            <View className="flex-1">
              <Text className="mb-1 text-[10px] font-semibold uppercase tracking-widest text-muted dark:text-muted-dark">
                Low
              </Text>
              <Text className="text-sm leading-relaxed text-muted dark:text-muted-dark">{low}</Text>
            </View>
            <View className="flex-1">
              <Text className="mb-1 text-right text-[10px] font-semibold uppercase tracking-widest text-muted dark:text-muted-dark">
                High
              </Text>
              <Text className="text-right text-sm leading-relaxed text-muted dark:text-muted-dark">
                {high}
              </Text>
            </View>
          </View>
        </FadeIn>
      </View>
    </SafeAreaView>
  );
}
