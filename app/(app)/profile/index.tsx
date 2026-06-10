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
  const { logout } = useAuth();

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

        {!isLoading && !isError && user && (
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
            nutrition-labels v1.0.0
          </Text>
        </View>
      </ScrollView>
    </View>
  );
}
