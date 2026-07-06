import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Home, MessagesSquare, MessageSquareText, Compass, Search, Bookmark, History, Sun, Moon } from 'lucide-react';
import { useFavorite } from '../../context/FavoriteContext';
import logo from '../../assets/images/logo.png';
import './Navbar.css';

export default function Navbar() {
  const { watchlist, theme, toggleTheme } = useFavorite();
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
          <Link to="/search" className={`nav-link ${location.pathname === '/search' && !location.search.includes('focus=true') ? 'active' : ''}`}>
            <Compass size={18} />
            <span>Explore</span>
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
        </div>
      </div>
    </header>
  );
}
