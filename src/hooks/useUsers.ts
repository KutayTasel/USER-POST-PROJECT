import { useCallback, useEffect, useState } from 'react';
import { createUser, deleteUser, getUser, getUsers, updateUser } from '@/services/users.service';
import type { NewUser, UpdateUser, User } from '@/types/user';

type Status = 'idle' | 'loading' | 'success' | 'error';

export interface UseUsersState {
  users: User[];
  status: Status;
  error: string | undefined;
}

export interface UseUsersActions {
  load: () => Promise<void>;
  create: (input: NewUser) => Promise<User>;
  update: (id: number, input: UpdateUser) => Promise<User>;
  remove: (id: number) => Promise<void>;
  reloadOne: (id: number) => Promise<User>;
}

export type UseUsersReturn = UseUsersState & UseUsersActions;

/**
 * useUsers
 * - Kullanıcı verilerini yükler ve yönetir
 * - CRUD operasyonlarını kapsar
 */
export function useUsers(): UseUsersReturn {
  // ---------- STATE ----------
  const [users, setUsers] = useState<User[]>([]);
  const [status, setStatus] = useState<Status>('idle');
  const [error, setError] = useState<string | undefined>(undefined);

  // ---------- LOAD ALL ----------
  const load = useCallback(async (): Promise<void> => {
    setStatus('loading');
    setError(undefined);
    try {
      const data = await getUsers();
      setUsers(data);
      setStatus('success');
    } catch (e: unknown) {
      const msg = e instanceof Error ? e.message : 'Failed to load users';
      setError(msg);
      setStatus('error');
    }
  }, []);

  // ---------- CREATE ----------
  const create = useCallback(async (input: NewUser): Promise<User> => {
    setError(undefined);
    try {
      const created = await createUser(input);
      setUsers((prev) => [...prev, created]);
      return created;
    } catch (e: unknown) {
      const msg = e instanceof Error ? e.message : 'Failed to create user';
      setError(msg);
      throw e;
    }
  }, []);

  // ---------- UPDATE ----------
  const update = useCallback(async (id: number, input: UpdateUser): Promise<User> => {
    setError(undefined);
    try {
      const updated = await updateUser(id, input);
      setUsers((prev) => prev.map((u) => (u.id === id ? { ...u, ...updated } : u)));
      return updated;
    } catch (e: unknown) {
      const msg = e instanceof Error ? e.message : 'Failed to update user';
      setError(msg);
      throw e;
    }
  }, []);

  // ---------- DELETE ----------
  const remove = useCallback(async (id: number): Promise<void> => {
    setError(undefined);
    try {
      await deleteUser(id);
      setUsers((prev) => prev.filter((u) => u.id !== id));
    } catch (e: unknown) {
      const msg = e instanceof Error ? e.message : 'Failed to delete user';
      setError(msg);
      throw e;
    }
  }, []);

  // ---------- RELOAD SINGLE ----------
  const reloadOne = useCallback(async (id: number): Promise<User> => {
    setError(undefined);
    try {
      const fresh = await getUser(id);
      setUsers((prev) => prev.map((u) => (u.id === id ? fresh : u)));
      return fresh;
    } catch (e: unknown) {
      const msg = e instanceof Error ? e.message : 'Failed to reload user';
      setError(msg);
      throw e;
    }
  }, []);

  // ---------- AUTO LOAD ON INIT ----------
  useEffect((): void => {
    void load().catch(() => {});
  }, [load]);

  return { users, status, error, load, create, update, remove, reloadOne };
}
