// layoutconstants.ts

// LocalStorage'da kullanılacak key'ler
export const STORAGE_KEYS = {
  SIDEBAR_COLLAPSED: 'sb:collapsed',
} satisfies Record<string, string>;

// Animasyon / geçiş süreleri (ms)
export const TIMING = {
  ROUTE_TRANSITION: 220,
} satisfies Record<string, number>;

// Tip güvenliği için sabitlerin tipleri
export type StorageKeysType = typeof STORAGE_KEYS;
export type TimingType = typeof TIMING;
