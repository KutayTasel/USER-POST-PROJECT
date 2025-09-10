import { useCallback, useEffect, useMemo, useState } from 'react';
import {
  createPost,
  deletePost,
  getPost,
  getPosts,
  getPostsByUser,
  updatePost,
} from '@/services/posts.service';
import type { NewPost, Post, UpdatePost } from '@/types/post';

type Status = 'idle' | 'loading' | 'success' | 'error';

export interface UsePostsState {
  posts: Post[];
  status: Status;
  error: string | undefined;
  selectedUserId: number | undefined;
  filtered: Post[];
}

export interface UsePostsActions {
  load: () => Promise<void>;
  create: (input: NewPost) => Promise<Post>;
  update: (id: number, input: UpdatePost) => Promise<Post>;
  remove: (id: number) => Promise<void>;
  filterByUser: (userId?: number) => void;
  reloadOne: (id: number) => Promise<Post>;
}

export type UsePostsReturn = UsePostsState & UsePostsActions;

/**
 * usePosts
 * - Post verilerini yükler ve yönetir
 * - CRUD operasyonlarını kapsar
 * - Kullanıcıya göre filtreleme sağlar
 */
export function usePosts(): UsePostsReturn {
  // ---------- STATE ----------
  const [posts, setPosts] = useState<Post[]>([]);
  const [status, setStatus] = useState<Status>('idle');
  const [error, setError] = useState<string | undefined>(undefined);
  const [selectedUserId, setSelectedUserId] = useState<number | undefined>(undefined);

  // ---------- LOAD ALL ----------
  const load = useCallback(async (): Promise<void> => {
    setStatus('loading');
    setError(undefined);
    try {
      const data = await getPosts();
      setPosts(data);
      setStatus('success');
    } catch (e: unknown) {
      const msg = e instanceof Error ? e.message : 'Failed to load posts';
      setError(msg);
      setStatus('error');
    }
  }, []);

  // ---------- CREATE ----------
  const create = useCallback(async (input: NewPost): Promise<Post> => {
    setError(undefined);
    try {
      const created = await createPost(input);
      setPosts((prev) => [...prev, created]);
      return created;
    } catch (e: unknown) {
      const msg = e instanceof Error ? e.message : 'Failed to create post';
      setError(msg);
      throw e;
    }
  }, []);

  // ---------- UPDATE ----------
  const update = useCallback(async (id: number, input: UpdatePost): Promise<Post> => {
    setError(undefined);
    try {
      const updated = await updatePost(id, input);
      setPosts((prev) => prev.map((p) => (p.id === id ? { ...p, ...updated } : p)));
      return updated;
    } catch (e: unknown) {
      const msg = e instanceof Error ? e.message : 'Failed to update post';
      setError(msg);
      throw e;
    }
  }, []);

  // ---------- DELETE ----------
  const remove = useCallback(async (id: number): Promise<void> => {
    setError(undefined);
    try {
      await deletePost(id);
      setPosts((prev) => prev.filter((p) => p.id !== id));
    } catch (e: unknown) {
      const msg = e instanceof Error ? e.message : 'Failed to delete post';
      setError(msg);
      throw e;
    }
  }, []);

  // ---------- RELOAD SINGLE ----------
  const reloadOne = useCallback(async (id: number): Promise<Post> => {
    setError(undefined);
    try {
      const fresh = await getPost(id);
      setPosts((prev) => prev.map((p) => (p.id === id ? fresh : p)));
      return fresh;
    } catch (e: unknown) {
      const msg = e instanceof Error ? e.message : 'Failed to reload post';
      setError(msg);
      throw e;
    }
  }, []);

  // ---------- AUTO FETCH BY USER FILTER ----------
  useEffect(() => {
    let alive = true;

    async function fetchBySelection(): Promise<void> {
      setStatus('loading');
      setError(undefined);
      try {
        const data =
          selectedUserId === undefined ? await getPosts() : await getPostsByUser(selectedUserId);
        if (alive) {
          setPosts(data);
          setStatus('success');
        }
      } catch (e: unknown) {
        if (alive) {
          const msg = e instanceof Error ? e.message : 'Failed to fetch posts';
          setError(msg);
          setStatus('error');
        }
      }
    }

    void fetchBySelection().catch(() => {});
    return () => {
      alive = false;
    };
  }, [selectedUserId]);

  // ---------- FILTER BY USER ----------
  const filterByUser = useCallback((userId?: number): void => {
    setSelectedUserId(userId);
  }, []);

  // ---------- MEMOIZED FILTERED ----------
  const filtered = useMemo<Post[]>(() => {
    if (selectedUserId === undefined) return posts;
    return posts.filter((p) => p.userId === selectedUserId);
  }, [posts, selectedUserId]);

  return {
    posts,
    status,
    error,
    selectedUserId,
    filtered,
    load,
    create,
    update,
    remove,
    filterByUser,
    reloadOne,
  };
}
