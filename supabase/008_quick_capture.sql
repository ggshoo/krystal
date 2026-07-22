-- 008_quick_capture.sql
-- Enable dual-mode capture. Quick Capture writes to the same daily_checkins
-- table as Deep Reflection so the "one reflection per day" invariant, streak
-- counting, and history rendering all continue to work with a single query.
--
-- Approach: make the Deep Reflection fields nullable + add a capture_mode
-- discriminator + add Quick-Capture-specific columns.
--
-- Existing rows are all Deep Reflection (that was the only mode until now) —
-- the default 'deep' on capture_mode backfills them safely.

alter table public.daily_checkins alter column mind_score drop not null;
alter table public.daily_checkins alter column body_score drop not null;
alter table public.daily_checkins alter column heart_score drop not null;
alter table public.daily_checkins alter column emotion_id drop not null;

alter table public.daily_checkins
  add column capture_mode text not null default 'deep'
  check (capture_mode in ('quick', 'deep'));

-- Quick Capture stores the emotion at primary level only (one of the 7
-- Roberts primaries: happy, surprised, sad, bad, fearful, angry, disgusted).
-- Free-text rather than a FK because the primary catalog is tiny + static,
-- and this avoids joining an extra table on every history read.
alter table public.daily_checkins
  add column quick_emotion_primary text
  check (
    quick_emotion_primary is null or quick_emotion_primary in
      ('happy', 'surprised', 'sad', 'bad', 'fearful', 'angry', 'disgusted')
  );

-- Optional one-line note from Quick Capture. Not a "journal" — the strict
-- journal streak (north star) still requires a journal_entries row with
-- content. This is just captured context.
alter table public.daily_checkins
  add column quick_note text;

-- Index on capture_mode for the (rare) query that filters by mode.
create index if not exists daily_checkins_capture_mode_idx
  on public.daily_checkins (capture_mode);
