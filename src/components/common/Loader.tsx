import type { JSX } from 'react';
import { useLoading } from '@/context/useLoading';

/**
 * Loader
 * - Global loading durumunu göstermek için kullanılır
 * - useLoading context'inden pending sayısını dinler
 * - pending > 0 ise tam ekran yarı saydam arka plan ve spinner gösterir
 */
export function Loader(): JSX.Element | null {
  const { pending } = useLoading();

  // Pending 0 ise loader görünmez
  if (pending === 0) return null;
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
      <div className="h-12 w-12 animate-spin rounded-full border-4 border-t-transparent border-white" />
    </div>
  );
}
