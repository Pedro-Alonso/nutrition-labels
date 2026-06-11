import type {
  AxiosError,
  AxiosResponse,
  InternalAxiosRequestConfig,
} from 'axios';

// Logs de request/response apenas em desenvolvimento E com a flag ligada
// (ver script `yarn start:debug`). Em build de release `__DEV__` é `false` e a
// flag não é setada — dupla garantia de que nada é logado em produção.
const DEBUG = __DEV__ && process.env.EXPO_PUBLIC_DEBUG_LOGS === '1';

/** Junta baseURL + url da request num endereço completo. */
function fullUrl(config: InternalAxiosRequestConfig): string {
  const base = (config.baseURL ?? '').replace(/\/$/, '');
  const path = config.url ?? '';
  return path.startsWith('http') ? path : `${base}/${path.replace(/^\//, '')}`;
}

/** Headers com o token Bearer redigido (nunca logar credenciais cruas). */
function safeHeaders(config: InternalAxiosRequestConfig): Record<string, unknown> {
  const raw =
    typeof config.headers?.toJSON === 'function'
      ? (config.headers.toJSON() as Record<string, unknown>)
      : { ...(config.headers as Record<string, unknown>) };
  if (raw.Authorization) raw.Authorization = 'Bearer ***';
  if (raw.authorization) raw.authorization = 'Bearer ***';
  return raw;
}

/** Reconstrói um curl aproximado para reproduzir a request manualmente. */
function toCurl(config: InternalAxiosRequestConfig): string {
  const method = (config.method ?? 'get').toUpperCase();
  const parts = [`curl -X ${method} '${fullUrl(config)}'`];
  const headers = safeHeaders(config);
  for (const [key, value] of Object.entries(headers)) {
    if (value != null && value !== '') parts.push(`-H '${key}: ${value}'`);
  }
  if (config.data != null) {
    const body =
      typeof config.data === 'string' ? config.data : JSON.stringify(config.data);
    parts.push(`-d '${body}'`);
  }
  return parts.join(' \\\n  ');
}

export function logRequest(config: InternalAxiosRequestConfig): void {
  if (!DEBUG) return;
  const method = (config.method ?? 'get').toUpperCase();
  console.log(`→ [API] ${method} ${fullUrl(config)}`, {
    params: config.params,
    data: config.data,
  });
  console.log(toCurl(config));
}

export function logResponse(response: AxiosResponse): void {
  if (!DEBUG) return;
  const method = (response.config.method ?? 'get').toUpperCase();
  console.log(
    `← [API] ${response.status} ${method} ${fullUrl(response.config)}`,
    response.data,
  );
}

export function logApiError(error: AxiosError): void {
  if (!DEBUG) return;
  const config = error.config;
  const method = (config?.method ?? 'get').toUpperCase();
  const where = config ? `${method} ${fullUrl(config)}` : error.message;
  console.log(`✗ [API] ${error.response?.status ?? 'ERR'} ${where}`, {
    data: error.response?.data,
    message: error.message,
  });
}
