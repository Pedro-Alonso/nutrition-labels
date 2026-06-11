import { Redirect, Stack } from 'expo-router';
import { useAuth } from '@/hooks/useAuth';

export default function AppLayout() {
  const { isAuthenticated } = useAuth();

  if (!isAuthenticated) {
    return <Redirect href="/(auth)/login" />;
  }

  // As tabs ficam aninhadas em (tabs); o fluxo de scan é screen irmã, empilhada
  // em tela cheia por cima da tab bar (sem a barra cobrir os controles da câmera).
  return (
    <Stack screenOptions={{ headerShown: false }}>
      <Stack.Screen name="(tabs)" />
      <Stack.Screen name="scan" />
    </Stack>
  );
}
