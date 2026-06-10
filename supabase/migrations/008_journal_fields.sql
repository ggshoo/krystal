-- Krystal — extend journal_entries with the new prompt fields.
-- Run AFTER 007_add_plutchik_emotion.sql.
--
-- The new Journal screen surfaces six write prompts. Adding columns for
-- each. Older columns (sensation, meaning, helpfulness) from the original
-- PRD never got used and are left in place — harmless to keep, optional to
-- drop later.

alter table public.journal_entries
  add column if not exists reflection text,            -- "What's coming up?"
  add column if not exists why_feeling text,           -- "Why are you feeling this way?"
  add column if not exists body_sensations text,       -- "How are you experiencing this in your body?"
  add column if not exists what_is_hard text,          -- "What is hard right now?"
  add column if not exists what_is_life_giving text,   -- "What is life-giving right now?"
  add column if not exists what_do_you_need text;      -- "What do you need?"
