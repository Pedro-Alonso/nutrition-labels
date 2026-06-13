import type { ImageUpload } from '@/types/api';

/** Monta o objeto de upload (multipart) a partir da URI local de uma foto. */
export function toUpload(uri: string): ImageUpload {
  const name = uri.split('/').pop() ?? 'rotulo.jpg';
  const extension = name.split('.').pop()?.toLowerCase();
  const type = extension === 'png' ? 'image/png' : 'image/jpeg';
  return { uri, name, type };
}
