import { Redirect } from "expo-router";

/**
 * The check-in flow was split into three sequential screens (mind → body →
 * heart) for calmer pacing. The bare /check-in URL now redirects to the
 * first step.
 */
export default function CheckIn() {
  return <Redirect href="/check-in/mind" />;
}
