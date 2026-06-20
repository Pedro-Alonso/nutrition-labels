import { Ionicons } from '@expo/vector-icons';
import { zodResolver } from '@hookform/resolvers/zod';
import { isAxiosError } from 'axios';
import * as Haptics from 'expo-haptics';
import { router } from 'expo-router';
import { useState } from 'react';
import { Controller, useForm } from 'react-hook-form';
import { Pressable, ScrollView, Text, View } from 'react-native';
import { z } from 'zod';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Toast } from '@/components/ui/Toast';
import { useAuth } from '@/hooks/useAuth';

const upgradeSchema = z
  .object({
    display_name: z.string().trim().min(1, 'Informe seu nome'),
    email: z.string().trim().min(1, 'Informe seu e-mail.').email('Informe um email válido'),
    password: z.string().min(8, 'A senha deve ter pelo menos 8 caracteres'),
    confirm_password: z.string(),
  })
  .refine((d) => d.password === d.confirm_password, {
    message: 'As senhas não coincidem',
    path: ['confirm_password'],
  });

type UpgradeFormData = z.infer<typeof upgradeSchema>;

export default function UpgradeScreen() {
  const { upgradeAccount } = useAuth();
  const [toast, setToast] = useState({ message: '', type: 'error' as 'error' | 'success' });

  const {
    control,
    handleSubmit,
    setError,
    formState: { errors, isSubmitting },
  } = useForm<UpgradeFormData>({
    resolver: zodResolver(upgradeSchema),
    defaultValues: { display_name: '', email: '', password: '', confirm_password: '' },
  });

  const onSubmit = async (data: UpgradeFormData) => {
    await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    try {
      await upgradeAccount({
        email: data.email,
        password: data.password,
        display_name: data.display_name,
      });
      setToast({ message: 'Conta criada com sucesso!', type: 'success' });
      setTimeout(() => router.back(), 1200);
    } catch (error) {
      if (isAxiosError(error)) {
        if (error.response?.status === 409) {
          setError('email', { message: 'Este e-mail já está cadastrado.' });
          return;
        }
        if (error.response?.status === 422) {
          setError('password', { message: 'A senha deve ter pelo menos 8 caracteres.' });
          return;
        }
      }
      setToast({ message: 'Não foi possível criar a conta. Tente novamente.', type: 'error' });
    }
  };

  return (
    <View className="flex-1 bg-neutral-50">
      <ScrollView keyboardShouldPersistTaps="handled">
        <View className="px-6 pt-14 pb-6 flex-row items-center gap-3">
          <Pressable
            onPress={() => router.back()}
            accessibilityRole="button"
            accessibilityLabel="Voltar"
            className="w-11 h-11 items-center justify-center -ml-2"
          >
            <Ionicons name="chevron-back" size={26} color="#111827" />
          </Pressable>
          <View className="flex-1">
            <Text
              className="text-3xl font-extrabold text-neutral-900 tracking-tight"
              accessibilityRole="header"
              allowFontScaling
            >
              Criar conta
            </Text>
          </View>
        </View>
        <Text className="px-6 -mt-4 text-base text-neutral-600" allowFontScaling>
          Seus dados e histórico serão mantidos
        </Text>

        <View className="px-6 pt-6 gap-4">
          <Controller
            control={control}
            name="display_name"
            render={({ field: { onChange, onBlur, value } }) => (
              <Input
                label="Nome de exibição"
                value={value}
                onChangeText={onChange}
                onBlur={onBlur}
                placeholder="Como quer ser chamado?"
                autoCapitalize="words"
                editable={!isSubmitting}
                error={errors.display_name?.message}
                accessibilityLabel="Nome de exibição"
              />
            )}
          />

          <Controller
            control={control}
            name="email"
            render={({ field: { onChange, onBlur, value } }) => (
              <Input
                label="E-mail"
                value={value}
                onChangeText={onChange}
                onBlur={onBlur}
                placeholder="seu@email.com"
                keyboardType="email-address"
                autoCapitalize="none"
                autoComplete="email"
                editable={!isSubmitting}
                error={errors.email?.message}
                accessibilityLabel="E-mail"
              />
            )}
          />

          <Controller
            control={control}
            name="password"
            render={({ field: { onChange, onBlur, value } }) => (
              <Input
                label="Senha"
                value={value}
                onChangeText={onChange}
                onBlur={onBlur}
                placeholder="Mínimo 8 caracteres"
                hint={errors.password ? undefined : 'Mínimo 8 caracteres'}
                password
                editable={!isSubmitting}
                error={errors.password?.message}
                accessibilityLabel="Senha"
              />
            )}
          />

          <Controller
            control={control}
            name="confirm_password"
            render={({ field: { onChange, onBlur, value } }) => (
              <Input
                label="Confirmar senha"
                value={value}
                onChangeText={onChange}
                onBlur={onBlur}
                placeholder="Repita a senha"
                password
                editable={!isSubmitting}
                error={errors.confirm_password?.message}
                accessibilityLabel="Confirmar senha"
              />
            )}
          />

          <View className="pt-2 pb-10">
            <Button
              full
              loading={isSubmitting}
              onPress={handleSubmit(onSubmit)}
              accessibilityLabel="Criar conta"
            >
              Criar conta
            </Button>
          </View>
        </View>
      </ScrollView>

      <Toast
        message={toast.message}
        type={toast.type}
        visible={!!toast.message}
        onDismiss={() => setToast({ message: '', type: 'error' })}
      />
    </View>
  );
}
