import { Redirect, useRouter } from "expo-router";
import { useEffect, useRef, useState } from "react";
import { ActivityIndicator, Pressable, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

import {
  findPrimary,
  findSecondary,
  findTertiary,
} from "@/lib/emotions";
import { supabase } from "@/lib/supabase";
import { uuid } from "@/lib/uuid";
import { useAuthStore } from "@/store/useAuthStore";
import { useReflectionStore } from "@/store/useReflectionStore";

type SaveState = "saving" | "saved" | "error";

/**
 * Phase 5.3 — Done screen.
 *
 * Saves the in-progress reflection to Supabase (anonymous session), shows a
 * calm confirmation, and lets the user return home.
 */
export default function Done() {
  const router = useRouter();
  const draft = useReflectionStore((s) => s.draft);
  const reset = useReflectionStore((s) => s.reset);
  const user = useAuthStore((s) => s.user);
  const authInitialized = useAuthStore((s) => s.initialized);
  const authError = useAuthStore((s) => s.error);

  const [state, setState] = useState<SaveState>("saving");
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  // Prevent double-submission if the effect re-runs (auth state arrives later)
  const submittedRef = useRef(false);

  // Guards — if any required field is missing, route the user back to start
  const incomplete =
    draft.mind_score === undefined ||
    draft.body_score === undefined ||
    draft.heart_score === undefined ||
    !draft.emotion_primary ||
    !draft.emotion_secondary ||
    !draft.emotion_specific;

  const primary = findPrimary(draft.emotion_primary);
  const secondary = findSecondary(
    draft.emotion_primary,
    draft.emotion_secondary
  );
  const tertiary = findTertiary(
    draft.emotion_primary,
    draft.emotion_secondary,
    draft.emotion_specific
  );

  useEffect(() => {
    if (incomplete) return;
    if (!authInitialized) return; // wait for anon session
    if (!user) {
      setState("error");
      setErrorMsg(
        authError ??
          "Couldn't sign in anonymously. Anonymous sign-ins may not be enabled on this Supabase project."
      );
      return;
    }
    if (submittedRef.current) return;
    submittedRef.current = true;

    void save();

    async function save() {
      try {
        // Look up the emotion_details.id by joining hierarchy
        const { data: rows, error: lookupError } = await supabase
          .from("emotion_details")
          .select(
            "id, emotion_subcategories!inner(name, emotion_categories!inner(name))"
          )
          .eq("name", draft.emotion_specific!)
          .eq("emotion_subcategories.name", draft.emotion_secondary!)
          .eq(
            "emotion_subcategories.emotion_categories.name",
            draft.emotion_primary!
          )
          .limit(1);

        if (lookupError) throw new Error(lookupError.message);
        const emotionId = rows?.[0]?.id;
        if (!emotionId) throw new Error("Emotion not found in database.");

        const { error: insertError } = await supabase
          .from("daily_checkins")
          .insert({
            user_id: user!.id,
            mind_score: draft.mind_score!,
            body_score: draft.body_score!,
            heart_score: draft.heart_score!,
            emotion_id: emotionId,
            client_uuid: uuid(),
          });

        if (insertError) throw new Error(insertError.message);

        setState("saved");
      } catch (e) {
        setState("error");
        setErrorMsg(e instanceof Error ? e.message : String(e));
        submittedRef.current = false; // allow retry
      }
    }
  }, [incomplete, authInitialized, user, authError, draft]);

  if (incomplete) return <Redirect href="/check-in" />;

  const handleReturnHome = () => {
    reset();
    router.replace("/");
  };

  const handleRetry = () => {
    setState("saving");
    setErrorMsg(null);
    submittedRef.current = false;
  };

  return (
    <SafeAreaView className="flex-1 bg-cream" edges={["top", "bottom"]}>
      <View className="flex-1 items-center justify-center px-8">
        {state === "saving" && (
          <>
            <ActivityIndicator size="large" color={primary?.color ?? "#7B8FA1"} />
            <Text className="mt-6 text-base text-muted">
              Saving your reflection…
            </Text>
          </>
        )}

        {state === "saved" && (
          <>
            {primary && (
              <View className="mb-8 items-center">
                <View
                  className="mb-3 h-3 w-3 rounded-full"
                  style={{ backgroundColor: primary.color }}
                />
                <Text className="text-xs font-semibold uppercase tracking-widest text-muted">
                  {primary.name} · {secondary?.name}
                </Text>
                <Text className="mt-1 text-3xl font-semibold capitalize text-ink">
                  {tertiary?.name}
                </Text>
              </View>
            )}

            <Text className="mb-2 text-2xl font-semibold text-ink">
              Saved.
            </Text>
            <Text className="mb-12 text-center text-base text-muted">
              See you tomorrow.
            </Text>

            <Pressable
              accessibilityRole="button"
              className="rounded-full bg-accent px-8 py-4 active:opacity-70"
              onPress={handleReturnHome}
            >
              <Text className="text-base font-medium text-white">
                Return home
              </Text>
            </Pressable>
          </>
        )}

        {state === "error" && (
          <>
            <Text className="mb-2 text-2xl font-semibold text-ink">
              Couldn't save.
            </Text>
            <Text className="mb-8 text-center text-sm text-muted">
              {errorMsg}
            </Text>
            <Pressable
              accessibilityRole="button"
              className="mb-3 rounded-full bg-accent px-8 py-4 active:opacity-70"
              onPress={handleRetry}
            >
              <Text className="text-base font-medium text-white">
                Try again
              </Text>
            </Pressable>
            <Pressable
              accessibilityRole="button"
              className="px-4 py-2"
              onPress={handleReturnHome}
            >
              <Text className="text-sm text-muted underline">
                Return home without saving
              </Text>
            </Pressable>
          </>
        )}
      </View>
    </SafeAreaView>
  );
}
