import { zodResolver } from '@hookform/resolvers/zod';
import { Redirect, router } from 'expo-router';
import { useState } from 'react';
import { Controller, useForm } from 'react-hook-form';
import { KeyboardAvoidingView, Platform, ScrollView, Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { z } from 'zod';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Toast } from '@/components/ui/Toast';
import { ROUTES } from '@/constants/routes';
import { useUpsertProduct } from '@/hooks/useUpsertProduct';
import { useScanFlow } from '@/stores/scanFlowStore';

const metadataSchema = z.object({
  name: z.string().trim().min(1, 'Informe o nome do produto.'),
  brand: z.string().trim().min(1, 'Informe a marca do produto.'),
});

type MetadataFormData = z.infer<typeof metadataSchema>;

export default function MetadataScreen() {
  const { flow, capture, setProductName, setProductBrand, setCaptureMetadata } = useScanFlow();
  const insets = useSafeAreaInsets();
  const upsertProduct = useUpsertProduct();
  const [errorToast, setErrorToast] = useState('');

  const {
    control,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<MetadataFormData>({
    resolver: zodResolver(metadataSchema),
    defaultValues: {
      name: flow?.productName ?? capture?.productName ?? '',
      brand: flow?.brand ?? capture?.brand ?? '',
    },
  });

  // Acesso direto à rota sem fluxo/captura ativos (ou reset após confirmar):
  // volta ao início do scan. Após todos os hooks, para não pular `useForm`.
  if (!flow && !capture) return <Redirect href={ROUTES.SCAN_BARCODE} />;

  const onSubmit = async (data: MetadataFormData) => {
    const name = data.name.trim();
    const brand = data.brand.trim();

    if (flow) {
      const changed = name !== (flow.productName ?? '') || brand !== (flow.brand ?? '');
      if (changed) {
        try {
          await upsertProduct.mutateAsync({
            barcode: flow.barcode,
            mode: 'update',
            data: { name, brand },
          });
        } catch {
          setErrorToast('Não foi possível salvar os dados do produto. Tente novamente.');
          return;
        }
      }
      setProductName(name);
      setProductBrand(brand);
      router.replace(ROUTES.SCAN_TABLE_REVIEW);
      return;
    }

    setCaptureMetadata(name, brand);
    router.push(ROUTES.SCAN_TABLE_PHOTO);
  };

  return (
    <KeyboardAvoidingView
      className="flex-1 bg-neutral-50 dark:bg-dark-bg"
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      keyboardVerticalOffset={insets.top + 56}
    >
      <ScrollView contentContainerStyle={{ padding: 16, paddingBottom: 120 }} keyboardShouldPersistTaps="handled">
        <Text className="text-base text-neutral-600 dark:text-dark-text-secondary mb-4" allowFontScaling>
          Confirme o nome e a marca do produto para identificá-lo corretamente nas próximas etapas.
        </Text>

        <View className="gap-4">
          <Controller
            control={control}
            name="name"
            render={({ field: { onChange, onBlur, value } }) => (
              <Input
                label="Nome do produto"
                value={value}
                onChangeText={onChange}
                onBlur={onBlur}
                placeholder="Ex.: Refrigerante de cola"
                autoCapitalize="sentences"
                editable={!isSubmitting}
                error={errors.name?.message}
                accessibilityLabel="Nome do produto"
              />
            )}
          />

          <Controller
            control={control}
            name="brand"
            render={({ field: { onChange, onBlur, value } }) => (
              <Input
                label="Marca"
                value={value}
                onChangeText={onChange}
                onBlur={onBlur}
                placeholder="Ex.: Marca exemplo"
                autoCapitalize="words"
                editable={!isSubmitting}
                error={errors.brand?.message}
                accessibilityLabel="Marca do produto"
              />
            )}
          />
        </View>
      </ScrollView>

      <View className="absolute bottom-0 left-0 right-0 bg-white dark:bg-dark-card border-t border-neutral-100 dark:border-dark-surface px-4 pt-3 pb-6 shadow-lg">
        <Button
          full
          loading={isSubmitting}
          onPress={handleSubmit(onSubmit)}
          accessibilityLabel="Confirmar dados do produto"
        >
          Continuar
        </Button>
      </View>

      <Toast
        message={errorToast}
        type="error"
        visible={!!errorToast}
        onDismiss={() => setErrorToast('')}
      />
    </KeyboardAvoidingView>
  );
}
