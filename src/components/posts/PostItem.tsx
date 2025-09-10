import type { ReactNode, MouseEvent, KeyboardEvent } from 'react';
import { useCallback, useMemo } from 'react';
import type { Post } from '@/types/post';
import { Button } from '@/components/common/Button';
import '../../assets/styles/postitem.css';

export interface PostItemProps {
  post: Post;
  onEdit: (post: Post) => void;
  onDelete: (id: number) => void;
  onDetail?: (post: Post) => void;
  variant?: 'row' | 'card';
  userName?: string | undefined;
}

/**
 * PostItem
 * - Tek bir postu tablo satırı (row) veya kart (card) olarak render eder
 * - Edit, Delete ve opsiyonel Detail (click/enter/space) eventlerini destekler
 */
export function PostItem({
  post,
  onEdit,
  onDelete,
  onDetail,
  variant = 'row',
  userName,
}: PostItemProps): ReactNode {
  const displayUserName = useMemo(() => {
    return userName ?? `User #${post.userId}`;
  }, [userName, post.userId]);

  // Edit butonu
  const handleEdit = useCallback(
    (e: MouseEvent<HTMLButtonElement>) => {
      e.stopPropagation();
      onEdit(post);
    },
    [onEdit, post]
  );

  // Delete butonu
  const handleDelete = useCallback(
    (e: MouseEvent<HTMLButtonElement>) => {
      e.stopPropagation();
      onDelete(post.id);
    },
    [onDelete, post.id]
  );

  // Kart/satır click → detail aç
  const handleCardClick = useCallback(() => {
    onDetail?.(post);
  }, [onDetail, post]);

  // Enter veya Space → detail aç
  const handleKeyDown = useCallback(
    (e: KeyboardEvent) => {
      if ((e.key === 'Enter' || e.key === ' ') && onDetail) {
        e.preventDefault();
        onDetail(post);
      }
    },
    [onDetail, post]
  );

  const ariaLabel = `Post: ${post.title} by ${displayUserName}`;

  // Tablo satırı görünümü
  if (variant === 'row') {
    return (
      <tr
        className="post-item-row"
        onClick={handleCardClick}
        onKeyDown={handleKeyDown}
        role="button"
        tabIndex={onDetail ? 0 : -1}
        aria-label={ariaLabel}
      >
        <td className="post-item-row__cell">
          <div className="post-item-row__user">{displayUserName}</div>
        </td>
        <td className="post-item-row__cell post-item-row__id">#{post.id}</td>
        <td className="post-item-row__cell">
          <div className="post-item-row__title">{post.title}</div>
        </td>
        <td className="post-item-row__cell">
          <div className="post-item-row__actions">
            <Button
              variant="light"
              size="sm"
              onClick={handleEdit}
              aria-label={`Edit post ${post.id}: ${post.title}`}
            >
              Edit
            </Button>
            <Button
              variant="light"
              size="sm"
              onClick={handleDelete}
              aria-label={`Delete post ${post.id}: ${post.title}`}
            >
              Delete
            </Button>
          </div>
        </td>
      </tr>
    );
  }

  // Kart görünümü
  return (
    <div
      onClick={handleCardClick}
      onKeyDown={handleKeyDown}
      className="post-item-card"
      role="button"
      tabIndex={onDetail ? 0 : -1}
      aria-label={ariaLabel}
    >
      <div>
        <div className="post-item-card__header">
          <h3 className="post-item-card__title">{post.title}</h3>
          <div className="post-item-card__id">#{post.id}</div>
        </div>
        <div className="post-item-card__user">User: {displayUserName}</div>
      </div>

      <div className="post-item-card__actions">
        <Button
          variant="light"
          size="sm"
          onClick={handleEdit}
          className="post-item-card__action-button"
          aria-label={`Edit post ${post.id}: ${post.title}`}
        >
          Edit
        </Button>
        <Button
          variant="light"
          size="sm"
          onClick={handleDelete}
          className="post-item-card__action-button"
          aria-label={`Delete post ${post.id}: ${post.title}`}
        >
          Delete
        </Button>
      </div>
    </div>
  );
}
