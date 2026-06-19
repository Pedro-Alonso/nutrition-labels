import { useQuery } from '@tanstack/react-query';
import { AxiosError } from 'axios';
import { productsService } from '@/services/api/products';
import { useMe } from '@/hooks/useMe';

export const PRODUCT_QUERY_KEY = (barcode: string) =>
  ['product', barcode] as const;

export function useProduct(barcode: string | null) {
  return useQuery({
    queryKey: PRODUCT_QUERY_KEY(barcode ?? ''),
    queryFn: () => productsService.getProduct(barcode!),
    enabled: !!barcode,
    staleTime: 10 * 60 * 1000,
    retry: (failureCount, error) => {
      // 404 is a valid "not found" path — do not retry
      if (error instanceof AxiosError && error.response?.status === 404) return false;
      return failureCount < 2;
    },
  });
}

export const SUMMARY_QUERY_KEY = (
  barcode: string,
  diabetesType: string | null | undefined,
  languageLevel: string | null | undefined,
) => ['summary', barcode, diabetesType ?? null, languageLevel ?? null] as const;

export function usePersonalizedSummary(barcode: string | null) {
  const { data: me } = useMe();

  return useQuery({
    queryKey: SUMMARY_QUERY_KEY(barcode ?? '', me?.diabetes_type, me?.language_level),
    queryFn: () => productsService.getProductSummary(barcode!),
    enabled: !!barcode,
    staleTime: 10 * 60 * 1000,
  });
}
