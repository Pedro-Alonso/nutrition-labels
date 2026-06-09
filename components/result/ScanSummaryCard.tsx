import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import { Text, View } from 'react-native';
import { Card } from '@/components/ui/Card';
import { RiskBadge } from '@/components/ui/RiskBadge';
import { Skeleton } from '@/components/ui/Skeleton';
import { ROUTES } from '@/constants/routes';
import { RISK_LABELS } from '@/constants/risk';
import type { ScanSummary } from '@/types/api';
import type { RiskLevel } from '@/types/domain';
import { formatDate } from '@/utils/formatters';

interface ScanSummaryCardProps {
  scan: ScanSummary;
}

export function ScanSummaryCard({ scan }: ScanSummaryCardProps) {
  const risk = (scan.risco_global ?? 'NENHUM') as RiskLevel;
  const date = formatDate(scan.created_at);

  return (
    <Card
      onPress={() => router.push(ROUTES.HISTORY_DETAIL(scan.id))}
      accessibilityLabel={`Produto desconhecido, risco ${RISK_LABELS[risk]}, ${date}`}
      className="mb-0 flex-row items-center gap-3"
    >
      <RiskBadge level={risk} size="sm" />
      <View className="flex-1">
        <Text className="text-base font-semibold text-neutral-900 dark:text-dark-text" allowFontScaling numberOfLines={1}>
          Produto desconhecido
        </Text>
        <Text className="text-xs text-neutral-400 mt-0.5" allowFontScaling>
          {date}
        </Text>
      </View>
      <Ionicons name="chevron-forward" size={20} color="#D1D5DB" />
    </Card>
  );
}

export function ScanSummaryCardSkeleton() {
  return (
    <Card className="mb-0 flex-row items-center gap-3">
      <Skeleton width={64} height={22} radius={9999} />
      <View className="flex-1 gap-2">
        <Skeleton width="75%" height={14} />
        <Skeleton width="45%" height={11} />
      </View>
    </Card>
  );
}
