import { useRouter } from "expo-router";
import { useEffect } from "react";
import { Pressable, ScrollView, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

import { FadeIn } from "@/components/FadeIn";
import { GrapeCompanion } from "@/components/GrapeCompanion";
import { ITEMS, Item, nextUnlock } from "@/lib/inventory";
import { useAuthStore } from "@/store/useAuthStore";
import { useInventoryStore } from "@/store/useInventoryStore";

/**
 * Backpack — the user's collection of earned items.
 *
 * Lists every item in the catalog: unlocked ones are tappable to equip /
 * unequip on the grape; locked ones show their unlock requirement.
 * The grape sits at the top, mirroring whatever is equipped so the user
 * sees the result of their toggles live.
 */
export default function Backpack() {
  const router = useRouter();
  const user = useAuthStore((s) => s.user);

  const byId = useInventoryStore((s) => s.byId);
  const hydrate = useInventoryStore((s) => s.hydrate);
  const toggleEquipped = useInventoryStore((s) => s.toggleEquipped);
  const equippedSlugs = useInventoryStore((s) => s.equippedSlugs());

  useEffect(() => {
    if (user) void hydrate(user.id);
  }, [user, hydrate]);

  // Crude "current streak" placeholder for the locked-item label. Home already
  // computes the real journal streak; for backpack we just need to know which
  // items are owned (byId), so locked = ITEMS minus owned regardless of
  // current streak. We surface the threshold so the user knows the goal.
  const upcoming = nextUnlock(
    Math.max(...Object.values(byId).map(() => 0), 0)
  );

  return (
    <SafeAreaView
      className="flex-1 bg-cream dark:bg-cream-dark"
      edges={["top", "bottom"]}
    >
      <ScrollView
        className="flex-1"
        contentContainerStyle={{
          paddingHorizontal: 24,
          paddingTop: 24,
          paddingBottom: 56,
        }}
      >
        <FadeIn delay={0}>
          <View className="mb-6 flex-row items-center justify-between">
            <Pressable
              onPress={() => router.push("/")}
              className="px-2 py-2 transition-all duration-300 hover:opacity-70"
            >
              <Text className="text-sm text-muted dark:text-muted-dark">
                ← Home
              </Text>
            </Pressable>
          </View>
        </FadeIn>

        <FadeIn delay={80}>
          <Text className="mb-2 text-3xl font-semibold tracking-tight text-ink dark:text-ink-dark">
            Backpack
          </Text>
        </FadeIn>
        <FadeIn delay={160}>
          <Text className="mb-8 text-base leading-relaxed text-muted dark:text-muted-dark">
            What you've earned by showing up.
          </Text>
        </FadeIn>

        {/* Live preview — grape mirrors what's equipped */}
        <FadeIn delay={240}>
          <View className="mb-10 items-center">
            <GrapeCompanion size={120} equipped={equippedSlugs} />
          </View>
        </FadeIn>

        {/* Items list */}
        {ITEMS.map((item, i) => {
          const owned = !!byId[item.slug];
          const equipped = byId[item.slug]?.equipped ?? false;
          return (
            <FadeIn key={item.slug} delay={320 + i * 80}>
              <ItemCard
                item={item}
                owned={owned}
                equipped={equipped}
                onPress={() => {
                  if (owned && user) toggleEquipped(user.id, item.slug);
                }}
              />
            </FadeIn>
          );
        })}

        {upcoming && (
          <FadeIn delay={500}>
            <Text className="mt-4 text-center text-xs text-muted dark:text-muted-dark">
              Next: {upcoming.name.toLowerCase()} at day {upcoming.unlockStreak}
            </Text>
          </FadeIn>
        )}
      </ScrollView>
    </SafeAreaView>
  );
}

function ItemCard({
  item,
  owned,
  equipped,
  onPress,
}: {
  item: Item;
  owned: boolean;
  equipped: boolean;
  onPress: () => void;
}) {
  return (
    <Pressable
      disabled={!owned}
      onPress={onPress}
      className={`mb-3 rounded-tile p-5 transition-all duration-300 ${
        owned
          ? "bg-surface dark:bg-surface-dark hover:scale-[1.01] hover:shadow-2xl"
          : "bg-surface/40 dark:bg-surface-dark/40"
      }`}
      style={{
        shadowColor: "#2D2520",
        shadowOpacity: owned ? 0.04 : 0,
        shadowRadius: 12,
        shadowOffset: { width: 0, height: 2 },
      }}
    >
      <View className="flex-row items-center justify-between">
        <View className="flex-1">
          <View className="mb-1 flex-row items-center">
            <Text
              className={`text-lg font-semibold capitalize ${
                owned
                  ? "text-ink dark:text-ink-dark"
                  : "text-muted dark:text-muted-dark"
              }`}
            >
              {item.name}
            </Text>
            {equipped && (
              <View className="ml-3 rounded-chip bg-accent/15 px-2 py-0.5">
                <Text className="text-[10px] font-semibold uppercase tracking-widest text-accent dark:text-accent-dark">
                  Equipped
                </Text>
              </View>
            )}
          </View>
          <Text className="text-sm leading-relaxed text-muted dark:text-muted-dark">
            {owned ? item.description : `Unlock at day ${item.unlockStreak}.`}
          </Text>
        </View>
        {owned && (
          <Text className="ml-4 text-sm text-muted dark:text-muted-dark underline">
            {equipped ? "Unequip" : "Equip"}
          </Text>
        )}
      </View>
    </Pressable>
  );
}
