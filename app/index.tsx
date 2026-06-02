import { Pressable, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

/**
 * Placeholder home screen.
 * Phase 5 will replace the Begin button with navigation to the Grounding screen.
 */
export default function Home() {
  return (
    <SafeAreaView className="flex-1 bg-cream">
      <View className="flex-1 items-center justify-center px-6">
        <Text className="mb-3 text-4xl font-semibold text-ink">Krystal</Text>
        <Text className="mb-12 max-w-xs text-center text-base text-muted">
          A daily practice for emotional clarity.
        </Text>

        <Pressable
          accessibilityRole="button"
          className="rounded-full bg-accent px-8 py-4 active:opacity-70"
          onPress={() => {
            // TODO(phase-5): navigate to "/grounding"
          }}
        >
          <Text className="text-base font-medium text-white">
            Begin reflection
          </Text>
        </Pressable>

        <Text className="mt-12 text-xs text-muted">
          Scaffold ready · Phase 1 complete
        </Text>
      </View>
    </SafeAreaView>
  );
}
