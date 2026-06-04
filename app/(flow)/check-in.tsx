import { useRouter } from "expo-router";
import { Pressable, ScrollView, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

import { useReflectionStore } from "@/store/useReflectionStore";

/**
 * Phase 5.1 — Check-in screen.
 *
 * Three dimensions (Mind, Body, Heart), 1–10 each via tap-to-select circles.
 * Score lives in Zustand draft state; written to Supabase only at the end
 * of the flow on the Done screen.
 *
 * "Continue" navigates to the emotion picker (Phase 5.2 — not yet built;
 * tapping it before that's done will show a "not found" route).
 */

type DimensionKey = "mind_score" | "body_score" | "heart_score";

type Dimension = {
  key: DimensionKey;
  label: string;
  question: string;
  low: string;
  high: string;
};

const DIMENSIONS: readonly Dimension[] = [
  {
    key: "mind_score",
    label: "Mind",
    question: "How are your thoughts today?",
    low: "worried · racing · foggy",
    high: "focused · clear · present",
  },
  {
    key: "body_score",
    label: "Body",
    question: "How does your body feel right now?",
    low: "fatigue · pain · tension",
    high: "relaxed · alive · active",
  },
  {
    key: "heart_score",
    label: "Heart",
    question: "How emotionally connected do you feel?",
    low: "numb · closed off",
    high: "open · connected",
  },
] as const;

export default function CheckIn() {
  const router = useRouter();
  const draft = useReflectionStore((s) => s.draft);
  const setField = useReflectionStore((s) => s.setField);

  const allRated = DIMENSIONS.every((d) => draft[d.key] !== undefined);

  return (
    <SafeAreaView className="flex-1 bg-cream" edges={["top", "bottom"]}>
      <ScrollView
        className="flex-1"
        contentContainerStyle={{
          paddingHorizontal: 24,
          paddingTop: 24,
          paddingBottom: 48,
        }}
      >
        <Text className="mb-2 text-2xl font-semibold text-ink">
          Check in with yourself
        </Text>
        <Text className="mb-10 text-base text-muted">
          Three quick questions. There are no wrong answers.
        </Text>

        {DIMENSIONS.map((d) => (
          <DimensionRow
            key={d.key}
            label={d.label}
            question={d.question}
            low={d.low}
            high={d.high}
            value={draft[d.key]}
            onChange={(n) => setField(d.key, n)}
          />
        ))}

        <Pressable
          accessibilityRole="button"
          accessibilityState={{ disabled: !allRated }}
          disabled={!allRated}
          onPress={() => router.push("/emotion/primary")}
          className={`mt-4 items-center rounded-full py-4 ${
            allRated ? "bg-accent active:opacity-70" : "bg-ink/10"
          }`}
        >
          <Text
            className={`text-base font-medium ${
              allRated ? "text-white" : "text-muted"
            }`}
          >
            Continue
          </Text>
        </Pressable>

        {!allRated && (
          <Text className="mt-3 text-center text-xs text-muted">
            Tap a number for Mind, Body, and Heart to continue.
          </Text>
        )}
      </ScrollView>
    </SafeAreaView>
  );
}

function DimensionRow({
  label,
  question,
  low,
  high,
  value,
  onChange,
}: {
  label: string;
  question: string;
  low: string;
  high: string;
  value: number | undefined;
  onChange: (n: number) => void;
}) {
  return (
    <View className="mb-10">
      <Text className="mb-2 text-xs font-semibold uppercase tracking-widest text-muted">
        {label}
      </Text>
      <Text className="mb-5 text-lg leading-snug text-ink">{question}</Text>

      <View className="mb-2 flex-row items-center justify-between">
        {Array.from({ length: 10 }, (_, i) => i + 1).map((n) => {
          const selected = value === n;
          return (
            <Pressable
              key={n}
              accessibilityRole="button"
              accessibilityLabel={`${label} ${n} of 10`}
              accessibilityState={{ selected }}
              onPress={() => onChange(n)}
              className={`h-9 w-9 items-center justify-center rounded-full border ${
                selected
                  ? "border-accent bg-accent"
                  : "border-ink/15 bg-cream active:bg-ink/5"
              }`}
            >
              <Text
                className={
                  selected
                    ? "text-sm font-semibold text-white"
                    : "text-sm text-muted"
                }
              >
                {n}
              </Text>
            </Pressable>
          );
        })}
      </View>

      <View className="flex-row justify-between">
        <Text className="flex-1 text-xs text-muted">{low}</Text>
        <Text className="flex-1 text-right text-xs text-muted">{high}</Text>
      </View>
    </View>
  );
}
