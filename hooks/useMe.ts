import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { usersService } from '@/services/api/users';
import { useAuthStore } from '@/stores/authStore';
import type { UpdateProfileRequest } from '@/types/api';

export const ME_QUERY_KEY = ['me'] as const;

export function useMe() {
  const { isAuthenticated } = useAuthStore();

  return useQuery({
    queryKey: ME_QUERY_KEY,
    queryFn: usersService.getMe,
    enabled: isAuthenticated,
    staleTime: 5 * 60 * 1000,
  });
}

export function useUpdateProfile() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: UpdateProfileRequest) => usersService.updateMe(data),
    onSuccess: (data) => {
      queryClient.setQueryData(ME_QUERY_KEY, data);
      // diabetes_type/language_level mudaram → próximo read regenera o resumo
      // e o histórico (risco_global/resumo) deve refletir a personalização atual.
      queryClient.invalidateQueries({ queryKey: ['scans'] });
    },
  });
}
