import { useRouter } from "expo-router";
import { useEffect, useRef, useState } from "react";
import {
  ActivityIndicator,
  KeyboardAvoidingView,
  Platform,
  Pressable,
  Text,
  TextInput,
  View,
} from "react-native";

import { ChunkyButton } from "@/components/ChunkyButton";
import { FadeIn } from "@/components/FadeIn";
import { GrapeCompanion } from "@/components/GrapeCompanion";
import { Scene } from "@/components/Scene";
import { trackCheckinSaved } from "@/lib/analytics";
import { shadeHex } from "@/lib/color";
import { EMOTIONS } from "@/lib/emotions";
import { currentScene } from "@/lib/scene";
import { fetchTodaysEntry } from "@/lib/history";
import { supabase } from "@/lib/supabase";
import { uuid } from "@/lib/uuid";
import { useAuthStore } from "@/store/useAuthStore";
import { useEquippedSlugs } from "@/store/useInventoryStore";

type SaveState = "editing" | "saving" | "saved" | "error";

/**
 * Quick Capture — the 30-second daily check-in.
 *
 * The ICP (busy young adult, early career, therapy-adjacent) doesn't have
 * time for the 9-screen Deep Reflection flow every day. This is the default
 * daily surface: one screen, one tap for emotion, one optional line, save.
 *
 * Design constraints (from PRD v2.0 §4):
 *   - Emotion pick is optional (D-004 resolved: "just checking in" is valid)
 *   - Note is optional (one line max, low-emphasis)
 *   - Saves to the same daily_checkins table as Deep Reflection (unified
 *     one-per-day + streak + history), with capture_mode='quick' to
 *     distinguish. See migration supabase/008_quick_capture.sql.
 *   - Counts toward the lenient streak equally with Deep Reflection.
 *   - If today already has an entry, this UPDATES it (upsert semantics
 *     preserve the "one reflection per day" rule).
 */
export default function QuickCapture() {
  const router = useRouter();
  const user = useAuthStore((s) => s.user);
  const authInitialized = useAuthStore((s) => s.initialized);
  const equippedSlugs = useEquippedSlugs();
  const scene = currentScene();

  const [selectedEmotion, setSelectedEmotion] = useState<string | null>(null);
  const [note, setNote] = useState("");
  const [state, setState] = useState<SaveState>("editing");
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  // Prevent double-submits if the user taps save twice quickly
  const submittingRef = useRef(false);

  const handleSave = async () => {
    if (submittingRef.current) return;
    if (!user) {
      setState("error");
      setErrorMsg("Not signed in.");
      return;
    }
    submittingRef.current = true;
    setState("saving");
    setErrorMsg(null);

    try {
      // If today already has an entry, update; else insert. Same one-per-day
      // enforcement as Deep Reflection — see app/(flow)/done.tsx for the
      // canonical version of this pattern.
      const existing = await fetchTodaysEntry(user.id);

      const trimmedNote = note.trim();
      const payload = {
        capture_mode: "quick" as const,
        quick_emotion_primary: selectedEmotion,
        quick_note: trimmedNote.length > 0 ? trimmedNote : null,
        occurred_at: new Date().toISOString(),
      };

      if (existing) {
        const { error } = await supabase
          .from("daily_checkins")
          .update(payload)
          .eq("id", existing.id);
        if (error) throw new Error(error.message);
      } else {
        const { error } = await supabase.from("daily_checkins").insert({
          user_id: user.id,
          client_uuid: uuid(),
          ...payload,
        });
        if (error) throw new Error(error.message);
      }

      trackCheckinSaved({
        capture_mode: "quick",
        emotion_primary: selectedEmotion,
        has_note: trimmedNote.length > 0,
        is_edit: !!existing,
      });

      setState("saved");
    } catch (e) {
      setState("error");
      setErrorMsg(e instanceof Error ? e.message : String(e));
      submittingRef.current = false;
    }
  };

  // Wait for auth to initialize so we don't flash an error on cold start
  if (!authInitialized) {
    return (
      <Scene className="items-center justify-center">
        <ActivityIndicator color="#E97451" />
      </Scene>
    );
  }

  // ── Saved confirmation ─────────────────────────────────────────────────
  if (state === "saved") {
    const emotion = selectedEmotion
      ? EMOTIONS.find((e) => e.slug === selectedEmotion)
      : null;
    return (
      <Scene edges={["top", "bottom"]}>
        <View className="flex-1 items-center justify-center px-8">
          <FadeIn delay={0} duration={650}>
            <View className="mb-8">
              <GrapeCompanion
                emotionPrimary={selectedEmotion ?? undefined}
                size={104}
                equipped={equippedSlugs}
              />
            </View>
          </FadeIn>

          {emotion && (
            <FadeIn delay={200} duration={650}>
              <View className="mb-3 flex-row items-center">
                <View
                  className="mr-2 h-2.5 w-2.5 rounded-full"
                  style={{ backgroundColor: emotion.color }}
                />
                <Text
                  className="font-display text-xs font-bold uppercase tracking-widest"
                  style={{ color: scene.subInk }}
                >
                  {emotion.name}
                </Text>
              </View>
            </FadeIn>
          )}

          <FadeIn delay={350} duration={650}>
            <Text
              className="mb-3 text-center font-display text-4xl font-extrabold tracking-tight"
              style={{ color: scene.ink }}
            >
              saved.
            </Text>
          </FadeIn>

          <FadeIn delay={500} duration={650}>
            <Text
              className="mb-16 max-w-sm text-center font-body text-base font-semibold leading-relaxed"
              style={{ color: scene.subInk }}
            >
              nice pause. see you tomorrow.
            </Text>
          </FadeIn>

          <FadeIn delay={700} duration={500}>
            <ChunkyButton
              label="Back home"
              variant="primary"
              onPress={() => router.replace("/")}
            />
          </FadeIn>

          <FadeIn delay={850} duration={500}>
            <Pressable
              accessibilityRole="button"
              onPress={() => router.replace("/welcome")}
              className="mt-5 px-4 py-2 transition-all duration-300 hover:opacity-70"
            >
              <Text
                className="font-body text-sm font-bold underline"
                style={{ color: scene.subInk }}
              >
                Take a deeper reflection instead
              </Text>
            </Pressable>
          </FadeIn>
        </View>
      </Scene>
    );
  }

  // ── Main capture UI ────────────────────────────────────────────────────
  const canSave = state !== "saving";

  return (
    <Scene edges={["top", "bottom"]}>
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : undefined}
        className="flex-1"
      >
        {/* Top bar with back link */}
        <View className="px-6 pt-3">
          <Pressable
            onPress={() => router.replace("/")}
            className="self-start px-2 py-2 transition-all duration-300 hover:opacity-70"
          >
            <Text
              className="font-body text-sm font-bold"
              style={{ color: scene.subInk }}
            >
              ← Home
            </Text>
          </Pressable>
        </View>

        <View className="flex-1 items-center justify-center px-6">
          <FadeIn delay={0} duration={650}>
            <Text
              className="mb-3 text-center font-display text-3xl font-extrabold tracking-tight"
              style={{ color: scene.ink }}
            >
              how are you, right now?
            </Text>
          </FadeIn>

          <FadeIn delay={200} duration={650}>
            <Text
              className="mb-10 max-w-xs text-center font-body text-sm font-semibold leading-relaxed"
              style={{ color: scene.subInk }}
            >
              pick one that fits — or don't. nothing required.
            </Text>
          </FadeIn>

          {/* Emotion buttons — 2 rows of 4 (7 emotions, last cell empty) */}
          <FadeIn delay={350} duration={650}>
            <View className="mb-10 max-w-md flex-row flex-wrap items-center justify-center gap-2">
              {EMOTIONS.map((emotion) => {
                const selected = selectedEmotion === emotion.slug;
                return (
                  <Pressable
                    key={emotion.slug}
                    accessibilityRole="button"
                    accessibilityLabel={emotion.name}
                    accessibilityState={{ selected }}
                    onPress={() =>
                      setSelectedEmotion(selected ? null : emotion.slug)
                    }
                    className="h-24 w-24 items-center justify-center rounded-tile transition-all duration-300 hover:scale-[1.06] active:scale-95"
                    style={{
                      backgroundColor: emotion.color + (selected ? "FF" : "CC"),
                      borderWidth: 2,
                      borderColor: emotion.color,
                      borderBottomWidth: selected ? 3 : 6,
                      borderBottomColor: shadeHex(emotion.color),
                    }}
                  >
                    <Text className="font-display text-base font-extrabold capitalize text-white">
                      {emotion.name}
                    </Text>
                  </Pressable>
                );
              })}
            </View>
          </FadeIn>

          {/* Optional one-line note */}
          <FadeIn delay={500} duration={650}>
            <TextInput
              placeholder="anything else? (optional)"
              placeholderTextColor="#9A8B76"
              value={note}
              onChangeText={setNote}
              onSubmitEditing={handleSave}
              returnKeyType="done"
              maxLength={140}
              className="mb-8 w-72 rounded-tile px-6 py-4 text-center font-body text-base text-ink"
              style={{
                backgroundColor: "#FFFDF6",
                borderWidth: 2,
                borderColor: "#E4D6BC",
                shadowColor: "#2E2416",
                shadowOpacity: 0.06,
                shadowRadius: 12,
                shadowOffset: { width: 0, height: 3 },
              }}
            />
          </FadeIn>

          {/* Save */}
          <FadeIn delay={650} duration={500}>
            <ChunkyButton
              label="Save"
              variant="primary"
              disabled={!canSave}
              loading={state === "saving"}
              onPress={handleSave}
            />
          </FadeIn>

          {state === "error" && (
            <FadeIn delay={0} duration={400}>
              <Text
                className="mt-4 max-w-sm text-center font-body text-xs font-semibold"
                style={{ color: scene.subInk }}
              >
                {errorMsg}
              </Text>
            </FadeIn>
          )}
        </View>
      </KeyboardAvoidingView>
    </Scene>
  );
}
