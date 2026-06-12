import type {
  IngredientAnalysis,
  OcrPreviewRequest,
  OcrPreviewResponse,
  Product,
  ProductCreateRequest,
} from '@/types/api';
import { apiClient } from './client';

export const productsService = {
  /**
   * `GET /products/{barcode}` — público (sem token).
   * Retorna `Product`: barcode, name?, brand?, nutritional_table?, ingredients?,
   * analysis?, created_at, updated_at.
   * Status: 200 produto existe · 404 não cadastrado (segue para o fluxo de OCR).
   */
  getProduct: (barcode: string) =>
    apiClient.get<Product>(`/products/${barcode}`).then((r) => r.data),

  /**
   * `POST /products/{barcode}` — requer Bearer.
   * Body `ProductCreateRequest`. Retorna `Product` criado.
   * Status: 201 criado · 401 token inválido · 409 barcode já existe (usar PUT).
   */
  createProduct: (barcode: string, data: ProductCreateRequest) =>
    apiClient.post<Product>(`/products/${barcode}`, data).then((r) => r.data),

  /**
   * `PUT /products/{barcode}` — requer Bearer.
   * Body `ProductCreateRequest` (patch: campos ausentes mantêm o valor atual).
   * Retorna `Product` atualizado.
   * Status: 200 ok · 401 token inválido · 404 produto não encontrado.
   */
  updateProduct: (barcode: string, data: ProductCreateRequest) =>
    apiClient.put<Product>(`/products/${barcode}`, data).then((r) => r.data),

  /**
   * `GET /products/{barcode}/analysis` — público (sem token).
   * Retorna `IngredientAnalysis` (análise clínica DM dos ingredientes).
   * Status: 200 ok · 404 produto inexistente ou sem lista de ingredientes ·
   * 503 analisador indisponível (ontologia ausente).
   */
  getProductAnalysis: (barcode: string) =>
    apiClient
      .get<IngredientAnalysis>(`/products/${barcode}/analysis`)
      .then((r) => r.data),

  /**
   * `POST /products/{barcode}/ocr` — requer Bearer; `multipart/form-data`.
   * Envia `image_nutrition?` e/ou `image_ingredients?` (ao menos uma) para OCR e
   * recebe `OcrPreviewResponse` (barcode, nutritional_table?, ingredients?).
   * Não persiste nada no servidor.
   * Status: 200 ok · 400 ilegível/vazia/formato não suportado · 413 > 10MB ·
   * 422 nenhuma imagem enviada · 401 token inválido.
   */
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
