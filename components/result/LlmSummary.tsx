import { Ionicons } from '@expo/vector-icons';
import { Text, View } from 'react-native';
import { Card } from '@/components/ui/Card';

interface LlmSummaryProps {
  summary: string;
}

export function LlmSummary({ summary }: LlmSummaryProps) {
  return (
    <View className="mx-4 mt-4">
      <Card className="border-l-4 border-primary-500" accessibilityLabel={`Resumo personalizado: ${summary}`}>
        <View className="flex-row items-center gap-1.5 mb-2">
          <Ionicons name="sparkles" size={16} color="#10B981" />
          <Text className="text-sm font-semibold text-primary-700" allowFontScaling>
            Resumo personalizado
          </Text>
        </View>
        <Text className="text-base text-neutral-700 dark:text-dark-text leading-6" allowFontScaling>
          {summary}
        </Text>
        <Text className="text-xs text-neutral-400 mt-2" allowFontScaling>
          Análise gerada por IA com base no seu perfil
        </Text>
      </Card>
    </View>
  );
}
