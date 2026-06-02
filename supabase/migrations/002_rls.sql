-- Krystal — Row Level Security policies
-- Run AFTER 001_init.sql.
--
-- Rule of thumb: a user can read/write ONLY rows where auth.uid() = user_id.
-- Emotion taxonomy is global read-only for authenticated users.

-- ─── Enable RLS on user-owned tables ─────────────────────────────────────────
alter table public.profiles         enable row level security;
alter table public.daily_checkins   enable row level security;
alter table public.journal_entries  enable row level security;

-- ─── Enable RLS on emotion tables (public read for authenticated) ────────────
alter table public.emotion_categories     enable row level security;
alter table public.emotion_subcategories  enable row level security;
alter table public.emotion_details        enable row level security;

-- ─── Profiles ────────────────────────────────────────────────────────────────
create policy "profiles_select_own"
  on public.profiles for select
  using (auth.uid() = id);

create policy "profiles_update_own"
  on public.profiles for update
  using (auth.uid() = id);

-- (No insert/delete policies — profile rows are managed by the auth trigger
-- and cascade-deleted with auth.users.)

-- ─── Daily check-ins ─────────────────────────────────────────────────────────
create policy "daily_checkins_select_own"
  on public.daily_checkins for select
  using (auth.uid() = user_id);

create policy "daily_checkins_insert_own"
  on public.daily_checkins for insert
  with check (auth.uid() = user_id);

create policy "daily_checkins_update_own"
  on public.daily_checkins for update
  using (auth.uid() = user_id);

create policy "daily_checkins_delete_own"
  on public.daily_checkins for delete
  using (auth.uid() = user_id);

-- ─── Journal entries ─────────────────────────────────────────────────────────
create policy "journal_entries_select_own"
  on public.journal_entries for select
  using (auth.uid() = user_id);

create policy "journal_entries_insert_own"
  on public.journal_entries for insert
  with check (auth.uid() = user_id);

create policy "journal_entries_update_own"
  on public.journal_entries for update
  using (auth.uid() = user_id);

create policy "journal_entries_delete_own"
  on public.journal_entries for delete
  using (auth.uid() = user_id);

-- ─── Emotion taxonomy (authenticated read only; no client writes) ────────────
create policy "emotion_categories_select_authed"
  on public.emotion_categories for select
  to authenticated
  using (true);

create policy "emotion_subcategories_select_authed"
  on public.emotion_subcategories for select
  to authenticated
  using (true);

create policy "emotion_details_select_authed"
  on public.emotion_details for select
  to authenticated
  using (true);

-- Note: no INSERT/UPDATE/DELETE policies on emotion_* tables.
-- Taxonomy edits happen via service-role key from the Supabase dashboard or
-- a future admin script — never from the client app.
