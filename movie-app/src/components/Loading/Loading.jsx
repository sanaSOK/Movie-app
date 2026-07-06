import React from 'react';
import './Loading.css';

export default function Loading({ message = "Loading..." }) {
  return (
    <div className="spinner-container">
      <div className="spinner" />
      {message && <p className="loading-message">{message}</p>}
    </div>
  );
}
