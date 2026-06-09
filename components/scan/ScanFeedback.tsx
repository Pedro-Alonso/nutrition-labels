import * as Haptics from 'expo-haptics';
import { useEffect } from 'react';
import { View } from 'react-native';

type ScanFeedbackStatus = 'success' | 'error' | null;

interface ScanFeedbackProps {
  status: ScanFeedbackStatus;
}

/** Dispara háptica e mostra um flash visual de confirmação ao ler um código de barras. */
export function ScanFeedback({ status }: ScanFeedbackProps) {
  useEffect(() => {
    if (status === 'success') {
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
    } else if (status === 'error') {
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error);
    }
  }, [status]);

  if (status !== 'success') return null;

  return <View className="absolute inset-0 bg-primary-500/25" pointerEvents="none" />;
}
