import type { JSX, ReactNode } from 'react';
import { useCallback, useState } from 'react';
import { LoadingContext } from './LoadingContext';

/**
 * LoadingProvider
 * - Global yükleme durumunu (pending count) context ile sağlar
 * - show(): yeni async işlem başlatıldığında pending artırır
 * - hide(): işlem bittiğinde pending azaltır
 */
export function LoadingProvider({ children }: { children: ReactNode }): JSX.Element {
  const [pending, setPending] = useState(0);

  // Yeni yükleme başlat → pending +1
  const show = useCallback(() => setPending((p) => p + 1), []);

  // Yükleme bitti → pending -1 (ama 0'ın altına düşmez)
  const hide = useCallback(() => setPending((p) => Math.max(0, p - 1)), []);

  return (
    <LoadingContext.Provider value={{ pending, show, hide }}>{children}</LoadingContext.Provider>
  );
}
