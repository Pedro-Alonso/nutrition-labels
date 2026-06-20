import { useInfiniteQuery, keepPreviousData } from '@tanstack/react-query';
import { productsService } from '@/services/api/products';

const SEARCH_PER_PAGE = 20;

export const PRODUCT_SEARCH_QUERY_KEY = (query: string) =>
  ['products', 'search', query] as const;

export function useProductSearch(query: string) {
  return useInfiniteQuery({
    queryKey: PRODUCT_SEARCH_QUERY_KEY(query),
    queryFn: ({ pageParam }) =>
      productsService.searchProducts({
        q: query,
        page: pageParam,
        per_page: SEARCH_PER_PAGE,
      }),
    initialPageParam: 1,
    getNextPageParam: (lastPage) => {
      const totalPages = Math.ceil(lastPage.total / lastPage.per_page);
      return lastPage.page < totalPages ? lastPage.page + 1 : undefined;
    },
    enabled: query.length >= 2,
    placeholderData: keepPreviousData,
    staleTime: 2 * 60 * 1000,
  });
}
