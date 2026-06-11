import "react-native-gesture-handler";
import "../global.css";

import { Stack } from "expo-router";
import { StatusBar } from "expo-status-bar";
import { useEffect } from "react";
import { useColorScheme } from "react-native";
import { SafeAreaProvider } from "react-native-safe-area-context";

import { useAuthStore } from "@/store/useAuthStore";

export default function RootLayout() {
  // Kick off anonymous auth on app start. Idempotent — reuses an existing
  // session if one is already persisted in AsyncStorage.
  useEffect(() => {
    useAuthStore.getState().initialize();
  }, []);

  // Follow system dark mode so the StatusBar and screen background match.
  const scheme = useColorScheme();
  const isDark = scheme === "dark";

  return (
    <SafeAreaProvider>
      <StatusBar style={isDark ? "light" : "dark"} />
      <Stack
        screenOptions={{
          headerShown: false,
          contentStyle: {
            backgroundColor: isDark ? "#1F1B16" : "#F7F0E5",
          },
        }}
      />
    </SafeAreaProvider>
  );
}
