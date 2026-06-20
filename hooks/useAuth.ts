import { useQueryClient } from '@tanstack/react-query';
import { useAuthStore } from '@/stores/authStore';
import { authService } from '@/services/api/auth';
import { usersService } from '@/services/api/users';
import { storage } from '@/services/storage';
import type { LoginRequest, RegisterRequest, UpgradeRequest } from '@/types/api';

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
    await storage.deleteDeviceUuid();
    store.clearAuth();
    queryClient.clear();
  }

  async function continueAsGuest() {
    const { email, password } = await authService.guestRegister();
    await login({ email, password });
    const user = await usersService.getMe();
    store.setUser(user);
  }

  async function upgradeAccount(data: UpgradeRequest) {
    const updatedUser = await authService.upgrade(data);
    store.setUser(updatedUser);
    queryClient.invalidateQueries({ queryKey: ['me'] });
    await storage.deleteDeviceUuid();
  }

  async function loginFromGuest(data: LoginRequest) {
    try {
      await usersService.deleteMe();
    } catch {
      // best-effort — guest account may already be gone
    }
    await storage.clearTokens();
    store.clearAuth();
    queryClient.clear();
    await storage.deleteDeviceUuid();
    await login(data);
    const user = await usersService.getMe();
    store.setUser(user);
  }

  return {
    isAuthenticated: store.isAuthenticated,
    isBootstrapping: store.isBootstrapping,
    isGuest: store.user?.is_guest ?? false,
    user: store.user,
    login,
    register,
    logout,
    continueAsGuest,
    upgradeAccount,
    loginFromGuest,
  };
}
