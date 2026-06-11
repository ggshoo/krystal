import { Text, View } from "react-native";
import { Circle, Ellipse, Path, Svg } from "react-native-svg";

/**
 * Krystal — the grape companion.
 *
 * A cute purple grape with big sparkly eyes, rosy cheeks, and a tiny smile.
 * Reflects the user's chosen emotion via:
 *   1. Body color tint (30% blend toward the emotion's primary color)
 *   2. Facial expression (mouth + eye changes)
 *
 * No stem/leaf — Gigi prefers the leafless version. Egg-shaped body, flat
 * illustration style (no photoreal gradients).
 */

const BASE_COLOR = "#9D7BC4";

const TINT_PER_PRIMARY: Record<string, string> = {
  happy: "#E8C547",
  joy: "#E8C547",
  trust: "#88B894",
  fear: "#7B6FB5",
  fearful: "#7B6FB5",
  surprise: "#6FB5AE",
  surprised: "#6FB5AE",
  sad: "#7A9BC7",
  sadness: "#7A9BC7",
  bad: "#88B894",
  disgust: "#A8A8A8",
  disgusted: "#A8A8A8",
  anger: "#E27B7B",
  angry: "#E27B7B",
  anticipation: "#F0B58D",
};

function hexToRgb(hex: string): [number, number, number] {
  return [
    parseInt(hex.slice(1, 3), 16),
    parseInt(hex.slice(3, 5), 16),
    parseInt(hex.slice(5, 7), 16),
  ];
}

function rgbToHex(r: number, g: number, b: number): string {
  return `#${[r, g, b]
    .map((c) => Math.round(c).toString(16).padStart(2, "0"))
    .join("")}`;
}

function mix(c1: string, c2: string, ratio: number): string {
  const [r1, g1, b1] = hexToRgb(c1);
  const [r2, g2, b2] = hexToRgb(c2);
  return rgbToHex(
    r1 + (r2 - r1) * ratio,
    g1 + (g2 - g1) * ratio,
    b1 + (b2 - b1) * ratio
  );
}

type Props = {
  /** The Roberts primary slug (e.g. "happy", "sad"). Controls tint + face. */
  emotionPrimary?: string;
  /** Width in px. Default 80. Height auto-derived. */
  size?: number;
  /**
   * Optional message rendered as a small bubble above the grape — only set
   * this for "special times" (streak milestones, first reflection, etc.).
   * Leave undefined for everyday quiet presence.
   */
  message?: string;
};

type Mood =
  | "default"
  | "joy"
  | "sadness"
  | "fear"
  | "surprise"
  | "anger"
  | "disgust"
  | "trust"
  | "bad"
  | "anticipation";

function moodFromPrimary(primary?: string): Mood {
  switch (primary) {
    case "happy":
    case "joy":
      return "joy";
    case "sad":
    case "sadness":
      return "sadness";
    case "fear":
    case "fearful":
      return "fear";
    case "surprise":
    case "surprised":
      return "surprise";
    case "anger":
    case "angry":
      return "anger";
    case "disgust":
    case "disgusted":
      return "disgust";
    case "trust":
      return "trust";
    case "bad":
      return "bad";
    case "anticipation":
      return "anticipation";
    default:
      return "default";
  }
}

export function GrapeCompanion({
  emotionPrimary,
  size = 80,
  message,
}: Props) {
  const tint = emotionPrimary ? TINT_PER_PRIMARY[emotionPrimary] : null;
  const bodyColor = tint ? mix(BASE_COLOR, tint, 0.3) : BASE_COLOR;

  // Derived shades
  const bodyDeep = mix(bodyColor, "#000000", 0.18);
  const highlight = mix(bodyColor, "#FFFFFF", 0.5);
  const cheek = "#F5A8B3";

  const mood = moodFromPrimary(emotionPrimary);

  return (
    <View className="items-center">
      {/* ── Optional message bubble for special moments ───────────────── */}
      {message && (
        <View
          className="grape-message mb-2 rounded-tile bg-surface px-3 py-1.5"
          style={{
            shadowColor: "#2D2520",
            shadowOpacity: 0.08,
            shadowRadius: 8,
            shadowOffset: { width: 0, height: 2 },
            borderWidth: 1,
            borderColor: bodyColor + "33",
          }}
        >
          <Text className="text-xs font-medium text-ink">{message}</Text>
        </View>
      )}

      {/* ── The grape itself, gently floating ─────────────────────────── */}
      <View className="grape-float">
        <Svg width={size} height={size * 1.15} viewBox="0 0 100 115">
      {/* ── Body — soft egg/teardrop shape ───────────────────────────────── */}
      <Path
        d="M 50 8 C 76 8, 94 32, 94 68 C 94 94, 76 110, 50 110 C 24 110, 6 94, 6 68 C 6 32, 24 8, 50 8 Z"
        fill={bodyColor}
      />

      {/* Big soft highlight on upper-left for that "lit" feel */}
      <Ellipse cx="34" cy="38" rx="14" ry="10" fill={highlight} opacity={0.55} />
      {/* Tiny extra sparkle on the right shoulder */}
      <Ellipse cx="72" cy="32" rx="4" ry="3" fill={highlight} opacity={0.7} />

      {/* ── Eyes ─────────────────────────────────────────────────────────── */}
      {renderEyes(mood)}

      {/* ── Rosy cheeks ──────────────────────────────────────────────────── */}
      <Ellipse cx="26" cy="82" rx="7" ry="3.5" fill={cheek} opacity={0.75} />
      <Ellipse cx="74" cy="82" rx="7" ry="3.5" fill={cheek} opacity={0.75} />

      {/* ── Mouth ────────────────────────────────────────────────────────── */}
      {renderMouth(mood)}

      {/* Subtle deeper shadow on bottom-right for grape roundness */}
      <Ellipse cx="68" cy="98" rx="14" ry="5" fill={bodyDeep} opacity={0.25} />
        </Svg>
      </View>
    </View>
  );
}

// ── Face parts ──────────────────────────────────────────────────────────────

function renderEyes(mood: Mood) {
  // Pupil + white sparkle highlight inside each eye
  const eye = (cx: number, cy: number, r = 7) => (
    <>
      <Circle cx={cx} cy={cy} r={r} fill="#2D2520" />
      {/* Big sparkle highlight */}
      <Circle cx={cx + 1.6} cy={cy - 2} r={r * 0.4} fill="#FFFFFF" />
      {/* Tiny secondary sparkle */}
      <Circle cx={cx - 2} cy={cy + 2} r={r * 0.18} fill="#FFFFFF" />
    </>
  );

  if (mood === "joy") {
    // Closed/smiling arc eyes
    return (
      <>
        <Path
          d="M 30 64 Q 36 58 42 64"
          stroke="#2D2520"
          strokeWidth={3.5}
          fill="none"
          strokeLinecap="round"
        />
        <Path
          d="M 58 64 Q 64 58 70 64"
          stroke="#2D2520"
          strokeWidth={3.5}
          fill="none"
          strokeLinecap="round"
        />
      </>
    );
  }

  if (mood === "surprise") {
    // Wider eyes with white around the pupil
    return (
      <>
        <Circle cx={36} cy={64} r={9} fill="#FFFFFF" stroke="#2D2520" strokeWidth={2} />
        <Circle cx={36} cy={64} r={4} fill="#2D2520" />
        <Circle cx={37} cy={62} r={1.6} fill="#FFFFFF" />
        <Circle cx={64} cy={64} r={9} fill="#FFFFFF" stroke="#2D2520" strokeWidth={2} />
        <Circle cx={64} cy={64} r={4} fill="#2D2520" />
        <Circle cx={65} cy={62} r={1.6} fill="#FFFFFF" />
      </>
    );
  }

  if (mood === "anger") {
    // Big eyes + angled "brows" above
    return (
      <>
        <Path
          d="M 28 56 L 42 60"
          stroke="#2D2520"
          strokeWidth={2.5}
          strokeLinecap="round"
        />
        <Path
          d="M 72 56 L 58 60"
          stroke="#2D2520"
          strokeWidth={2.5}
          strokeLinecap="round"
        />
        {eye(36, 66)}
        {eye(64, 66)}
      </>
    );
  }

  // Default sparkly eyes (sadness, fear, disgust, trust, bad, anticipation, default)
  return (
    <>
      {eye(36, 64)}
      {eye(64, 64)}
    </>
  );
}

function renderMouth(mood: Mood) {
  const STROKE = "#2D2520";
  const W = 2.8;

  switch (mood) {
    case "joy":
      return (
        <Path
          d="M 40 90 Q 50 100 60 90"
          stroke={STROKE}
          strokeWidth={W}
          fill="none"
          strokeLinecap="round"
        />
      );
    case "sadness":
      return (
        <Path
          d="M 40 94 Q 50 86 60 94"
          stroke={STROKE}
          strokeWidth={W}
          fill="none"
          strokeLinecap="round"
        />
      );
    case "surprise":
      return <Ellipse cx={50} cy={92} rx={4} ry={5.5} fill={STROKE} />;
    case "anger":
      return (
        <Path
          d="M 40 92 L 60 92"
          stroke={STROKE}
          strokeWidth={W}
          strokeLinecap="round"
        />
      );
    case "disgust":
      return (
        <Path
          d="M 40 92 Q 47 88 53 92 Q 58 95 60 91"
          stroke={STROKE}
          strokeWidth={W}
          fill="none"
          strokeLinecap="round"
        />
      );
    case "fear":
      return (
        <Path
          d="M 43 92 Q 50 89 57 92"
          stroke={STROKE}
          strokeWidth={W}
          fill="none"
          strokeLinecap="round"
        />
      );
    case "bad":
      return (
        <Path
          d="M 42 92 L 58 92"
          stroke={STROKE}
          strokeWidth={W}
          strokeLinecap="round"
        />
      );
    default:
      // Gentle default smile
      return (
        <Path
          d="M 42 91 Q 50 95 58 91"
          stroke={STROKE}
          strokeWidth={W}
          fill="none"
          strokeLinecap="round"
        />
      );
  }
}
