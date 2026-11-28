import { useState } from "react";
import Animated, { ZoomIn } from "react-native-reanimated";
import { Circle, G, Path, Svg, Text as SvgText } from "react-native-svg";

import { tintOnWhite } from "@/lib/color";
import { EMOTIONS, type EmotionPrimary } from "@/lib/emotions";

/**
 * Crystal — the feelings wheel journey (Geoffrey Roberts wheel).
 *
 * Mirrors the three-ring wheel Gigi uses as the reference picture, revealed
 * one ring at a time (decided 2026-11-27):
 *
 *   1. Inner wheel: the 7 core feelings, sized like the picture (each slice
 *      is as wide as the number of outer feelings it holds, Fearful at 12
 *      o'clock, clockwise Fearful → Angry → Disgusted → Sad → Happy →
 *      Surprised → Bad).
 *   2. Tap one: it moves to the center and its middle ring opens around it.
 *   3. Tap a middle feeling: the outer ring opens, lined up under the middle
 *      ring like in the picture. The chosen branch is bright, the rest dim but
 *      still tappable.
 *   4. Tap an outer feeling to choose it. Tapping the center goes back to the
 *      inner wheel.
 *
 * Only one core feeling's rings are drawn at a time so every slice stays
 * big enough to tap on a phone.
 */

type Props = {
  /** Width and height of the wheel in px. */
  size: number;
  primary?: string;
  secondary?: string;
  tertiary?: string;
  onChange: (sel: {
    primary?: string;
    secondary?: string;
    tertiary?: string;
  }) => void;
};

const INK = "#2E2416";
const TOTAL_CELLS = EMOTIONS.reduce((n, p) => n + cellsIn(p), 0);

function cellsIn(p: EmotionPrimary): number {
  return p.secondaries.reduce((n, s) => n + s.tertiaries.length, 0);
}

const rad = (deg: number) => (deg * Math.PI) / 180;

/** Ring sector (or pie slice when r0 = 0) from angle a0 to a1, degrees. */
function sector(c: number, r0: number, r1: number, a0: number, a1: number) {
  const large = a1 - a0 > 180 ? 1 : 0;
  const p = (r: number, a: number) =>
    `${c + r * Math.cos(rad(a))} ${c + r * Math.sin(rad(a))}`;
  if (a1 - a0 >= 359.99) {
    // Full ring: two half arcs.
    const mid = a0 + 180;
    return r0 === 0
      ? `M ${p(r1, a0)} A ${r1} ${r1} 0 1 1 ${p(r1, mid)} A ${r1} ${r1} 0 1 1 ${p(r1, a0)} Z`
      : `M ${p(r1, a0)} A ${r1} ${r1} 0 1 1 ${p(r1, mid)} A ${r1} ${r1} 0 1 1 ${p(r1, a0)} M ${p(r0, a0)} A ${r0} ${r0} 0 1 0 ${p(r0, mid)} A ${r0} ${r0} 0 1 0 ${p(r0, a0)} Z`;
  }
  if (r0 === 0) {
    return `M ${c} ${c} L ${p(r1, a0)} A ${r1} ${r1} 0 ${large} 1 ${p(r1, a1)} Z`;
  }
  return `M ${p(r1, a0)} A ${r1} ${r1} 0 ${large} 1 ${p(r1, a1)} L ${p(r0, a1)} A ${r0} ${r0} 0 ${large} 0 ${p(r0, a0)} Z`;
}

const CHAR_W = 0.56; // average Roboto glyph width as a share of font size

/** Largest font that fits `text` on one line in a band `len` px long. */
const fitFont = (text: string, len: number) => len / (text.length * CHAR_W);

/**
 * One shared font size per ring, so labels look even. Long words may still
 * shrink a little on their own (see RadialLabel), but never set the size for
 * the whole ring.
 */
function ringFont(labels: string[], band: number, maxFont: number) {
  const fits = labels
    .map((t) => {
      const words = t.split(" ");
      const longest = words.length > 1 ? Math.ceil(t.length / 2) + 1 : t.length;
      return fitFont("x".repeat(longest), band);
    })
    .sort((a, b) => a - b);
  // Ignore the single tightest label so one outlier doesn't shrink them all.
  const ref = fits[Math.min(1, fits.length - 1)];
  return Math.max(9, Math.min(maxFont, ref));
}

/**
 * A label that runs outward along the slice (like the picture), flipped on
 * the left half so it never reads upside down.
 */
function RadialLabel({
  c,
  r0,
  r1,
  angle,
  text,
  font,
  bold,
  fill = INK,
}: {
  c: number;
  r0: number;
  r1: number;
  angle: number;
  text: string;
  font: number;
  bold?: boolean;
  fill?: string;
}) {
  const band = (r1 - r0) * 0.86;
  const words = text.split(" ");
  // Two lines for multi-word labels that wouldn't fit on one.
  let lines = [text];
  if (words.length > 1 && fitFont(text, band) < font) {
    const cut = Math.ceil(words.length / 2);
    lines = [words.slice(0, cut).join(" "), words.slice(cut).join(" ")];
  }
  const fontSize = Math.min(
    font,
    ...lines.map((l) => fitFont(l, band))
  );
  const rm = (r0 + r1) / 2;
  const x = c + rm * Math.cos(rad(angle));
  const y = c + rm * Math.sin(rad(angle));
  const norm = ((angle % 360) + 360) % 360;
  const flip = norm > 90 && norm < 270;
  const rot = flip ? angle + 180 : angle;
  const lineGap = fontSize * 1.1;
  return (
    <>
      {lines.map((line, i) => {
        const off = (i - (lines.length - 1) / 2) * lineGap;
        return (
          <SvgText
            key={i}
            x={x}
            y={y + off}
            dy={fontSize * 0.35}
            fill={fill}
            fontSize={fontSize}
            fontWeight={bold ? "700" : "500"}
            fontFamily="Roboto, system-ui, sans-serif"
            textAnchor="middle"
            transform={`rotate(${rot} ${x} ${y})`}
            pointerEvents="none"
          >
            {line}
          </SvgText>
        );
      })}
    </>
  );
}

export function FeelingsWheel({
  size,
  primary,
  secondary,
  tertiary,
  onChange,
}: Props) {
  const [pressed, setPressed] = useState<string | null>(null);
  const c = size / 2;
  const R = c - 4;
  const P = EMOTIONS.find((e) => e.slug === primary);

  // ── Stage 1: inner wheel only ─────────────────────────────────────────────
  if (!P) {
    const cellDeg = 360 / TOTAL_CELLS;
    // Fearful starts at 12 o'clock, as in the picture.
    const beforeFearful = EMOTIONS.slice(
      0,
      EMOTIONS.findIndex((e) => e.slug === "fearful")
    ).reduce((n, p) => n + cellsIn(p), 0);
    let a = -90 - beforeFearful * cellDeg;

    return (
      <Animated.View key="inner" entering={ZoomIn.duration(450)}>
        <Svg width={size} height={size}>
          {EMOTIONS.map((e) => {
            const a0 = a;
            const a1 = a + cellsIn(e) * cellDeg;
            a = a1;
            const mid = (a0 + a1) / 2;
            const lr = R * 0.7;
            // Chord width of the slice at the label radius.
            const chord = 2 * lr * Math.sin(rad((a1 - a0) / 2)) * 0.82;
            const innerFont = Math.min(18, size / 22, fitFont(e.name, chord));
            const isPressed = pressed === e.slug;
            return (
              <G
                key={e.slug}
                onPress={() => onChange({ primary: e.slug })}
                onPressIn={() => setPressed(e.slug)}
                onPressOut={() => setPressed(null)}
              >
                <Path
                  d={sector(c, 0, R, a0, a1)}
                  fill={e.color}
                  opacity={isPressed ? 0.8 : 1}
                  stroke="#FFFDF6"
                  strokeWidth={2}
                />
                <SvgText
                  x={c + lr * Math.cos(rad(mid))}
                  y={c + lr * Math.sin(rad(mid)) + 6}
                  fill={INK}
                  fontSize={innerFont}
                  fontWeight="700"
                  fontFamily="Roboto, system-ui, sans-serif"
                  textAnchor="middle"
                  pointerEvents="none"
                >
                  {e.name}
                </SvgText>
              </G>
            );
          })}
        </Svg>
      </Animated.View>
    );
  }

  // ── Stages 2 and 3: one core feeling, its middle ring, then outer ring ────
  const rCenter = R * 0.2;
  const rMid = R * 0.55;
  const showOuter = !!secondary;
  const cells = cellsIn(P);
  const cellDeg = 360 / cells;
  const middleColor = tintOnWhite(P.color, 0.45);
  const outerColor = tintOnWhite(P.color, 0.85);
  // Faded = a solid pale tint, so the sky behind never shows through.
  const fadedColor = tintOnWhite(P.color, 0.22);

  const midOuterR = showOuter ? rMid : R;
  const middleFont = ringFont(
    P.secondaries.map((s) => s.name),
    (midOuterR - rCenter) * 0.86,
    showOuter ? 14 : 17
  );
  const outerFont = ringFont(
    P.secondaries.flatMap((s) => s.tertiaries.map((t) => t.name)),
    (R - rMid) * 0.86,
    15
  );

  let a = -90;
  const segments = P.secondaries.map((s) => {
    const a0 = a;
    const a1 = a + s.tertiaries.length * cellDeg;
    a = a1;
    return { s, a0, a1 };
  });

  return (
    <Animated.View
      key={`${P.slug}-${showOuter ? "outer" : "middle"}`}
      entering={ZoomIn.duration(450)}
    >
      <Svg width={size} height={size}>
        {/* Outer ring (stage 3) */}
        {showOuter &&
          segments.flatMap(({ s, a0 }) =>
            s.tertiaries.map((t, i) => {
              const t0 = a0 + i * cellDeg;
              const t1 = t0 + cellDeg;
              const inBranch = s.slug === secondary;
              const chosen = inBranch && t.slug === tertiary;
              return (
                <G
                  key={`${s.slug}-${t.slug}`}
                  onPress={() =>
                    onChange({
                      primary: P.slug,
                      secondary: s.slug,
                      tertiary: t.slug,
                    })
                  }
                  onPressIn={() => setPressed(`t:${s.slug}:${t.slug}`)}
                  onPressOut={() => setPressed(null)}
                >
                  <Path
                    d={sector(c, rMid, R, t0, t1)}
                    fill={chosen ? P.color : inBranch ? outerColor : fadedColor}
                    opacity={pressed === `t:${s.slug}:${t.slug}` ? 0.75 : 1}
                    stroke={chosen ? INK : "#FFFDF6"}
                    strokeWidth={chosen ? 3 : 1.5}
                  />
                  <RadialLabel
                    c={c}
                    r0={rMid}
                    r1={R}
                    angle={(t0 + t1) / 2}
                    text={t.name}
                    font={outerFont}
                    bold={chosen}
                    fill={inBranch ? INK : "#8A7D6B"}
                  />
                </G>
              );
            })
          )}

        {/* Middle ring */}
        {segments.map(({ s, a0, a1 }) => {
          const chosen = s.slug === secondary;
          const dim = showOuter && !chosen;
          return (
            <G
              key={s.slug}
              onPress={() => onChange({ primary: P.slug, secondary: s.slug })}
              onPressIn={() => setPressed(`s:${s.slug}`)}
              onPressOut={() => setPressed(null)}
            >
              <Path
                d={sector(c, rCenter, showOuter ? rMid : R, a0, a1)}
                fill={chosen ? P.color : dim ? fadedColor : middleColor}
                opacity={pressed === `s:${s.slug}` ? 0.75 : 1}
                stroke="#FFFDF6"
                strokeWidth={2}
              />
              <RadialLabel
                c={c}
                r0={rCenter}
                r1={showOuter ? rMid : R}
                angle={(a0 + a1) / 2}
                text={s.name}
                font={middleFont}
                bold={chosen}
                fill={dim ? "#8A7D6B" : INK}
              />
            </G>
          );
        })}

        {/* Center: the chosen core feeling. Tap to go back. */}
        <G onPress={() => onChange({})}>
          <Circle
            cx={c}
            cy={c}
            r={rCenter}
            fill={P.color}
            stroke="#FFFDF6"
            strokeWidth={3}
          />
          <SvgText
            x={c}
            y={c + 2}
            fill={INK}
            fontSize={Math.min(17, rCenter / 3.6)}
            fontWeight="800"
            fontFamily="Roboto, system-ui, sans-serif"
            textAnchor="middle"
            pointerEvents="none"
          >
            {P.name}
          </SvgText>
          <SvgText
            x={c}
            y={c + 18}
            fill={INK}
            opacity={0.6}
            fontSize={10}
            fontFamily="Roboto, system-ui, sans-serif"
            textAnchor="middle"
            pointerEvents="none"
          >
            ← back
          </SvgText>
        </G>
      </Svg>
    </Animated.View>
  );
}
