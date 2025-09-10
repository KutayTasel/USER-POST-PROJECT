import { useEffect, useRef } from 'react';
import { useLocation } from 'react-router-dom';
import { useLoading } from '@/context/useLoading';

const ROUTE_TRANSITION_TIME = 220;

/**
 * RouteTransitionPulse
 * - Sayfa değişiminde kısa süreli global loader tetikler
 * - useLoading context'i üzerinden show/hide çağrılır
 * - ROUTE_TRANSITION_TIME (220ms) sonra loader gizlenir
 */
export function RouteTransitionPulse(): null {
  const { show, hide } = useLoading();
  const location = useLocation();
  const hiddenRef = useRef<boolean>(false);

  useEffect((): (() => void) => {
    hiddenRef.current = false;
    show(); // route değiştiğinde loader başlat

    // Belirli süre sonunda loader gizlenir
    const timeoutId = window.setTimeout((): void => {
      if (!hiddenRef.current) {
        hide();
        hiddenRef.current = true;
      }
    }, ROUTE_TRANSITION_TIME);

    // Cleanup: timeout temizle ve loader'ı güvenli şekilde kapat
    return (): void => {
      window.clearTimeout(timeoutId);
      if (!hiddenRef.current) {
        hide();
        hiddenRef.current = true;
      }
    };
  }, [location.key, show, hide]);

  return null;
}
