import type {
  LoginRequest,
  LoginResponse,
  LogoutResponse,
  RefreshRequest,
  RefreshResponse,
  RegisterRequest,
  RegisterResponse,
} from '@/types/api';
import { apiClient } from './client';

export const authService = {
  register: (data: RegisterRequest) =>
    apiClient.post<RegisterResponse>('/auth/register', data).then((r) => r.data),

  login: (data: LoginRequest) =>
    apiClient.post<LoginResponse>('/auth/login', data).then((r) => r.data),

  refresh: (data: RefreshRequest) =>
    apiClient.post<RefreshResponse>('/auth/refresh', data).then((r) => r.data),

  logout: () =>
    apiClient.post<LogoutResponse>('/auth/logout').then((r) => r.data),
};
