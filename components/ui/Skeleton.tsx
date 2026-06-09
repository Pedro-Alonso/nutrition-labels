import { useEffect, useState } from 'react';
import { Animated, Easing } from 'react-native';

interface SkeletonProps {
  width?: number | `${number}%`;
  height?: number;
  radius?: number;
  className?: string;
}

export function Skeleton({ width = '100%', height = 16, radius = 6, className = '' }: SkeletonProps) {
  const [opacity] = useState(() => new Animated.Value(0.4));

  useEffect(() => {
    const loop = Animated.loop(
      Animated.sequence([
        Animated.timing(opacity, {
          toValue: 1,
          duration: 700,
          easing: Easing.inOut(Easing.ease),
          useNativeDriver: true,
        }),
        Animated.timing(opacity, {
          toValue: 0.4,
          duration: 700,
          easing: Easing.inOut(Easing.ease),
          useNativeDriver: true,
        }),
      ])
    );
    loop.start();
    return () => loop.stop();
  }, [opacity]);

  return (
    <Animated.View
      style={{ width, height, borderRadius: radius, opacity }}
      className={`bg-neutral-200 dark:bg-dark-surface ${className}`}
    />
  );
}
