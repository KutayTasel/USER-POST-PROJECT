import type { Dispatch, SetStateAction } from 'react';
import { useEffect, useState } from 'react';

export type PersistentBooleanReturn = [boolean, Dispatch<SetStateAction<boolean>>];

/**
 * usePersistentBoolean
 * - Boolean state’i localStorage’da saklar
 * - Yeniden yükleme sonrası da aynı değeri korur
 */
export function usePersistentBoolean(key: string, initial: boolean): PersistentBooleanReturn {
  const [value, setValue] = useState<boolean>(() => {
    if (typeof window === 'undefined') return initial;
    try {
      const raw = window.localStorage.getItem(key);
      if (raw === '1') return true;
      if (raw === '0') return false;
      return initial;
    } catch (error: unknown) {
      console.warn('localStorage getItem failed:', error);
      return initial;
    }
  });

  useEffect((): void => {
    if (typeof window === 'undefined') return;
    try {
      window.localStorage.setItem(key, value ? '1' : '0');
    } catch (error: unknown) {
      console.warn('localStorage setItem failed:', error);
    }
  }, [key, value]);

  return [value, setValue];
}

/**
 * useBodyScrollLock
 * - isLocked true iken body scroll’unu engeller
 * - Modal / Sidebar açıkken kullanılabilir
 */
export function useBodyScrollLock(isLocked: boolean): void {
  useEffect((): (() => void) => {
    if (typeof document === 'undefined') {
      return () => {};
    }

    const { body } = document;
    const original = body.style.overflow;
    body.style.overflow = isLocked ? 'hidden' : original;

    return (): void => {
      body.style.overflow = original;
    };
  }, [isLocked]);
}
