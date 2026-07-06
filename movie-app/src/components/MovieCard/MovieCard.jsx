import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Star, Play, Bookmark } from 'lucide-react';
import { useFavorite } from '../../context/FavoriteContext';
import './MovieCard.css';

export default function MovieCard({ show }) {
  const navigate = useNavigate();
  const { toggleFavorite, isFavorite } = useFavorite();
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
          
          {show.genres && show.genres.length > 0 && (
            <div className="card-genres-container">
              {show.genres.slice(0, 2).map((genre, idx) => (
                <span key={idx} className="card-genre-chip">{genre}</span>
              ))}
            </div>
          )}
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
          <span className="card-type-badge">{show.type}</span>
          <span className="card-year-text">{show.year}</span>
        </div>
      </div>
    </div>
  );
}
