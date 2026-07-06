import React from 'react';
import { Link } from 'react-router-dom';

export default function NotFound() {
  return (
    <div className="error-page-container">
      <h2 style={{ fontSize: '72px', color: 'var(--primary)', textShadow: '0 0 20px var(--primary-glow)', marginBottom: '8px' }}>404</h2>
      <h2 style={{ marginBottom: '12px' }}>Page Not Found</h2>
      <p style={{ color: 'var(--text-secondary)', marginBottom: '24px' }}>The page you are looking for does not exist or has been moved.</p>
      <Link to="/" className="btn-primary">Go back Home</Link>
    </div>
  );
}
