import type { JSX, KeyboardEvent as ReactKeyboardEvent } from 'react';
import { useMemo, useState } from 'react';
import type { User } from '@/types/user';
import { Button } from '@/components/common/Button';
import { UserCard } from './UserCard';
import '../../assets/styles/userlist.css';

export interface UserListProps {
  items: User[];
  onEdit: (user: User) => void;
  onDelete: (id: number) => void;
  onView?: (user: User) => void;
  view?: 'row' | 'card' | 'modern';
}

/**
 * UserList
 * - Kullanıcıları 3 farklı görünümde (modern, card, row) listeleme
 * - Sayfalama, edit/delete/view aksiyonlarını destekler
 */
export function UserList({
  items,
  onEdit,
  onDelete,
  onView,
  view = 'modern',
}: UserListProps): JSX.Element {
  // Sayfalama state
  const [currentPage, setCurrentPage] = useState(1);
  const [direction, setDirection] = useState<'next' | 'prev' | null>(null);

  // Aktif sayfadaki kullanıcılar
  const pageSize = 6;
  const totalPages = Math.max(1, Math.ceil(items.length / pageSize));
  const startIndex = (currentPage - 1) * pageSize;

  // Aktif sayfadaki kullanıcılar
  const pagedItems = useMemo(
    () => items.slice(startIndex, startIndex + pageSize),
    [items, startIndex]
  );

  // Sayfalama fonksiyonları
  const goPrev = (): void => {
    if (currentPage === 1) return;
    setDirection('prev');
    setCurrentPage((p) => Math.max(1, p - 1));
  };

  const goNext = (): void => {
    if (currentPage === totalPages) return;
    setDirection('next');
    setCurrentPage((p) => Math.min(totalPages, p + 1));
  };

  const pageAnimClass = 'animate-listSlideIn';

  // Klavye erişilebilirliği (Enter/Space ile detay açma)
  const handleItemKeyDown =
    (user: User) =>
    (e: ReactKeyboardEvent<HTMLDivElement>): void => {
      if ((e.key === 'Enter' || e.key === ' ') && onView) {
        e.preventDefault();
        onView(user);
      }
    };

  // --- Modern görünüm ---
  if (view === 'modern') {
    return (
      <div className="user-list-container flex flex-col h-full">
        <div className="user-list-header">
          <h2 className="user-list-title">👥 Team Directory</h2>
          <p className="user-list-subtitle">Browse and manage your users</p>
        </div>

        <div
          className={`user-list-content ${pageAnimClass}`}
          key={`${view}-${currentPage}-${direction}`}
        >
          {items.length > 0 ? (
            <div className="space-y-4">
              {pagedItems.map((user, idx) => (
                <div
                  key={user.id}
                  className="user-card-modern animate-listEnter"
                  style={{ animationDelay: `${idx * 40}ms` }}
                  onClick={() => onView?.(user)}
                  onKeyDown={handleItemKeyDown(user)}
                  role={onView ? 'button' : undefined}
                  tabIndex={onView ? 0 : -1}
                  aria-label={`Open posts of ${user.name} (@${user.username})`}
                >
                  <div className="user-card-head">
                    <div className="user-card-id" aria-hidden="true">
                      #{user.id}
                    </div>
                    <div className="user-card-meta">
                      <h3 className="user-card-name">{user.name}</h3>
                      <p className="user-card-sub">
                        @{user.username} • {user.email}
                      </p>
                    </div>

                    <div className="user-card-actions">
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          onEdit(user);
                        }}
                        className="user-card-btn user-card-btn--edit"
                        aria-label={`Edit user ${user.id}`}
                      >
                        <svg
                          width="12"
                          height="12"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"
                          />
                        </svg>
                        Edit
                      </button>
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          onDelete(user.id);
                        }}
                        className="user-card-btn user-card-btn--delete"
                        aria-label={`Delete user ${user.id}`}
                      >
                        <svg
                          width="12"
                          height="12"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                          />
                        </svg>
                        Delete
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="user-list-empty">
              <div className="user-list-empty-icon" aria-hidden="true">
                <svg width="40" height="40" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M17 20h5v-2a4 4 0 00-4-4h-1m-4 6H3v-2a4 4 0 014-4h6m-3-8a4 4 0 110 8 4 4 0 010-8z"
                  />
                </svg>
              </div>
              <h3>No users yet</h3>
              <p>Add team members to get started!</p>
            </div>
          )}
        </div>

        {/* Sayfa kontrolü */}
        <div className="flex justify-center items-center gap-3 mt-8 py-6 border-t border-gray-100">
          <button
            disabled={currentPage === 1}
            onClick={goPrev}
            className="flex items-center justify-center w-10 h-10 bg-white border-2 border-gray-200 rounded-lg text-gray-600 
                     hover:border-blue-400 hover:text-blue-600 hover:shadow-md hover:-translate-y-0.5 
                     disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:translate-y-0 disabled:hover:shadow-none
                     transition-all duration-300 ease-out"
            aria-label="Previous page"
          >
            <svg width="16" height="16" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M15 19l-7-7 7-7"
              />
            </svg>
          </button>

          <div
            className="px-4 py-2 bg-gradient-to-r from-blue-50 to-purple-50 border-2 border-blue-200 rounded-lg 
                          text-gray-700 font-semibold min-w-[140px] text-center"
          >
            Page {currentPage} of {totalPages}
          </div>

          <button
            disabled={currentPage === totalPages}
            onClick={goNext}
            className="flex items-center justify-center w-10 h-10 bg-white border-2 border-gray-200 rounded-lg text-gray-600 
                     hover:border-blue-400 hover:text-blue-600 hover:shadow-md hover:-translate-y-0.5 
                     disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:translate-y-0 disabled:hover:shadow-none
                     transition-all duration-300 ease-out"
            aria-label="Next page"
          >
            <svg width="16" height="16" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </button>
        </div>
      </div>
    );
  }

  // --- Card görünüm ---
  if (view === 'card') {
    return (
      <>
        <div
          className={`grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 ${pageAnimClass}`}
          key={`${view}-${currentPage}-${direction}`}
        >
          {pagedItems.map((u, idx) => {
            const itemClass = 'animate-listEnter';
            return (
              <div key={u.id} className={itemClass} style={{ animationDelay: `${idx * 40}ms` }}>
                <UserCard
                  user={u}
                  onEdit={onEdit}
                  onDelete={onDelete}
                  variant="card"
                  {...(onView ? { onDetail: onView } : {})}
                />
              </div>
            );
          })}
          {items.length === 0 && (
            <div className="col-span-full text-center py-8 text-gray-500">No users</div>
          )}
        </div>

        <div className="flex justify-center items-center gap-3 mt-8 py-6 border-t border-gray-100">
          <button
            disabled={currentPage === 1}
            onClick={goPrev}
            className="flex items-center justify-center w-10 h-10 bg-white border-2 border-gray-200 rounded-lg text-gray-600 
                     hover:border-blue-400 hover:text-blue-600 hover:shadow-md hover:-translate-y-0.5 
                     disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:translate-y-0 disabled:hover:shadow-none
                     transition-all duration-300 ease-out"
            aria-label="Previous page"
          >
            <svg width="16" height="16" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M15 19l-7-7 7-7"
              />
            </svg>
          </button>

          <div
            className="px-4 py-2 bg-gradient-to-r from-blue-50 to-purple-50 border-2 border-blue-200 rounded-lg 
                          text-gray-700 font-semibold min-w-[140px] text-center"
          >
            Page {currentPage} of {totalPages}
          </div>

          <button
            disabled={currentPage === totalPages}
            onClick={goNext}
            className="flex items-center justify-center w-10 h-10 bg-white border-2 border-gray-200 rounded-lg text-gray-600 
                     hover:border-blue-400 hover:text-blue-600 hover:shadow-md hover:-translate-y-0.5 
                     disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:translate-y-0 disabled:hover:shadow-none
                     transition-all duration-300 ease-out"
            aria-label="Next page"
          >
            <svg width="16" height="16" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </button>
        </div>
      </>
    );
  }

  // --- Row (tablo) görünüm ---
  return (
    <>
      <div
        className={`overflow-x-auto rounded-lg border border-gray-200 ${pageAnimClass}`}
        key={`${view}-${currentPage}-${direction}`}
      >
        <table className="w-full text-sm">
          <thead className="bg-gray-50 text-left">
            <tr>
              <th className="p-4 font-medium text-gray-700">ID</th>
              <th className="p-4 font-medium text-gray-700">Name</th>
              <th className="p-4 font-medium text-gray-700">Username</th>
              <th className="p-4 font-medium text-gray-700">Email</th>
              <th className="p-4 font-medium text-gray-700 w-48">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {pagedItems.map((u, idx) => (
              <tr
                key={u.id}
                className="animate-listEnter"
                style={{ animationDelay: `${idx * 40}ms` }}
              >
                <td className="p-4">#{u.id}</td>
                <td className="p-4">{u.name}</td>
                <td className="p-4">@{u.username}</td>
                <td className="p-4">{u.email}</td>
                <td className="p-4">
                  <div className="flex gap-2">
                    <Button
                      variant="ghost"
                      onClick={(): void => onEdit(u)}
                      aria-label={`Edit user ${u.id}`}
                    >
                      Edit
                    </Button>
                    <Button
                      variant="ghost"
                      onClick={(): void => onDelete(u.id)}
                      aria-label={`Delete user ${u.id}`}
                    >
                      Delete
                    </Button>
                    {onView && (
                      <Button
                        variant="ghost"
                        onClick={(): void => onView(u)}
                        aria-label={`View user ${u.id}`}
                      >
                        View
                      </Button>
                    )}
                  </div>
                </td>
              </tr>
            ))}
            {items.length === 0 && (
              <tr>
                <td className="p-8 text-center text-gray-500" colSpan={5}>
                  No users
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      <div className="flex justify-center items-center gap-3 mt-8 py-6 border-t border-gray-100">
        <button
          disabled={currentPage === 1}
          onClick={goPrev}
          className="flex items-center justify-center w-10 h-10 bg-white border-2 border-gray-200 rounded-lg text-gray-600 
                   hover:border-blue-400 hover:text-blue-600 hover:shadow-md hover:-translate-y-0.5 
                   disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:translate-y-0 disabled:hover:shadow-none
                   transition-all duration-300 ease-out"
          aria-label="Previous page"
        >
          <svg width="16" height="16" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M15 19l-7-7 7-7"
            />
          </svg>
        </button>

        <div
          className="px-4 py-2 bg-gradient-to-r from-blue-50 to-purple-50 border-2 border-blue-200 rounded-lg 
                        text-gray-700 font-semibold min-w-[140px] text-center"
        >
          Page {currentPage} of {totalPages}
        </div>

        <button
          disabled={currentPage === totalPages}
          onClick={goNext}
          className="flex items-center justify-center w-10 h-10 bg-white border-2 border-gray-200 rounded-lg text-gray-600 
                   hover:border-blue-400 hover:text-blue-600 hover:shadow-md hover:-translate-y-0.5 
                   disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:translate-y-0 disabled:hover:shadow-none
                   transition-all duration-300 ease-out"
          aria-label="Next page"
        >
          <svg width="16" height="16" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
          </svg>
        </button>
      </div>
    </>
  );
}
