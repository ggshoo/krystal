import { create } from "zustand";

import { ITEMS, ItemSlug } from "@/lib/inventory";
import { supabase } from "@/lib/supabase";

/**
 * Krystal — inventory store.
 *
 * One row per (user, item) in `user_inventory`. We hold a hydrated copy
 * here so the home page, backpack screen, and GrapeCompanion can read
 * without re-fetching every render. The store is keyed by item_slug for
 * O(1) lookup of "do I own X?" / "is X equipped?".
 *
 * Three responsibilities:
 *
 *   1. hydrate(userId)        — pulls the user's inventory rows on app boot.
 *   2. reconcile(userId, streak) — inserts any items the user has earned
 *                                  but doesn't yet own. Called from Home
 *                                  every time we recompute streak.
 *   3. toggleEquipped(slug)   — flips equipped, writes through to Supabase.
 */

type InventoryRow = {
  item_slug: ItemSlug;
  unlocked_at: string;
  equipped: boolean;
};

type InventoryState = {
  byId: Partial<Record<ItemSlug, InventoryRow>>;
  hydrated: boolean;
  hydrate: (userId: string) => Promise<void>;
  reconcile: (userId: string, streak: number) => Promise<ItemSlug[]>;
  toggleEquipped: (userId: string, slug: ItemSlug) => Promise<void>;
  isOwned: (slug: ItemSlug) => boolean;
  isEquipped: (slug: ItemSlug) => boolean;
  equippedSlugs: () => ItemSlug[];
  reset: () => void;
};

export const useInventoryStore = create<InventoryState>((set, get) => ({
  byId: {},
  hydrated: false,

  hydrate: async (userId) => {
    const { data, error } = await supabase
      .from("user_inventory")
      .select("item_slug, unlocked_at, equipped")
      .eq("user_id", userId);
    if (error || !data) {
      set({ hydrated: true });
      return;
    }
    const byId: Partial<Record<ItemSlug, InventoryRow>> = {};
    for (const row of data) {
      byId[row.item_slug as ItemSlug] = row as InventoryRow;
    }
    set({ byId, hydrated: true });
  },

  reconcile: async (userId, streak) => {
    const owned = get().byId;
    const earned = ITEMS.filter(
      (i) => streak >= i.unlockStreak && !owned[i.slug]
    );
    if (earned.length === 0) return [];

    const rows = earned.map((i) => ({
      user_id: userId,
      item_slug: i.slug,
      equipped: false,
    }));
    const { error } = await supabase
      .from("user_inventory")
      .upsert(rows, { onConflict: "user_id, item_slug" });
    if (error) return [];

    // Reflect locally so UI updates without a refetch
    set((s) => {
      const next = { ...s.byId };
      for (const i of earned) {
        next[i.slug] = {
          item_slug: i.slug,
          unlocked_at: new Date().toISOString(),
          equipped: false,
        };
      }
      return { byId: next };
    });
    return earned.map((i) => i.slug);
  },

  toggleEquipped: async (userId, slug) => {
    const current = get().byId[slug];
    if (!current) return;
    const next = !current.equipped;

    // Optimistic local update
    set((s) => ({
      byId: { ...s.byId, [slug]: { ...current, equipped: next } },
    }));

    const { error } = await supabase
      .from("user_inventory")
      .update({ equipped: next })
      .eq("user_id", userId)
      .eq("item_slug", slug);

    if (error) {
      // Rollback on failure
      set((s) => ({
        byId: { ...s.byId, [slug]: { ...current, equipped: !next } },
      }));
    }
  },

  isOwned: (slug) => !!get().byId[slug],
  isEquipped: (slug) => !!get().byId[slug]?.equipped,
  equippedSlugs: () =>
    (Object.values(get().byId) as InventoryRow[])
      .filter((r) => r.equipped)
      .map((r) => r.item_slug),

  reset: () => set({ byId: {}, hydrated: false }),
}));
