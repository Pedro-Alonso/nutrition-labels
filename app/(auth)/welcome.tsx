import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { router } from 'expo-router';
import { useState } from 'react';
import { Alert, Pressable, Text, View } from 'react-native';
import { Button } from '@/components/ui/Button';
import { ROUTES } from '@/constants/routes';
import { useAuth } from '@/hooks/useAuth';

const FEATURES = [
  { icon: 'barcode-outline' as const, label: 'Escaneie o código de barras' },
  { icon: 'flask-outline' as const, label: 'Análise clínica personalizada' },
  { icon: 'shield-checkmark-outline' as const, label: 'Alertas de risco para diabéticos' },
];

export default function WelcomeScreen() {
  const { continueAsGuest } = useAuth();
  const [guestLoading, setGuestLoading] = useState(false);

  const handleContinueAsGuest = async () => {
    setGuestLoading(true);
    try {
      await continueAsGuest();
      router.replace(ROUTES.HOME);
    } catch {
      Alert.alert('Erro', 'Não foi possível continuar como visitante.');
    } finally {
      setGuestLoading(false);
    }
  };

  return (
    <LinearGradient
      colors={['#059669', '#047857']}
      className="flex-1"
    >
      <View className="flex-1 px-7 pt-16 pb-8 justify-between">
        <View className="flex-1 items-center justify-center gap-3">
          <View
            className="w-[88px] h-[88px] rounded-[28px] bg-white/20 items-center justify-center"
            accessible
            accessibilityRole="image"
            accessibilityLabel="Logo do NutriLabel"
          >
            <Ionicons name="leaf" size={44} color="#FFFFFF" />
          </View>

          <Text
            className="text-3xl font-extrabold text-white tracking-tight mt-1"
            accessibilityRole="header"
            allowFontScaling
          >
            NutriLabel
          </Text>

          <Text className="text-base text-white/80 text-center max-w-[240px] leading-6" allowFontScaling>
            Avaliação nutricional para diabéticos
          </Text>

          <View className="mt-7 gap-2.5 w-full max-w-[280px]">
            {FEATURES.map((feature) => (
              <View
                key={feature.label}
                className="flex-row items-center gap-2.5 bg-white/10 rounded-xl px-3.5 py-2.5"
                accessible
                accessibilityLabel={feature.label}
              >
                <Ionicons name={feature.icon} size={20} color="#FFFFFF" />
                <Text className="text-sm text-white/90 font-medium flex-1" allowFontScaling>
                  {feature.label}
                </Text>
              </View>
            ))}
          </View>
        </View>

        <View className="gap-3">
          <Button
            variant="secondary"
            full
            onPress={() => router.push('/(auth)/register')}
            accessibilityLabel="Criar conta"
            disabled={guestLoading}
          >
            Criar conta
          </Button>
          <Pressable
            onPress={() => router.push('/(auth)/login')}
            accessibilityRole="button"
            accessibilityLabel="Já tenho conta"
            disabled={guestLoading}
            className="min-h-[44px] items-center justify-center rounded-xl px-6 active:bg-white/10"
          >
            <Text className="text-white font-semibold text-lg" allowFontScaling>
              Já tenho conta
            </Text>
          </Pressable>

          <View className="flex-row items-center gap-3 my-1">
            <View className="flex-1 h-px bg-white/20" />
            <Text className="text-xs text-white/50 font-medium" allowFontScaling>
              ou
            </Text>
            <View className="flex-1 h-px bg-white/20" />
          </View>

          <Pressable
            onPress={handleContinueAsGuest}
            disabled={guestLoading}
            accessibilityRole="button"
            accessibilityLabel="Continuar sem criar conta"
            accessibilityHint="Entra no app sem email e senha. Dados ficam apenas neste dispositivo."
            className="min-h-[44px] items-center justify-center px-6 active:bg-white/10"
          >
            <Text className="text-white/60 font-medium text-sm" allowFontScaling>
              {guestLoading ? 'Entrando…' : 'Continuar como visitante'}
            </Text>
          </Pressable>
        </View>
      </View>
    </LinearGradient>
  );
}
