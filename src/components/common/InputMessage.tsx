import React from 'react';
import { ErrorIcon, SuccessIcon } from './InputIcons';

interface InputMessageProps {
  id?: string | undefined;
  type: 'error' | 'success';
  children: React.ReactNode;
}

/**
 * InputMessage
 * - Input alanı için hata veya başarı mesajı gösterir
 * - İlgili ikonu (ErrorIcon / SuccessIcon) yanında render eder
 * - Erişilebilirlik için role="alert" (error) veya role="status" (success) kullanılır
 */
export const InputMessage: React.FC<InputMessageProps> = ({ id, type, children }) => (
  <div
    id={id}
    className={`input-message input-message--${type}`}
    role={type === 'error' ? 'alert' : 'status'}
  >
    {type === 'error' ? <ErrorIcon /> : <SuccessIcon />}
    {children}
  </div>
);
