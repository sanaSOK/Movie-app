import React, { useState, useEffect, useRef } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Play, Bookmark, Star, ChevronLeft, ChevronRight } from 'lucide-react';
import { useFavorite } from '../../context/FavoriteContext';
import { useAuth } from '../../context/AuthContext';

export default function FeaturedHero({ shows }) {
  const { toggleWatchlist, isBookmarked } = useFavorite();
  const { isAuthenticated } = useAuth();
  const navigate = useNavigate();
  
  // Create copies for infinite seamless carousel loop
  const slides = shows && shows.length > 0 ? [...shows, shows[0]] : [];
  
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isTransitionEnabled, setIsTransitionEnabled] = useState(true);
  const transitionTimeoutRef = useRef(null);

  // Auto-scroll trigger every 2s
  useEffect(() => {
    if (!shows || shows.length === 0) return;
    
    const interval = setInterval(() => {
      setIsTransitionEnabled(true);
      setCurrentIndex((prev) => prev + 1);
    }, 2000);

    return () => clearInterval(interval);
  }, [shows, currentIndex]);

  // Handle seamless wrap-around when we land on the cloned first slide
  useEffect(() => {
    if (currentIndex === shows.length) {
      transitionTimeoutRef.current = setTimeout(() => {
        setIsTransitionEnabled(false);
        setCurrentIndex(0);
      }, 600); // 600ms matches the transition timing duration
    }
    return () => {
      if (transitionTimeoutRef.current) clearTimeout(transitionTimeoutRef.current);
    };
  }, [currentIndex, shows.length]);

  if (!shows || shows.length === 0) return null;

  const handlePrev = () => {
    setIsTransitionEnabled(true);
    if (currentIndex === 0) {
      // Instantly jump to clone at the end, then slide backward
      setIsTransitionEnabled(false);
      setCurrentIndex(shows.length);
      setTimeout(() => {
        setIsTransitionEnabled(true);
        setCurrentIndex(shows.length - 1);
      }, 50);
    } else {
      setCurrentIndex((prev) => prev - 1);
    }
  };

  const handleNext = () => {
    setIsTransitionEnabled(true);
    setCurrentIndex((prev) => prev + 1);
  };

  const handleDotClick = (idx) => {
    setIsTransitionEnabled(true);
    setCurrentIndex(idx);
  };

  const activeDotIndex = currentIndex === shows.length ? 0 : currentIndex;

  return (
    <div className="hero-carousel-container">
      {/* Top Left Title Badge */}
      <div className="hero-top-badge">
        {slides[currentIndex]?.title} ({slides[currentIndex]?.year})
      </div>

      {/* Slide elements */}
      <div 
        className="hero-carousel-slides" 
        style={{ 
          transform: `translateX(-${(currentIndex * 100) / slides.length}%)`, 
          transition: isTransitionEnabled ? 'transform 0.6s cubic-bezier(0.4, 0, 0.2, 1)' : 'none',
          width: `${slides.length * 100}%`
        }}
      >
        {slides.map((show, idx) => {
          const bookmarked = isBookmarked(show.id);
          return (
            <section 
              key={`${show.id}-${idx}`} 
              className="featured-hero-slide" 
              style={{ 
                backgroundImage: `url(${show.banner})`,
                width: `${100 / slides.length}%`
              }}
            >
              <div className="hero-gradient-overlay" />
              <div className="hero-content">
                <div className="hero-badge-row">
                  <span className="hero-status-tag">{show.status}</span>
                  <span className="hero-type-tag">{show.type}</span>
                  <span className="hero-rating">
                    <Star size={16} fill="#fbbf24" style={{ marginRight: '4px' }} />
                    {show.rating}
                  </span>
                </div>
                <h1 className="hero-title">{show.title}</h1>
                <div className="hero-meta-row">
                  <span>{show.year}</span>
                  <span className="dot-divider" />
                  <span>{show.country}</span>
                  <span className="dot-divider" />
                  <span>{show.quality}</span>
                </div>
                <div className="hero-genres">
                  {show.genres.map((genre) => (
                    <span key={genre} className="genre-chip">{genre}</span>
                  ))}
                </div>
                <p className="hero-synopsis">{show.synopsis}</p>
                <div className="hero-action-buttons">
                  <Link 
                    to={`/watch/${show.id}/ep-1`} 
                    className="btn-primary hero-btn"
                  >
                    <Play size={18} fill="#fff" />
                    <span>Play Now</span>
                  </Link>
                  <button 
                    onClick={() => {
                      if (!isAuthenticated) {
                        navigate('/login');
                        return;
                      }
                      toggleWatchlist(show);
                    }} 
                    className={`btn-secondary hero-btn ${bookmarked ? 'in-watchlist' : ''}`}
                  >
                    <Bookmark size={18} fill={bookmarked ? '#a7f3d0' : 'none'} />
                    <span>{bookmarked ? 'In Watchlist' : 'Add Watchlist'}</span>
                  </button>
                </div>
              </div>
            </section>
          );
        })}
      </div>

      {/* Navigation Arrows */}
      <button onClick={handlePrev} className="carousel-control-btn prev-btn" aria-label="Previous Slide">
        <ChevronLeft size={24} />
      </button>
      <button onClick={handleNext} className="carousel-control-btn next-btn" aria-label="Next Slide">
        <ChevronRight size={24} />
      </button>

      {/* Indicators Dots */}
      <div className="carousel-dots">
        {shows.map((_, idx) => (
          <button
            key={idx}
            onClick={() => handleDotClick(idx)}
            className={`carousel-dot ${activeDotIndex === idx ? 'active' : ''}`}
            aria-label={`Go to slide ${idx + 1}`}
          />
        ))}
      </div>
    </div>
  );
}
