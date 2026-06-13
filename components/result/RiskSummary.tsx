import { Ionicons } from '@expo/vector-icons';
import { Text, View } from 'react-native';
import { RiskBadge } from '@/components/ui/RiskBadge';
import { RISK_LABELS } from '@/constants/risk';
import { getRiskBgClass } from '@/utils/riskColors';
import type { RiskLevel } from '@/types/domain';

interface RiskSummaryProps {
  productName: string | null;
  brand?: string | null;
  barcode: string | null;
  riskLevel: RiskLevel;
  passed?: boolean | null;
}

export function RiskSummary({ productName, brand, barcode, riskLevel, passed }: RiskSummaryProps) {
  const name = productName ?? 'Produto desconhecido';
  const label = brand ? `Produto analisado: ${name}, marca ${brand}. Risco global: ${RISK_LABELS[riskLevel]}` : `Produto analisado: ${name}. Risco global: ${RISK_LABELS[riskLevel]}`;

  return (
    <View className={`${getRiskBgClass(riskLevel)} px-4 pt-5 pb-6`}>
      <View accessible accessibilityLabel={label}>
        <Text className="text-xs font-semibold uppercase tracking-wide text-white/70" allowFontScaling>
          Produto analisado
        </Text>
        <Text className="text-xl font-bold text-white mt-1" allowFontScaling numberOfLines={2}>
          {name}
        </Text>
        {brand && (
          <Text className="text-sm text-white/80 mt-0.5" allowFontScaling numberOfLines={1}>
            {brand}
          </Text>
        )}
        {barcode && (
          <Text className="text-xs text-white/60 mt-1" allowFontScaling>
            {barcode}
          </Text>
        )}
        <View className="flex-row items-center gap-2.5 mt-3.5">
          <RiskBadge level={riskLevel} size="lg" inverted />
          <Text className="text-sm font-medium text-white/85" allowFontScaling>
            Risco global
          </Text>
        </View>
      </View>

      {passed === false && (
        <View
          className="flex-row items-center gap-2 mt-3.5 bg-amber-400/25 rounded-lg px-3 py-2.5"
          accessible
          accessibilityLabel="Leitura de baixa qualidade — resultado pode ser impreciso"
        >
          <Ionicons name="alert-circle-outline" size={18} color="#FFFFFF" />
          <Text className="flex-1 text-sm text-white/90" allowFontScaling>
            Leitura de baixa qualidade — resultado pode ser impreciso
          </Text>
        </View>
      )}
    </View>
  );
}
