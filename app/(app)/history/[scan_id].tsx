import { Ionicons } from '@expo/vector-icons';
import { router, Stack, useLocalSearchParams } from 'expo-router';
import { useMemo, useState } from 'react';
import { ActivityIndicator, Pressable, ScrollView, Text, View } from 'react-native';
import { IngredientCard } from '@/components/result/IngredientCard';
import { IngredientDetailSheet } from '@/components/result/IngredientDetailSheet';
import { LlmSummary } from '@/components/result/LlmSummary';
import { NutritionText } from '@/components/result/NutritionText';
import { RiskSummary } from '@/components/result/RiskSummary';
import { BottomSheet } from '@/components/ui/BottomSheet';
import { Button } from '@/components/ui/Button';
import { ErrorMessage } from '@/components/ui/ErrorMessage';
import { SectionHeader } from '@/components/ui/SectionHeader';
import { RISK_ORDER } from '@/constants/risk';
import { ROUTES } from '@/constants/routes';
import { useScanDetail } from '@/hooks/useScans';
import type { IngredienteIdentificado } from '@/types/api';
import type { RiskLevel } from '@/types/domain';

type DetailParams = {
  scan_id: string;
};

function formatFullDate(iso: string): string {
  const d = new Date(iso);
  return d.toLocaleString('pt-BR', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });
}

export default function HistoryDetailScreen() {
  const params = useLocalSearchParams<DetailParams>();
  const scanId = params.scan_id ?? '';
  const { data: scan, isLoading, isError, refetch } = useScanDetail(scanId);
  const [sheetIngredient, setSheetIngredient] = useState<IngredienteIdentificado | null>(null);
  const [showUnidentified, setShowUnidentified] = useState(false);

  const data = useMemo(() => {
    const result = scan?.result_json ?? null;
    const analysis = result?.ingredient_analysis ?? null;

    return {
      riskLevel: ((scan?.risco_global ?? analysis?.risco_global) as RiskLevel) ?? 'NENHUM',
      passed: scan?.passed ?? null,
      llmSummary: result?.llm_summary ?? null,
      ingredients: analysis?.ingredientes_identificados ?? [],
      highRiskIngredients: analysis?.high_risk_ingredients ?? [],
      safeSweeteners: analysis?.safe_sweeteners ?? [],
      unidentified: analysis?.nao_identificados ?? [],
      finalText: result?.final_postprocessed_text || null,
    };
  }, [scan]);

  const sortedIngredients = useMemo(
    () =>
      [...data.ingredients].sort(
        (a, b) => RISK_ORDER.indexOf(a.risco as RiskLevel) - RISK_ORDER.indexOf(b.risco as RiskLevel),
      ),
    [data.ingredients],
  );

  const handleClose = () => {
    if (router.canGoBack()) {
      router.back();
    } else {
      router.replace(ROUTES.HISTORY);
    }
  };

  return (
    <View className="flex-1 bg-neutral-50 dark:bg-dark-bg">
      <Stack.Screen
        options={{
          headerTitle: () => (
            <View accessible accessibilityRole="header">
              <Text className="text-base font-semibold text-neutral-900 dark:text-dark-text" allowFontScaling>
                Detalhes
              </Text>
              {scan && (
                <Text className="text-xs text-neutral-400" allowFontScaling>
                  {formatFullDate(scan.created_at)}
                </Text>
              )}
            </View>
          ),
          headerLeft: () => (
            <Pressable
              onPress={handleClose}
              accessibilityRole="button"
              accessibilityLabel="Voltar para o histórico"
              hitSlop={8}
              className="p-2 -ml-2 min-h-[44px] min-w-[44px] items-center justify-center"
            >
              <Ionicons name="close" size={24} color="#111827" />
            </Pressable>
          ),
        }}
      />

      {isLoading && (
        <View className="flex-1 items-center justify-center gap-3" accessibilityLiveRegion="polite">
          <ActivityIndicator size="large" color="#10B981" />
          <Text className="text-sm text-neutral-500" allowFontScaling>
            Carregando análise…
          </Text>
        </View>
      )}

      {!isLoading && isError && (
        <View className="flex-1 px-4 pt-4">
          <ErrorMessage message="Não foi possível carregar esta análise." onRetry={refetch} />
        </View>
      )}

      {!isLoading && !isError && scan && (
        <>
          <ScrollView contentContainerStyle={{ paddingBottom: 100 }}>
            <RiskSummary
              productName={null}
              barcode={null}
              riskLevel={data.riskLevel}
              passed={data.passed}
            />

            {data.llmSummary && <LlmSummary summary={data.llmSummary} />}

            {data.highRiskIngredients.length > 0 && (
              <View>
                <SectionHeader>⚠ Ingredientes de alto risco</SectionHeader>
                <View className="px-4 flex-row flex-wrap gap-2">
                  {data.highRiskIngredients.map((name) => (
                    <View key={name} className="bg-red-50 border border-red-200 rounded-full px-3.5 py-1.5">
                      <Text className="text-sm font-semibold text-risk-alto" allowFontScaling>
                        {name}
                      </Text>
                    </View>
                  ))}
                </View>
              </View>
            )}

            <SectionHeader>Ingredientes identificados ({sortedIngredients.length})</SectionHeader>
            <View className="px-4">
              {sortedIngredients.length === 0 ? (
                <Text className="text-sm text-neutral-500" allowFontScaling>
                  Nenhum ingrediente identificado nesta análise.
                </Text>
              ) : (
                sortedIngredients.map((ingredient, index) => (
                  <IngredientCard
                    key={`${ingredient.nome_lido}-${index}`}
                    ingredient={ingredient}
                    onPress={() => setSheetIngredient(ingredient)}
                  />
                ))
              )}
            </View>

            {data.safeSweeteners.length > 0 && (
              <View>
                <SectionHeader>Adoçantes seguros encontrados</SectionHeader>
                <View className="px-4 flex-row flex-wrap gap-2">
                  {data.safeSweeteners.map((name) => (
                    <View key={name} className="bg-primary-50 rounded-full px-3.5 py-1.5">
                      <Text className="text-sm font-semibold text-primary-700" allowFontScaling>
                        {name}
                      </Text>
                    </View>
                  ))}
                </View>
              </View>
            )}

            {data.unidentified.length > 0 && (
              <View className="mx-4 mt-2">
                <Pressable
                  onPress={() => setShowUnidentified((s) => !s)}
                  accessibilityRole="button"
                  accessibilityState={{ expanded: showUnidentified }}
                  accessibilityLabel={
                    showUnidentified
                      ? 'Ocultar ingredientes não identificados'
                      : `Ver ingredientes não identificados, ${data.unidentified.length}`
                  }
                  className="flex-row items-center gap-2 min-h-[44px] py-2"
                >
                  <Ionicons name={showUnidentified ? 'chevron-up' : 'chevron-down'} size={18} color="#4B5563" />
                  <Text className="text-base font-semibold text-neutral-700 dark:text-dark-text" allowFontScaling>
                    Ingredientes não identificados ({data.unidentified.length})
                  </Text>
                </Pressable>
                {showUnidentified && (
                  <View className="bg-white dark:bg-dark-card rounded-lg p-3.5 shadow-sm">
                    <Text className="text-sm text-neutral-500 leading-6" allowFontScaling>
                      {data.unidentified.join(' · ')}
                    </Text>
                  </View>
                )}
              </View>
            )}

            {data.finalText && <NutritionText text={data.finalText} />}
          </ScrollView>

          <View className="absolute bottom-0 left-0 right-0 bg-white dark:bg-dark-card border-t border-neutral-100 dark:border-dark-surface px-4 pt-3 pb-6 shadow-lg">
            <Button
              full
              variant="ghost"
              onPress={() => router.replace(ROUTES.HISTORY)}
              accessibilityLabel="Ver histórico"
            >
              Ver histórico
            </Button>
          </View>

          <BottomSheet visible={!!sheetIngredient} onClose={() => setSheetIngredient(null)} scrollable>
            {sheetIngredient && (
              <IngredientDetailSheet ingredient={sheetIngredient} onClose={() => setSheetIngredient(null)} />
            )}
          </BottomSheet>
        </>
      )}
    </View>
  );
}
