import type { ReactNode } from 'react';
import { useEffect, useMemo, useState, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import type { NewUser, UpdateUser, User } from '@/types/user';
import { useUsers } from '@/hooks/useUsers';
import { usePosts } from '@/hooks/usePosts';
import { UserList } from '@/components/users/UserList';
import { UserForm } from '@/components/users/UserForm';
import { UserViewModal } from '@/components/users/UserModal';
import '@/assets/styles/animation.css';

interface GridClasses {
  readonly main: string;
  readonly header: string;
  readonly section: string;
  readonly formColumn: string;
  readonly listColumn: string;
}

const GRID_CLASSES: GridClasses = {
  main: 'mx-auto max-w-6xl p-4 sm:p-6 pb-20',
  header: 'mb-6 flex flex-wrap items-center justify-between gap-3',
  section: 'grid grid-cols-1 lg:grid-cols-2 gap-8',
  formColumn: 'w-full flex flex-col justify-center min-h-[600px]',
  listColumn: 'w-full flex flex-col justify-start',
};

/**
 * UsersPage
 * - Kullanıcı CRUD işlemleri yönetilir
 * - Sol kısımda form, sağ kısımda liste bulunur
 * - Modal ile kullanıcı detayları ve post sayısı gösterilir
 * - "View Posts" → ilgili kullanıcının post sayfasına yönlendirir
 */
export default function UsersPage(): ReactNode {
  const { users, status, error, load, create, update, remove } = useUsers();
  const { posts, load: loadPosts } = usePosts();

  const [editing, setEditing] = useState<User | null>(null);
  const [viewingUser, setViewingUser] = useState<User | null>(null);
  const navigate = useNavigate();

  // İlk yüklemede kullanıcılar + postlar
  useEffect(() => {
    void Promise.all([load().catch(() => {}), loadPosts().catch(() => {})]);
  }, [load, loadPosts]);

  // Kullanıcıya ait post sayısını hesapla
  const postCountByUser = useMemo(() => {
    const map = new Map<number, number>();
    for (const post of posts) {
      const currentCount = map.get(post.userId) ?? 0;
      map.set(post.userId, currentCount + 1);
    }
    return map;
  }, [posts]);

  // CRUD handler’ları
  const handleCreate = useCallback(
    async (input: NewUser): Promise<void> => {
      await create(input);
      setEditing(null);
    },
    [create]
  );

  const handleUpdate = useCallback(
    async (id: number, input: UpdateUser): Promise<void> => {
      await update(id, input);
      setEditing(null);
    },
    [update]
  );

  const handleDelete = useCallback(
    async (id: number): Promise<void> => {
      await remove(id);

      // Silinen kullanıcı editleniyorsa/modal açıksa kapat
      setEditing((previousEditing) => (previousEditing?.id === id ? null : previousEditing));
      setViewingUser((previousViewingUser) =>
        previousViewingUser?.id === id ? null : previousViewingUser
      );
    },
    [remove]
  );

  // Form submit wrapper’ları (async hataları swallow et)
  const submitCreate = useCallback(
    (input: NewUser): void => {
      void handleCreate(input).catch(() => {});
    },
    [handleCreate]
  );

  const submitUpdate = useCallback(
    (input: UpdateUser): void => {
      if (!editing) return;
      void handleUpdate(editing.id, input).catch(() => {});
    },
    [handleUpdate, editing]
  );

  const onDeleteUser = useCallback(
    (id: number): void => {
      void handleDelete(id).catch(() => {});
    },
    [handleDelete]
  );

  // Modal + navigation handler’ları
  const handleView = useCallback((user: User): void => {
    setViewingUser(user);
  }, []);

  const handleCloseModal = useCallback((): void => {
    setViewingUser(null);
  }, []);

  const handleViewPosts = useCallback((): void => {
    if (!viewingUser) return;

    const userId = viewingUser.id;
    setViewingUser(null);
    void navigate(`/posts?userId=${userId}`);
  }, [navigate, viewingUser]);

  // Edit işlemi
  const handleCancelEdit = useCallback((): void => {
    setEditing(null);
  }, []);

  const handleEditUser = useCallback((user: User): void => {
    setEditing(user);
  }, []);

  const userPostCount = viewingUser ? (postCountByUser.get(viewingUser.id) ?? 0) : 0;

  return (
    <main className={GRID_CLASSES.main}>
      <header className={GRID_CLASSES.header}>
        <h1 className="text-2xl font-bold">Users Management</h1>
        <div className="flex items-center gap-3 flex-wrap">
          <div className="text-sm text-gray-600">
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
          <p>{error}</p>
        </div>
      )}

      {status === 'loading' && (
        <div className="text-center py-8">
          <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
          <p className="mt-2 text-gray-600">Loading users...</p>
        </div>
      )}

      <section className={GRID_CLASSES.section}>
        {/* Form alanı */}
        <div className={GRID_CLASSES.formColumn}>
          {editing ? (
            <UserForm
              mode="update"
              initial={editing}
              onCancel={handleCancelEdit}
              onSubmit={submitUpdate}
            />
          ) : (
            <UserForm mode="create" onCancel={handleCancelEdit} onSubmit={submitCreate} />
          )}
        </div>

        {/* Liste alanı */}
        <div className={GRID_CLASSES.listColumn}>
          <UserList
            items={users}
            onEdit={handleEditUser}
            onDelete={onDeleteUser}
            onView={handleView}
            view="modern"
          />
        </div>
      </section>

      {/* Detay modal */}
      {viewingUser && (
        <UserViewModal
          user={viewingUser}
          postCount={userPostCount}
          onClose={handleCloseModal}
          onViewPosts={handleViewPosts}
        />
      )}
    </main>
  );
}
