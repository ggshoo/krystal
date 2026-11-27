import "react-native-gesture-handler";
import "../global.css";

import {
  Roboto_400Regular,
  Roboto_500Medium,
  Roboto_700Bold,
} from "@expo-google-fonts/roboto";
import { useFonts } from "expo-font";
import {
  Stack,
  useRootNavigationState,
  useRouter,
  useSegments,
} from "expo-router";
import { StatusBar } from "expo-status-bar";
import { useEffect } from "react";
import { useColorScheme, View } from "react-native";
import { SafeAreaProvider } from "react-native-safe-area-context";

import { identifyUser, initAnalytics } from "@/lib/analytics";
import { useRefreshPendingEmail } from "@/lib/authLinking";
import { currentScene } from "@/lib/scene";
import { isSignedIn, useAuthStore } from "@/store/useAuthStore";

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

  // Attach the analytics identity as soon as the Supabase user resolves. Same user_id across sessions.
  const user = useAuthStore((s) => s.user);
  useEffect(() => {
    if (user) identifyUser(user.id, !user.email);
  }, [user]);

  // Sign-in is required. Anyone without an email account goes to /sign-in;
  // /auth-callback stays reachable so the email link can finish signing in.
  const authInitialized = useAuthStore((s) => s.initialized);
  const signedIn = isSignedIn(user);
  const segments = useSegments();
  const router = useRouter();
  const onAuthScreen =
    segments[0] === "sign-in" || segments[0] === "auth-callback";
  // Navigating before the Stack is mounted throws, so wait for its key.
  const navReady = !!useRootNavigationState()?.key;
  useEffect(() => {
    if (!navReady || !authInitialized || signedIn || onAuthScreen) return;
    router.replace("/sign-in");
  }, [navReady, authInitialized, signedIn, onAuthScreen, router]);

  // iOS/Android: pick up a confirmed email upgrade when the app returns to
  // the foreground (fallback for when the email link doesn't open the app).
  useRefreshPendingEmail();

  // The time-of-day scene drives the status bar tint and the flash color
  // shown behind screens during transitions, so it matches the sky the user
  // is about to see. (Each screen paints its own full scene on top.)
  const scene = currentScene();
  // Keep the manual dark check available in case a screen still reads it.
  useColorScheme();

  // Hold a plain sky-colored screen until the fonts and auth are ready, so
  // the UI doesn't flash in the system font, and a signed-out visitor never
  // sees the home screen before the redirect.
  if (!fontsLoaded || !authInitialized) {
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
      {/* Cover whatever screen mounted first while a signed-out visitor is
          being sent to /sign-in. The Stack must stay mounted for that. */}
      {!signedIn && !onAuthScreen && (
        <View
          pointerEvents="none"
          style={{
            position: "absolute",
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            backgroundColor: scene.sky[0],
          }}
        />
      )}
    </SafeAreaProvider>
  );
}
