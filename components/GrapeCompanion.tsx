import { Text, View } from "react-native";
import { Circle, Ellipse, Path, Svg } from "react-native-svg";

/**
 * Krystal — the grape companion.
 *
 * A cute purple grape with a curly stem and small leaf, big sparkly eyes,
 * rosy cheeks, and a soft smile. Reflects emotion via body color tint and
 * facial expression. Subtle occasional float via CSS keyframes (see global.css).
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
  /** Roberts primary slug (e.g. "happy", "sad"). Controls tint + face. */
  emotionPrimary?: string;
  /** Width in px. Default 80. Height auto-derived. */
  size?: number;
  /**
   * Optional message bubble above the grape. Set only for "special times"
   * (streak milestones, first reflection, etc.). Leave undefined for the
   * default quiet presence.
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
  const highlight = mix(bodyColor, "#FFFFFF", 0.55);
  const cheek = "#F5A0A8";
  const stemColor = "#5C6F4F";
  const leafColor = "#7BAE7E";
  const leafVein = "#5C8D5F";

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
        <Svg width={size} height={size * 1.3} viewBox="0 0 100 130">
          {/* ── Curly stem ──────────────────────────────────────────── */}
          <Path
            d="M 50 18 Q 52 8 58 10"
            stroke={stemColor}
            strokeWidth={2.8}
            fill="none"
            strokeLinecap="round"
          />

          {/* ── Single small leaf ───────────────────────────────────── */}
          <Path
            d="M 58 10 Q 70 4 76 14 Q 68 18 58 10 Z"
            fill={leafColor}
          />
          {/* Leaf vein */}
          <Path
            d="M 60 11 Q 67 12 73 14"
            stroke={leafVein}
            strokeWidth={1.2}
            fill="none"
            strokeLinecap="round"
          />

          {/* ── Body — soft rounded teardrop ────────────────────────── */}
          <Path
            d="M 50 22 C 78 22, 96 46, 96 82 C 96 108, 78 124, 50 124 C 22 124, 4 108, 4 82 C 4 46, 22 22, 50 22 Z"
            fill={bodyColor}
          />

          {/* ── Multiple glossy highlights for that real-grape look ── */}
          {/* Main upper-left highlight */}
          <Ellipse
            cx="33"
            cy="48"
            rx="11"
            ry="14"
            fill={highlight}
            opacity={0.55}
          />
          {/* Right shoulder shine */}
          <Ellipse
            cx="70"
            cy="42"
            rx="6"
            ry="5"
            fill={highlight}
            opacity={0.65}
          />
          {/* Small left mid-body */}
          <Ellipse
            cx="20"
            cy="85"
            rx="5"
            ry="6"
            fill={highlight}
            opacity={0.35}
          />
          {/* Lower-right glow */}
          <Ellipse
            cx="78"
            cy="98"
            rx="8"
            ry="5"
            fill={highlight}
            opacity={0.3}
          />

          {/* ── Eyes ────────────────────────────────────────────────── */}
          {renderEyes(mood)}

          {/* ── Rosy cheeks ─────────────────────────────────────────── */}
          <Ellipse
            cx="26"
            cy="92"
            rx="7"
            ry="3.8"
            fill={cheek}
            opacity={0.72}
          />
          <Ellipse
            cx="74"
            cy="92"
            rx="7"
            ry="3.8"
            fill={cheek}
            opacity={0.72}
          />

          {/* ── Mouth ───────────────────────────────────────────────── */}
          {renderMouth(mood)}
        </Svg>
      </View>
    </View>
  );
}

// ── Face parts ──────────────────────────────────────────────────────────────

// Eyes stay consistent across all moods — big kind sparkly eyes. The grape
// listens the same way whether the user is grieving or elated. Empathy is
// in the eyes; the mood difference is only in the mouth.
function renderEyes(_mood: Mood) {
  const eye = (cx: number, cy: number) => (
    <>
      <Ellipse cx={cx} cy={cy} rx={8} ry={9.5} fill="#2D2520" />
      <Circle cx={cx + 2.5} cy={cy - 3} r={3} fill="#FFFFFF" />
      <Circle cx={cx - 2.5} cy={cy + 3} r={1.4} fill="#FFFFFF" />
    </>
  );
  return (
    <>
      {eye(36, 72)}
      {eye(64, 72)}
    </>
  );
}

// Mouth — VERY subtle differences per mood. Mostly the gentle baseline smile
// with small shifts in curve. Never frowning hard, never wide-open shock.
// The grape stays warm; the mood is just a quiet acknowledgment.
function renderMouth(mood: Mood) {
  const STROKE = "#2D2520";
  const W = 2.8;

  // All paths share the same baseline anchors so the mouth size stays
  // consistent — only the middle control point shifts a few px.
  const path = (() => {
    switch (mood) {
      case "joy":
        // Slightly more curved smile
        return "M 41 100 Q 50 108 59 100";
      case "trust":
      case "anticipation":
        return "M 42 101 Q 50 106 58 101";
      case "sadness":
        // Very gentle softening — almost flat with a tiny downturn
        return "M 42 103 Q 50 101 58 103";
      case "fear":
        // Slight uneven softening
        return "M 43 102 Q 50 100 57 102";
      case "anger":
        // Flatter, less curve
        return "M 42 102 Q 50 103 58 102";
      case "disgust":
        // Tiny asymmetric wave
        return "M 42 102 Q 47 100 52 102 Q 56 103 58 101";
      case "bad":
        // Mostly flat baseline
        return "M 42 102 Q 50 103 58 102";
      case "surprise":
        // Slightly parted, but not "O" shape — just smaller curve
        return "M 44 101 Q 50 105 56 101";
      default:
        return "M 42 101 Q 50 106 58 101";
    }
  })();

  return (
    <Path
      d={path}
      stroke={STROKE}
      strokeWidth={W}
      fill="none"
      strokeLinecap="round"
    />
  );
}
