import * as Notifications from "expo-notifications";
import { Platform } from "react-native";

/**
 * Crystal — daily check-in reminders (native local notifications).
 *
 * These are on-device scheduled notifications via expo-notifications. They
 * fire even when the app is closed and need NO backend. They do NOT work on
 * web (a static site can't wake itself) — every entry point is guarded by
 * `remindersSupported`, and the settings screen shows a "native only" note.
 *
 * Persistence of the user's choice lives in store/useReminderStore.ts
 * (AsyncStorage). This module only talks to the OS scheduler.
 */

/** Stable identifier so we can cancel/replace the single daily reminder. */
export const REMINDER_ID = "daily-checkin-reminder";

const ANDROID_CHANNEL = "reminders";

/** Reminders only work on native (iOS/Android), not the web build. */
export const remindersSupported = Platform.OS !== "web";

// Show a banner even if the app happens to be foregrounded when it fires.
// Guarded to native so importing this module on the web build is a no-op.
if (remindersSupported) {
  Notifications.setNotificationHandler({
    handleNotification: async () => ({
      shouldShowBanner: true,
      shouldShowList: true,
      shouldPlaySound: false,
      shouldSetBadge: false,
    }),
  });
}

// A little variety so the nudge doesn't feel robotic.
const MESSAGES = [
  "How are you feeling today? A quick check-in is waiting. 🍇",
  "Two minutes for yourself — how's today landing?",
  "Your grape's wondering how you are today.",
  "A gentle nudge: notice how you feel today.",
  "Time for today's little check-in.",
];

function pickMessage(): string {
  return MESSAGES[Math.floor(Math.random() * MESSAGES.length)];
}

/** Current permission state without prompting. */
export async function hasPermission(): Promise<boolean> {
  if (!remindersSupported) return false;
  const s = await Notifications.getPermissionsAsync();
  return (
    s.granted ||
    s.ios?.status === Notifications.IosAuthorizationStatus.PROVISIONAL
  );
}

/** Ask for permission if we don't already have it. Returns whether granted. */
export async function ensurePermission(): Promise<boolean> {
  if (!remindersSupported) return false;
  if (await hasPermission()) return true;
  const req = await Notifications.requestPermissionsAsync();
  return (
    req.granted ||
    req.ios?.status === Notifications.IosAuthorizationStatus.PROVISIONAL
  );
}

async function ensureAndroidChannel(): Promise<void> {
  if (Platform.OS !== "android") return;
  await Notifications.setNotificationChannelAsync(ANDROID_CHANNEL, {
    name: "Daily check-in",
    importance: Notifications.AndroidImportance.DEFAULT,
  });
}

/**
 * Schedule (or reschedule) the single daily reminder at the given local time.
 * Requests permission if needed. Returns whether it was actually scheduled
 * (false on web or if permission denied).
 */
export async function scheduleDailyReminder(
  hour: number,
  minute: number
): Promise<boolean> {
  if (!remindersSupported) return false;
  if (!(await ensurePermission())) return false;
  await ensureAndroidChannel();
  await cancelDailyReminder();

  await Notifications.scheduleNotificationAsync({
    identifier: REMINDER_ID,
    content: {
      title: "crystal",
      body: pickMessage(),
    },
    trigger: {
      type: Notifications.SchedulableTriggerInputTypes.DAILY,
      hour,
      minute,
      channelId: ANDROID_CHANNEL,
    },
  });
  return true;
}

/** Cancel the daily reminder if one is scheduled. Safe to call anytime. */
export async function cancelDailyReminder(): Promise<void> {
  if (!remindersSupported) return;
  try {
    await Notifications.cancelScheduledNotificationAsync(REMINDER_ID);
  } catch {
    // No-op: nothing was scheduled.
  }
}
