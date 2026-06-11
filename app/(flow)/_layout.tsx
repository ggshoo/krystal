import { Stack, usePathname } from "expo-router";
import { View } from "react-native";

import { GrapeCompanion } from "@/components/GrapeCompanion";
import { useReflectionStore } from "@/store/useReflectionStore";

/**
 * Stack layout for the daily reflection flow.
 * Each screen pushes onto this stack: check-in → emotion/* → done/journal.
 *
 * A small grape sits in the top-right corner of every flow screen,
 * persisting across transitions. It progressively mirrors the user's
 * emotion as they move through the flow (default → primary emotion tint
 * once picked → intensity-aware face once intensity picked).
 *
 * Exception: Done and Journal screens already show a larger, prominent
 * grape inline with their content, so the corner one hides there to
 * avoid visual redundancy.
 */
export default function FlowLayout() {
  const pathname = usePathname();
  const draft = useReflectionStore((s) => s.draft);

  // Hide corner grape on screens that already show a larger inline grape
  const hideCornerGrape =
    pathname?.endsWith("/done") || pathname?.endsWith("/journal");

  return (
    <View className="flex-1">
      <Stack
        screenOptions={{
          headerShown: false,
          contentStyle: { backgroundColor: "#F7F0E5" },
          animation: "fade",
          animationDuration: 700,
        }}
      />

      {!hideCornerGrape && (
        <View
          className="absolute right-5 top-6 z-20"
          pointerEvents="none"
        >
          <GrapeCompanion
            emotionPrimary={draft.emotion_primary}
            plutchikEmotion={draft.plutchik_emotion}
            size={52}
          />
        </View>
      )}
    </View>
  );
}
