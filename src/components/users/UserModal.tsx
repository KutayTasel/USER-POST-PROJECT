// UserViewModal.tsx
import { useCallback, type ReactNode } from 'react';
import type { User } from '@/types/user';
import '../../assets/styles/usermodal.css';

// Kullanılacak ikonlar (SVG'ler)
const ICONS = {
  mail: (
    <svg
      className="uvm-icon"
      fill="none"
      stroke="currentColor"
      viewBox="0 0 24 24"
      aria-hidden="true"
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={2}
        d="M3 8l7.89 7.89a1 1 0 001.42 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
      />
    </svg>
  ),
  tag: (
    <svg
      className="uvm-icon"
      fill="none"
      stroke="currentColor"
      viewBox="0 0 24 24"
      aria-hidden="true"
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={2}
        d="M7 7h.01M7 3h5l6 6-6 6-5 5H3a1 1 0 01-1-1v-4l6-6z"
      />
    </svg>
  ),
  document: (
    <svg
      className="uvm-icon"
      fill="none"
      stroke="currentColor"
      viewBox="0 0 24 24"
      aria-hidden="true"
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={2}
        d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
      />
    </svg>
  ),
  arrow: (
    <svg
      className="uvm-icon"
      fill="none"
      stroke="currentColor"
      viewBox="0 0 24 24"
      aria-hidden="true"
    >
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
    </svg>
  ),
  close: (
    <svg
      className="uvm-icon"
      fill="none"
      stroke="currentColor"
      viewBox="0 0 24 24"
      aria-hidden="true"
    >
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
    </svg>
  ),
};

interface UserViewModalProps {
  user: User;
  postCount: number;
  onClose: () => void;
  onViewPosts: () => void;
}

/**
 * UserViewModal
 * - Kullanıcı detaylarını modal içinde gösterir
 * - Post sayısı, username, email bilgisi
 * - "View Posts" ve "Close" butonları içerir
 */
export function UserViewModal({
  user,
  postCount,
  onClose,
  onViewPosts,
}: UserViewModalProps): ReactNode {
  // Dış alana tıklayınca kapatma
  const handleBackdropClick = useCallback(
    (event: React.MouseEvent) => {
      if (event.target === event.currentTarget) onClose();
    },
    [onClose]
  );

  // ESC tuşu ile kapatma
  const handleKeyDown = useCallback(
    (event: React.KeyboardEvent) => {
      if (event.key === 'Escape') onClose();
    },
    [onClose]
  );

  return (
    <div
      className="uvm-backdrop uvm-fadeIn"
      onClick={handleBackdropClick}
      onKeyDown={handleKeyDown}
      role="dialog"
      aria-modal="true"
      aria-labelledby="user-modal-title"
      aria-describedby="user-modal-content"
      tabIndex={-1}
    >
      <div
        className="uvm-dialog uvm-slideUp"
        style={{ maxHeight: '90vh' }}
        onClick={(e) => e.stopPropagation()}
      >
        <div className="uvm-header">
          <div className="uvm-headerCenter">
            <h2 id="user-modal-title" className="uvm-title">
              {user.name}
            </h2>
            <p className="uvm-subtitle">
              User #{user.id} • @{user.username}
            </p>
          </div>
        </div>

        <div className="uvm-content">
          {/* Email bilgisi */}
          <div id="user-modal-content" className="uvm-text">
            <div className="uvm-metaRow">
              {ICONS.mail}
              <address className="uvm-address">{user.email}</address>
            </div>
          </div>

          {/* Kullanıcı meta bilgileri */}
          <div className="uvm-badges">
            <div className="uvm-meta">
              {ICONS.document}
              <data value={postCount}>{postCount} posts</data>
            </div>
            <div className="uvm-meta">
              {ICONS.tag}
              <data value={user.username}>@{user.username}</data>
            </div>
          </div>

          {/* Aksiyon butonları */}
          <div className="uvm-actions">
            <button
              type="button"
              onClick={onViewPosts}
              className="uvm-btn uvm-btn--primary"
              aria-label={`View posts by ${user.name}`}
            >
              {ICONS.arrow}
              <span>View Posts</span>
            </button>

            <button
              type="button"
              onClick={onClose}
              className="uvm-btn uvm-btn--secondary"
              aria-label="Close user details modal"
            >
              {ICONS.close}
              <span>Close</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
