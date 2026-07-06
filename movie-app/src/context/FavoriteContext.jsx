import React, { createContext, useContext, useState, useEffect } from 'react';
import { STORAGE_KEYS } from '../utils/constants';

const FavoriteContext = createContext();

export const useFavorite = () => useContext(FavoriteContext);
// Alias useWatch to useFavorite for backward compatibility
export const useWatch = useFavorite;

export const FavoriteProvider = ({ children }) => {
  const [watchlist, setWatchlist] = useState(() => {
    const saved = localStorage.getItem(STORAGE_KEYS.WATCHLIST);
    return saved ? JSON.parse(saved) : [];
  });

  const [history, setHistory] = useState(() => {
    const saved = localStorage.getItem(STORAGE_KEYS.HISTORY);
    return saved ? JSON.parse(saved) : [];
  });

  const [theme, setTheme] = useState(() => {
    const saved = localStorage.getItem(STORAGE_KEYS.THEME);
    return saved || 'dark';
  });

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.WATCHLIST, JSON.stringify(watchlist));
  }, [watchlist]);

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

  const toggleWatchlist = (show) => {
    setWatchlist((prev) => {
      const exists = prev.some((item) => item.id === show.id);
      if (exists) {
        return prev.filter((item) => item.id !== show.id);
      } else {
        return [...prev, { ...show, addedAt: new Date().toISOString() }];
      }
    });
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
      ].slice(0, 50); // Keep last 50 entries
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
        favorites: watchlist, // Alias favorites to watchlist
        history,
        theme,
        toggleWatchlist,
        toggleFavorite: toggleWatchlist, // Alias toggleFavorite to toggleWatchlist
        isBookmarked,
        isFavorite: isBookmarked, // Alias isFavorite to isBookmarked
        addToHistory,
        clearHistory,
        toggleTheme,
      }}
    >
      {children}
    </FavoriteContext.Provider>
  );
};
