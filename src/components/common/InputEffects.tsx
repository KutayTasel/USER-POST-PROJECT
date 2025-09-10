import React from 'react';

interface InputEffectsProps {
  effect: string;
}

/**
 * InputEffects bileşeni
 * - none dışında bir efekt seçildiğinde
 *   glow, wave, particles, shine efektlerini render eder
 * - CSS animasyonları input.css tarafından kontrol edilir
 */
export const InputEffects: React.FC<InputEffectsProps> = ({ effect }) => {
  // Eğer efekt "none" ise hiçbir şey render edilmez
  if (effect === 'none') return null;

  return (
    <div className="input-effects">
      <div className="input-glow" />
      <div className="input-wave" />
      <div className="input-particles" />
      <div className="input-shine" />
    </div>
  );
};
