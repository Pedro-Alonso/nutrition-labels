import { Stack } from 'expo-router';

export default function HistoryLayout() {
  return (
    <Stack screenOptions={{ headerShown: false }}>
      <Stack.Screen name="index" />
      <Stack.Screen
        name="[scan_id]"
        options={{
          headerShown: true,
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
