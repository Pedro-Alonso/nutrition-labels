import { Ionicons } from '@expo/vector-icons';
import { CameraView, useCameraPermissions } from 'expo-camera';
import * as ImagePicker from 'expo-image-picker';
import { useRef, useState } from 'react';
import { Linking, Text, View } from 'react-native';
import { CropOverlay } from '@/components/scan/CropOverlay';
import { OcrOverlay } from '@/components/scan/OcrOverlay';
import { Button } from '@/components/ui/Button';
import { Toast } from '@/components/ui/Toast';
import { cropToRect } from '@/utils/cropPhoto';

type Phase = 'camera' | 'capturing' | 'preview' | 'crop';

interface CaptureWithCropProps {
  title: string;
  subtitle: string;
  guideLabel: string;
  previewLabel: string;
  previewQuestion: string;
  onComplete: (uri: string) => void;
  onCancel: () => void;
}

export function CaptureWithCrop({
  title,
  subtitle,
  guideLabel,
  previewLabel,
  previewQuestion,
  onComplete,
  onCancel,
}: CaptureWithCropProps) {
  const [permission, requestPermission] = useCameraPermissions();
  const cameraRef = useRef<CameraView>(null);
  const [phase, setPhase] = useState<Phase>('camera');
  const [photoUri, setPhotoUri] = useState<string | null>(null);
  const [photoDimensions, setPhotoDimensions] = useState<{ width: number; height: number } | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

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
      <View className="flex-1 items-center justify-center bg-neutral-900 px-8 gap-3" accessible>
        <Ionicons name="camera-outline" size={56} color="#9CA3AF" style={{ marginBottom: 16 }} />
        <Text className="text-xl font-semibold text-white text-center mb-2" allowFontScaling>
          Acesso à câmera necessário
        </Text>
        <Text className="text-sm text-neutral-300 text-center mb-6 leading-relaxed" allowFontScaling>
          Para fotografar o rótulo, o aplicativo precisa de acesso à câmera do seu dispositivo.
        </Text>
        <Button
          full
          onPress={permission.canAskAgain ? requestPermission : () => Linking.openSettings()}
          accessibilityLabel={permission.canAskAgain ? 'Permitir acesso à câmera' : 'Abrir configurações'}
        >
          {permission.canAskAgain ? 'Permitir acesso' : 'Abrir configurações'}
        </Button>
        <Button full variant="ghost" onPress={onCancel} accessibilityLabel="Cancelar">
          Cancelar
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
            onComplete(croppedUri);
          }}
          onSkip={() => onComplete(photoUri)}
        />
      ) : (
        <OcrOverlay
          phase={phase === 'preview' ? 'preview' : 'camera'}
          capturing={phase === 'capturing'}
          title={title}
          subtitle={subtitle}
          guideLabel={guideLabel}
          previewUri={photoUri}
          previewLabel={previewLabel}
          previewQuestion={previewQuestion}
          onCapture={handleCapture}
          onGalleryPress={handleGallery}
          onManualPress={onCancel}
          onRetake={() => setPhase('camera')}
          onConfirm={() => (photoDimensions ? setPhase('crop') : photoUri && onComplete(photoUri))}
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
