# Grape Generation Checklist

Step-by-step for producing the AI grape assets in Google AI Studio. Time budget: **20–30 minutes** once you sit down.

The master prompts are in `docs/grape_image_prompts.md`. This file is the run-of-show.

---

## Before you start

- [ ] Sign in to https://aistudio.google.com with your Google account.
- [ ] Confirm the model dropdown shows **Gemini 2.5 Flash Image** (the "Nano Banana" nickname). If not, pick it.
- [ ] Have `docs/grape_image_prompts.md` open in a second tab for copy-paste.
- [ ] Create the assets folder if you haven't: `mkdir -p ~/code/crystal/assets/grape`

---

## Step 1 — Generate the default grape (5 min)

- [ ] Start a new chat in AI Studio.
- [ ] Paste the **master prompt** from `docs/grape_image_prompts.md` verbatim.
- [ ] Look at the output.
  - If it feels 80% right: keep it. Save as `default.png`.
  - If it's off (wrong color, wrong stem, wrong eye vibe): reply "regenerate, but keep the same style. Make the eyes bigger and rounder" (or whatever specific tweak). Iterate up to 3 times max.
  - If after 3 tries it still isn't landing: try adding "in the style of a Pixar or Ghibli character" or "reference: kawaii mascot design" to the prompt.
- [ ] Right-click the final image → Save image as → `default.png` in `~/code/crystal/assets/grape/`.

---

## Step 2 — Generate the 7 emotion variants (15 min)

**Stay in the same chat conversation** so the model preserves character consistency.

For each emotion, paste this template (swap in the descriptor from the table below):

> Same exact grape character. Same style. Same stem, same leaves, same body shape, same lighting. Only change the facial expression to: {DESCRIPTOR}. Keep everything else identical.

| Filename | Descriptor to paste |
|---|---|
| `happy.png` | big bright open-mouth smile with closed-arc happy eyes and rosier cheeks |
| `surprise.png` | wide-open round eyes, eyebrows raised high, small "o" shaped mouth |
| `fear.png` | wide worried eyes, raised inner brows, mouth slightly tense and downturned |
| `anger.png` | furrowed eyebrows angled down toward center, eyes narrowed slightly, mouth firm with a small grimace |
| `disgust.png` | one eyebrow raised higher than the other, mouth twisted to one side in a small grimace |
| `bad.png` | half-lidded droopy eyes, neutral flat mouth, slightly weary expression |
| `sad-mid.png` | inner brows tilted up sadly, glistening eyes, small frown, single tear at one eye corner |

- [ ] `happy.png` generated + saved
- [ ] `surprise.png` generated + saved
- [ ] `fear.png` generated + saved
- [ ] `anger.png` generated + saved
- [ ] `disgust.png` generated + saved
- [ ] `bad.png` generated + saved
- [ ] `sad-mid.png` generated + saved

---

## Step 3 — Generate the 2 sadness intensity variants (5 min)

Same chat. Sadness has three intensity levels — you already generated the mid one. Add:

> Same grape. Only the expression changes. This is a low-intensity pensive sadness — heavy droopy upper eyelids, wet shimmering lower eyes (no tear streaming), gentle subtle frown. Quiet, not distressed.

- [ ] Save as `sad-low.png`

Then:

> Same grape. High-intensity grief now — closed crying eyes with tears streaming down, deeply downturned mouth, vulnerable expression.

- [ ] Save as `sad-high.png`

---

## Step 4 — Quality check (2 min)

Look at all 10 side-by-side (open the folder in Finder with Column view).

- [ ] All 10 have the SAME body shape, stem, leaves, lighting?
- [ ] Only the face changes across them?
- [ ] Cream/warm background on all of them (no random dark backgrounds)?
- [ ] File names all lowercase, `.png` extension?

**If any single image looks out of family** (wrong pose, weird angle, different color): regenerate just that one with an extra emphasis on "match the other grapes exactly". Character consistency is what makes this feel like a real product.

**If the whole batch feels inconsistent** (the model drifted): start fresh, regenerate the default, and rerun the variants. Sometimes the chat gets confused after too many edits — a fresh conversation resets the reference.

---

## Step 5 — Drop into the repo

- [ ] All 10 files sitting in `~/code/crystal/assets/grape/`?
- [ ] `ls ~/code/crystal/assets/grape/` shows exactly: `anger.png bad.png default.png disgust.png fear.png happy.png sad-high.png sad-low.png sad-mid.png surprise.png`
- [ ] Report back to your AI agent: "grape assets are in `assets/grape/`, ready for the hybrid PNG/SVG refactor."

The next AI (or Claude in the next session) picks up from there and rewires `components/GrapeCompanion.tsx` to load PNGs on large sizes and keep SVG on small ones.

---

## Troubleshooting

- **Nano Banana refuses to regenerate a character** ("I can only generate one image per message" or similar): the free tier may have hit its cap. Wait an hour or switch to ChatGPT Plus with GPT Image as fallback (same prompts work).
- **The grape looks different every time even in the same chat**: paste the master prompt again with "match this exact character reference" and attach the first generated `default.png` as an input image. Nano Banana handles reference images well.
- **The stem keeps rendering as green (not brown)**: add "the stem must be brown wood, NOT green" to the prompt. Explicit constraint.
- **The eyes look creepy** (uncanny valley): add "soft cartoon eyes, no realistic reflections, kawaii style, not photorealistic". Move toward abstraction.

---

Once these are in the repo, `GrapeCompanion.tsx` gets refactored to swap PNG for SVG on the home hero, and your live demo suddenly looks 10x more polished. That polish is what a recruiter sees when they click the link on your portfolio.
