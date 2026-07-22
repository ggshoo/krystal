/**
 * Crystal — the daily scene.
 *
 * The app's backdrop is a soft, storybook landscape (sky + rolling hills)
 * that shifts through the day, so opening Crystal feels like stepping into
 * a slightly different moment each time — a small, quiet sense of a day
 * unfolding. Four moods, chosen by the local clock:
 *
 *   morning  05:00–10:59   sunrise pastels, sun low on the left
 *   day      11:00–16:59   bright mint→gold, sun high on the right
 *   dusk     17:00–20:59   lavender→sunset, sun sinking on the right
 *   night    21:00–04:59   deep indigo, a pale moon
 *
 * Everything the UI needs to tint itself for the current moment lives on the
 * returned Scene object, so screens never hard-code colors for a time of day.
 */

export type SceneKey = "morning" | "day" | "dusk" | "night";

export type Scene = {
  key: SceneKey;
  /** Whether this is a dark-ish scene (drives status bar + text choices). */
  isDark: boolean;
  /** Sky gradient stops, top → bottom. */
  sky: string[];
  /** Three hill bands, back → front. */
  hills: [string, string, string];
  /** The celestial body (sun or moon). */
  orb: {
    x: number; // 0..1 across the width
    y: number; // 0..1 down the height (kept in the upper third)
    color: string;
    glow: string;
    /** moon gets a soft crescent shadow; sun does not. */
    isMoon: boolean;
  };
  /** Primary text color that reads well directly on the sky. */
  ink: string;
  /** Secondary / muted text color on the sky. */
  subInk: string;
  /** A tiny scattering of stars (night only). */
  stars: boolean;
};

const SCENES: Record<SceneKey, Scene> = {
  morning: {
    key: "morning",
    isDark: false,
    sky: ["#FBD3B0", "#F7E7B8", "#CDE9D4"],
    hills: ["#7FB06A", "#6FA050", "#537E3E"],
    orb: { x: 0.24, y: 0.26, color: "#FFE7A8", glow: "#FBC77F", isMoon: false },
    ink: "#2E2416",
    subInk: "#6B5B44",
    stars: false,
  },
  day: {
    key: "day",
    isDark: false,
    sky: ["#BFE8DA", "#F4E3A6", "#F0C978"],
    hills: ["#6FA050", "#5C8C48", "#4F7A3D"],
    orb: { x: 0.8, y: 0.2, color: "#FFF0B8", glow: "#F4D06A", isMoon: false },
    ink: "#2E2416",
    subInk: "#6B5B44",
    stars: false,
  },
  dusk: {
    key: "dusk",
    isDark: true,
    sky: ["#6E5C99", "#C77E86", "#EFB65A"],
    hills: ["#4A5A46", "#39472F", "#293722"],
    orb: { x: 0.76, y: 0.3, color: "#FFD98A", glow: "#E98A5A", isMoon: false },
    ink: "#FBEFD9",
    subInk: "#E7D6C0",
    stars: false,
  },
  night: {
    key: "night",
    isDark: true,
    sky: ["#1E2A50", "#354067", "#5A5686"],
    hills: ["#25321F", "#1E2A1A", "#161F14"],
    orb: { x: 0.78, y: 0.22, color: "#F3F1E6", glow: "#AEB6E0", isMoon: true },
    ink: "#F5ECDA",
    subInk: "#C9BBD4",
    stars: true,
  },
};

/** Pick the scene for a given hour (0–23). Exposed for testing. */
export function sceneForHour(hour: number): Scene {
  if (hour >= 5 && hour < 11) return SCENES.morning;
  if (hour >= 11 && hour < 17) return SCENES.day;
  if (hour >= 17 && hour < 21) return SCENES.dusk;
  return SCENES.night;
}

/** The scene for right now (local time). */
export function currentScene(now: Date = new Date()): Scene {
  return sceneForHour(now.getHours());
}
