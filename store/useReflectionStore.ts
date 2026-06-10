import { create } from "zustand";

/**
 * Draft state for one in-progress daily reflection.
 * Cleared after the user submits the entry to Supabase.
 *
 * Emotion fields hold slugs from `lib/emotions.ts` — converted to a
 * Supabase `emotion_details.id` at save time.
 *
 * Journal fields are optional and only filled if the user continues to
 * the Journal screen after the Done screen.
 */
export type ReflectionDraft = {
  // Check-in scores
  mind_score?: number;
  body_score?: number;
  heart_score?: number;
  // Roberts wheel selection
  emotion_primary?: string;
  emotion_secondary?: string;
  emotion_specific?: string;
  // Plutchik intensity ladder selection
  plutchik_emotion?: string;
  // Set after the daily_checkins row is inserted on the Done screen.
  // Used by the Journal screen to link the journal_entries row.
  daily_checkin_id?: string;
  // Journal prompts (filled on the Journal screen)
  journal_reflection?: string;
  journal_why_feeling?: string;
  journal_body_sensations?: string;
  journal_what_is_hard?: string;
  journal_what_is_life_giving?: string;
  journal_what_do_you_need?: string;
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
