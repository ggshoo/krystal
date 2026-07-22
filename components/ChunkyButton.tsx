import { ReactNode, useState } from "react";
import {
  ActivityIndicator,
  Pressable,
  Text,
  View,
  ViewStyle,
} from "react-native";

type Variant = "primary" | "gold" | "ghost";
type Size = "lg" | "md";

type Props = {
  label: string;
  onPress?: () => void;
  variant?: Variant;
  size?: Size;
  disabled?: boolean;
  loading?: boolean;
  /** Optional leading glyph (emoji/text) shown before the label. */
  icon?: ReactNode;
  accessibilityLabel?: string;
  style?: ViewStyle;
  full?: boolean;
};

const PALETTE: Record<
  Variant,
  { bg: string; lip: string; text: string; border?: string }
> = {
  primary: { bg: "#E97451", lip: "#B9502E", text: "#FFFFFF" },
  gold: { bg: "#E9B54A", lip: "#B9862B", text: "#2E2416" },
  ghost: { bg: "#FFF8E8", lip: "#B79B7E", text: "#6B4A32", border: "#6B4A32" },
};

/**
 * Chunky storybook button with a hard bottom "lip" that presses down when
 * tapped — the tactile, game-menu feel from the reference landing page.
 *
 * The lip is a thick bottom border; on press the button translates down and
 * the lip shrinks, so it looks like it's being pushed into the page.
 */
export function ChunkyButton({
  label,
  onPress,
  variant = "primary",
  size = "lg",
  disabled = false,
  loading = false,
  icon,
  accessibilityLabel,
  style,
  full = false,
}: Props) {
  const [pressed, setPressed] = useState(false);
  const p = PALETTE[variant];
  const isDisabled = disabled || loading;

  const padY = size === "lg" ? 16 : 12;
  const padX = size === "lg" ? 30 : 22;
  const fontSize = size === "lg" ? 17 : 15;
  const lip = pressed ? 2 : 6;

  return (
    <Pressable
      accessibilityRole="button"
      accessibilityLabel={accessibilityLabel ?? label}
      accessibilityState={{ disabled: isDisabled }}
      disabled={isDisabled}
      onPress={onPress}
      onPressIn={() => setPressed(true)}
      onPressOut={() => setPressed(false)}
      style={[
        {
          alignSelf: full ? "stretch" : "flex-start",
          opacity: isDisabled ? 0.55 : 1,
          transform: [{ translateY: pressed ? 4 : 0 }],
        },
        style,
      ]}
    >
      <View
        style={{
          backgroundColor: p.bg,
          borderRadius: 18,
          paddingVertical: padY,
          paddingHorizontal: padX,
          borderBottomWidth: lip,
          borderBottomColor: p.lip,
          borderWidth: p.border ? 2 : undefined,
          borderColor: p.border,
          flexDirection: "row",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        {loading ? (
          <ActivityIndicator color={p.text} />
        ) : (
          <>
            {icon ? <View style={{ marginRight: 8 }}>{icon}</View> : null}
            <Text
              className="font-display"
              style={{
                color: p.text,
                fontSize,
                fontWeight: "800",
                letterSpacing: 0.3,
              }}
            >
              {label}
            </Text>
          </>
        )}
      </View>
    </Pressable>
  );
}
