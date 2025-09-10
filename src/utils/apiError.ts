/**
 * API'den dönebilecek hata yapısı
 */
export interface ApiError {
  status: number; // HTTP durum kodu
  message: string; // Hata mesajı
  cause?: unknown; // Opsiyonel: hatanın orijinal sebebi
}

/**
 * API sonuç tipleri:
 * - Başarılı durumda: { ok: true; data: T }
 * - Hatalı durumda: { ok: false; error: ApiError }
 */
export type Result<T> = { ok: true; data: T } | { ok: false; error: ApiError };

/**
 * Error sınıfını genişleten, standartlaştırılmış API hata nesnesi
 */
export class ApiErrorImpl extends Error implements ApiError {
  status: number;
  cause?: unknown;

  constructor(message: string, status = 500, cause?: unknown) {
    super(message);
    this.name = 'ApiError';
    this.status = status;
    this.cause = cause;
  }
}
