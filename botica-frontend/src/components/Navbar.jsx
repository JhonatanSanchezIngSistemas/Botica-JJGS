import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import './Navbar.css';

const Navbar = () => {
  const { user, isAuthenticated, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const handleLogout = () => {
    logout();
    navigate('/login');
    setIsMenuOpen(false);
  };

  const handleNavClick = (sectionId) => {
    setIsMenuOpen(false);
    const element = document.getElementById(sectionId);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const isActive = (path) => location.pathname === path;

  return (
    <nav className="navbar">
      <div className="navbar-container">
        {/* Logo */}
        <Link to="/" className="navbar-logo">
          <img
            src="/logo-encapbot.png"
            alt="Encapbot Logo"
            className="logo-icon"
          />
          ENCAPBOT
        </Link>

        {/* Hamburger Menu */}
        <div
          className={`hamburger ${isMenuOpen ? 'active' : ''}`}
          onClick={() => setIsMenuOpen(!isMenuOpen)}
        >
          <span></span>
          <span></span>
          <span></span>
        </div>

        {/* Menu Items */}
        <div className={`navbar-menu ${isMenuOpen ? 'active' : ''}`}>
          <div className="navbar-items">
            {location.pathname === '/' ? (
              <>
                <a
                  href="#caracteristicas"
                  className="nav-link"
                  onClick={() => handleNavClick('caracteristicas')}
                >
                  Características
                </a>
                <a
                  href="#precios"
                  className="nav-link"
                  onClick={() => handleNavClick('precios')}
                >
                  Precios
                </a>
                <a
                  href="#contacto"
                  className="nav-link"
                  onClick={() => handleNavClick('contacto')}
                >
                  Contacto
                </a>
              </>
            ) : (
              <>
                <Link
                  to="/"
                  className="nav-link"
                  onClick={() => setIsMenuOpen(false)}
                >
                  Inicio
                </Link>
              </>
            )}
          </div>

          {/* Auth Section */}
          <div className="navbar-auth">
            {isAuthenticated ? (
              <>
                <div className="user-info">
                  <span className="username">{user?.username || 'Usuario'}</span>
                </div>
                <Link
                  to="/dashboard"
                  className={`nav-btn ${isActive('/dashboard') ? 'active' : ''}`}
                  onClick={() => setIsMenuOpen(false)}
                >
                  Dashboard
                </Link>
                <button
                  className="nav-btn logout-btn"
                  onClick={handleLogout}
                >
                  Cerrar Sesión
                </button>
              </>
            ) : (
              <>
                <Link
                  to="/login"
                  className={`nav-btn ${isActive('/login') ? 'active' : ''}`}
                  onClick={() => setIsMenuOpen(false)}
                >
                  Iniciar Sesión
                </Link>
              </>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
