import { zodResolver } from '@hookform/resolvers/zod';
import { Ionicons } from '@expo/vector-icons';
import * as Haptics from 'expo-haptics';
import { router, Stack } from 'expo-router';
import { useState } from 'react';
import { Controller, useForm } from 'react-hook-form';
import { ActivityIndicator, Pressable, ScrollView, Text, View } from 'react-native';
import { z } from 'zod';
import { DiabetesTypePicker } from '@/components/auth/DiabetesTypePicker';
import { LanguageLevelPicker } from '@/components/auth/LanguageLevelPicker';
import { ErrorMessage } from '@/components/ui/ErrorMessage';
import { Input } from '@/components/ui/Input';
import { Toast } from '@/components/ui/Toast';
import { useMe, useUpdateProfile } from '@/hooks/useMe';

const editProfileSchema = z.object({
  display_name: z.string(),
  diabetes_type: z.enum(['DM1', 'DM2', 'DMG', 'outro']).nullable(),
  language_level: z.enum(['leigo', 'tecnico']).nullable(),
});

type EditProfileFormData = z.infer<typeof editProfileSchema>;

export default function ProfileEditScreen() {
  const { data: user, isLoading, isError, refetch } = useMe();
  const updateProfile = useUpdateProfile();
  const [toast, setToast] = useState<{ message: string; type: 'success' | 'error' } | null>(null);

  const { control, handleSubmit } = useForm<EditProfileFormData>({
    resolver: zodResolver(editProfileSchema),
    values: user
      ? {
          display_name: user.display_name ?? '',
          diabetes_type: (user.diabetes_type as EditProfileFormData['diabetes_type']) ?? null,
          language_level: (user.language_level as EditProfileFormData['language_level']) ?? null,
        }
      : undefined,
  });

  const onSubmit = async (data: EditProfileFormData) => {
    await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    try {
      await updateProfile.mutateAsync({
        display_name: data.display_name.trim() || null,
        diabetes_type: data.diabetes_type,
        language_level: data.language_level,
      });
      setToast({ message: 'Perfil atualizado com sucesso', type: 'success' });
      setTimeout(() => router.back(), 1200);
    } catch {
      setToast({ message: 'Não foi possível salvar. Tente novamente.', type: 'error' });
    }
  };

  return (
    <View className="flex-1 bg-neutral-50">
      <Stack.Screen
        options={{
          headerTitle: 'Editar perfil',
          headerLeft: () => (
            <Pressable
              onPress={() => router.back()}
              accessibilityRole="button"
              accessibilityLabel="Voltar"
              hitSlop={8}
              className="p-2 -ml-2 min-h-[44px] min-w-[44px] items-center justify-center"
            >
              <Ionicons name="chevron-back" size={24} color="#111827" />
            </Pressable>
          ),
          headerRight: () => (
            <Pressable
              onPress={handleSubmit(onSubmit)}
              disabled={updateProfile.isPending || isLoading}
              accessibilityRole="button"
              accessibilityLabel="Salvar alterações"
              accessibilityState={{ disabled: updateProfile.isPending || isLoading, busy: updateProfile.isPending }}
              className="px-2 min-h-[44px] min-w-[44px] items-center justify-center"
            >
              {updateProfile.isPending ? (
                <ActivityIndicator size="small" color="#059669" />
              ) : (
                <Text
                  className={`text-base font-bold ${isLoading ? 'text-primary-300' : 'text-primary-600'}`}
                  allowFontScaling
                >
                  Salvar
                </Text>
              )}
            </Pressable>
          ),
        }}
      />

      {isLoading && (
        <View className="flex-1 items-center justify-center gap-3" accessibilityLiveRegion="polite">
          <ActivityIndicator size="large" color="#10B981" />
          <Text className="text-sm text-neutral-500" allowFontScaling>
            Carregando perfil…
          </Text>
        </View>
      )}

      {!isLoading && (isError || !user) && (
        <View className="px-4 pt-4">
          <ErrorMessage message="Não foi possível carregar seu perfil." onRetry={refetch} />
        </View>
      )}

      {!isLoading && !isError && user && (
        <ScrollView keyboardShouldPersistTaps="handled" contentContainerStyle={{ padding: 16, gap: 16 }}>
          <Controller
            control={control}
            name="display_name"
            render={({ field: { onChange, onBlur, value } }) => (
              <Input
                label="Nome"
                value={value}
                onChangeText={onChange}
                onBlur={onBlur}
                placeholder="Seu nome"
                autoCapitalize="words"
                editable={!updateProfile.isPending}
                accessibilityLabel="Nome"
              />
            )}
          />

          <Controller
            control={control}
            name="diabetes_type"
            render={({ field: { onChange, value } }) => (
              <DiabetesTypePicker value={value} onChange={onChange} />
            )}
          />

          <Controller
            control={control}
            name="language_level"
            render={({ field: { onChange, value } }) => (
              <LanguageLevelPicker value={value} onChange={onChange} />
            )}
          />

          <View className="bg-primary-50 rounded-xl p-3.5 border-l-4 border-primary-500">
            <Text className="text-sm text-primary-700 leading-5" allowFontScaling>
              Estas informações personalizam a linguagem e os alertas nas análises.
            </Text>
          </View>
        </ScrollView>
      )}

      <Toast
        message={toast?.message ?? ''}
        type={toast?.type}
        visible={!!toast}
        onDismiss={() => setToast(null)}
      />
    </View>
  );
}
