import { Ionicons } from '@expo/vector-icons';
import { Pressable, Text, View } from 'react-native';
import { Skeleton } from '@/components/ui/Skeleton';
import type { ProductSearchItem } from '@/types/api';

interface ProductSearchCardProps {
  product: ProductSearchItem;
  onPress: () => void;
}

export function ProductSearchCard({ product, onPress }: ProductSearchCardProps) {
  const name = product.name ?? 'Produto desconhecido';
  const label = product.brand
    ? `${name}, marca ${product.brand}`
    : name;

  return (
    <Pressable
      onPress={onPress}
      accessibilityRole="button"
      accessibilityLabel={label}
      className="flex-row items-center bg-white dark:bg-dark-card rounded-lg shadow-sm mb-2 px-3 py-3 min-h-[44px]"
    >
      <View className="flex-1 mr-3">
        <Text
          className="text-base font-semibold text-neutral-900 dark:text-dark-text"
          allowFontScaling
          numberOfLines={1}
        >
          {name}
        </Text>
        {product.brand && (
          <Text
            className="text-sm text-neutral-500 dark:text-dark-subtext mt-0.5"
            allowFontScaling
            numberOfLines={1}
          >
            {product.brand}
          </Text>
        )}
      </View>
      <Ionicons name="chevron-forward" size={20} color="#D1D5DB" />
    </Pressable>
  );
}

export function ProductSearchCardSkeleton() {
  return (
    <View className="flex-row items-center bg-white dark:bg-dark-card rounded-lg shadow-sm mb-2 px-3 py-3">
      <View className="flex-1 mr-3 gap-1.5">
        <Skeleton width="65%" height={16} />
        <Skeleton width="40%" height={14} />
      </View>
    </View>
  );
}
