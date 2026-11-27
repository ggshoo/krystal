import PostHog from "posthog-react-native";

import type { AnalyticsClient } from "./posthogClient";

/**
 * Native PostHog client (posthog-react-native) for the iOS/Android builds.
 *
 * Same signature as the web file. Events land in the same PostHog project,
 * and PostHog tags them with $os / $app_version so web and phone users can
 * be split apart in dashboards.
 */
export function startPostHog(key: string, host: string): AnalyticsClient | null {
  const posthog = new PostHog(key, { host });

  return {
    identify: (id, props) => posthog.identify(id, props as never),
    reset: () => posthog.reset(),
    capture: (event, props) => posthog.capture(event, props as never),
  };
}
