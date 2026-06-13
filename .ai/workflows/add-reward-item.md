# Workflow — `add-reward-item`

How to add a new backpack item (scarf, glasses, bow tie, crown, etc.) end-to-end.

## When to use

When `current_state.md → Features In Progress` lists a new reward item to add, or when the user asks for one.

## Prerequisites

- Migration 007 has been run in Supabase (table `user_inventory` exists).
- The hat is working end-to-end on the live site (proves the pattern).
- You have the item's design parameters: slug, name, description, category, unlockStreak.

## Steps

### 1. Add the item to the catalog

Edit `lib/inventory.ts`:

```ts
// Extend ItemSlug union
export type ItemSlug = "hat" | "your-new-slug";

// Add to ITEMS array
export const ITEMS: Item[] = [
  { slug: "hat", name: "Tiny Hat", category: "headwear", unlockStreak: 5, ... },
  { slug: "your-new-slug", name: "Your Item", category: "...", unlockStreak: N, description: "..." },
];
```

### 2. Render the item in `GrapeCompanion.tsx`

- Add a derived const for whether the item is equipped:
  ```ts
  const hasYourItem = !!equipped?.includes("your-new-slug");
  ```
- If the item is headwear, hide the stem + leaves when equipped (same pattern as hat).
- Render the SVG in the right z-order: behind the face (cheeks/eyes/mouth), in front of the body and highlights. Look at the hat block for placement reference.
- Use the existing color palette (cream, ink, accent, muted) plus hat-specific hex if needed.

### 3. Verify in chat with `show_widget`

Before pushing, render the grape with the new item equipped via the `show_widget` tool so the human can visually approve.

### 4. Test the equip toggle

The backpack screen renders `ITEMS.map(...)` so your new item appears automatically. Confirm:

- It shows as "Locked" until streak ≥ unlockStreak.
- Once unlocked, tapping toggles equipped state.
- The grape preview at the top of the backpack updates immediately.

### 5. Update `current_state.md`

- Add the new item to Features Complete.
- Add a row to Recent Changes.
- Bump timestamp + name.

### 6. Update `session_log.md`

Append a new dated entry describing the addition.

### 7. Ship

Use the `ship` skill. Give the user the commit command. No migration needed (table already exists from 007).

## Verification

- Log into the live site as a user whose journal streak is past the unlockStreak. Item should appear in backpack.
- Equip it. Grape should show the new item on home, in flow corner, on Done, and on Journal.
- Unequip it. Item disappears, grape returns to default.

## Failure recovery

- **Item doesn't show in backpack:** check the catalog entry exists in `lib/inventory.ts` and the migration ran.
- **Item renders incorrectly:** the SVG coords are likely off. Use `show_widget` to iterate visually before pushing.
- **Item shows but tap doesn't toggle:** the `toggleEquipped` call requires a valid user_id and an existing row in `user_inventory`. The reconcile-on-load should create the row automatically once streak ≥ threshold; if it didn't, check the Supabase Logs tab for an RLS denial.

## Future items in the catalog

From `current_state.md → Phase 3 thoughts`:

- Bow tie · day 10
- Scarf · day 21
- Glasses · day 30
- Crown · day 100

Pick one, follow this workflow.
