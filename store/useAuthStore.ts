import type { Session, User } from "@supabase/supabase-js";
import { create } from "zustand";

import { supabase } from "@/lib/supabase";
import { useInventoryStore } from "@/store/useInventoryStore";
import { useReflectionStore } from "@/store/useReflectionStore";

/**
 * Auth state.
 *
 * Crystal requires an email account (decided 2026-11-27). Nobody gets a new
 * guest (anonymous) account any more; the root layout sends anyone who isn't
 * signed in with an email to /sign-in.
 *
 * Older guest sessions are still loaded if a device has one, because they
 * own real check-ins. The sign-in screen upgrades that guest account in place
 * (same user_id, so the entries stay) when the email is new to Crystal.
 */
type AuthState = {
  session: Session | null;
  user: User | null;
  initialized: boolean;
  error: string | null;
  initialize: () => Promise<void>;
  signOut: () => Promise<void>;
};

/** True when the user has a real (email) account, not a guest one. */
export function isSignedIn(user: User | null): boolean {
  return !!user && !!user.email && !user.is_anonymous;
}

let subscribed = false;

export const useAuthStore = create<AuthState>((set) => ({
  session: null,
  user: null,
  initialized: false,
  error: null,

  initialize: async () => {
    try {
      // Reuse a session persisted to AsyncStorage / localStorage, if any.
      const {
        data: { session },
      } = await supabase.auth.getSession();

      set({
        session,
        user: session?.user ?? null,
        initialized: true,
        error: null,
      });

      if (!subscribed) {
        subscribed = true;
        supabase.auth.onAuthStateChange((_event, newSession) => {
          const prevId = useAuthStore.getState().user?.id;
          const nextId = newSession?.user?.id;
          // Different person (or signed out): drop anything cached in memory
          // for the previous account.
          if (prevId && prevId !== nextId) {
            useInventoryStore.getState().reset();
            useReflectionStore.getState().reset();
          }
          set({ session: newSession, user: newSession?.user ?? null });
        });
      }
    } catch (e) {
      set({
        initialized: true,
        error: e instanceof Error ? e.message : String(e),
      });
    }
  },

  signOut: async () => {
    await supabase.auth.signOut();
    // onAuthStateChange clears session/user and cached data.
  },
}));
