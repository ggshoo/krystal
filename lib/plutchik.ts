/**
 * Krystal — Plutchik intensity ladders.
 *
 * After picking a Roberts emotion (primary → secondary → tertiary), the user
 * is also asked to identify the intensity level on a Plutchik-style ladder.
 * Each ladder has three rungs: low / mid / high.
 *
 * Roberts → Plutchik mapping:
 *   Sad         → Sadness ladder
 *   Bad         → Disgust ladder
 *   Disgusted   → Disgust ladder
 *   Angry       → Anger ladder
 *   Fearful     → Fear ladder
 *   Surprised   → Surprise ladder
 *   Happy       → Joy ladder (default)
 *     · Trusting subcategory → Trust ladder
 *     · Proud subcategory    → Trust ladder
 *     · Interested subcategory → Anticipation ladder
 */

export type IntensityLevel = "low" | "mid" | "high";

export type PlutchikLadder = {
  /** Plutchik primary name (slug). */
  primary: string;
  low: string;
  mid: string;
  high: string;
};

export const PLUTCHIK_LADDERS = {
  sadness: { primary: "sadness", low: "pensiveness", mid: "sadness", high: "grief" },
  joy: { primary: "joy", low: "serenity", mid: "joy", high: "ecstasy" },
  trust: { primary: "trust", low: "acceptance", mid: "trust", high: "admiration" },
  disgust: { primary: "disgust", low: "boredom", mid: "disgust", high: "loathing" },
  anger: { primary: "anger", low: "annoyance", mid: "anger", high: "rage" },
  fear: { primary: "fear", low: "apprehension", mid: "fear", high: "terror" },
  anticipation: {
    primary: "anticipation",
    low: "interest",
    mid: "anticipation",
    high: "vigilance",
  },
  surprise: {
    primary: "surprise",
    low: "distraction",
    mid: "surprise",
    high: "amazement",
  },
} as const satisfies Record<string, PlutchikLadder>;

/**
 * Maps Roberts primary + secondary slug to the Plutchik ladder the user sees.
 */
export function getPlutchikLadder(
  robertsPrimary: string,
  robertsSecondary?: string
): PlutchikLadder {
  // Happy subcategory overrides
  if (robertsPrimary === "happy") {
    if (robertsSecondary === "interested") return PLUTCHIK_LADDERS.anticipation;
    if (robertsSecondary === "trusting" || robertsSecondary === "proud") {
      return PLUTCHIK_LADDERS.trust;
    }
    return PLUTCHIK_LADDERS.joy;
  }

  switch (robertsPrimary) {
    case "sad":
      return PLUTCHIK_LADDERS.sadness;
    case "bad":
      return PLUTCHIK_LADDERS.disgust;
    case "disgusted":
      return PLUTCHIK_LADDERS.disgust;
    case "angry":
      return PLUTCHIK_LADDERS.anger;
    case "fearful":
      return PLUTCHIK_LADDERS.fear;
    case "surprised":
      return PLUTCHIK_LADDERS.surprise;
    default:
      return PLUTCHIK_LADDERS.joy;
  }
}

const cap = (s: string) => s.charAt(0).toUpperCase() + s.slice(1);

export function plutchikLevels(
  ladder: PlutchikLadder
): Array<{ level: IntensityLevel; slug: string; name: string }> {
  // Ordered most intense → least intense (matches our "most at top" convention)
  return [
    { level: "high", slug: ladder.high, name: cap(ladder.high) },
    { level: "mid", slug: ladder.mid, name: cap(ladder.mid) },
    { level: "low", slug: ladder.low, name: cap(ladder.low) },
  ];
}
