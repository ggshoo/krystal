import { useRouter } from "expo-router";
import { useEffect, useState } from "react";
import { Pressable, Switch, Text, View } from "react-native";

import { FadeIn } from "@/components/FadeIn";
import { Scene } from "@/components/Scene";
import { remindersSupported } from "@/lib/notifications";
import { currentScene } from "@/lib/scene";
import { useReminderStore } from "@/store/useReminderStore";

/** Preset reminder times (kept simple — no native time-picker dependency). */
const TIMES: { label: string; hour: number; minute: number }[] = [
  { label: "Morning", hour: 8, minute: 0 },
  { label: "Midday", hour: 12, minute: 0 },
  { label: "Afternoon", hour: 15, minute: 0 },
  { label: "Evening", hour: 18, minute: 0 },
  { label: "Night", hour: 20, minute: 0 },
  { label: "Late", hour: 21, minute: 0 },
];

function fmt(hour: number, minute: number): string {
  const h12 = hour % 12 === 0 ? 12 : hour % 12;
  const ampm = hour < 12 ? "AM" : "PM";
  return `${h12}:${minute.toString().padStart(2, "0")} ${ampm}`;
}

/**
 * Reminder settings — opt into a daily local notification and pick a time.
 * Native only; on web we explain that reminders live in the phone app.
 */
export default function Reminders() {
  const router = useRouter();
  const scene = currentScene();

  const enabled = useReminderStore((s) => s.enabled);
  const hour = useReminderStore((s) => s.hour);
  const minute = useReminderStore((s) => s.minute);
  const hydrate = useReminderStore((s) => s.hydrate);
  const setEnabled = useReminderStore((s) => s.setEnabled);
  const setTime = useReminderStore((s) => s.setTime);

  const [notice, setNotice] = useState<string | null>(null);

  useEffect(() => {
    void hydrate();
  }, [hydrate]);

  const onToggle = async (val: boolean) => {
    setNotice(null);
    const ok = await setEnabled(val);
    if (val && !ok) {
      setNotice(
        "Notifications are turned off for crystal. Enable them in your phone's Settings to get reminders."
      );
    }
  };

  return (
    <Scene edges={["top", "bottom"]}>
      <View className="flex-1 px-6 pt-6">
        <Pressable
          onPress={() => router.push("/")}
          className="mb-8 self-start px-2 py-2 transition-all duration-300 hover:opacity-70"
        >
          <Text
            className="font-body text-sm font-bold"
            style={{ color: scene.subInk }}
          >
            ← Home
          </Text>
        </Pressable>

        <FadeIn delay={0}>
          <Text
            className="mb-2 font-display text-4xl font-extrabold tracking-tight"
            style={{ color: scene.ink }}
          >
            Daily reminder
          </Text>
        </FadeIn>
        <FadeIn delay={80}>
          <Text
            className="mb-8 font-body text-base font-semibold leading-relaxed"
            style={{ color: scene.subInk }}
          >
            A gentle once-a-day nudge to check in with yourself.
          </Text>
        </FadeIn>

        {!remindersSupported ? (
          <FadeIn delay={160}>
            <View
              className="rounded-tile p-5"
              style={{ backgroundColor: "#FFFDF6", borderWidth: 2, borderColor: "#E4D6BC" }}
            >
              <Text className="font-body text-base font-semibold leading-relaxed text-ink">
                Reminders live in the crystal app on your phone. Open crystal on
                iOS or Android to turn on a daily nudge — a website can't send
                notifications when it's closed.
              </Text>
            </View>
          </FadeIn>
        ) : (
          <>
            {/* On/off */}
            <FadeIn delay={160}>
              <View
                className="mb-6 flex-row items-center justify-between rounded-tile p-5"
                style={{
                  backgroundColor: "#FFFDF6",
                  borderWidth: 2,
                  borderColor: "#E4D6BC",
                }}
              >
                <View className="flex-1 pr-4">
                  <Text className="font-display text-lg font-bold text-ink">
                    Remind me daily
                  </Text>
                  <Text className="mt-1 font-body text-sm font-semibold text-muted">
                    {enabled
                      ? `You'll get a nudge at ${fmt(hour, minute)}.`
                      : "Off — no reminders right now."}
                  </Text>
                </View>
                <Switch
                  value={enabled}
                  onValueChange={onToggle}
                  trackColor={{ false: "#D8CBB3", true: "#E97451" }}
                  thumbColor="#FFFDF6"
                />
              </View>
            </FadeIn>

            {/* Time presets */}
            <FadeIn delay={240}>
              <Text
                className="mb-3 font-display text-xs font-bold uppercase tracking-widest"
                style={{ color: scene.subInk }}
              >
                What time?
              </Text>
            </FadeIn>
            <FadeIn delay={300}>
              <View className="flex-row flex-wrap gap-2">
                {TIMES.map((t) => {
                  const selected = t.hour === hour && t.minute === minute;
                  return (
                    <Pressable
                      key={t.label}
                      accessibilityRole="button"
                      accessibilityState={{ selected }}
                      onPress={() => setTime(t.hour, t.minute)}
                      className="rounded-chip px-4 py-3 transition-all duration-300 active:scale-95"
                      style={{
                        backgroundColor: selected ? "#E97451" : "#FFFDF6",
                        borderWidth: 2,
                        borderColor: selected ? "#B9502E" : "#E4D6BC",
                        borderBottomWidth: selected ? 3 : 5,
                      }}
                    >
                      <Text
                        className="font-display text-sm font-extrabold"
                        style={{ color: selected ? "#FFFFFF" : "#6B5B44" }}
                      >
                        {t.label} · {fmt(t.hour, t.minute)}
                      </Text>
                    </Pressable>
                  );
                })}
              </View>
            </FadeIn>

            {notice && (
              <FadeIn delay={0}>
                <Text
                  className="mt-6 font-body text-sm font-semibold leading-relaxed"
                  style={{ color: scene.subInk }}
                >
                  {notice}
                </Text>
              </FadeIn>
            )}
          </>
        )}
      </View>
    </Scene>
  );
}
