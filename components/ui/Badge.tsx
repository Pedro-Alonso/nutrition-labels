import { Text, View } from 'react-native';

type BadgeVariant = 'default' | 'success' | 'warning' | 'error' | 'info';

interface BadgeProps {
  children: React.ReactNode;
  variant?: BadgeVariant;
}

const variantClasses: Record<BadgeVariant, { container: string; text: string }> = {
  default: { container: 'bg-neutral-100', text: 'text-neutral-700' },
  success: { container: 'bg-green-100', text: 'text-green-700' },
  warning: { container: 'bg-yellow-100', text: 'text-yellow-700' },
  error: { container: 'bg-red-100', text: 'text-red-700' },
  info: { container: 'bg-blue-100', text: 'text-blue-700' },
};

export function Badge({ children, variant = 'default' }: BadgeProps) {
  const { container, text } = variantClasses[variant];
  return (
    <View className={`${container} rounded-sm px-2 py-0.5`}>
      <Text className={`${text} text-xs font-medium`} allowFontScaling>
        {children}
      </Text>
    </View>
  );
}
