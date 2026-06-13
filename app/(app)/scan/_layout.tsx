import { Stack } from 'expo-router';
import { ScanFlowProvider } from '@/stores/scanFlowStore';

const contentHeader = {
  headerTransparent: false,
  headerStyle: { backgroundColor: '#FFFFFF' },
  headerTintColor: '#111827',
  headerTitleStyle: { color: '#111827', fontWeight: '600' as const },
  headerShadowVisible: true,
};

export default function ScanLayout() {
  return (
    <ScanFlowProvider>
      <Stack
        screenOptions={{
          headerShown: true,
          headerTransparent: true,
          headerTintColor: '#FFFFFF',
          headerTitleStyle: { color: '#FFFFFF' },
          headerShadowVisible: false,
        }}
      >
        <Stack.Screen name="barcode" options={{ headerTitle: '' }} />
        <Stack.Screen name="metadata" options={{ title: 'Dados do produto', ...contentHeader }} />
        <Stack.Screen name="table-photo" options={{ headerTitle: '' }} />
        <Stack.Screen name="ingredients-photo" options={{ headerTitle: '' }} />
        <Stack.Screen name="table-review" options={{ title: 'Revisar tabela', ...contentHeader }} />
        <Stack.Screen
          name="ingredients-review"
          options={{ title: 'Revisar ingredientes', ...contentHeader }}
        />
        <Stack.Screen name="reocr" options={{ headerTitle: '' }} />
        <Stack.Screen
          name="result"
          options={{ title: 'Resultado', ...contentHeader, gestureEnabled: false }}
        />
      </Stack>
    </ScanFlowProvider>
  );
}
