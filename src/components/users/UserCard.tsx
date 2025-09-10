import type { ReactNode, MouseEvent, KeyboardEvent } from 'react';
import { useCallback } from 'react';
import type { User } from '@/types/user';
import { Button } from '@/components/common/Button';
import '../../assets/styles/usercard.css';

export interface UserCardProps {
  user: User;
  onEdit: (user: User) => void;
  onDelete: (id: number) => void;
  onDetail?: (user: User) => void;
  variant?: 'row' | 'card';
}

/**
 * UserCard
 * - Tek bir user bilgisini row (tablo) veya card görünümünde render eder
 * - Edit, Delete ve opsiyonel Detail eventlerini destekler
 */
export function UserCard({
  user,
  onEdit,
  onDelete,
  onDetail,
  variant = 'card',
}: UserCardProps): ReactNode {
  // Action buton handler’ları
  const handleEdit = useCallback(
    (e: MouseEvent<HTMLButtonElement>) => {
      e.stopPropagation();
      onEdit(user);
    },
    [onEdit, user]
  );

  const handleDelete = useCallback(
    (e: MouseEvent<HTMLButtonElement>) => {
      e.stopPropagation();
      onDelete(user.id);
    },
    [onDelete, user.id]
  );

  // Root handler’lar (card görünüm)
  const handleCardClick = useCallback(
    (_e: MouseEvent<HTMLDivElement>) => {
      onDetail?.(user);
    },
    [onDetail, user]
  );

  const handleCardKeyDown = useCallback(
    (e: KeyboardEvent<HTMLDivElement>) => {
      if ((e.key === 'Enter' || e.key === ' ') && onDetail) {
        e.preventDefault();
        onDetail(user);
      }
    },
    [onDetail, user]
  );

  // Root handler’lar (row görünüm)
  const handleRowClick = useCallback(
    (_e: MouseEvent<HTMLTableRowElement>) => {
      onDetail?.(user);
    },
    [onDetail, user]
  );

  const handleRowKeyDown = useCallback(
    (e: KeyboardEvent<HTMLTableRowElement>) => {
      if ((e.key === 'Enter' || e.key === ' ') && onDetail) {
        e.preventDefault();
        onDetail(user);
      }
    },
    [onDetail, user]
  );

  // Ortak buton grubu
  const renderActionButtons = (): ReactNode => (
    <>
      <Button
        variant="light"
        size="sm"
        onClick={handleEdit}
        className="usercard-btn"
        aria-label={`Edit user ${user.id}: ${user.name}`}
      >
        Edit
      </Button>
      <Button
        variant="light"
        size="sm"
        onClick={handleDelete}
        className="usercard-btn"
        aria-label={`Delete user ${user.id}: ${user.name}`}
      >
        Delete
      </Button>
    </>
  );

  // Row görünümü
  if (variant === 'row') {
    return (
      <tr
        className="usercard-row"
        onClick={handleRowClick}
        onKeyDown={handleRowKeyDown}
        role="button"
        tabIndex={onDetail ? 0 : -1}
        aria-label={`User: ${user.name} (@${user.username})`}
      >
        <td className="usercard-row-cell usercard-row-id">#{user.id}</td>
        <td className="usercard-row-cell">
          <div className="usercard-row-name">{user.name}</div>
        </td>
        <td className="usercard-row-cell">
          <div className="usercard-row-username">@{user.username}</div>
        </td>
        <td className="usercard-row-cell">
          <div className="usercard-row-email">{user.email}</div>
        </td>
        <td className="usercard-row-cell">
          <div className="usercard-row-actions">{renderActionButtons()}</div>
        </td>
      </tr>
    );
  }

  // Card görünümü
  return (
    <div
      className="usercard"
      onClick={handleCardClick}
      onKeyDown={handleCardKeyDown}
      role="button"
      tabIndex={onDetail ? 0 : -1}
      aria-label={`User: ${user.name} (@${user.username})`}
    >
      <div className="usercard-content">
        <div className="usercard-header">
          <h3 className="usercard-title">{user.name}</h3>
          <div className="usercard-id">#{user.id}</div>
        </div>
        <div className="usercard-username">@{user.username}</div>
        <div className="usercard-email">{user.email}</div>
      </div>
      <div className="usercard-actions">{renderActionButtons()}</div>
    </div>
  );
}
