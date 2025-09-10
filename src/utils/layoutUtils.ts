// CSS class tipleri: string veya opsiyonel değerler
type CSSClassValue = string | boolean | undefined | null;

/**
 * Gelen class değerlerini filtreleyip tek bir string'e çevirir
 * - falsey değerleri (null, undefined, false) atar
 * - sadece string olanları birleştirir
 */
export function buildCSSClasses(...classes: readonly CSSClassValue[]): string {
  return classes.filter((cls): cls is string => Boolean(cls) && typeof cls === 'string').join(' ');
}

/**
 * Sidebar için class string üretir
 * - "layout-sidebar" temel class
 * - "open" → sidebar açıkken
 * - "collapsed" → sidebar daraltıldığında
 */
export function buildSidebarClasses(sidebarOpen: boolean, collapsed: boolean): string {
  return buildCSSClasses(
    'layout-sidebar',
    sidebarOpen ? 'open' : null,
    collapsed ? 'collapsed' : null
  );
}

/**
 * Ana içerik alanı için class string üretir
 * - "layout-main" temel class
 * - "collapsed" → sidebar daraltıldığında içerik alanı genişler
 */
export function buildMainClasses(collapsed: boolean): string {
  return buildCSSClasses('layout-main', collapsed ? 'collapsed' : null);
}

/**
 * Mobil görünümde sidebar açıldığında arkadaki overlay için class string üretir
 * - "mobile-overlay" temel class
 * - "show" → sidebar açıldığında görünür
 */
export function buildOverlayClasses(sidebarOpen: boolean): string {
  return buildCSSClasses('mobile-overlay', sidebarOpen ? 'show' : null);
}
