import posthog from "posthog-js";

/**
 * Web PostHog client (posthog-js, browser SDK).
 *
 * Metro picks `posthogClient.native.ts` on iOS/Android instead of this file,
 * so `lib/analytics.ts` stays platform-agnostic. Both files must export the
 * same `startPostHog` signature.
 */

export type AnalyticsClient = {
  identify: (id: string, props?: Record<string, unknown>) => void;
  reset: () => void;
  capture: (event: string, props?: Record<string, unknown>) => void;
};

export function startPostHog(key: string, host: string): AnalyticsClient | null {
  // Guard against non-browser contexts (e.g. static export / SSR).
  if (typeof window === "undefined") return null;

  posthog.init(key, {
    api_host: host,
    capture_pageview: true,
    persistence: "localStorage",
  });

  return {
    identify: (id, props) => posthog.identify(id, props),
    reset: () => posthog.reset(),
    capture: (event, props) => posthog.capture(event, props),
  };
}
