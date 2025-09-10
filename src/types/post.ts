/**
 * Post modelini temsil eden tip
 */
export interface Post {
  userId: number; // Post'un bağlı olduğu kullanıcı
  id: number; // Post ID'si
  title: string; // Başlık
  body: string; // İçerik
}

/**
 * Yeni post oluştururken kullanılan tip (id hariç)
 */
export type NewPost = Omit<Post, 'id'>;

/**
 * Post güncellerken kullanılan tip (id hariç kısmi güncelleme)
 */
export type UpdatePost = Partial<Omit<Post, 'id'>>;
