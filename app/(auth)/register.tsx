import { zodResolver } from '@hookform/resolvers/zod';
import { Ionicons } from '@expo/vector-icons';
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
import { DiabetesTypePicker } from '@/components/auth/DiabetesTypePicker';
import { LanguageLevelPicker } from '@/components/auth/LanguageLevelPicker';
import { ROUTES } from '@/constants/routes';
import { useAuth } from '@/hooks/useAuth';

const registerSchema = z.object({
  display_name: z.string().optional(),
  email: z.string().min(1, 'Informe seu e-mail.').email('Informe um e-mail válido.'),
  password: z.string().min(8, 'A senha deve ter pelo menos 8 caracteres.'),
  diabetes_type: z.enum(['type1', 'type2', 'dmg'], {
    message: 'Selecione o tipo de diabetes.',
  }),
  language_level: z.enum(['simples', 'padrão', 'técnico']),
});

type RegisterFormData = z.infer<typeof registerSchema>;

export default function RegisterScreen() {
  const { register: registerUser, login } = useAuth();
  const [errorToast, setErrorToast] = useState('');

  const {
    control,
    handleSubmit,
    setError,
    formState: { errors, isSubmitting },
  } = useForm<RegisterFormData>({
    resolver: zodResolver(registerSchema),
    defaultValues: {
      display_name: '',
      email: '',
      password: '',
      diabetes_type: undefined,
      language_level: 'padrão',
    },
  });

  const onSubmit = async (data: RegisterFormData) => {
    await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    try {
      await registerUser({
        email: data.email,
        password: data.password,
        display_name: data.display_name || undefined,
        diabetes_type: data.diabetes_type,
        language_level: data.language_level,
      });
      await login({ email: data.email, password: data.password });
      router.replace(ROUTES.HOME);
    } catch (error) {
      if (isAxiosError(error)) {
        if (error.response?.status === 409) {
          setErrorToast('Este e-mail já está cadastrado.');
          return;
        }
        if (error.response?.status === 422) {
          setError('password', { message: 'A senha deve ter pelo menos 8 caracteres.' });
          return;
        }
      }
      setErrorToast('Não foi possível criar a conta. Tente novamente.');
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
          Preencha seus dados para começar
        </Text>

        <View className="px-6 pt-6 gap-4">
          <Controller
            control={control}
            name="display_name"
            render={({ field: { onChange, onBlur, value } }) => (
              <Input
                label="Nome (opcional)"
                value={value}
                onChangeText={onChange}
                onBlur={onBlur}
                placeholder="Como prefere ser chamado?"
                autoCapitalize="words"
                editable={!isSubmitting}
                accessibilityLabel="Nome"
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

          <View className="relative h-px bg-neutral-200 my-2 items-center justify-center">
            <Text
              className="absolute bg-neutral-50 px-2.5 text-[11px] font-semibold tracking-wide text-neutral-400"
              allowFontScaling
            >
              PERFIL CLÍNICO
            </Text>
          </View>
          <Text className="-mt-2 text-xs text-neutral-400 text-center leading-5" allowFontScaling>
            Personalizamos as análises de risco ao seu perfil
          </Text>

          <Controller
            control={control}
            name="diabetes_type"
            render={({ field: { onChange, value } }) => (
              <DiabetesTypePicker
                value={value ?? null}
                onChange={onChange}
                error={errors.diabetes_type?.message}
              />
            )}
          />

          <Controller
            control={control}
            name="language_level"
            render={({ field: { onChange, value } }) => (
              <LanguageLevelPicker value={value} onChange={onChange} />
            )}
          />

          <View className="pt-2">
            <Button
              full
              loading={isSubmitting}
              onPress={handleSubmit(onSubmit)}
              accessibilityLabel="Criar conta"
            >
              Criar conta
            </Button>
          </View>

          <View className="items-center gap-0.5 mt-2 pb-10">
            <Text className="text-sm text-neutral-600" allowFontScaling>
              Já tem uma conta?
            </Text>
            <Pressable
              onPress={() => router.push('/(auth)/login')}
              accessibilityRole="button"
              accessibilityLabel="Fazer login"
              className="min-h-[44px] justify-center px-2"
            >
              <Text className="text-primary-600 font-bold text-base" allowFontScaling>
                Fazer login
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
