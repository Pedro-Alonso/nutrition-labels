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

const loginSchema = z.object({
  email: z.string().min(1, 'Informe seu e-mail.').email('Informe um e-mail válido.'),
  password: z.string().min(1, 'Informe sua senha.'),
});

type LoginFormData = z.infer<typeof loginSchema>;

export default function LoginScreen() {
  const { login } = useAuth();
  const [errorToast, setErrorToast] = useState('');

  const {
    control,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
    defaultValues: { email: '', password: '' },
  });

  const onSubmit = async (data: LoginFormData) => {
    await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    try {
      await login(data);
      router.replace('/(app)/(home)');
    } catch (error) {
      if (isAxiosError(error) && error.response?.status === 401) {
        setErrorToast('E-mail ou senha inválidos.');
      } else {
        setErrorToast('Não foi possível entrar. Tente novamente.');
      }
    }
  };

  return (
    <View className="flex-1 bg-neutral-50">
      <ScrollView keyboardShouldPersistTaps="handled">
        <View className="px-6 pt-14 pb-7">
          <Text
            className="text-3xl font-extrabold text-neutral-900 tracking-tight"
            accessibilityRole="header"
            allowFontScaling
          >
            Entrar
          </Text>
          <Text className="text-base text-neutral-600 mt-1" allowFontScaling>
            Faça login para continuar
          </Text>
        </View>

        <View className="px-6 gap-4">
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
                placeholder="••••••••"
                password
                editable={!isSubmitting}
                error={errors.password?.message}
                accessibilityLabel="Senha"
              />
            )}
          />

          <View className="mt-2">
            <Button
              full
              loading={isSubmitting}
              onPress={handleSubmit(onSubmit)}
              accessibilityLabel="Entrar"
            >
              Entrar
            </Button>
          </View>

          <View className="items-center gap-0.5 mt-4 pb-8">
            <Text className="text-sm text-neutral-600" allowFontScaling>
              Não tem uma conta?
            </Text>
            <Pressable
              onPress={() => router.push('/(auth)/register')}
              accessibilityRole="button"
              accessibilityLabel="Criar conta"
              className="min-h-[44px] justify-center px-2"
            >
              <Text className="text-primary-600 font-bold text-base" allowFontScaling>
                Criar conta
              </Text>
            </Pressable>
          </View>
        </View>
      </ScrollView>

      <Toast
        message={errorToast}
        type="error"
        visible={!!errorToast}
        onDismiss={() => setErrorToast('')}
      />
    </View>
  );
}
