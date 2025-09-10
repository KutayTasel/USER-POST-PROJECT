import type { JSX } from 'react';
import type { Post } from '@/types/post';
import { useMemo, useState, useEffect } from 'react';
import { PostItem } from '@/components/posts/PostItem';
import '../../assets/styles/postlist.css';

export interface PostListProps {
  items: Post[];
  onEdit: (post: Post) => void;
  onDelete: (id: number) => void;
  onView?: (post: Post) => void;
  view?: 'row' | 'card' | 'modern';
  resolveUserName?: (userId: number) => string | undefined;
}

/**
 * PostList
 * - Postları row / card / modern görünümlerde listeler
 * - Sayfalama (pagination) ve basit animasyonlar içerir
 */
export function PostList({
  items,
  onEdit,
  onDelete,
  onView,
  view = 'modern',
  resolveUserName,
}: PostListProps): JSX.Element {
  // Sayfalama state
  const [currentPage, setCurrentPage] = useState(1);
  const [direction, setDirection] = useState<'next' | 'prev' | null>(null);

  const pageSize = 6;
  const totalPages = Math.max(1, Math.ceil(items.length / pageSize));

  // Yeni items geldiğinde sayfayı sıfırla
  useEffect(() => {
    setCurrentPage(1);
    setDirection(null);
  }, [items]);

  const currentPageSafe = Math.min(currentPage, totalPages);

  const startIndex = (currentPageSafe - 1) * pageSize;
  const pagedItems = useMemo(
    () => items.slice(startIndex, startIndex + pageSize),
    [items, startIndex]
  );

  // Sayfa değişim handler’ları
  const goPrev = (): void => {
    if (currentPageSafe === 1) return;
    setDirection('prev');
    setCurrentPage((p) => Math.max(1, p - 1));
  };

  const goNext = (): void => {
    if (currentPageSafe === totalPages) return;
    setDirection('next');
    setCurrentPage((p) => Math.min(totalPages, p + 1));
  };

  const pageAnimClass = 'animate-listSlideIn';

  /** Modern görünüm */
  if (view === 'modern') {
    return (
      <div className="post-list-container flex flex-col h-full">
        <div className="post-list-header">
          <h2 className="post-list-title">📚 Post Collection</h2>
          <p className="post-list-subtitle">Discover and manage your posts</p>
        </div>

        <div
          className={`post-list-content ${pageAnimClass}`}
          key={`${view}-${currentPageSafe}-${direction}`}
        >
          {items.length > 0 ? (
            <div className="space-y-6">
              {pagedItems.map((post, idx) => {
                const userName = resolveUserName?.(post.userId) ?? `User ${post.userId}`;
                return (
                  <div
                    key={post.id}
                    className="post-card animate-listEnter"
                    style={{ animationDelay: `${idx * 40}ms` }}
                    onClick={() => onView?.(post)}
                  >
                    <div className="post-card-header">
                      <div className="post-card-user">
                        <div className="post-card-user-info">
                          <h3>{post.title}</h3>
                          <p>
                            by {userName} • Post #{post.id}
                          </p>
                        </div>
                      </div>

                      <div className="post-card-actions">
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            onEdit(post);
                          }}
                          className="post-card-btn post-card-btn--edit"
                          aria-label={`Edit post ${post.id}`}
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
                            onDelete(post.id);
                          }}
                          className="post-card-btn post-card-btn--delete"
                          aria-label={`Delete post ${post.id}`}
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
                );
              })}
            </div>
          ) : (
            <div className="post-list-empty">
              <div className="post-list-empty-icon">
                <svg width="40" height="40" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M19 20H5a2 2 0 01-2-2V6a2 2 0 012-2h10a2 2 0 012 2v1m2 13a2 2 0 01-2-2V7m2 13a2 2 0 002-2V9a2 2 0 00-2-2h-2m-4-3H9M7 16h6M7 8h6v4H7V8z"
                  />
                </svg>
              </div>
              <h3>No posts yet</h3>
              <p>Create your first post to get started!</p>
            </div>
          )}
        </div>

        {/* Pagination */}
        <div className="flex justify-center items-center gap-3 mt-8 py-6 border-t border-gray-100">
          <button
            disabled={currentPageSafe === 1}
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
            Page {currentPageSafe} of {totalPages}
          </div>

          <button
            disabled={currentPageSafe === totalPages}
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

  /** Card görünüm */
  if (view === 'card') {
    return (
      <>
        <div
          className={`grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 ${pageAnimClass}`}
          key={`${view}-${currentPageSafe}-${direction}`}
        >
          {pagedItems.map((post, idx) => {
            const userName = resolveUserName?.(post.userId);
            const itemClass = 'animate-listEnter';
            if (onView) {
              return (
                <div
                  key={post.id}
                  className={itemClass}
                  style={{ animationDelay: `${idx * 40}ms` }}
                >
                  <PostItem
                    post={post}
                    onEdit={onEdit}
                    onDelete={onDelete}
                    onDetail={onView}
                    variant="card"
                    userName={userName}
                  />
                </div>
              );
            }
            return (
              <div key={post.id} className={itemClass} style={{ animationDelay: `${idx * 40}ms` }}>
                <PostItem
                  post={post}
                  onEdit={onEdit}
                  onDelete={onDelete}
                  variant="card"
                  userName={userName}
                />
              </div>
            );
          })}

          {items.length === 0 && (
            <div className="col-span-full text-center py-8 text-gray-500">Post bulunamadı</div>
          )}
        </div>

        <div className="flex justify-center items-center gap-3 mt-8 py-6 border-t border-gray-100">
          <button
            disabled={currentPageSafe === 1}
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
            Page {currentPageSafe} of {totalPages}
          </div>

          <button
            disabled={currentPageSafe === totalPages}
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

  /** Row (table) görünüm */
  return (
    <>
      <div
        className={`overflow-x-auto rounded-lg border border-gray-200 ${pageAnimClass}`}
        key={`${view}-${currentPageSafe}-${direction}`}
      >
        <table className="w-full text-sm">
          <thead className="bg-gray-50 text-left">
            <tr>
              <th className="p-4 font-medium text-gray-700">User</th>
              <th className="p-4 font-medium text-gray-700">ID</th>
              <th className="p-4 font-medium text-gray-700">Title</th>
              <th className="p-4 font-medium text-gray-700 w-48">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {pagedItems.map((post, idx) => {
              const userName = resolveUserName?.(post.userId);
              const rowClass = 'animate-listEnter';
              if (onView) {
                return (
                  <tr
                    key={post.id}
                    className={rowClass}
                    style={{ animationDelay: `${idx * 40}ms` }}
                  >
                    <PostItem
                      post={post}
                      onEdit={onEdit}
                      onDelete={onDelete}
                      onDetail={onView}
                      variant="row"
                      userName={userName}
                    />
                  </tr>
                );
              }
              return (
                <tr key={post.id} className={rowClass} style={{ animationDelay: `${idx * 40}ms` }}>
                  <PostItem
                    post={post}
                    onEdit={onEdit}
                    onDelete={onDelete}
                    variant="row"
                    userName={userName}
                  />
                </tr>
              );
            })}
            {items.length === 0 && (
              <tr>
                <td className="p-8 text-center text-gray-500" colSpan={4}>
                  Post not found
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      <div className="flex justify-center items-center gap-3 mt-8 py-6 border-t border-gray-100">
        <button
          disabled={currentPageSafe === 1}
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
          Page {currentPageSafe} of {totalPages}
        </div>

        <button
          disabled={currentPageSafe === totalPages}
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
