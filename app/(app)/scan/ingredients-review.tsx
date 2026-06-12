import { Redirect, router } from 'expo-router';
import { useState } from 'react';
import { KeyboardAvoidingView, Platform, ScrollView, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { EditableIngredientList } from '@/components/scan/EditableIngredientList';
import { Button } from '@/components/ui/Button';
import { ErrorMessage } from '@/components/ui/ErrorMessage';
import { LoadingOverlay } from '@/components/ui/LoadingOverlay';
import { ROUTES } from '@/constants/routes';
import { useUpsertProduct } from '@/hooks/useUpsertProduct';
import type { IngredientAnalysis, Product } from '@/types/api';
import { useScanFlow, type ScanFlowData } from '@/stores/scanFlowStore';

function buildProduct(flow: ScanFlowData, analysis: IngredientAnalysis | null): Product {
  return {
    barcode: flow.barcode,
    name: flow.productName,
    brand: null,
    nutritional_table: flow.nutritionalTable,
    ingredients: flow.ingredients,
    analysis,
    created_at: '',
    updated_at: '',
  };
}

export default function IngredientsReviewScreen() {
  const { flow, dirty, setIngredients, setIngredientsDirty, reset } = useScanFlow();
  const upsert = useUpsertProduct();
  const insets = useSafeAreaInsets();
  const [error, setError] = useState<string | null>(null);

  // Acesso direto à rota sem fluxo ativo: volta ao início do scan.
  if (!flow) return <Redirect href={ROUTES.SCAN_BARCODE} />;

  const goToResult = (product: Product) => {
    reset();
    router.replace({
      pathname: ROUTES.SCAN_RESULT,
      params: { barcode: product.barcode, product: JSON.stringify(product) },
    });
  };

  const handleConfirm = () => {
    setError(null);

    // Sem edição e com análise já em mãos (caminho do banco): pula a escrita.
    if (!dirty && flow.analysis) {
      goToResult(buildProduct(flow, flow.analysis));
      return;
    }

    upsert.mutate(
      {
        barcode: flow.barcode,
        mode: flow.mode,
        data: {
          name: flow.productName,
          nutritional_table: flow.nutritionalTable,
          ingredients: flow.ingredients,
        },
      },
      {
        onSuccess: (product) => goToResult(product),
        onError: () => setError('Não foi possível analisar o produto. Tente novamente.'),
      },
    );
  };

  return (
    <KeyboardAvoidingView
      className="flex-1 bg-neutral-50 dark:bg-dark-bg"
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      keyboardVerticalOffset={insets.top + 56}
    >
      <ScrollView
        contentContainerStyle={{ padding: 16, paddingBottom: 160 }}
        keyboardShouldPersistTaps="handled"
      >
        <EditableIngredientList
          value={flow.ingredients}
          source={flow.source}
          onChange={setIngredients}
          onDirtyChange={setIngredientsDirty}
        />

        {error && (
          <View className="mt-4">
            <ErrorMessage message={error} onRetry={handleConfirm} />
          </View>
        )}
      </ScrollView>

      <View className="absolute bottom-0 left-0 right-0 bg-white dark:bg-dark-card border-t border-neutral-100 dark:border-dark-surface px-4 pt-3 pb-6 shadow-lg">
        <Button
          full
          onPress={handleConfirm}
          loading={upsert.isPending}
          accessibilityLabel="Confirmar ingredientes e analisar o produto"
        >
          Confirmar e analisar
        </Button>
      </View>

      {upsert.isPending && <LoadingOverlay label="Analisando…" />}
    </KeyboardAvoidingView>
  );
}
