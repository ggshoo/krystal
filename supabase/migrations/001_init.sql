-- Krystal — initial schema
-- Run this in the Supabase SQL Editor first.

-- ─── Extensions ──────────────────────────────────────────────────────────────
-- gen_random_uuid() comes from pgcrypto, available by default in Supabase.
create extension if not exists "pgcrypto";

-- ─── Profiles ────────────────────────────────────────────────────────────────
-- One-to-one mirror of auth.users with app-specific fields.
-- The trigger below auto-creates a profile row when a new auth user signs up.

create table public.profiles (
  id           uuid primary key references auth.users(id) on delete cascade,
  display_name text,
  created_at   timestamptz not null default now()
);

create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  insert into public.profiles (id) values (new.id);
  return new;
end;
$$;

create trigger on_auth_user_created
  after insert on auth.users
  for each row execute function public.handle_new_user();

-- ─── Emotion taxonomy (global, read-only from clients) ───────────────────────
-- Plutchik hierarchy in three tables. The `framework` column on emotion_details
-- lets us later merge in additional wheels (Geneva, etc.) without migration.

create table public.emotion_categories (
  id         uuid primary key default gen_random_uuid(),
  name       text not null unique,
  color      text not null,
  sort_order smallint not null default 0
);

create table public.emotion_subcategories (
  id          uuid primary key default gen_random_uuid(),
  category_id uuid not null references public.emotion_categories(id) on delete cascade,
  name        text not null,
  sort_order  smallint not null default 0,
  unique (category_id, name)
);

create index emotion_subcategories_category_idx
  on public.emotion_subcategories(category_id);

create table public.emotion_details (
  id                uuid primary key default gen_random_uuid(),
  subcategory_id    uuid not null references public.emotion_subcategories(id) on delete cascade,
  name              text not null,
  framework         text not null default 'plutchik',  -- 'plutchik' | 'atlas' | ...
  similar_words     text[] not null default '{}',
  sensations        text[] not null default '{}',
  what_it_tells_you text,
  how_it_helps_you  text,
  description       text,
  unique (subcategory_id, name, framework)
);

create index emotion_details_subcategory_idx
  on public.emotion_details(subcategory_id);

create index emotion_details_framework_idx
  on public.emotion_details(framework);

-- ─── Daily check-ins ─────────────────────────────────────────────────────────
-- One row per completed reflection.
-- `occurred_at` is the user's local reflection time (matters for offline sync).
-- `client_uuid` is the idempotency key for offline submission retries.
-- Only the specific (tertiary) emotion is stored. Primary and secondary are
-- derivable via JOIN through emotion_details → emotion_subcategories → emotion_categories.

create table public.daily_checkins (
  id          uuid primary key default gen_random_uuid(),
  user_id     uuid not null references auth.users(id) on delete cascade,
  created_at  timestamptz not null default now(),
  occurred_at timestamptz not null default now(),
  mind_score  smallint not null check (mind_score  between 1 and 10),
  body_score  smallint not null check (body_score  between 1 and 10),
  heart_score smallint not null check (heart_score between 1 and 10),
  emotion_id  uuid not null references public.emotion_details(id) on delete restrict,
  client_uuid uuid not null unique
);

create index daily_checkins_user_occurred_idx
  on public.daily_checkins(user_id, occurred_at desc);

create index daily_checkins_user_emotion_idx
  on public.daily_checkins(user_id, emotion_id);

-- ─── Journal entries (optional, 1:1 with daily_checkins) ─────────────────────
-- Three nullable text fields matching the three prompts on the merged
-- Understanding+Journaling screen (PRD §4 Step 4).

create table public.journal_entries (
  id                uuid primary key default gen_random_uuid(),
  daily_checkin_id  uuid not null unique references public.daily_checkins(id) on delete cascade,
  user_id           uuid not null references auth.users(id) on delete cascade,
  sensation         text,  -- "How are you experiencing this in your body?"
  meaning           text,  -- "What might it be telling you in your life?"
  helpfulness       text,  -- "How might it be helping you?"
  created_at        timestamptz not null default now()
);

create index journal_entries_user_created_idx
  on public.journal_entries(user_id, created_at desc);
