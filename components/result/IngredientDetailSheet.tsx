import { Ionicons } from '@expo/vector-icons';
import { useState } from 'react';
import { Pressable, Text, View } from 'react-native';
import { Button } from '@/components/ui/Button';
import { RiskBadge } from '@/components/ui/RiskBadge';
import { getClasseLabel } from '@/constants/classifications';
import { getRiskHex } from '@/utils/riskColors';
import type { IngredienteIdentificado } from '@/types/api';
import type { RiskLevel } from '@/types/domain';

interface IngredientDetailSheetProps {
  ingredient: IngredienteIdentificado;
  onClose: () => void;
}

function getGlicemicContext(ig: number): string {
  if (ig >= 70) return 'Alto (≥ 70) — eleva a glicemia rapidamente';
  if (ig >= 56) return 'Médio (56–69) — eleva a glicemia moderadamente';
  return 'Baixo (≤ 55) — impacto glicêmico reduzido';
}

export function IngredientDetailSheet({ ingredient, onClose }: IngredientDetailSheetProps) {
  const [showNota, setShowNota] = useState(false);
  const risk = (ingredient.risco as RiskLevel) ?? 'NENHUM';
  const riskHex = getRiskHex(risk);
  const ig = typeof ingredient.indice_glicemico === 'number' ? ingredient.indice_glicemico : null;

  return (
    <View className="px-5 pb-8 gap-4">
      <View className="flex-row items-start gap-3">
        <View className="flex-1">
          <Text className="text-xl font-bold text-neutral-900" allowFontScaling accessibilityRole="header">
            {ingredient.nome_lido}
          </Text>
          <Text className="text-sm text-neutral-600 mt-1" allowFontScaling>
            {getClasseLabel(ingredient.classe)}
          </Text>
        </View>
        <RiskBadge level={risk} size="md" />
      </View>

      <View className="h-px bg-neutral-100" />

      <View className="gap-1.5">
        <Text className="text-xs font-semibold text-neutral-400 uppercase tracking-wide" allowFontScaling>
          Alerta
        </Text>
        <Text className="text-base text-neutral-700 leading-6" allowFontScaling>
          {ingredient.alerta}
        </Text>
      </View>

      {ig != null && (
        <View className="bg-neutral-50 rounded-xl p-4 gap-1.5">
          <Text className="text-xs font-semibold text-neutral-400 uppercase tracking-wide" allowFontScaling>
            Índice Glicêmico
          </Text>
          <View className="flex-row items-baseline gap-1.5">
            <Text className="text-4xl font-extrabold" style={{ color: riskHex }} allowFontScaling>
              {ig}
            </Text>
            <Text className="text-sm text-neutral-600" allowFontScaling>
              / 100
            </Text>
          </View>
          <Text className="text-xs text-neutral-500" allowFontScaling>
            {getGlicemicContext(ig)}
          </Text>
          <View className="h-1.5 bg-neutral-200 rounded-full overflow-hidden mt-1.5">
            <View className="h-full rounded-full" style={{ width: `${ig}%`, backgroundColor: riskHex }} />
          </View>
        </View>
      )}

      {ingredient.nota_clinica && (
        <View className="gap-2">
          <Pressable
            onPress={() => setShowNota((s) => !s)}
            accessibilityRole="button"
            accessibilityState={{ expanded: showNota }}
            accessibilityLabel={showNota ? 'Ocultar nota clínica' : 'Ver nota clínica'}
            className="flex-row items-center gap-1 min-h-[44px] self-start"
          >
            <Ionicons name={showNota ? 'chevron-up' : 'chevron-down'} size={16} color="#059669" />
            <Text className="text-sm font-semibold text-primary-600" allowFontScaling>
              {showNota ? 'Ocultar nota clínica' : 'Ver nota clínica'}
            </Text>
          </Pressable>
          {showNota && (
            <View className="bg-primary-50 rounded-lg p-3 border-l-4 border-primary-500">
              <Text className="text-sm text-primary-700 leading-5" allowFontScaling>
                {ingredient.nota_clinica}
              </Text>
            </View>
          )}
        </View>
      )}

      <Button variant="secondary" onPress={onClose} accessibilityLabel="Fechar detalhes do ingrediente" full>
        Fechar
      </Button>
    </View>
  );
}
