-- Krystal — simplify daily_checkins to a single emotion FK
-- Run AFTER 003_seed_smoke.sql.
--
-- Replaces three FKs (primary/secondary/specific) with one FK to emotion_details.
-- Primary and secondary are derived via JOIN through the emotion hierarchy.
-- No data loss — copies emotion_specific_id forward before dropping.

begin;

-- Add the new column (nullable at first so the copy can happen)
alter table public.daily_checkins
  add column emotion_id uuid references public.emotion_details(id) on delete restrict;

-- Copy data forward (no-op on a fresh DB; matters if any test rows exist)
update public.daily_checkins
  set emotion_id = emotion_specific_id
  where emotion_specific_id is not null;

-- Lock in NOT NULL now that the data is there
alter table public.daily_checkins
  alter column emotion_id set not null;

-- Drop the old three-FK indexes and columns
drop index if exists daily_checkins_user_primary_idx;
alter table public.daily_checkins
  drop column emotion_primary_id,
  drop column emotion_secondary_id,
  drop column emotion_specific_id;

-- Add an index that matches the new query pattern
create index daily_checkins_user_emotion_idx
  on public.daily_checkins(user_id, emotion_id);

commit;

-- ─── Sanity query (run separately to confirm) ────────────────────────────────
-- A reflection should now resolve full hierarchy via a single JOIN chain:
--
--   select c.name as primary,
--          s.name as secondary,
--          d.name as specific
--     from public.daily_checkins dc
--     join public.emotion_details d on dc.emotion_id = d.id
--     join public.emotion_subcategories s on d.subcategory_id = s.id
--     join public.emotion_categories c on s.category_id = c.id;
