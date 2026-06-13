-- 007_inventory.sql
-- The backpack: items the user has earned by hitting streak milestones.
-- Item catalog lives in lib/inventory.ts (slugs, names, unlock thresholds);
-- this table only tracks per-user ownership + equipped state.

create table if not exists public.user_inventory (
  id uuid primary key default uuid_generate_v4(),
  user_id uuid not null references auth.users(id) on delete cascade,
  item_slug text not null,
  unlocked_at timestamptz not null default now(),
  equipped boolean not null default false,
  unique (user_id, item_slug)
);

alter table public.user_inventory enable row level security;

create policy "users read own inventory"
  on public.user_inventory for select
  using (auth.uid() = user_id);

create policy "users insert own inventory"
  on public.user_inventory for insert
  with check (auth.uid() = user_id);

create policy "users update own inventory"
  on public.user_inventory for update
  using (auth.uid() = user_id);

create policy "users delete own inventory"
  on public.user_inventory for delete
  using (auth.uid() = user_id);

create index if not exists user_inventory_user_id_idx
  on public.user_inventory (user_id);
