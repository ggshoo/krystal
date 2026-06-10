import { useRouter } from "expo-router";
import { useEffect, useState } from "react";
import {
  ActivityIndicator,
  KeyboardAvoidingView,
  Platform,
  Pressable,
  Text,
  TextInput,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

import { FadeIn } from "@/components/FadeIn";
import { fetchTodaysEntry } from "@/lib/history";
import { supabase } from "@/lib/supabase";
import { useAuthStore } from "@/store/useAuthStore";
import { useReflectionStore } from "@/store/useReflectionStore";

/**
 * Welcome screen.
 *
 * First-time visit: asks for a display name, persists to profiles.display_name.
 * Returning visit: shows personalized greeting + "Ready" button.
 *
 * Either way, "Ready"/"Continue" navigates to /check-in/mind, the first
 * step of the check-in flow.
 */
export default function Welcome() {
  const router = useRouter();
  const user = useAuthStore((s) => s.user);
  const authInitialized = useAuthStore((s) => s.initialized);

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
        setField("mind_score", todaysEntry.mind_score);
        setField("body_score", todaysEntry.body_score);
        setField("heart_score", todaysEntry.heart_score);
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
      <SafeAreaView className="flex-1 items-center justify-center bg-cream">
        <ActivityIndicator color="#C2876B" />
      </SafeAreaView>
    );
  }

  // ── First-time — capture name ────────────────────────────────────────────
  if (!displayName) {
    const canSubmit = nameInput.trim().length > 0 && !saving;

    return (
      <SafeAreaView className="flex-1 bg-cream">
        <KeyboardAvoidingView
          behavior={Platform.OS === "ios" ? "padding" : undefined}
          className="flex-1"
        >
          <View className="flex-1 items-center justify-center px-8">
            <Text className="mb-3 text-center text-3xl font-semibold tracking-tight text-ink">
              Hi there.
            </Text>
            <Text className="mb-12 text-center text-base leading-relaxed text-muted">
              What should I call you?
            </Text>

            <TextInput
              autoFocus
              placeholder="Your name"
              placeholderTextColor="#8A7E6F"
              value={nameInput}
              onChangeText={setNameInput}
              onSubmitEditing={handleSaveAndContinue}
              returnKeyType="done"
              className="w-full rounded-full bg-surface px-6 py-4 text-center text-base text-ink"
              style={{
                shadowColor: "#2D2520",
                shadowOpacity: 0.04,
                shadowRadius: 12,
                shadowOffset: { width: 0, height: 2 },
              }}
            />

            <Pressable
              accessibilityRole="button"
              accessibilityState={{ disabled: !canSubmit }}
              disabled={!canSubmit}
              onPress={handleSaveAndContinue}
              className={`mt-8 rounded-full px-10 py-5 shadow-sm ${
                canSubmit ? "bg-accent active:opacity-70" : "bg-ink/10"
              }`}
            >
              <Text
                className={`text-base font-medium tracking-wide ${
                  canSubmit ? "text-white" : "text-muted"
                }`}
              >
                Continue
              </Text>
            </Pressable>
          </View>
        </KeyboardAvoidingView>
      </SafeAreaView>
    );
  }

  // ── Returning — personalized greeting ────────────────────────────────────
  return (
    <SafeAreaView className="flex-1 bg-cream">
      <View className="flex-1 items-center justify-center px-8">
        <FadeIn delay={0} duration={650}>
          <Text className="mb-4 text-center text-3xl font-semibold leading-snug tracking-tight text-ink">
            Hi {displayName},
          </Text>
        </FadeIn>
        <FadeIn delay={200} duration={650}>
          <Text className="mb-16 max-w-xs text-center text-base leading-relaxed text-muted">
            I hope you're doing well. Let's begin a mindfulness check-in.
          </Text>
        </FadeIn>

        <FadeIn delay={500} duration={500}>
          <Pressable
            accessibilityRole="button"
            onPress={handleReady}
            className="rounded-full bg-accent px-10 py-5 shadow-sm transition-all duration-300 hover:scale-[1.15] hover:shadow-2xl active:opacity-70"
          >
            <Text className="text-base font-medium tracking-wide text-white">
              Ready
            </Text>
          </Pressable>
        </FadeIn>
      </View>
    </SafeAreaView>
  );
}
