# Where I am with krystal

A living snapshot so any future session can pick up. Update this as things change.

**Last updated:** 2026-06-02

## The big picture

I'm building **krystal**, a daily emotional reflection app, as the headline portfolio piece for my job search. Goal: ship it fast (publicly accessible URL), then build a personal portfolio website around it + my other repos (`scout`, `ReadyRecipe`, `Study_Guide`, plus AI policy + theology writing).

## What's done ✅

- **Phase 1** — Expo + TypeScript + Expo Router + NativeWind + Zustand + Supabase scaffold
- **Phase 2** — All architecture docs in `/docs/` (PRD, ARCHITECTURE, ROADMAP, DECISIONS)
- **Phase 3** — Supabase schema + RLS + smoke seed (running on `mtnallsztrulbrmbvbpf.supabase.co`)
- **Phase 4** — 72-emotion minimal Plutchik seed in Supabase
- **Phase 5.1** — Check-in screen (mind/body/heart, 1-10)
- **Phase 5.2** — Emotion picker (3 screens: primary, secondary, specific)
- **Phase 5.3** — Done screen + anonymous auth + save to Supabase
- **Web build works locally** at `npx expo start --web`
- **App.json** set to web `output: "single"` (SPA mode, not SSR)

The mobile flow works end-to-end in Expo Go on iPhone. Reflections save to Supabase.

## What's not yet done ❌ (in priority order)

1. **Deploy to Vercel** — half-finished. The first attempt accidentally linked `dist/` to the `ready-recipe` Vercel project. Cleanup + redeploy steps below.
2. **Plan the portfolio site** — separate from krystal. Likely Next.js on Vercel, will showcase krystal + other repos + writing.
3. **v0.2 polish** (later, after shipping): grounding screen, Reflect screen, Atlas content, the purple grape companion.

## Right now — finish the Vercel deploy

In a non-Metro terminal:

```bash
cd ~/code/krystal/dist
rm -rf .vercel
vercel deploy --prod
```

When prompted, **answer carefully:**

- Set up and deploy? → **Y**
- Which team? → **Gigi's projects**
- Link to existing project? → **N** ← critical, say NO this time
- Project's name? → type `krystal` then Enter
- Directory? → just Enter
- Modify settings? → **N**

It prints a URL. That's the shareable krystal link.

## After deploy

1. Open the URL in a browser. Walk through Home → Check-in → Picker → Done.
2. Open it on your phone. Safari → Share → Add to Home Screen.
3. Send the URL to one friend.
4. **Commit and push.**

## Key reference docs

- `LOVABLE.md` — if I ever pivot to Lovable instead, this has the migration playbook
- `docs/PRD.md` — full product spec
- `docs/ARCHITECTURE.md` — folder structure, data flow, schema
- `docs/ROADMAP.md` — v0.1 / v0.2 / v0.3 phased plan
- `docs/DECISIONS.md` — every product + technical decision and why

## When I come back to a fresh Cowork session

Paste this:

> "Working on krystal. Folder is `~/code/krystal`, connected. Read `STATUS.md` first. Then [whatever I want to do today]."

## Things I've put off until krystal ships

- The portfolio website itself (the original goal from the very first conversation)
- GitHub repo cleanup (`Study_Guide` has copyrighted lecture pptx files, `krystal` was empty)
- Profile README on `ggshoo/ggshoo`
- The grape companion + Atlas content for emotions
- Apple Developer account ($99/yr) + TestFlight if I want a real iOS app later
