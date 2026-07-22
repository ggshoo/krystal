import "react-native-gesture-handler";
import "../global.css";

import {
  Roboto_400Regular,
  Roboto_500Medium,
  Roboto_700Bold,
} from "@expo-google-fonts/roboto";
import { useFonts } from "expo-font";
import { Stack } from "expo-router";
import { StatusBar } from "expo-status-bar";
import { useEffect } from "react";
import { useColorScheme, View } from "react-native";
import { SafeAreaProvider } from "react-native-safe-area-context";

import { identifyUser, initAnalytics } from "@/lib/analytics";
import { currentScene } from "@/lib/scene";
import { useAuthStore } from "@/store/useAuthStore";

export default function RootLayout() {
  // Load Roboto. The registered family name "Roboto" matches the `font-display`
  // / `font-body` families in tailwind.config.js, so those classes resolve on
  // native too — not just on the web build (which also pulls Roboto from Google
  // Fonts via app/+html.tsx). The extra weights are registered so they're
  // available if referenced directly.
  const [fontsLoaded] = useFonts({
    Roboto: Roboto_400Regular,
    Roboto_Medium: Roboto_500Medium,
    Roboto_Bold: Roboto_700Bold,
  });

  // Kick off anonymous auth on app start. Idempotent — reuses an existing
  // session if one is already persisted in AsyncStorage.
  useEffect(() => {
    initAnalytics();
    useAuthStore.getState().initialize();
  }, []);

  // Attach the analytics identity as soon as the anonymous (or upgraded)
  // Supabase user resolves. Same user_id across sessions.
  const user = useAuthStore((s) => s.user);
  useEffect(() => {
    if (user) identifyUser(user.id, !user.email);
  }, [user]);

  // The time-of-day scene drives the status bar tint and the flash color
  // shown behind screens during transitions, so it matches the sky the user
  // is about to see. (Each screen paints its own full scene on top.)
  const scene = currentScene();
  // Keep the manual dark check available in case a screen still reads it.
  useColorScheme();

  // Hold a plain sky-colored screen until the fonts are ready, so the UI
  // doesn't flash in the system font and then reflow.
  if (!fontsLoaded) {
    return (
      <SafeAreaProvider>
        <StatusBar style={scene.isDark ? "light" : "dark"} />
        <View style={{ flex: 1, backgroundColor: scene.sky[0] }} />
      </SafeAreaProvider>
    );
  }

  return (
    <SafeAreaProvider>
      <StatusBar style={scene.isDark ? "light" : "dark"} />
      <Stack
        screenOptions={{
          headerShown: false,
          contentStyle: {
            backgroundColor: scene.sky[0],
          },
        }}
      />
    </SafeAreaProvider>
  );
}
