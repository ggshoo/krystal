/**
 * Krystal — educational content for each Plutchik primary.
 *
 * Surfaced on the Journal screen after the user picks an intensity. Provides
 * the "similar words / sensations / what-it-tells-you / how-it-helps-you"
 * framing. All copy is possibility-framed (never diagnostic).
 *
 * Content lookup is by Plutchik primary slug (sadness, joy, trust, fear,
 * surprise, disgust, anger, anticipation), derived from the user's chosen
 * intensity word via lib/plutchik.ts.
 */

export type PlutchikContent = {
  similar_words: string[];
  sensations: string[];
  what_it_tells_you: string;
  how_it_helps_you: string;
};

export const PLUTCHIK_CONTENT: Record<string, PlutchikContent> = {
  sadness: {
    similar_words: ["sorrow", "grief", "melancholy", "anguish", "heartache"],
    sensations: ["heavy heart", "tight chest", "fatigue", "low energy", "tears"],
    what_it_tells_you:
      "Sadness may be telling you that something or someone important to you has been lost, is changing, or feels out of reach.",
    how_it_helps_you:
      "Sadness can help you process loss, signal a need for comfort, and invite you to slow down and tend to what matters.",
  },
  joy: {
    similar_words: ["happiness", "delight", "elation", "contentment", "bliss"],
    sensations: ["lightness", "warmth in the chest", "energy", "smiling", "openness"],
    what_it_tells_you:
      "Joy may be telling you that something is going well, that you are connected to something meaningful, or that you're in a moment of alignment.",
    how_it_helps_you:
      "Joy can help you build resilience, deepen relationships, and remind you of what brings you life.",
  },
  trust: {
    similar_words: ["acceptance", "safety", "confidence", "faith", "openness"],
    sensations: ["relaxed shoulders", "deep breaths", "warmth in chest", "softness", "ease"],
    what_it_tells_you:
      "Trust may be telling you that you feel safe with someone or something, or that you're allowing yourself to be open.",
    how_it_helps_you:
      "Trust can help you form deeper connections, take healthy risks, and find rest in relationships.",
  },
  fear: {
    similar_words: ["anxiety", "worry", "dread", "apprehension", "unease"],
    sensations: ["tight chest", "racing heart", "shallow breath", "jittery energy", "stomach knots"],
    what_it_tells_you:
      "Fear may be telling you that something important to you feels uncertain, at risk, or that your wellbeing might be threatened.",
    how_it_helps_you:
      "Fear can help you identify risks, prepare for challenges, and clarify what you value enough to want to protect.",
  },
  surprise: {
    similar_words: ["amazement", "astonishment", "wonder", "shock", "startlement"],
    sensations: ["wide eyes", "raised eyebrows", "sudden alertness", "heart racing", "a breath catch"],
    what_it_tells_you:
      "Surprise may be telling you that something unexpected has happened and you're orienting to new information.",
    how_it_helps_you:
      "Surprise can help you pay attention to what you didn't predict, opening you to learning or adjusting.",
  },
  disgust: {
    similar_words: ["aversion", "repulsion", "distaste", "loathing", "revulsion"],
    sensations: ["nausea", "tight stomach", "wrinkled nose", "pulling away", "tightness in throat"],
    what_it_tells_you:
      "Disgust may be telling you that something violates your values, or that you're being asked to accept something that doesn't feel right.",
    how_it_helps_you:
      "Disgust can help you protect yourself from what feels harmful and clarify what you stand for.",
  },
  anger: {
    similar_words: ["frustration", "rage", "irritation", "annoyance", "fury"],
    sensations: ["heat in face", "clenched jaw", "tense muscles", "tight fists", "racing thoughts"],
    what_it_tells_you:
      "Anger may be telling you that a boundary has been crossed, something important has been threatened, or an injustice has occurred.",
    how_it_helps_you:
      "Anger can help you protect what you value, mobilize action, and signal where change is needed.",
  },
  anticipation: {
    similar_words: ["interest", "eagerness", "expectation", "looking forward", "engagement"],
    sensations: ["leaning forward", "alert eyes", "energy", "quickened breath", "open posture"],
    what_it_tells_you:
      "Anticipation may be telling you that something matters to you and is on the horizon, or that you're orienting toward what's next.",
    how_it_helps_you:
      "Anticipation can help you prepare, motivate yourself, and stay engaged with what you care about.",
  },
};

/** Get content for a Plutchik primary slug. */
export function getPlutchikContent(primarySlug?: string): PlutchikContent | null {
  if (!primarySlug) return null;
  return PLUTCHIK_CONTENT[primarySlug] ?? null;
}
