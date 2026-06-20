import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import { useMemo, useRef, useState } from 'react';
import {
  ActivityIndicator,
  FlatList,
  Pressable,
  Text,
  TextInput,
  View,
} from 'react-native';
import {
  ProductSearchCard,
  ProductSearchCardSkeleton,
} from '@/components/result/ProductSearchCard';
import { EmptyState } from '@/components/ui/EmptyState';
import { ErrorMessage } from '@/components/ui/ErrorMessage';
import { useDebounce } from '@/hooks/useDebounce';
import { useProductSearch } from '@/hooks/useProductSearch';
import { useScanProduct } from '@/hooks/useScanProduct';
import { ROUTES } from '@/constants/routes';
import type { ProductSearchItem } from '@/types/api';

export default function SearchScreen() {
  const [searchText, setSearchText] = useState('');
  const debouncedQuery = useDebounce(searchText, 300);
  const inputRef = useRef<TextInput>(null);

  const {
    data,
    isLoading,
    isError,
    refetch,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
  } = useProductSearch(debouncedQuery);

  const scanProduct = useScanProduct();

  const items = useMemo(
    () => data?.pages.flatMap((page) => page.items) ?? [],
    [data],
  );

  const isIdle = debouncedQuery.length < 2;
  const showLoading = isLoading && !isIdle;
  const showEmpty = !isLoading && !isError && !isIdle && items.length === 0;
  const showResults = !isIdle && items.length > 0;

  const handleProductPress = (product: ProductSearchItem) => {
    scanProduct.mutate(product.barcode, {
      onSuccess: (scannedProduct) => {
        router.push({
          pathname: ROUTES.SCAN_RESULT,
          params: {
            barcode: scannedProduct.barcode,
            product: JSON.stringify(scannedProduct),
          },
        });
      },
    });
  };

  return (
    <View className="flex-1 bg-neutral-50 dark:bg-dark-page">
      {/* Search bar */}
      <View className="bg-white dark:bg-dark-card px-4 pt-3 pb-3 border-b border-neutral-100 dark:border-dark-surface">
        <View className="flex-row items-center bg-neutral-100 dark:bg-dark-surface rounded-lg px-3 min-h-[44px]">
          <Ionicons name="search-outline" size={20} color="#9CA3AF" />
          <TextInput
            ref={inputRef}
            value={searchText}
            onChangeText={setSearchText}
            placeholder="Buscar por nome, marca ou código de barras"
            placeholderTextColor="#9CA3AF"
            autoCapitalize="none"
            autoCorrect={false}
            returnKeyType="search"
            className="flex-1 text-base text-neutral-900 dark:text-dark-text ml-2 py-2"
            allowFontScaling
            accessibilityLabel="Campo de busca de produtos"
          />
          {searchText.length > 0 && (
            <Pressable
              onPress={() => {
                setSearchText('');
                inputRef.current?.focus();
              }}
              hitSlop={8}
              accessibilityLabel="Limpar busca"
              accessibilityRole="button"
            >
              <Ionicons name="close-circle" size={20} color="#9CA3AF" />
            </Pressable>
          )}
        </View>
      </View>

      {/* Loading from scan mutation */}
      {scanProduct.isPending && (
        <View className="absolute inset-0 z-10 items-center justify-center bg-white/80 dark:bg-dark-page/80">
          <ActivityIndicator size="large" color="#10B981" />
          <Text
            className="text-sm text-neutral-500 mt-3"
            allowFontScaling
            accessibilityLiveRegion="polite"
          >
            Buscando análise do produto…
          </Text>
        </View>
      )}

      {/* Idle state */}
      {isIdle && (
        <View className="flex-1 items-center justify-center px-8">
          <Ionicons
            name="search-outline"
            size={56}
            color="#9CA3AF"
            style={{ marginBottom: 16, opacity: 0.7 }}
          />
          <Text
            className="text-base text-neutral-400 text-center"
            allowFontScaling
          >
            Digite ao menos 2 caracteres para pesquisar
          </Text>
        </View>
      )}

      {/* Loading skeleton */}
      {showLoading && (
        <View
          className="px-4 pt-4 gap-2"
          accessibilityLiveRegion="polite"
        >
          <ProductSearchCardSkeleton />
          <ProductSearchCardSkeleton />
          <ProductSearchCardSkeleton />
          <ProductSearchCardSkeleton />
          <ProductSearchCardSkeleton />
        </View>
      )}

      {/* Error */}
      {isError && !isIdle && (
        <View className="flex-1 px-4 pt-4">
          <ErrorMessage
            message="Não foi possível buscar produtos."
            onRetry={refetch}
          />
        </View>
      )}

      {/* Empty results */}
      {showEmpty && (
        <EmptyState
          icon="search-outline"
          title="Nenhum produto encontrado"
          subtitle="Tente outra busca ou escaneie o código de barras"
        />
      )}

      {/* Results list */}
      {showResults && (
        <FlatList<ProductSearchItem>
          data={items}
          keyExtractor={(item) => item.barcode}
          renderItem={({ item }) => (
            <ProductSearchCard
              product={item}
              onPress={() => handleProductPress(item)}
            />
          )}
          contentContainerStyle={{ padding: 16, paddingBottom: 32 }}
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
          keyboardShouldPersistTaps="handled"
        />
      )}
    </View>
  );
}
