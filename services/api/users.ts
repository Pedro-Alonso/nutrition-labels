import type {
  ScanDetailResponse,
  ScansParams,
  ScansResponse,
  UpdateProfileRequest,
  UserProfile,
} from '@/types/api';
import { apiClient } from './client';

export const usersService = {
  /**
   * `GET /users/me` — requer Bearer.
   * Retorna `UserProfile`: id, email, display_name, language_level,
   * diabetes_type, created_at.
   * Status: 200 ok · 401 token inválido · 404 usuário não encontrado.
   */
  getMe: () => apiClient.get<UserProfile>('/users/me').then((r) => r.data),

  /**
   * `PUT /users/me` — requer Bearer.
   * Body `UpdateProfileRequest` (patch): display_name?, language_level?,
   * diabetes_type? — campos ausentes mantêm o valor atual.
   * Retorna `UserProfile` atualizado.
   * Status: 200 ok · 401 token inválido · 404 usuário não encontrado.
   */
  updateMe: (data: UpdateProfileRequest) =>
    apiClient.put<UserProfile>('/users/me', data).then((r) => r.data),

  /**
   * `GET /users/me/scans?page&per_page` — requer Bearer.
   * Params: page (≥1, default 1) e per_page (1–100, default 20).
   * Retorna `ScansResponse`: items, total, page, per_page.
   * Status: 200 ok · 401 token inválido.
   */
  getScans: (params: ScansParams = {}) =>
    apiClient
      .get<ScansResponse>('/users/me/scans', { params })
      .then((r) => r.data),

  /**
   * `GET /users/me/scans/{scan_id}` — requer Bearer.
   * Retorna `ScanDetailResponse`: campos do resumo + result_json completo.
   * Status: 200 ok · 401 token inválido · 404 scan não encontrado.
   */
  getScanDetail: (scanId: string) =>
    apiClient.get<ScanDetailResponse>(`/users/me/scans/${scanId}`).then((r) => r.data),

  /**
   * `DELETE /users/me/scans/{scanId}` — requer Bearer.
   * Remove uma análise individual do histórico.
   * Status: 204 ok · 401 token inválido · 404 scan não encontrado.
   */
  deleteScan: (scanId: string) =>
    apiClient.delete(`/users/me/scans/${scanId}`),

  /**
   * `DELETE /users/me/scans` — requer Bearer.
   * Remove todas as análises do histórico do usuário.
   * Status: 204 ok · 401 token inválido.
   */
  deleteAllScans: () =>
    apiClient.delete('/users/me/scans'),

  deleteMe: () => apiClient.delete('/users/me').then((r) => r.data),
};
