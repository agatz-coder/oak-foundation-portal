import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import './Header.css';

const NAV_ITEMS = [
  { label: 'Home', path: '/' },
  { label: 'About', path: '/about' },
  { label: 'Programmes', path: '/programmes' },
  { label: 'Knowledge', path: '/knowledge' },
  { label: 'Help', path: '/help' },
  { label: 'Contact', path: '/contact' },
];

function Header() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const location = useLocation();

  const toggleMobileMenu = () => {
    setMobileMenuOpen(!mobileMenuOpen);
  };

  const closeMobileMenu = () => {
    setMobileMenuOpen(false);
  };

  return (
    <header className="header">
      <div className="header-inner container">
        <Link to="/" className="header-logo" onClick={closeMobileMenu}>
          <img
            src={process.env.PUBLIC_URL + '/oak-logo.svg'}
            alt="OAK Foundation"
            className="logo-img"
          />
        </Link>

        <nav className={`header-nav ${mobileMenuOpen ? 'is-open' : ''}`}>
          {NAV_ITEMS.map((item) => (
            <Link
              key={item.path}
              to={item.path}
              className={`nav-link ${location.pathname === item.path ? 'is-active' : ''}`}
              onClick={closeMobileMenu}
            >
              {item.label}
            </Link>
          ))}
        </nav>

        <button
          className="mobile-menu-btn"
          onClick={toggleMobileMenu}
          aria-label={mobileMenuOpen ? 'Close menu' : 'Open menu'}
          aria-expanded={mobileMenuOpen}
        >
          <span className={`hamburger ${mobileMenuOpen ? 'is-open' : ''}`}>
            <span></span>
            <span></span>
            <span></span>
          </span>
        </button>
      </div>
    </header>
  );
}

export default Header;
