import { useMutation } from '@tanstack/react-query';
import { productsService } from '@/services/api/products';
import type { OcrPreviewRequest } from '@/types/api';

interface OcrPreviewVariables {
  barcode: string;
  images: OcrPreviewRequest;
}

export function useOcrPreview() {
  return useMutation({
    mutationFn: ({ barcode, images }: OcrPreviewVariables) =>
      productsService.ocrPreview(barcode, images),
  });
}
