# Krystal — Supabase migrations

These SQL files set up the database schema, Row Level Security, and a smoke-test seed.

## How to run them

Until we adopt the Supabase CLI (`supabase db push`), run them by hand in your project's SQL Editor:

1. Open https://supabase.com/dashboard → your `krystal` project.
2. Sidebar → **SQL Editor**.
3. Click **New query**.
4. Paste the contents of each file **in order**, hit **Run**.
   - `001_init.sql` — tables, indexes, profile-creation trigger
   - `002_rls.sql` — Row Level Security policies (run after 001)
   - `003_seed_smoke.sql` — one test emotion (run after 002)
5. Confirm via sidebar → **Table Editor** that all tables exist and that `emotion_details` has one row.

## Re-running

`001_init.sql` and `002_rls.sql` are **not** idempotent — running them twice will error on existing tables/policies. If you need to start over: in SQL Editor run

```sql
drop table if exists
  public.journal_entries,
  public.daily_checkins,
  public.emotion_details,
  public.emotion_subcategories,
  public.emotion_categories,
  public.profiles
cascade;

drop function if exists public.handle_new_user() cascade;
```

then re-run from `001`.

`003_seed_smoke.sql` is idempotent (uses `on conflict do nothing`).

## What comes next

- **Phase 4** will replace `003_seed_smoke.sql` with the full Plutchik taxonomy + editorially-mapped Atlas content (~120 emotion rows).
- Eventually we'll adopt the Supabase CLI so migrations apply via `supabase db push` instead of copy-paste.
