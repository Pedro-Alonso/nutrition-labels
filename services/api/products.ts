import type { AnalyzeRequest, AnalyzeResponse, CreateProductRequest, IngredientAnalysis, Product } from '@/types/api';
import { apiClient } from './client';

export const productsService = {
  getProduct: (barcode: string) =>
    apiClient.get<Product>(`/products/${barcode}`).then((r) => r.data),

  createProduct: (barcode: string, data: CreateProductRequest) =>
    apiClient.post<Product>(`/products/${barcode}`, data).then((r) => r.data),

  updateProduct: (barcode: string, data: CreateProductRequest) =>
    apiClient.put<Product>(`/products/${barcode}`, data).then((r) => r.data),

  getProductAnalysis: (barcode: string) =>
    apiClient
      .get<IngredientAnalysis>(`/products/${barcode}/analysis`)
      .then((r) => r.data),

  ocrPreview: (barcode: string, data: AnalyzeRequest) => {
    const form = new FormData();
    form.append('file', data.file as unknown as Blob);
    if (data.category_override != null) {
      form.append('category_override', data.category_override);
    }

    return apiClient
      .post<AnalyzeResponse>(`/products/${barcode}/ocr`, form, {
        headers: { 'Content-Type': 'multipart/form-data' },
      })
      .then((r) => r.data);
  },
};
