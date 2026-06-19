import { Ionicons } from '@expo/vector-icons';
import { Redirect, router, Stack } from 'expo-router';
import { useState } from 'react';
import { KeyboardAvoidingView, Platform, Pressable, ScrollView, Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { EditableNutritionTable } from '@/components/scan/EditableNutritionTable';
import { ReviewScrollProvider } from '@/components/scan/ReviewScrollContext';
import { Button } from '@/components/ui/Button';
import { ROUTES } from '@/constants/routes';
import { useReviewAutoScroll } from '@/hooks/useReviewAutoScroll';
import { useScanFlow } from '@/stores/scanFlowStore';
import type { NutritionalTableData } from '@/types/api';

const EMPTY_TABLE: NutritionalTableData = { portion_description: null, columns: [], rows: [] };

function isTableEmpty(table: NutritionalTableData): boolean {
  return (
    table.columns.length === 0 &&
    table.rows.every((r) => r.nutrient.trim() === '' && r.values.every((v) => v.trim() === ''))
  );
}

export default function TableReviewScreen() {
  const { flow, tableRev, setNutritionalTable, setTableDirty, replaceNutritionalTable } =
    useScanFlow();
  const insets = useSafeAreaInsets();
  const { scrollRef, scrollToInput } = useReviewAutoScroll();
  const [showDisclaimer, setShowDisclaimer] = useState(false);

  // Acesso direto à rota sem fluxo ativo: volta ao início do scan.
  if (!flow) return <Redirect href={ROUTES.SCAN_BARCODE} />;

  const tableEmpty = isTableEmpty(flow.nutritionalTable);

  const handleClearTable = () => {
    replaceNutritionalTable(EMPTY_TABLE);
    setTableDirty(true);
    setShowDisclaimer(true);
  };

  const handleConfirm = () => {
    if (tableEmpty && !showDisclaimer) {
      setShowDisclaimer(true);
      return;
    }
    router.push(ROUTES.SCAN_INGREDIENTS_REVIEW);
  };

  return (
    <KeyboardAvoidingView
      className="flex-1 bg-neutral-50 dark:bg-dark-bg"
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      keyboardVerticalOffset={insets.top + 56}
    >
      <Stack.Screen
        options={{
          headerRight: () => (
            <View className="flex-row items-center gap-1">
              <Pressable
                onPress={handleClearTable}
                accessibilityRole="button"
                accessibilityLabel="Limpar tabela nutricional"
                accessibilityHint="Remove todos os dados da tabela"
                hitSlop={8}
                className="p-2 min-h-[44px] min-w-[44px] items-center justify-center"
              >
                <Ionicons name="trash-outline" size={22} color="#DC2626" />
              </Pressable>
              <Pressable
                onPress={() => router.push({ pathname: ROUTES.SCAN_REOCR, params: { target: 'table' } })}
                accessibilityRole="button"
                accessibilityLabel="Refazer leitura da tabela com a câmera"
                hitSlop={8}
                className="p-2 -mr-2 min-h-[44px] min-w-[44px] items-center justify-center"
              >
                <Ionicons name="camera-outline" size={24} color="#111827" />
              </Pressable>
            </View>
          ),
        }}
      />

      <ReviewScrollProvider value={scrollToInput}>
        <ScrollView
          ref={scrollRef}
          contentContainerStyle={{ padding: 16, paddingBottom: 120 }}
          keyboardShouldPersistTaps="handled"
        >
          <EditableNutritionTable
            key={tableRev}
            value={flow.nutritionalTable}
            source={flow.source}
            onChange={(table) => {
              setNutritionalTable(table);
              if (showDisclaimer && !isTableEmpty(table)) setShowDisclaimer(false);
            }}
            onDirtyChange={setTableDirty}
          />

          {showDisclaimer && tableEmpty && (
            <View
              className="mt-4 rounded-xl border border-feedback-warning/30 bg-feedback-warning/10 p-4"
              accessibilityLiveRegion="polite"
              accessible
            >
              <View className="flex-row items-center gap-2 mb-2">
                <Ionicons name="information-circle" size={20} color="#F59E0B" />
                <Text className="text-base font-semibold text-neutral-800 dark:text-white" allowFontScaling>
                  Tabela vazia
                </Text>
              </View>
              <Text className="text-sm text-neutral-600 dark:text-neutral-300 leading-relaxed" allowFontScaling>
                A tabela nutricional não será usada na análise. Os ingredientes são o principal
                para avaliar o risco — você pode prosseguir sem ela.
              </Text>
            </View>
          )}
        </ScrollView>
      </ReviewScrollProvider>

      <View className="absolute bottom-0 left-0 right-0 bg-white dark:bg-dark-card border-t border-neutral-100 dark:border-dark-surface px-4 pt-3 pb-6 shadow-lg">
        <Button
          full
          onPress={handleConfirm}
          accessibilityLabel={
            tableEmpty && !showDisclaimer
              ? 'Confirmar tabela vazia — um aviso será exibido'
              : 'Confirmar tabela e revisar ingredientes'
          }
        >
          Confirmar
        </Button>
      </View>
    </KeyboardAvoidingView>
  );
}
