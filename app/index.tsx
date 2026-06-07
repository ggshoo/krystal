import { useRouter } from "expo-router";
import { Pressable, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

import { FadeIn } from "@/components/FadeIn";

/**
 * Home screen.
 * Tapping "Begin" enters the daily reflection flow.
 */
export default function Home() {
  const router = useRouter();

  return (
    <SafeAreaView className="flex-1 bg-cream">
      <View className="flex-1 items-center justify-center px-6">
        <FadeIn delay={0} duration={650}>
          <Text className="mb-4 text-5xl font-semibold tracking-tight text-ink">
            krystal
          </Text>
        </FadeIn>

        <FadeIn delay={250} duration={650}>
          <Text className="mb-16 max-w-xs text-center text-base leading-relaxed text-muted">
            A daily practice for emotional clarity.
          </Text>
        </FadeIn>

        <FadeIn delay={550} duration={500}>
          <Pressable
            accessibilityRole="button"
            className="rounded-full bg-accent px-10 py-5 shadow-sm transition-all duration-200 hover:scale-110 hover:shadow-lg active:opacity-70"
            onPress={() => router.push("/welcome")}
          >
            <Text className="text-base font-medium tracking-wide text-white">
              Begin reflection
            </Text>
          </Pressable>
        </FadeIn>
      </View>
    </SafeAreaView>
  );
}
