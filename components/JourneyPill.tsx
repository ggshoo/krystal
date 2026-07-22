import { Text, View } from "react-native";

type Props = {
  /** Pill text. Defaults to the daily framing. */
  label?: string;
};

/**
 * Small brushed-metal "chip" badge, e.g. "Today's little journey".
 * Echoes the chrome pill from the landing page, minus a gradient dependency —
 * a soft silver fill with a crisp border reads the same at this size.
 */
export function JourneyPill({ label = "Today's little journey" }: Props) {
  return (
    <View
      className="self-start rounded-chip"
      style={{
        backgroundColor: "#EDEFF1",
        borderWidth: 1,
        borderColor: "#C3C7CB",
        paddingVertical: 7,
        paddingHorizontal: 16,
        shadowColor: "#000",
        shadowOpacity: 0.12,
        shadowRadius: 6,
        shadowOffset: { width: 0, height: 3 },
      }}
    >
      <Text
        className="font-display"
        style={{
          color: "#4A4E52",
          fontSize: 12,
          fontWeight: "800",
          letterSpacing: 0.8,
          textTransform: "uppercase",
        }}
      >
        {label}
      </Text>
    </View>
  );
}
