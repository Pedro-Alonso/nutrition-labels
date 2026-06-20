import * as Crypto from 'expo-crypto';
import type {
  LoginRequest,
  LoginResponse,
  LogoutResponse,
  RefreshRequest,
  RefreshResponse,
  RegisterRequest,
  RegisterResponse,
  UpgradeRequest,
  UserProfile,
} from '@/types/api';
import { storage } from '@/services/storage';
import { apiClient } from './client';

export const authService = {
  /**
   * `POST /auth/register` — público (sem token).
   * Body `RegisterRequest`: email, password (mín. 8 chars), display_name?,
   * diabetes_type? e language_level? (persistidos no perfil).
   * Retorna `RegisterResponse` (perfil do usuário criado).
   * Status: 201 criado · 409 e-mail já cadastrado · 422 senha < 8 chars.
   */
  register: (data: RegisterRequest) =>
    apiClient.post<RegisterResponse>('/auth/register', data).then((r) => r.data),

  /**
   * `POST /auth/login` — público (sem token).
   * Body `LoginRequest`: email + password.
   * Retorna `LoginResponse`: access_token, refresh_token, token_type.
   * Status: 200 ok · 401 credenciais inválidas (mensagem genérica).
   */
  login: (data: LoginRequest) =>
    apiClient.post<LoginResponse>('/auth/login', data).then((r) => r.data),

  /**
   * `POST /auth/refresh` — público (sem token); valida só a assinatura do
   * refresh token, sem consultar o banco.
   * Body `{ refresh_token }`. Retorna `RefreshResponse`: access_token, token_type.
   * Status: 200 ok · 401 refresh token inválido ou expirado.
   */
  refresh: (data: RefreshRequest) =>
    apiClient.post<RefreshResponse>('/auth/refresh', data).then((r) => r.data),

  /**
   * `POST /auth/logout` — requer Bearer; sem body.
   * Revoga o access token atual (e o refresh, se um body com refresh_token for
   * enviado). Retorna `LogoutResponse`: { message }.
   * Status: 200 ok · 401 token ausente/inválido.
   */
  logout: () =>
    apiClient.post<LogoutResponse>('/auth/logout').then((r) => r.data),

  guestRegister: async (): Promise<{ email: string; password: string }> => {
    const uuid = Crypto.randomUUID();
    const randomBytes = Crypto.getRandomValues(new Uint8Array(24));
    const password = Array.from(randomBytes, (b) => b.toString(16).padStart(2, '0')).join('');
    const displayName = `guest${Math.floor(10000 + Math.random() * 90000)}`;
    const email = `guest_${uuid}@guest.local`;

    await authService.register({
      email,
      password,
      display_name: displayName,
      is_guest: true,
    });

    await storage.setDeviceUuid(uuid);
    return { email, password };
  },

  upgrade: (data: UpgradeRequest) =>
    apiClient.post<UserProfile>('/auth/upgrade', data).then((r) => r.data),
};
