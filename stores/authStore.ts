import { createContext, useContext } from 'react';
import type { UserProfile } from '@/types/api';

export interface AuthState {
  accessToken: string | null;
  refreshToken: string | null;
  user: UserProfile | null;
  isAuthenticated: boolean;
  isBootstrapping: boolean;
}

export interface AuthActions {
  setTokens: (access: string, refresh: string) => void;
  setUser: (user: UserProfile | null) => void;
  clearAuth: () => void;
  setBootstrapping: (value: boolean) => void;
}

export type AuthStore = AuthState & AuthActions;

export const initialAuthState: AuthState = {
  accessToken: null,
  refreshToken: null,
  user: null,
  isAuthenticated: false,
  isBootstrapping: true,
};

export const AuthContext = createContext<AuthStore | null>(null);

export function useAuthStore(): AuthStore {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuthStore must be used within AuthProvider');
  return ctx;
}
