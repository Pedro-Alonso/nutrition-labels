export type RiskLevel =
  | 'ALTO'
  | 'MODERADO-ALTO'
  | 'MODERADO'
  | 'BAIXO'
  | 'SEGURO'
  | 'BENEFICO'
  | 'INFORMATIVO'
  | 'NENHUM';

export type DiabetesType = 'type1' | 'type2' | 'dmg';

export type LanguageLevel = 'simples' | 'padrão' | 'técnico';

export type DetectedFormat = 'table' | 'text' | 'ingredient';

// Origem dos dados de revisão: banco (barcode 200), OCR (barcode 404) ou manual.
export type ScanSource = 'db' | 'ocr' | 'manual';
