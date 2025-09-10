import type { ReactNode } from 'react';
import { Link, NavLink } from 'react-router-dom';
import { useCallback } from 'react';
import '../../assets/styles/navbar.css';

interface NavbarProps {
  onToggleSidebar: () => void;
}

interface LinkClassParams {
  isActive: boolean;
}

/**
 * Navbar link class helper
 * - Aktif sayfadaysa "navbar-link-active"
 * - Değilse "navbar-link-inactive"
 */
function linkClass({ isActive }: LinkClassParams): string {
  return `navbar-link-base ${isActive ? 'navbar-link-active' : 'navbar-link-inactive'}`;
}

/** Menü (hamburger) ikonu */
function MenuIcon(): ReactNode {
  return (
    <svg className="navbar-icon" viewBox="0 0 24 24" aria-hidden="true">
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={2}
        d="M4 6h16M4 12h16M4 18h16"
      />
    </svg>
  );
}

/** Home (ana sayfa) ikonu */
function HomeIcon(): ReactNode {
  return (
    <svg className="navbar-home-icon" viewBox="0 0 24 24" aria-hidden="true">
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={2}
        d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6"
      />
    </svg>
  );
}

/**
 * Navbar
 * - Sidebar toggle butonu, logo ve navigation linklerini içerir
 */
export default function Navbar({ onToggleSidebar }: NavbarProps): ReactNode {
  const handleSidebarToggle = useCallback((): void => {
    onToggleSidebar();
  }, [onToggleSidebar]);

  return (
    <div className="navbar-container">
      <div className="navbar-inner">
        <div className="navbar-content">
          <div className="navbar-left">
            <button
              type="button"
              onClick={handleSidebarToggle}
              className="navbar-menu-button"
              aria-label="Toggle sidebar"
              aria-expanded="false"
            >
              <MenuIcon />
            </button>

            <Link to="/" className="navbar-logo" aria-label="DemoProject - Go to homepage">
              DemoProject
            </Link>
          </div>

          {/* Orta kısım (şimdilik boş) */}
          <div className="navbar-center" />

          <nav className="navbar-nav" role="navigation" aria-label="Main navigation">
            <NavLink to="/" end className={linkClass} aria-label="Navigate to home page">
              <HomeIcon />
              Home
            </NavLink>
          </nav>
        </div>
      </div>
    </div>
  );
}
