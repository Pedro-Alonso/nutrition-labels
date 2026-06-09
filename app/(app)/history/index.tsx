import { View } from 'react-native';
import { EmptyState } from '@/components/ui/EmptyState';

export default function HistoryScreen() {
  return (
    <View className="flex-1 bg-neutral-50">
      <EmptyState
        icon="time-outline"
        title="Histórico em breve"
        subtitle="Esta tela será implementada em uma próxima etapa."
      />
    </View>
  );
}
