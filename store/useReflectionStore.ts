import { create } from "zustand";

/**
 * Draft state for one in-progress daily reflection.
 * Cleared after the user submits the entry to Supabase (Phase 5.3).
 *
 * Emotion fields hold slugs from `lib/emotions.ts` — converted to a
 * Supabase `emotion_details.id` at save time.
 */
export type ReflectionDraft = {
  mind_score?: number;
  body_score?: number;
  heart_score?: number;
  // Roberts wheel selection
  emotion_primary?: string;
  emotion_secondary?: string;
  emotion_specific?: string;
  // Plutchik intensity ladder selection (added after specific)
  plutchik_emotion?: string;
  // Journal fields land in v0.2 with the Reflect screen.
};

type ReflectionState = {
  draft: ReflectionDraft;

  setField: <K extends keyof ReflectionDraft>(
    key: K,
    value: ReflectionDraft[K]
  ) => void;

  /** Sets primary emotion and clears any downstream selections. */
  setEmotionPrimary: (slug: string) => void;

  /** Sets secondary emotion and clears the specific selection. */
  setEmotionSecondary: (slug: string) => void;

  setEmotionSpecific: (slug: string) => void;

  reset: () => void;
};

export const useReflectionStore = create<ReflectionState>((set) => ({
  draft: {},

  setField: (key, value) =>
    set((state) => ({ draft: { ...state.draft, [key]: value } })),

  setEmotionPrimary: (slug) =>
    set((state) => ({
      draft: {
        ...state.draft,
        emotion_primary: slug,
        emotion_secondary: undefined,
        emotion_specific: undefined,
      },
    })),

  setEmotionSecondary: (slug) =>
    set((state) => ({
      draft: {
        ...state.draft,
        emotion_secondary: slug,
        emotion_specific: undefined,
      },
    })),

  setEmotionSpecific: (slug) =>
    set((state) => ({
      draft: { ...state.draft, emotion_specific: slug },
    })),

  reset: () => set({ draft: {} }),
}));
