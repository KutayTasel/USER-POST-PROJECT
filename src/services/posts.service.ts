import { getJson, mutateJson, deleteJson } from '@/services/api';
import type { Post, NewPost, UpdatePost } from '@/types/post';

/**
 * Tüm postları getirir
 */
export async function getPosts(): Promise<Post[]> {
  return getJson<Post[]>('/posts');
}

/**
 * Tek bir post detayını getirir
 */
export async function getPost(id: number): Promise<Post> {
  return getJson<Post>(`/posts/${id}`);
}

/**
 * Belirli bir kullanıcıya ait postları getirir
 */
export async function getPostsByUser(userId: number): Promise<Post[]> {
  return getJson<Post[]>(`/posts?userId=${userId}`);
}

/**
 * Yeni post oluşturur
 */
export async function createPost(payload: NewPost): Promise<Post> {
  return mutateJson<NewPost, Post>('post', '/posts', payload);
}

/**
 * Var olan postu günceller (kısmi update için PATCH)
 */
export async function updatePost(id: number, payload: UpdatePost): Promise<Post> {
  return mutateJson<UpdatePost, Post>('patch', `/posts/${id}`, payload);
}

/**
 * Post siler
 */
export async function deletePost(id: number): Promise<void> {
  return deleteJson(`/posts/${id}`);
}
