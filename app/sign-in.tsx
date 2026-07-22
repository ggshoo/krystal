import { useRouter } from "expo-router";
import { useState } from "react";
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
import { currentScene } from "@/lib/scene";
import { supabase } from "@/lib/supabase";
import { useAuthStore } from "@/store/useAuthStore";

/**
 * Sign-in / upgrade-account screen.
 *
 * Upgrades the user's anonymous Supabase session to an email-linked account
 * so their reflections persist across devices. Existing data stays — the
 * user_id is the same before and after, the email is just attached.
 *
 * Flow: user types email → updateUser sends confirmation link → user opens
 * link in inbox → Supabase verifies → app picks it up via detectSessionInUrl.
 */
export default function SignIn() {
  const router = useRouter();
  const user = useAuthStore((s) => s.user);
  const scene = currentScene();

  const [email, setEmail] = useState("");
  const [sending, setSending] = useState(false);
  const [sent, setSent] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const alreadyLinked = !!user?.email;

  const handleSendLink = async () => {
    const trimmed = email.trim().toLowerCase();
    if (!trimmed) return;
    setSending(true);
    setError(null);

    const { error: updateError } = await supabase.auth.updateUser({
      email: trimmed,
    });

    if (updateError) {
      setError(updateError.message);
      setSending(false);
      return;
    }

    setSent(true);
    setSending(false);
  };

  const valid = email.trim().includes("@");

  return (
    <Scene edges={["top", "bottom"]}>
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : undefined}
        className="flex-1"
      >
        <View className="px-6 pt-6">
          <Pressable
            onPress={() => router.push("/")}
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

        <View className="flex-1 items-center justify-center px-8">
          {alreadyLinked ? (
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
                  . You can open crystal on any device and they'll be here.
                </Text>
              </FadeIn>
              <FadeIn delay={500} duration={500}>
                <ChunkyButton
                  label="Back home"
                  variant="primary"
                  onPress={() => router.push("/")}
                />
              </FadeIn>
            </>
          ) : sent ? (
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
                  className="mb-12 max-w-sm text-center font-body text-base font-semibold leading-relaxed"
                  style={{ color: scene.subInk }}
                >
                  We sent a confirmation link to{" "}
                  <Text className="font-display font-extrabold" style={{ color: scene.ink }}>
                    {email}
                  </Text>
                  . Open the email and tap the link to finish signing in. Your
                  existing reflections will stay attached.
                </Text>
              </FadeIn>
              <FadeIn delay={500} duration={500}>
                <ChunkyButton
                  label="Back home"
                  variant="primary"
                  onPress={() => router.push("/")}
                />
              </FadeIn>
            </>
          ) : (
            <>
              <FadeIn delay={0} duration={650}>
                <Text
                  className="mb-3 text-center font-display text-4xl font-extrabold tracking-tight"
                  style={{ color: scene.ink }}
                >
                  Save your reflections
                </Text>
              </FadeIn>
              <FadeIn delay={250} duration={650}>
                <Text
                  className="mb-10 max-w-sm text-center font-body text-base font-semibold leading-relaxed"
                  style={{ color: scene.subInk }}
                >
                  Add your email so your reflections follow you across devices.
                  We'll send you a confirmation link — no password to remember.
                </Text>
              </FadeIn>

              <FadeIn delay={450} duration={500}>
                <TextInput
                  autoFocus
                  keyboardType="email-address"
                  autoCapitalize="none"
                  autoCorrect={false}
                  placeholder="your@email.com"
                  placeholderTextColor="#9A8B76"
                  value={email}
                  onChangeText={setEmail}
                  onSubmitEditing={handleSendLink}
                  returnKeyType="send"
                  className="w-72 rounded-tile px-6 py-4 text-center font-body text-base text-ink"
                  style={{
                    backgroundColor: "#FFFDF6",
                    borderWidth: 2,
                    borderColor: "#E4D6BC",
                    shadowColor: "#2E2416",
                    shadowOpacity: 0.06,
                    shadowRadius: 12,
                    shadowOffset: { width: 0, height: 3 },
                  }}
                />
              </FadeIn>

              <FadeIn delay={600} duration={500}>
                <View className="mt-6">
                  <ChunkyButton
                    label={sending ? "Sending…" : "Send link"}
                    variant="primary"
                    disabled={!valid || sending}
                    loading={sending}
                    onPress={handleSendLink}
                  />
                </View>
              </FadeIn>

              {error && (
                <FadeIn delay={0} duration={400}>
                  <Text
                    className="mt-4 max-w-sm text-center font-body text-xs font-semibold"
                    style={{ color: scene.subInk }}
                  >
                    {error}
                  </Text>
                </FadeIn>
              )}
            </>
          )}
        </View>
      </KeyboardAvoidingView>
    </Scene>
  );
}
