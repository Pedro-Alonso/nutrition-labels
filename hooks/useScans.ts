import { useInfiniteQuery, useQuery } from '@tanstack/react-query';
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

const SCAN_HISTORY_PER_PAGE = 20;

export const SCAN_HISTORY_QUERY_KEY = ['scans', 'history'] as const;

export function useScanHistory() {
  const { isAuthenticated } = useAuthStore();

  return useInfiniteQuery({
    queryKey: SCAN_HISTORY_QUERY_KEY,
    queryFn: ({ pageParam }) =>
      usersService.getScans({ page: pageParam, per_page: SCAN_HISTORY_PER_PAGE }),
    initialPageParam: 1,
    getNextPageParam: (lastPage) => {
      const totalPages = Math.ceil(lastPage.total / lastPage.per_page);
      return lastPage.page < totalPages ? lastPage.page + 1 : undefined;
    },
    enabled: isAuthenticated,
    staleTime: 2 * 60 * 1000,
  });
}

export const SCAN_DETAIL_QUERY_KEY = (scanId: string) => ['scans', 'detail', scanId] as const;

export function useScanDetail(scanId: string) {
  const { isAuthenticated } = useAuthStore();

  return useQuery({
    queryKey: SCAN_DETAIL_QUERY_KEY(scanId),
    queryFn: () => usersService.getScanDetail(scanId),
    enabled: isAuthenticated && !!scanId,
    staleTime: 10 * 60 * 1000,
  });
}
