import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Home, MessagesSquare, MessageSquareText, Search, Bookmark, History, Sun, Moon, LogIn, LogOut } from 'lucide-react';
import { useFavorite } from '../../context/FavoriteContext';
import { useAuth } from '../../context/AuthContext';
import { getAvatarUrl } from '../../utils/avatar';
import logo from '../../assets/images/logo.png';
import './Navbar.css';

export default function Navbar() {
  const { watchlist, theme, toggleTheme } = useFavorite();
  const { user, logout, isAuthenticated } = useAuth();
  const location = useLocation();

  return (
    <header className="site-header">
      <div className="header-container">
        <Link to="/" className="brand-logo" aria-label="Home">
          <img src={logo} alt="missUmovie Logo" className="logo-image" />
        </Link>

        <nav className="nav-menu">
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
        </nav>

        <div className="header-actions">
          <Link to="/favorites" className="action-btn" title="Watchlist">
            <Bookmark size={20} />
            {watchlist.length > 0 && (
              <span className="badge">{watchlist.length}</span>
            )}
          </Link>
          
          <Link to="/history" className="action-btn" title="Watch History">
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
              <button onClick={logout} className="action-btn" title="Log Out">
                <LogOut size={20} />
              </button>
            </>
          ) : (
            <Link to="/login" className="login-nav-btn" title="Log In">
              <LogIn size={16} />
              <span className="hide-mobile">Log In</span>
            </Link>
          )}
        </div>
      </div>
    </header>
  );
}
