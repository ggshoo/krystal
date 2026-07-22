import { useRouter } from "expo-router";
import { useEffect, useState } from "react";
import {
  ActivityIndicator,
  KeyboardAvoidingView,
  Platform,
  Text,
  TextInput,
  View,
} from "react-native";

import { ChunkyButton } from "@/components/ChunkyButton";
import { FadeIn } from "@/components/FadeIn";
import { JourneyPill } from "@/components/JourneyPill";
import { Scene } from "@/components/Scene";
import { fetchTodaysEntry } from "@/lib/history";
import { currentScene } from "@/lib/scene";
import { supabase } from "@/lib/supabase";
import { useAuthStore } from "@/store/useAuthStore";
import { useReflectionStore } from "@/store/useReflectionStore";

/**
 * Welcome screen.
 *
 * First-time visit: asks for a display name, persists to profiles.display_name.
 * Returning visit: shows personalized greeting + "Let's go" button.
 *
 * Either way, continuing navigates to /check-in/mind, the first step of the
 * check-in flow.
 */
export default function Welcome() {
  const router = useRouter();
  const user = useAuthStore((s) => s.user);
  const authInitialized = useAuthStore((s) => s.initialized);
  const scene = currentScene();

  const [displayName, setDisplayName] = useState<string | null>(null);
  const [nameInput, setNameInput] = useState("");
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  // Fetch profile once auth has initialized AND hydrate the reflection
  // draft from today's existing check-in if one exists. This way when the
  // user re-enters the flow to "Change today's emotions", the Mind/Body/
  // Heart screens and the emotion picker pre-fill with current values.
  useEffect(() => {
    if (!authInitialized || !user) return;
    let cancelled = false;
    (async () => {
      const [profileRes, todaysEntry] = await Promise.all([
        supabase
          .from("profiles")
          .select("display_name")
          .eq("id", user.id)
          .single(),
        fetchTodaysEntry(user.id),
      ]);
      if (cancelled) return;

      setDisplayName(profileRes.data?.display_name ?? null);

      if (todaysEntry) {
        const setField = useReflectionStore.getState().setField;
        setField("daily_checkin_id", todaysEntry.id);
        setField("mind_score", todaysEntry.mind_score ?? undefined);
        setField("body_score", todaysEntry.body_score ?? undefined);
        setField("heart_score", todaysEntry.heart_score ?? undefined);
        if (todaysEntry.emotion) {
          setField(
            "emotion_primary",
            todaysEntry.emotion.primary_name.toLowerCase()
          );
          setField(
            "emotion_secondary",
            todaysEntry.emotion.secondary_name.toLowerCase()
          );
          setField(
            "emotion_specific",
            todaysEntry.emotion.specific_name.toLowerCase()
          );
        }
        if (todaysEntry.plutchik_emotion) {
          setField("plutchik_emotion", todaysEntry.plutchik_emotion);
        }
      }

      setLoading(false);
    })();
    return () => {
      cancelled = true;
    };
  }, [authInitialized, user]);

  const handleSaveAndContinue = async () => {
    const trimmed = nameInput.trim();
    if (!trimmed || !user) return;
    setSaving(true);
    await supabase
      .from("profiles")
      .update({ display_name: trimmed })
      .eq("id", user.id);
    router.push("/check-in/mind");
  };

  const handleReady = () => {
    router.push("/check-in/mind");
  };

  if (loading) {
    return (
      <Scene className="items-center justify-center">
        <ActivityIndicator color="#E97451" />
      </Scene>
    );
  }

  // ── First-time — capture name ────────────────────────────────────────────
  if (!displayName) {
    const canSubmit = nameInput.trim().length > 0 && !saving;

    return (
      <Scene>
        <KeyboardAvoidingView
          behavior={Platform.OS === "ios" ? "padding" : undefined}
          className="flex-1"
        >
          <View className="flex-1 items-center justify-center px-8">
            <FadeIn delay={0} duration={650}>
              <Text
                className="mb-3 text-center font-display text-4xl font-extrabold tracking-tight"
                style={{ color: scene.ink }}
              >
                Hi there.
              </Text>
            </FadeIn>
            <FadeIn delay={150} duration={650}>
              <Text
                className="mb-12 text-center font-body text-base font-semibold leading-relaxed"
                style={{ color: scene.subInk }}
              >
                What should I call you?
              </Text>
            </FadeIn>

            <TextInput
              autoFocus
              placeholder="Your name"
              placeholderTextColor="#9A8B76"
              value={nameInput}
              onChangeText={setNameInput}
              onSubmitEditing={handleSaveAndContinue}
              returnKeyType="done"
              className="w-full rounded-tile px-6 py-4 text-center font-body text-base text-ink"
              style={{
                backgroundColor: "#FFFDF6",
                borderWidth: 2,
                borderColor: "#E4D6BC",
                shadowColor: "#2E2416",
                shadowOpacity: 0.08,
                shadowRadius: 12,
                shadowOffset: { width: 0, height: 3 },
              }}
            />

            <View className="mt-8">
              <ChunkyButton
                label="Continue"
                onPress={handleSaveAndContinue}
                disabled={!canSubmit}
                loading={saving}
              />
            </View>
          </View>
        </KeyboardAvoidingView>
      </Scene>
    );
  }

  // ── Returning — personalized greeting ────────────────────────────────────
  return (
    <Scene>
      <View className="flex-1 items-center justify-center px-8">
        <FadeIn delay={0} duration={650}>
          <View className="mb-4">
            <JourneyPill />
          </View>
        </FadeIn>
        <FadeIn delay={120} duration={650}>
          <Text
            className="mb-4 text-center font-display text-4xl font-extrabold leading-snug tracking-tight"
            style={{ color: scene.ink }}
          >
            Hi {displayName},
          </Text>
        </FadeIn>
        <FadeIn delay={280} duration={650}>
          <Text
            className="mb-16 max-w-xs text-center font-body text-base font-semibold leading-relaxed"
            style={{ color: scene.subInk }}
          >
            Let's take a little while to notice how today feels.
          </Text>
        </FadeIn>

        <FadeIn delay={500} duration={500}>
          <ChunkyButton label="Let's go" onPress={handleReady} variant="primary" />
        </FadeIn>
      </View>
    </Scene>
  );
}
