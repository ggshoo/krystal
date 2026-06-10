-- Krystal — replace Plutchik taxonomy with Geoffrey Roberts emotion wheel.
-- Run AFTER 005_seed_plutchik_minimal.sql.
--
-- This is a DESTRUCTIVE migration. It deletes:
--   - all journal_entries
--   - all daily_checkins
--   - all emotion_details / emotion_subcategories / emotion_categories
-- Then reseeds with the 7-primary Geoffrey Roberts wheel:
--   Happy, Surprised, Bad, Fearful, Angry, Disgusted, Sad.
-- 7 primaries × variable secondaries × 2 tertiaries = ~80 specific emotions.
--
-- Why destructive: emotion_id FKs on daily_checkins reference rows we're
-- replacing, and slugs differ from the old Plutchik names, so old check-ins
-- couldn't be migrated cleanly. Since this is dev data only, we nuke.

begin;

-- ─── Wipe reflection + taxonomy data ─────────────────────────────────────────
delete from public.journal_entries;
delete from public.daily_checkins;
delete from public.emotion_details;
delete from public.emotion_subcategories;
delete from public.emotion_categories;

-- ─── Level 1: 7 primaries ────────────────────────────────────────────────────
insert into public.emotion_categories (name, color, sort_order) values
  ('happy',     '#F5D547', 1),
  ('surprised', '#B19CD9', 2),
  ('bad',       '#88B894', 3),
  ('fearful',   '#F0B58D', 4),
  ('angry',     '#E27B7B', 5),
  ('disgusted', '#A8A8A8', 6),
  ('sad',       '#7A9BC7', 7);

-- ─── Level 2: Secondary clusters ─────────────────────────────────────────────
with subs(primary_name, name, sort_order) as (values
  -- Happy (9 secondaries)
  ('happy', 'playful', 1),
  ('happy', 'content', 2),
  ('happy', 'interested', 3),
  ('happy', 'proud', 4),
  ('happy', 'accepted', 5),
  ('happy', 'powerful', 6),
  ('happy', 'peaceful', 7),
  ('happy', 'trusting', 8),
  ('happy', 'optimistic', 9),
  -- Surprised (4 secondaries)
  ('surprised', 'excited', 1),
  ('surprised', 'amazed', 2),
  ('surprised', 'confused', 3),
  ('surprised', 'startled', 4),
  -- Bad (4 secondaries)
  ('bad', 'bored', 1),
  ('bad', 'busy', 2),
  ('bad', 'stressed', 3),
  ('bad', 'tired', 4),
  -- Fearful (6 secondaries)
  ('fearful', 'scared', 1),
  ('fearful', 'anxious', 2),
  ('fearful', 'insecure', 3),
  ('fearful', 'weak', 4),
  ('fearful', 'rejected', 5),
  ('fearful', 'threatened', 6),
  -- Angry (8 secondaries)
  ('angry', 'let down', 1),
  ('angry', 'humiliated', 2),
  ('angry', 'bitter', 3),
  ('angry', 'mad', 4),
  ('angry', 'aggressive', 5),
  ('angry', 'frustrated', 6),
  ('angry', 'distant', 7),
  ('angry', 'critical', 8),
  -- Disgusted (4 secondaries)
  ('disgusted', 'disapproving', 1),
  ('disgusted', 'disappointed', 2),
  ('disgusted', 'awful', 3),
  ('disgusted', 'repelled', 4),
  -- Sad (6 secondaries)
  ('sad', 'hurt', 1),
  ('sad', 'depressed', 2),
  ('sad', 'guilty', 3),
  ('sad', 'despair', 4),
  ('sad', 'vulnerable', 5),
  ('sad', 'lonely', 6)
)
insert into public.emotion_subcategories (category_id, name, sort_order)
select c.id, subs.name, subs.sort_order
from subs
join public.emotion_categories c on c.name = subs.primary_name;

-- ─── Level 3: Tertiary specific emotions ─────────────────────────────────────
with tertiaries(primary_name, secondary_name, name, sort_order) as (values
  -- Happy
  ('happy', 'playful', 'aroused', 1),
  ('happy', 'playful', 'cheeky', 2),
  ('happy', 'content', 'free', 1),
  ('happy', 'content', 'joyful', 2),
  ('happy', 'interested', 'curious', 1),
  ('happy', 'interested', 'inquisitive', 2),
  ('happy', 'proud', 'successful', 1),
  ('happy', 'proud', 'confident', 2),
  ('happy', 'accepted', 'respected', 1),
  ('happy', 'accepted', 'valued', 2),
  ('happy', 'powerful', 'courageous', 1),
  ('happy', 'powerful', 'creative', 2),
  ('happy', 'peaceful', 'loving', 1),
  ('happy', 'peaceful', 'thankful', 2),
  ('happy', 'trusting', 'sensitive', 1),
  ('happy', 'trusting', 'intimate', 2),
  ('happy', 'optimistic', 'hopeful', 1),
  ('happy', 'optimistic', 'inspired', 2),

  -- Surprised
  ('surprised', 'excited', 'energetic', 1),
  ('surprised', 'excited', 'eager', 2),
  ('surprised', 'amazed', 'awe', 1),
  ('surprised', 'amazed', 'astonished', 2),
  ('surprised', 'confused', 'perplexed', 1),
  ('surprised', 'confused', 'disillusioned', 2),
  ('surprised', 'startled', 'dismayed', 1),
  ('surprised', 'startled', 'shocked', 2),

  -- Bad
  ('bad', 'bored', 'indifferent', 1),
  ('bad', 'bored', 'apathetic', 2),
  ('bad', 'busy', 'pressured', 1),
  ('bad', 'busy', 'rushed', 2),
  ('bad', 'stressed', 'overwhelmed', 1),
  ('bad', 'stressed', 'out of control', 2),
  ('bad', 'tired', 'sleepy', 1),
  ('bad', 'tired', 'unfocused', 2),

  -- Fearful
  ('fearful', 'scared', 'helpless', 1),
  ('fearful', 'scared', 'frightened', 2),
  ('fearful', 'anxious', 'overwhelmed', 1),
  ('fearful', 'anxious', 'worried', 2),
  ('fearful', 'insecure', 'inadequate', 1),
  ('fearful', 'insecure', 'inferior', 2),
  ('fearful', 'weak', 'worthless', 1),
  ('fearful', 'weak', 'insignificant', 2),
  ('fearful', 'rejected', 'excluded', 1),
  ('fearful', 'rejected', 'persecuted', 2),
  ('fearful', 'threatened', 'nervous', 1),
  ('fearful', 'threatened', 'exposed', 2),

  -- Angry
  ('angry', 'let down', 'betrayed', 1),
  ('angry', 'let down', 'resentful', 2),
  ('angry', 'humiliated', 'disrespected', 1),
  ('angry', 'humiliated', 'ridiculed', 2),
  ('angry', 'bitter', 'indignant', 1),
  ('angry', 'bitter', 'violated', 2),
  ('angry', 'mad', 'furious', 1),
  ('angry', 'mad', 'jealous', 2),
  ('angry', 'aggressive', 'provoked', 1),
  ('angry', 'aggressive', 'hostile', 2),
  ('angry', 'frustrated', 'infuriated', 1),
  ('angry', 'frustrated', 'annoyed', 2),
  ('angry', 'distant', 'withdrawn', 1),
  ('angry', 'distant', 'numb', 2),
  ('angry', 'critical', 'sceptical', 1),
  ('angry', 'critical', 'dismissive', 2),

  -- Disgusted
  ('disgusted', 'disapproving', 'judgmental', 1),
  ('disgusted', 'disapproving', 'embarrassed', 2),
  ('disgusted', 'disappointed', 'appalled', 1),
  ('disgusted', 'disappointed', 'revolted', 2),
  ('disgusted', 'awful', 'nauseated', 1),
  ('disgusted', 'awful', 'detestable', 2),
  ('disgusted', 'repelled', 'horrified', 1),
  ('disgusted', 'repelled', 'hesitant', 2),

  -- Sad
  ('sad', 'hurt', 'embarrassed', 1),
  ('sad', 'hurt', 'disappointed', 2),
  ('sad', 'depressed', 'inferior', 1),
  ('sad', 'depressed', 'empty', 2),
  ('sad', 'guilty', 'remorseful', 1),
  ('sad', 'guilty', 'ashamed', 2),
  ('sad', 'despair', 'powerless', 1),
  ('sad', 'despair', 'grief', 2),
  ('sad', 'vulnerable', 'fragile', 1),
  ('sad', 'vulnerable', 'victimised', 2),
  ('sad', 'lonely', 'isolated', 1),
  ('sad', 'lonely', 'abandoned', 2)
)
insert into public.emotion_details (subcategory_id, name, framework, sort_order)
select s.id, t.name, 'roberts', t.sort_order
from tertiaries t
join public.emotion_categories c on c.name = t.primary_name
join public.emotion_subcategories s on s.category_id = c.id and s.name = t.secondary_name;

commit;

-- ─── Verify (run separately) ─────────────────────────────────────────────────
-- Expect 7 / 41 / 82:
--   select count(*) from public.emotion_categories;     -- 7
--   select count(*) from public.emotion_subcategories;  -- 41
--   select count(*) from public.emotion_details;        -- 82
