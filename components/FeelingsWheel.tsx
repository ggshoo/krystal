import { useEffect, useRef, useState } from "react";
import { Pressable, Text, View } from "react-native";
import { G, Path, Svg, Text as SvgText } from "react-native-svg";

import { tintOnWhite } from "@/lib/color";
import { EMOTIONS, type EmotionPrimary } from "@/lib/emotions";

/**
 * Crystal — the feelings wheel journey (Geoffrey Roberts wheel).
 *
 * One wheel with the reference picture's real proportions (decided
 * 2026-11-28): every outer feeling gets the same slice of the circle, so a
 * core feeling's slice is as wide as the number of outer feelings it holds,
 * Fearful starts at 12 o'clock, and the rings sit at the picture's radii.
 *
 *   1. Only the inner wheel shows, filling the view.
 *   2. Tap a core feeling: its middle ring fans out from that slice only, and
 *      the view zooms in on that part of the wheel.
 *   3. Tap a middle feeling: the outer ring fans out (the rest of that core
 *      feeling's outer ring shows faded), and the view zooms in again on the
 *      chosen branch.
 *   4. Tap an outer feeling to choose it. "← back" steps out one level.
 *
 * Zooming animates the SVG viewBox, so text stays sharp and taps land where
 * they look.
 */

type Selection = { primary?: string; secondary?: string; tertiary?: string };

type Props = Selection & {
  /** Width and height of the wheel view in px. */
  size: number;
  onChange: (sel: Selection) => void;
};

const INK = "#2E2416";
const FADED_INK = "#8A7D6B";
const EDGE = "#FFFDF6";
const FONT = "Roboto, system-ui, sans-serif";
const CHAR_W = 0.56; // average Roboto glyph width as a share of font size

// World coordinates: wheel centred at (0, 0), outer radius 100. Ring radii
// follow the reference picture.
const R3 = 100; // outer edge
const R2 = 64; // middle ring outer edge
const R1 = 34; // inner wheel edge

const cellsIn = (p: EmotionPrimary) =>
  p.secondaries.reduce((n, s) => n + s.tertiaries.length, 0);
const TOTAL = EMOTIONS.reduce((n, p) => n + cellsIn(p), 0);
const CELL = 360 / TOTAL;
const rad = (d: number) => (d * Math.PI) / 180;

/** Angles for every slice of every ring, laid out once like the picture. */
const LAYOUT = (() => {
  const beforeFearful = EMOTIONS.slice(
    0,
    EMOTIONS.findIndex((e) => e.slug === "fearful")
  ).reduce((n, p) => n + cellsIn(p), 0);
  let a = -90 - beforeFearful * CELL;
  return EMOTIONS.map((p) => {
    const p0 = a;
    const secondaries = p.secondaries.map((s) => {
      const s0 = a;
      const tertiaries = s.tertiaries.map((t) => {
        const t0 = a;
        a += CELL;
        return { t, a0: t0, a1: a };
      });
      return { s, a0: s0, a1: a, tertiaries };
    });
    return { p, a0: p0, a1: a, secondaries };
  });
})();

function sector(r0: number, r1: number, a0: number, a1: number) {
  const large = a1 - a0 > 180 ? 1 : 0;
  const pt = (r: number, a: number) =>
    `${r * Math.cos(rad(a))} ${r * Math.sin(rad(a))}`;
  if (r0 === 0) {
    return `M 0 0 L ${pt(r1, a0)} A ${r1} ${r1} 0 ${large} 1 ${pt(r1, a1)} Z`;
  }
  return `M ${pt(r1, a0)} A ${r1} ${r1} 0 ${large} 1 ${pt(r1, a1)} L ${pt(r0, a1)} A ${r0} ${r0} 0 ${large} 0 ${pt(r0, a0)} Z`;
}

type Box = { x: number; y: number; w: number };

/** Square viewBox around the ring band r0..r1 between angles a0..a1. */
function frame(r0: number, r1: number, a0: number, a1: number, pad: number): Box {
  const xs: number[] = [];
  const ys: number[] = [];
  for (let i = 0; i <= 24; i++) {
    const a = a0 + ((a1 - a0) * i) / 24;
    for (const r of [r0, r1]) {
      xs.push(r * Math.cos(rad(a)));
      ys.push(r * Math.sin(rad(a)));
    }
  }
  const minX = Math.min(...xs);
  const maxX = Math.max(...xs);
  const minY = Math.min(...ys);
  const maxY = Math.max(...ys);
  const side = Math.max(maxX - minX, maxY - minY) * (1 + pad);
  const cx = (minX + maxX) / 2;
  const cy = (minY + maxY) / 2;
  return { x: cx - side / 2, y: cy - side / 2, w: side };
}

/** Smoothly animate between viewBoxes. */
function useAnimatedBox(target: Box, ms = 650): Box {
  const [box, setBox] = useState(target);
  const current = useRef(target);
  useEffect(() => {
    const from = current.current;
    const start = Date.now();
    let raf = 0;
    const tick = () => {
      const t = Math.min(1, (Date.now() - start) / ms);
      const e = 1 - Math.pow(1 - t, 3); // ease-out cubic
      const lerp = (a: number, b: number) => a + (b - a) * e;
      const next = {
        x: lerp(from.x, target.x),
        y: lerp(from.y, target.y),
        w: lerp(from.w, target.w),
      };
      current.current = next;
      setBox(next);
      if (t < 1) raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [target.x, target.y, target.w]);
  return box;
}

/**
 * Text running outward along a slice, like the picture, flipped on the left
 * half so it never reads upside down. Sizes are in world units.
 */
function RadialLabel(props: {
  r0: number;
  r1: number;
  angle: number;
  text: string;
  font: number;
  bold?: boolean;
  fill?: string;
}) {
  const { r0, r1, angle, text, font, bold, fill = INK } = props;
  const rm = (r0 + r1) / 2;
  const x = rm * Math.cos(rad(angle));
  const y = rm * Math.sin(rad(angle));
  const norm = ((angle % 360) + 360) % 360;
  const rot = norm > 90 && norm < 270 ? angle + 180 : angle;
  return (
    <SvgText
      x={x}
      y={y}
      dy={font * 0.35}
      fill={fill}
      fontSize={font}
      fontWeight={bold ? "700" : "500"}
      fontFamily={FONT}
      textAnchor="middle"
      transform={`rotate(${rot} ${x} ${y})`}
      pointerEvents="none"
    >
      {text}
    </SvgText>
  );
}

/** Largest world font so `text` fits a band `len` long and a slice `width` wide. */
const fit = (text: string, len: number, width: number) =>
  Math.min(len / (text.length * CHAR_W), width * 0.62);

export function FeelingsWheel({
  size,
  primary,
  secondary,
  tertiary,
  onChange,
}: Props) {
  const [pressed, setPressed] = useState<string | null>(null);
  const P = LAYOUT.find((l) => l.p.slug === primary);
  const S = P?.secondaries.find((l) => l.s.slug === secondary);

  // Where to look: whole inner wheel, then the chosen core slice, then the
  // chosen branch (with a little of its neighbours for context).
  const target: Box = S
    ? frame(R1 - 4, R3, S.a0 - CELL * 1.5, S.a1 + CELL * 1.5, 0.08)
    : P
      ? frame(0, R2, P.a0, P.a1, 0.08)
      : { x: -R1 * 1.04, y: -R1 * 1.04, w: R1 * 2.08 };
  const box = useAnimatedBox(target);

  // Screen px → world units at the level we're zooming to, so text lands at
  // a comfortable on-screen size.
  const px = (n: number) => (n * target.w) / size;

  const press = (id: string) => ({
    onPressIn: () => setPressed(id),
    onPressOut: () => setPressed(null),
  });

  return (
    <View style={{ width: size, alignItems: "center" }}>
      <View
        style={{
          width: size,
          height: size,
          overflow: "hidden",
          borderRadius: P ? 28 : size / 2,
        }}
      >
        <Svg
          width={size}
          height={size}
          viewBox={`${box.x} ${box.y} ${box.w} ${box.w}`}
        >
          {/* Inner wheel: labels run along each slice, one shared size */}
          {(() => {
            const band = R1 * 0.62;
            const font = Math.min(
              px(18),
              ...LAYOUT.map(({ p, a0, a1 }) =>
                fit(p.name, band, R1 * 0.6 * rad(a1 - a0))
              )
            );
            return LAYOUT.map(({ p, a0, a1 }) => {
              const chosen = p.slug === primary;
              const faded = !!P && !chosen;
              const id = `p:${p.slug}`;
              return (
                <G
                  key={p.slug}
                  onPress={() => onChange({ primary: p.slug })}
                  {...press(id)}
                >
                  <Path
                    d={sector(0, R1, a0, a1)}
                    fill={faded ? tintOnWhite(p.color, 0.3) : p.color}
                    opacity={pressed === id ? 0.8 : 1}
                    stroke={EDGE}
                    strokeWidth={0.5}
                  />
                  <RadialLabel
                    r0={R1 * 0.3}
                    r1={R1 * 0.95}
                    angle={(a0 + a1) / 2}
                    text={p.name}
                    font={font}
                    bold
                    fill={faded ? FADED_INK : INK}
                  />
                </G>
              );
            });
          })()}

          {/* Middle ring: fans out from the chosen core feeling only */}
          {P &&
            (() => {
              const width = ((R1 + R2) / 2) * rad(CELL * 2);
              const font = Math.min(
                px(17),
                ...P.secondaries.map(({ s }) =>
                  fit(s.name, (R2 - R1) * 0.86, width)
                )
              );
              return P.secondaries.map(({ s, a0, a1 }) => {
                const chosen = s.slug === secondary;
                const faded = !!S && !chosen;
                const id = `s:${s.slug}`;
                return (
                  <G
                    key={s.slug}
                    onPress={() =>
                      onChange({ primary: P.p.slug, secondary: s.slug })
                    }
                    {...press(id)}
                  >
                    <Path
                      d={sector(R1, R2, a0, a1)}
                      fill={
                        chosen
                          ? P.p.color
                          : faded
                            ? tintOnWhite(P.p.color, 0.22)
                            : tintOnWhite(P.p.color, 0.45)
                      }
                      opacity={pressed === id ? 0.8 : 1}
                      stroke={EDGE}
                      strokeWidth={0.4}
                    />
                    <RadialLabel
                      r0={R1}
                      r1={R2}
                      angle={(a0 + a1) / 2}
                      text={s.name}
                      font={font}
                      bold={chosen}
                      fill={faded ? FADED_INK : INK}
                    />
                  </G>
                );
              });
            })()}

          {/* Outer ring: fans out from the chosen middle feeling */}
          {P &&
            S &&
            (() => {
              const width = ((R2 + R3) / 2) * rad(CELL);
              const font = Math.min(
                px(17),
                ...P.secondaries.flatMap(({ tertiaries }) =>
                  tertiaries.map(({ t }) =>
                    fit(t.name, (R3 - R2) * 0.86, width)
                  )
                )
              );
              return P.secondaries.flatMap(({ s, tertiaries }) =>
                tertiaries.map(({ t, a0, a1 }) => {
                  const inBranch = s.slug === secondary;
                  const chosen = inBranch && t.slug === tertiary;
                  const id = `t:${s.slug}:${t.slug}`;
                  return (
                    <G
                      key={id}
                      onPress={() =>
                        onChange({
                          primary: P.p.slug,
                          secondary: s.slug,
                          tertiary: t.slug,
                        })
                      }
                      {...press(id)}
                    >
                      <Path
                        d={sector(R2, R3, a0, a1)}
                        fill={
                          chosen
                            ? P.p.color
                            : inBranch
                              ? tintOnWhite(P.p.color, 0.8)
                              : tintOnWhite(P.p.color, 0.22)
                        }
                        opacity={pressed === id ? 0.8 : 1}
                        stroke={chosen ? INK : EDGE}
                        strokeWidth={chosen ? 0.8 : 0.4}
                      />
                      <RadialLabel
                        r0={R2}
                        r1={R3}
                        angle={(a0 + a1) / 2}
                        text={t.name}
                        font={font}
                        bold={chosen}
                        fill={inBranch ? INK : FADED_INK}
                      />
                    </G>
                  );
                })
              );
            })()}
        </Svg>
      </View>

      <View style={{ height: 40, justifyContent: "center" }}>
        {P && (
          <Pressable
            onPress={() => onChange(S ? { primary } : {})}
            hitSlop={10}
          >
            <Text
              className="font-body text-sm font-bold"
              style={{ color: INK, opacity: 0.7 }}
            >
              {S
                ? `← back to ${P.p.name.toLowerCase()}`
                : "← back to the whole wheel"}
            </Text>
          </Pressable>
        )}
      </View>
    </View>
  );
}
