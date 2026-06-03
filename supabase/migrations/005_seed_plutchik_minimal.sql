-- Krystal — minimal Plutchik taxonomy (names only)
-- Run AFTER 004_simplify_checkin_emotion.sql.
--
-- 8 primaries × 3 secondaries × 3 tertiaries = 72 specific emotions.
-- Names only — Atlas-mapped content (similar_words, sensations,
-- what_it_tells_you, how_it_helps_you) gets backfilled when the Reflect
-- screen lands in v0.2.
--
-- Also adds sort_order to emotion_details so the picker can list tertiaries
-- in a deliberate order (least-to-most intense within each secondary).

begin;

-- ─── Schema tweak: sort_order on emotion_details ─────────────────────────────
alter table public.emotion_details
  add column if not exists sort_order smallint not null default 0;

-- ─── Level 1: Plutchik primaries (8) ─────────────────────────────────────────
insert into public.emotion_categories (name, color, sort_order) values
  ('joy',          '#E8C547', 1),
  ('trust',        '#6FAE8E', 2),
  ('fear',         '#8E6FB5', 3),
  ('surprise',     '#6FB5AE', 4),
  ('sadness',      '#5B7CC4', 5),
  ('disgust',      '#A48069', 6),
  ('anger',        '#C45B5B', 7),
  ('anticipation', '#D9985A', 8)
on conflict (name) do nothing;

-- ─── Level 2: Secondary clusters (3 per primary, 24 total) ───────────────────
-- sort_order = intensity: 1 (low) → 2 (mid) → 3 (high)
with subs(primary_name, name, sort_order) as (values
  ('joy',          'serenity',     1),
  ('joy',          'joy',          2),
  ('joy',          'ecstasy',      3),
  ('trust',        'acceptance',   1),
  ('trust',        'trust',        2),
  ('trust',        'admiration',   3),
  ('fear',         'apprehension', 1),
  ('fear',         'anxiety',      2),
  ('fear',         'terror',       3),
  ('surprise',     'distraction',  1),
  ('surprise',     'surprise',     2),
  ('surprise',     'amazement',    3),
  ('sadness',      'pensiveness',  1),
  ('sadness',      'sadness',      2),
  ('sadness',      'grief',        3),
  ('disgust',      'boredom',      1),
  ('disgust',      'disgust',      2),
  ('disgust',      'loathing',     3),
  ('anger',        'annoyance',    1),
  ('anger',        'anger',        2),
  ('anger',        'rage',         3),
  ('anticipation', 'interest',     1),
  ('anticipation', 'anticipation', 2),
  ('anticipation', 'vigilance',    3)
)
insert into public.emotion_subcategories (category_id, name, sort_order)
select c.id, subs.name, subs.sort_order
from subs
join public.emotion_categories c on c.name = subs.primary_name
on conflict (category_id, name) do nothing;

-- ─── Level 3: Tertiary specific emotions (3 per secondary, 72 total) ─────────
-- sort_order = relative intensity within the secondary cluster
with tertiaries(primary_name, secondary_name, name, sort_order) as (values
  -- Joy
  ('joy',          'serenity',     'content',          1),
  ('joy',          'serenity',     'peaceful',         2),
  ('joy',          'serenity',     'at ease',          3),
  ('joy',          'joy',          'happy',            1),
  ('joy',          'joy',          'delighted',        2),
  ('joy',          'joy',          'grateful',         3),
  ('joy',          'ecstasy',      'elated',           1),
  ('joy',          'ecstasy',      'overjoyed',        2),
  ('joy',          'ecstasy',      'euphoric',         3),

  -- Trust
  ('trust',        'acceptance',   'safe',             1),
  ('trust',        'acceptance',   'open',             2),
  ('trust',        'acceptance',   'accepting',        3),
  ('trust',        'trust',        'connected',        1),
  ('trust',        'trust',        'secure',           2),
  ('trust',        'trust',        'supported',        3),
  ('trust',        'admiration',   'inspired',         1),
  ('trust',        'admiration',   'reverent',         2),
  ('trust',        'admiration',   'awed',             3),

  -- Fear
  ('fear',         'apprehension', 'cautious',         1),
  ('fear',         'apprehension', 'uneasy',           2),
  ('fear',         'apprehension', 'worried',          3),
  ('fear',         'anxiety',      'anxious',          1),
  ('fear',         'anxiety',      'overwhelmed',      2),
  ('fear',         'anxiety',      'on edge',          3),
  ('fear',         'terror',       'afraid',           1),
  ('fear',         'terror',       'panicked',         2),
  ('fear',         'terror',       'frozen',           3),

  -- Surprise
  ('surprise',     'distraction',  'distracted',       1),
  ('surprise',     'distraction',  'unfocused',        2),
  ('surprise',     'distraction',  'scattered',        3),
  ('surprise',     'surprise',     'surprised',        1),
  ('surprise',     'surprise',     'startled',         2),
  ('surprise',     'surprise',     'caught off guard', 3),
  ('surprise',     'amazement',    'astonished',       1),
  ('surprise',     'amazement',    'stunned',          2),
  ('surprise',     'amazement',    'speechless',       3),

  -- Sadness
  ('sadness',      'pensiveness',  'pensive',          1),
  ('sadness',      'pensiveness',  'wistful',          2),
  ('sadness',      'pensiveness',  'reflective',       3),
  ('sadness',      'sadness',      'sad',              1),
  ('sadness',      'sadness',      'lonely',           2),
  ('sadness',      'sadness',      'disappointed',     3),
  ('sadness',      'grief',        'grieving',         1),
  ('sadness',      'grief',        'heartbroken',      2),
  ('sadness',      'grief',        'despairing',       3),

  -- Disgust
  ('disgust',      'boredom',      'bored',            1),
  ('disgust',      'boredom',      'disinterested',    2),
  ('disgust',      'boredom',      'flat',             3),
  ('disgust',      'disgust',      'repulsed',         1),
  ('disgust',      'disgust',      'put off',          2),
  ('disgust',      'disgust',      'uncomfortable',    3),
  ('disgust',      'loathing',     'revolted',         1),
  ('disgust',      'loathing',     'contemptuous',     2),
  ('disgust',      'loathing',     'disgusted',        3),

  -- Anger
  ('anger',        'annoyance',    'annoyed',          1),
  ('anger',        'annoyance',    'irritated',        2),
  ('anger',        'annoyance',    'impatient',        3),
  ('anger',        'anger',        'angry',            1),
  ('anger',        'anger',        'frustrated',       2),
  ('anger',        'anger',        'resentful',        3),
  ('anger',        'rage',         'furious',          1),
  ('anger',        'rage',         'enraged',          2),
  ('anger',        'rage',         'seething',         3),

  -- Anticipation
  ('anticipation', 'interest',     'curious',          1),
  ('anticipation', 'interest',     'intrigued',        2),
  ('anticipation', 'interest',     'attentive',        3),
  ('anticipation', 'anticipation', 'anticipating',     1),
  ('anticipation', 'anticipation', 'eager',            2),
  ('anticipation', 'anticipation', 'hopeful',          3),
  ('anticipation', 'vigilance',    'focused',          1),
  ('anticipation', 'vigilance',    'watchful',         2),
  ('anticipation', 'vigilance',    'intent',           3)
)
insert into public.emotion_details (subcategory_id, name, framework, sort_order)
select s.id, t.name, 'plutchik', t.sort_order
from tertiaries t
join public.emotion_categories c on c.name = t.primary_name
join public.emotion_subcategories s on s.category_id = c.id and s.name = t.secondary_name
on conflict (subcategory_id, name, framework) do nothing;

commit;

-- ─── Verify (run separately) ─────────────────────────────────────────────────
-- Expect 8 / 24 / 72 rows:
--   select count(*) from public.emotion_categories;     -- 8
--   select count(*) from public.emotion_subcategories;  -- 24
--   select count(*) from public.emotion_details;        -- 72
