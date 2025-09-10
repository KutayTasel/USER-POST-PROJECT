import { forwardRef } from 'react';
import { useButtonLogic } from '../../hooks/useButtonLogic';
import { LoadingSpinner } from '../../hooks/loadingSpinner';
import type { ButtonProps } from '../../types/buttonTypes';
import '../../assets/styles/button.css';

/**
 * Tekrar kullanılabilir Buton bileşeni
 * - Loading (yükleniyor) state desteği (spinner ile)
 * - İkon desteği (sol/sağ konum)
 * - useButtonLogic hook’u ile variant, size, effect, disabled yönetimi
 */

export const Button = forwardRef<HTMLButtonElement, ButtonProps>((props, ref) => {
  const {
    loading = false,
    icon,
    iconPosition = 'left',
    loadingText = 'Processing...',
    children,
    type = 'button',
    'aria-label': ariaLabel,
    variant: _variant,
    size: _size,
    effect: _effect,
    disabled: _disabled,
    className: _className,
    onClick: _onClick,
    style: _style,
    ...restProps
  } = props;

  // Butonun className, style, disabled durumu ve click mantığını yöneten hook
  const { buttonClasses, isDisabled, handleClick, buttonStyle } = useButtonLogic(props);

  // İçerik render fonksiyonu: loading / ikon sol / ikon sağ / normal içerik
  const renderContent = () => {
    if (loading) {
      return (
        <>
          <LoadingSpinner />
          {loadingText}
        </>
      );
    }

    if (icon && iconPosition === 'left') {
      return (
        <>
          {icon}
          {children}
        </>
      );
    }

    if (icon && iconPosition === 'right') {
      return (
        <>
          {children}
          {icon}
        </>
      );
    }

    return children;
  };

  return (
    <button
      ref={ref}
      type={type}
      className={buttonClasses}
      disabled={isDisabled}
      onClick={handleClick}
      style={buttonStyle}
      aria-busy={loading} // Erişilebilirlik: loading durumunu belirtir
      aria-disabled={isDisabled}
      aria-label={ariaLabel}
      data-loading={loading}
      data-disabled={isDisabled}
      {...restProps}
    >
      {renderContent()}
    </button>
  );
});

Button.displayName = 'Button';
