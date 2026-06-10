-- Krystal — add plutchik_emotion column to daily_checkins.
-- Run AFTER 006_replace_taxonomy.sql.
--
-- Stores the Plutchik intensity ladder choice the user makes after picking
-- their Roberts-wheel emotion. Values are the specific intensity word like
-- "grief", "pensiveness", "ecstasy", "rage", etc.

alter table public.daily_checkins
  add column plutchik_emotion text;
