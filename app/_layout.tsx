import "react-native-gesture-handler";
import "../global.css";

import { Stack } from "expo-router";
import { StatusBar } from "expo-status-bar";
import { useEffect } from "react";
import { SafeAreaProvider } from "react-native-safe-area-context";

import { useAuthStore } from "@/store/useAuthStore";

export default function RootLayout() {
  // Kick off anonymous auth on app start. Idempotent — reuses an existing
  // session if one is already persisted in AsyncStorage.
  useEffect(() => {
    useAuthStore.getState().initialize();
  }, []);

  return (
    <SafeAreaProvider>
      <StatusBar style="dark" />
      <Stack
        screenOptions={{
          headerShown: false,
          contentStyle: { backgroundColor: "#F7F0E5" },
        }}
      />
    </SafeAreaProvider>
  );
}
