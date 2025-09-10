import { createContext } from 'react';

// Yükleme durumunu yönetmek için context tipleri
export interface LoadingContextValue {
  pending: number; // Aktif async istek sayısı
  show: () => void; // Yeni bir yükleme başlatıldığında çağrılır
  hide: () => void; // Yükleme bittiğinde çağrılır
}

// Global LoadingContext (Provider içinde override edilir)
export const LoadingContext = createContext<LoadingContextValue | null>(null);
