import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import { Alert, ScrollView, Text, View } from 'react-native';
import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';
import { ErrorMessage } from '@/components/ui/ErrorMessage';
import { ProfileInfoCard } from '@/components/ui/ProfileInfoCard';
import { Skeleton } from '@/components/ui/Skeleton';
import { ROUTES } from '@/constants/routes';
import { getDiabetesTypeLabel, getLanguageLevelLabel } from '@/constants/classifications';
import { useAuth } from '@/hooks/useAuth';
import { useMe } from '@/hooks/useMe';
import { formatMemberSince, getInitials } from '@/utils/formatters';

export default function ProfileScreen() {
  const { data: user, isLoading, isError, refetch } = useMe();
  const { logout, isGuest } = useAuth();

  const handleLogout = () => {
    Alert.alert('Sair da conta', 'Tem certeza que deseja sair?', [
      { text: 'Cancelar', style: 'cancel' },
      { text: 'Sair', style: 'destructive', onPress: () => logout() },
    ]);
  };

  return (
    <View className="flex-1 bg-neutral-50">
      <ScrollView contentContainerStyle={{ paddingBottom: 32 }}>
        {isLoading ? (
          <View className="bg-white items-center pt-8 pb-5 border-b border-neutral-100" accessibilityLiveRegion="polite">
            <Skeleton width={80} height={80} radius={40} />
            <View className="mt-3 items-center gap-2">
              <Skeleton width={160} height={20} />
              <Skeleton width={120} height={14} />
            </View>
          </View>
        ) : isError || !user ? (
          <View className="px-4 pt-4">
            <ErrorMessage message="Não foi possível carregar seu perfil." onRetry={refetch} />
          </View>
        ) : isGuest ? (
          <View
            className="bg-white items-center pt-8 pb-5 border-b border-neutral-100"
            accessible
            accessibilityLabel="Perfil de visitante"
          >
            <View className="w-20 h-20 rounded-full bg-neutral-100 items-center justify-center">
              <Ionicons name="person-outline" size={36} color="#9CA3AF" />
            </View>
            <Text className="text-xl font-semibold text-neutral-900 mt-3" allowFontScaling>
              {user.display_name || 'Visitante'}
            </Text>
            <Text className="text-sm text-neutral-500 mt-1" allowFontScaling>
              Conta de visitante
            </Text>
          </View>
        ) : (
          <View
            className="bg-white items-center pt-8 pb-5 border-b border-neutral-100"
            accessible
            accessibilityLabel={`Perfil de ${user.display_name || 'usuário sem nome'}`}
          >
            <View
              className="w-20 h-20 rounded-full bg-primary-100 items-center justify-center"
              accessibilityLabel={`Avatar com iniciais ${getInitials(user.display_name)}`}
            >
              <Text className="text-2xl font-extrabold text-primary-700" allowFontScaling>
                {getInitials(user.display_name)}
              </Text>
            </View>
            <Text className="text-xl font-semibold text-neutral-900 mt-3" allowFontScaling>
              {user.display_name || 'Sem nome'}
            </Text>
            <Text className="text-sm text-neutral-500 mt-1" allowFontScaling>
              {user.email}
            </Text>
          </View>
        )}

        {isLoading && (
          <View className="px-4 mt-4 gap-3">
            <Card className="flex-row items-center gap-3">
              <Skeleton width={40} height={40} radius={20} />
              <View className="flex-1 gap-2">
                <Skeleton width="50%" height={12} />
                <Skeleton width="70%" height={16} />
              </View>
            </Card>
            <Card className="flex-row items-center gap-3">
              <Skeleton width={40} height={40} radius={20} />
              <View className="flex-1 gap-2">
                <Skeleton width="50%" height={12} />
                <Skeleton width="70%" height={16} />
              </View>
            </Card>
            <Card className="flex-row items-center gap-3">
              <Skeleton width={40} height={40} radius={20} />
              <View className="flex-1 gap-2">
                <Skeleton width="50%" height={12} />
                <Skeleton width="70%" height={16} />
              </View>
            </Card>
          </View>
        )}

        {!isLoading && !isError && user && isGuest && (
          <>
            <View className="px-4 mt-4">
              <View
                className="bg-blue-50 rounded-xl p-4 flex-row gap-3"
                accessibilityLiveRegion="polite"
              >
                <Ionicons name="information-circle-outline" size={22} color="#1D4ED8" />
                <Text className="text-sm text-blue-700 flex-1 leading-5" allowFontScaling>
                  Seus dados ficam armazenados apenas neste dispositivo. Para acessar de
                  outro dispositivo, crie uma conta.
                </Text>
              </View>
            </View>

            <View className="px-4 mt-4 gap-3">
              <ProfileInfoCard
                icon="medical-outline"
                label="Tipo de diabetes"
                value={getDiabetesTypeLabel(user.diabetes_type)}
              />
              <ProfileInfoCard
                icon="chatbubble-ellipses-outline"
                label="Nível de linguagem"
                value={getLanguageLevelLabel(user.language_level)}
              />
              <ProfileInfoCard
                icon="calendar-outline"
                label="Membro desde"
                value={formatMemberSince(user.created_at)}
              />
            </View>

            <View className="px-4 mt-4 gap-3">
              <Button
                variant="secondary"
                full
                onPress={() => router.push(ROUTES.PROFILE_EDIT)}
                accessibilityLabel="Configurar preferências"
              >
                Configurar preferências
              </Button>
              <Button
                full
                onPress={() => router.push('/(auth)/upgrade')}
                accessibilityLabel="Criar conta"
              >
                Criar conta
              </Button>
              <Button
                variant="ghost"
                full
                onPress={() => router.push('/(auth)/login')}
                accessibilityLabel="Fazer login com conta existente"
              >
                Fazer login
              </Button>
            </View>
          </>
        )}

        {!isLoading && !isError && user && !isGuest && (
          <>
            <View className="px-4 mt-4 gap-3">
              <ProfileInfoCard
                icon="medical-outline"
                label="Tipo de diabetes"
                value={getDiabetesTypeLabel(user.diabetes_type)}
              />
              <ProfileInfoCard
                icon="chatbubble-ellipses-outline"
                label="Nível de linguagem"
                value={getLanguageLevelLabel(user.language_level)}
              />
              <ProfileInfoCard
                icon="calendar-outline"
                label="Membro desde"
                value={formatMemberSince(user.created_at)}
              />
            </View>

            <View className="px-4 mt-4">
              <Button
                variant="secondary"
                full
                onPress={() => router.push(ROUTES.PROFILE_EDIT)}
                accessibilityLabel="Editar perfil"
              >
                Editar perfil
              </Button>
            </View>

            <View className="px-4 mt-6">
              <Button
                variant="ghost-danger"
                full
                onPress={handleLogout}
                accessibilityLabel="Sair da conta"
                accessibilityHint="Solicita confirmação antes de encerrar a sessão"
              >
                Sair da conta
              </Button>
            </View>
          </>
        )}

        <View className="items-center mt-8">
          <Text className="text-xs text-neutral-400" allowFontScaling>
            nutrition-labels v1.4.0
          </Text>
        </View>
      </ScrollView>
    </View>
  );
}
