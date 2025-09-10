import type { ReactNode } from 'react';
import { useState, useCallback } from 'react';
import { Outlet } from 'react-router-dom';
import Navbar from './Navbar';
import Sidebar from './Sidebar';
import Footer from './Footer';
import { RouteTransitionPulse } from '@/components/layout/routeTransitionPulse';
import { usePersistentBoolean, useBodyScrollLock } from '@/hooks/useLayout';
import type { PersistentBooleanReturn } from '@/hooks/useLayout';
import { buildSidebarClasses, buildMainClasses, buildOverlayClasses } from '@/utils/layoutUtils';
import { STORAGE_KEYS } from '@/constants/layoutconstants';
import '../../assets/styles/layout.css';

/**
 * Uygulamanın ana Layout bileşeni
 * - Navbar, Sidebar, Footer ve içerik alanını düzenler
 * - Sidebar açık/kapalı ve collapse state'lerini yönetir
 * - RouteTransitionPulse ile sayfa geçiş efektini gösterir
 */
export default function Layout(): ReactNode {
  const [sidebarOpen, setSidebarOpen] = useState<boolean>(false);

  // Collapse state localStorage'da saklanır
  const [collapsed, setCollapsed]: PersistentBooleanReturn = usePersistentBoolean(
    STORAGE_KEYS.SIDEBAR_COLLAPSED,
    false
  );

  // Sidebar açıldığında body scroll kilitlenir
  useBodyScrollLock(sidebarOpen);

  const handleToggleSidebar = useCallback((): void => {
    setSidebarOpen((prev) => !prev);
  }, []);

  const handleCloseSidebar = useCallback((): void => {
    setSidebarOpen(false);
  }, []);

  const handleToggleCollapse = useCallback((): void => {
    setCollapsed((prev) => !prev);
  }, [setCollapsed]);

  // Klavye kısayolu: Escape, Enter veya Space ile sidebar kapatılır
  const handleKeyDown = useCallback(
    (e: React.KeyboardEvent): void => {
      if (e.key === 'Escape' || e.key === 'Enter' || e.key === ' ') {
        handleCloseSidebar();
      }
    },
    [handleCloseSidebar]
  );

  const sidebarClasses = buildSidebarClasses(sidebarOpen, collapsed);
  const mainClasses = buildMainClasses(collapsed);
  const overlayClasses = buildOverlayClasses(sidebarOpen);

  return (
    <div className="layout-container">
      <header role="banner" className="layout-header">
        <Navbar onToggleSidebar={handleToggleSidebar} />
      </header>
      <RouteTransitionPulse />
      <div className="layout-content">
        <div
          className={overlayClasses}
          onClick={handleCloseSidebar}
          role="button"
          tabIndex={0}
          onKeyDown={handleKeyDown}
          aria-label="Close sidebar"
        />
        <aside
          className={sidebarClasses}
          role="navigation"
          aria-label="Main navigation"
          aria-expanded={sidebarOpen}
        >
          <Sidebar
            collapsed={collapsed}
            onToggleCollapse={handleToggleCollapse}
            onNavigate={handleCloseSidebar}
          />
        </aside>
        <main className={mainClasses} role="main" aria-label="Main content">
          <div className="layout-main-inner">
            <Outlet />
          </div>
        </main>
      </div>
      <footer role="contentinfo" className="layout-footer">
        <Footer />
      </footer>
    </div>
  );
}
