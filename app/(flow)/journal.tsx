import { Redirect, useRouter } from "expo-router";
import { useState } from "react";
import {
  ActivityIndicator,
  KeyboardAvoidingView,
  Platform,
  Pressable,
  ScrollView,
  Text,
  TextInput,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

import { FadeIn } from "@/components/FadeIn";
import { findPrimary, findSecondary, findTertiary } from "@/lib/emotions";
import { getPlutchikLadder } from "@/lib/plutchik";
import { getPlutchikContent } from "@/lib/plutchikContent";
import { supabase } from "@/lib/supabase";
import { useAuthStore } from "@/store/useAuthStore";
import { useReflectionStore } from "@/store/useReflectionStore";

type SaveState = "editing" | "saving" | "saved" | "error";

/**
 * Journal screen — extends a saved reflection with deeper written prompts.
 *
 * Top: overview of the just-saved reflection (scores + emotion path).
 * Middle: educational content for the Plutchik primary (boxed, read-only).
 * Bottom: 6 optional prompts the user can fill in.
 *
 * On save: inserts a row into journal_entries linked to the daily_checkins
 * row that was just created on the Done screen.
 */
export default function JournalScreen() {
  const router = useRouter();
  const draft = useReflectionStore((s) => s.draft);
  const setField = useReflectionStore((s) => s.setField);
  const reset = useReflectionStore((s) => s.reset);
  const user = useAuthStore((s) => s.user);

  const [state, setState] = useState<SaveState>("editing");
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  // Guards — we need the saved daily_checkin_id to link the journal entry
  if (!draft.daily_checkin_id) return <Redirect href="/" />;

  const primary = findPrimary(draft.emotion_primary);
  const secondary = findSecondary(draft.emotion_primary, draft.emotion_secondary);
  const tertiary = findTertiary(
    draft.emotion_primary,
    draft.emotion_secondary,
    draft.emotion_specific
  );

  // Pull educational content keyed off the SPECIFIC intensity word the user
  // picked (e.g. "grief"), not the parent Plutchik primary. Falls back to
  // the primary's content if the intensity slug doesn't have its own entry.
  const ladder =
    primary && secondary
      ? getPlutchikLadder(primary.slug, secondary.slug)
      : null;
  const content =
    getPlutchikContent(draft.plutchik_emotion) ??
    getPlutchikContent(ladder?.primary);
  // The label shown in "About X" — the specific intensity word the user
  // chose, falling back to the ladder's primary name.
  const aboutLabel = draft.plutchik_emotion ?? ladder?.primary ?? "";
  const themeColor = primary?.color ?? "#C2876B";

  const handleSave = async () => {
    if (!user) {
      setState("error");
      setErrorMsg("Not signed in.");
      return;
    }
    setState("saving");
    setErrorMsg(null);

    const { error } = await supabase.from("journal_entries").insert({
      daily_checkin_id: draft.daily_checkin_id!,
      user_id: user.id,
      reflection: draft.journal_reflection ?? null,
      why_feeling: draft.journal_why_feeling ?? null,
      body_sensations: draft.journal_body_sensations ?? null,
      what_is_hard: draft.journal_what_is_hard ?? null,
      what_is_life_giving: draft.journal_what_is_life_giving ?? null,
      what_do_you_need: draft.journal_what_do_you_need ?? null,
    });

    if (error) {
      setState("error");
      setErrorMsg(error.message);
      return;
    }

    setState("saved");
  };

  const handleReturnHome = () => {
    reset();
    router.replace("/");
  };

  // ── Saved confirmation ──────────────────────────────────────────────────
  if (state === "saved") {
    return (
      <SafeAreaView className="flex-1 bg-cream" edges={["top", "bottom"]}>
        <View className="flex-1 items-center justify-center px-8">
          <FadeIn delay={0} duration={650}>
            <Text className="mb-3 text-center text-3xl font-semibold tracking-tight text-ink">
              Journal saved.
            </Text>
          </FadeIn>
          <FadeIn delay={250} duration={650}>
            <Text className="mb-16 max-w-sm text-center text-base leading-relaxed text-muted">
              Thank you for taking the time. See you tomorrow.
            </Text>
          </FadeIn>
          <FadeIn delay={500} duration={500}>
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
        </View>
      </SafeAreaView>
    );
  }

  // ── Main journaling view ────────────────────────────────────────────────
  return (
    <SafeAreaView className="flex-1 bg-cream" edges={["top", "bottom"]}>
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : undefined}
        className="flex-1"
      >
        <ScrollView
          className="flex-1"
          contentContainerStyle={{
            paddingHorizontal: 24,
            paddingTop: 32,
            paddingBottom: 80,
          }}
          keyboardShouldPersistTaps="handled"
        >
          {/* ── Overview card ── */}
          <FadeIn delay={0}>
            <View
              className="mb-8 rounded-tile bg-surface p-5"
              style={{
                shadowColor: "#2D2520",
                shadowOpacity: 0.04,
                shadowRadius: 16,
                shadowOffset: { width: 0, height: 4 },
              }}
            >
              <Text className="mb-3 text-xs font-semibold uppercase tracking-widest text-muted">
                Today's reflection
              </Text>
              <View className="mb-3 flex-row gap-5">
                <Text className="text-sm text-ink">
                  <Text className="font-semibold">Mind</Text> {draft.mind_score}
                </Text>
                <Text className="text-sm text-ink">
                  <Text className="font-semibold">Body</Text> {draft.body_score}
                </Text>
                <Text className="text-sm text-ink">
                  <Text className="font-semibold">Heart</Text> {draft.heart_score}
                </Text>
              </View>
              <View className="flex-row items-center">
                <View
                  className="mr-2 h-2.5 w-2.5 rounded-full"
                  style={{ backgroundColor: themeColor }}
                />
                <Text className="text-sm capitalize text-muted">
                  {primary?.name} → {secondary?.name} →{" "}
                  <Text className="font-bold text-ink">{tertiary?.name}</Text>
                  {draft.plutchik_emotion && (
                    <>
                      <Text className="text-muted">; </Text>
                      <Text className="font-bold text-ink">
                        {draft.plutchik_emotion}
                      </Text>
                    </>
                  )}
                </Text>
              </View>
            </View>
          </FadeIn>

          {/* ── Educational box (about the specific intensity word) ── */}
          {/* Sits ABOVE the reflection section so users read context before writing. */}
          {content && (
            <FadeIn delay={120}>
              <View
                className="mb-8 rounded-tile p-5"
                style={{
                  backgroundColor: themeColor + "1A",
                  borderWidth: 1,
                  borderColor: themeColor + "33",
                }}
              >
                <Text className="mb-3 text-xs font-semibold uppercase tracking-widest text-muted">
                  About <Text className="text-ink">{aboutLabel}</Text>
                </Text>

                <View className="mb-3">
                  <Text className="mb-1 text-[11px] font-semibold uppercase tracking-widest text-muted">
                    Similar words
                  </Text>
                  <Text className="text-sm leading-relaxed text-ink">
                    {content.similar_words.join(", ")}
                  </Text>
                </View>

                <View className="mb-3">
                  <Text className="mb-1 text-[11px] font-semibold uppercase tracking-widest text-muted">
                    Sensations
                  </Text>
                  <Text className="text-sm leading-relaxed text-ink">
                    {content.sensations}
                  </Text>
                </View>

                <View className="mb-3">
                  <Text className="mb-1 text-[11px] font-semibold uppercase tracking-widest text-muted">
                    What does it tell you?
                  </Text>
                  <Text className="text-sm leading-relaxed text-ink">
                    {content.what_it_tells_you}
                  </Text>
                </View>

                <View>
                  <Text className="mb-1 text-[11px] font-semibold uppercase tracking-widest text-muted">
                    How does it help you?
                  </Text>
                  <Text className="text-sm leading-relaxed text-ink">
                    {content.how_it_helps_you}
                  </Text>
                </View>
              </View>
            </FadeIn>
          )}

          {/* ── Header ── */}
          <FadeIn delay={240}>
            <Text className="mb-3 text-3xl font-semibold tracking-tight text-ink">
              Reflect on it
            </Text>
          </FadeIn>
          <FadeIn delay={320}>
            <Text className="mb-8 text-base leading-relaxed text-muted">
              Write as much or as little as you'd like. Any field can be left blank.
            </Text>
          </FadeIn>

          {/* ── Prompt 1: reflection — dynamic follow-up from "What does it tell you" ── */}
          <Prompt
            delay={400}
            label="What's coming up?"
            hint={content?.reflection_prompt ?? "A sentence or two on what you're noticing."}
            value={draft.journal_reflection}
            onChange={(v) => setField("journal_reflection", v)}
          />

          {/* ── Prompt 2: why — dynamic follow-up from "How does it help you" ── */}
          <Prompt
            delay={480}
            label="Why are you feeling this way?"
            hint={content?.why_prompt ?? "What's contributing to this?"}
            value={draft.journal_why_feeling}
            onChange={(v) => setField("journal_why_feeling", v)}
          />

          {/* ── Prompt 3: body sensations (personal) ── */}
          <Prompt
            delay={560}
            label="How are you experiencing this in your body?"
            hint="Your own sensations — not the list above."
            value={draft.journal_body_sensations}
            onChange={(v) => setField("journal_body_sensations", v)}
          />

          {/* ── Three deeper prompts ── */}
          <Prompt
            delay={640}
            label="What is hard right now?"
            value={draft.journal_what_is_hard}
            onChange={(v) => setField("journal_what_is_hard", v)}
          />

          <Prompt
            delay={720}
            label="What is life-giving right now?"
            value={draft.journal_what_is_life_giving}
            onChange={(v) => setField("journal_what_is_life_giving", v)}
          />

          <Prompt
            delay={800}
            label="What do you need?"
            value={draft.journal_what_do_you_need}
            onChange={(v) => setField("journal_what_do_you_need", v)}
          />

          {/* ── Save + return ── */}
          <FadeIn delay={920}>
            <Pressable
              accessibilityRole="button"
              disabled={state === "saving"}
              onPress={handleSave}
              className="mt-4 items-center rounded-full bg-accent py-5 shadow-sm transition-all duration-300 hover:scale-[1.05] hover:shadow-2xl active:opacity-70"
            >
              {state === "saving" ? (
                <ActivityIndicator color="#FFFFFF" />
              ) : (
                <Text className="text-base font-medium tracking-wide text-white">
                  Save journal
                </Text>
              )}
            </Pressable>

            {state === "error" && (
              <Text className="mt-3 text-center text-xs text-muted">
                {errorMsg}
              </Text>
            )}

            <Pressable
              accessibilityRole="button"
              onPress={handleReturnHome}
              className="mt-3 items-center px-4 py-2"
            >
              <Text className="text-sm text-muted underline">
                Skip journal, return home
              </Text>
            </Pressable>
          </FadeIn>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

// ── Reusable prompt block ─────────────────────────────────────────────────
function Prompt({
  delay,
  label,
  hint,
  value,
  onChange,
}: {
  delay: number;
  label: string;
  hint?: string;
  value?: string;
  onChange: (v: string) => void;
}) {
  return (
    <FadeIn delay={delay}>
      <View className="mb-6">
        <Text className="mb-1 text-base font-medium text-ink">{label}</Text>
        {hint && (
          <Text className="mb-2 text-xs text-muted">{hint}</Text>
        )}
        <TextInput
          multiline
          numberOfLines={3}
          textAlignVertical="top"
          placeholder="Write here..."
          placeholderTextColor="#B8AC9B"
          value={value ?? ""}
          onChangeText={onChange}
          className="min-h-[80px] rounded-tile bg-surface px-4 py-3 text-base leading-relaxed text-ink"
          style={{
            shadowColor: "#2D2520",
            shadowOpacity: 0.03,
            shadowRadius: 8,
            shadowOffset: { width: 0, height: 2 },
          }}
        />
      </View>
    </FadeIn>
  );
}
