import React, { createContext, useContext, useState, useEffect } from 'react';
import { STORAGE_KEYS } from '../utils/constants';
import { useAuth } from './AuthContext';
import { request } from '../services/api';

const FavoriteContext = createContext();

export const useFavorite = () => useContext(FavoriteContext);
export const useWatch = useFavorite;

export const FavoriteProvider = ({ children }) => {
  const { token } = useAuth();

  const [watchlist, setWatchlist] = useState([]);
  const [history, setHistory] = useState(() => {
    const saved = localStorage.getItem(STORAGE_KEYS.HISTORY);
    return saved ? JSON.parse(saved) : [];
  });
  const [theme, setTheme] = useState(() => {
    const saved = localStorage.getItem(STORAGE_KEYS.THEME);
    return saved || 'dark';
  });

  // Sync Watchlist with Database (only if user is authenticated)
  useEffect(() => {
    async function syncWatchlist() {
      if (token) {
        try {
          const response = await request('/favorites', {
            headers: { Authorization: `Bearer ${token}` }
          });
          setWatchlist(response.data || []);
        } catch (err) {
          console.error('Failed to sync watchlist with database:', err);
        }
      } else {
        setWatchlist([]);
      }
    }
    syncWatchlist();
  }, [token]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.HISTORY, JSON.stringify(history));
  }, [history]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.THEME, theme);
    const root = document.documentElement;
    if (theme === 'dark') {
      root.classList.add('dark-theme');
      root.classList.remove('light-theme');
    } else {
      root.classList.add('light-theme');
      root.classList.remove('dark-theme');
    }
  }, [theme]);

  const toggleWatchlist = async (show) => {
    if (!token) return;
    const exists = watchlist.some((item) => item.id === show.id);
    try {
      if (exists) {
        await request(`/favorites/${show.id}`, {
          method: 'DELETE',
          headers: { Authorization: `Bearer ${token}` }
        });
        setWatchlist((prev) => prev.filter((item) => item.id !== show.id));
      } else {
        await request('/favorites', {
          method: 'POST',
          headers: { Authorization: `Bearer ${token}` },
          body: JSON.stringify({ movieId: show.id })
        });
        setWatchlist((prev) => [...prev, show]);
      }
    } catch (err) {
      console.error('Failed to update favorite in database:', err);
    }
  };

  const isBookmarked = (showId) => {
    return watchlist.some((item) => item.id === showId);
  };

  const addToHistory = (show, episodeNumber, sourceLabel) => {
    setHistory((prev) => {
      const filtered = prev.filter((item) => item.showId !== show.id);
      return [
        {
          showId: show.id,
          title: show.title,
          poster: show.poster,
          type: show.type,
          episodeNumber,
          sourceLabel,
          watchedAt: new Date().toISOString(),
        },
        ...filtered,
      ].slice(0, 50);
    });
  };

  const clearHistory = () => {
    setHistory([]);
  };

  const toggleTheme = () => {
    setTheme((prev) => (prev === 'dark' ? 'light' : 'dark'));
  };

  return (
    <FavoriteContext.Provider
      value={{
        watchlist,
        favorites: watchlist,
        history,
        theme,
        toggleWatchlist,
        toggleFavorite: toggleWatchlist,
        isBookmarked,
        isFavorite: isBookmarked,
        addToHistory,
        clearHistory,
        toggleTheme,
      }}
    >
      {children}
    </FavoriteContext.Provider>
  );
};
