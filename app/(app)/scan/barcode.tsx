import { Ionicons } from '@expo/vector-icons';
import { useMutation } from '@tanstack/react-query';
import { AxiosError } from 'axios';
import { CameraView, useCameraPermissions, type BarcodeScanningResult } from 'expo-camera';
import { router } from 'expo-router';
import { useEffect, useState } from 'react';
import { Linking, Text, View } from 'react-native';
import { BarcodeOverlay } from '@/components/scan/BarcodeOverlay';
import { ScanFeedback } from '@/components/scan/ScanFeedback';
import { Button } from '@/components/ui/Button';
import { LoadingOverlay } from '@/components/ui/LoadingOverlay';
import { Toast } from '@/components/ui/Toast';
import { ROUTES } from '@/constants/routes';
import { productsService } from '@/services/api/products';

export default function BarcodeScreen() {
  const [permission, requestPermission] = useCameraPermissions();
  const [feedback, setFeedback] = useState<'success' | 'error' | null>(null);
  const [toast, setToast] = useState<{ message: string; type: 'warning' | 'error' } | null>(null);

  const lookupMutation = useMutation({
    mutationFn: (barcode: string) => productsService.getProduct(barcode),
  });

  useEffect(() => {
    if (feedback !== 'success') return;
    const timer = setTimeout(() => setFeedback(null), 700);
    return () => clearTimeout(timer);
  }, [feedback]);

  const handleBarcodeScanned = ({ data: code }: BarcodeScanningResult) => {
    if (lookupMutation.isPending) return;
    setFeedback('success');

    lookupMutation.mutate(code, {
      onSuccess: (product) => {
        router.replace({
          pathname: ROUTES.SCAN_RESULT,
          params: { barcode: code, product: JSON.stringify(product) },
        });
      },
      onError: (err) => {
        const status = err instanceof AxiosError ? err.response?.status : undefined;

        if (status === 404) {
          setToast({ message: 'Produto não encontrado — fotografe o rótulo', type: 'warning' });
          setTimeout(() => {
            router.push({ pathname: ROUTES.SCAN_OCR, params: { barcode: code } });
          }, 1500);
          return;
        }

        setFeedback('error');
        setToast({ message: 'Não foi possível buscar o produto. Tente novamente.', type: 'error' });
      },
    });
  };

  const handleCancel = () => {
    router.back();
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
          Para escanear produtos, o aplicativo precisa de acesso à câmera do seu dispositivo.
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
      <CameraView
        style={{ flex: 1 }}
        facing="back"
        barcodeScannerSettings={{ barcodeTypes: ['ean13', 'ean8', 'upc_a', 'upc_e', 'code128'] }}
        onBarcodeScanned={lookupMutation.isPending ? undefined : handleBarcodeScanned}
      />

      <BarcodeOverlay success={feedback === 'success'} onCancel={handleCancel} />
      <ScanFeedback status={feedback} />

      {lookupMutation.isPending && <LoadingOverlay label="Buscando produto…" />}

      {toast && (
        <Toast
          message={toast.message}
          type={toast.type}
          visible={!!toast}
          onDismiss={() => setToast(null)}
        />
      )}
    </View>
  );
}
