import type { ReactNode } from 'react';
import '../../assets/styles/footer.css';

/**
 * Footer bileşeni
 * - Yıl bilgisini dinamik olarak gösterir
 * - Privacy, Terms, Support gibi linkler içerir
 */
export default function Footer(): ReactNode {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="footer-container">
      <div className="footer-inner">
        <div className="footer-content">
          <div className="footer-copyright">© {currentYear} DemoProject. All rights reserved.</div>
          <div className="footer-links">
            <a href="#" className="footer-link">
              Privacy
            </a>
            <a href="#" className="footer-link">
              Terms
            </a>
            <a href="#" className="footer-link">
              Support
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}
