import React, { useState, useEffect } from 'react';
import { movieService } from '../services/movieService';
import FeaturedHero from '../components/home/FeaturedHero';
import MovieCard from '../components/MovieCard/MovieCard';
import Loading from '../components/Loading/Loading';
import { PlayCircle, Award, Calendar } from 'lucide-react';

export default function Home() {
  const [shows, setShows] = useState([]);
  const [spotlightShows, setSpotlightShows] = useState([]);
  const [upcomingShows, setUpcomingShows] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadHomeData() {
      setLoading(true);
      try {
        const allShows = await movieService.getShows();
        setShows(allShows);
        // Load the top 5 shows for the carousel
        setSpotlightShows(allShows.slice(0, 5));
        
        // Load the upcoming shows
        const upcoming = await movieService.getUpcomingShows();
        setUpcomingShows(upcoming);
      } catch (err) {
        console.error('Failed to load home data:', err);
      } finally {
        setLoading(false);
      }
    }
    loadHomeData();
  }, []);

  if (loading) {
    return <Loading message="Loading cinematic experience..." />;
  }

  // Split into Trending (rating >= 9.4)
  const trendingShows = shows.filter((show) => show.rating >= 9.4);
  const recentUpdates = shows;

  return (
    <div className="home-page">
      {spotlightShows.length > 0 && <FeaturedHero shows={spotlightShows} />}

      <div className="home-content-container">
        {/* Trending Section */}
        <section className="home-section">
          <div className="section-header">
            <Award className="section-icon" size={24} />
            <h2>Trending Now</h2>
          </div>
          <div className="cards-grid">
            {trendingShows.map((show) => (
              <MovieCard key={show.id} show={show} />
            ))}
          </div>
        </section>

        {/* Catalog Section without Tabs */}
        <section className="home-section">
          <div className="catalog-header-row">
            <div className="section-header">
              <PlayCircle className="section-icon" size={24} />
              <h2>Latest Content</h2>
            </div>
          </div>

          <div className="cards-grid">
            {recentUpdates.map((show) => (
              <MovieCard key={show.id} show={show} />
            ))}
          </div>
        </section>

        {/* Upcoming Soon Section */}
        <section className="home-section" style={{ marginTop: '50px' }}>
          <div className="section-header">
            <Calendar className="section-icon" size={24} />
            <h2>Upcoming Soon</h2>
          </div>
          <div className="cards-grid">
            {upcomingShows.map((show) => (
              <div key={show.id} className="movie-card upcoming-card" style={{ opacity: 0.85 }}>
                <div className="card-poster-wrapper" style={{ pointerEvents: 'none' }}>
                  <img src={show.poster} alt={show.title} className="card-poster" />
                  <div className="card-badge" style={{ backgroundColor: 'var(--accent)' }}>Upcoming</div>
                  <div className="upcoming-overlay">
                    <span className="release-date">{show.releaseDate}</span>
                  </div>
                </div>
                <div className="card-details">
                  <h3 className="card-title" title={show.title}>{show.title}</h3>
                  <div className="card-meta">
                    <span>{show.type}</span>
                    <span className="dot-divider" />
                    <span style={{ color: 'var(--accent)', fontWeight: 600 }}>{show.releaseDate}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>
      </div>
    </div>
  );
}
