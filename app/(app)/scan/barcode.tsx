import { Ionicons } from '@expo/vector-icons';
import { useMutation } from '@tanstack/react-query';
import { AxiosError } from 'axios';
import { CameraView, useCameraPermissions, type BarcodeScanningResult } from 'expo-camera';
import { router } from 'expo-router';
import { useEffect, useState } from 'react';
import { KeyboardAvoidingView, Linking, Platform, Text, TextInput, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { BarcodeOverlay } from '@/components/scan/BarcodeOverlay';
import { ScanFeedback } from '@/components/scan/ScanFeedback';
import { ScanModeToggle, type ScanMode } from '@/components/scan/ScanModeToggle';
import { Button } from '@/components/ui/Button';
import { LoadingOverlay } from '@/components/ui/LoadingOverlay';
import { Toast } from '@/components/ui/Toast';
import { ROUTES } from '@/constants/routes';
import { productsService } from '@/services/api/products';
import { useScanFlow } from '@/stores/scanFlowStore';
import type { IngredientsData, NutritionalTableData, Product } from '@/types/api';

// Dados vazios para iniciar a revisão quando o produto não traz tabela/lista.
const EMPTY_TABLE: NutritionalTableData = { portion_description: null, columns: [], rows: [] };
const EMPTY_INGREDIENTS: IngredientsData = { items: [] };

// Comprimento típico de códigos EAN/UPC (8 = EAN-8/UPC-E … 14 = ITF-14).
const MIN_BARCODE_LENGTH = 8;
const MAX_BARCODE_LENGTH = 14;

export default function BarcodeScreen() {
  const insets = useSafeAreaInsets();
  const [permission, requestPermission] = useCameraPermissions();
  const [mode, setMode] = useState<ScanMode>('camera');
  const [manualCode, setManualCode] = useState('');
  const [feedback, setFeedback] = useState<'success' | 'error' | null>(null);
  const [toast, setToast] = useState<{ message: string; type: 'warning' | 'error' } | null>(null);
  const { startFlow, startCapture } = useScanFlow();

  const lookupMutation = useMutation({
    mutationFn: (barcode: string) => productsService.getProduct(barcode),
  });

  useEffect(() => {
    if (feedback !== 'success') return;
    const timer = setTimeout(() => setFeedback(null), 700);
    return () => clearTimeout(timer);
  }, [feedback]);

  // Busca + roteamento 200/404 compartilhados pela câmera e pela entrada manual.
  const lookupProduct = (code: string) => {
    if (lookupMutation.isPending) return;

    lookupMutation.mutate(code, {
      onSuccess: (product: Product) => {
        // Produto já cadastrado: leva às telas de revisão pré-preenchidas com os
        // dados da base. A análise atual vai junto — se nada for editado, o
        // resultado é exibido sem PUT (lógica na tela de ingredientes).
        startFlow({
          barcode: code,
          source: 'db',
          mode: 'update',
          productName: product.name,
          nutritionalTable: product.nutritional_table ?? EMPTY_TABLE,
          ingredients: product.ingredients ?? EMPTY_INGREDIENTS,
          analysis: product.analysis,
        });
        router.replace(ROUTES.SCAN_TABLE_REVIEW);
      },
      onError: (err) => {
        const status = err instanceof AxiosError ? err.response?.status : undefined;

        if (status === 404) {
          // Produto não cadastrado: inicia a captura em duas fotos (tabela e
          // ingredientes) que alimentará o OCR antes das telas de revisão.
          setToast({ message: 'Produto não encontrado — fotografe o rótulo', type: 'warning' });
          startCapture(code);
          setTimeout(() => {
            router.push(ROUTES.SCAN_TABLE_PHOTO);
          }, 1500);
          return;
        }

        setFeedback('error');
        setToast({ message: 'Não foi possível buscar o produto. Tente novamente.', type: 'error' });
      },
    });
  };

  const handleBarcodeScanned = ({ data: code }: BarcodeScanningResult) => {
    if (lookupMutation.isPending) return;
    setFeedback('success');
    lookupProduct(code);
  };

  const handleManualSubmit = () => {
    const code = manualCode.trim();
    if (code.length < MIN_BARCODE_LENGTH) return;
    lookupProduct(code);
  };

  const handleCancel = () => {
    router.back();
  };

  const renderCamera = () => {
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
            Para escanear produtos, o aplicativo precisa de acesso à câmera do seu dispositivo. Você
            também pode digitar o código manualmente.
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
      <>
        <CameraView
          style={{ flex: 1 }}
          facing="back"
          barcodeScannerSettings={{ barcodeTypes: ['ean13', 'ean8', 'upc_a', 'upc_e', 'code128'] }}
          onBarcodeScanned={lookupMutation.isPending ? undefined : handleBarcodeScanned}
        />
        <BarcodeOverlay
          success={feedback === 'success'}
          instructionTop={insets.top + 56}
          onCancel={handleCancel}
        />
        <ScanFeedback status={feedback} />
      </>
    );
  };

  const renderManual = () => (
    <KeyboardAvoidingView
      className="flex-1 bg-neutral-900"
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
    >
      <View className="flex-1 items-center justify-center px-7">
        <View className="items-center mb-8" accessible>
          <Ionicons name="barcode-outline" size={52} color="rgba(255,255,255,0.5)" />
          <Text
            className="text-lg font-semibold text-white text-center mt-3.5"
            allowFontScaling
            accessibilityRole="header"
          >
            Insira o código de barras
          </Text>
          <Text className="text-sm text-white/60 text-center mt-1.5" allowFontScaling>
            Digite os números impressos abaixo do código
          </Text>
        </View>

        <TextInput
          value={manualCode}
          onChangeText={(text) => setManualCode(text.replace(/\D/g, ''))}
          onSubmitEditing={handleManualSubmit}
          keyboardType="number-pad"
          maxLength={MAX_BARCODE_LENGTH}
          placeholder="0000000000000"
          placeholderTextColor="rgba(255,255,255,0.3)"
          allowFontScaling
          autoFocus
          accessibilityLabel="Código de barras"
          accessibilityHint="Digite de 8 a 14 dígitos"
          className="w-full h-14 rounded-xl border border-white/20 bg-white/10 px-4 text-center text-xl font-semibold text-white"
          style={{ letterSpacing: 4 }}
        />

        <View className="w-full mt-4">
          <Button
            full
            onPress={handleManualSubmit}
            disabled={manualCode.length < MIN_BARCODE_LENGTH}
            loading={lookupMutation.isPending}
            accessibilityLabel="Buscar produto"
            accessibilityHint="Busca o produto pelo código digitado"
          >
            Buscar produto
          </Button>
        </View>
      </View>
    </KeyboardAvoidingView>
  );

  return (
    <View className="flex-1 bg-black">
      {mode === 'camera' ? renderCamera() : renderManual()}

      {/* Alternância Câmera ↔ Manual, sempre acessível no topo. */}
      <View className="absolute left-4 right-4" style={{ top: insets.top + 8 }} pointerEvents="box-none">
        <ScanModeToggle mode={mode} onChange={setMode} />
      </View>

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
