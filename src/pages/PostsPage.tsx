import type { ReactNode, ChangeEvent } from 'react';
import { useEffect, useMemo, useState, useCallback } from 'react';
import { useSearchParams } from 'react-router-dom';
import type { NewPost, Post, UpdatePost } from '@/types/post';
import { usePosts } from '@/hooks/usePosts';
import { useUsers } from '@/hooks/useUsers';
import { PostList } from '@/components/posts/PostList';
import { PostForm } from '@/components/posts/PostForm';
import { PostViewModal } from '@/components/posts/PostModal';
import '@/assets/styles/animation.css';

/**
 * PostsPage
 * - Post CRUD işlemlerini ve kullanıcıya göre filtrelemeyi yönetir
 * - Sol kısımda form, sağ kısımda liste gösterilir
 * - Modal ile detay görüntülenir
 */
const GRID_CLASSES = {
  main: 'mx-auto max-w-6xl p-4 sm:p-6 pb-20',
  header: 'mb-6 flex flex-wrap items-center justify-between gap-3',
  section: 'grid grid-cols-1 lg:grid-cols-2 gap-8',
  formColumn: 'w-full flex flex-col justify-center min-h-[600px]',
  listColumn: 'w-full flex flex-col justify-start',
};

export default function PostsPage(): ReactNode {
  const { posts, status, error, load, create, update, remove, filterByUser, selectedUserId } =
    usePosts();
  const { users, load: loadUsers } = useUsers();

  const [editing, setEditing] = useState<Post | null>(null);
  const [viewingPost, setViewingPost] = useState<Post | null>(null);

  const [searchParams, setSearchParams] = useSearchParams();

  // URL parametresinden userId al → filtre uygula
  useEffect(() => {
    const param = searchParams.get('userId');
    const id = param ? Number(param) : undefined;
    filterByUser(id);
  }, [searchParams, filterByUser]);

  // İlk yükleme → postlar + kullanıcılar
  useEffect(() => {
    const hasParam = searchParams.has('userId');

    if (!hasParam) {
      void load().catch((err) => console.error('Failed to load posts:', err));
    }
    void loadUsers().catch((err) => console.error('Failed to load users:', err));
  }, [load, loadUsers, searchParams]);

  // Kullanıcı id → isim eşlemesi
  const userMap = useMemo(() => {
    const map = new Map<number, string>();
    for (const user of users) map.set(user.id, user.name);
    return map;
  }, [users]);

  const userOptions = useMemo(() => users.map((u) => ({ id: u.id, name: u.name })), [users]);

  const resolveUserName = useCallback(
    (userId: number): string => {
      return userMap.get(userId) ?? `Unknown User (${userId})`;
    },
    [userMap]
  );

  // CRUD handler’ları
  const handleCreate = useCallback(
    async (input: NewPost): Promise<void> => {
      await create(input);
      setEditing(null);
    },
    [create]
  );

  const handleUpdate = useCallback(
    async (id: number, input: UpdatePost): Promise<void> => {
      await update(id, input);
      setEditing(null);
    },
    [update]
  );

  const handleDelete = useCallback(
    async (id: number): Promise<void> => {
      await remove(id);
      if (editing?.id === id) setEditing(null);
      if (viewingPost?.id === id) setViewingPost(null);
    },
    [remove, editing?.id, viewingPost?.id]
  );

  const handleView = useCallback((post: Post) => setViewingPost(post), []);
  const handleEdit = useCallback((post: Post) => setEditing(post), []);
  const handleCancel = useCallback(() => setEditing(null), []);
  const handleCloseModal = useCallback(() => setViewingPost(null), []);

  // Kullanıcıya göre filtreleme
  const handleUserFilterChange = useCallback(
    (e: ChangeEvent<HTMLSelectElement>) => {
      const value = e.target.value;
      const id = value === '' ? undefined : Number(value);

      filterByUser(id);
      if (id === undefined) setSearchParams({});
      else setSearchParams({ userId: String(id) });
    },
    [filterByUser, setSearchParams]
  );

  return (
    <main className={GRID_CLASSES.main}>
      <header className={GRID_CLASSES.header}>
        <h1 className="text-2xl font-bold">Posts</h1>

        <div className="flex items-center gap-3 flex-wrap">
          <label htmlFor="userFilter" className="text-sm text-gray-700">
            Filter by user:
          </label>
          <select
            id="userFilter"
            className="rounded-md border border-gray-300 p-2 text-sm focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
            value={selectedUserId ?? ''}
            onChange={handleUserFilterChange}
            aria-label="Filter posts by user"
          >
            <option value="">All Users</option>
            {users.map((user) => (
              <option key={user.id} value={user.id}>
                {user.name}
              </option>
            ))}
          </select>

          <div className="ml-2 sm:ml-4 text-sm text-gray-600">
            Status: <strong className="text-gray-900">{status}</strong>
          </div>
        </div>
      </header>

      {error && (
        <div
          className="mb-6 rounded-md border border-red-300 bg-red-50 p-4 text-sm text-red-700"
          role="alert"
          aria-live="polite"
        >
          {error}
        </div>
      )}

      {status === 'loading' && (
        <div className="text-center py-8">
          <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
          <p className="mt-2 text-gray-600">Loading posts...</p>
        </div>
      )}

      <section className={GRID_CLASSES.section}>
        {/* Form alanı */}
        <div className={GRID_CLASSES.formColumn}>
          {editing ? (
            <PostForm
              mode="update"
              initial={editing}
              userOptions={userOptions}
              onCancel={handleCancel}
              onSubmit={(input: UpdatePost) => handleUpdate(editing.id, input)}
            />
          ) : (
            <PostForm
              mode="create"
              userOptions={userOptions}
              onCancel={handleCancel}
              onSubmit={handleCreate}
            />
          )}
        </div>

        {/* Liste alanı */}
        <div className={GRID_CLASSES.listColumn}>
          <PostList
            items={posts}
            resolveUserName={resolveUserName}
            onView={handleView}
            onEdit={handleEdit}
            onDelete={(id) => {
              void handleDelete(id);
            }}
            view="modern"
          />
        </div>
      </section>

      {viewingPost && (
        <PostViewModal post={viewingPost} userMap={userMap} onClose={handleCloseModal} />
      )}
    </main>
  );
}
