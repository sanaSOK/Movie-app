import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { movieService } from '../services/movieService';
import MovieCard from '../components/MovieCard/MovieCard';
import FilterSelector from '../components/search/FilterSelector';
import SearchBar from '../components/SearchBar/SearchBar';
import Loading from '../components/Loading/Loading';
import { Search as SearchIcon, Compass } from 'lucide-react';

export default function Search() {
  const [searchParams, setSearchParams] = useSearchParams();
  const query = searchParams.get('q') || '';
  const typeFilter = searchParams.get('type') || 'All';
  const countryFilter = searchParams.get('country') || 'All';
  const genreFilter = searchParams.get('genre') || 'All';

  const [shows, setShows] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchInput, setSearchInput] = useState(query);

  useEffect(() => {
    setSearchInput(query);
  }, [query]);

  useEffect(() => {
    async function fetchFilteredShows() {
      setLoading(true);
      try {
        const results = await movieService.getShows({
          type: typeFilter,
          search: query,
        });

        // Apply country and genre filters locally
        let filtered = results;
        if (countryFilter && countryFilter !== 'All') {
          filtered = filtered.filter((show) => show.country === countryFilter);
        }
        if (genreFilter && genreFilter !== 'All') {
          filtered = filtered.filter((show) => show.genres.includes(genreFilter));
        }

        setShows(filtered);
      } catch (err) {
        console.error('Failed to load searched shows:', err);
      } finally {
        setLoading(false);
      }
    }
    fetchFilteredShows();
  }, [query, typeFilter, countryFilter, genreFilter]);

  const handleSearchSubmit = (value) => {
    setSearchParams((prev) => {
      const newParams = new URLSearchParams(prev);
      if (value.trim()) {
        newParams.set('q', value.trim());
      } else {
        newParams.delete('q');
      }
      return newParams;
    });
  };

  const handleFilterChange = (key, value) => {
    setSearchParams((prev) => {
      const newParams = new URLSearchParams(prev);
      if (value && value !== 'All') {
        newParams.set(key, value);
      } else {
        newParams.delete(key);
      }
      return newParams;
    });
  };

  return (
    <div className="search-page-container">
      <div style={{ padding: '40px 0' }}>
        <div style={{ maxWidth: '600px', margin: '0 auto 32px' }}>
          <SearchBar
            value={searchInput}
            onChange={(val) => {
              setSearchInput(val);
              handleSearchSubmit(val);
            }}
            placeholder="Search movies, dramas, anime..."
          />
        </div>

        <FilterSelector
          selectedType={typeFilter}
          selectedCountry={countryFilter}
          selectedGenre={genreFilter}
          onTypeChange={(val) => handleFilterChange('type', val)}
          onCountryChange={(val) => handleFilterChange('country', val)}
          onGenreChange={(val) => handleFilterChange('genre', val)}
        />

        <div className="section-header" style={{ marginTop: '40px', marginBottom: '24px' }}>
          {query ? <SearchIcon className="section-icon" size={20} /> : <Compass className="section-icon" size={20} />}
          <h2>
            {query ? `Search Results for "${query}"` : 'Browse Catalog'} ({shows.length})
          </h2>
        </div>

        {loading ? (
          <Loading message="Filtering matches..." />
        ) : shows.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '60px 0', color: 'var(--text-secondary)' }}>
            <h3>No results found</h3>
            <p style={{ marginTop: '8px', fontSize: '14px' }}>Try refining your search keyword or filters.</p>
          </div>
        ) : (
          <div className="cards-grid">
            {shows.map((show) => (
              <MovieCard key={show.id} show={show} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
