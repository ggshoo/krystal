# Krystal

A daily emotional reflection app — mind/body/heart check-in, emotion identification via the Roberts wheel, intensity laddering via Plutchik, optional journaling, and a streak-based relationship with a grape companion character.

**Live:** https://krystal-one.vercel.app

## For AI agents entering this project

Start here:

1. **`ai_context/START_HERE.md`** — onboarding for any AI assistant
2. **`ai_context/current_state.md`** — ⭐ source of truth, mandatory read
3. **`ai_context/handoff.md`** — what the previous agent was doing

Multi-AI collaboration protocol: see `ai_context/communication_protocol.md`.

## For humans

Docs:
- [Current state](./ai_context/current_state.md) — what's done, what's in progress, what's open
- [Product Requirements](./docs/PRD.md)
- [Architecture](./docs/ARCHITECTURE.md) — folder structure, data flow, schema
- [Roadmap](./docs/ROADMAP.md) — phased build plan
- [Decisions log](./docs/DECISIONS.md) — ADRs
- [Known issues](./docs/known_issues.md) — bugs + tech debt
- [Grape image prompts](./docs/grape_image_prompts.md) — for generating AI grape assets

## Stack

- **App:** Expo SDK 54 · React Native · TypeScript · Expo Router
- **Styling:** NativeWind 4 (Tailwind for RN), dark mode via media query
- **State:** Zustand
- **Backend:** Supabase (Postgres + Auth + RLS)
- **Deploy:** GitHub Actions → Vercel (web build)
- **Analytics:** PostHog (planned)

## Getting started

```bash
# 1. Install dependencies
npm install

# 2. Copy env template and fill in your Supabase keys
cp .env.example .env

# 3. Start the dev server
npx expo start
```

Scan the QR with the **Expo Go** app on your phone, or press `w` for web.

## Project structure

```
krystal/
├── ai_context/           # AI memory + multi-agent collaboration
│   ├── current_state.md  # ⭐ source of truth
│   ├── START_HERE.md     # onboarding
│   ├── handoff.md        # inter-AI notes
│   ├── active_tasks.md   # prioritized backlog
│   ├── session_log.md    # historical record
│   ├── communication_protocol.md
│   └── glossary.md
├── .ai/                  # AI runtime config
│   ├── skills/           # named procedures
│   ├── hooks/            # event triggers
│   └── workflows/        # multi-step plays
├── app/                  # Expo Router screens
│   ├── _layout.tsx       # root layout, providers, theme
│   ├── index.tsx         # home
│   ├── history.tsx
│   ├── backpack.tsx      # earned-items inventory
│   ├── sign-in.tsx
│   └── (flow)/           # reflection flow (welcome → check-in → wheel → done → journal)
├── components/           # shared UI (GrapeCompanion, FadeIn, CheckInStep, EmotionWheel)
├── lib/                  # pure utility modules (no JSX)
│   ├── supabase.ts
│   ├── emotions.ts
│   ├── history.ts
│   ├── inventory.ts
│   ├── plutchik.ts
│   └── plutchikContent.ts
├── store/                # Zustand stores
│   ├── useAuthStore.ts
│   ├── useReflectionStore.ts
│   └── useInventoryStore.ts
├── supabase/             # SQL migrations
├── docs/                 # human-facing documentation
└── assets/               # images, including grape PNGs (planned)
```

## Deploying

```bash
rm -f ~/code/krystal/.git/index.lock
git add . && git commit -m "feat: ..." && git push
```

GitHub Actions builds and deploys to Vercel on push to `main`. Wait ~2 min, then hard-refresh https://krystal-one.vercel.app with Cmd+Shift+R.

Migrations in `supabase/00N_*.sql` must be run manually in the Supabase SQL editor before any code that depends on them goes live.

## License

MIT
