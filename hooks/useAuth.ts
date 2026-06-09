import { useQueryClient } from '@tanstack/react-query';
import { useAuthStore } from '@/stores/authStore';
import { authService } from '@/services/api/auth';
import { storage } from '@/services/storage';
import type { LoginRequest, RegisterRequest } from '@/types/api';

export function useAuth() {
  const store = useAuthStore();
  const queryClient = useQueryClient();

  async function login(data: LoginRequest) {
    const tokens = await authService.login(data);
    await storage.setAccessToken(tokens.access_token);
    await storage.setRefreshToken(tokens.refresh_token);
    store.setTokens(tokens.access_token, tokens.refresh_token);
  }

  async function register(data: RegisterRequest) {
    await authService.register(data);
  }

  async function logout() {
    try {
      await authService.logout();
    } catch {
      // best-effort — clear locally regardless
    }
    await storage.clearTokens();
    store.clearAuth();
    queryClient.clear();
  }

  return {
    isAuthenticated: store.isAuthenticated,
    isBootstrapping: store.isBootstrapping,
    user: store.user,
    login,
    register,
    logout,
  };
}
