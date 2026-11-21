import React, { useState } from 'react';
import { Link, NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { 
  BookOpen, 
  PenSquare, 
  User, 
  LogOut, 
  Menu, 
  X, 
  Layers
} from 'lucide-react';

const Navbar = () => {
  const { user, isAuthenticated, logout } = useAuth();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    setMobileMenuOpen(false);
    navigate('/');
  };

  const closeMenu = () => setMobileMenuOpen(false);

  return (
    <header className="navbar">
      <div className="navbar-container">
        {/* Brand Logo */}
        <Link to="/" className="navbar-brand" onClick={closeMenu}>
          <div className="brand-icon">
            <BookOpen size={22} className="brand-svg" />
          </div>
          <span className="brand-text">Blog<span className="brand-accent">Sphere</span></span>
        </Link>

        {/* Desktop Navigation Links */}
        <nav className="nav-links desktop-only">
          <NavLink 
            to="/" 
            className={({ isActive }) => (isActive ? 'nav-link active' : 'nav-link')}
            end
          >
            Home
          </NavLink>
          {isAuthenticated && (
            <>
              <NavLink 
                to="/my-blogs" 
                className={({ isActive }) => (isActive ? 'nav-link active' : 'nav-link')}
              >
                <Layers size={16} />
                <span>My Blogs</span>
              </NavLink>
              <NavLink 
                to="/create-blog" 
                className={({ isActive }) => (isActive ? 'nav-link active' : 'nav-link')}
              >
                <PenSquare size={16} />
                <span>Create Blog</span>
              </NavLink>
            </>
          )}
        </nav>

        {/* Desktop Auth Controls */}
        <div className="nav-auth desktop-only">
          {isAuthenticated ? (
            <div className="user-menu">
              <div className="user-badge" title={user?.email}>
                <div className="user-avatar-initials">
                  {user?.name ? user.name.charAt(0).toUpperCase() : 'U'}
                </div>
                <span className="user-name">{user?.name}</span>
              </div>
              <button 
                onClick={handleLogout} 
                className="btn btn-outline btn-sm logout-btn"
                title="Log out"
              >
                <LogOut size={16} />
                <span>Logout</span>
              </button>
            </div>
          ) : (
            <div className="auth-buttons">
              <Link to="/login" className="btn btn-ghost btn-sm">
                Login
              </Link>
              <Link to="/register" className="btn btn-primary btn-sm">
                Register
              </Link>
            </div>
          )}
        </div>

        {/* Mobile Hamburger Toggle */}
        <button 
          className="mobile-menu-toggle mobile-only" 
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          aria-label="Toggle menu"
        >
          {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </div>

      {/* Mobile Dropdown Menu */}
      {mobileMenuOpen && (
        <div className="mobile-menu mobile-only">
          <nav className="mobile-nav-links">
            <NavLink 
              to="/" 
              className={({ isActive }) => (isActive ? 'mobile-nav-link active' : 'mobile-nav-link')}
              onClick={closeMenu}
              end
            >
              Home
            </NavLink>
            {isAuthenticated ? (
              <>
                <NavLink 
                  to="/my-blogs" 
                  className={({ isActive }) => (isActive ? 'mobile-nav-link active' : 'mobile-nav-link')}
                  onClick={closeMenu}
                >
                  <Layers size={18} />
                  <span>My Blogs</span>
                </NavLink>
                <NavLink 
                  to="/create-blog" 
                  className={({ isActive }) => (isActive ? 'mobile-nav-link active' : 'mobile-nav-link')}
                  onClick={closeMenu}
                >
                  <PenSquare size={18} />
                  <span>Create Blog</span>
                </NavLink>
                <div className="mobile-user-section">
                  <div className="mobile-user-info">
                    <div className="user-avatar-initials">
                      {user?.name ? user.name.charAt(0).toUpperCase() : 'U'}
                    </div>
                    <div>
                      <div className="mobile-user-name">{user?.name}</div>
                      <div className="mobile-user-email">{user?.email}</div>
                    </div>
                  </div>
                  <button onClick={handleLogout} className="btn btn-outline btn-full logout-btn">
                    <LogOut size={16} />
                    <span>Logout</span>
                  </button>
                </div>
              </>
            ) : (
              <div className="mobile-auth-buttons">
                <Link to="/login" className="btn btn-outline btn-full" onClick={closeMenu}>
                  Login
                </Link>
                <Link to="/register" className="btn btn-primary btn-full" onClick={closeMenu}>
                  Register
                </Link>
              </div>
            )}
          </nav>
        </div>
      )}
    </header>
  );
};

export default Navbar;
