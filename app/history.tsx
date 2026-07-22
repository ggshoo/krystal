import { useRouter } from "expo-router";
import { useEffect, useState } from "react";
import {
  ActivityIndicator,
  Pressable,
  ScrollView,
  Text,
  View,
} from "react-native";

import { FadeIn } from "@/components/FadeIn";
import { Scene } from "@/components/Scene";
import { shadeHex, tintOnWhite } from "@/lib/color";
import { findPrimary } from "@/lib/emotions";
import { fetchAllEntries, formatEntryDate, HistoryEntry } from "@/lib/history";
import { currentScene, Scene as SceneData } from "@/lib/scene";
import { useAuthStore } from "@/store/useAuthStore";

/** The mood color for an entry (deep uses its emotion color; quick maps its
 *  primary; "just checking in" quicks have no color). */
function entryColor(entry: HistoryEntry): string | null {
  if (entry.emotion?.primary_color) return entry.emotion.primary_color;
  if (entry.quick_emotion_primary) {
    return findPrimary(entry.quick_emotion_primary)?.color ?? null;
  }
  return null;
}

const dayKey = (d: Date) => `${d.getFullYear()}-${d.getMonth()}-${d.getDate()}`;

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
  const scene = currentScene();

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
    <Scene edges={["top", "bottom"]}>
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
              <Text
                className="font-body text-sm font-bold"
                style={{ color: scene.subInk }}
              >
                ← Home
              </Text>
            </Pressable>
          </View>
        </FadeIn>

        <FadeIn delay={80}>
          <Text
            className="mb-2 font-display text-4xl font-extrabold tracking-tight"
            style={{ color: scene.ink }}
          >
            Your journey so far
          </Text>
        </FadeIn>
        <FadeIn delay={160}>
          <Text
            className="mb-6 font-body text-base font-semibold leading-relaxed"
            style={{ color: scene.subInk }}
          >
            Every day you've checked in.
          </Text>
        </FadeIn>

        {entries !== null && entries.length > 0 && (
          <FadeIn delay={220}>
            <MoodGrid entries={entries} scene={scene} />
          </FadeIn>
        )}

        {entries === null && (
          <FadeIn delay={300}>
            <View className="items-center py-10">
              <ActivityIndicator color="#E97451" />
              <Text
                className="mt-4 font-body text-sm font-semibold"
                style={{ color: scene.subInk }}
              >
                Loading your reflections…
              </Text>
            </View>
          </FadeIn>
        )}

        {entries !== null && entries.length === 0 && (
          <FadeIn delay={300}>
            <View className="items-center py-10">
              <Text
                className="font-body text-base font-semibold"
                style={{ color: scene.subInk }}
              >
                No reflections yet.
              </Text>
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
    </Scene>
  );
}

// ── Mood calendar ─────────────────────────────────────────────────────────
// A GitHub-contributions-style grid of the last few weeks. Each square is a
// day, filled with that day's mood color — so the user sees their emotional
// weather at a glance and, implicitly, how consistently they've shown up.
function MoodGrid({
  entries,
  scene,
}: {
  entries: HistoryEntry[];
  scene: SceneData;
}) {
  const WEEKS = 5;
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const todayK = dayKey(today);

  // One daily_checkin per day, so last-write-wins is fine here.
  const colorByDay = new Map<string, string | null>();
  for (const e of entries) {
    const d = new Date(e.occurred_at);
    d.setHours(0, 0, 0, 0);
    colorByDay.set(dayKey(d), entryColor(e));
  }

  // Align to whole weeks (Sunday start), ending with the current week.
  const thisWeekSun = new Date(today);
  thisWeekSun.setDate(today.getDate() - today.getDay());
  const start = new Date(thisWeekSun);
  start.setDate(thisWeekSun.getDate() - (WEEKS - 1) * 7);

  const weekdays = ["S", "M", "T", "W", "T", "F", "S"];

  return (
    <View className="mb-8">
      <View className="mb-1 flex-row">
        {weekdays.map((w, i) => (
          <View key={i} className="flex-1 items-center">
            <Text
              className="font-body text-[10px] font-bold"
              style={{ color: scene.subInk }}
            >
              {w}
            </Text>
          </View>
        ))}
      </View>

      {Array.from({ length: WEEKS }, (_, w) => (
        <View key={w} className="flex-row">
          {Array.from({ length: 7 }, (_, d) => {
            const cur = new Date(start);
            cur.setDate(start.getDate() + w * 7 + d);
            const k = dayKey(cur);
            const isFuture = cur.getTime() > today.getTime();
            const has = colorByDay.has(k);
            const color = has ? colorByDay.get(k) : null;
            const isToday = k === todayK;

            // Fill: mood color if any; "showed up, no mood" = solid white;
            // missed day = faint white; future = invisible placeholder.
            const fill = isFuture
              ? "transparent"
              : color
                ? color
                : has
                  ? "rgba(255,255,255,0.72)"
                  : "rgba(255,255,255,0.22)";
            const border = isToday
              ? scene.ink
              : color
                ? shadeHex(color, 28)
                : "rgba(255,255,255,0.4)";

            return (
              <View key={k} className="flex-1 p-0.5">
                <View
                  style={{
                    aspectRatio: 1,
                    borderRadius: 7,
                    backgroundColor: fill,
                    borderWidth: isToday ? 2 : 1,
                    borderColor: border,
                    opacity: isFuture ? 0 : 1,
                  }}
                />
              </View>
            );
          })}
        </View>
      ))}

      <Text
        className="mt-2 font-body text-[11px] font-semibold"
        style={{ color: scene.subInk }}
      >
        Last {WEEKS} weeks · each square is a day's mood
      </Text>
    </View>
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
  const isQuick = entry.capture_mode === "quick";
  const quickEmotion = isQuick
    ? findPrimary(entry.quick_emotion_primary ?? undefined)
    : undefined;
  // The actual mood color (null for a "just checking in" quick with no
  // emotion). Drives the color-forward card tint.
  const moodColor =
    entry.emotion?.primary_color ?? quickEmotion?.color ?? null;
  const themeColor = moodColor ?? "#E97451";
  const cardBg = moodColor ? tintOnWhite(moodColor, 0.2) : "#FFFDF6";
  const cardBorder = moodColor ? moodColor + "66" : "#EFE3CC";
  const dateLabel = formatEntryDate(entry.occurred_at);

  return (
    <Pressable
      onPress={onToggle}
      className="mb-3 rounded-tile p-5 transition-all duration-300 hover:scale-[1.01] hover:shadow-2xl"
      style={{
        backgroundColor: cardBg,
        borderWidth: 1,
        borderColor: cardBorder,
        shadowColor: "#2D2520",
        shadowOpacity: 0.06,
        shadowRadius: 12,
        shadowOffset: { width: 0, height: 2 },
      }}
    >
      {/* Date + mode/scores row */}
      <View className="mb-3 flex-row items-center justify-between">
        <View className="flex-row items-center gap-2">
          <Text className="text-xs font-semibold uppercase tracking-widest text-muted dark:text-muted-dark">
            {dateLabel}
          </Text>
          {isQuick && (
            <View className="rounded-chip bg-accent/15 px-2 py-0.5">
              <Text className="text-[10px] font-semibold uppercase tracking-widest text-accent dark:text-accent-dark">
                Quick
              </Text>
            </View>
          )}
        </View>

        {/* Mind/Body/Heart only render for Deep Reflections. Quick Captures
            don't collect these fields (they're null in the row). */}
        {!isQuick && (
          <View className="flex-row gap-4">
            <Text className="text-xs text-muted dark:text-muted-dark">
              <Text className="font-semibold text-ink dark:text-ink-dark">Mind</Text>{" "}
              {entry.mind_score ?? "—"}
            </Text>
            <Text className="text-xs text-muted dark:text-muted-dark">
              <Text className="font-semibold text-ink dark:text-ink-dark">Body</Text>{" "}
              {entry.body_score ?? "—"}
            </Text>
            <Text className="text-xs text-muted dark:text-muted-dark">
              <Text className="font-semibold text-ink dark:text-ink-dark">Heart</Text>{" "}
              {entry.heart_score ?? "—"}
            </Text>
          </View>
        )}
      </View>

      {/* Emotion path — Deep vs Quick shape differently. */}
      {entry.emotion && (
        <View className="flex-row items-center">
          <View
            className="mr-2 h-2.5 w-2.5 rounded-full"
            style={{ backgroundColor: themeColor }}
          />
          <Text className="text-sm capitalize text-muted dark:text-muted-dark">
            {entry.emotion.primary_name} → {entry.emotion.secondary_name} →{" "}
            <Text className="font-bold text-ink dark:text-ink-dark">
              {entry.emotion.specific_name}
            </Text>
            {entry.plutchik_emotion && (
              <>
                <Text className="text-muted dark:text-muted-dark">; </Text>
                <Text className="font-bold text-ink dark:text-ink-dark">
                  {entry.plutchik_emotion}
                </Text>
              </>
            )}
          </Text>
        </View>
      )}

      {isQuick && quickEmotion && (
        <View className="flex-row items-center">
          <View
            className="mr-2 h-2.5 w-2.5 rounded-full"
            style={{ backgroundColor: quickEmotion.color }}
          />
          <Text className="text-sm capitalize text-ink dark:text-ink-dark font-medium">
            {quickEmotion.name}
          </Text>
        </View>
      )}

      {isQuick && !quickEmotion && (
        <Text className="text-sm italic text-muted dark:text-muted-dark">
          just checking in
        </Text>
      )}

      {isQuick && entry.quick_note && (
        <Text className="mt-2 text-sm leading-relaxed text-ink dark:text-ink-dark">
          "{entry.quick_note}"
        </Text>
      )}

      {/* Expanded journal */}
      {expanded && entry.journal && (
        <View className="mt-5 border-t border-ink/10 dark:border-ink-dark/15 pt-4">
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
            label="What can you do, in your control, to provide what you need right now?"
            value={entry.journal.what_do_you_need}
          />
        </View>
      )}

      {expanded && !entry.journal && (
        <View className="mt-5 border-t border-ink/10 dark:border-ink-dark/15 pt-4">
          <Text className="text-sm italic text-muted dark:text-muted-dark">
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
      <Text className="mb-1 text-[11px] font-semibold uppercase tracking-widest text-muted dark:text-muted-dark">
        {label}
      </Text>
      <Text className="text-sm leading-relaxed text-ink dark:text-ink-dark">{value}</Text>
    </View>
  );
}
