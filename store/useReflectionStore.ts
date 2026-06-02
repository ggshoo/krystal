import { create } from "zustand";

/**
 * Draft state for one in-progress daily reflection.
 * Cleared after the user submits the entry to Supabase (Phase 6).
 */
export type ReflectionDraft = {
  mind_score?: number;
  body_score?: number;
  heart_score?: number;
  emotion_primary?: string;
  emotion_secondary?: string;
  emotion_specific?: string;
  journal_cause?: string;
  journal_purpose?: string;
  journal_sensation?: string;
};

type ReflectionState = {
  draft: ReflectionDraft;
  setField: <K extends keyof ReflectionDraft>(
    key: K,
    value: ReflectionDraft[K]
  ) => void;
  reset: () => void;
};

export const useReflectionStore = create<ReflectionState>((set) => ({
  draft: {},
  setField: (key, value) =>
    set((state) => ({ draft: { ...state.draft, [key]: value } })),
  reset: () => set({ draft: {} })
}));
