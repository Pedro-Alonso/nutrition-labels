import { Ionicons } from '@expo/vector-icons';
import { Text, View } from 'react-native';
import { Button } from './Button';

type IoniconName = React.ComponentProps<typeof Ionicons>['name'];

interface EmptyStateProps {
  icon: IoniconName;
  title: string;
  subtitle?: string;
  actionLabel?: string;
  onAction?: () => void;
}

export function EmptyState({ icon, title, subtitle, actionLabel, onAction }: EmptyStateProps) {
  return (
    <View className="flex-1 items-center justify-center px-8 py-12" accessible>
      <Ionicons name={icon} size={56} color="#9CA3AF" style={{ marginBottom: 16, opacity: 0.7 }} />
      <Text className="text-xl font-semibold text-neutral-700 dark:text-dark-text text-center mb-2" allowFontScaling>
        {title}
      </Text>
      {subtitle && (
        <Text className="text-sm text-neutral-400 text-center leading-relaxed max-w-[220px]" allowFontScaling>
          {subtitle}
        </Text>
      )}
      {actionLabel && onAction && (
        <View className="mt-6">
          <Button onPress={onAction} accessibilityLabel={actionLabel}>
            {actionLabel}
          </Button>
        </View>
      )}
    </View>
  );
}
