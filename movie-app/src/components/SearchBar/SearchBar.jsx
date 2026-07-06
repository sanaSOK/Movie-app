import React from 'react';
import { Search } from 'lucide-react';
import './SearchBar.css';

export default function SearchBar({ value, onChange, placeholder = "Search..." }) {
  return (
    <div className="search-bar-wrapper">
      <input
        type="text"
        className="search-bar-input"
        placeholder={placeholder}
        value={value}
        onChange={(e) => onChange(e.target.value)}
      />
      <div className="search-bar-icon">
        <Search size={18} />
      </div>
    </div>
  );
}
