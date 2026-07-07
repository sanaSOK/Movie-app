import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Star, Play, Bookmark } from 'lucide-react';
import { useFavorite } from '../../context/FavoriteContext';
import { useAuth } from '../../context/AuthContext';
import './MovieCard.css';

export default function MovieCard({ show }) {
  const navigate = useNavigate();
  const { toggleFavorite, isFavorite } = useFavorite();
  const { isAuthenticated } = useAuth();
  const isFav = isFavorite(show.id);

  const handleCardClick = () => {
    navigate(`/details/${show.id}`);
  };

  return (
    <div className="movie-card" onClick={handleCardClick}>
      <div className="card-poster-wrapper">
        <img 
          src={show.poster} 
          alt={show.title} 
          className="card-poster" 
          loading="lazy"
        />
        <div className="card-overlay">
          <div className="card-play-btn">
            <Play size={22} fill="#fff" />
          </div>
        </div>
        
        <span className="card-quality-badge">{show.quality}</span>
        
        <span className="card-rating-badge">
          <Star size={12} fill="#fbbf24" stroke="#fbbf24" />
          {show.rating}
        </span>

        <button 
          className={`card-favorite-btn ${isFav ? 'is-active' : ''}`}
          onClick={(e) => {
            e.stopPropagation();
            if (!isAuthenticated) {
              navigate('/login');
              return;
            }
            toggleFavorite(show);
          }}
          title={isFav ? "Remove from watchlist" : "Add to watchlist"}
          aria-label="Toggle watchlist"
        >
          <Bookmark size={15} fill={isFav ? "currentColor" : "none"} />
        </button>
      </div>
      
      <div className="card-info">
        <h3 className="card-title" title={show.title}>{show.title}</h3>
        <div className="card-meta">
          <div style={{ display: 'flex', gap: '6px', flexWrap: 'wrap', maxWidth: '75%' }}>
            {show.genres && show.genres.slice(0, 2).map((genre, idx) => (
              <span key={idx} className="card-type-badge">{genre}</span>
            ))}
            {(!show.genres || show.genres.length === 0) && (
              <span className="card-type-badge">{show.type}</span>
            )}
          </div>
          <span className="card-year-text">{show.year}</span>
        </div>
      </div>
    </div>
  );
}
