import React from 'react';

interface InputLabelProps {
  htmlFor: string;
  isFloating: boolean;
  children: React.ReactNode;
}

/**
 * InputLabel
 * - Input için label bileşeni
 * - Floating label desteği (isFloating true ise input içinde gösterilir)
 */
export const InputLabel: React.FC<InputLabelProps> = ({ htmlFor, isFloating, children }) => (
  <label htmlFor={htmlFor} className={`input-label ${isFloating ? 'input-label--floating' : ''}`}>
    {children}
  </label>
);
