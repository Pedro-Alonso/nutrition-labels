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
      <Stack.Screen name="ocr" options={{ title: 'Fotografar rótulo' }} />
      <Stack.Screen
        name="result"
        options={{
          title: 'Resultado',
          headerTransparent: false,
          headerStyle: { backgroundColor: '#FFFFFF' },
          headerTintColor: '#111827',
          headerTitleStyle: { color: '#111827', fontWeight: '600' },
          headerShadowVisible: true,
          gestureEnabled: false,
        }}
      />
    </Stack>
  );
}
