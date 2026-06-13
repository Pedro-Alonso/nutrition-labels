import { Redirect, router } from 'expo-router';
import { useState } from 'react';
import { KeyboardAvoidingView, Platform, ScrollView, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { EditableIngredientList } from '@/components/scan/EditableIngredientList';
import { ReviewScrollProvider } from '@/components/scan/ReviewScrollContext';
import { Button } from '@/components/ui/Button';
import { ErrorMessage } from '@/components/ui/ErrorMessage';
import { LoadingOverlay } from '@/components/ui/LoadingOverlay';
import { ROUTES } from '@/constants/routes';
import { useReviewAutoScroll } from '@/hooks/useReviewAutoScroll';
import { useScanProduct } from '@/hooks/useScanProduct';
import { useUpsertProduct } from '@/hooks/useUpsertProduct';
import type { Product } from '@/types/api';
import { useScanFlow } from '@/stores/scanFlowStore';

export default function IngredientsReviewScreen() {
  const { flow, dirty, setIngredients, setIngredientsDirty, reset } = useScanFlow();
  const upsert = useUpsertProduct();
  const scan = useScanProduct();
  const insets = useSafeAreaInsets();
  const { scrollRef, scrollToInput } = useReviewAutoScroll();
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
    const onError = () => setError('Não foi possível analisar o produto. Tente novamente.');

    // Caminho do banco: registra a leitura (histórico + resumo) antes de
    // ir ao resultado, opcionalmente após salvar edições.
    if (flow.mode === 'update') {
      const registerScan = () => {
        scan.mutate(flow.barcode, {
          onSuccess: (product) => goToResult(product),
          onError,
        });
      };

      if (!dirty) {
        registerScan();
        return;
      }

      upsert.mutate(
        {
          barcode: flow.barcode,
          mode: 'update',
          data: {
            name: flow.productName,
            brand: flow.brand,
            nutritional_table: flow.nutritionalTable,
            ingredients: flow.ingredients,
          },
        },
        { onSuccess: registerScan, onError },
      );
      return;
    }

    // Caminho OCR (produto novo): POST já gera resumo e registra histórico.
    upsert.mutate(
      {
        barcode: flow.barcode,
        mode: 'create',
        data: {
          name: flow.productName,
          brand: flow.brand,
          nutritional_table: flow.nutritionalTable,
          ingredients: flow.ingredients,
        },
      },
      {
        onSuccess: (product) => goToResult(product),
        onError,
      },
    );
  };

  const isPending = upsert.isPending || scan.isPending;

  return (
    <KeyboardAvoidingView
      className="flex-1 bg-neutral-50 dark:bg-dark-bg"
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      keyboardVerticalOffset={insets.top + 56}
    >
      <ReviewScrollProvider value={scrollToInput}>
        <ScrollView
          ref={scrollRef}
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
      </ReviewScrollProvider>

      <View className="absolute bottom-0 left-0 right-0 bg-white dark:bg-dark-card border-t border-neutral-100 dark:border-dark-surface px-4 pt-3 pb-6 shadow-lg">
        <Button
          full
          onPress={handleConfirm}
          loading={isPending}
          accessibilityLabel="Confirmar ingredientes e analisar o produto"
        >
          Confirmar e analisar
        </Button>
      </View>

      {isPending && <LoadingOverlay label="Analisando…" />}
    </KeyboardAvoidingView>
  );
}
