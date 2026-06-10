import { supabase } from "@/lib/supabase";

/**
 * Krystal — history queries.
 *
 * One daily_checkin per user per day. Journal entries are optional (1:1 with
 * a daily_checkin when present). History gating: history list is only
 * surfaced on Home once today's daily_checkin exists.
 */

export type HistoryEntry = {
  id: string;
  occurred_at: string;
  mind_score: number;
  body_score: number;
  heart_score: number;
  plutchik_emotion: string | null;
  emotion: {
    primary_name: string;
    primary_color: string;
    secondary_name: string;
    specific_name: string;
  } | null;
  journal: {
    reflection: string | null;
    why_feeling: string | null;
    body_sensations: string | null;
    what_is_hard: string | null;
    what_is_life_giving: string | null;
    what_do_you_need: string | null;
  } | null;
};

/** Start of the current day in local time, as ISO. */
function todayStartIso(): string {
  const d = new Date();
  d.setHours(0, 0, 0, 0);
  return d.toISOString();
}

/**
 * Returns today's daily_checkin row for the user (if any), with journal
 * entry data attached.
 */
export async function fetchTodaysEntry(
  userId: string
): Promise<HistoryEntry | null> {
  const { data, error } = await supabase
    .from("daily_checkins")
    .select(
      `
      id,
      occurred_at,
      mind_score,
      body_score,
      heart_score,
      plutchik_emotion,
      emotion_details!inner (
        name,
        emotion_subcategories!inner (
          name,
          emotion_categories!inner (name, color)
        )
      ),
      journal_entries (
        reflection,
        why_feeling,
        body_sensations,
        what_is_hard,
        what_is_life_giving,
        what_do_you_need
      )
      `
    )
    .eq("user_id", userId)
    .gte("occurred_at", todayStartIso())
    .order("occurred_at", { ascending: false })
    .limit(1)
    .maybeSingle();

  if (error || !data) return null;
  return shapeRow(data);
}

/**
 * Returns all daily_checkin rows for the user, newest first.
 */
export async function fetchAllEntries(userId: string): Promise<HistoryEntry[]> {
  const { data, error } = await supabase
    .from("daily_checkins")
    .select(
      `
      id,
      occurred_at,
      mind_score,
      body_score,
      heart_score,
      plutchik_emotion,
      emotion_details!inner (
        name,
        emotion_subcategories!inner (
          name,
          emotion_categories!inner (name, color)
        )
      ),
      journal_entries (
        reflection,
        why_feeling,
        body_sensations,
        what_is_hard,
        what_is_life_giving,
        what_do_you_need
      )
      `
    )
    .eq("user_id", userId)
    .order("occurred_at", { ascending: false });

  if (error || !data) return [];
  return data.map(shapeRow);
}

// Supabase's nested-select TS shapes are awkward; coerce here so callers get
// a flat HistoryEntry. The actual shape matches the select string above.
function shapeRow(row: any): HistoryEntry {
  const ed = row.emotion_details;
  const sub = ed?.emotion_subcategories;
  const cat = sub?.emotion_categories;
  // PostgREST returns nested rows as arrays for has-many, singletons for has-one.
  // emotion_details / subcategories / categories are has-one chains here.
  const journalArray = Array.isArray(row.journal_entries)
    ? row.journal_entries
    : row.journal_entries
      ? [row.journal_entries]
      : [];
  const journal = journalArray[0] ?? null;

  return {
    id: row.id,
    occurred_at: row.occurred_at,
    mind_score: row.mind_score,
    body_score: row.body_score,
    heart_score: row.heart_score,
    plutchik_emotion: row.plutchik_emotion ?? null,
    emotion:
      ed && sub && cat
        ? {
            primary_name: cat.name,
            primary_color: cat.color,
            secondary_name: sub.name,
            specific_name: ed.name,
          }
        : null,
    journal: journal
      ? {
          reflection: journal.reflection ?? null,
          why_feeling: journal.why_feeling ?? null,
          body_sensations: journal.body_sensations ?? null,
          what_is_hard: journal.what_is_hard ?? null,
          what_is_life_giving: journal.what_is_life_giving ?? null,
          what_do_you_need: journal.what_do_you_need ?? null,
        }
      : null,
  };
}

/**
 * Counts consecutive days (including today) with at least one daily_checkin.
 * Stops at the first gap. Returns 0 if today has no entry yet.
 */
export function computeStreak(entries: HistoryEntry[]): number {
  if (entries.length === 0) return 0;

  // Local-day strings for fast set lookup
  const dayKey = (d: Date) =>
    `${d.getFullYear()}-${d.getMonth()}-${d.getDate()}`;

  const days = new Set(entries.map((e) => dayKey(new Date(e.occurred_at))));

  let count = 0;
  const cursor = new Date();
  cursor.setHours(0, 0, 0, 0);

  while (days.has(dayKey(cursor))) {
    count++;
    cursor.setDate(cursor.getDate() - 1);
  }

  return count;
}

/** Friendly date label like "Today", "Yesterday", or "Mon, Jun 9". */
export function formatEntryDate(iso: string): string {
  const d = new Date(iso);
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const yesterday = new Date(today);
  yesterday.setDate(yesterday.getDate() - 1);
  const dDay = new Date(d);
  dDay.setHours(0, 0, 0, 0);

  if (dDay.getTime() === today.getTime()) return "Today";
  if (dDay.getTime() === yesterday.getTime()) return "Yesterday";
  return d.toLocaleDateString("en-US", {
    weekday: "short",
    month: "short",
    day: "numeric",
  });
}
