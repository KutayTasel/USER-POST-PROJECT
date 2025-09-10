/**
 * User modelini temsil eden tip
 */
export interface User {
  id: number; // Kullanıcı ID'si
  name: string; // Tam isim
  username: string; // Kullanıcı adı
  email: string; // E-posta adresi
}

/**
 * Yeni kullanıcı oluştururken kullanılan tip (id hariç)
 */
export type NewUser = Omit<User, 'id'>;

/**
 * Kullanıcı güncellerken kullanılan tip (id hariç kısmi güncelleme)
 */
export type UpdateUser = Partial<Omit<User, 'id'>>;
