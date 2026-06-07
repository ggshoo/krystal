import { Stack } from "expo-router";

/**
 * Stack layout for the daily reflection flow.
 * Each screen pushes onto this stack: check-in → emotion/* → done.
 *
 * Animation: fade — slower, calmer transitions matching the product's
 * calm-evoking aesthetic. Slide-from-right felt too transactional.
 */
export default function FlowLayout() {
  return (
    <Stack
      screenOptions={{
        headerShown: false,
        contentStyle: { backgroundColor: "#F7F0E5" },
        animation: "fade",
        animationDuration: 700,
      }}
    />
  );
}
