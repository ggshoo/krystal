import { useRouter } from "expo-router";
import { useEffect, useState } from "react";
import {
  ActivityIndicator,
  Pressable,
  ScrollView,
  Text,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

import { FadeIn } from "@/components/FadeIn";
import { fetchAllEntries, formatEntryDate, HistoryEntry } from "@/lib/history";
import { useAuthStore } from "@/store/useAuthStore";

/**
 * History — list of past daily reflections.
 *
 * Tap a row to expand inline and see the journal answers (if any).
 * Today's entry sits at top.
 */
export default function HistoryScreen() {
  const router = useRouter();
  const user = useAuthStore((s) => s.user);
  const authInitialized = useAuthStore((s) => s.initialized);

  const [entries, setEntries] = useState<HistoryEntry[] | null>(null);
  const [expanded, setExpanded] = useState<string | null>(null);

  useEffect(() => {
    if (!authInitialized || !user) return;
    let cancelled = false;
    (async () => {
      const result = await fetchAllEntries(user.id);
      if (!cancelled) setEntries(result);
    })();
    return () => {
      cancelled = true;
    };
  }, [authInitialized, user]);

  return (
    <SafeAreaView className="flex-1 bg-cream" edges={["top", "bottom"]}>
      <ScrollView
        className="flex-1"
        contentContainerStyle={{
          paddingHorizontal: 24,
          paddingTop: 24,
          paddingBottom: 56,
        }}
      >
        <FadeIn delay={0}>
          <View className="mb-6 flex-row items-center justify-between">
            <Pressable
              onPress={() => router.push("/")}
              className="px-2 py-2 transition-all duration-300 hover:opacity-70"
            >
              <Text className="text-sm text-muted">← Home</Text>
            </Pressable>
          </View>
        </FadeIn>

        <FadeIn delay={80}>
          <Text className="mb-2 text-3xl font-semibold tracking-tight text-ink">
            Your history
          </Text>
        </FadeIn>
        <FadeIn delay={160}>
          <Text className="mb-10 text-base leading-relaxed text-muted">
            Each day you've checked in.
          </Text>
        </FadeIn>

        {entries === null && (
          <FadeIn delay={300}>
            <View className="items-center py-10">
              <ActivityIndicator color="#C2876B" />
              <Text className="mt-4 text-sm text-muted">
                Loading your reflections…
              </Text>
            </View>
          </FadeIn>
        )}

        {entries !== null && entries.length === 0 && (
          <FadeIn delay={300}>
            <View className="items-center py-10">
              <Text className="text-base text-muted">No reflections yet.</Text>
            </View>
          </FadeIn>
        )}

        {entries !== null &&
          entries.map((e, i) => (
            <FadeIn key={e.id} delay={240 + i * 50}>
              <EntryCard
                entry={e}
                expanded={expanded === e.id}
                onToggle={() =>
                  setExpanded((prev) => (prev === e.id ? null : e.id))
                }
              />
            </FadeIn>
          ))}
      </ScrollView>
    </SafeAreaView>
  );
}

function EntryCard({
  entry,
  expanded,
  onToggle,
}: {
  entry: HistoryEntry;
  expanded: boolean;
  onToggle: () => void;
}) {
  const themeColor = entry.emotion?.primary_color ?? "#C2876B";
  const dateLabel = formatEntryDate(entry.occurred_at);

  return (
    <Pressable
      onPress={onToggle}
      className="mb-3 rounded-tile bg-surface p-5 transition-all duration-300 hover:scale-[1.01] hover:shadow-2xl"
      style={{
        shadowColor: "#2D2520",
        shadowOpacity: 0.04,
        shadowRadius: 12,
        shadowOffset: { width: 0, height: 2 },
      }}
    >
      {/* Date + scores row */}
      <View className="mb-3 flex-row items-center justify-between">
        <Text className="text-xs font-semibold uppercase tracking-widest text-muted">
          {dateLabel}
        </Text>
        <View className="flex-row gap-4">
          <Text className="text-xs text-muted">
            <Text className="font-semibold text-ink">Mind</Text>{" "}
            {entry.mind_score}
          </Text>
          <Text className="text-xs text-muted">
            <Text className="font-semibold text-ink">Body</Text>{" "}
            {entry.body_score}
          </Text>
          <Text className="text-xs text-muted">
            <Text className="font-semibold text-ink">Heart</Text>{" "}
            {entry.heart_score}
          </Text>
        </View>
      </View>

      {/* Emotion path */}
      {entry.emotion && (
        <View className="flex-row items-center">
          <View
            className="mr-2 h-2.5 w-2.5 rounded-full"
            style={{ backgroundColor: themeColor }}
          />
          <Text className="text-sm capitalize text-muted">
            {entry.emotion.primary_name} → {entry.emotion.secondary_name} →{" "}
            <Text className="font-bold text-ink">
              {entry.emotion.specific_name}
            </Text>
            {entry.plutchik_emotion && (
              <>
                <Text className="text-muted">; </Text>
                <Text className="font-bold text-ink">
                  {entry.plutchik_emotion}
                </Text>
              </>
            )}
          </Text>
        </View>
      )}

      {/* Expanded journal */}
      {expanded && entry.journal && (
        <View className="mt-5 border-t border-ink/10 pt-4">
          <JournalRow label="What's coming up?" value={entry.journal.reflection} />
          <JournalRow
            label="Why are you feeling this way?"
            value={entry.journal.why_feeling}
          />
          <JournalRow
            label="How are you experiencing this in your body?"
            value={entry.journal.body_sensations}
          />
          <JournalRow
            label="What is hard right now?"
            value={entry.journal.what_is_hard}
          />
          <JournalRow
            label="What is life-giving right now?"
            value={entry.journal.what_is_life_giving}
          />
          <JournalRow
            label="What do you need?"
            value={entry.journal.what_do_you_need}
          />
        </View>
      )}

      {expanded && !entry.journal && (
        <View className="mt-5 border-t border-ink/10 pt-4">
          <Text className="text-sm italic text-muted">
            No journal entry for this day.
          </Text>
        </View>
      )}
    </Pressable>
  );
}

function JournalRow({
  label,
  value,
}: {
  label: string;
  value: string | null;
}) {
  if (!value) return null;
  return (
    <View className="mb-3">
      <Text className="mb-1 text-[11px] font-semibold uppercase tracking-widest text-muted">
        {label}
      </Text>
      <Text className="text-sm leading-relaxed text-ink">{value}</Text>
    </View>
  );
}
