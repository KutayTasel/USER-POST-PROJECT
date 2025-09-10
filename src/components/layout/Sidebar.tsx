import type { ReactNode } from 'react';
import { NavLink } from 'react-router-dom';
import { useCallback } from 'react';
import '../../assets/styles/sidebar.css';

interface SidebarProps {
  onNavigate?: () => void;
  collapsed: boolean;
  onToggleCollapse: () => void;
}

interface ItemClassParams {
  isActive: boolean;
}

/**
 * Sidebar link class helper
 * - Aktif sayfadaysa "active", değilse "inactive" class ekler
 */
function itemClass({ isActive }: ItemClassParams): string {
  return `sidebar-link ${isActive ? 'sidebar-link-active' : 'sidebar-link-inactive'}`;
}

/** Users sayfası ikonu */
function UsersIcon(): ReactNode {
  return (
    <svg className="sidebar-icon" viewBox="0 0 24 24" aria-hidden="true">
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={2}
        d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197m13.5-9a2.5 2.5 0 11-5 0 2.5 2.5 0 015 0z"
      />
    </svg>
  );
}

/** Posts sayfası ikonu */
function PostsIcon(): ReactNode {
  return (
    <svg className="sidebar-icon" viewBox="0 0 24 24" aria-hidden="true">
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={2}
        d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
      />
    </svg>
  );
}

interface ChevronIconProps {
  collapsed: boolean;
}

/** Sidebar expand/collapse ikonu */
function ChevronIcon({ collapsed }: ChevronIconProps): ReactNode {
  const iconClass = `sidebar-chevron ${collapsed ? 'sidebar-chevron-collapsed' : ''}`;
  return (
    <svg className={iconClass} viewBox="0 0 24 24" aria-hidden="true">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
    </svg>
  );
}

/**
 * Sidebar
 * - Collapse/expand edilebilir yan menü
 * - Users ve Posts sayfalarına yönlendirme yapar
 * - onNavigate ile dışarıdan sidebar kapanma kontrolü sağlanabilir
 */
export default function Sidebar({
  onNavigate,
  collapsed,
  onToggleCollapse,
}: SidebarProps): ReactNode {
  const navClass = `sidebar-nav ${collapsed ? 'sidebar-nav-collapsed' : 'sidebar-nav-expanded'}`;
  const headerClass = `sidebar-header ${collapsed ? 'sidebar-header-collapsed' : 'sidebar-header-expanded'}`;
  const toggleClass = `sidebar-toggle ${collapsed ? 'sidebar-toggle-collapsed' : 'sidebar-toggle-expanded'}`;

  const handleToggle = useCallback((): void => {
    onToggleCollapse();
  }, [onToggleCollapse]);

  const handleNavigate = useCallback((): void => {
    onNavigate?.();
  }, [onNavigate]);

  return (
    <nav
      className={navClass}
      role="navigation"
      aria-label="Sidebar navigation"
      data-collapsed={collapsed}
    >
      <div className={headerClass}>
        <button
          type="button"
          onClick={handleToggle}
          className={toggleClass}
          aria-label={collapsed ? 'Expand sidebar' : 'Collapse sidebar'}
          aria-expanded={!collapsed}
          title={collapsed ? 'Expand' : 'Collapse'}
        >
          {!collapsed && <div className="sidebar-toggle-label">Tasks</div>}
          <ChevronIcon collapsed={collapsed} />
        </button>
      </div>

      <ul className="sidebar-list" role="list">
        <li className="sidebar-list-item">
          <NavLink
            to="/users"
            className={itemClass}
            onClick={handleNavigate}
            title={collapsed ? 'Users' : ''}
            aria-label="Navigate to users page"
          >
            <UsersIcon />
            {!collapsed && <span className="sidebar-label">Users</span>}
            {collapsed && (
              <span className="sidebar-flyout" aria-hidden="true">
                Users
              </span>
            )}
          </NavLink>
        </li>
        <li className="sidebar-list-item">
          <NavLink
            to="/posts"
            className={itemClass}
            onClick={handleNavigate}
            title={collapsed ? 'Posts' : ''}
            aria-label="Navigate to posts page"
          >
            <PostsIcon />
            {!collapsed && <div className="sidebar-label">Posts</div>}
            {collapsed && (
              <div className="sidebar-flyout" aria-hidden="true">
                Posts
              </div>
            )}
          </NavLink>
        </li>
      </ul>

      {collapsed && (
        <div className="sidebar-divider" aria-hidden="true">
          <div className="sidebar-divider-line" />
        </div>
      )}
    </nav>
  );
}
