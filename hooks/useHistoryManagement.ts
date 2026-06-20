import { useMutation, useQueryClient } from '@tanstack/react-query';
import { usersService } from '@/services/api/users';
import { SCAN_HISTORY_QUERY_KEY } from './useScans';

export function useDeleteScan() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (scanId: string) => usersService.deleteScan(scanId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: SCAN_HISTORY_QUERY_KEY });
    },
  });
}

export function useClearHistory() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: () => usersService.deleteAllScans(),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: SCAN_HISTORY_QUERY_KEY });
    },
  });
}
