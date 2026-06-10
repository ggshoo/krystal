# Where I am with krystal

A living snapshot so any future session can pick up. Update this as things change.

**Last updated:** 2026-06-02

## The big picture

I'm building **krystal**, a daily emotional reflection app, as the headline portfolio piece for my job search. Goal: ship + polish a public web app, then build a portfolio site around it.

**Live at:** `https://krystal-one.vercel.app`

## What's done ✅

### Foundations
- **Phase 1-3** — Expo + TypeScript + Expo Router + NativeWind + Zustand + Supabase scaffold, all architecture docs, full Supabase schema + RLS, smoke seed
- **Phase 4** — Minimal Plutchik taxonomy seeded (8 × 3 × 3 = 72 emotions, names only)
- **Phase 5.1–5.3** — Full v0.1 flow: Check-in → Picker → Save, with anonymous auth

### v0.1 shipped
- Web build deployed to Vercel at `krystal-one.vercel.app`
- **Auto-deploy wired**: every `git push` to `main` triggers a Vercel rebuild + redeploy automatically. Env vars set on Vercel project.

### v0.2 polish in progress
- **Welcome screen** — first-time captures user's name to `profiles.display_name`, returning sees "Hi [name], I hope you're doing well. Let's begin a mindfulness check-in." → Ready button
- **Check-in split into 3 separate screens** (Mind / Body / Heart) with progress dots, auto-advance ~500ms after selection
- **Hero typography on check-in**: dimension label is text-6xl (huge), question is text-xl with the key word bolded ("thoughts", "body", "emotionally")
- **Expanded low/high anchors** with descriptive sentences instead of dot-separated hints
- **Emotion picker (primary)** — full Plutchik wheel (SVG, 8 wedges) replacing the tile grid. Dramatic hover: wedge translates outward 24px + scales 1.12 + brightens to near-solid + thick colored stroke + label jumps to 20px/700
- **Secondary picker** ordered by intensity (most intense top, least bottom) with a vertical "More/Less" scale indicator alongside
- **"Saved." subtle** on Done screen (small, muted, lowercase) so the chosen emotion stays the focal point
- **Fade-in motion everywhere** via `FadeIn` component — soft staggered cascade as each screen mounts (FadeInDown with spring overshoot, 800ms duration)
- **Slower stack-screen transitions** between routes (700ms fade)
- **Hover effects** on every clickable thing: CTAs scale to 1.15 with shadow-2xl, tiles to 1.08 with shadow-2xl, numbers to 1.25, wheel wedges as above

## What's not yet done ❌

1. **Verify the latest deploy on Vercel** — last in-conversation report was "not seeing changes." Could be cache, could be a build failure. Check Vercel dashboard.
2. **Body/Heart anchor wording** — currently uses descriptive sentences but Gigi may want to adjust the exact words
3. **Plutchik wheel hover smoothness** — the SVG transitions might not be as smooth as CSS-on-DOM. Worth testing in person
4. **Dark mode** — logged for v0.3
5. **History view + analytics** — logged for v0.3 (the user wants this eventually)
6. **The grape companion character** — designed in DECISIONS.md, not yet drawn or added to screens
7. **Atlas content for all 72 emotions** — names only in v0.1; backfill in v0.2 when Reflect screen ships
8. **The Reflect screen** (Understanding + journal prompts) — biggest single v0.2 build remaining

## Right now — verify the latest deploy

Two checks before doing more code:

1. **Vercel dashboard** — visit https://vercel.com/dashboard → click krystal → Deployments. Latest deploy should be **Ready** (green). If Failed, paste the error log.
2. **Browser** — hard-reload `https://krystal-one.vercel.app` (⌘+Shift+R). You should see all the v0.2 changes: huge "Mind" hero text, bolded "thoughts" in the question, descriptive anchors, the Plutchik wheel as the primary picker, intensity-ordered secondary picker.

If everything looks right, pick the next direction below.

## Pick what to work on next

**Closest to "feels like a real product":**

- **The Reflect screen** — biggest remaining v0.2 piece. After picking a specific emotion, surfaces educational content (similar words, sensations, what-it-tells-you, how-it-helps-you) paired with journal prompts. Adds depth.
- **Atlas content backfill** for all 72 emotions — gets you usable Reflect screen content. Mostly drafting work.
- **The grape companion** — drawing the small purple grape character + integrating into screens. Polish.

**Closest to "I can do something with my data":**

- **History view** — list of past reflections, simplest version per-browser (no extra auth needed).
- **Insights screen** — rule-based pattern observations from the user's last 30 days.
- **Magic-link auth upgrade** — so history survives across devices.

**Closest to "polishing what's already there":**

- **Dial down/up animation timings** based on what feels right after testing.
- **Refine colors / typography** further.
- **Body/Heart anchor wording** — same descriptive style as Mind, exact words TBD.

## Key reference docs

- `LOVABLE.md` — pivot playbook (if you ever want to switch to Lovable)
- `docs/PRD.md` — full product spec
- `docs/ARCHITECTURE.md` — folder structure, data flow, schema
- `docs/ROADMAP.md` — v0.1 / v0.2 / v0.3 phased plan
- `docs/DECISIONS.md` — every product + technical decision and why

## Opener for next Cowork session

> "Working on krystal. Folder is `~/code/krystal`. Read `STATUS.md`. Today I want to [whatever]."

That message bootstraps any fresh chat instantly.
