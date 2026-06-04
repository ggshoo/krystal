import { useRouter } from "expo-router";
import { Pressable, ScrollView, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

import { EMOTIONS } from "@/lib/emotions";
import { useReflectionStore } from "@/store/useReflectionStore";

/**
 * Phase 5.2a — Pick primary emotion.
 *
 * 8 color-tinted tiles in a 2-column grid. Picking one stores the slug to
 * draft state, clears downstream emotion selections, and navigates to the
 * secondary picker.
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
    <SafeAreaView className="flex-1 bg-cream" edges={["top", "bottom"]}>
      <ScrollView
        className="flex-1"
        contentContainerStyle={{
          paddingHorizontal: 20,
          paddingTop: 24,
          paddingBottom: 48,
        }}
      >
        <Text className="mb-2 px-1 text-2xl font-semibold text-ink">
          What's coming up for you?
        </Text>
        <Text className="mb-8 px-1 text-base text-muted">
          Start broad. We'll narrow down together.
        </Text>

        <View className="-mx-2 flex-row flex-wrap">
          {EMOTIONS.map((e) => {
            const selected = e.slug === currentPrimary;
            return (
              <View key={e.slug} className="mb-4 w-1/2 px-2">
                <Pressable
                  accessibilityRole="button"
                  accessibilityLabel={e.name}
                  accessibilityState={{ selected }}
                  onPress={() => pick(e.slug)}
                  className="h-28 items-center justify-center rounded-3xl active:opacity-70"
                  style={{
                    backgroundColor: e.color + (selected ? "55" : "26"),
                    borderWidth: selected ? 2 : 0,
                    borderColor: e.color,
                  }}
                >
                  <View
                    className="mb-2 h-3 w-3 rounded-full"
                    style={{ backgroundColor: e.color }}
                  />
                  <Text className="text-lg font-medium text-ink">{e.name}</Text>
                </Pressable>
              </View>
            );
          })}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
