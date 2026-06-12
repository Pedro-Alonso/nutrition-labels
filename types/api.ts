import type { DiabetesType, LanguageLevel } from './domain';

// ─── Auth ────────────────────────────────────────────────────────────────────

export interface RegisterRequest {
  email: string;
  password: string;
  display_name?: string;
  diabetes_type: DiabetesType;
  language_level: LanguageLevel;
}

export interface RegisterResponse {
  id: string;
  email: string;
  display_name: string | null;
  created_at: string;
}

export interface LoginRequest {
  email: string;
  password: string;
}

export interface LoginResponse {
  access_token: string;
  refresh_token: string;
  token_type: 'bearer';
}

export interface RefreshRequest {
  refresh_token: string;
}

export interface RefreshResponse {
  access_token: string;
  token_type: 'bearer';
}

export interface LogoutResponse {
  message: string;
}

// ─── Users ────────────────────────────────────────────────────────────────────

export interface UserProfile {
  id: string;
  email: string;
  display_name: string | null;
  created_at: string;
  diabetes_type: string | null;
  language_level: string | null;
}

export interface UpdateProfileRequest {
  display_name?: string | null;
  diabetes_type?: DiabetesType;
  language_level?: LanguageLevel;
}

export interface ScanSummary {
  id: string;
  created_at: string;
  detected_format: string | null;
  passed: boolean;
  winning_preset: string | null;
  risco_global: string | null;
}

export interface ScansResponse {
  items: ScanSummary[];
  total: number;
  page: number;
  per_page: number;
}

export interface ScansParams {
  page?: number;
  per_page?: number;
}

export interface ScanDetailResponse {
  id: string;
  created_at: string;
  detected_format: string | null;
  passed: boolean;
  winning_preset: string | null;
  risco_global: string | null;
  result_json: AnalyzeResponse;
}

// ─── Analysis ────────────────────────────────────────────────────────────────

export interface IngredienteIdentificado {
  nome_lido: string;
  classe: string;
  risco: string;
  alerta: string;
  indice_glicemico: number | string | null;
  nota_clinica: string | null;
}

export interface IngredientAnalysis {
  risco_global: string;
  ingredientes_identificados: IngredienteIdentificado[];
  nao_identificados: string[];
  high_risk_ingredients: string[];
  safe_sweeteners: string[];
  natural_language_summary?: string | null;
}

export interface OcrAttempt {
  attempt_index: number;
  preset: string;
  passed: boolean;
  score: number;
  mean_confidence: number;
  text_length: number;
  keyword_hits: number;
}

export interface DetectedFormatDetail {
  category: string;
  score: number;
  grid_density: number;
  reasoning: string;
}

export interface AnalyzeResponse {
  scan_id: string | null;
  detected_format: DetectedFormatDetail;
  winning_preset: string | null;
  winning_attempt_index: number | null;
  passed: boolean;
  final_ocr_text: string;
  final_postprocessed_text: string;
  attempts: OcrAttempt[];
  ingredient_analysis: IngredientAnalysis | null;
  llm_summary?: string | null;
  image_hash: string;
}

// ─── Products ────────────────────────────────────────────────────────────────

export interface NutritionalRowData {
  nutrient: string;
  values: string[];
}

export interface NutritionalTableData {
  portion_description?: string | null;
  columns: string[];
  rows: NutritionalRowData[];
}

export interface IngredientsData {
  items: string[];
}

export interface ImageUpload {
  uri: string;
  name: string;
  type: string;
}

export interface OcrPreviewRequest {
  image_nutrition?: ImageUpload | null;
  image_ingredients?: ImageUpload | null;
}

export interface OcrPreviewResponse {
  barcode: string;
  nutritional_table: NutritionalTableData | null;
  ingredients: IngredientsData | null;
}

export interface Product {
  barcode: string;
  name: string | null;
  brand: string | null;
  nutritional_table?: NutritionalTableData | null;
  ingredients?: IngredientsData | null;
  analysis: IngredientAnalysis | null;
  created_at: string;
  updated_at: string;
}

export interface ProductCreateRequest {
  name?: string | null;
  brand?: string | null;
  nutritional_table?: NutritionalTableData | null;
  ingredients?: IngredientsData | null;
}

// ─── Presets ─────────────────────────────────────────────────────────────────

export interface Preset {
  name: string;
  description: string;
  kind: string;
  priority: number;
}

export interface PresetsResponse {
  table: Preset[];
  text: Preset[];
  ingredients: Preset[];
}

// ─── Health ──────────────────────────────────────────────────────────────────

export interface HealthResponse {
  status: 'ok';
  version: string;
  dependencies: {
    database: string;
    tesseract: string;
    gcv_configured: boolean;
  };
}

// ─── Error ───────────────────────────────────────────────────────────────────

export interface ApiError {
  detail: string | Array<{ loc: string[]; msg: string; type: string }>;
}
