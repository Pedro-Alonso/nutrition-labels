import { Ionicons } from '@expo/vector-icons';
import { Pressable, Text, View } from 'react-native';
import { RiskBadge } from '@/components/ui/RiskBadge';
import { RISK_LABELS } from '@/constants/risk';
import { getRiskHex } from '@/utils/riskColors';
import type { IngredienteIdentificado } from '@/types/api';
import type { RiskLevel } from '@/types/domain';

interface IngredientCardProps {
  ingredient: IngredienteIdentificado;
  onPress: () => void;
}

export function IngredientCard({ ingredient, onPress }: IngredientCardProps) {
  const risk = (ingredient.risco as RiskLevel) ?? 'NENHUM';
  const ig = typeof ingredient.indice_glicemico === 'number' ? ingredient.indice_glicemico : null;

  return (
    <Pressable
      onPress={onPress}
      accessibilityRole="button"
      accessibilityLabel={`${ingredient.nome_lido}, risco ${RISK_LABELS[risk]}${ig != null ? `, índice glicêmico ${ig}` : ''}. Toque para ver detalhes.`}
      className="bg-white dark:bg-dark-card rounded-lg p-4 mb-2 shadow-sm flex-row items-center gap-3 min-h-[44px] active:opacity-80"
    >
      <RiskBadge level={risk} size="sm" />
      <View className="flex-1">
        <Text numberOfLines={1} className="text-base font-semibold text-neutral-900 dark:text-dark-text" allowFontScaling>
          {ingredient.nome_lido}
        </Text>
        {ig != null && (
          <Text className="text-xs text-neutral-500 mt-0.5" allowFontScaling>
            IG: <Text className="font-bold" style={{ color: getRiskHex(risk) }}>{ig}</Text>
          </Text>
        )}
      </View>
      <Ionicons name="chevron-forward" size={18} color="#9CA3AF" />
    </Pressable>
  );
}
