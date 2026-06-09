import { RISK_COLORS } from '@/constants/risk';
import type { RiskLevel } from '@/types/domain';

const TAILWIND_BG: Record<RiskLevel, string> = {
  ALTO: 'bg-risk-alto',
  'MODERADO-ALTO': 'bg-risk-moderado-alto',
  MODERADO: 'bg-risk-moderado',
  BAIXO: 'bg-risk-baixo',
  SEGURO: 'bg-risk-seguro',
  BENEFICO: 'bg-risk-benefico',
  INFORMATIVO: 'bg-risk-informativo',
  NENHUM: 'bg-risk-nenhum',
};

const TAILWIND_BORDER: Record<RiskLevel, string> = {
  ALTO: 'border-risk-alto',
  'MODERADO-ALTO': 'border-risk-moderado-alto',
  MODERADO: 'border-risk-moderado',
  BAIXO: 'border-risk-baixo',
  SEGURO: 'border-risk-seguro',
  BENEFICO: 'border-risk-benefico',
  INFORMATIVO: 'border-risk-informativo',
  NENHUM: 'border-risk-nenhum',
};

export function getRiskBgClass(level: RiskLevel): string {
  return TAILWIND_BG[level] ?? TAILWIND_BG.NENHUM;
}

export function getRiskBorderClass(level: RiskLevel): string {
  return TAILWIND_BORDER[level] ?? TAILWIND_BORDER.NENHUM;
}

export function getRiskHex(level: RiskLevel): string {
  return RISK_COLORS[level] ?? RISK_COLORS.NENHUM;
}
