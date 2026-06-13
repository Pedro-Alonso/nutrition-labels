import { AxiosError } from 'axios';
import { Redirect, router, useLocalSearchParams } from 'expo-router';
import { useState } from 'react';
import { View } from 'react-native';
import { CaptureWithCrop } from '@/components/scan/CaptureWithCrop';
import { LoadingOverlay } from '@/components/ui/LoadingOverlay';
import { Toast } from '@/components/ui/Toast';
import { ROUTES } from '@/constants/routes';
import { useOcrPreview } from '@/hooks/useOcrPreview';
import { useScanFlow } from '@/stores/scanFlowStore';
import { toUpload } from '@/utils/upload';
import type { IngredientsData, NutritionalTableData, OcrPreviewRequest } from '@/types/api';

type ReocrParams = {
  target: 'table' | 'ingredients';
};

const EMPTY_TABLE: NutritionalTableData = { portion_description: null, columns: [], rows: [] };
const EMPTY_INGREDIENTS: IngredientsData = { items: [] };

const COPY = {
  table: {
    title: 'Fotografe a tabela nutricional',
    subtitle: 'Enquadre toda a tabela dentro do guia abaixo',
    guideLabel: 'TABELA NUTRICIONAL',
    previewLabel: 'Tabela nutricional capturada',
    previewQuestion: 'A tabela está legível e bem enquadrada?',
  },
  ingredients: {
    title: 'Fotografe a lista de ingredientes',
    subtitle: 'Certifique-se de que todo o texto esteja visível',
    guideLabel: 'LISTA DE INGREDIENTES',
    previewLabel: 'Lista de ingredientes capturada',
    previewQuestion: 'O texto está legível e completo?',
  },
} as const;

export default function ReocrScreen() {
  const params = useLocalSearchParams<ReocrParams>();
  const { flow, replaceNutritionalTable, replaceIngredients } = useScanFlow();
  const ocr = useOcrPreview();
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [attempt, setAttempt] = useState(0);

  const target: 'table' | 'ingredients' = params.target === 'ingredients' ? 'ingredients' : 'table';

  // Acesso direto à rota sem fluxo ativo: volta ao início do scan.
  if (!flow) return <Redirect href={ROUTES.SCAN_BARCODE} />;

  const handleComplete = (uri: string) => {
    setErrorMessage(null);
    const images: OcrPreviewRequest =
      target === 'table' ? { image_nutrition: toUpload(uri) } : { image_ingredients: toUpload(uri) };

    ocr.mutate(
      { barcode: flow.barcode, images },
      {
        onSuccess: (data) => {
          if (target === 'table') {
            replaceNutritionalTable(data.nutritional_table ?? EMPTY_TABLE);
          } else {
            replaceIngredients(data.ingredients ?? EMPTY_INGREDIENTS);
          }
          router.back();
        },
        onError: (err) => {
          const status = err instanceof AxiosError ? err.response?.status : undefined;
          if (status === 400) {
            setErrorMessage('Não foi possível ler o rótulo. Tente tirar as fotos com mais luz e menos ângulo.');
          } else if (status === 413) {
            setErrorMessage('Foto muito grande. Use uma resolução menor.');
          } else {
            setErrorMessage('Não foi possível analisar o rótulo. Tente novamente.');
          }
          setAttempt((a) => a + 1);
        },
      },
    );
  };

  return (
    <View className="flex-1 bg-black">
      <CaptureWithCrop key={attempt} {...COPY[target]} onComplete={handleComplete} onCancel={() => router.back()} />

      {ocr.isPending && <LoadingOverlay label={'Analisando rótulo…\nIsso pode levar alguns segundos'} />}

      {errorMessage && (
        <Toast
          message={errorMessage}
          type="error"
          visible={!!errorMessage}
          onDismiss={() => setErrorMessage(null)}
        />
      )}
    </View>
  );
}
