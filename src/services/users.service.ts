import { getJson, mutateJson, deleteJson } from '@/services/api';
import type { User, NewUser, UpdateUser } from '@/types/user';

/**
 * Tüm kullanıcıları getirir
 */
export async function getUsers(): Promise<User[]> {
  return getJson<User[]>('/users');
}

/**
 * Tek bir kullanıcı detayını getirir
 */
export async function getUser(id: number): Promise<User> {
  return getJson<User>(`/users/${id}`);
}

/**
 * Yeni kullanıcı oluşturur
 */
export async function createUser(payload: NewUser): Promise<User> {
  return mutateJson<NewUser, User>('post', '/users', payload);
}

/**
 * Var olan kullanıcıyı günceller (kısmi update için PATCH)
 */
export async function updateUser(id: number, payload: UpdateUser): Promise<User> {
  return mutateJson<UpdateUser, User>('patch', `/users/${id}`, payload);
}

/**
 * Kullanıcı siler
 */
export async function deleteUser(id: number): Promise<void> {
  return deleteJson(`/users/${id}`);
}
