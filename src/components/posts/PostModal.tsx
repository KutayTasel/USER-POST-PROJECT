// PostViewModal.tsx
import { useMemo, useCallback, type ReactNode } from 'react';
import type { Post } from '@/types/post';
import '../../assets/styles/postmodal.css';

const MODAL_CONFIG = {
  wordsPerMinute: 200,
};

const ICONS: Record<'document' | 'eye' | 'user', ReactNode> = {
  document: (
    <svg
      className="modal-stat-icon"
      fill="none"
      stroke="currentColor"
      viewBox="0 0 24 24"
      aria-hidden="true"
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={2}
        d="M7 8h10m0 0V6a2 2 0 00-2-2H9a2 2 0 00-2 2v2m10 0v10a2 2 0 01-2 2H9a2 2 0 01-2-2V8m10 0H7"
      />
    </svg>
  ),
  eye: (
    <svg
      className="modal-stat-icon"
      fill="none"
      stroke="currentColor"
      viewBox="0 0 24 24"
      aria-hidden="true"
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={2}
        d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
      />
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={2}
        d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"
      />
    </svg>
  ),
  user: (
    <svg
      className="modal-stat-icon"
      fill="none"
      stroke="currentColor"
      viewBox="0 0 24 24"
      aria-hidden="true"
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={2}
        d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
      />
    </svg>
  ),
};

interface PostViewModalProps {
  post: Post;
  userMap: Map<number, string>;
  onClose: () => void;
}

/**
 * PostViewModal
 * - Seçilen postu modal içinde detaylı gösterir
 * - Word count + estimated read time hesaplar
 * - Escape tuşu veya backdrop tıklaması ile kapanır
 */
export function PostViewModal({ post, userMap, onClose }: PostViewModalProps): ReactNode {
  // Post istatistikleri (kelime sayısı, okuma süresi)
  const postStats = useMemo(() => {
    const wordCount = post.body.split(' ').filter((w) => w.length > 0).length;
    const readTime = Math.ceil(wordCount / MODAL_CONFIG.wordsPerMinute);
    return { wordCount, readTime };
  }, [post.body]);

  // Backdrop tıklandığında modal kapat
  const handleBackdropClick = useCallback(
    (e: React.MouseEvent) => {
      if (e.target === e.currentTarget) onClose();
    },
    [onClose]
  );

  // Escape ile modal kapat
  const handleKeyDown = useCallback(
    (e: React.KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    },
    [onClose]
  );

  return (
    <div
      className="modal-overlay"
      onClick={handleBackdropClick}
      onKeyDown={handleKeyDown}
      role="dialog"
      aria-modal="true"
      aria-labelledby="modal-title"
      aria-describedby="modal-content"
    >
      <div className="modal-container" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <div className="modal-header-content">
            <h2 id="modal-title" className="modal-title">
              {post.title}
            </h2>
            <p className="modal-subtitle">
              {userMap.get(post.userId) ?? `User ${post.userId}`} • Post #{post.id}
            </p>
          </div>
        </div>

        <div className="modal-body">
          <div id="modal-content" className="modal-content">
            {post.body}
          </div>

          <div className="modal-stats">
            <div className="modal-stat">
              {ICONS.document}
              {postStats.wordCount} words
            </div>
            <div className="modal-stat">
              {ICONS.eye}
              {postStats.readTime} min read
            </div>
            <div className="modal-stat">
              {ICONS.user}
              User ID: {post.userId}
            </div>
          </div>

          <div className="modal-actions">
            <button onClick={onClose} className="modal-btn" aria-label="Close modal" type="button">
              Close
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
