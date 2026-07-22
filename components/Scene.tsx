import { createContext, useContext, useMemo, ReactNode } from "react";
import { View } from "react-native";
import { Edge, SafeAreaView } from "react-native-safe-area-context";

import { SceneBackground } from "@/components/SceneBackground";
import { currentScene, Scene as SceneData } from "@/lib/scene";

const SceneContext = createContext<SceneData | null>(null);

/**
 * Read the current time-of-day scene (colors, ink, orb) from context.
 * Falls back to computing it fresh if used outside a <Scene> wrapper.
 */
export function useScene(): SceneData {
  const ctx = useContext(SceneContext);
  return ctx ?? currentScene();
}

type Props = {
  children: ReactNode;
  /** SafeAreaView edges — defaults to all. */
  edges?: readonly Edge[];
  /** Extra classes on the inner SafeAreaView content wrapper. */
  className?: string;
};

/**
 * Full-screen storybook backdrop + safe area. Use this in place of the old
 * `<SafeAreaView className="flex-1 bg-cream …">` at the root of every screen.
 * The rolling-hills scene sits behind the children and shifts with the clock.
 */
export function Scene({ children, edges, className }: Props) {
  const scene = useMemo(() => currentScene(), []);
  return (
    <SceneContext.Provider value={scene}>
      <View className="flex-1">
        <SceneBackground scene={scene} />
        <SafeAreaView
          edges={edges ?? ["top", "bottom", "left", "right"]}
          className={`flex-1 ${className ?? ""}`}
        >
          {children}
        </SafeAreaView>
      </View>
    </SceneContext.Provider>
  );
}
