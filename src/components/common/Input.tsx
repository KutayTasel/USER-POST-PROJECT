import { forwardRef } from 'react';
import { useInputLogic } from '../../hooks/useInputLogic';
import { InputLabel } from './InputLabel';
import { InputField } from './InputField';
import { InputMessage } from './InputMessage';
import { InputEffects } from './InputEffects';
import type { InputProps } from '../../types/inputTypes';
import '../../assets/styles/input.css';

/**
 * Tekrar kullanılabilir Input bileşeni
 * - Label, ikon, hint, hata ve başarı mesajı desteği
 * - useInputLogic hook’u ile state, class ve event yönetimi
 * - Floating label, efektler ve erişilebilirlik (aria) uyumlu
 */
export const Input = forwardRef<HTMLInputElement, InputProps>((props, ref) => {
  const {
    label,
    icon,
    iconPosition = 'left',
    error,
    success = false,
    hint,
    successText = 'Looks good!',
    effect = 'none',
    inputSize = 'md',
    variant = 'default',

    value,
    onFocus: _onFocus,
    onBlur: _onBlur,
    onChange: _onChange,
    ...restProps
  } = props;

  // Input davranışlarını yöneten custom hook
  const {
    inputId,
    containerClasses,
    handleFocus,
    handleBlur,
    handleChange,
    messageId,
    hintId,
    isFloating,
    shouldShowStatusIcon,
  } = useInputLogic(props);

  // Hata/başarı/hint mesajlarını aria-describedby ile erişilebilirliğe bağla
  const ariaDescribedBy = [messageId, hintId].filter(Boolean).join(' ') || undefined;

  return (
    <div
      className={containerClasses}
      data-size={inputSize}
      data-variant={variant}
      data-effect={effect}
      data-icon={icon ? iconPosition : 'none'}
    >
      {/* Floating label kullanılmıyorsa label üstte gösterilir */}
      {!isFloating && (
        <InputLabel htmlFor={inputId} isFloating={false}>
          {label}
        </InputLabel>
      )}

      {/* Input alanı (ikon, efekt, bg ile birlikte) */}
      <div className="input-container">
        <InputField
          ref={ref}
          inputId={inputId}
          icon={icon}
          iconPosition={iconPosition}
          onFocus={handleFocus}
          onBlur={handleBlur}
          onChange={handleChange}
          value={value}
          ariaDescribedBy={ariaDescribedBy}
          hasError={Boolean(error)}
          {...restProps}
        />
        {/* Floating label aktifse label input içine gömülür */}
        {isFloating && (
          <InputLabel htmlFor={inputId} isFloating={true}>
            {label}
          </InputLabel>
        )}

        {/* İkon desteği */}
        {icon && <div className="input-icon">{icon}</div>}

        {/* Hata/başarı durumunda status ikonu için placeholder */}
        {shouldShowStatusIcon && <div className="input-status-container" aria-hidden="true" />}

        {/* Efekt animasyonları */}
        <InputEffects effect={effect} />

        {/* Arka plan efektleri */}
        <div className="input-bg input-bg--primary" />
        <div className="input-bg input-bg--secondary" />
      </div>

      {/* Mesajlar: hata, başarı veya hint */}
      {error && (
        <InputMessage id={messageId} type="error">
          {error}
        </InputMessage>
      )}
      {success && !error && (
        <InputMessage id={messageId} type="success">
          {successText}
        </InputMessage>
      )}
      {hint && !error && (
        <div id={hintId} className="input-hint">
          {hint}
        </div>
      )}
    </div>
  );
});

Input.displayName = 'Input';
