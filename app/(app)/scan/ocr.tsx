import { Ionicons } from '@expo/vector-icons';
import { AxiosError } from 'axios';
import { CameraView, useCameraPermissions } from 'expo-camera';
import * as ImagePicker from 'expo-image-picker';
import { router, useLocalSearchParams } from 'expo-router';
import { useRef, useState } from 'react';
import { Linking, Text, View } from 'react-native';
import { OcrOverlay } from '@/components/scan/OcrOverlay';
import { BottomSheet } from '@/components/ui/BottomSheet';
import { Button } from '@/components/ui/Button';
import { LoadingOverlay } from '@/components/ui/LoadingOverlay';
import { Toast } from '@/components/ui/Toast';
import { ROUTES } from '@/constants/routes';
import { useAnalyze } from '@/hooks/useAnalyze';
import { productsService } from '@/services/api/products';

type Phase = 'ready' | 'capturing' | 'processing';

export default function OcrScreen() {
  const { barcode } = useLocalSearchParams<{ barcode?: string }>();
  const [permission, requestPermission] = useCameraPermissions();
  const cameraRef = useRef<CameraView>(null);
  const [phase, setPhase] = useState<Phase>('ready');
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [categorySheetVisible, setCategorySheetVisible] = useState(false);
  const analyzeMutation = useAnalyze();

  const processImage = (uri: string) => {
    setPhase('processing');
    setErrorMessage(null);

    const filename = uri.split('/').pop() ?? 'rotulo.jpg';
    const extension = filename.split('.').pop()?.toLowerCase();
    const type = extension === 'png' ? 'image/png' : 'image/jpeg';

    analyzeMutation.mutate(
      { file: { uri, name: filename, type } },
      {
        onSuccess: async (data) => {
          if (barcode) {
            try {
              await productsService.createProduct(barcode, {});
            } catch {
              // Persistência é melhor-esforço: não bloqueia a navegação para o resultado.
            }
          }

          router.replace({
            pathname: ROUTES.SCAN_RESULT,
            params: { barcode: barcode ?? '', result: JSON.stringify(data) },
          });
        },
        onError: (err) => {
          const status = err instanceof AxiosError ? err.response?.status : undefined;

          if (status === 400) {
            setErrorMessage('Não foi possível ler o rótulo. Tente tirar a foto com mais luz e menos ângulo.');
          } else if (status === 413) {
            setErrorMessage('Foto muito grande. Use uma resolução menor.');
          } else {
            setErrorMessage('Não foi possível analisar o rótulo. Tente novamente.');
          }
          setPhase('ready');
        },
      },
    );
  };

  const handleCapture = async () => {
    if (phase !== 'ready' || !cameraRef.current) return;

    setPhase('capturing');
    try {
      const photo = await cameraRef.current.takePictureAsync({ quality: 0.8 });
      if (!photo?.uri) throw new Error('Falha ao capturar foto');
      processImage(photo.uri);
    } catch {
      setErrorMessage('Não foi possível capturar a foto. Tente novamente.');
      setPhase('ready');
    }
  };

  const handleGallery = async () => {
    if (phase !== 'ready') return;

    const mediaPermission = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (!mediaPermission.granted) {
      setErrorMessage('Permita o acesso às fotos para escolher uma imagem da galeria.');
      return;
    }

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ['images'],
      quality: 0.8,
    });

    if (result.canceled || !result.assets?.[0]?.uri) return;
    processImage(result.assets[0].uri);
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
        capturing={phase === 'capturing'}
        disabled={phase === 'processing'}
        onCapture={handleCapture}
        onGalleryPress={handleGallery}
        onCategoryHintPress={() => setCategorySheetVisible(true)}
      />

      {phase === 'processing' && <LoadingOverlay label="Analisando rótulo…" />}

      {errorMessage && (
        <Toast
          message={errorMessage}
          type="error"
          visible={!!errorMessage}
          onDismiss={() => setErrorMessage(null)}
        />
      )}

      <BottomSheet visible={categorySheetVisible} onClose={() => setCategorySheetVisible(false)}>
        <View className="px-4 pt-2 gap-4">
          <Text className="text-xl font-bold text-neutral-900" allowFontScaling accessibilityRole="header">
            O que o app reconhece
          </Text>

          <View className="gap-1">
            <Text className="text-base font-semibold text-neutral-900" allowFontScaling>
              Tabela nutricional
            </Text>
            <Text className="text-sm text-neutral-600 leading-relaxed" allowFontScaling>
              A tabela com calorias, carboidratos, açúcares e outros valores por porção.
            </Text>
          </View>

          <View className="gap-1">
            <Text className="text-base font-semibold text-neutral-900" allowFontScaling>
              Lista de ingredientes
            </Text>
            <Text className="text-sm text-neutral-600 leading-relaxed" allowFontScaling>
              O texto que lista os ingredientes do produto, geralmente próximo da tabela.
            </Text>
          </View>

          <View className="gap-1">
            <Text className="text-base font-semibold text-neutral-900" allowFontScaling>
              Texto livre
            </Text>
            <Text className="text-sm text-neutral-600 leading-relaxed" allowFontScaling>
              Qualquer outro texto do rótulo, caso a tabela ou os ingredientes não estejam visíveis.
            </Text>
          </View>

          <Button variant="secondary" onPress={() => setCategorySheetVisible(false)} accessibilityLabel="Fechar">
            Fechar
          </Button>
        </View>
      </BottomSheet>
    </View>
  );
}
