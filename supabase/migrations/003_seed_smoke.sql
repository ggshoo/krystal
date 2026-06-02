-- Krystal — smoke-test seed
-- Run AFTER 002_rls.sql.
--
-- Inserts ONE complete emotion path (Fear → Anxiety → Overwhelmed) so we can
-- verify the schema works end to end before pouring in the full taxonomy
-- (Phase 4). All copy here is provisional — final wording is curated in Phase 4.

begin;

-- Plutchik primary: fear (purple in the app palette)
insert into public.emotion_categories (name, color, sort_order)
values ('fear', '#8E6FB5', 3)
on conflict (name) do nothing;

-- Secondary (placeholder — true Plutchik secondary for fear is "fear" itself;
-- the full Phase 4 seed will use Plutchik's actual ring names like apprehension/terror)
insert into public.emotion_subcategories (category_id, name, sort_order)
select c.id, 'anxiety', 1
from public.emotion_categories c
where c.name = 'fear'
on conflict (category_id, name) do nothing;

-- Specific tertiary with editorially-mapped Atlas content
insert into public.emotion_details (
  subcategory_id,
  name,
  framework,
  similar_words,
  sensations,
  what_it_tells_you,
  how_it_helps_you
)
select
  s.id,
  'overwhelmed',
  'plutchik',
  array['flooded', 'maxed out', 'too much', 'underwater'],
  array['tight chest', 'racing heart', 'shallow breath', 'a buzz under the skin'],
  'Feeling overwhelmed may be telling you that the demands on your attention right now exceed what feels sustainable.',
  'Overwhelm can sometimes help by signaling that something needs to be set down, deferred, or shared with someone else.'
from public.emotion_subcategories s
join public.emotion_categories c on s.category_id = c.id
where c.name = 'fear' and s.name = 'anxiety'
on conflict (subcategory_id, name, framework) do nothing;

commit;

-- ─── Quick verification queries (run these manually to confirm) ──────────────
--
-- 1. The full emotion path should appear:
--   select c.name as primary,
--          s.name as secondary,
--          d.name as specific,
--          d.what_it_tells_you
--     from public.emotion_details d
--     join public.emotion_subcategories s on d.subcategory_id = s.id
--     join public.emotion_categories c on s.category_id = c.id;
--
-- 2. RLS check (run as a logged-in user via Supabase Studio's Auth → Test mode):
--   select * from public.emotion_categories;   -- should return rows
--   select * from public.daily_checkins;       -- should return only YOUR rows
