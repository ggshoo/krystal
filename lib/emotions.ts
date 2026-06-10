/**
 * Krystal — emotion taxonomy (Geoffrey Roberts emotion wheel).
 *
 * 7 primaries (happy, surprised, bad, fearful, angry, disgusted, sad).
 * Each primary has a variable number of secondaries (4–9).
 * Each secondary has 2 tertiaries.
 *
 * Sourced from the wheel image at https://feelingswheel.com/ (Geoffrey Roberts).
 *
 * If you edit this, mirror the change to the SQL seed migration
 * (supabase/migrations/006_replace_taxonomy.sql) so the database stays in sync.
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

const cap = (s: string) =>
  s
    .split(" ")
    .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
    .join(" ");
const tier = (slugs: string[]): EmotionTertiary[] =>
  slugs.map((slug) => ({ slug, name: cap(slug) }));

export const EMOTIONS: EmotionPrimary[] = [
  {
    slug: "happy",
    name: "Happy",
    color: "#F5D547",
    secondaries: [
      { slug: "playful", name: "Playful", tertiaries: tier(["aroused", "cheeky"]) },
      { slug: "content", name: "Content", tertiaries: tier(["free", "joyful"]) },
      { slug: "interested", name: "Interested", tertiaries: tier(["curious", "inquisitive"]) },
      { slug: "proud", name: "Proud", tertiaries: tier(["successful", "confident"]) },
      { slug: "accepted", name: "Accepted", tertiaries: tier(["respected", "valued"]) },
      { slug: "powerful", name: "Powerful", tertiaries: tier(["courageous", "creative"]) },
      { slug: "peaceful", name: "Peaceful", tertiaries: tier(["loving", "thankful"]) },
      { slug: "trusting", name: "Trusting", tertiaries: tier(["sensitive", "intimate"]) },
      { slug: "optimistic", name: "Optimistic", tertiaries: tier(["hopeful", "inspired"]) },
    ],
  },
  {
    slug: "surprised",
    name: "Surprised",
    color: "#B19CD9",
    secondaries: [
      { slug: "excited", name: "Excited", tertiaries: tier(["energetic", "eager"]) },
      { slug: "amazed", name: "Amazed", tertiaries: tier(["awe", "astonished"]) },
      { slug: "confused", name: "Confused", tertiaries: tier(["perplexed", "disillusioned"]) },
      { slug: "startled", name: "Startled", tertiaries: tier(["dismayed", "shocked"]) },
    ],
  },
  {
    slug: "bad",
    name: "Bad",
    color: "#88B894",
    secondaries: [
      { slug: "bored", name: "Bored", tertiaries: tier(["indifferent", "apathetic"]) },
      { slug: "busy", name: "Busy", tertiaries: tier(["pressured", "rushed"]) },
      { slug: "stressed", name: "Stressed", tertiaries: tier(["overwhelmed", "out of control"]) },
      { slug: "tired", name: "Tired", tertiaries: tier(["sleepy", "unfocused"]) },
    ],
  },
  {
    slug: "fearful",
    name: "Fearful",
    color: "#F0B58D",
    secondaries: [
      { slug: "scared", name: "Scared", tertiaries: tier(["helpless", "frightened"]) },
      { slug: "anxious", name: "Anxious", tertiaries: tier(["overwhelmed", "worried"]) },
      { slug: "insecure", name: "Insecure", tertiaries: tier(["inadequate", "inferior"]) },
      { slug: "weak", name: "Weak", tertiaries: tier(["worthless", "insignificant"]) },
      { slug: "rejected", name: "Rejected", tertiaries: tier(["excluded", "persecuted"]) },
      { slug: "threatened", name: "Threatened", tertiaries: tier(["nervous", "exposed"]) },
    ],
  },
  {
    slug: "angry",
    name: "Angry",
    color: "#E27B7B",
    secondaries: [
      { slug: "let down", name: "Let Down", tertiaries: tier(["betrayed", "resentful"]) },
      { slug: "humiliated", name: "Humiliated", tertiaries: tier(["disrespected", "ridiculed"]) },
      { slug: "bitter", name: "Bitter", tertiaries: tier(["indignant", "violated"]) },
      { slug: "mad", name: "Mad", tertiaries: tier(["furious", "jealous"]) },
      { slug: "aggressive", name: "Aggressive", tertiaries: tier(["provoked", "hostile"]) },
      { slug: "frustrated", name: "Frustrated", tertiaries: tier(["infuriated", "annoyed"]) },
      { slug: "distant", name: "Distant", tertiaries: tier(["withdrawn", "numb"]) },
      { slug: "critical", name: "Critical", tertiaries: tier(["sceptical", "dismissive"]) },
    ],
  },
  {
    slug: "disgusted",
    name: "Disgusted",
    color: "#A8A8A8",
    secondaries: [
      { slug: "disapproving", name: "Disapproving", tertiaries: tier(["judgmental", "embarrassed"]) },
      { slug: "disappointed", name: "Disappointed", tertiaries: tier(["appalled", "revolted"]) },
      { slug: "awful", name: "Awful", tertiaries: tier(["nauseated", "detestable"]) },
      { slug: "repelled", name: "Repelled", tertiaries: tier(["horrified", "hesitant"]) },
    ],
  },
  {
    slug: "sad",
    name: "Sad",
    color: "#7A9BC7",
    secondaries: [
      { slug: "hurt", name: "Hurt", tertiaries: tier(["embarrassed", "disappointed"]) },
      { slug: "depressed", name: "Depressed", tertiaries: tier(["inferior", "empty"]) },
      { slug: "guilty", name: "Guilty", tertiaries: tier(["remorseful", "ashamed"]) },
      { slug: "despair", name: "Despair", tertiaries: tier(["powerless", "grief"]) },
      { slug: "vulnerable", name: "Vulnerable", tertiaries: tier(["fragile", "victimised"]) },
      { slug: "lonely", name: "Lonely", tertiaries: tier(["isolated", "abandoned"]) },
    ],
  },
];
