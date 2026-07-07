import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { movieService } from '../services/movieService';
import { useFavorite } from '../context/FavoriteContext';
import { useAuth } from '../context/AuthContext';
import Loading from '../components/Loading/Loading';
import { Star, Bookmark, Play, Calendar, Globe, Info } from 'lucide-react';

export default function MovieDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { toggleWatchlist, isBookmarked } = useFavorite();
  const { isAuthenticated } = useAuth();
  const [show, setShow] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    async function loadShowDetails() {
      setLoading(true);
      setError(null);
      try {
        const data = await movieService.getShowById(id);
        setShow(data);
      } catch (err) {
        setError(err.message || 'Failed to load details');
      } finally {
        setLoading(false);
      }
    }
    loadShowDetails();
  }, [id]);

  if (loading) {
    return <Loading message="Loading show details..." />;
  }

  if (error || !show) {
    return (
      <div className="error-page-container">
        <h2>Show not found</h2>
        <p>{error || 'The show you are looking for does not exist or has been removed.'}</p>
        <Link to="/" className="btn-primary">Back to Home</Link>
      </div>
    );
  }

  const bookmarked = isBookmarked(show.id);
  const isMovie = show.type === 'Movie';

  return (
    <div className="details-container">
      <div className="show-detail-layout">
        {/* Detail Header Info Card */}
        <div className="detail-header-card">
          <div className="detail-poster-wrapper">
            <img src={show.poster} alt={show.title} className="detail-poster" />
          </div>

          <div className="detail-info-pane">
            <h1 className="detail-title">{show.title}</h1>

            <div className="detail-meta-list">
              <span className="hero-rating">
                <Star size={16} fill="#fbbf24" style={{ marginRight: '4px' }} />
                {show.rating}
              </span>
              <span className="dot-divider" />
              <span style={{ color: 'var(--accent)' }}>{show.quality}</span>
              <span className="dot-divider" />
              <span><Calendar size={14} style={{ display: 'inline', verticalAlign: 'middle', marginRight: '4px' }} /> {show.year}</span>
              <span className="dot-divider" />
              <span><Globe size={14} style={{ display: 'inline', verticalAlign: 'middle', marginRight: '4px' }} /> {show.country}</span>
            </div>

            <div className="hero-genres" style={{ marginBottom: '24px' }}>
              {show.genres.map((genre) => (
                <span key={genre} className="genre-chip">{genre}</span>
              ))}
            </div>

            <div className="detail-buttons-row">
              <Link
                to={`/watch/${show.id}/${show.episodes[0]?.id || 'ep-1'}`}
                className="btn-primary"
              >
                <Play size={18} fill="#fff" />
                <span>{isMovie ? 'Watch Movie' : 'Watch Episode 1'}</span>
              </Link>
              <button
                onClick={() => {
                  if (!isAuthenticated) {
                    navigate('/login');
                    return;
                  }
                  toggleWatchlist(show);
                }}
                className={`btn-secondary ${bookmarked ? 'in-watchlist' : ''}`}
              >
                <Bookmark size={18} fill={bookmarked ? '#a7f3d0' : 'none'} />
                <span>{bookmarked ? 'In Watchlist' : 'Add to Watchlist'}</span>
              </button>
            </div>

            <div className="detail-synopsis-box">
              <h3><Info size={16} style={{ display: 'inline', verticalAlign: 'middle', marginRight: '6px' }} />Synopsis</h3>
              <p>{show.synopsis}</p>
            </div>
          </div>
        </div>

        {/* Episodes Section */}
        {!isMovie && (
          <div className="episodes-section" style={{ backgroundColor: 'transparent', border: 'none', padding: 0 }}>
            <div className="episodes-header-block">
              <h3 className="episodes-title">Episode</h3>
              <span className="episodes-total">Total {show.episodes.length}</span>
            </div>
            <div className="episode-btn-grid">
              {show.episodes.slice().reverse().map((ep) => {
                return (
                  <Link
                    key={ep.id}
                    to={`/watch/${show.id}/${ep.id}`}
                    className="episode-btn-card"
                  >
                    <span>{ep.number}</span>
                  </Link>
                );
              })}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
