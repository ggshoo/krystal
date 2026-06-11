import { Text, View } from "react-native";
import { Circle, Ellipse, Path, Svg } from "react-native-svg";

/**
 * Krystal — the grape companion.
 *
 * Cute purple grape with curly stem and single leaf, big sparkly eyes,
 * rosy cheeks, gentle brows, and a soft smile. Reflects the user's
 * emotion via body color tint and per-mood face variations matching
 * the reference illustrations.
 */

const BASE_COLOR = "#9D7BC4";

const TINT_PER_PRIMARY: Record<string, string> = {
  happy: "#9D7BC4",
  joy: "#E8C547",
  trust: "#88B894",
  fear: "#7B6FB5",
  fearful: "#7B6FB5",
  surprise: "#9D7BC4",
  surprised: "#9D7BC4",
  sad: "#7A9BC7",
  sadness: "#7A9BC7",
  bad: "#88B894",
  disgust: "#88B894",
  disgusted: "#88B894",
  anger: "#C45B5B",
  angry: "#C45B5B",
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
  emotionPrimary?: string;
  size?: number;
  message?: string;
};

type Mood =
  | "default"
  | "happy"
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
      return "happy";
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

  const highlight = mix(bodyColor, "#FFFFFF", 0.6);
  const browColor = mix(bodyColor, "#000000", 0.6);
  const cheek = "#F5A0A8";
  const stemColor = "#5C6F4F";
  const leafColor = "#7BAE7E";

  const mood = moodFromPrimary(emotionPrimary);

  return (
    <View className="items-center">
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

      <View className="grape-float">
        <Svg width={size} height={size * 1.3} viewBox="0 0 100 130">
          {/* Curly stem + leaf */}
          <Path
            d="M 50 18 Q 52 8 58 10"
            stroke={stemColor}
            strokeWidth={2.5}
            fill="none"
            strokeLinecap="round"
          />
          <Path
            d="M 58 10 Q 70 4 75 13 Q 67 17 58 10 Z"
            fill={leafColor}
          />

          {/* Body */}
          <Path
            d="M 50 20 C 76 22, 96 46, 96 82 C 96 108, 78 124, 50 124 C 22 124, 4 108, 4 82 C 4 46, 24 22, 50 20 Z"
            fill={bodyColor}
          />

          {/* Highlights */}
          <Ellipse cx="33" cy="48" rx="11" ry="14" fill={highlight} opacity={0.55} />
          <Ellipse cx="70" cy="42" rx="6" ry="5" fill={highlight} opacity={0.65} />
          <Ellipse cx="20" cy="85" rx="5" ry="6" fill={highlight} opacity={0.35} />
          <Ellipse cx="78" cy="98" rx="8" ry="5" fill={highlight} opacity={0.3} />

          {renderBrows(mood, browColor)}
          {renderEyes(mood)}

          <Ellipse cx="26" cy="92" rx="7.5" ry="4" fill={cheek} opacity={mood === "happy" ? 0.85 : 0.72} />
          <Ellipse cx="74" cy="92" rx="7.5" ry="4" fill={cheek} opacity={mood === "happy" ? 0.85 : 0.72} />

          {renderMouth(mood)}
          {mood === "sadness" && renderTear()}
        </Svg>
      </View>
    </View>
  );
}

// ─── Brows ──────────────────────────────────────────────────────────────────
function renderBrows(mood: Mood, color: string) {
  const W = 2;

  if (mood === "happy") {
    return (
      <>
        <Path d="M 28 56 Q 36 51 44 56" stroke={color} strokeWidth={W} fill="none" strokeLinecap="round" />
        <Path d="M 56 56 Q 64 51 72 56" stroke={color} strokeWidth={W} fill="none" strokeLinecap="round" />
      </>
    );
  }
  if (mood === "surprise") {
    // Lifted, gently arched
    return (
      <>
        <Path d="M 28 52 Q 36 47 44 52" stroke={color} strokeWidth={W} fill="none" strokeLinecap="round" />
        <Path d="M 56 52 Q 64 47 72 52" stroke={color} strokeWidth={W} fill="none" strokeLinecap="round" />
      </>
    );
  }
  if (mood === "fear") {
    // Worried — inner corners raised, outer corners dropped (/ \)
    return (
      <>
        <Path d="M 28 62 Q 36 56 44 52" stroke={color} strokeWidth={W + 0.3} fill="none" strokeLinecap="round" />
        <Path d="M 56 52 Q 64 56 72 62" stroke={color} strokeWidth={W + 0.3} fill="none" strokeLinecap="round" />
      </>
    );
  }
  if (mood === "anger") {
    // Dramatic angled down-inward (\ /), thicker
    return (
      <>
        <Path d="M 26 54 L 46 66" stroke={color} strokeWidth={W + 1.5} strokeLinecap="round" />
        <Path d="M 74 54 L 54 66" stroke={color} strokeWidth={W + 1.5} strokeLinecap="round" />
      </>
    );
  }
  if (mood === "disgust") {
    // Asymmetric — left dropped & angled, right raised & arched (judgmental)
    return (
      <>
        <Path d="M 26 56 L 46 62" stroke={color} strokeWidth={W + 0.5} strokeLinecap="round" />
        <Path d="M 56 54 Q 64 48 72 54" stroke={color} strokeWidth={W + 0.3} fill="none" strokeLinecap="round" />
      </>
    );
  }
  if (mood === "bad") {
    // Relaxed flat, drooped slightly
    return (
      <>
        <Path d="M 28 60 Q 36 62 44 60" stroke={color} strokeWidth={W} fill="none" strokeLinecap="round" />
        <Path d="M 56 60 Q 64 62 72 60" stroke={color} strokeWidth={W} fill="none" strokeLinecap="round" />
      </>
    );
  }
  if (mood === "sadness") {
    // Classic sad — outer corners HIGH, inner corners LOW (opposite of fear)
    return (
      <>
        <Path d="M 28 56 Q 36 60 44 60" stroke={color} strokeWidth={W + 0.3} fill="none" strokeLinecap="round" />
        <Path d="M 56 60 Q 64 60 72 56" stroke={color} strokeWidth={W + 0.3} fill="none" strokeLinecap="round" />
      </>
    );
  }

  // Default + trust + anticipation
  return (
    <>
      <Path d="M 28 60 Q 36 56 44 60" stroke={color} strokeWidth={W} fill="none" strokeLinecap="round" />
      <Path d="M 56 60 Q 64 56 72 60" stroke={color} strokeWidth={W} fill="none" strokeLinecap="round" />
    </>
  );
}

// ─── Eyes ───────────────────────────────────────────────────────────────────
function renderEyes(mood: Mood) {
  // Default: big sparkly empathetic eyes
  const eye = (cx: number, cy: number) => (
    <>
      <Ellipse cx={cx} cy={cy} rx={8} ry={9.5} fill="#2D2520" />
      <Circle cx={cx + 2.5} cy={cy - 3} r={3} fill="#FFFFFF" />
      <Circle cx={cx - 2.5} cy={cy + 3} r={1.4} fill="#FFFFFF" />
    </>
  );

  if (mood === "happy") {
    // Closed smiling arcs
    return (
      <>
        <Path d="M 28 73 Q 36 66 44 73" stroke="#2D2520" strokeWidth={3} fill="none" strokeLinecap="round" />
        <Path d="M 56 73 Q 64 66 72 73" stroke="#2D2520" strokeWidth={3} fill="none" strokeLinecap="round" />
      </>
    );
  }

  if (mood === "surprise") {
    // Wide round eyes with visible whites
    return (
      <>
        <Ellipse cx={36} cy={73} rx={9} ry={11} fill="#FFFFFF" stroke="#2D2520" strokeWidth={1.8} />
        <Circle cx={36} cy={74} r={4.5} fill="#2D2520" />
        <Circle cx={37.5} cy={72} r={1.6} fill="#FFFFFF" />
        <Ellipse cx={64} cy={73} rx={9} ry={11} fill="#FFFFFF" stroke="#2D2520" strokeWidth={1.8} />
        <Circle cx={64} cy={74} r={4.5} fill="#2D2520" />
        <Circle cx={65.5} cy={72} r={1.6} fill="#FFFFFF" />
      </>
    );
  }

  if (mood === "fear") {
    // Wider eyes with whites + small pupils (anxious)
    return (
      <>
        <Ellipse cx={36} cy={73} rx={8} ry={10} fill="#FFFFFF" stroke="#2D2520" strokeWidth={1.5} />
        <Circle cx={36} cy={75} r={3.8} fill="#2D2520" />
        <Circle cx={37} cy={73} r={1.3} fill="#FFFFFF" />
        <Ellipse cx={64} cy={73} rx={8} ry={10} fill="#FFFFFF" stroke="#2D2520" strokeWidth={1.5} />
        <Circle cx={64} cy={75} r={3.8} fill="#2D2520" />
        <Circle cx={65} cy={73} r={1.3} fill="#FFFFFF" />
      </>
    );
  }

  if (mood === "anger") {
    // Narrowed/squinted angry eyes — smaller, slightly tilted
    return (
      <>
        <Ellipse cx={36} cy={74} rx={6.5} ry={6} fill="#2D2520" />
        <Circle cx={37.5} cy={72} r={2} fill="#FFFFFF" />
        <Ellipse cx={64} cy={74} rx={6.5} ry={6} fill="#2D2520" />
        <Circle cx={65.5} cy={72} r={2} fill="#FFFFFF" />
      </>
    );
  }

  if (mood === "disgust") {
    // Half-lidded sceptical — upper portion covered with body-color overlay
    return (
      <>
        {eye(36, 76)}
        {eye(64, 76)}
        {/* Half-lid overlays — clip the top of the eyes */}
        <Path
          d="M 26 68 Q 36 73 46 68 L 46 72 L 26 72 Z"
          fill="#9D7BC4"
          opacity={0.95}
        />
        <Path
          d="M 54 68 Q 64 73 74 68 L 74 72 L 54 72 Z"
          fill="#9D7BC4"
          opacity={0.95}
        />
      </>
    );
  }

  if (mood === "bad") {
    // Droopy half-closed exhausted eyes
    return (
      <>
        {eye(36, 76)}
        {eye(64, 76)}
        {/* Droopy upper lids covering top half */}
        <Path
          d="M 26 68 Q 36 74 46 68 L 46 75 L 26 75 Z"
          fill="#9D7BC4"
          opacity={0.95}
        />
        <Path
          d="M 54 68 Q 64 74 74 68 L 74 75 L 54 75 Z"
          fill="#9D7BC4"
          opacity={0.95}
        />
        {/* Soft dark line on the lid edge */}
        <Path d="M 26 71 Q 36 75 46 71" stroke="#2D2520" strokeWidth={1.5} fill="none" strokeLinecap="round" opacity={0.4} />
        <Path d="M 54 71 Q 64 75 74 71" stroke="#2D2520" strokeWidth={1.5} fill="none" strokeLinecap="round" opacity={0.4} />
      </>
    );
  }

  if (mood === "sadness") {
    // Slightly droopy eyes
    return (
      <>
        {eye(36, 74)}
        {eye(64, 74)}
        {/* Gentle lower-eye-lid line implying tear welling */}
        <Path d="M 27 78 Q 36 80 45 78" stroke="#2D2520" strokeWidth={1.2} fill="none" strokeLinecap="round" opacity={0.5} />
        <Path d="M 55 78 Q 64 80 73 78" stroke="#2D2520" strokeWidth={1.2} fill="none" strokeLinecap="round" opacity={0.5} />
      </>
    );
  }

  // Default + trust + anticipation
  return (
    <>
      {eye(36, 72)}
      {eye(64, 72)}
    </>
  );
}

// ─── Tear (sadness only) ────────────────────────────────────────────────────
function renderTear() {
  return (
    <>
      {/* Teardrop coming down from right eye */}
      <Path
        d="M 68 80 Q 64 86 67 90 Q 70 86 68 80 Z"
        fill="#7BCDEF"
        opacity={0.9}
      />
      <Path
        d="M 67 82 Q 67 84 68 84"
        stroke="#FFFFFF"
        strokeWidth={0.8}
        fill="none"
        opacity={0.7}
      />
    </>
  );
}

// ─── Mouth ──────────────────────────────────────────────────────────────────
function renderMouth(mood: Mood) {
  const STROKE = "#2D2520";

  if (mood === "happy") {
    // Open joyful smile with red interior + tiny tooth highlight
    return (
      <>
        <Path
          d="M 38 94 Q 50 91 62 94 Q 60 110 50 112 Q 40 110 38 94 Z"
          fill="#C45B5B"
        />
        <Path
          d="M 38 94 Q 50 91 62 94"
          stroke={STROKE}
          strokeWidth={3}
          fill="none"
          strokeLinecap="round"
        />
        <Path
          d="M 44 93 Q 50 92 56 93"
          stroke="#FFFFFF"
          strokeWidth={2}
          fill="none"
          strokeLinecap="round"
          opacity={0.6}
        />
      </>
    );
  }

  if (mood === "surprise") {
    // Small open "O" — soft oh
    return (
      <Ellipse cx={50} cy={101} rx={4.5} ry={5.8} fill="#C45B5B" stroke="#2D2520" strokeWidth={1.8} />
    );
  }

  if (mood === "fear") {
    // Small worried open mouth — wider than tall
    return (
      <Ellipse cx={50} cy={101} rx={5} ry={4} fill="#C45B5B" stroke="#2D2520" strokeWidth={1.8} />
    );
  }

  if (mood === "anger") {
    // Gritted teeth zigzag
    return (
      <>
        <Path
          d="M 38 98 L 42 102 L 46 98 L 50 102 L 54 98 L 58 102 L 62 98"
          stroke={STROKE}
          strokeWidth={2.8}
          fill="none"
          strokeLinejoin="round"
          strokeLinecap="round"
        />
        {/* Lower lip line */}
        <Path
          d="M 38 98 Q 50 105 62 98"
          stroke={STROKE}
          strokeWidth={2.5}
          fill="none"
          strokeLinecap="round"
        />
      </>
    );
  }

  if (mood === "disgust") {
    // Asymmetric curl — left side up, right side down
    return (
      <Path
        d="M 38 100 Q 44 96 50 100 Q 56 105 62 99"
        stroke={STROKE}
        strokeWidth={2.8}
        fill="none"
        strokeLinecap="round"
      />
    );
  }

  if (mood === "bad") {
    // Flat tiny line, very slight downturn
    return (
      <Path
        d="M 42 102 Q 50 103.5 58 102"
        stroke={STROKE}
        strokeWidth={2.8}
        fill="none"
        strokeLinecap="round"
      />
    );
  }

  if (mood === "sadness") {
    // Small frown — slight downward curve at corners
    return (
      <Path
        d="M 42 104 Q 50 99 58 104"
        stroke={STROKE}
        strokeWidth={2.8}
        fill="none"
        strokeLinecap="round"
      />
    );
  }

  // Default + trust + anticipation: gentle smile
  return (
    <Path
      d="M 42 101 Q 50 106 58 101"
      stroke={STROKE}
      strokeWidth={2.8}
      fill="none"
      strokeLinecap="round"
    />
  );
}
