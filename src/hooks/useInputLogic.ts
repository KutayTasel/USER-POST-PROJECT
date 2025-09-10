// hooks/useInputLogic.ts
import { useState, useMemo, useCallback, useId } from 'react';
import type { InputProps } from '../types/inputTypes';

interface UseInputLogicReturn {
  inputId: string;
  isFocused: boolean;
  hasValue: boolean;
  containerClasses: string;
  handleFocus: (e: React.FocusEvent<HTMLInputElement>) => void;
  handleBlur: (e: React.FocusEvent<HTMLInputElement>) => void;
  handleChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  messageId: string | undefined;
  hintId: string | undefined;
  isFloating: boolean;
  shouldShowStatusIcon: boolean;
}

/**
 * useInputLogic
 * - Input bileşeni için odak, değer ve hata/başarı durumlarını yönetir
 * - Dinamik className üretir (variant, size, effect, error, success vs.)
 * - Erişilebilirlik için messageId ve hintId döndürür
 */
export const useInputLogic = (props: InputProps): UseInputLogicReturn => {
  const {
    id,
    className,
    variant = 'default',
    inputSize = 'md',
    effect = 'none',
    icon,
    iconPosition = 'left',
    error,
    success = false,
    hint,
    onFocus,
    onBlur,
    onChange,
    value,
  } = props;

  // Benzersiz id oluştur (id verilmediyse)
  const generatedId = useId();
  const inputId = id ?? generatedId;

  // Focus ve değer state’leri
  const [isFocused, setIsFocused] = useState(false);
  const [hasValue, setHasValue] = useState(Boolean(value));

  // Odağa girince
  const handleFocus = useCallback(
    (e: React.FocusEvent<HTMLInputElement>) => {
      setIsFocused(true);
      onFocus?.(e);
    },
    [onFocus]
  );

  // Odaktan çıkınca
  const handleBlur = useCallback(
    (e: React.FocusEvent<HTMLInputElement>) => {
      setIsFocused(false);
      setHasValue(e.target.value.length > 0);
      onBlur?.(e);
    },
    [onBlur]
  );

  // Değer değişince
  const handleChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      setHasValue(e.target.value.length > 0);
      onChange?.(e);
    },
    [onChange]
  );

  // Dinamik container class’ları
  const containerClasses = useMemo(() => {
    const classes = ['input-wrapper', `input-wrapper--${variant}`, `input-wrapper--${inputSize}`];

    if (effect !== 'none') classes.push(`input-wrapper--${effect}`);
    if (isFocused) classes.push('input-wrapper--focused');
    if (hasValue) classes.push('input-wrapper--has-value');
    if (error) classes.push('input-wrapper--error');
    if (success && !error) classes.push('input-wrapper--success');
    if (icon) classes.push('input-wrapper--with-icon', `input-wrapper--icon-${iconPosition}`);
    if (className) classes.push(className);

    return classes.join(' ');
  }, [
    variant,
    inputSize,
    effect,
    isFocused,
    hasValue,
    error,
    success,
    icon,
    iconPosition,
    className,
  ]);

  // Ek durumlar
  const isFloating = variant === 'floating';
  const shouldShowStatusIcon = Boolean(error ?? success) && !icon;
  const messageId = error ? `${inputId}-error` : success ? `${inputId}-success` : undefined;
  const hintId = hint ? `${inputId}-hint` : undefined;

  return {
    inputId,
    isFocused,
    hasValue,
    containerClasses,
    handleFocus,
    handleBlur,
    handleChange,
    messageId,
    hintId,
    isFloating,
    shouldShowStatusIcon,
  };
};
