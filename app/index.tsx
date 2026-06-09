import { Redirect } from 'expo-router';
import { ActivityIndicator, Text, View } from 'react-native';
import { useAuth } from '@/hooks/useAuth';

export default function Index() {
  const { isAuthenticated, isBootstrapping } = useAuth();

  if (isBootstrapping) {
    return (
      <View
        className="flex-1 items-center justify-center gap-3 bg-neutral-50"
        accessibilityLiveRegion="polite"
        accessible
        accessibilityLabel="Carregando…"
      >
        <ActivityIndicator size="large" color="#10B981" />
        <Text className="text-base text-neutral-600" allowFontScaling>
          Carregando…
        </Text>
      </View>
    );
  }

  if (isAuthenticated) {
    return <Redirect href="/(app)/(home)" />;
  }

  return <Redirect href="/(auth)/welcome" />;
}
