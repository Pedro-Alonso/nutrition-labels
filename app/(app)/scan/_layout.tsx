import { Stack } from 'expo-router';

export default function ScanLayout() {
  return (
    <Stack
      screenOptions={{
        headerShown: true,
        headerTransparent: true,
        headerTintColor: '#FFFFFF',
        headerTitleStyle: { color: '#FFFFFF' },
        headerShadowVisible: false,
      }}
    >
      <Stack.Screen name="barcode" options={{ title: 'Escanear produto' }} />
    </Stack>
  );
}
