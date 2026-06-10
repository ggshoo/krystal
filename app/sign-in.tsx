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
import { SafeAreaView } from "react-native-safe-area-context";

import { FadeIn } from "@/components/FadeIn";
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
    <SafeAreaView className="flex-1 bg-cream" edges={["top", "bottom"]}>
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : undefined}
        className="flex-1"
      >
        <View className="px-6 pt-6">
          <Pressable
            onPress={() => router.push("/")}
            className="px-2 py-2 transition-all duration-300 hover:opacity-70"
          >
            <Text className="text-sm text-muted">← Home</Text>
          </Pressable>
        </View>

        <View className="flex-1 items-center justify-center px-8">
          {alreadyLinked ? (
            <>
              <FadeIn delay={0} duration={650}>
                <Text className="mb-3 text-center text-3xl font-semibold tracking-tight text-ink">
                  You're signed in.
                </Text>
              </FadeIn>
              <FadeIn delay={250} duration={650}>
                <Text className="mb-12 max-w-sm text-center text-base leading-relaxed text-muted">
                  Your reflections are saved to{" "}
                  <Text className="font-semibold text-ink">{user?.email}</Text>.
                  You can open krystal on any device and they'll be here.
                </Text>
              </FadeIn>
              <FadeIn delay={500} duration={500}>
                <Pressable
                  className="rounded-full bg-accent px-10 py-5 shadow-sm transition-all duration-300 hover:scale-[1.15] hover:shadow-2xl"
                  onPress={() => router.push("/")}
                >
                  <Text className="text-base font-medium tracking-wide text-white">
                    Back home
                  </Text>
                </Pressable>
              </FadeIn>
            </>
          ) : sent ? (
            <>
              <FadeIn delay={0} duration={650}>
                <Text className="mb-3 text-center text-3xl font-semibold tracking-tight text-ink">
                  Check your inbox.
                </Text>
              </FadeIn>
              <FadeIn delay={250} duration={650}>
                <Text className="mb-12 max-w-sm text-center text-base leading-relaxed text-muted">
                  We sent a confirmation link to{" "}
                  <Text className="font-semibold text-ink">{email}</Text>. Open
                  the email and tap the link to finish signing in. Your existing
                  reflections will stay attached.
                </Text>
              </FadeIn>
              <FadeIn delay={500} duration={500}>
                <Pressable
                  className="rounded-full bg-accent px-10 py-5 shadow-sm transition-all duration-300 hover:scale-[1.15] hover:shadow-2xl"
                  onPress={() => router.push("/")}
                >
                  <Text className="text-base font-medium tracking-wide text-white">
                    Back home
                  </Text>
                </Pressable>
              </FadeIn>
            </>
          ) : (
            <>
              <FadeIn delay={0} duration={650}>
                <Text className="mb-3 text-center text-3xl font-semibold tracking-tight text-ink">
                  Save your reflections
                </Text>
              </FadeIn>
              <FadeIn delay={250} duration={650}>
                <Text className="mb-10 max-w-sm text-center text-base leading-relaxed text-muted">
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
                  placeholderTextColor="#B8AC9B"
                  value={email}
                  onChangeText={setEmail}
                  onSubmitEditing={handleSendLink}
                  returnKeyType="send"
                  className="w-72 rounded-full bg-surface px-6 py-4 text-center text-base text-ink"
                  style={{
                    shadowColor: "#2D2520",
                    shadowOpacity: 0.04,
                    shadowRadius: 12,
                    shadowOffset: { width: 0, height: 2 },
                  }}
                />
              </FadeIn>

              <FadeIn delay={600} duration={500}>
                <Pressable
                  disabled={!valid || sending}
                  onPress={handleSendLink}
                  className={`mt-6 rounded-full px-10 py-5 shadow-sm transition-all duration-300 ${
                    valid && !sending
                      ? "bg-accent hover:scale-[1.15] hover:shadow-2xl active:opacity-70"
                      : "bg-ink/10"
                  }`}
                >
                  <Text
                    className={`text-base font-medium tracking-wide ${
                      valid && !sending ? "text-white" : "text-muted"
                    }`}
                  >
                    {sending ? "Sending…" : "Send link"}
                  </Text>
                </Pressable>
              </FadeIn>

              {error && (
                <FadeIn delay={0} duration={400}>
                  <Text className="mt-4 max-w-sm text-center text-xs text-muted">
                    {error}
                  </Text>
                </FadeIn>
              )}
            </>
          )}
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}
