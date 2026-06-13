# Grape Image Prompts

Master prompt + emotion-variant prompts for generating the AI grape PNG assets.

## Recommended model

**Google Nano Banana** (Gemini 2.5 Flash Image) — free in Google AI Studio, strong character consistency across follow-up edits in the same conversation. Alternative: ChatGPT Plus with GPT Image 1.

## Master prompt (use this first)

```
A single grape character mascot, kawaii style, glossy 3D rendered illustration.
The grape is a plump round purple grape with a smooth glossy surface and subtle
gradient shading from light lavender at the upper-left highlight to deep purple
at the lower-right. A short brown twiggy stem grows from the top with two small
fresh green leaves (one slightly darker behind, one brighter in front).

The face has very large round sparkly black eyes with two white shine highlights
in each eye (one big upper-right, one smaller lower-left), gently rosy pink
cheeks, and a small closed pleasant smile that curves gently upward at the
corners. The expression is warm, friendly, and inviting.

Soft warm cream-colored studio background (#F7F0E5). Soft diffuse lighting.
Centered composition, character fills 60% of the frame. Square aspect ratio.
No text, no other objects, no shadow on the background.
```

Save the result as `default.png`.

## Variant prompts

For each emotion, use this follow-up in the same Nano Banana conversation:

```
Same exact grape character, same style, same lighting, same stem, same leaves.
Only change the facial expression to [EMOTION DESCRIPTOR].
Body shape, cheeks, sparkle highlights, and pose stay identical.
```

### Per-emotion descriptors

| Filename | Emotion | Descriptor |
|---|---|---|
| `default.png` | Default (resting) | (master prompt above) |
| `happy.png` | Happy | a big bright open-mouth smile with closed-arc happy eyes and rosier cheeks |
| `surprise.png` | Surprised | wide-open round eyes, eyebrows raised high, small "o" shaped mouth |
| `fear.png` | Fearful | wide worried eyes, raised inner brows, mouth slightly tense and downturned |
| `anger.png` | Angry | furrowed eyebrows angled down toward center, eyes narrowed slightly, mouth firm with small grimace |
| `disgust.png` | Disgusted | one eyebrow raised higher than the other, mouth twisted to one side in a small grimace |
| `bad.png` | Bad / blah | half-lidded droopy eyes, neutral flat mouth, slightly weary expression |
| `sad-mid.png` | Sad | inner brows tilted up sadly, eyes glistening, mouth in a small frown, single tear at one eye corner |
| `sad-low.png` | Pensive (low-intensity sad) | heavy droopy upper eyelids, wet shimmering lower eyes (no tear streaming), gentle subtle frown |
| `sad-high.png` | Grief (high-intensity sad) | closed crying eyes with tears streaming, deeply downturned mouth, vulnerable expression |

## Workflow

1. Open https://aistudio.google.com → New chat → pick Gemini 2.5 Flash Image.
2. Paste the **master prompt**. Iterate (regenerate, refine wording) until the default grape looks right.
3. Stay in the same conversation. Send the variant follow-up with each emotion descriptor.
4. Download each image. Rename per the table.
5. Drop all files into `~/code/krystal/assets/grape/`.
6. Tell the next AI: "assets are in `assets/grape/`, refactor `GrapeCompanion.tsx` for hybrid PNG/SVG."

## Naming convention

All lowercase. No spaces. `default.png` for the resting face. Emotion slug matches the values used in `lib/emotions.ts` and the database (`emotion_categories.name` lowercased), so the component can look up the file by slug.

Future expansion (don't generate yet, wait for confirmation):

- `default-hat.png`, `happy-hat.png`, etc. for items equipped — OR — render items as separate SVG overlays on top of the PNG. We'll decide when the first PNG ships.

## When the assets are ready

The next AI should:

1. Verify all expected files are present in `assets/grape/`.
2. Refactor `components/GrapeCompanion.tsx` to detect size: render PNG for `size >= 80` (home, done, journal hero) and SVG for `size < 80` (flow corner).
3. The PNG renders via `<Image source={...} />` — load the right one based on `emotionPrimary` + `plutchikEmotion`.
4. Add a `Image` import from `expo-image` (faster than RN's `Image`).
5. Update `current_state.md → Features Complete` to note the hybrid grape system is live.
6. Update `session_log.md` with the refactor session.
