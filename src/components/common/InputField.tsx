import { forwardRef } from 'react';
import type { ComponentProps, ReactNode } from 'react';

interface InputFieldProps extends Omit<ComponentProps<'input'>, 'onFocus' | 'onBlur' | 'onChange'> {
  inputId: string;
  onFocus?: (e: React.FocusEvent<HTMLInputElement>) => void;
  onBlur?: (e: React.FocusEvent<HTMLInputElement>) => void;
  onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void;
  ariaDescribedBy?: string | undefined;
  hasError: boolean;
  icon?: ReactNode;
  iconPosition?: 'left' | 'right';
  variant?: string;
}

/**
 * InputField
 * - Ham <input> elementini temsil eder
 * - Erişilebilirlik (aria) ve stil için data-* attr eklenir
 */
export const InputField = forwardRef<HTMLInputElement, InputFieldProps>(
  (
    {
      inputId,
      onFocus,
      onBlur,
      onChange,
      ariaDescribedBy,
      hasError,
      icon,
      iconPosition,
      variant,
      ...inputProps
    },
    ref
  ) => (
    <input
      ref={ref}
      id={inputId}
      className="input-field"
      onFocus={onFocus}
      onBlur={onBlur}
      onChange={onChange}
      aria-invalid={hasError} // Hata varsa true → ekran okuyucular için
      aria-describedby={ariaDescribedBy} // Hint / error mesajı bağlantısı
      data-has-icon={Boolean(icon)} // CSS: ikonlu input stilleri
      data-icon-position={icon ? iconPosition : undefined}
      data-variant={variant}
      {...inputProps}
    />
  )
);

InputField.displayName = 'InputField';
