import { Ionicons } from '@expo/vector-icons';
import { useEffect } from 'react';
import { Text, View } from 'react-native';

type ToastType = 'success' | 'error' | 'info' | 'warning';

interface ToastProps {
  message: string;
  type?: ToastType;
  visible: boolean;
  onDismiss: () => void;
}

const config: Record<ToastType, { bg: string; icon: React.ComponentProps<typeof Ionicons>['name'] }> = {
  success: { bg: '#10B981', icon: 'checkmark-circle' },
  error: { bg: '#EF4444', icon: 'alert-circle' },
  info: { bg: '#3B82F6', icon: 'information-circle' },
  warning: { bg: '#F59E0B', icon: 'warning' },
};

export function Toast({ message, type = 'success', visible, onDismiss }: ToastProps) {
  useEffect(() => {
    if (!visible) return;
    const t = setTimeout(onDismiss, 3000);
    return () => clearTimeout(t);
  }, [visible, onDismiss]);

  if (!visible) return null;

  const { bg, icon } = config[type];

  return (
    <View
      style={{ backgroundColor: bg }}
      className="absolute bottom-[90px] left-4 right-4 rounded-xl px-4 py-3 flex-row items-center gap-2.5 z-[1000] shadow-lg"
      accessibilityLiveRegion="assertive"
      accessible
      accessibilityLabel={message}
    >
      <View className="w-5 h-5 rounded-full bg-white/25 items-center justify-center flex-shrink-0">
        <Ionicons name={icon} size={14} color="#FFFFFF" />
      </View>
      <Text className="text-sm font-medium text-white flex-1 leading-5" allowFontScaling>
        {message}
      </Text>
    </View>
  );
}
