import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { router } from 'expo-router';
import { Pressable, RefreshControl, ScrollView, Text, View } from 'react-native';
import { ScanSummaryCard, ScanSummaryCardSkeleton } from '@/components/result/ScanSummaryCard';
import { EmptyState } from '@/components/ui/EmptyState';
import { ErrorMessage } from '@/components/ui/ErrorMessage';
import { SectionHeader } from '@/components/ui/SectionHeader';
import { ROUTES } from '@/constants/routes';
import { useMe } from '@/hooks/useMe';
import { useScans } from '@/hooks/useScans';

export default function HomeScreen() {
  const { data: user } = useMe();
  const { data, isLoading, isError, refetch, isRefetching } = useScans({ per_page: 3 });

  const firstName = user?.display_name?.trim().split(' ')[0] || 'visitante';

  return (
    <View className="flex-1 bg-neutral-50">
      <ScrollView
        contentContainerStyle={{ paddingBottom: 32 }}
        refreshControl={
          <RefreshControl refreshing={isRefetching} onRefresh={refetch} colors={['#10B981']} tintColor="#10B981" />
        }
      >
        <View
          className="bg-white px-4 pt-6 pb-4 border-b border-neutral-100"
          accessible
          accessibilityRole="header"
        >
          <Text className="text-2xl font-bold text-neutral-900" allowFontScaling>
            Olá, {firstName}!
          </Text>
          <Text className="text-sm text-neutral-500 mt-1" allowFontScaling>
            Pronto para verificar um produto?
          </Text>
        </View>

        <Pressable
          onPress={() => router.push(ROUTES.SCAN_BARCODE)}
          accessibilityRole="button"
          accessibilityLabel="Escanear produto"
          accessibilityHint="Abre o leitor de código de barras"
          className="mx-4 mt-4 active:opacity-90"
        >
          <LinearGradient
            colors={['#10B981', '#047857']}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
            style={{ borderRadius: 16 }}
            className="p-5 min-h-[56px] flex-row items-center justify-between"
          >
            <View className="flex-1 pr-3">
              <Text className="text-xl font-bold text-white" allowFontScaling>
                Escanear produto
              </Text>
              <Text className="text-sm text-white/80 mt-1" allowFontScaling>
                Aponte para o código de barras
              </Text>
            </View>
            <View className="h-[52px] w-[52px] items-center justify-center rounded-full bg-white/20">
              <Ionicons name="scan-outline" size={28} color="#FFFFFF" />
            </View>
          </LinearGradient>
        </Pressable>

        <SectionHeader>Análises recentes</SectionHeader>

        <View className="px-4 gap-2">
          {isLoading ? (
            <>
              <ScanSummaryCardSkeleton />
              <ScanSummaryCardSkeleton />
              <ScanSummaryCardSkeleton />
            </>
          ) : isError ? (
            <ErrorMessage
              message="Não foi possível carregar suas análises recentes."
              onRetry={refetch}
            />
          ) : data && data.items.length > 0 ? (
            data.items.map((item) => <ScanSummaryCard key={item.id} scan={item} />)
          ) : (
            <EmptyState
              icon="document-outline"
              title="Nenhuma análise ainda"
              subtitle="Escaneie um produto para começar"
            />
          )}
        </View>
      </ScrollView>
    </View>
  );
}
