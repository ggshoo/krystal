import * as Linking from "expo-linking";
import { useRouter } from "expo-router";
import { useEffect, useRef, useState } from "react";
import { ActivityIndicator, Text, View } from "react-native";

import { ChunkyButton } from "@/components/ChunkyButton";
import { Scene } from "@/components/Scene";
import { completeAuthFromUrl } from "@/lib/authLinking";
import { currentScene } from "@/lib/scene";

/**
 * Landing spot for crystal://auth-callback, the link in the email
 * confirmation message on iOS/Android. Sets the session, then goes back to
 * the sign-in screen, which shows "You're signed in."
 */
export default function AuthCallback() {
  const router = useRouter();
  const url = Linking.useURL();
  const scene = currentScene();
  const handled = useRef(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!url || handled.current) return;
    handled.current = true;

    completeAuthFromUrl(url).then((err) => {
      if (err) setError(err);
      else router.replace("/sign-in");
    });
  }, [url, router]);

  return (
    <Scene edges={["top", "bottom"]}>
      <View className="flex-1 items-center justify-center px-8">
        {error ? (
          <>
            <Text
              className="mb-3 text-center font-display text-3xl font-extrabold"
              style={{ color: scene.ink }}
            >
              That link didn't work.
            </Text>
            <Text
              className="mb-10 max-w-sm text-center font-body text-base font-semibold"
              style={{ color: scene.subInk }}
            >
              {error}
            </Text>
            <ChunkyButton
              label="Try again"
              variant="primary"
              onPress={() => router.replace("/sign-in")}
            />
          </>
        ) : (
          <ActivityIndicator color={scene.ink} />
        )}
      </View>
    </Scene>
  );
}
