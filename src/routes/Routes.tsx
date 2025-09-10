import { createBrowserRouter } from 'react-router-dom';
import Layout from '@/components/layout/AppLayout';
import HomePage from '@/pages/Homepage';
import UsersPage from '@/pages/UsersPage';
import PostsPage from '@/pages/PostsPage';

/**
 * Uygulama Router Konfigürasyonu
 * - `Layout` → Navbar, Sidebar, Footer gibi ortak alanları içerir
 * - Alt route’lar children içinde tanımlanır
 * - Hata ve 404 için fallback elementler vardır
 */
export const router = createBrowserRouter([
  {
    path: '/',
    element: <Layout />, // Ortak layout
    errorElement: <div className="p-4">Something went wrong.</div>, // Global error fallback
    children: [
      { index: true, element: <HomePage /> }, // Ana sayfa
      { path: 'users', element: <UsersPage /> }, // Kullanıcılar
      { path: 'posts', element: <PostsPage /> }, // Postlar
      { path: '*', element: <div className="p-4">Not Found</div> }, // 404 fallback
    ],
  },
]);
