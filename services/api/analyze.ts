import type { AnalyzeRequest, AnalyzeResponse } from '@/types/api';
import { apiClient } from './client';

export const analyzeService = {
  analyzeLabel: (data: AnalyzeRequest) => {
    const form = new FormData();
    form.append('file', data.file as unknown as Blob);
    if (data.category_override != null) {
      form.append('category_override', data.category_override);
    }
    if (data.roi_enabled != null) {
      form.append('roi_enabled', String(data.roi_enabled));
    }
    if (data.stop_on_first_pass != null) {
      form.append('stop_on_first_pass', String(data.stop_on_first_pass));
    }
    if (data.postprocess != null) {
      form.append('postprocess', String(data.postprocess));
    }

    return apiClient
      .post<AnalyzeResponse>('/analyze', form, {
        headers: { 'Content-Type': 'multipart/form-data' },
      })
      .then((r) => r.data);
  },
};
