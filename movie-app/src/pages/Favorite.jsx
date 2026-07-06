import React from 'react';
import { Link } from 'react-router-dom';
import { useFavorite } from '../context/FavoriteContext';
import MovieCard from '../components/MovieCard/MovieCard';
import { Bookmark, Film } from 'lucide-react';

export default function Favorite() {
  const { watchlist } = useFavorite();

  return (
    <div className="watchlist-page-container">
      <div style={{ padding: '40px 0' }}>
        <div className="section-header" style={{ marginBottom: '32px' }}>
          <Bookmark className="section-icon" size={24} />
          <h2>My Watchlist & Favorites</h2>
        </div>

        {watchlist.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '60px 0', backgroundColor: 'var(--bg-surface)', border: '1px solid var(--border-color)', borderRadius: 'var(--radius-lg)' }}>
            <Film size={48} style={{ color: 'var(--text-muted)', marginBottom: '16px' }} />
            <h3 style={{ fontSize: '18px', marginBottom: '8px' }}>Your Watchlist is empty</h3>
            <p style={{ color: 'var(--text-secondary)', marginBottom: '24px', fontSize: '14px' }}>
              Explore our latest content and bookmark your favorite shows to watch them later.
            </p>
            <Link to="/" className="btn-primary">Browse Content</Link>
          </div>
        ) : (
          <div className="cards-grid">
            {watchlist.map((show) => (
              <MovieCard key={show.id} show={show} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
