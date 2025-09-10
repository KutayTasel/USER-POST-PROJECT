import { useMemo, useCallback } from 'react';
import type { ButtonProps } from '../types/buttonTypes';

interface UseButtonLogicReturn {
  buttonClasses: string;
  isDisabled: boolean;
  handleClick: (e: React.MouseEvent<HTMLButtonElement>) => void;
  buttonStyle: React.CSSProperties;
}

/**
 * useButtonLogic
 * - Button bileşeninin class, style ve davranış mantığını kapsüller
 * - loading/disabled durumlarını yönetir
 * - Tıklamaları kontrol eder (disabled iken engeller)
 */
export const useButtonLogic = (props: ButtonProps): UseButtonLogicReturn => {
  const {
    variant = 'primary',
    size = 'md',
    effect = 'none',
    loading = false,
    disabled = false,
    className,
    onClick,
    style,
  } = props;

  // Buton devre dışı mı?
  const isDisabled = disabled || loading;

  // Dinamik className oluştur
  const buttonClasses = useMemo(() => {
    const classes = ['ultra-button', `ultra-button--${variant}`, `ultra-button--${size}`];

    if (effect !== 'none') classes.push(`ultra-button--${effect}`);
    if (loading) classes.push('ultra-button--loading');
    if (isDisabled) classes.push('ultra-button--disabled');
    if (className) classes.push(className);

    return classes.join(' ');
  }, [variant, size, effect, loading, isDisabled, className]);

  // Click event kontrolü
  const handleClick = useCallback(
    (e: React.MouseEvent<HTMLButtonElement>) => {
      if (isDisabled) {
        e.preventDefault();
        e.stopPropagation();
        return;
      }
      onClick?.(e);
    },
    [onClick, isDisabled]
  );

  // Inline stil mantığı
  const buttonStyle = useMemo(
    (): React.CSSProperties => ({
      position: 'relative',
      zIndex: 10,
      pointerEvents: isDisabled ? 'none' : 'auto',
      cursor: isDisabled ? 'not-allowed' : 'pointer',
      ...style,
    }),
    [isDisabled, style]
  );

  return {
    buttonClasses,
    isDisabled,
    handleClick,
    buttonStyle,
  };
};
