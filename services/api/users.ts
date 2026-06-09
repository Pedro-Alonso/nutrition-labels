import type { ScansParams, ScansResponse, UpdateProfileRequest, UserProfile } from '@/types/api';
import { apiClient } from './client';

export const usersService = {
  getMe: () => apiClient.get<UserProfile>('/users/me').then((r) => r.data),

  updateMe: (data: UpdateProfileRequest) =>
    apiClient.put<UserProfile>('/users/me', data).then((r) => r.data),

  getScans: (params: ScansParams = {}) =>
    apiClient
      .get<ScansResponse>('/users/me/scans', { params })
      .then((r) => r.data),
};
