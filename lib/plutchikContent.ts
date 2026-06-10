/**
 * Krystal — educational content for each Plutchik intensity word.
 *
 * Keyed by intensity slug (not primary). Each entry provides:
 *  - the "About X" content boxed on the Journal screen
 *  - dynamic follow-up prompts for "What's coming up?" and "Why are you
 *    feeling this way?", derived from the what-it-tells / how-it-helps
 *    fields.
 *
 * Content style is intentionally terse — a phrase or short sentence — per
 * Gigi's reference chart.
 */

export type PlutchikContent = {
  similar_words: string[];
  sensations: string;
  what_it_tells_you: string;
  how_it_helps_you: string;
  /** Follow-up question rendered under "What's coming up?" */
  reflection_prompt: string;
  /** Follow-up question rendered under "Why are you feeling this way?" */
  why_prompt: string;
};

export const PLUTCHIK_CONTENT: Record<string, PlutchikContent> = {
  // ── Sadness ladder ─────────────────────────────────────────────────────
  grief: {
    similar_words: ["heartbroken", "distraught"],
    sensations: "Hard to get up",
    what_it_tells_you: "Love is lost.",
    how_it_helps_you: "To know what we truly want.",
    reflection_prompt: "Has love been lost?",
    why_prompt: "What do you truly want?",
  },
  sadness: {
    similar_words: ["bummed", "loss"],
    sensations: "Heavy",
    what_it_tells_you: "Love is going away.",
    how_it_helps_you: "Focus on what's important to us.",
    reflection_prompt: "Is something starting to slip away?",
    why_prompt: "What feels most important right now?",
  },
  pensiveness: {
    similar_words: ["blue", "unhappy"],
    sensations: "Slow & disconnected",
    what_it_tells_you: "Love is distant.",
    how_it_helps_you: "Remembering people, things that are important.",
    reflection_prompt: "Is someone or something feeling distant?",
    why_prompt: "Who or what are you missing?",
  },

  // ── Joy ladder ─────────────────────────────────────────────────────────
  ecstasy: {
    similar_words: ["elated", "euphoric"],
    sensations: "Bursting energy",
    what_it_tells_you: "Life is wonderful.",
    how_it_helps_you: "To celebrate what matters.",
    reflection_prompt: "What's feeling wonderful?",
    why_prompt: "What do you want to celebrate?",
  },
  joy: {
    similar_words: ["glad", "happy"],
    sensations: "Warm & open",
    what_it_tells_you: "Life is good.",
    how_it_helps_you: "To savor what's here.",
    reflection_prompt: "What's feeling good right now?",
    why_prompt: "What do you want to savor?",
  },
  serenity: {
    similar_words: ["content", "calm"],
    sensations: "Peaceful breath",
    what_it_tells_you: "Life is enough.",
    how_it_helps_you: "To rest in what's good.",
    reflection_prompt: "What's feeling like enough?",
    why_prompt: "Where can you rest right now?",
  },

  // ── Trust ladder ───────────────────────────────────────────────────────
  admiration: {
    similar_words: ["in awe", "reverent"],
    sensations: "Heart wide open",
    what_it_tells_you: "Someone shows me what's possible.",
    how_it_helps_you: "To honor what inspires us.",
    reflection_prompt: "Who is showing you what's possible?",
    why_prompt: "What do you want to honor?",
  },
  trust: {
    similar_words: ["safe", "secure"],
    sensations: "Steady & relaxed",
    what_it_tells_you: "This is reliable.",
    how_it_helps_you: "To build connection.",
    reflection_prompt: "What feels reliable right now?",
    why_prompt: "Where do you want to build connection?",
  },
  acceptance: {
    similar_words: ["open", "welcoming"],
    sensations: "Soft chest",
    what_it_tells_you: "This is okay.",
    how_it_helps_you: "To meet what comes.",
    reflection_prompt: "What can you let be okay?",
    why_prompt: "What do you want to meet openly?",
  },

  // ── Fear ladder ────────────────────────────────────────────────────────
  terror: {
    similar_words: ["panicked", "petrified"],
    sensations: "Frozen body",
    what_it_tells_you: "Safety is gone.",
    how_it_helps_you: "To survive.",
    reflection_prompt: "Does something feel deeply unsafe?",
    why_prompt: "What do you need to feel safe?",
  },
  fear: {
    similar_words: ["scared", "afraid"],
    sensations: "Tight & alert",
    what_it_tells_you: "Safety is at risk.",
    how_it_helps_you: "To get to safety.",
    reflection_prompt: "Is something important at risk?",
    why_prompt: "What would help you feel safer?",
  },
  apprehension: {
    similar_words: ["nervous", "worried"],
    sensations: "Restless",
    what_it_tells_you: "Safety may be uncertain.",
    how_it_helps_you: "To prepare carefully.",
    reflection_prompt: "Does something feel uncertain?",
    why_prompt: "What would help you prepare?",
  },

  // ── Surprise ladder ────────────────────────────────────────────────────
  amazement: {
    similar_words: ["astonished", "awestruck"],
    sensations: "Stopped breath",
    what_it_tells_you: "Something has shifted.",
    how_it_helps_you: "To take in something new.",
    reflection_prompt: "What has shifted?",
    why_prompt: "What new are you taking in?",
  },
  surprise: {
    similar_words: ["startled", "caught off guard"],
    sensations: "Quick gasp",
    what_it_tells_you: "Something unexpected happened.",
    how_it_helps_you: "To pause and notice.",
    reflection_prompt: "What unexpected happened?",
    why_prompt: "What do you want to notice right now?",
  },
  distraction: {
    similar_words: ["scattered", "unfocused"],
    sensations: "Buzzing thoughts",
    what_it_tells_you: "Attention is divided.",
    how_it_helps_you: "To regather and refocus.",
    reflection_prompt: "Where is your attention pulled?",
    why_prompt: "What would help you refocus?",
  },

  // ── Disgust ladder ─────────────────────────────────────────────────────
  loathing: {
    similar_words: ["revolted", "repulsed"],
    sensations: "Body turns away",
    what_it_tells_you: "Something violates what matters.",
    how_it_helps_you: "To set a firm boundary.",
    reflection_prompt: "What feels deeply wrong?",
    why_prompt: "What boundary do you need?",
  },
  disgust: {
    similar_words: ["turned off", "put off"],
    sensations: "Stomach tense",
    what_it_tells_you: "Something feels wrong.",
    how_it_helps_you: "To name what doesn't fit.",
    reflection_prompt: "What is feeling wrong?",
    why_prompt: "What doesn't fit?",
  },
  boredom: {
    similar_words: ["flat", "indifferent"],
    sensations: "Heavy stillness",
    what_it_tells_you: "Something has lost meaning.",
    how_it_helps_you: "To notice what wants to change.",
    reflection_prompt: "Has something lost its meaning?",
    why_prompt: "Is there something that wants to change?",
  },

  // ── Anger ladder ───────────────────────────────────────────────────────
  rage: {
    similar_words: ["furious", "enraged"],
    sensations: "Heat in chest",
    what_it_tells_you: "A line has been crossed.",
    how_it_helps_you: "To protect what's mine.",
    reflection_prompt: "What line has been crossed?",
    why_prompt: "What do you want to protect?",
  },
  anger: {
    similar_words: ["mad", "frustrated"],
    sensations: "Tense jaw",
    what_it_tells_you: "Something is unfair.",
    how_it_helps_you: "To say what needs saying.",
    reflection_prompt: "What feels unfair?",
    why_prompt: "What needs to be said?",
  },
  annoyance: {
    similar_words: ["irritated", "bothered"],
    sensations: "Friction in body",
    what_it_tells_you: "Something small but real.",
    how_it_helps_you: "To name what's bugging you.",
    reflection_prompt: "What small thing is bothering you?",
    why_prompt: "What's bugging you?",
  },

  // ── Anticipation ladder ────────────────────────────────────────────────
  vigilance: {
    similar_words: ["focused", "intent"],
    sensations: "Alert & ready",
    what_it_tells_you: "Something important is coming.",
    how_it_helps_you: "To prepare with care.",
    reflection_prompt: "What important is coming?",
    why_prompt: "How can you prepare?",
  },
  anticipation: {
    similar_words: ["eager", "looking forward"],
    sensations: "Leaning in",
    what_it_tells_you: "Something is on the horizon.",
    how_it_helps_you: "To get ready.",
    reflection_prompt: "What's on the horizon?",
    why_prompt: "What would help you get ready?",
  },
  interest: {
    similar_words: ["curious", "intrigued"],
    sensations: "Open & engaged",
    what_it_tells_you: "Something is worth attention.",
    how_it_helps_you: "To explore further.",
    reflection_prompt: "What's worth your attention?",
    why_prompt: "What do you want to explore?",
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
