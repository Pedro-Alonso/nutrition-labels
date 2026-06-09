import { ActivityIndicator, Text, View } from 'react-native';

interface LoadingOverlayProps {
  label?: string;
}

export function LoadingOverlay({ label }: LoadingOverlayProps) {
  return (
    <View
      className="absolute inset-0 bg-black/45 items-center justify-center z-[900]"
      accessibilityLiveRegion="polite"
      accessible
      accessibilityLabel={label ?? 'Carregando…'}
    >
      <View className="bg-white dark:bg-dark-card rounded-xl px-9 py-7 items-center gap-3.5 shadow-lg">
        <ActivityIndicator size="large" color="#10B981" />
        {label && (
          <Text className="text-sm font-medium text-neutral-700 dark:text-dark-text text-center" allowFontScaling>
            {label}
          </Text>
        )}
      </View>
    </View>
  );
}
