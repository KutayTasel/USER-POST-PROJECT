import axios, { isAxiosError } from 'axios';
import type {
  InternalAxiosRequestConfig,
  AxiosError,
  AxiosResponse,
  AxiosRequestConfig,
} from 'axios';
import { ApiErrorImpl } from '@/utils/apiError';
import type { LoadingContextValue } from '@/context/LoadingContext';

let loadingHandler: LoadingContextValue | null = null;

/**
 * LoadingProvider içinden loading state bağlamak için kullanılır.
 * Böylece her request başladığında loader açılır, bittiğinde kapanır.
 */
export function bindLoading(handler: LoadingContextValue): void {
  loadingHandler = handler;
}

// Axios instance (base URL .env üzerinden alınır)
export const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL,
});

// Request interceptor → istek başlamadan loader aç
api.interceptors.request.use(
  (config: InternalAxiosRequestConfig): InternalAxiosRequestConfig => {
    loadingHandler?.show();
    return config;
  },
  (error: AxiosError): Promise<never> => {
    loadingHandler?.hide();
    return Promise.reject(error);
  }
);

// Response interceptor → cevap geldiğinde loader kapat
api.interceptors.response.use(
  (res: AxiosResponse): AxiosResponse => {
    loadingHandler?.hide();
    return res;
  },
  (error: AxiosError): Promise<never> => {
    loadingHandler?.hide();
    return Promise.reject(error);
  }
);

/**
 * GET helper → JSON döndürür
 */
export async function getJson<T>(url: string, cfg?: AxiosRequestConfig): Promise<T> {
  try {
    const res = await api.get<T>(url, cfg);
    return res.data;
  } catch (err: unknown) {
    throw toApiError(err);
  }
}

/**
 * POST / PUT / PATCH helper
 */
export async function mutateJson<TReq, TRes>(
  method: 'post' | 'put' | 'patch',
  url: string,
  body: TReq
): Promise<TRes> {
  try {
    const res = await api.request<TRes>({ method, url, data: body });
    return res.data;
  } catch (err: unknown) {
    throw toApiError(err);
  }
}

/**
 * DELETE helper
 */
export async function deleteJson(url: string, cfg?: AxiosRequestConfig): Promise<void> {
  try {
    await api.delete(url, cfg);
  } catch (err: unknown) {
    throw toApiError(err);
  }
}

/**
 * Axios error'u uniform ApiErrorImpl formatına çevirir
 */
function toApiError(err: unknown): ApiErrorImpl {
  if (isAxiosError(err)) {
    const status = err.response?.status ?? 500;
    const message = err.message || 'Request failed';
    return new ApiErrorImpl(message, status, err);
  }
  return new ApiErrorImpl('Unknown error', 500, err);
}
