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
