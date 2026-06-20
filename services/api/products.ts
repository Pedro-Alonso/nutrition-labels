import type {
  IngredientAnalysis,
  OcrPreviewRequest,
  OcrPreviewResponse,
  Product,
  ProductCreateRequest,
  ProductSearchParams,
  ProductSearchResponse,
  ProductSummaryResponse,
} from '@/types/api';
import { apiClient } from './client';

/**
 * Remove espaços em volta de strings antes de enviar ao backend. Aplica-se
 * apenas aos campos presentes no payload (PUT é um patch parcial); strings
 * vazias após o trim viram `null`, e linhas/itens vazios são descartados.
 */
function normalizeProductPayload(data: ProductCreateRequest): ProductCreateRequest {
  const normalized: ProductCreateRequest = { ...data };

  if ('name' in normalized) {
    const trimmed = normalized.name?.trim() ?? null;
    normalized.name = trimmed === '' ? null : trimmed;
  }

  if ('brand' in normalized) {
    const trimmed = normalized.brand?.trim() ?? null;
    normalized.brand = trimmed === '' ? null : trimmed;
  }

  if (normalized.nutritional_table) {
    const table = normalized.nutritional_table;
    const portion = table.portion_description?.trim() ?? null;
    const rows = table.rows
      .map((row) => ({
        nutrient: row.nutrient.trim(),
        values: row.values.map((v) => v.trim()),
      }))
      .filter((row) => row.nutrient !== '' || row.values.some((v) => v !== ''));
    const columns = table.columns.map((c) => c.trim());

    if (rows.length === 0 && columns.every((c) => c === '')) {
      normalized.nutritional_table = null;
    } else {
      normalized.nutritional_table = {
        ...table,
        portion_description: portion === '' ? null : portion,
        columns,
        rows,
      };
    }
  }

  if (normalized.ingredients) {
    normalized.ingredients = {
      items: normalized.ingredients.items.map((i) => i.trim()).filter((i) => i !== ''),
    };
  }

  return normalized;
}

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
    apiClient.post<Product>(`/products/${barcode}`, normalizeProductPayload(data)).then((r) => r.data),

  /**
   * `PUT /products/{barcode}` — requer Bearer.
   * Body `ProductCreateRequest` (patch: campos ausentes mantêm o valor atual).
   * Retorna `Product` atualizado.
   * Status: 200 ok · 401 token inválido · 404 produto não encontrado.
   */
  updateProduct: (barcode: string, data: ProductCreateRequest) =>
    apiClient.put<Product>(`/products/${barcode}`, normalizeProductPayload(data)).then((r) => r.data),

  /**
   * `POST /products/{barcode}/scan` — requer Bearer.
   * Registra a leitura no histórico do usuário (dedupe por barcode — reler sobe
   * a entrada ao topo) e retorna `Product` com `analysis.natural_language_summary`
   * já preenchido (gerado ou reaproveitado do cache).
   * Status: 200 ok · 401 token inválido · 404 produto não encontrado.
   */
  scanProduct: (barcode: string) =>
    apiClient.post<Product>(`/products/${barcode}/scan`).then((r) => r.data),

  /**
   * `GET /products/{barcode}/summary` — público (sem token, mas personaliza se autenticado).
   * Retorna `ProductSummaryResponse` com resumo em linguagem natural personalizado
   * pelo perfil do usuário autenticado (diabetes_type + language_level).
   * Status: 200 ok · 404 produto não encontrado.
   */
  getProductSummary: (barcode: string) =>
    apiClient
      .get<ProductSummaryResponse>(`/products/${barcode}/summary`)
      .then((r) => r.data),

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
   * `GET /products/search?q&page&per_page` — requer Bearer.
   * Busca fuzzy por nome/marca com detecção automática de barcode.
   * Retorna `ProductSearchResponse`: items, total, page, per_page.
   * Status: 200 ok · 401 token inválido.
   */
  searchProducts: (params: ProductSearchParams) =>
    apiClient
      .get<ProductSearchResponse>('/products/search', { params })
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
