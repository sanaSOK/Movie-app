import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Home, MessagesSquare, MessageSquareText, Search, Bookmark, History, Sun, Moon, LogIn, LogOut, Menu, X } from 'lucide-react';
import { useFavorite } from '../../context/FavoriteContext';
import { useAuth } from '../../context/AuthContext';
import { getAvatarUrl } from '../../utils/avatar';
import logo from '../../assets/images/logo.png';
import './Navbar.css';

export default function Navbar() {
  const { watchlist, theme, toggleTheme } = useFavorite();
  const { user, logout, isAuthenticated } = useAuth();
  const location = useLocation();
  const [isMenuOpen, setIsMenuOpen] = React.useState(false);

  React.useEffect(() => {
    setIsMenuOpen(false);
  }, [location.pathname, location.search]);

  React.useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth > 1024) {
        setIsMenuOpen(false);
      }
    };
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  return (
    <header className="site-header">
      <div className="header-container">
        <Link to="/" className="brand-logo" aria-label="Home">
          <img src={logo} alt="missUmovie Logo" className="logo-image" />
        </Link>

        <nav className={`nav-menu ${isMenuOpen ? 'mobile-open' : ''}`}>
          {isAuthenticated && (
            <div className="mobile-profile-header">
              <img
                src={getAvatarUrl(user.avatar, user.username)}
                alt={user.username}
                className="mobile-profile-avatar"
              />
              <div className="mobile-profile-info">
                <span className="mobile-profile-welcome">Welcome back,</span>
                <span className="mobile-profile-name">{user.username}</span>
              </div>
            </div>
          )}

          <div className="nav-links-group">
            <Link to="/" className={`nav-link ${location.pathname === '/' ? 'active' : ''}`}>
              <Home size={18} />
              <span>Home</span>
            </Link>
            <Link to="/faq" className={`nav-link ${location.pathname === '/faq' ? 'active' : ''}`}>
              <MessagesSquare size={18} />
              <span>FAQ</span>
            </Link>
            <Link to="/request" className={`nav-link ${location.pathname === '/request' ? 'active' : ''}`}>
              <MessageSquareText size={18} />
              <span>Request Drama</span>
            </Link>
            <Link to="/search?focus=true" className={`nav-link ${location.search.includes('focus=true') ? 'active' : ''}`}>
              <Search size={18} />
              <span>Search</span>
            </Link>
          </div>

          <div className="mobile-only-actions">
            <hr className="menu-divider" />
            <Link to="/favorites" className="nav-link">
              <Bookmark size={18} />
              <span>Watchlist {watchlist.length > 0 && `(${watchlist.length})`}</span>
            </Link>
            <Link to="/history" className="nav-link">
              <History size={18} />
              <span>Watch History</span>
            </Link>
            {isAuthenticated ? (
              <button
                onClick={logout}
                className="nav-link logout-nav-link"
                style={{ background: 'none', border: 'none', width: '100%', cursor: 'pointer', fontFamily: 'inherit' }}
              >
                <LogOut size={18} />
                <span>Log Out</span>
              </button>
            ) : (
              <Link to="/login" className="nav-link login-nav-link">
                <LogIn size={18} />
                <span>Log In</span>
              </Link>
            )}
          </div>
        </nav>

        <div className="header-actions">
          <Link to="/favorites" className="action-btn hide-tablet" title="Watchlist">
            <Bookmark size={20} />
            {watchlist.length > 0 && (
              <span className="badge">{watchlist.length}</span>
            )}
          </Link>

          <Link to="/history" className="action-btn hide-tablet" title="Watch History">
            <History size={20} />
          </Link>

          <button onClick={toggleTheme} className="theme-toggle-btn" title="Toggle Theme">
            {theme === 'dark' ? <Sun size={20} /> : <Moon size={20} />}
          </button>

          {isAuthenticated ? (
            <>
              <Link to="/profile" className="user-profile-nav" title="View Profile" style={{ textDecoration: 'none' }}>
                <img
                  src={getAvatarUrl(user.avatar, user.username)}
                  alt={user.username}
                  className="user-nav-avatar"
                />
                <span className="user-nav-name hide-mobile">{user.username}</span>
              </Link>
              <button onClick={logout} className="action-btn hide-tablet" title="Log Out">
                <LogOut size={20} />
              </button>
            </>
          ) : (
            <Link to="/login" className="login-nav-btn hide-tablet" title="Log In">
              <LogIn size={16} />
              <span className="hide-mobile">Log In</span>
            </Link>
          )}

          <button
            className="hamburger-btn"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            aria-label="Toggle navigation menu"
            aria-expanded={isMenuOpen}
          >
            {isMenuOpen ? <X size={20} /> : <Menu size={20} />}
          </button>
        </div>
      </div>
    </header>
  );
}
