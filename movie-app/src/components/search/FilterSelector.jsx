import React from 'react';
import { GENRES, COUNTRIES } from '../../services/mockData';

export default function FilterSelector({
  selectedType,
  selectedCountry,
  selectedGenre,
  onTypeChange,
  onCountryChange,
  onGenreChange,
}) {
  const types = ['All', 'Drama', 'Movie', 'Anime'];

  return (
    <div style={{ display: 'flex', flexWrap: 'wrap', gap: '16px', justifyContent: 'center', backgroundColor: 'var(--bg-surface)', padding: '20px', borderRadius: 'var(--radius-lg)', border: '1px solid var(--border-color)' }}>
      {/* Type Filter */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '6px', minWidth: '150px' }}>
        <label style={{ fontSize: '12px', fontWeight: 700, color: 'var(--text-secondary)', textTransform: 'uppercase' }}>Type</label>
        <select
          value={selectedType}
          onChange={(e) => onTypeChange(e.target.value)}
          style={{ padding: '10px 14px', borderRadius: 'var(--radius-md)', backgroundColor: 'var(--bg-base)', border: '1px solid var(--border-color)', color: 'var(--text-primary)', cursor: 'pointer' }}
        >
          {types.map((type) => (
            <option key={type} value={type}>{type}</option>
          ))}
        </select>
      </div>

      {/* Country Filter */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '6px', minWidth: '150px' }}>
        <label style={{ fontSize: '12px', fontWeight: 700, color: 'var(--text-secondary)', textTransform: 'uppercase' }}>Country</label>
        <select
          value={selectedCountry}
          onChange={(e) => onCountryChange(e.target.value)}
          style={{ padding: '10px 14px', borderRadius: 'var(--radius-md)', backgroundColor: 'var(--bg-base)', border: '1px solid var(--border-color)', color: 'var(--text-primary)', cursor: 'pointer' }}
        >
          {COUNTRIES.map((country) => (
            <option key={country} value={country}>{country}</option>
          ))}
        </select>
      </div>

      {/* Genre Filter */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '6px', minWidth: '150px' }}>
        <label style={{ fontSize: '12px', fontWeight: 700, color: 'var(--text-secondary)', textTransform: 'uppercase' }}>Genre</label>
        <select
          value={selectedGenre}
          onChange={(e) => onGenreChange(e.target.value)}
          style={{ padding: '10px 14px', borderRadius: 'var(--radius-md)', backgroundColor: 'var(--bg-base)', border: '1px solid var(--border-color)', color: 'var(--text-primary)', cursor: 'pointer' }}
        >
          {GENRES.map((genre) => (
            <option key={genre} value={genre}>{genre}</option>
          ))}
        </select>
      </div>
    </div>
  );
}
