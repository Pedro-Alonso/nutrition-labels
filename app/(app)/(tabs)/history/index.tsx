import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import { useMemo } from 'react';
import {
  ActivityIndicator,
  Alert,
  FlatList,
  Pressable,
  RefreshControl,
  Text,
  View,
} from 'react-native';
import { ScanHistoryCardSkeleton } from '@/components/result/ScanHistoryCard';
import { SwipeableHistoryCard } from '@/components/result/SwipeableHistoryCard';
import { EmptyState } from '@/components/ui/EmptyState';
import { ErrorMessage } from '@/components/ui/ErrorMessage';
import { ROUTES } from '@/constants/routes';
import { useClearHistory, useDeleteScan } from '@/hooks/useHistoryManagement';
import { useScanHistory } from '@/hooks/useScans';
import type { ScanSummary } from '@/types/api';

export default function HistoryScreen() {
  const {
    data,
    isLoading,
    isError,
    refetch,
    isRefetching,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
  } = useScanHistory();

  const deleteScan = useDeleteScan();
  const clearHistory = useClearHistory();

  const items = useMemo(() => data?.pages.flatMap((page) => page.items) ?? [], [data]);
  const total = data?.pages[0]?.total ?? 0;

  const handleDeleteScan = (scanId: string) => {
    deleteScan.mutate(scanId);
  };

  const handleClearHistory = () => {
    Alert.alert(
      'Limpar histórico',
      'Todas as suas análises serão removidas. Esta ação não pode ser desfeita.',
      [
        { text: 'Cancelar', style: 'cancel' },
        {
          text: 'Limpar',
          style: 'destructive',
          onPress: () => clearHistory.mutate(),
        },
      ],
    );
  };

  const showMenuOptions = () => {
    Alert.alert(
      'Opções',
      undefined,
      [
        {
          text: 'Limpar histórico',
          style: 'destructive',
          onPress: handleClearHistory,
        },
        { text: 'Cancelar', style: 'cancel' },
      ],
    );
  };

  if (isLoading) {
    return (
      <View className="flex-1 bg-neutral-50" accessibilityLiveRegion="polite">
        <View className="px-4 pt-4 gap-2">
          <ScanHistoryCardSkeleton />
          <ScanHistoryCardSkeleton />
          <ScanHistoryCardSkeleton />
          <ScanHistoryCardSkeleton />
          <ScanHistoryCardSkeleton />
        </View>
      </View>
    );
  }

  if (isError) {
    return (
      <View className="flex-1 bg-neutral-50 px-4 pt-4">
        <ErrorMessage message="Não foi possível carregar seu histórico." onRetry={refetch} />
      </View>
    );
  }

  if (items.length === 0) {
    return (
      <View className="flex-1 bg-neutral-50">
        <EmptyState
          icon="time-outline"
          title="Nenhuma análise no histórico"
          subtitle="Escaneie um produto para começar"
          actionLabel="Escanear agora"
          onAction={() => router.push(ROUTES.SCAN_BARCODE)}
        />
      </View>
    );
  }

  return (
    <View className="flex-1 bg-neutral-50">
      <View
        className="bg-white px-4 py-3 border-b border-neutral-100 flex-row items-center justify-between"
        accessible
        accessibilityRole="header"
      >
        <Text className="text-sm text-neutral-500" allowFontScaling>
          {total} {total === 1 ? 'análise' : 'análises'} no histórico
        </Text>
        <Pressable
          onPress={showMenuOptions}
          hitSlop={8}
          accessibilityLabel="Opções do histórico"
          accessibilityRole="button"
          style={{ minWidth: 44, minHeight: 44, justifyContent: 'center', alignItems: 'center' }}
        >
          <Ionicons name="ellipsis-horizontal" size={20} color="#6B7280" />
        </Pressable>
      </View>

      <FlatList<ScanSummary>
        data={items}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <SwipeableHistoryCard scan={item} onDelete={handleDeleteScan} />
        )}
        contentContainerStyle={{ padding: 16, paddingBottom: 32 }}
        refreshControl={<RefreshControl refreshing={isRefetching} onRefresh={refetch} />}
        onEndReached={() => {
          if (hasNextPage && !isFetchingNextPage) fetchNextPage();
        }}
        onEndReachedThreshold={0.5}
        ListFooterComponent={
          isFetchingNextPage ? (
            <View className="py-4" accessibilityLiveRegion="polite">
              <ActivityIndicator color="#10B981" />
            </View>
          ) : null
        }
      />
    </View>
  );
}
