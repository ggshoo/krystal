import { useRouter } from "expo-router";
import { Pressable, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

/**
 * Home screen.
 * Tapping "Begin" enters the daily reflection flow (Check-in is first).
 */
export default function Home() {
  const router = useRouter();

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
          onPress={() => router.push("/check-in")}
        >
          <Text className="text-base font-medium text-white">
            Begin reflection
          </Text>
        </Pressable>
      </View>
    </SafeAreaView>
  );
}
