import { Stack } from 'expo-router';

export default function ScanLayout() {
  return (
    <Stack screenOptions={{ headerShown: true }}>
      <Stack.Screen name="barcode" options={{ title: 'Escanear produto' }} />
    </Stack>
  );
}
