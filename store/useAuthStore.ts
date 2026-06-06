import type { Session, User } from "@supabase/supabase-js";
import { create } from "zustand";

import { supabase } from "@/lib/supabase";

/**
 * Auth state. On first launch we silently sign the user in anonymously so
 * reflections can save without an email step (v0.1 ship-first strategy).
 *
 * In v0.2 we'll add a Settings → "Save your account with email" flow that
 * upgrades the anonymous session to a real one via Supabase's
 * `linkIdentity` API, preserving all existing data.
 */
type AuthState = {
  session: Session | null;
  user: User | null;
  initialized: boolean;
  error: string | null;
  initialize: () => Promise<void>;
};

export const useAuthStore = create<AuthState>((set) => ({
  session: null,
  user: null,
  initialized: false,
  error: null,

  initialize: async () => {
    try {
      // Reuse an existing session if one was persisted to AsyncStorage
      const {
        data: { session: existing },
      } = await supabase.auth.getSession();

      let session = existing;

      if (!session) {
        // No session — create an anonymous one
        const { data, error } = await supabase.auth.signInAnonymously();
        if (error) {
          set({ initialized: true, error: error.message });
          return;
        }
        session = data.session;
      }

      set({
        session,
        user: session?.user ?? null,
        initialized: true,
        error: null,
      });

      // Subscribe to future auth changes (e.g. anonymous → email upgrade)
      supabase.auth.onAuthStateChange((_event, newSession) => {
        set({
          session: newSession,
          user: newSession?.user ?? null,
        });
      });
    } catch (e) {
      set({
        initialized: true,
        error: e instanceof Error ? e.message : String(e),
      });
    }
  },
}));
