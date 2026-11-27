import * as Linking from "expo-linking";
import { useEffect } from "react";
import { AppState, Platform } from "react-native";

import { supabase } from "@/lib/supabase";
import { useAuthStore } from "@/store/useAuthStore";

/**
 * Crystal — getting the email-confirmation link back into the phone app.
 *
 * On web, Supabase reads the tokens from the URL itself (detectSessionInUrl).
 * On iOS/Android that doesn't happen, so:
 *
 *   1. sign-in.tsx asks Supabase to redirect the confirmation link to
 *      crystal://auth-callback (see `emailRedirectUrl`). That URL must be in
 *      Supabase → Authentication → URL Configuration → Redirect URLs.
 *   2. app/auth-callback.tsx calls `completeAuthFromUrl` with the incoming
 *      URL, which sets the session from the tokens in it.
 *   3. As a fallback (link opened on a laptop, in a browser that won't hand
 *      off to the app, etc.), `useRefreshPendingEmail` refreshes the session
 *      whenever the app comes back to the foreground while an email change is
 *      pending. The change is confirmed server-side, so a refresh is enough
 *      to pick up the new email.
 */

/** Where the confirmation email should send the user. Undefined on web. */
export function emailRedirectUrl(): string | undefined {
  if (Platform.OS === "web") return undefined;
  return Linking.createURL("auth-callback");
}

function paramsFrom(url: string): URLSearchParams {
  // Supabase puts tokens in the hash (implicit flow); errors may be in either.
  const hash = url.includes("#") ? url.split("#")[1] : "";
  const query = url.includes("?") ? url.split("?")[1].split("#")[0] : "";
  return new URLSearchParams([query, hash].filter(Boolean).join("&"));
}

/**
 * Finish sign-in from a deep link. Returns an error message, or null when the
 * session is up to date.
 */
export async function completeAuthFromUrl(url: string): Promise<string | null> {
  const params = paramsFrom(url);

  const errorDescription = params.get("error_description");
  if (errorDescription) return errorDescription.replace(/\+/g, " ");

  const access_token = params.get("access_token");
  const refresh_token = params.get("refresh_token");

  if (access_token && refresh_token) {
    const { error } = await supabase.auth.setSession({
      access_token,
      refresh_token,
    });
    return error?.message ?? null;
  }

  // No tokens (e.g. the first of two confirmation emails when Supabase's
  // "secure email change" is on). Refresh so the app sees the latest state.
  const { error } = await supabase.auth.refreshSession();
  return error?.message ?? null;
}

/** Refresh the session on foreground while an email change is pending. */
export function useRefreshPendingEmail(): void {
  useEffect(() => {
    if (Platform.OS === "web") return;

    const sub = AppState.addEventListener("change", (state) => {
      if (state !== "active") return;
      const user = useAuthStore.getState().user;
      if (user && !user.email && user.new_email) {
        supabase.auth.refreshSession();
      }
    });

    return () => sub.remove();
  }, []);
}
