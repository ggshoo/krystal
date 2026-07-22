import { Redirect, useRouter } from "expo-router";
import { useEffect, useRef, useState } from "react";
import { ActivityIndicator, Pressable, Text, View } from "react-native";

import { ChunkyButton } from "@/components/ChunkyButton";
import { FadeIn } from "@/components/FadeIn";
import { GrapeCompanion } from "@/components/GrapeCompanion";
import { Scene } from "@/components/Scene";
import { currentScene } from "@/lib/scene";
import { trackCheckinSaved } from "@/lib/analytics";
import {
  findPrimary,
  findSecondary,
  findTertiary,
} from "@/lib/emotions";
import { fetchTodaysEntry } from "@/lib/history";
import { supabase } from "@/lib/supabase";
import { uuid } from "@/lib/uuid";
import { useAuthStore } from "@/store/useAuthStore";
import { useEquippedSlugs } from "@/store/useInventoryStore";
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
  const equippedSlugs = useEquippedSlugs();
  const scene = currentScene();

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

        // One reflection per day per user. If today's row already exists,
        // UPDATE it; otherwise INSERT a new one.
        const existingTodaysEntry = await fetchTodaysEntry(user!.id);

        let dailyCheckinId: string;

        if (existingTodaysEntry) {
          const { error: updateError } = await supabase
            .from("daily_checkins")
            .update({
              mind_score: draft.mind_score!,
              body_score: draft.body_score!,
              heart_score: draft.heart_score!,
              emotion_id: emotionId,
              plutchik_emotion: draft.plutchik_emotion ?? null,
              occurred_at: new Date().toISOString(),
            })
            .eq("id", existingTodaysEntry.id);
          if (updateError) throw new Error(updateError.message);
          dailyCheckinId = existingTodaysEntry.id;
        } else {
          const { data: inserted, error: insertError } = await supabase
            .from("daily_checkins")
            .insert({
              user_id: user!.id,
              mind_score: draft.mind_score!,
              body_score: draft.body_score!,
              heart_score: draft.heart_score!,
              emotion_id: emotionId,
              plutchik_emotion: draft.plutchik_emotion ?? null,
              client_uuid: uuid(),
            })
            .select()
            .single();
          if (insertError) throw new Error(insertError.message);
          if (!inserted) throw new Error("Insert returned no row.");
          dailyCheckinId = inserted.id;
        }

        // Store the row id so the Journal screen can link a journal_entries
        // row back to this check-in.
        useReflectionStore
          .getState()
          .setField("daily_checkin_id", dailyCheckinId);

        // Fire analytics after successful save (fire-and-forget)
        trackCheckinSaved({
          capture_mode: "deep",
          mind: draft.mind_score!,
          body: draft.body_score!,
          heart: draft.heart_score!,
          emotion_primary: draft.emotion_primary!,
          is_edit: !!existingTodaysEntry,
        });

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
    <Scene edges={["top", "bottom"]}>
      <View className="flex-1 items-center justify-center px-8">
        {state === "saving" && (
          <>
            <ActivityIndicator size="large" color={primary?.color ?? "#E97451"} />
            <Text
              className="mt-6 font-body text-base font-semibold"
              style={{ color: scene.subInk }}
            >
              Saving your reflection…
            </Text>
          </>
        )}

        {state === "saved" && (
          <>
            {primary && (
              <FadeIn delay={0} duration={650}>
                <View className="mb-10 items-center">
                  {/* Grape mirrors today's chosen emotion via color */}
                  <View className="mb-6">
                    <GrapeCompanion
                      emotionPrimary={primary.slug}
                      plutchikEmotion={draft.plutchik_emotion ?? undefined}
                      size={96}
                      equipped={equippedSlugs}
                    />
                  </View>
                  <View
                    className="mb-3 h-3 w-3 rounded-full"
                    style={{ backgroundColor: primary.color }}
                  />
                  <Text
                    className="font-display text-xs font-bold uppercase tracking-widest"
                    style={{ color: scene.subInk }}
                  >
                    {primary.name} · {secondary?.name}
                  </Text>
                  <Text
                    className="mt-2 font-display text-4xl font-extrabold capitalize"
                    style={{ color: scene.ink }}
                  >
                    {tertiary?.name}
                  </Text>
                  {draft.plutchik_emotion && (
                    <Text
                      className="mt-3 font-body text-base font-semibold capitalize"
                      style={{ color: scene.subInk }}
                    >
                      a feeling of {draft.plutchik_emotion}
                    </Text>
                  )}
                </View>
              </FadeIn>
            )}

            <FadeIn delay={250} duration={650}>
              <Text
                className="mb-3 text-center font-display text-lg font-bold tracking-wide"
                style={{ color: scene.ink }}
              >
                saved.
              </Text>
            </FadeIn>

            <FadeIn delay={400} duration={650}>
              <Text
                className="mb-16 text-center font-body text-base font-semibold leading-relaxed"
                style={{ color: scene.subInk }}
              >
                See you tomorrow.
              </Text>
            </FadeIn>

            <FadeIn delay={650} duration={500}>
              <View className="mb-4">
                <ChunkyButton
                  label="Continue to journal"
                  variant="primary"
                  onPress={() => router.push("/journal")}
                />
              </View>
            </FadeIn>

            <FadeIn delay={800} duration={500}>
              <Pressable
                accessibilityRole="button"
                className="px-4 py-2 transition-all duration-300 hover:opacity-70"
                onPress={handleReturnHome}
              >
                <Text
                  className="font-body text-sm font-bold underline"
                  style={{ color: scene.subInk }}
                >
                  Return home
                </Text>
              </Pressable>
            </FadeIn>
          </>
        )}

        {state === "error" && (
          <>
            <Text
              className="mb-3 font-display text-3xl font-extrabold tracking-tight"
              style={{ color: scene.ink }}
            >
              Couldn't save.
            </Text>
            <Text
              className="mb-10 text-center font-body text-sm font-semibold leading-relaxed"
              style={{ color: scene.subInk }}
            >
              {errorMsg}
            </Text>
            <View className="mb-4">
              <ChunkyButton label="Try again" variant="primary" onPress={handleRetry} />
            </View>
            <Pressable
              accessibilityRole="button"
              className="px-4 py-2"
              onPress={handleReturnHome}
            >
              <Text
                className="font-body text-sm font-bold underline"
                style={{ color: scene.subInk }}
              >
                Return home without saving
              </Text>
            </Pressable>
          </>
        )}
      </View>
    </Scene>
  );
}
