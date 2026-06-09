import { Pressable, View } from 'react-native';

interface CardProps {
  children: React.ReactNode;
  onPress?: () => void;
  className?: string;
  accessibilityLabel?: string;
}

export function Card({ children, onPress, className = '', accessibilityLabel }: CardProps) {
  const base =
    'bg-white dark:bg-dark-card rounded-lg p-4 mb-3 shadow-sm';

  if (onPress) {
    return (
      <Pressable
        onPress={onPress}
        accessibilityRole="button"
        accessibilityLabel={accessibilityLabel}
        className={`${base} active:opacity-80 ${className}`}
      >
        {children}
      </Pressable>
    );
  }

  return (
    <View accessible={!!accessibilityLabel} accessibilityLabel={accessibilityLabel} className={`${base} ${className}`}>
      {children}
    </View>
  );
}
