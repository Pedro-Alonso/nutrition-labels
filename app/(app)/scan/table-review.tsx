import { Ionicons } from '@expo/vector-icons';
import { Redirect, router, Stack } from 'expo-router';
import { KeyboardAvoidingView, Platform, Pressable, ScrollView, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { EditableNutritionTable } from '@/components/scan/EditableNutritionTable';
import { ReviewScrollProvider } from '@/components/scan/ReviewScrollContext';
import { Button } from '@/components/ui/Button';
import { ROUTES } from '@/constants/routes';
import { useReviewAutoScroll } from '@/hooks/useReviewAutoScroll';
import { useScanFlow } from '@/stores/scanFlowStore';

export default function TableReviewScreen() {
  const { flow, tableRev, setNutritionalTable, setTableDirty } = useScanFlow();
  const insets = useSafeAreaInsets();
  const { scrollRef, scrollToInput } = useReviewAutoScroll();

  // Acesso direto à rota sem fluxo ativo: volta ao início do scan.
  if (!flow) return <Redirect href={ROUTES.SCAN_BARCODE} />;

  return (
    <KeyboardAvoidingView
      className="flex-1 bg-neutral-50 dark:bg-dark-bg"
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      keyboardVerticalOffset={insets.top + 56}
    >
      <Stack.Screen
        options={{
          headerRight: () => (
            <Pressable
              onPress={() => router.push({ pathname: ROUTES.SCAN_REOCR, params: { target: 'table' } })}
              accessibilityRole="button"
              accessibilityLabel="Refazer leitura da tabela com a câmera"
              hitSlop={8}
              className="p-2 -mr-2 min-h-[44px] min-w-[44px] items-center justify-center"
            >
              <Ionicons name="camera-outline" size={24} color="#111827" />
            </Pressable>
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
            onChange={setNutritionalTable}
            onDirtyChange={setTableDirty}
          />
        </ScrollView>
      </ReviewScrollProvider>

      <View className="absolute bottom-0 left-0 right-0 bg-white dark:bg-dark-card border-t border-neutral-100 dark:border-dark-surface px-4 pt-3 pb-6 shadow-lg">
        <Button
          full
          onPress={() => router.push(ROUTES.SCAN_INGREDIENTS_REVIEW)}
          accessibilityLabel="Confirmar tabela e revisar ingredientes"
        >
          Confirmar
        </Button>
      </View>
    </KeyboardAvoidingView>
  );
}
