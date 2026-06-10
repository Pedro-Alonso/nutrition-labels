export function formatDate(iso: string): string {
  const d = new Date(iso);
  const now = new Date();
  const diff = now.getTime() - d.getTime();

  if (diff < 3_600_000) {
    const mins = Math.max(1, Math.floor(diff / 60_000));
    return `Há ${mins} min`;
  }
  if (diff < 86_400_000) {
    return `Há ${Math.floor(diff / 3_600_000)}h`;
  }
  if (diff < 172_800_000) {
    return 'Ontem';
  }
  return d.toLocaleDateString('pt-BR', { day: '2-digit', month: '2-digit' });
}

export function formatConfidence(value: number): string {
  return `${Math.round(value * 100)}%`;
}

export function getInitials(name: string | null | undefined): string {
  if (!name) return '?';
  const parts = name.trim().split(' ');
  if (parts.length > 1) return `${parts[0][0]}${parts[1][0]}`.toUpperCase();
  return parts[0].slice(0, 2).toUpperCase();
}

export function formatMemberSince(iso: string): string {
  const formatted = new Date(iso).toLocaleDateString('pt-BR', {
    month: 'long',
    year: 'numeric',
  });
  return formatted.charAt(0).toUpperCase() + formatted.slice(1);
}
