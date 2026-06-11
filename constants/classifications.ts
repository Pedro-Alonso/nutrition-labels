export const CLASSE_LABELS: Record<string, string> = {
  acucar_simples: "Açúcar simples",
  polimero_glucidico: "Polímero glicídico",
  edulcorante_artificial: "Adoçante artificial",
  edulcorante_natural: "Adoçante natural",
  fibra: "Fibra alimentar",
  poliol: "Poliol",
  gordura_saturada: "Gordura saturada",
  corante: "Corante",
  conservante: "Conservante",
  emulsificante: "Emulsificante",
  aromatizante: "Aromatizante",
};

export function getClasseLabel(classe: string | null | undefined): string {
  if (!classe) return "—";
  return (
    CLASSE_LABELS[classe] ??
    classe.replace(/_/g, " ").replace(/\b\w/g, (l) => l.toUpperCase())
  );
}

export const FORMAT_LABELS: Record<string, string> = {
  table: "Tabela nutricional",
  text: "Texto livre",
  ingredient: "Lista de ingredientes",
};

export function getFormatLabel(format: string | null | undefined): string {
  if (!format) return "—";
  return (
    FORMAT_LABELS[format] ??
    format.replace(/_/g, " ").replace(/\b\w/g, (l) => l.toUpperCase())
  );
}

export const DIABETES_TYPE_LABELS: Record<string, string> = {
  type1: "Diabetes Tipo 1",
  type2: "Diabetes Tipo 2",
  dmg: "Diabetes Gestacional",
};

export function getDiabetesTypeLabel(type: string | null | undefined): string {
  if (!type) return "Não informado";
  return DIABETES_TYPE_LABELS[type] ?? "Não informado";
}

export const LANGUAGE_LEVEL_LABELS: Record<string, string> = {
  simples: "Linguagem simples",
  padrão: "Linguagem padrão",
  técnico: "Linguagem técnica",
};

export function getLanguageLevelLabel(level: string | null | undefined): string {
  if (!level) return "Não informado";
  return LANGUAGE_LEVEL_LABELS[level] ?? "Não informado";
}
