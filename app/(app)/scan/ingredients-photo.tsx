import { Ionicons } from '@expo/vector-icons';
import { AxiosError } from 'axios';
import { CameraView, useCameraPermissions } from 'expo-camera';
import * as ImagePicker from 'expo-image-picker';
import { Redirect, router } from 'expo-router';
import { useRef, useState } from 'react';
import { Linking, Text, View } from 'react-native';
import { OcrOverlay } from '@/components/scan/OcrOverlay';
import { Button } from '@/components/ui/Button';
import { LoadingOverlay } from '@/components/ui/LoadingOverlay';
import { Toast } from '@/components/ui/Toast';
import { ROUTES } from '@/constants/routes';
import { useOcrPreview } from '@/hooks/useOcrPreview';
import { useScanFlow } from '@/stores/scanFlowStore';
import type { ImageUpload, IngredientsData, NutritionalTableData } from '@/types/api';

type Phase = 'camera' | 'capturing' | 'preview' | 'processing';

const EMPTY_TABLE: NutritionalTableData = { portion_description: null, columns: [], rows: [] };
const EMPTY_INGREDIENTS: IngredientsData = { items: [] };

// Monta o objeto de upload (multipart) a partir da URI local da foto.
function toUpload(uri: string): ImageUpload {
  const name = uri.split('/').pop() ?? 'rotulo.jpg';
  const extension = name.split('.').pop()?.toLowerCase();
  const type = extension === 'png' ? 'image/png' : 'image/jpeg';
  return { uri, name, type };
}

export default function IngredientsPhotoScreen() {
  const { capture, setCaptureIngredients, startFlow } = useScanFlow();
  const [permission, requestPermission] = useCameraPermissions();
  const cameraRef = useRef<CameraView>(null);
  const [phase, setPhase] = useState<Phase>('camera');
  const [photoUri, setPhotoUri] = useState<string | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const ocr = useOcrPreview();

  // Acesso direto à rota sem captura ativa: volta ao início do scan.
  if (!capture) return <Redirect href={ROUTES.SCAN_BARCODE} />;

  const openReview = () => router.replace(ROUTES.SCAN_TABLE_REVIEW);

  const finalize = (ingredientsUri: string | null) => {
    setCaptureIngredients(ingredientsUri);
    const tableUri = capture.tableUri;

    // Ambas as etapas manuais: pula o OCR e abre a revisão vazia (source manual).
    if (!tableUri && !ingredientsUri) {
      startFlow({
        barcode: capture.barcode,
        source: 'manual',
        mode: 'create',
        productName: null,
        nutritionalTable: EMPTY_TABLE,
        ingredients: EMPTY_INGREDIENTS,
        analysis: null,
      });
      openReview();
      return;
    }

    // Ao menos uma foto: envia ao OCR e abre a revisão pré-preenchida (source ocr).
    setPhase('processing');
    setErrorMessage(null);
    ocr.mutate(
      {
        barcode: capture.barcode,
        images: {
          image_nutrition: tableUri ? toUpload(tableUri) : null,
          image_ingredients: ingredientsUri ? toUpload(ingredientsUri) : null,
        },
      },
      {
        onSuccess: (data) => {
          startFlow({
            barcode: capture.barcode,
            source: 'ocr',
            mode: 'create',
            productName: null,
            nutritionalTable: data.nutritional_table ?? EMPTY_TABLE,
            ingredients: data.ingredients ?? EMPTY_INGREDIENTS,
            analysis: null,
          });
          openReview();
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
          setPhase('camera');
          setPhotoUri(null);
        },
      },
    );
  };

  const handleCapture = async () => {
    if (phase !== 'camera' || !cameraRef.current) return;
    setPhase('capturing');
    try {
      const photo = await cameraRef.current.takePictureAsync({ quality: 0.8 });
      if (!photo?.uri) throw new Error('Falha ao capturar foto');
      setPhotoUri(photo.uri);
      setPhase('preview');
    } catch {
      setErrorMessage('Não foi possível capturar a foto. Tente novamente.');
      setPhase('camera');
    }
  };

  const handleGallery = async () => {
    if (phase !== 'camera') return;
    const mediaPermission = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (!mediaPermission.granted) {
      setErrorMessage('Permita o acesso às fotos para escolher uma imagem da galeria.');
      return;
    }
    const result = await ImagePicker.launchImageLibraryAsync({ mediaTypes: ['images'], quality: 0.8 });
    if (result.canceled || !result.assets?.[0]?.uri) return;
    setPhotoUri(result.assets[0].uri);
    setPhase('preview');
  };

  if (!permission) {
    return <View className="flex-1 bg-black" />;
  }

  if (!permission.granted) {
    return (
      <View className="flex-1 items-center justify-center bg-neutral-900 px-8" accessible>
        <Ionicons name="camera-outline" size={56} color="#9CA3AF" style={{ marginBottom: 16 }} />
        <Text className="text-xl font-semibold text-white text-center mb-2" allowFontScaling>
          Acesso à câmera necessário
        </Text>
        <Text className="text-sm text-neutral-300 text-center mb-6 leading-relaxed" allowFontScaling>
          Para fotografar o rótulo, o aplicativo precisa de acesso à câmera do seu dispositivo.
        </Text>
        <Button
          onPress={permission.canAskAgain ? requestPermission : () => Linking.openSettings()}
          accessibilityLabel={permission.canAskAgain ? 'Permitir acesso à câmera' : 'Abrir configurações'}
        >
          {permission.canAskAgain ? 'Permitir acesso' : 'Abrir configurações'}
        </Button>
      </View>
    );
  }

  return (
    <View className="flex-1 bg-black">
      <CameraView ref={cameraRef} style={{ flex: 1 }} facing="back" />

      <OcrOverlay
        phase={phase === 'preview' ? 'preview' : 'camera'}
        capturing={phase === 'capturing'}
        disabled={phase === 'processing'}
        title="Fotografe a lista de ingredientes"
        subtitle="Certifique-se de que todo o texto esteja visível"
        guideLabel="LISTA DE INGREDIENTES"
        previewUri={photoUri}
        previewLabel="Lista de ingredientes capturada"
        previewQuestion="O texto está legível e completo?"
        onCapture={handleCapture}
        onGalleryPress={handleGallery}
        onManualPress={() => finalize(null)}
        onRetake={() => setPhase('camera')}
        onConfirm={() => finalize(photoUri)}
      />

      {phase === 'processing' && (
        <LoadingOverlay label={'Analisando rótulo…\nIsso pode levar alguns segundos'} />
      )}

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
