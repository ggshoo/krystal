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
 * Plutchik-style 8-wedge wheel for picking a primary emotion.
 *
 * - Wedges arranged in Plutchik's order, starting top (12 o'clock) clockwise:
 *   joy, trust, fear, surprise, sadness, disgust, anger, anticipation.
 * - Hovered wedge "pops" outward from the wheel center, brightens, gains
 *   a colored stroke. Selected wedge stays bright + bordered.
 */

const SIZE = 340;
const CENTER = SIZE / 2;
const OUTER_R = 158;
const INNER_R = 30;
const LABEL_R = 105;

// How far a hovered wedge translates outward from center
const HOVER_OFFSET = 8;

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
        const startAngle = -90 + i * 45;
        const endAngle = -90 + (i + 1) * 45;
        const midAngle = (startAngle + endAngle) / 2;
        const midRad = (midAngle * Math.PI) / 180;
        const labelX = CENTER + LABEL_R * Math.cos(midRad);
        const labelY = CENTER + LABEL_R * Math.sin(midRad);

        const isSelected = e.slug === selected;
        const isHovered = e.slug === hovered;

        const fillAlpha = isSelected ? "CC" : isHovered ? "88" : "40";
        const strokeColor =
          isSelected || isHovered ? e.color : "#F7F0E5";
        const strokeWidth = isSelected ? 4 : isHovered ? 4 : 3;

        // Pop the wedge outward from center on hover
        const offsetDist = isHovered ? HOVER_OFFSET : 0;
        const offsetX = offsetDist * Math.cos(midRad);
        const offsetY = offsetDist * Math.sin(midRad);

        // Slightly bigger label on hover too
        const labelSize = isHovered ? 16 : 15;
        const labelWeight = isHovered ? "600" : "500";

        const hoverHandlers = {
          onMouseEnter: () => setHovered(e.slug),
          onMouseLeave: () => setHovered(null),
        } as Record<string, () => void>;

        return (
          <G
            key={e.slug}
            transform={`translate(${offsetX} ${offsetY})`}
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
              style={{ cursor: "pointer", transition: "all 200ms ease-out" } as object}
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
              style={{ transition: "all 200ms ease-out" } as object}
            >
              {e.name}
            </SvgText>
          </G>
        );
      })}
      {/* Soft center hole */}
      <Circle cx={CENTER} cy={CENTER} r={INNER_R - 1.5} fill="#F7F0E5" />
    </Svg>
  );
}
