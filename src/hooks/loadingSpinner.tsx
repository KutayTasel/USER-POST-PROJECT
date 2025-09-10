// components/LoadingSpinner.tsx
import React from 'react';

/**
 * LoadingSpinner
 * - Butonlar veya genel alanlar için küçük yükleme göstergesi
 * - Erişilebilirlik için role="status" ve aria-label eklenmiştir
 */
export const LoadingSpinner: React.FC = () => (
  <div className="ultra-button__spinner" role="status" aria-label="Loading">
    <div className="ultra-button__spinner-ring" />
  </div>
);
