import { View } from 'react-native';
import { EmptyState } from '@/components/ui/EmptyState';

export default function ProfileScreen() {
  return (
    <View className="flex-1 bg-neutral-50">
      <EmptyState
        icon="person-outline"
        title="Perfil em breve"
        subtitle="Esta tela será implementada em uma próxima etapa."
      />
    </View>
  );
}
