// Tradução das classes de ingrediente (API → PT-BR) — fonte: .claude/rules/api-integration.md
export const CLASSE_LABELS: Record<string, string> = {
  acucar_simples: 'Açúcar simples',
  polimero_glucidico: 'Polímero glicídico',
  edulcorante_artificial: 'Adoçante artificial',
  edulcorante_natural: 'Adoçante natural',
  fibra: 'Fibra alimentar',
  poliol: 'Poliol',
  gordura_saturada: 'Gordura saturada',
  corante: 'Corante',
  conservante: 'Conservante',
  emulsificante: 'Emulsificante',
  aromatizante: 'Aromatizante',
};

export function getClasseLabel(classe: string | null | undefined): string {
  if (!classe) return '—';
  return CLASSE_LABELS[classe] ?? classe.replace(/_/g, ' ').replace(/\b\w/g, (l) => l.toUpperCase());
}
