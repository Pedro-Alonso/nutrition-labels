import { useMutation } from '@tanstack/react-query';
import { analyzeService } from '@/services/api/analyze';
import type { AnalyzeRequest } from '@/types/api';

export function useAnalyze() {
  return useMutation({
    mutationFn: (data: AnalyzeRequest) => analyzeService.analyzeLabel(data),
  });
}
