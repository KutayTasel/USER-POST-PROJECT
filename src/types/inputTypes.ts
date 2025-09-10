import type { ComponentProps, ReactNode } from 'react';

/**
 * Özel Input bileşeni için prop tipleri
 * HTML <input> özelliklerini devralır, 'size' hariç.
 */
export interface InputProps extends Omit<ComponentProps<'input'>, 'size'> {
  /** Label metni */
  label: string;

  /** Görsel stil seçeneği */
  variant?: 'default' | 'floating' | 'neon' | 'glass' | 'cyber' | 'minimal' | 'gradient';

  /** Boyut seçeneği */
  inputSize?: 'sm' | 'md' | 'lg' | 'xl';

  /** Animasyon/efekt seçeneği */
  effect?: 'glow' | 'pulse' | 'wave' | 'magnetic' | 'particle' | 'none';

  /** Opsiyonel ikon */
  icon?: ReactNode;

  /** İkonun konumu */
  iconPosition?: 'left' | 'right';

  /** Hata mesajı */
  error?: string;

  /** Başarı durumu */
  success?: boolean;

  /** İpucu metni */
  hint?: string;

  /** Başarı metni */
  successText?: string;
}
