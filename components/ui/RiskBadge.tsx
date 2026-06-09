import { Text, View } from 'react-native';
import { RISK_LABELS } from '@/constants/risk';
import { getRiskHex } from '@/utils/riskColors';
import type { RiskLevel } from '@/types/domain';

type Size = 'sm' | 'md' | 'lg';

interface RiskBadgeProps {
  level: RiskLevel;
  size?: Size;
}

const sizeClasses: Record<Size, { container: string; text: string }> = {
  sm: { container: 'px-2 py-0.5 rounded-full', text: 'text-xs font-bold uppercase tracking-wide' },
  md: { container: 'px-3 py-1 rounded-full', text: 'text-sm font-bold uppercase tracking-wide' },
  lg: { container: 'px-4 py-2 rounded-full', text: 'text-base font-bold uppercase tracking-wide' },
};

export function RiskBadge({ level, size = 'md' }: RiskBadgeProps) {
  const label = RISK_LABELS[level];
  const bgColor = getRiskHex(level);
  const { container, text } = sizeClasses[size];

  return (
    <View
      style={{ backgroundColor: bgColor }}
      className={container}
      accessible
      accessibilityLabel={`Risco ${label}`}
    >
      <Text className={`${text} text-white`} allowFontScaling>
        {label}
      </Text>
    </View>
  );
}
