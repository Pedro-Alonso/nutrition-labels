import { useQuery } from '@tanstack/react-query';
import { usersService } from '@/services/api/users';
import { useAuthStore } from '@/stores/authStore';
import type { ScansParams } from '@/types/api';

export const SCANS_QUERY_KEY = (params: ScansParams = {}) =>
  ['scans', params] as const;

export function useScans(params: ScansParams = {}) {
  const { isAuthenticated } = useAuthStore();

  return useQuery({
    queryKey: SCANS_QUERY_KEY(params),
    queryFn: () => usersService.getScans(params),
    enabled: isAuthenticated,
    staleTime: 2 * 60 * 1000,
  });
}
