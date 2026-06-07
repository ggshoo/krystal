import { ReactNode } from "react";
import Animated, { FadeInDown } from "react-native-reanimated";

type Props = {
  children: ReactNode;
  /** ms before this element begins its entrance */
  delay?: number;
  /** ms the entrance takes */
  duration?: number;
  /** disable the soft spring overshoot */
  noSpring?: boolean;
  /** any pass-through className from NativeWind */
  className?: string;
};

/**
 * Soft entering motion — fade up from a few pixels below, with a gentle
 * spring overshoot on settle. Use staggered `delay` values across siblings
 * to make a screen "breathe in" rather than appear at once.
 */
export function FadeIn({
  children,
  delay = 0,
  duration = 500,
  noSpring = false,
  className,
}: Props) {
  const enter = noSpring
    ? FadeInDown.duration(duration).delay(delay)
    : FadeInDown.duration(duration).delay(delay).springify().damping(14);

  return (
    <Animated.View entering={enter} className={className}>
      {children}
    </Animated.View>
  );
}
