import AsyncStorage from "@react-native-async-storage/async-storage";
import { create } from "zustand";

import {
  cancelDailyReminder,
  scheduleDailyReminder,
} from "@/lib/notifications";

/**
 * Crystal — reminder preference store.
 *
 * The user's daily-reminder choice (on/off + time) persisted locally in
 * AsyncStorage. Because these are on-device local notifications, local
 * persistence is all we need — there's no server to sync to. Toggling here
 * schedules/cancels the actual OS notification via lib/notifications.ts.
 */

const KEY = "crystal.reminder.v1";

type ReminderState = {
  enabled: boolean;
  hour: number;
  minute: number;
  hydrated: boolean;
  hydrate: () => Promise<void>;
  /** Turn the reminder on/off. Returns false if it couldn't be enabled
   *  (permission denied, or web). */
  setEnabled: (enabled: boolean) => Promise<boolean>;
  /** Change the reminder time (reschedules if currently enabled). */
  setTime: (hour: number, minute: number) => Promise<void>;
};

async function persist(s: {
  enabled: boolean;
  hour: number;
  minute: number;
}): Promise<void> {
  try {
    await AsyncStorage.setItem(KEY, JSON.stringify(s));
  } catch {
    // Non-fatal — the reminder is still scheduled with the OS.
  }
}

export const useReminderStore = create<ReminderState>((set, get) => ({
  enabled: false,
  hour: 20, // 8:00 PM default — evening wind-down
  minute: 0,
  hydrated: false,

  hydrate: async () => {
    try {
      const raw = await AsyncStorage.getItem(KEY);
      if (raw) {
        const p = JSON.parse(raw);
        set({
          enabled: !!p.enabled,
          hour: typeof p.hour === "number" ? p.hour : 20,
          minute: typeof p.minute === "number" ? p.minute : 0,
          hydrated: true,
        });
      } else {
        set({ hydrated: true });
      }
    } catch {
      set({ hydrated: true });
    }
  },

  setEnabled: async (enabled) => {
    const { hour, minute } = get();
    if (enabled) {
      const ok = await scheduleDailyReminder(hour, minute);
      if (!ok) {
        set({ enabled: false });
        await persist({ enabled: false, hour, minute });
        return false;
      }
    } else {
      await cancelDailyReminder();
    }
    set({ enabled });
    await persist({ enabled, hour, minute });
    return true;
  },

  setTime: async (hour, minute) => {
    set({ hour, minute });
    const { enabled } = get();
    if (enabled) await scheduleDailyReminder(hour, minute);
    await persist({ enabled, hour, minute });
  },
}));
