import { Ionicons } from '@expo/vector-icons';
import { CameraView, useCameraPermissions } from 'expo-camera';
import * as ImagePicker from 'expo-image-picker';
import { Redirect, router } from 'expo-router';
import { useRef, useState } from 'react';
import { Linking, Text, View } from 'react-native';
import { CropOverlay } from '@/components/scan/CropOverlay';
import { OcrOverlay } from '@/components/scan/OcrOverlay';
import { Button } from '@/components/ui/Button';
import { Toast } from '@/components/ui/Toast';
import { ROUTES } from '@/constants/routes';
import { useScanFlow } from '@/stores/scanFlowStore';
import { cropToRect } from '@/utils/cropPhoto';

type Phase = 'camera' | 'capturing' | 'preview' | 'crop';

export default function TablePhotoScreen() {
  const { capture, setCaptureTable } = useScanFlow();
  const [permission, requestPermission] = useCameraPermissions();
  const cameraRef = useRef<CameraView>(null);
  const [phase, setPhase] = useState<Phase>('camera');
  const [photoUri, setPhotoUri] = useState<string | null>(null);
  const [photoDimensions, setPhotoDimensions] = useState<{ width: number; height: number } | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  // Acesso direto à rota sem captura ativa: volta ao início do scan.
  if (!capture) return <Redirect href={ROUTES.SCAN_BARCODE} />;

  const goToIngredients = (uri: string | null) => {
    setCaptureTable(uri);
    router.push(ROUTES.SCAN_INGREDIENTS_PHOTO);
  };

  const handleCapture = async () => {
    if (phase !== 'camera' || !cameraRef.current) return;
    setPhase('capturing');
    try {
      const photo = await cameraRef.current.takePictureAsync({ quality: 0.8 });
      if (!photo?.uri) throw new Error('Falha ao capturar foto');
      setPhotoUri(photo.uri);
      setPhotoDimensions(photo.width && photo.height ? { width: photo.width, height: photo.height } : null);
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
    const asset = result.assets[0];
    setPhotoUri(asset.uri);
    setPhotoDimensions(asset.width && asset.height ? { width: asset.width, height: asset.height } : null);
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

      {phase === 'crop' && photoUri && photoDimensions ? (
        <CropOverlay
          uri={photoUri}
          imageWidth={photoDimensions.width}
          imageHeight={photoDimensions.height}
          onCrop={async (rect) => {
            const croppedUri = await cropToRect(photoUri, rect);
            goToIngredients(croppedUri);
          }}
          onSkip={() => goToIngredients(photoUri)}
        />
      ) : (
        <OcrOverlay
          phase={phase === 'preview' ? 'preview' : 'camera'}
          capturing={phase === 'capturing'}
          title="Fotografe a tabela nutricional"
          subtitle="Enquadre toda a tabela dentro do guia abaixo"
          guideLabel="TABELA NUTRICIONAL"
          previewUri={photoUri}
          previewLabel="Tabela nutricional capturada"
          previewQuestion="A tabela está legível e bem enquadrada?"
          onCapture={handleCapture}
          onGalleryPress={handleGallery}
          onManualPress={() => goToIngredients(null)}
          onRetake={() => setPhase('camera')}
          onConfirm={() => (photoDimensions ? setPhase('crop') : goToIngredients(photoUri))}
        />
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
