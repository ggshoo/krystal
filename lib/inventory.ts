/**
 * Krystal — rewards ladder.
 *
 * The single source of truth for what the user unlocks at which streak.
 * Read by the home page (special grape messages), the journal save flow
 * (unlock detection), the backpack screen (display), and GrapeCompanion
 * (rendering equipped items).
 *
 * Two flavors of reward:
 *
 *   - The GRAPE itself is dynamic: it appears on Home when the user's
 *     journal streak ≥ 2 and disappears if they break the streak. The grape
 *     is companionship — you have to keep showing up. It is NOT a stored
 *     inventory item.
 *
 *   - ITEMS (hats, accessories) are persistent. Once earned, they stay in
 *     the backpack forever. The user can equip / unequip them on the grape.
 *     These are stored in the `user_inventory` table (added in migration
 *     007 — see Phase 2).
 *
 * Adding a new item? Add it here, add a migration that doesn't really
 * need a schema change (just data), and add a rendering case in
 * GrapeCompanion. The unlock flow is automatic via reconcileInventory().
 */

export type ItemSlug = "hat";
// Future: "bow" | "glasses" | "scarf" | "crown" | ...

export type ItemCategory = "headwear" | "accessory";

export type Item = {
  slug: ItemSlug;
  name: string;
  description: string;
  category: ItemCategory;
  /** Journal-streak threshold at which this item is awarded. */
  unlockStreak: number;
};

export const ITEMS: Item[] = [
  {
    slug: "hat",
    name: "Tiny Hat",
    description: "A modest little cap. Hand-knit by the grape's grandmother.",
    category: "headwear",
    unlockStreak: 5,
  },
];

/** Journal-streak threshold at which the grape itself first appears on Home. */
export const GRAPE_UNLOCK_STREAK = 2;

/** Items the user is entitled to at the given streak. */
export function itemsEarnedAt(streak: number): Item[] {
  return ITEMS.filter((i) => streak >= i.unlockStreak);
}

/** The next item the user is working toward (or null if they have everything). */
export function nextUnlock(streak: number): Item | null {
  const remaining = ITEMS.filter((i) => i.unlockStreak > streak).sort(
    (a, b) => a.unlockStreak - b.unlockStreak
  );
  return remaining[0] ?? null;
}

/** Did the user JUST hit this item's unlock today? Drives the "you earned X!" UX. */
export function itemJustUnlocked(
  previousStreak: number,
  newStreak: number
): Item | null {
  return (
    ITEMS.find(
      (i) => previousStreak < i.unlockStreak && newStreak >= i.unlockStreak
    ) ?? null
  );
}
