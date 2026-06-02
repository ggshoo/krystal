# Krystal

A mobile app for cultivating emotional clarity through guided reflection.

## What this is

Krystal guides a daily emotional reflection practice: grounding → mind-body-heart check-in → emotion identification → emotion understanding → guided journaling → pattern discovery over time.

Full product spec lives in [`docs/PRD.md`](./docs/PRD.md) (added in Phase 2).

## Stack

- **App:** Expo SDK 52 · React Native · TypeScript · Expo Router (file-based routing)
- **Styling:** NativeWind 4 (Tailwind for React Native)
- **State:** Zustand
- **Backend:** Supabase (Postgres + Auth + Row Level Security)
- **Analytics:** PostHog (wired up in a later phase)

## Getting started

```bash
# 1. Install dependencies
npm install

# 2. Copy env template and fill in your Supabase keys
cp .env.example .env

# 3. Start the dev server
npx expo start
```

Scan the QR code with the **Expo Go** app on your phone.

## Project structure

```
krystal/
├── app/                  # Expo Router screens (file-based routing)
│   ├── _layout.tsx       # Root layout — providers, theme, status bar
│   └── index.tsx         # Home screen
├── components/           # Reusable UI components
├── lib/
│   └── supabase.ts       # Supabase client + auth config
├── store/
│   └── useReflectionStore.ts  # Daily reflection draft state
├── docs/                 # Product docs (Phase 2)
└── supabase/             # SQL migrations (Phase 3)
```

## Build phases

- [x] **Phase 1** — Bootstrap (you are here)
- [ ] **Phase 2** — Architecture docs (PRD, ARCHITECTURE, ROADMAP)
- [ ] **Phase 3** — Supabase schema + RLS
- [ ] **Phase 4** — Emotion taxonomy
- [ ] **Phase 5** — Daily reflection screens
- [ ] **Phase 6** — Auth, persistence, insights
- [ ] **Phase 7** — Ship to TestFlight

## License

MIT
