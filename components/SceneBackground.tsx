import { useMemo } from "react";
import { useWindowDimensions, View } from "react-native";
import Svg, {
  Circle,
  Defs,
  Ellipse,
  LinearGradient,
  Path,
  Rect,
  RadialGradient,
  Stop,
} from "react-native-svg";

import { currentScene, Scene } from "@/lib/scene";

type Props = {
  /** Override the auto-selected time-of-day scene (mostly for previews). */
  scene?: Scene;
};

/**
 * The storybook backdrop: a soft sky that fades into three rolling hills,
 * with a sun or moon glowing in the upper corner. Rendered with
 * react-native-svg (no extra native deps) so it works on web + iOS + Android.
 *
 * Sits absolutely behind screen content — drop it as the first child of a
 * full-screen container (see components/Scene.tsx).
 */
export function SceneBackground({ scene }: Props) {
  const { width, height } = useWindowDimensions();
  const s = useMemo(() => scene ?? currentScene(), [scene]);

  // A few deterministic stars for the night scene (seeded by index so they
  // don't jump around on re-render).
  const stars = useMemo(() => {
    if (!s.stars) return [];
    return Array.from({ length: 26 }, (_, i) => {
      const px = ((i * 53) % 100) / 100;
      const py = ((i * 29) % 45) / 100; // upper 45%
      const r = 0.6 + ((i * 7) % 10) / 10;
      const o = 0.4 + ((i * 3) % 6) / 10;
      return { x: px * width, y: py * height, r, o };
    });
  }, [s.stars, width, height]);

  const orbX = s.orb.x * width;
  const orbY = s.orb.y * height;
  const orbR = Math.min(width, height) * 0.09;

  // Hills sit in the bottom ~42% of the screen, layered back → front.
  const base = height;
  const h1 = height * 0.72;
  const h2 = height * 0.82;
  const h3 = height * 0.9;

  return (
    <View
      pointerEvents="none"
      style={{ position: "absolute", left: 0, right: 0, top: 0, bottom: 0 }}
    >
      <Svg width={width} height={height}>
        <Defs>
          <LinearGradient id="sky" x1="0" y1="0" x2="0" y2="1">
            <Stop offset="0" stopColor={s.sky[0]} />
            <Stop offset="0.6" stopColor={s.sky[1]} />
            <Stop offset="1" stopColor={s.sky[2]} />
          </LinearGradient>
          <RadialGradient id="orbGlow" cx="50%" cy="50%" r="50%">
            <Stop offset="0" stopColor={s.orb.glow} stopOpacity="0.55" />
            <Stop offset="1" stopColor={s.orb.glow} stopOpacity="0" />
          </RadialGradient>
        </Defs>

        {/* Sky */}
        <Rect x={0} y={0} width={width} height={height} fill="url(#sky)" />

        {/* Stars (night) */}
        {stars.map((st, i) => (
          <Circle
            key={i}
            cx={st.x}
            cy={st.y}
            r={st.r}
            fill="#FFFFFF"
            opacity={st.o}
          />
        ))}

        {/* Orb glow + body */}
        <Circle cx={orbX} cy={orbY} r={orbR * 2.6} fill="url(#orbGlow)" />
        <Circle cx={orbX} cy={orbY} r={orbR} fill={s.orb.color} />
        {s.orb.isMoon && (
          // Crescent shadow — offset circle in the sky color of the top band.
          <Circle
            cx={orbX + orbR * 0.5}
            cy={orbY - orbR * 0.35}
            r={orbR * 0.92}
            fill={s.sky[0]}
          />
        )}

        {/* Rolling hills — big soft ellipses layered for depth */}
        <Ellipse
          cx={width * 0.28}
          cy={base}
          rx={width * 0.85}
          ry={base - h1}
          fill={s.hills[0]}
        />
        <Ellipse
          cx={width * 0.78}
          cy={base}
          rx={width * 0.9}
          ry={base - h2}
          fill={s.hills[1]}
        />
        <Ellipse
          cx={width * 0.4}
          cy={base}
          rx={width}
          ry={base - h3}
          fill={s.hills[2]}
        />
        {/* Flat ground fill under the ellipses so no sky peeks through */}
        <Path
          d={`M0 ${h3} L${width} ${h3} L${width} ${base} L0 ${base} Z`}
          fill={s.hills[2]}
        />
      </Svg>
    </View>
  );
}
