import { Ionicons } from '@expo/vector-icons';
import { Text, View } from 'react-native';
import { Card } from './Card';

interface ProfileInfoCardProps {
  icon: React.ComponentProps<typeof Ionicons>['name'];
  label: string;
  value: string;
}

export function ProfileInfoCard({ icon, label, value }: ProfileInfoCardProps) {
  return (
    <Card
      className="flex-row items-center gap-3"
      accessibilityLabel={`${label}: ${value}`}
    >
      <View className="w-10 h-10 rounded-full bg-primary-50 items-center justify-center">
        <Ionicons name={icon} size={20} color="#059669" />
      </View>
      <View className="flex-1">
        <Text className="text-xs font-medium text-neutral-400" allowFontScaling>
          {label}
        </Text>
        <Text
          className="text-base font-semibold text-neutral-800 dark:text-dark-text mt-0.5"
          allowFontScaling
        >
          {value}
        </Text>
      </View>
    </Card>
  );
}
