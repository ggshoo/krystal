/**
 * Crystal — tiny color helpers shared across the emotion tiles.
 */

/** Darken a #rrggbb hex by a fixed amount — used for chunky button "lips". */
export function shadeHex(hex: string, amount = 55): string {
  const n = parseInt(hex.slice(1), 16);
  const r = Math.max(0, ((n >> 16) & 255) - amount);
  const g = Math.max(0, ((n >> 8) & 255) - amount);
  const b = Math.max(0, (n & 255) - amount);
  return `#${((r << 16) | (g << 8) | b).toString(16).padStart(6, "0")}`;
}

/**
 * Blend a #rrggbb hex toward white and return an OPAQUE hex. `ratio` is how
 * much of the color to keep (0 = white, 1 = full color). Used for soft, still
 * readable mood-tinted card backgrounds that work on any scene.
 */
export function tintOnWhite(hex: string, ratio = 0.14): string {
  const n = parseInt(hex.slice(1), 16);
  const mix = (c: number) => Math.round(255 + (c - 255) * ratio);
  const r = mix((n >> 16) & 255);
  const g = mix((n >> 8) & 255);
  const b = mix(n & 255);
  return `#${((r << 16) | (g << 8) | b).toString(16).padStart(6, "0")}`;
}
