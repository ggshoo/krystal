import { Redirect, useRouter } from "expo-router";
import { useEffect, useRef, useState } from "react";
import { ActivityIndicator, Pressable, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

import { FadeIn } from "@/components/FadeIn";
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

  // Guards — if any required field is missing, route the user back to start.
  // Split so we can redirect to the right step instead of always to check-in.
  const missingCheckIn =
    draft.mind_score === undefined ||
    draft.body_score === undefined ||
    draft.heart_score === undefined;
  const missingEmotionPath =
    !draft.emotion_primary ||
    !draft.emotion_secondary ||
    !draft.emotion_specific;
  const missingIntensity = !draft.plutchik_emotion;
  const incomplete = missingCheckIn || missingEmotionPath || missingIntensity;

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
            plutchik_emotion: draft.plutchik_emotion ?? null,
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

  if (missingCheckIn) return <Redirect href="/check-in" />;
  if (missingEmotionPath) return <Redirect href="/emotion/primary" />;
  if (missingIntensity) return <Redirect href="/emotion/intensity" />;

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
            <ActivityIndicator size="large" color={primary?.color ?? "#C2876B"} />
            <Text className="mt-6 text-base text-muted">
              Saving your reflection…
            </Text>
          </>
        )}

        {state === "saved" && (
          <>
            {primary && (
              <FadeIn delay={0} duration={650}>
                <View className="mb-10 items-center">
                  <View
                    className="mb-3 h-3 w-3 rounded-full"
                    style={{ backgroundColor: primary.color }}
                  />
                  <Text className="text-xs font-semibold uppercase tracking-widest text-muted">
                    {primary.name} · {secondary?.name}
                  </Text>
                  <Text className="mt-2 text-4xl font-semibold capitalize text-ink">
                    {tertiary?.name}
                  </Text>
                  {draft.plutchik_emotion && (
                    <Text className="mt-3 text-base capitalize text-muted">
                      a feeling of {draft.plutchik_emotion}
                    </Text>
                  )}
                </View>
              </FadeIn>
            )}

            <FadeIn delay={250} duration={650}>
              <Text className="mb-3 text-center text-lg font-normal tracking-wide text-muted/70">
                saved.
              </Text>
            </FadeIn>

            <FadeIn delay={400} duration={650}>
              <Text className="mb-16 text-center text-base leading-relaxed text-muted">
                See you tomorrow.
              </Text>
            </FadeIn>

            <FadeIn delay={650} duration={500}>
              <Pressable
                accessibilityRole="button"
                className="rounded-full bg-accent px-10 py-5 shadow-sm transition-all duration-300 hover:scale-[1.15] hover:shadow-2xl active:opacity-70"
                onPress={handleReturnHome}
              >
                <Text className="text-base font-medium tracking-wide text-white">
                  Return home
                </Text>
              </Pressable>
            </FadeIn>
          </>
        )}

        {state === "error" && (
          <>
            <Text className="mb-3 text-3xl font-semibold tracking-tight text-ink">
              Couldn't save.
            </Text>
            <Text className="mb-10 text-center text-sm leading-relaxed text-muted">
              {errorMsg}
            </Text>
            <Pressable
              accessibilityRole="button"
              className="mb-4 rounded-full bg-accent px-10 py-5 shadow-sm active:opacity-70"
              onPress={handleRetry}
            >
              <Text className="text-base font-medium tracking-wide text-white">
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
