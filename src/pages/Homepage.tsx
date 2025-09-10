import type { JSX } from 'react';

/**
 * HomePage
 * - Giriş ekranı
 * - Kullanıcıya Users veya Posts sayfalarına yönlenmesi için bilgi verir
 */
export default function HomePage(): JSX.Element {
  return (
    <main className="flex items-center justify-center min-h-screen p-6">
      <div className="max-w-2xl text-center">
        <h1 className="mb-6 text-4xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
          Task Board — Sample
        </h1>
        <p className="text-lg text-gray-700 leading-relaxed">
          You can navigate to the Users or Posts page from the{' '}
          <strong className="text-gray-900 font-semibold">Tasks</strong> menu on the left.
        </p>
      </div>
    </main>
  );
}
