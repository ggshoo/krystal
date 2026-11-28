import { Redirect } from "expo-router";

/**
 * Replaced by the feelings wheel (app/(flow)/emotion/primary.tsx), where the
 * middle and outer rings open on the same screen. Kept as a redirect so old
 * links and back buttons land on the wheel.
 */
export default function LegacyTiles() {
  return <Redirect href="/emotion/primary" />;
}
