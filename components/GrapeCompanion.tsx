import { Text, View } from "react-native";
import {
  Circle,
  Defs,
  Ellipse,
  Path,
  RadialGradient,
  Stop,
  Svg,
} from "react-native-svg";

/**
 * Krystal — the grape companion.
 *
 * Cute purple grape with glossy 3D-style shading (radial gradients on the
 * body and cheeks), curly stem with single leaf, big sparkly eyes, gentle
 * brows. Per-mood face variations match the reference illustrations.
 *
 * The grape can be reused as a "helpdesk" character in future help flows.
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
  /**
   * Specific Plutchik intensity word (e.g. "pensiveness", "sadness", "grief").
   * Used to vary the face per intensity level — currently powers low-intensity
   * sadness (pensiveness) as a subtle melancholy look distinct from grief.
   */
  plutchikEmotion?: string;
  size?: number;
  message?: string;
};

type Mood =
  | "default"
  | "happy"
  | "sadnessLow" // pensiveness — subtle melancholy
  | "sadness" // sadness / grief — current sad version with tear
  | "fear"
  | "surprise"
  | "anger"
  | "disgust"
  | "trust"
  | "bad"
  | "anticipation";

function moodFromPrimary(primary?: string, intensity?: string): Mood {
  switch (primary) {
    case "happy":
    case "joy":
      return "happy";
    case "sad":
    case "sadness":
      // Low-intensity sadness (pensiveness) gets the subtle melancholy look.
      // Mid (sadness) and high (grief) get the regular sad face + tear.
      if (intensity === "pensiveness") return "sadnessLow";
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
  plutchikEmotion,
  size = 80,
  message,
}: Props) {
  const tint = emotionPrimary ? TINT_PER_PRIMARY[emotionPrimary] : null;
  const bodyColor = tint ? mix(BASE_COLOR, tint, 0.3) : BASE_COLOR;

  // Shading palette for the glossy body
  const bodyLight = mix(bodyColor, "#FFFFFF", 0.4);
  const bodyMid = bodyColor;
  const bodyDark = mix(bodyColor, "#000000", 0.28);
  const bodyVignette = mix(bodyColor, "#000000", 0.45);

  const browColor = mix(bodyColor, "#000000", 0.6);
  const cheekBright = "#FFB5C0";
  const cheekDeep = "#E07684";

  // Brown wooden stem (matches the reference's twiggy stalk look)
  const stemColor = "#7A5A3C";
  const stemDark = "#553D26";
  // Two leaf shades — a brighter front leaf and a deeper back leaf
  const leafColor = "#7BAE7E";
  const leafDark = "#4F8254";

  const mood = moodFromPrimary(emotionPrimary, plutchikEmotion);

  // Unique gradient IDs per instance avoid collisions when multiple grapes
  // share a screen (e.g., Home + future helpdesk).
  const gid = (key: string) =>
    `grape-${key}-${(emotionPrimary || "x").replace(/\W/g, "")}`;

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
          <Defs>
            {/* Body — radial gradient from upper-left highlight to bottom-right shadow */}
            <RadialGradient
              id={gid("body")}
              cx="35%"
              cy="32%"
              rx="75%"
              ry="80%"
              fx="32%"
              fy="28%"
            >
              <Stop offset="0%" stopColor={bodyLight} stopOpacity="1" />
              <Stop offset="45%" stopColor={bodyMid} stopOpacity="1" />
              <Stop offset="100%" stopColor={bodyDark} stopOpacity="1" />
            </RadialGradient>

            {/* Big upper-left highlight — fades to transparent */}
            <RadialGradient id={gid("hl1")} cx="50%" cy="50%" r="50%">
              <Stop offset="0%" stopColor="#FFFFFF" stopOpacity="0.85" />
              <Stop offset="60%" stopColor="#FFFFFF" stopOpacity="0.3" />
              <Stop offset="100%" stopColor="#FFFFFF" stopOpacity="0" />
            </RadialGradient>

            {/* Smaller right-shoulder shine */}
            <RadialGradient id={gid("hl2")} cx="50%" cy="50%" r="50%">
              <Stop offset="0%" stopColor="#FFFFFF" stopOpacity="0.75" />
              <Stop offset="100%" stopColor="#FFFFFF" stopOpacity="0" />
            </RadialGradient>

            {/* Bottom vignette for grounding */}
            <RadialGradient
              id={gid("vignette")}
              cx="50%"
              cy="95%"
              rx="60%"
              ry="40%"
            >
              <Stop offset="0%" stopColor={bodyVignette} stopOpacity="0.5" />
              <Stop offset="100%" stopColor={bodyVignette} stopOpacity="0" />
            </RadialGradient>

            {/* Cheek — soft pink radial */}
            <RadialGradient id={gid("cheek")} cx="50%" cy="50%" r="50%">
              <Stop offset="0%" stopColor={cheekBright} stopOpacity="0.95" />
              <Stop offset="60%" stopColor={cheekDeep} stopOpacity="0.5" />
              <Stop offset="100%" stopColor={cheekDeep} stopOpacity="0" />
            </RadialGradient>

            {/* Eye pupil — slight inner gradient for shininess */}
            <RadialGradient id={gid("eye")} cx="55%" cy="35%" r="65%">
              <Stop offset="0%" stopColor="#4A3F45" stopOpacity="1" />
              <Stop offset="100%" stopColor="#1A1015" stopOpacity="1" />
            </RadialGradient>

            {/* Stem */}
            <RadialGradient id={gid("stem")} cx="40%" cy="40%" r="80%">
              <Stop offset="0%" stopColor={stemColor} stopOpacity="1" />
              <Stop offset="100%" stopColor={stemDark} stopOpacity="1" />
            </RadialGradient>

            {/* Leaf */}
            <RadialGradient id={gid("leaf")} cx="35%" cy="35%" r="70%">
              <Stop offset="0%" stopColor={leafColor} stopOpacity="1" />
              <Stop offset="100%" stopColor={leafDark} stopOpacity="1" />
            </RadialGradient>
          </Defs>

          {/* Brown twiggy stem — short upright stalk with a curly tendril */}
          <Path
            d="M 50 20 L 50 8"
            stroke={`url(#${gid("stem")})`}
            strokeWidth={3}
            fill="none"
            strokeLinecap="round"
          />
          <Path
            d="M 50 10 Q 47 6 50 4"
            stroke={`url(#${gid("stem")})`}
            strokeWidth={2}
            fill="none"
            strokeLinecap="round"
          />

          {/* Back leaf — darker green, sits behind */}
          <Path
            d="M 50 12 Q 38 4 32 12 Q 38 18 50 14 Z"
            fill={leafDark}
            opacity={0.95}
          />
          <Path
            d="M 36 11 Q 42 12 48 13"
            stroke="#3A6B40"
            strokeWidth={0.7}
            fill="none"
            opacity={0.6}
          />

          {/* Front leaf — brighter green, sits in front, points right */}
          <Path
            d="M 50 10 Q 64 2 72 11 Q 64 17 50 12 Z"
            fill={`url(#${gid("leaf")})`}
          />
          <Path
            d="M 54 10 Q 62 11 68 13"
            stroke={leafDark}
            strokeWidth={0.7}
            fill="none"
            opacity={0.5}
          />

          {/* Body with radial gradient — gives that 3D sphere feel */}
          <Path
            d="M 50 20 C 76 22, 96 46, 96 82 C 96 108, 78 124, 50 124 C 22 124, 4 108, 4 82 C 4 46, 24 22, 50 20 Z"
            fill={`url(#${gid("body")})`}
          />

          {/* Bottom vignette for depth */}
          <Ellipse
            cx="50"
            cy="115"
            rx="46"
            ry="18"
            fill={`url(#${gid("vignette")})`}
          />

          {/* Big soft upper-left highlight — gradient ellipse for smooth falloff */}
          <Ellipse
            cx="32"
            cy="46"
            rx="16"
            ry="20"
            fill={`url(#${gid("hl1")})`}
          />

          {/* Right shoulder shine */}
          <Ellipse
            cx="70"
            cy="38"
            rx="8"
            ry="8"
            fill={`url(#${gid("hl2")})`}
          />

          {/* Small ambient highlights */}
          <Ellipse cx="18" cy="80" rx="6" ry="9" fill={`url(#${gid("hl2")})`} opacity={0.4} />
          <Ellipse cx="82" cy="92" rx="9" ry="6" fill={`url(#${gid("hl2")})`} opacity={0.35} />

          {/* Pink rim glow (subsurface scattering effect) */}
          <Ellipse cx="50" cy="116" rx="42" ry="8" fill="#F5A0A8" opacity={0.15} />

          {renderBrows(mood, browColor)}
          {renderEyes(mood, gid, bodyColor)}

          {/* Cheeks with gradient for soft falloff — bright rosy by default,
              fullest on happy. The default face needs that pleasant blush. */}
          <Ellipse cx="26" cy="92" rx="8.5" ry="4.8" fill={`url(#${gid("cheek")})`} opacity={mood === "happy" || mood === "default" ? 1 : 0.85} />
          <Ellipse cx="74" cy="92" rx="8.5" ry="4.8" fill={`url(#${gid("cheek")})`} opacity={mood === "happy" || mood === "default" ? 1 : 0.85} />

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
    return (
      <>
        <Path d="M 28 52 Q 36 47 44 52" stroke={color} strokeWidth={W} fill="none" strokeLinecap="round" />
        <Path d="M 56 52 Q 64 47 72 52" stroke={color} strokeWidth={W} fill="none" strokeLinecap="round" />
      </>
    );
  }
  if (mood === "fear") {
    return (
      <>
        <Path d="M 28 62 Q 36 56 44 52" stroke={color} strokeWidth={W + 0.3} fill="none" strokeLinecap="round" />
        <Path d="M 56 52 Q 64 56 72 62" stroke={color} strokeWidth={W + 0.3} fill="none" strokeLinecap="round" />
      </>
    );
  }
  if (mood === "anger") {
    return (
      <>
        <Path d="M 26 54 L 46 66" stroke={color} strokeWidth={W + 1.5} strokeLinecap="round" />
        <Path d="M 74 54 L 54 66" stroke={color} strokeWidth={W + 1.5} strokeLinecap="round" />
      </>
    );
  }
  if (mood === "disgust") {
    return (
      <>
        <Path d="M 26 56 L 46 62" stroke={color} strokeWidth={W + 0.5} strokeLinecap="round" />
        <Path d="M 56 54 Q 64 48 72 54" stroke={color} strokeWidth={W + 0.3} fill="none" strokeLinecap="round" />
      </>
    );
  }
  if (mood === "bad") {
    return (
      <>
        <Path d="M 28 60 Q 36 62 44 60" stroke={color} strokeWidth={W} fill="none" strokeLinecap="round" />
        <Path d="M 56 60 Q 64 62 72 60" stroke={color} strokeWidth={W} fill="none" strokeLinecap="round" />
      </>
    );
  }
  if (mood === "sadness") {
    return (
      <>
        <Path d="M 28 56 Q 36 60 44 60" stroke={color} strokeWidth={W + 0.3} fill="none" strokeLinecap="round" />
        <Path d="M 56 60 Q 64 60 72 56" stroke={color} strokeWidth={W + 0.3} fill="none" strokeLinecap="round" />
      </>
    );
  }
  if (mood === "sadnessLow") {
    // Classic sad brow shape — gentle inverse arches: outer ends drop down,
    // inner ends drop down, middle peaks slightly up. Soft, not dramatic.
    return (
      <>
        <Path
          d="M 26 62 Q 36 56 46 62"
          stroke={color}
          strokeWidth={W + 0.5}
          fill="none"
          strokeLinecap="round"
        />
        <Path
          d="M 54 62 Q 64 56 74 62"
          stroke={color}
          strokeWidth={W + 0.5}
          fill="none"
          strokeLinecap="round"
        />
      </>
    );
  }
  // Default — pleasant, gently lifted brows (the always-friendly resting face)
  return (
    <>
      <Path d="M 28 57 Q 36 53 44 57" stroke={color} strokeWidth={W} fill="none" strokeLinecap="round" />
      <Path d="M 56 57 Q 64 53 72 57" stroke={color} strokeWidth={W} fill="none" strokeLinecap="round" />
    </>
  );
}

// ─── Eyes ───────────────────────────────────────────────────────────────────
function renderEyes(mood: Mood, gid: (k: string) => string, bodyColor: string) {
  const eye = (cx: number, cy: number) => (
    <>
      {/* Pupil with gradient for shininess */}
      <Ellipse cx={cx} cy={cy} rx={8} ry={9.5} fill={`url(#${gid("eye")})`} />
      {/* Big sparkle highlight */}
      <Circle cx={cx + 2.5} cy={cy - 3} r={3} fill="#FFFFFF" />
      {/* Tiny secondary sparkle */}
      <Circle cx={cx - 2.5} cy={cy + 3} r={1.4} fill="#FFFFFF" opacity={0.9} />
      {/* Catchlight rim */}
      <Circle cx={cx + 2} cy={cy - 3} r={0.8} fill="#FFFFFF" />
    </>
  );

  if (mood === "happy") {
    return (
      <>
        <Path d="M 28 73 Q 36 66 44 73" stroke="#2D2520" strokeWidth={3} fill="none" strokeLinecap="round" />
        <Path d="M 56 73 Q 64 66 72 73" stroke="#2D2520" strokeWidth={3} fill="none" strokeLinecap="round" />
      </>
    );
  }
  if (mood === "surprise") {
    return (
      <>
        <Ellipse cx={36} cy={73} rx={9} ry={11} fill="#FFFFFF" stroke="#2D2520" strokeWidth={1.8} />
        <Ellipse cx={36} cy={74} rx={4.5} ry={4.5} fill={`url(#${gid("eye")})`} />
        <Circle cx={37.5} cy={72} r={1.6} fill="#FFFFFF" />
        <Ellipse cx={64} cy={73} rx={9} ry={11} fill="#FFFFFF" stroke="#2D2520" strokeWidth={1.8} />
        <Ellipse cx={64} cy={74} rx={4.5} ry={4.5} fill={`url(#${gid("eye")})`} />
        <Circle cx={65.5} cy={72} r={1.6} fill="#FFFFFF" />
      </>
    );
  }
  if (mood === "fear") {
    return (
      <>
        <Ellipse cx={36} cy={73} rx={8} ry={10} fill="#FFFFFF" stroke="#2D2520" strokeWidth={1.5} />
        <Ellipse cx={36} cy={75} rx={3.8} ry={3.8} fill={`url(#${gid("eye")})`} />
        <Circle cx={37} cy={73} r={1.3} fill="#FFFFFF" />
        <Ellipse cx={64} cy={73} rx={8} ry={10} fill="#FFFFFF" stroke="#2D2520" strokeWidth={1.5} />
        <Ellipse cx={64} cy={75} rx={3.8} ry={3.8} fill={`url(#${gid("eye")})`} />
        <Circle cx={65} cy={73} r={1.3} fill="#FFFFFF" />
      </>
    );
  }
  if (mood === "anger") {
    return (
      <>
        <Ellipse cx={36} cy={74} rx={6.5} ry={6} fill={`url(#${gid("eye")})`} />
        <Circle cx={37.5} cy={72} r={2} fill="#FFFFFF" />
        <Ellipse cx={64} cy={74} rx={6.5} ry={6} fill={`url(#${gid("eye")})`} />
        <Circle cx={65.5} cy={72} r={2} fill="#FFFFFF" />
      </>
    );
  }
  if (mood === "disgust") {
    return (
      <>
        {eye(36, 76)}
        {eye(64, 76)}
        <Path d="M 26 68 Q 36 73 46 68 L 46 72 L 26 72 Z" fill="#9D7BC4" opacity={0.95} />
        <Path d="M 54 68 Q 64 73 74 68 L 74 72 L 54 72 Z" fill="#9D7BC4" opacity={0.95} />
      </>
    );
  }
  if (mood === "bad") {
    return (
      <>
        {eye(36, 76)}
        {eye(64, 76)}
        <Path d="M 26 68 Q 36 74 46 68 L 46 75 L 26 75 Z" fill="#9D7BC4" opacity={0.95} />
        <Path d="M 54 68 Q 64 74 74 68 L 74 75 L 54 75 Z" fill="#9D7BC4" opacity={0.95} />
        <Path d="M 26 71 Q 36 75 46 71" stroke="#2D2520" strokeWidth={1.5} fill="none" strokeLinecap="round" opacity={0.4} />
        <Path d="M 54 71 Q 64 75 74 71" stroke="#2D2520" strokeWidth={1.5} fill="none" strokeLinecap="round" opacity={0.4} />
      </>
    );
  }
  if (mood === "sadness") {
    return (
      <>
        {eye(36, 74)}
        {eye(64, 74)}
        <Path d="M 27 78 Q 36 80 45 78" stroke="#2D2520" strokeWidth={1.2} fill="none" strokeLinecap="round" opacity={0.5} />
        <Path d="M 55 78 Q 64 80 73 78" stroke="#2D2520" strokeWidth={1.2} fill="none" strokeLinecap="round" opacity={0.5} />
      </>
    );
  }
  if (mood === "sadnessLow") {
    // Pensiveness — quiet melancholy. Big oval pupils with heavy droopy upper
    // lids (covering ~40% of eye), and visible wet welling at the bottom
    // (light blue with bright shimmer). No streaming tear — just glistening.
    return (
      <>
        {/* Big oval pupils — slightly larger and slightly lower for sad look */}
        <Ellipse cx={36} cy={78} rx={8.5} ry={9.5} fill={`url(#${gid("eye")})`} />
        <Ellipse cx={64} cy={78} rx={8.5} ry={9.5} fill={`url(#${gid("eye")})`} />

        {/* Pupil sparkles — main + secondary catchlights */}
        <Circle cx={38.5} cy={75} r={3} fill="#FFFFFF" />
        <Circle cx={66.5} cy={75} r={3} fill="#FFFFFF" />
        <Circle cx={33} cy={80.5} r={1.3} fill="#FFFFFF" opacity={0.85} />
        <Circle cx={61} cy={80.5} r={1.3} fill="#FFFFFF" opacity={0.85} />

        {/* Heavy droopy upper lids — body-colored so they blend in */}
        <Path
          d="M 26 70 Q 36 77 46 70 L 46 76 L 26 76 Z"
          fill={bodyColor}
          opacity={0.97}
        />
        <Path
          d="M 54 70 Q 64 77 74 70 L 74 76 L 54 76 Z"
          fill={bodyColor}
          opacity={0.97}
        />

        {/* Darker lid lines for depth */}
        <Path
          d="M 26 73 Q 36 78.5 46 73"
          stroke="#2D2520"
          strokeWidth={2}
          fill="none"
          strokeLinecap="round"
          opacity={0.75}
        />
        <Path
          d="M 54 73 Q 64 78.5 74 73"
          stroke="#2D2520"
          strokeWidth={2}
          fill="none"
          strokeLinecap="round"
          opacity={0.75}
        />

        {/* Wet welling at bottom — pronounced light blue glimmer */}
        <Ellipse cx={36} cy={85} rx={6.5} ry={2.8} fill="#A2D8F0" opacity={0.78} />
        <Ellipse cx={64} cy={85} rx={6.5} ry={2.8} fill="#A2D8F0" opacity={0.78} />

        {/* Bright shimmer highlight on the wet area */}
        <Ellipse cx={36} cy={84.3} rx={4.2} ry={0.9} fill="#FFFFFF" opacity={0.9} />
        <Ellipse cx={64} cy={84.3} rx={4.2} ry={0.9} fill="#FFFFFF" opacity={0.9} />

        {/* Tiny extra sparkle on wet edge */}
        <Circle cx={33} cy={86} r={0.7} fill="#FFFFFF" opacity={0.95} />
        <Circle cx={61} cy={86} r={0.7} fill="#FFFFFF" opacity={0.95} />
      </>
    );
  }
  return (
    <>
      {eye(36, 72)}
      {eye(64, 72)}
    </>
  );
}

// ─── Tear ───────────────────────────────────────────────────────────────────
function renderTear() {
  return (
    <>
      <Path d="M 68 80 Q 64 86 67 90 Q 70 86 68 80 Z" fill="#7BCDEF" opacity={0.9} />
      <Path d="M 67 82 Q 67 84 68 84" stroke="#FFFFFF" strokeWidth={0.8} fill="none" opacity={0.7} />
    </>
  );
}

// ─── Mouth ──────────────────────────────────────────────────────────────────
function renderMouth(mood: Mood) {
  const STROKE = "#2D2520";

  if (mood === "happy") {
    return (
      <>
        <Path d="M 38 94 Q 50 91 62 94 Q 60 110 50 112 Q 40 110 38 94 Z" fill="#C45B5B" />
        <Path d="M 38 94 Q 50 91 62 94" stroke={STROKE} strokeWidth={3} fill="none" strokeLinecap="round" />
        <Path d="M 44 93 Q 50 92 56 93" stroke="#FFFFFF" strokeWidth={2} fill="none" strokeLinecap="round" opacity={0.6} />
      </>
    );
  }
  if (mood === "surprise") {
    return <Ellipse cx={50} cy={101} rx={4.5} ry={5.8} fill="#C45B5B" stroke="#2D2520" strokeWidth={1.8} />;
  }
  if (mood === "fear") {
    return <Ellipse cx={50} cy={101} rx={5} ry={4} fill="#C45B5B" stroke="#2D2520" strokeWidth={1.8} />;
  }
  if (mood === "anger") {
    return (
      <>
        <Path d="M 38 98 L 42 102 L 46 98 L 50 102 L 54 98 L 58 102 L 62 98" stroke={STROKE} strokeWidth={2.8} fill="none" strokeLinejoin="round" strokeLinecap="round" />
        <Path d="M 38 98 Q 50 105 62 98" stroke={STROKE} strokeWidth={2.5} fill="none" strokeLinecap="round" />
      </>
    );
  }
  if (mood === "disgust") {
    return <Path d="M 38 100 Q 44 96 50 100 Q 56 105 62 99" stroke={STROKE} strokeWidth={2.8} fill="none" strokeLinecap="round" />;
  }
  if (mood === "bad") {
    return <Path d="M 42 102 Q 50 103.5 58 102" stroke={STROKE} strokeWidth={2.8} fill="none" strokeLinecap="round" />;
  }
  if (mood === "sadness") {
    return <Path d="M 42 104 Q 50 99 58 104" stroke={STROKE} strokeWidth={2.8} fill="none" strokeLinecap="round" />;
  }
  if (mood === "sadnessLow") {
    // Subtle pursed flat line — almost imperceptible, a quiet "sigh"
    return (
      <Path
        d="M 44 103 Q 50 103.5 56 103"
        stroke={STROKE}
        strokeWidth={2.5}
        fill="none"
        strokeLinecap="round"
      />
    );
  }
  // Default — small, pleasant closed smile. Slight upturn at the corners.
  // Always friendly: the resting face you see before the user picks an emotion.
  return (
    <Path
      d="M 42 101 Q 50 97 58 101"
      stroke={STROKE}
      strokeWidth={2.8}
      fill="none"
      strokeLinecap="round"
    />
  );
}
