import type {
  IngredientAnalysis,
  OcrPreviewRequest,
  OcrPreviewResponse,
  Product,
  ProductCreateRequest,
} from '@/types/api';
import { apiClient } from './client';

export const productsService = {
  getProduct: (barcode: string) =>
    apiClient.get<Product>(`/products/${barcode}`).then((r) => r.data),

  createProduct: (barcode: string, data: ProductCreateRequest) =>
    apiClient.post<Product>(`/products/${barcode}`, data).then((r) => r.data),

  updateProduct: (barcode: string, data: ProductCreateRequest) =>
    apiClient.put<Product>(`/products/${barcode}`, data).then((r) => r.data),

  getProductAnalysis: (barcode: string) =>
    apiClient
      .get<IngredientAnalysis>(`/products/${barcode}/analysis`)
      .then((r) => r.data),

  // Envia uma ou ambas as imagens (nutrição / ingredientes) para OCR e recebe
  // a tabela e a lista estruturadas, sem persistir nada no servidor.
  ocrPreview: (barcode: string, data: OcrPreviewRequest) => {
    const form = new FormData();
    if (data.image_nutrition != null) {
      form.append('image_nutrition', data.image_nutrition as unknown as Blob);
    }
    if (data.image_ingredients != null) {
      form.append('image_ingredients', data.image_ingredients as unknown as Blob);
    }

    return apiClient
      .post<OcrPreviewResponse>(`/products/${barcode}/ocr`, form, {
        headers: { 'Content-Type': 'multipart/form-data' },
      })
      .then((r) => r.data);
  },
};
