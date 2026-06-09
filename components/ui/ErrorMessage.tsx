import { Ionicons } from '@expo/vector-icons';
import { Pressable, Text, View } from 'react-native';

interface ErrorMessageProps {
  message: string;
  onRetry?: () => void;
}

export function ErrorMessage({ message, onRetry }: ErrorMessageProps) {
  return (
    <View
      className="bg-red-50 dark:bg-dark-card border border-feedback-error rounded-lg p-4 flex-row items-start gap-3"
      accessibilityLiveRegion="assertive"
      accessible
      accessibilityLabel={`Erro: ${message}`}
    >
      <Ionicons name="alert-circle-outline" size={20} color="#EF4444" />
      <View className="flex-1 gap-2">
        <Text className="text-sm text-neutral-800 dark:text-dark-text leading-5" allowFontScaling>
          {message}
        </Text>
        {onRetry && (
          <Pressable
            onPress={onRetry}
            accessibilityRole="button"
            accessibilityLabel="Tentar novamente"
            className="self-start"
          >
            <Text className="text-sm font-semibold text-feedback-error" allowFontScaling>
              Tentar novamente
            </Text>
          </Pressable>
        )}
      </View>
    </View>
  );
}
