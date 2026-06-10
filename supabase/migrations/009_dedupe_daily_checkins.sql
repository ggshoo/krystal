-- Krystal — clean up duplicate daily_checkins.
-- Run AFTER 008_journal_fields.sql.
--
-- Keeps only the most recent daily_checkin row per (user_id, day-of-occurred_at)
-- and deletes the rest. Cascading FK on journal_entries means any orphaned
-- journals get deleted automatically.

with ranked as (
  select
    id,
    row_number() over (
      partition by user_id, date(occurred_at)
      order by occurred_at desc
    ) as rn
  from public.daily_checkins
)
delete from public.daily_checkins
where id in (select id from ranked where rn > 1);

-- ─── Verify (run separately) ─────────────────────────────────────────────────
-- Each (user_id, day) should have exactly one row:
--   select user_id, date(occurred_at), count(*)
--   from public.daily_checkins
--   group by user_id, date(occurred_at)
--   having count(*) > 1;
-- Empty result = clean.
