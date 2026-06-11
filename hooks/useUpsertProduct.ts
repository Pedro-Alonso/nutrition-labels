import { useMutation, useQueryClient } from '@tanstack/react-query';
import { productsService } from '@/services/api/products';
import type { ProductCreateRequest } from '@/types/api';
import { PRODUCT_QUERY_KEY } from './useProduct';

interface UpsertProductVariables {
  barcode: string;
  data: ProductCreateRequest;
  // create → POST (produto novo, vindo do OCR); update → PUT (produto editado).
  mode: 'create' | 'update';
}

export function useUpsertProduct() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ barcode, data, mode }: UpsertProductVariables) =>
      mode === 'create'
        ? productsService.createProduct(barcode, data)
        : productsService.updateProduct(barcode, data),
    onSuccess: (_product, { barcode }) => {
      queryClient.invalidateQueries({ queryKey: PRODUCT_QUERY_KEY(barcode) });
    },
  });
}
