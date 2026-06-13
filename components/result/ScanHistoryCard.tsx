import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import { Pressable, Text, View } from 'react-native';
import { RiskBadge } from '@/components/ui/RiskBadge';
import { Skeleton } from '@/components/ui/Skeleton';
import { getFormatLabel } from '@/constants/classifications';
import { RISK_LABELS } from '@/constants/risk';
import { ROUTES } from '@/constants/routes';
import { getRiskHex } from '@/utils/riskColors';
import { formatDate } from '@/utils/formatters';
import type { ScanSummary } from '@/types/api';
import type { RiskLevel } from '@/types/domain';

interface ScanHistoryCardProps {
  scan: ScanSummary;
}

export function ScanHistoryCard({ scan }: ScanHistoryCardProps) {
  const risk = (scan.risco_global ?? 'NENHUM') as RiskLevel;
  const date = formatDate(scan.created_at);
  const formatLabel = getFormatLabel(scan.detected_format);
  const name = scan.name ?? 'Produto desconhecido';

  return (
    <Pressable
      onPress={() => router.push(ROUTES.HISTORY_DETAIL(scan.id))}
      accessibilityRole="button"
      accessibilityLabel={`${name}, risco ${RISK_LABELS[risk]}, ${formatLabel}, ${date}`}
      accessibilityHint="Abre os detalhes desta análise"
      className="flex-row bg-white dark:bg-dark-card rounded-lg shadow-sm mb-2 overflow-hidden min-h-[44px]"
    >
      <View style={{ width: 4, backgroundColor: getRiskHex(risk) }} />
      <View className="flex-1 flex-row items-center px-3 py-3 gap-3">
        <View className="flex-1">
          <View className="flex-row items-center justify-between gap-2">
            <Text
              className="flex-1 text-base font-semibold text-neutral-900 dark:text-dark-text"
              allowFontScaling
              numberOfLines={1}
            >
              {name}
            </Text>
            <RiskBadge level={risk} size="sm" />
          </View>
          <View className="flex-row items-center justify-between mt-1.5">
            <Text className="text-xs text-neutral-400" allowFontScaling>
              {formatLabel}
            </Text>
            <Text className="text-xs text-neutral-400" allowFontScaling>
              {date}
            </Text>
          </View>
        </View>
        <Ionicons name="chevron-forward" size={20} color="#D1D5DB" />
      </View>
    </Pressable>
  );
}

export function ScanHistoryCardSkeleton() {
  return (
    <View className="flex-row bg-white dark:bg-dark-card rounded-lg shadow-sm mb-2 overflow-hidden">
      <View className="w-1 bg-neutral-200 dark:bg-dark-surface" />
      <View className="flex-1 px-3 py-3 gap-2">
        <View className="flex-row items-center justify-between gap-2">
          <Skeleton width="55%" height={16} />
          <Skeleton width={64} height={22} radius={9999} />
        </View>
        <View className="flex-row items-center justify-between">
          <Skeleton width="35%" height={11} />
          <Skeleton width="20%" height={11} />
        </View>
      </View>
    </View>
  );
}
