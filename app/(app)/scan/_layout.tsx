import { Stack } from 'expo-router';
import { ScanFlowProvider } from '@/stores/scanFlowStore';

// Cabeçalho claro para as telas de conteúdo (revisão/resultado), em contraste
// com o cabeçalho transparente sobre a câmera (barcode/fotos do rótulo).
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
        <Stack.Screen name="barcode" options={{ title: 'Escanear produto' }} />
        <Stack.Screen name="table-photo" options={{ title: 'Tabela nutricional' }} />
        <Stack.Screen name="ingredients-photo" options={{ title: 'Lista de ingredientes' }} />
        <Stack.Screen name="table-review" options={{ title: 'Revisar tabela', ...contentHeader }} />
        <Stack.Screen
          name="ingredients-review"
          options={{ title: 'Revisar ingredientes', ...contentHeader }}
        />
        <Stack.Screen
          name="result"
          options={{ title: 'Resultado', ...contentHeader, gestureEnabled: false }}
        />
      </Stack>
    </ScanFlowProvider>
  );
}
