import { useMutation, useQueryClient } from '@tanstack/react-query';
import { productsService } from '@/services/api/products';
import { PRODUCT_QUERY_KEY } from './useProduct';

export function useScanProduct() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (barcode: string) => productsService.scanProduct(barcode),
    onSuccess: (product, barcode) => {
      queryClient.setQueryData(PRODUCT_QUERY_KEY(barcode), product);
      queryClient.invalidateQueries({ queryKey: ['scans'] });
    },
  });
}
