/**
 * Krystal — emotion taxonomy (hardcoded for v0.1).
 *
 * Mirrors the data seeded by supabase/migrations/005_seed_plutchik_minimal.sql.
 * If you change one, change the other.
 *
 * In v0.2 we'll fetch from Supabase instead and drop this file. For now this
 * lets the picker work without auth.
 */

export type EmotionTertiary = {
  /** Stable identifier, lowercase, matches the SQL `name` column. */
  slug: string;
  /** Display label. */
  name: string;
};

export type EmotionSecondary = {
  slug: string;
  name: string;
  tertiaries: EmotionTertiary[];
};

export type EmotionPrimary = {
  slug: string;
  name: string;
  /** Hex color, matches `emotion_categories.color` in the seed. */
  color: string;
  secondaries: EmotionSecondary[];
};

// ─── Helpers ──────────────────────────────────────────────────────────────────

export const findPrimary = (slug: string | undefined): EmotionPrimary | undefined =>
  slug ? EMOTIONS.find((e) => e.slug === slug) : undefined;

export const findSecondary = (
  primarySlug: string | undefined,
  secondarySlug: string | undefined
): EmotionSecondary | undefined =>
  secondarySlug
    ? findPrimary(primarySlug)?.secondaries.find((s) => s.slug === secondarySlug)
    : undefined;

export const findTertiary = (
  primarySlug: string | undefined,
  secondarySlug: string | undefined,
  tertiarySlug: string | undefined
): EmotionTertiary | undefined =>
  tertiarySlug
    ? findSecondary(primarySlug, secondarySlug)?.tertiaries.find(
        (t) => t.slug === tertiarySlug
      )
    : undefined;

// ─── The taxonomy ─────────────────────────────────────────────────────────────

const cap = (s: string) => s.charAt(0).toUpperCase() + s.slice(1);
const tier = (slugs: string[]): EmotionTertiary[] =>
  slugs.map((slug) => ({ slug, name: cap(slug) }));

export const EMOTIONS: EmotionPrimary[] = [
  {
    slug: "joy",
    name: "Joy",
    color: "#E8C547",
    secondaries: [
      { slug: "serenity", name: "Serenity", tertiaries: tier(["content", "peaceful", "at ease"]) },
      { slug: "joy", name: "Joy", tertiaries: tier(["happy", "delighted", "grateful"]) },
      { slug: "ecstasy", name: "Ecstasy", tertiaries: tier(["elated", "overjoyed", "euphoric"]) },
    ],
  },
  {
    slug: "trust",
    name: "Trust",
    color: "#6FAE8E",
    secondaries: [
      { slug: "acceptance", name: "Acceptance", tertiaries: tier(["safe", "open", "accepting"]) },
      { slug: "trust", name: "Trust", tertiaries: tier(["connected", "secure", "supported"]) },
      { slug: "admiration", name: "Admiration", tertiaries: tier(["inspired", "reverent", "awed"]) },
    ],
  },
  {
    slug: "fear",
    name: "Fear",
    color: "#8E6FB5",
    secondaries: [
      { slug: "apprehension", name: "Apprehension", tertiaries: tier(["cautious", "uneasy", "worried"]) },
      { slug: "anxiety", name: "Anxiety", tertiaries: tier(["anxious", "overwhelmed", "on edge"]) },
      { slug: "terror", name: "Terror", tertiaries: tier(["afraid", "panicked", "frozen"]) },
    ],
  },
  {
    slug: "surprise",
    name: "Surprise",
    color: "#6FB5AE",
    secondaries: [
      { slug: "distraction", name: "Distraction", tertiaries: tier(["distracted", "unfocused", "scattered"]) },
      { slug: "surprise", name: "Surprise", tertiaries: tier(["surprised", "startled", "caught off guard"]) },
      { slug: "amazement", name: "Amazement", tertiaries: tier(["astonished", "stunned", "speechless"]) },
    ],
  },
  {
    slug: "sadness",
    name: "Sadness",
    color: "#5B7CC4",
    secondaries: [
      { slug: "pensiveness", name: "Pensiveness", tertiaries: tier(["pensive", "wistful", "reflective"]) },
      { slug: "sadness", name: "Sadness", tertiaries: tier(["sad", "lonely", "disappointed"]) },
      { slug: "grief", name: "Grief", tertiaries: tier(["grieving", "heartbroken", "despairing"]) },
    ],
  },
  {
    slug: "disgust",
    name: "Disgust",
    color: "#A48069",
    secondaries: [
      { slug: "boredom", name: "Boredom", tertiaries: tier(["bored", "disinterested", "flat"]) },
      { slug: "disgust", name: "Disgust", tertiaries: tier(["repulsed", "put off", "uncomfortable"]) },
      { slug: "loathing", name: "Loathing", tertiaries: tier(["revolted", "contemptuous", "disgusted"]) },
    ],
  },
  {
    slug: "anger",
    name: "Anger",
    color: "#C45B5B",
    secondaries: [
      { slug: "annoyance", name: "Annoyance", tertiaries: tier(["annoyed", "irritated", "impatient"]) },
      { slug: "anger", name: "Anger", tertiaries: tier(["angry", "frustrated", "resentful"]) },
      { slug: "rage", name: "Rage", tertiaries: tier(["furious", "enraged", "seething"]) },
    ],
  },
  {
    slug: "anticipation",
    name: "Anticipation",
    color: "#D9985A",
    secondaries: [
      { slug: "interest", name: "Interest", tertiaries: tier(["curious", "intrigued", "attentive"]) },
      { slug: "anticipation", name: "Anticipation", tertiaries: tier(["anticipating", "eager", "hopeful"]) },
      { slug: "vigilance", name: "Vigilance", tertiaries: tier(["focused", "watchful", "intent"]) },
    ],
  },
];
