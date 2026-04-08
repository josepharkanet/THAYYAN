import { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { List, X, WhatsappLogo } from '@phosphor-icons/react';

const navLinks = [
  { path: '/', label: 'Home' },
  { path: '/products', label: 'Products' },
  { path: '/services', label: 'Services' },
  { path: '/about', label: 'About' },
  { path: '/contact', label: 'Contact' },
];

export default function Header() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const location = useLocation();

  const isActive = (path) => {
    if (path === '/') return location.pathname === '/';
    return location.pathname.startsWith(path);
  };

  return (
    <header className="fixed top-0 left-0 right-0 z-50 glass border-b border-black/5" data-testid="header">
      <div className="max-w-7xl mx-auto px-6 sm:px-12 lg:px-24">
        <div className="flex items-center justify-between h-20">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-3" data-testid="logo-link">
            <span className="font-heading text-2xl sm:text-3xl font-medium tracking-tight text-[#1A1A1A]">
              STONIC
            </span>
            <span className="hidden sm:inline font-body text-xs uppercase tracking-[0.2em] text-[#4A4A4A]">
              Export
            </span>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center gap-8" data-testid="desktop-nav">
            {navLinks.map((link) => (
              <Link
                key={link.path}
                to={link.path}
                className={`nav-link font-body text-sm uppercase tracking-wider ${
                  isActive(link.path) ? 'text-[#1A1A1A] font-medium' : 'text-[#4A4A4A]'
                }`}
                data-testid={`nav-link-${link.label.toLowerCase()}`}
              >
                {link.label}
              </Link>
            ))}
          </nav>

          {/* WhatsApp & Mobile Menu Toggle */}
          <div className="flex items-center gap-4">
            <a
              href="https://wa.me/919544982471"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2 px-4 py-2 bg-[#25D366] text-white rounded-sm hover:bg-[#20bd5a] transition-colors"
              data-testid="header-whatsapp-btn"
            >
              <WhatsappLogo weight="fill" size={20} />
              <span className="hidden sm:inline font-body text-sm">Chat</span>
            </a>

            <button
              className="md:hidden p-2"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              data-testid="mobile-menu-toggle"
            >
              {mobileMenuOpen ? <X size={24} /> : <List size={24} />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      {mobileMenuOpen && (
        <div className="md:hidden absolute top-20 left-0 right-0 bg-white border-b border-[#E5E5E5] shadow-lg" data-testid="mobile-menu">
          <nav className="flex flex-col py-4">
            {navLinks.map((link) => (
              <Link
                key={link.path}
                to={link.path}
                onClick={() => setMobileMenuOpen(false)}
                className={`px-6 py-3 font-body text-sm uppercase tracking-wider ${
                  isActive(link.path) ? 'text-[#1A1A1A] font-medium bg-[#F9F8F6]' : 'text-[#4A4A4A]'
                }`}
                data-testid={`mobile-nav-link-${link.label.toLowerCase()}`}
              >
                {link.label}
              </Link>
            ))}
          </nav>
        </div>
      )}
    </header>
  );
}
