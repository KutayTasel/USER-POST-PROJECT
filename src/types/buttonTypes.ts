import type { ReactNode, CSSProperties, MouseEvent } from 'react';

/**
 * Özel buton bileşeni için prop tipleri
 */
export interface ButtonProps {
  /** Görsel stil seçeneği */
  variant?:
    | 'primary'
    | 'ghost'
    | 'gradient'
    | 'neon'
    | 'hologram'
    | 'cyber'
    | 'glass'
    | 'plasma'
    | 'danger'
    | 'light';

  /** Boyut seçeneği */
  size?: 'xs' | 'sm' | 'md' | 'lg' | 'xl' | 'xxl';

  /** Animasyon/efekt tipi */
  effect?: 'glow' | 'pulse' | 'ripple' | 'magnetic' | 'particle' | 'wave' | 'none';

  /** Yüklenme durumu */
  loading?: boolean;

  /** Devre dışı bırakma durumu */
  disabled?: boolean;

  /** Opsiyonel ikon */
  icon?: ReactNode;

  /** İkonun konumu */
  iconPosition?: 'left' | 'right';

  /** Yükleme sırasında gösterilecek alternatif metin */
  loadingText?: string;

  /** Ekstra CSS sınıfı */
  className?: string;

  /** Click eventi */
  onClick?: (e: MouseEvent<HTMLButtonElement>) => void;

  /** Inline stiller */
  style?: CSSProperties;

  /** Buton tipi */
  type?: 'button' | 'submit' | 'reset';

  /** Erişilebilirlik etiketi */
  'aria-label'?: string;

  /** Buton içeriği (metin, ikon, vs.) */
  children?: ReactNode;
}
