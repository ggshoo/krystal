/**
 * Krystal — educational content for each Plutchik intensity word.
 *
 * Keyed by intensity slug (not primary). Each entry is what the user sees
 * when they pick that specific intensity word on the Plutchik ladder.
 *
 * Content style is intentionally terse — a phrase or short sentence — per
 * Gigi's reference chart. Long descriptions defeat the purpose of a quick
 * gut-check during journaling.
 */

export type PlutchikContent = {
  similar_words: string[];
  sensations: string;
  what_it_tells_you: string;
  how_it_helps_you: string;
};

export const PLUTCHIK_CONTENT: Record<string, PlutchikContent> = {
  // ── Sadness ladder ─────────────────────────────────────────────────────
  grief: {
    similar_words: ["heartbroken", "distraught"],
    sensations: "Hard to get up",
    what_it_tells_you: "Love is lost.",
    how_it_helps_you: "To know what we truly want.",
  },
  sadness: {
    similar_words: ["bummed", "loss"],
    sensations: "Heavy",
    what_it_tells_you: "Love is going away.",
    how_it_helps_you: "Focus on what's important to us.",
  },
  pensiveness: {
    similar_words: ["blue", "unhappy"],
    sensations: "Slow & disconnected",
    what_it_tells_you: "Love is distant.",
    how_it_helps_you: "Remembering people, things that are important.",
  },

  // ── Joy ladder ─────────────────────────────────────────────────────────
  ecstasy: {
    similar_words: ["elated", "euphoric"],
    sensations: "Bursting energy",
    what_it_tells_you: "Life is wonderful.",
    how_it_helps_you: "To celebrate what matters.",
  },
  joy: {
    similar_words: ["glad", "happy"],
    sensations: "Warm & open",
    what_it_tells_you: "Life is good.",
    how_it_helps_you: "To savor what's here.",
  },
  serenity: {
    similar_words: ["content", "calm"],
    sensations: "Peaceful breath",
    what_it_tells_you: "Life is enough.",
    how_it_helps_you: "To rest in what's good.",
  },

  // ── Trust ladder ───────────────────────────────────────────────────────
  admiration: {
    similar_words: ["in awe", "reverent"],
    sensations: "Heart wide open",
    what_it_tells_you: "Someone shows me what's possible.",
    how_it_helps_you: "To honor what inspires us.",
  },
  trust: {
    similar_words: ["safe", "secure"],
    sensations: "Steady & relaxed",
    what_it_tells_you: "This is reliable.",
    how_it_helps_you: "To build connection.",
  },
  acceptance: {
    similar_words: ["open", "welcoming"],
    sensations: "Soft chest",
    what_it_tells_you: "This is okay.",
    how_it_helps_you: "To meet what comes.",
  },

  // ── Fear ladder ────────────────────────────────────────────────────────
  terror: {
    similar_words: ["panicked", "petrified"],
    sensations: "Frozen body",
    what_it_tells_you: "Safety is gone.",
    how_it_helps_you: "To survive.",
  },
  fear: {
    similar_words: ["scared", "afraid"],
    sensations: "Tight & alert",
    what_it_tells_you: "Safety is at risk.",
    how_it_helps_you: "To get to safety.",
  },
  apprehension: {
    similar_words: ["nervous", "worried"],
    sensations: "Restless",
    what_it_tells_you: "Safety may be uncertain.",
    how_it_helps_you: "To prepare carefully.",
  },

  // ── Surprise ladder ────────────────────────────────────────────────────
  amazement: {
    similar_words: ["astonished", "awestruck"],
    sensations: "Stopped breath",
    what_it_tells_you: "Something has shifted.",
    how_it_helps_you: "To take in something new.",
  },
  surprise: {
    similar_words: ["startled", "caught off guard"],
    sensations: "Quick gasp",
    what_it_tells_you: "Something unexpected happened.",
    how_it_helps_you: "To pause and notice.",
  },
  distraction: {
    similar_words: ["scattered", "unfocused"],
    sensations: "Buzzing thoughts",
    what_it_tells_you: "Attention is divided.",
    how_it_helps_you: "To regather and refocus.",
  },

  // ── Disgust ladder ─────────────────────────────────────────────────────
  loathing: {
    similar_words: ["revolted", "repulsed"],
    sensations: "Body turns away",
    what_it_tells_you: "Something violates what matters.",
    how_it_helps_you: "To set a firm boundary.",
  },
  disgust: {
    similar_words: ["turned off", "put off"],
    sensations: "Stomach tense",
    what_it_tells_you: "Something feels wrong.",
    how_it_helps_you: "To name what doesn't fit.",
  },
  boredom: {
    similar_words: ["flat", "indifferent"],
    sensations: "Heavy stillness",
    what_it_tells_you: "Something has lost meaning.",
    how_it_helps_you: "To notice what wants to change.",
  },

  // ── Anger ladder ───────────────────────────────────────────────────────
  rage: {
    similar_words: ["furious", "enraged"],
    sensations: "Heat in chest",
    what_it_tells_you: "A line has been crossed.",
    how_it_helps_you: "To protect what's mine.",
  },
  anger: {
    similar_words: ["mad", "frustrated"],
    sensations: "Tense jaw",
    what_it_tells_you: "Something is unfair.",
    how_it_helps_you: "To say what needs saying.",
  },
  annoyance: {
    similar_words: ["irritated", "bothered"],
    sensations: "Friction in body",
    what_it_tells_you: "Something small but real.",
    how_it_helps_you: "To name what's bugging you.",
  },

  // ── Anticipation ladder ────────────────────────────────────────────────
  vigilance: {
    similar_words: ["focused", "intent"],
    sensations: "Alert & ready",
    what_it_tells_you: "Something important is coming.",
    how_it_helps_you: "To prepare with care.",
  },
  anticipation: {
    similar_words: ["eager", "looking forward"],
    sensations: "Leaning in",
    what_it_tells_you: "Something is on the horizon.",
    how_it_helps_you: "To get ready.",
  },
  interest: {
    similar_words: ["curious", "intrigued"],
    sensations: "Open & engaged",
    what_it_tells_you: "Something is worth attention.",
    how_it_helps_you: "To explore further.",
  },
};

/**
 * Get content for a Plutchik intensity slug (e.g. "grief", "ecstasy", "rage").
 */
export function getPlutchikContent(
  intensitySlug?: string
): PlutchikContent | null {
  if (!intensitySlug) return null;
  return PLUTCHIK_CONTENT[intensitySlug] ?? null;
}
