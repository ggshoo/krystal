import { useRouter } from "expo-router";
import { useEffect, useState } from "react";
import {
  KeyboardAvoidingView,
  Platform,
  Pressable,
  Text,
  TextInput,
  View,
} from "react-native";

import { ChunkyButton } from "@/components/ChunkyButton";
import { FadeIn } from "@/components/FadeIn";
import { Scene } from "@/components/Scene";
import { emailRedirectUrl } from "@/lib/authLinking";
import { TAGLINE } from "@/lib/copy";
import { currentScene } from "@/lib/scene";
import { supabase } from "@/lib/supabase";
import { isSignedIn, useAuthStore } from "@/store/useAuthStore";

/**
 * Sign-in screen. Crystal requires an account, so the root layout sends
 * every signed-out visitor here.
 *
 * A small "or try it without an account" link under the button starts a
 * guest (anonymous) session; it's deliberately the quieter option.
 *
 * One email box for everyone. Supabase emails a one-time code, no password.
 * The emails carry the code only, no link (decided 2026-11-27): the link and
 * code share one token, and email link scanners (Outlook Safe Links etc.)
 * were "clicking" the link on arrival, which used up the code.
 *
 *   - New or returning person: signInWithOtp. Creates the account if the
 *     email is new, otherwise signs into the existing one with its history.
 *   - Device with an old guest (anonymous) session: first try to attach the
 *     email to the guest account (updateUser), which keeps its entries under
 *     the same user_id. If that email already has an account, fall back to a
 *     normal sign-in; the guest's entries stay behind (decided 2026-11-27).
 *
 * The code works on any device. app/auth-callback.tsx and the link handling
 * in lib/authLinking.ts stay in place in case a link is added back later.
 *
 * Supabase setup: the "Magic Link", "Confirm signup" and "Change Email
 * Address" email templates show {{ .Token }} and no {{ .ConfirmationURL }}.
 */

type Step = "email" | "code";
/** Which Supabase OTP type the emailed code belongs to. */
type CodeKind = "email" | "email_change";

function looksLikeTakenEmail(message: string, code?: string): boolean {
  return (
    code === "email_exists" ||
    /already (been )?registered|already exists/i.test(message)
  );
}

export default function SignIn() {
  const router = useRouter();
  const user = useAuthStore((s) => s.user);
  const signOut = useAuthStore((s) => s.signOut);
  const scene = currentScene();

  const [step, setStep] = useState<Step>("email");
  const [codeKind, setCodeKind] = useState<CodeKind>("email");
  const [email, setEmail] = useState("");
  const [code, setCode] = useState("");
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const signedIn = isSignedIn(user);
  // Using crystal without an account (anonymous session on this device).
  const isGuest = !!user && !signedIn;

  // The link in the email can sign this device in while the code step is
  // open (web tab, or the app via auth-callback). Move on when it does.
  useEffect(() => {
    if (signedIn && step === "code") router.replace("/");
  }, [signedIn, step, router]);

  const trimmedEmail = email.trim().toLowerCase();
  const validEmail = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(trimmedEmail);
  const validCode = /^\d{6,10}$/.test(code.trim());

  const sendCode = async () => {
    if (!validEmail || busy) return;
    setBusy(true);
    setError(null);
    const redirect = emailRedirectUrl();

    // Old guest session on this device: try to keep its entries.
    if (user?.is_anonymous) {
      const { error: upgradeError } = await supabase.auth.updateUser(
        { email: trimmedEmail },
        { emailRedirectTo: redirect }
      );
      if (!upgradeError) {
        setCodeKind("email_change");
        setStep("code");
        setBusy(false);
        return;
      }
      if (!looksLikeTakenEmail(upgradeError.message, upgradeError.code)) {
        setError(upgradeError.message);
        setBusy(false);
        return;
      }
      // Email already has an account: sign into that one instead.
    }

    const { error: otpError } = await supabase.auth.signInWithOtp({
      email: trimmedEmail,
      options: { shouldCreateUser: true, emailRedirectTo: redirect },
    });
    if (otpError) {
      setError(otpError.message);
      setBusy(false);
      return;
    }
    setCodeKind("email");
    setStep("code");
    setBusy(false);
  };

  const verifyCode = async () => {
    if (!validCode || busy) return;
    setBusy(true);
    setError(null);
    const { error: verifyError } = await supabase.auth.verifyOtp({
      email: trimmedEmail,
      token: code.trim(),
      type: codeKind,
    });
    setBusy(false);
    if (verifyError) {
      setError(
        /expired|invalid/i.test(verifyError.message)
          ? "That code didn't work. Check it, or send a new one."
          : verifyError.message
      );
      return;
    }
    router.replace("/");
  };

  // Quiet second option: start a guest session on this device. Entries carry
  // over if they add an email later (same user_id via updateUser).
  const tryAsGuest = async () => {
    if (busy) return;
    setBusy(true);
    setError(null);
    const { error: guestError } = await supabase.auth.signInAnonymously();
    setBusy(false);
    if (guestError) {
      setError(guestError.message);
      return;
    }
    router.replace("/");
  };

  const startOver = () => {
    setStep("email");
    setCode("");
    setError(null);
  };

  const inputStyle = {
    backgroundColor: "#FFFDF6",
    borderWidth: 2,
    borderColor: "#E4D6BC",
    shadowColor: "#2E2416",
    shadowOpacity: 0.06,
    shadowRadius: 12,
    shadowOffset: { width: 0, height: 3 },
  };

  const errorLine = error && (
    <FadeIn delay={0} duration={400}>
      <Text
        className="mt-4 max-w-sm text-center font-body text-xs font-semibold"
        style={{ color: scene.subInk }}
      >
        {error}
      </Text>
    </FadeIn>
  );

  return (
    <Scene edges={["top", "bottom"]}>
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : undefined}
        className="flex-1"
      >
        {(signedIn || isGuest) && (
          <View className="px-6 pt-6">
            <Pressable
              onPress={() => router.replace("/")}
              className="px-2 py-2 transition-all duration-300 hover:opacity-70"
            >
              <Text
                className="font-body text-sm font-bold"
                style={{ color: scene.subInk }}
              >
                ← Home
              </Text>
            </Pressable>
          </View>
        )}

        <View className="flex-1 items-center justify-center px-8">
          {signedIn ? (
            <>
              <FadeIn delay={0} duration={650}>
                <Text
                  className="mb-3 text-center font-display text-4xl font-extrabold tracking-tight"
                  style={{ color: scene.ink }}
                >
                  You're signed in.
                </Text>
              </FadeIn>
              <FadeIn delay={250} duration={650}>
                <Text
                  className="mb-12 max-w-sm text-center font-body text-base font-semibold leading-relaxed"
                  style={{ color: scene.subInk }}
                >
                  Your reflections are saved to{" "}
                  <Text className="font-display font-extrabold" style={{ color: scene.ink }}>
                    {user?.email}
                  </Text>
                  . Sign in with the same email on any device and they'll be
                  there.
                </Text>
              </FadeIn>
              <FadeIn delay={500} duration={500}>
                <ChunkyButton
                  label="Back home"
                  variant="primary"
                  onPress={() => router.replace("/")}
                />
              </FadeIn>
              <FadeIn delay={650} duration={500}>
                <View className="mt-4">
                  <ChunkyButton
                    label="Sign out"
                    variant="ghost"
                    onPress={signOut}
                  />
                </View>
              </FadeIn>
            </>
          ) : step === "code" ? (
            <>
              <FadeIn delay={0} duration={650}>
                <Text
                  className="mb-3 text-center font-display text-4xl font-extrabold tracking-tight"
                  style={{ color: scene.ink }}
                >
                  Check your inbox.
                </Text>
              </FadeIn>
              <FadeIn delay={250} duration={650}>
                <Text
                  className="mb-10 max-w-sm text-center font-body text-base font-semibold leading-relaxed"
                  style={{ color: scene.subInk }}
                >
                  We sent a code to{" "}
                  <Text className="font-display font-extrabold" style={{ color: scene.ink }}>
                    {trimmedEmail}
                  </Text>
                  . Type it here to sign in.
                </Text>
              </FadeIn>

              <FadeIn delay={450} duration={500}>
                <TextInput
                  autoFocus
                  keyboardType="number-pad"
                  textContentType="oneTimeCode"
                  autoComplete="one-time-code"
                  maxLength={10}
                  placeholder="123456"
                  placeholderTextColor="#9A8B76"
                  value={code}
                  onChangeText={(t) => setCode(t.replace(/\D/g, ""))}
                  onSubmitEditing={verifyCode}
                  returnKeyType="done"
                  className="w-56 rounded-tile px-6 py-4 text-center font-display text-2xl tracking-widest text-ink"
                  style={inputStyle}
                />
              </FadeIn>

              <FadeIn delay={600} duration={500}>
                <View className="mt-6">
                  <ChunkyButton
                    label={busy ? "Checking…" : "Sign in"}
                    variant="primary"
                    disabled={!validCode || busy}
                    loading={busy}
                    onPress={verifyCode}
                  />
                </View>
              </FadeIn>

              {errorLine}

              <FadeIn delay={750} duration={500}>
                <View className="mt-6 flex-row gap-6">
                  <Pressable onPress={sendCode} disabled={busy}>
                    <Text
                      className="font-body text-sm font-bold underline"
                      style={{ color: scene.subInk }}
                    >
                      Send a new code
                    </Text>
                  </Pressable>
                  <Pressable onPress={startOver} disabled={busy}>
                    <Text
                      className="font-body text-sm font-bold underline"
                      style={{ color: scene.subInk }}
                    >
                      Use a different email
                    </Text>
                  </Pressable>
                </View>
              </FadeIn>
            </>
          ) : (
            <>
              <FadeIn delay={0} duration={650}>
                <Text
                  className="mb-3 text-center font-display text-6xl font-extrabold tracking-tight"
                  style={{ color: scene.ink }}
                >
                  crystal
                </Text>
              </FadeIn>
              <FadeIn delay={250} duration={650}>
                <Text
                  className="mb-10 max-w-xs text-center font-body text-base font-semibold leading-relaxed"
                  style={{ color: scene.subInk }}
                >
                  {TAGLINE}
                </Text>
              </FadeIn>
              <FadeIn delay={400} duration={650}>
                <Text
                  className="mb-4 max-w-sm text-center font-body text-sm font-semibold leading-relaxed"
                  style={{ color: scene.subInk }}
                >
                  {isGuest
                    ? "You're trying crystal without an account, so your reflections are only on this device. Add your email to keep them."
                    : "Sign in with your email to save your reflections. We'll send you a code, no password needed."}
                </Text>
              </FadeIn>

              <FadeIn delay={550} duration={500}>
                <TextInput
                  autoFocus
                  keyboardType="email-address"
                  textContentType="emailAddress"
                  autoComplete="email"
                  autoCapitalize="none"
                  autoCorrect={false}
                  placeholder="your@email.com"
                  placeholderTextColor="#9A8B76"
                  value={email}
                  onChangeText={setEmail}
                  onSubmitEditing={sendCode}
                  returnKeyType="send"
                  className="w-72 rounded-tile px-6 py-4 text-center font-body text-base text-ink"
                  style={inputStyle}
                />
              </FadeIn>

              <FadeIn delay={700} duration={500}>
                <View className="mt-6">
                  <ChunkyButton
                    label={busy ? "Sending…" : "Send code"}
                    variant="primary"
                    disabled={!validEmail || busy}
                    loading={busy}
                    onPress={sendCode}
                  />
                </View>
              </FadeIn>

              {errorLine}

              {!user && (
                <FadeIn delay={1100} duration={600}>
                  <Pressable
                    onPress={tryAsGuest}
                    disabled={busy}
                    className="mt-10 px-2 py-2 transition-all duration-300 hover:opacity-70"
                  >
                    <Text
                      className="font-body text-xs font-semibold underline"
                      style={{ color: scene.subInk, opacity: 0.75 }}
                    >
                      or try it without an account
                    </Text>
                  </Pressable>
                </FadeIn>
              )}
            </>
          )}
        </View>
      </KeyboardAvoidingView>
    </Scene>
  );
}
