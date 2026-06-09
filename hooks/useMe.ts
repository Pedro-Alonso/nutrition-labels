import { useQuery } from '@tanstack/react-query';
import { usersService } from '@/services/api/users';
import { useAuthStore } from '@/stores/authStore';

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
