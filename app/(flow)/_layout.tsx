import { Stack } from "expo-router";

/**
 * Stack layout for the daily reflection flow.
 * Each screen pushes onto this stack: check-in → emotion/* → done.
 * Header hidden so each screen owns its own composition.
 */
export default function FlowLayout() {
  return (
    <Stack
      screenOptions={{
        headerShown: false,
        contentStyle: { backgroundColor: "#FAF7F2" },
        animation: "slide_from_right",
      }}
    />
  );
}
