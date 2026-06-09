import type { RiskLevel } from '@/types/domain';
import { colors } from './colors';

export const RISK_ORDER: RiskLevel[] = [
  'ALTO',
  'MODERADO-ALTO',
  'MODERADO',
  'BAIXO',
  'SEGURO',
  'BENEFICO',
  'INFORMATIVO',
  'NENHUM',
];

export const RISK_LABELS: Record<RiskLevel, string> = {
  ALTO: 'Alto Risco',
  'MODERADO-ALTO': 'Moderado-Alto',
  MODERADO: 'Moderado',
  BAIXO: 'Baixo',
  SEGURO: 'Seguro',
  BENEFICO: 'Benéfico',
  INFORMATIVO: 'Informativo',
  NENHUM: 'Não identificado',
};

export const RISK_COLORS: Record<RiskLevel, string> = {
  ALTO: colors.risk.alto,
  'MODERADO-ALTO': colors.risk['moderado-alto'],
  MODERADO: colors.risk.moderado,
  BAIXO: colors.risk.baixo,
  SEGURO: colors.risk.seguro,
  BENEFICO: colors.risk.benefico,
  INFORMATIVO: colors.risk.informativo,
  NENHUM: colors.risk.nenhum,
};
