import { useState } from "react";
import {
  Circle,
  G,
  Path,
  Svg,
  Text as SvgText,
} from "react-native-svg";

import { EMOTIONS } from "@/lib/emotions";

/**
 * Geoffrey Roberts wheel — 7 primary emotion wedges (Happy, Surprised, Bad,
 * Fearful, Angry, Disgusted, Sad). 7 wedges → each is 360/7 ≈ 51.43°.
 *
 * Dramatic hover: hovered wedge translates outward, scales bigger around its
 * own center, fills to near-solid color, gains a thick colored stroke, and
 * its label jumps up in size and weight.
 */

const SIZE = 340;
const CENTER = SIZE / 2;
const OUTER_R = 152;
const INNER_R = 30;
const LABEL_R = 102;

const WEDGE_DEG = 360 / 7;
const HOVER_OFFSET = 24; // pixels outward from center on hover
const HOVER_SCALE = 1.12;

function wedgePath(startAngle: number, endAngle: number): string {
  const sR = (startAngle * Math.PI) / 180;
  const eR = (endAngle * Math.PI) / 180;
  const x1 = CENTER + OUTER_R * Math.cos(sR);
  const y1 = CENTER + OUTER_R * Math.sin(sR);
  const x2 = CENTER + OUTER_R * Math.cos(eR);
  const y2 = CENTER + OUTER_R * Math.sin(eR);
  const xi1 = CENTER + INNER_R * Math.cos(sR);
  const yi1 = CENTER + INNER_R * Math.sin(sR);
  const xi2 = CENTER + INNER_R * Math.cos(eR);
  const yi2 = CENTER + INNER_R * Math.sin(eR);
  return [
    `M ${x1} ${y1}`,
    `A ${OUTER_R} ${OUTER_R} 0 0 1 ${x2} ${y2}`,
    `L ${xi2} ${yi2}`,
    `A ${INNER_R} ${INNER_R} 0 0 0 ${xi1} ${yi1}`,
    "Z",
  ].join(" ");
}

type Props = {
  onPick: (slug: string) => void;
  selected?: string;
};

export function EmotionWheel({ onPick, selected }: Props) {
  const [hovered, setHovered] = useState<string | null>(null);

  return (
    <Svg width={SIZE} height={SIZE} viewBox={`0 0 ${SIZE} ${SIZE}`}>
      {EMOTIONS.map((e, i) => {
        const startAngle = -90 + i * WEDGE_DEG;
        const endAngle = -90 + (i + 1) * WEDGE_DEG;
        const midAngle = (startAngle + endAngle) / 2;
        const midRad = (midAngle * Math.PI) / 180;
        const labelX = CENTER + LABEL_R * Math.cos(midRad);
        const labelY = CENTER + LABEL_R * Math.sin(midRad);

        const isSelected = e.slug === selected;
        const isHovered = e.slug === hovered;
        const lit = isSelected || isHovered;

        // Wedge geometric center (where to scale around)
        const wedgeCx = CENTER + ((INNER_R + OUTER_R) / 2) * Math.cos(midRad);
        const wedgeCy = CENTER + ((INNER_R + OUTER_R) / 2) * Math.sin(midRad);

        // Pop the wedge outward + scale around its own center on hover
        const offsetX = isHovered ? HOVER_OFFSET * Math.cos(midRad) : 0;
        const offsetY = isHovered ? HOVER_OFFSET * Math.sin(midRad) : 0;
        const scale = isHovered ? HOVER_SCALE : 1;

        const transform = isHovered
          ? `translate(${offsetX} ${offsetY}) translate(${wedgeCx} ${wedgeCy}) scale(${scale}) translate(${-wedgeCx} ${-wedgeCy})`
          : "translate(0 0)";

        const fillAlpha = isSelected ? "DD" : isHovered ? "CC" : "40";
        const strokeColor = lit ? e.color : "#F7F0E5";
        const strokeWidth = isHovered ? 6 : isSelected ? 4 : 3;

        const labelSize = isHovered ? 20 : 14;
        const labelWeight = isHovered ? "700" : isSelected ? "600" : "500";

        const hoverHandlers = {
          onMouseEnter: () => setHovered(e.slug),
          onMouseLeave: () => setHovered(null),
        } as Record<string, () => void>;

        return (
          <G
            key={e.slug}
            transform={transform}
            style={{ transition: "transform 280ms ease-out" } as object}
          >
            <Path
              d={wedgePath(startAngle, endAngle)}
              fill={`${e.color}${fillAlpha}`}
              stroke={strokeColor}
              strokeWidth={strokeWidth}
              onPress={() => onPick(e.slug)}
              onPressIn={() => setHovered(e.slug)}
              onPressOut={() => setHovered(null)}
              {...hoverHandlers}
              style={{
                cursor: "pointer",
                transition:
                  "fill 280ms ease-out, stroke 280ms ease-out, stroke-width 280ms ease-out",
              } as object}
            />
            <SvgText
              x={labelX}
              y={labelY}
              fill="#2D2520"
              fontSize={labelSize}
              fontWeight={labelWeight}
              textAnchor="middle"
              alignmentBaseline="central"
              pointerEvents="none"
              style={{ transition: "all 280ms ease-out" } as object}
            >
              {e.name}
            </SvgText>
          </G>
        );
      })}
      <Circle cx={CENTER} cy={CENTER} r={INNER_R - 1.5} fill="#F7F0E5" />
    </Svg>
  );
}
