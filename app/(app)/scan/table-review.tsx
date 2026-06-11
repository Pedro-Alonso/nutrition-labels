import { Redirect, router } from 'expo-router';
import { ScrollView, View } from 'react-native';
import { EditableNutritionTable } from '@/components/scan/EditableNutritionTable';
import { Button } from '@/components/ui/Button';
import { ROUTES } from '@/constants/routes';
import { useScanFlow } from '@/stores/scanFlowStore';

export default function TableReviewScreen() {
  const { flow, setNutritionalTable, setTableDirty } = useScanFlow();

  // Acesso direto à rota sem fluxo ativo: volta ao início do scan.
  if (!flow) return <Redirect href={ROUTES.SCAN_BARCODE} />;

  return (
    <View className="flex-1 bg-neutral-50 dark:bg-dark-bg">
      <ScrollView
        contentContainerStyle={{ padding: 16, paddingBottom: 120 }}
        keyboardShouldPersistTaps="handled"
      >
        <EditableNutritionTable
          value={flow.nutritionalTable}
          source={flow.source}
          onChange={setNutritionalTable}
          onDirtyChange={setTableDirty}
        />
      </ScrollView>

      <View className="absolute bottom-0 left-0 right-0 bg-white dark:bg-dark-card border-t border-neutral-100 dark:border-dark-surface px-4 pt-3 pb-6 shadow-lg">
        <Button
          full
          onPress={() => router.push(ROUTES.SCAN_INGREDIENTS_REVIEW)}
          accessibilityLabel="Confirmar tabela e revisar ingredientes"
        >
          Confirmar
        </Button>
      </View>
    </View>
  );
}
