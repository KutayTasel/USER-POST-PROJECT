import { useContext } from 'react';
import { LoadingContext } from './LoadingContext';

/**
 * useLoading
 * - LoadingContext'e erişmek için custom hook
 * - pending: aktif async istek sayısı
 * - show(): yükleme başlat
 * - hide(): yükleme bitir
 * - Context yoksa hata fırlatır (Provider dışında kullanım engellenir)
 */
export function useLoading(): { pending: number; show: () => void; hide: () => void } {
  const ctx = useContext(LoadingContext);
  if (!ctx) {
    throw new Error('useLoading must be used inside <LoadingProvider>');
  }
  return ctx;
}
