import '@/global.css';

import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { Stack } from 'expo-router';
import { useCallback, useReducer } from 'react';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { storage } from '@/services/api/../storage';
import { usersService } from '@/services/api/users';
import {
  AuthContext,
  initialAuthState,
  type AuthState,
  type AuthStore,
} from '@/stores/authStore';
import type { UserProfile } from '@/types/api';
import { useEffect } from 'react';

export { ErrorBoundary } from 'expo-router';

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: 2,
      refetchOnWindowFocus: false,
    },
  },
});

// ─── Auth state reducer ───────────────────────────────────────────────────────

type AuthAction =
  | { type: 'SET_TOKENS'; access: string; refresh: string }
  | { type: 'SET_USER'; user: UserProfile | null }
  | { type: 'CLEAR' }
  | { type: 'SET_BOOTSTRAPPING'; value: boolean };

function authReducer(state: AuthState, action: AuthAction): AuthState {
  switch (action.type) {
    case 'SET_TOKENS':
      return {
        ...state,
        accessToken: action.access,
        refreshToken: action.refresh,
        isAuthenticated: true,
      };
    case 'SET_USER':
      return { ...state, user: action.user };
    case 'CLEAR':
      return { ...initialAuthState, isBootstrapping: false };
    case 'SET_BOOTSTRAPPING':
      return { ...state, isBootstrapping: action.value };
    default:
      return state;
  }
}

// ─── Auth provider ────────────────────────────────────────────────────────────

function AuthProvider({ children }: { children: React.ReactNode }) {
  const [state, dispatch] = useReducer(authReducer, initialAuthState);

  useEffect(() => {
    async function bootstrap() {
      try {
        const [accessToken, refreshToken] = await Promise.all([
          storage.getAccessToken(),
          storage.getRefreshToken(),
        ]);

        if (accessToken && refreshToken) {
          dispatch({ type: 'SET_TOKENS', access: accessToken, refresh: refreshToken });
          try {
            const user = await usersService.getMe();
            dispatch({ type: 'SET_USER', user });
          } catch {
            // token may be expired — interceptor will refresh on next request
          }
        }
      } finally {
        dispatch({ type: 'SET_BOOTSTRAPPING', value: false });
      }
    }

    bootstrap();
  }, []);

  const setTokens = useCallback((access: string, refresh: string) => {
    dispatch({ type: 'SET_TOKENS', access, refresh });
  }, []);

  const setUser = useCallback((user: UserProfile | null) => {
    dispatch({ type: 'SET_USER', user });
  }, []);

  const clearAuth = useCallback(() => {
    dispatch({ type: 'CLEAR' });
  }, []);

  const setBootstrapping = useCallback((value: boolean) => {
    dispatch({ type: 'SET_BOOTSTRAPPING', value });
  }, []);

  const store: AuthStore = {
    ...state,
    setTokens,
    setUser,
    clearAuth,
    setBootstrapping,
  };

  return <AuthContext.Provider value={store}>{children}</AuthContext.Provider>;
}

// ─── Root layout ─────────────────────────────────────────────────────────────

export default function RootLayout() {
  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <SafeAreaProvider>
        <QueryClientProvider client={queryClient}>
          <AuthProvider>
            <Stack screenOptions={{ headerShown: false }} />
          </AuthProvider>
        </QueryClientProvider>
      </SafeAreaProvider>
    </GestureHandlerRootView>
  );
}
