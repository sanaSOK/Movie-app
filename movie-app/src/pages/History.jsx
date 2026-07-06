import React from 'react';
import { Link } from 'react-router-dom';
import { useFavorite } from '../context/FavoriteContext';
import { Trash2, History as HistoryIcon, Play } from 'lucide-react';
import { formatDate } from '../utils/formatDate';

export default function History() {
  const { history, clearHistory } = useFavorite();

  return (
    <div className="history-page-container">
      <div style={{ padding: '40px 0' }}>
        <div className="catalog-header-row" style={{ marginBottom: '32px' }}>
          <div className="section-header">
            <HistoryIcon className="section-icon" size={24} />
            <h2>Recently Watched</h2>
          </div>
          {history.length > 0 && (
            <button onClick={clearHistory} className="btn-secondary" style={{ color: 'var(--danger)', borderColor: 'rgba(239, 68, 68, 0.2)' }}>
              <Trash2 size={16} />
              <span>Clear History</span>
            </button>
          )}
        </div>

        {history.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '60px 0', backgroundColor: 'var(--bg-surface)', border: '1px solid var(--border-color)', borderRadius: 'var(--radius-lg)' }}>
            <HistoryIcon size={48} style={{ color: 'var(--text-muted)', marginBottom: '16px' }} />
            <h3 style={{ fontSize: '18px', marginBottom: '8px' }}>No watch history found</h3>
            <p style={{ color: 'var(--text-secondary)', marginBottom: '24px', fontSize: '14px' }}>
              Shows and episodes you watch will appear here.
            </p>
            <Link to="/" className="btn-primary">Browse Content</Link>
          </div>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            {history.map((item, idx) => (
              <div
                key={`${item.showId}-${item.watchedAt}-${idx}`}
                style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', backgroundColor: 'var(--bg-surface)', border: '1px solid var(--border-color)', borderRadius: 'var(--radius-md)', padding: '16px', flexWrap: 'wrap', gap: '16px' }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
                  <img
                    src={item.poster}
                    alt={item.title}
                    style={{ width: '60px', aspectRatio: '2/3', objectFit: 'cover', borderRadius: 'var(--radius-sm)' }}
                  />
                  <div>
                    <h3 style={{ fontSize: '16px', fontWeight: 700 }}>{item.title}</h3>
                    <p style={{ fontSize: '14px', color: 'var(--text-secondary)', marginTop: '4px' }}>
                      Watched: Episode {item.episodeNumber} ({item.sourceLabel})
                    </p>
                    <span style={{ fontSize: '12px', color: 'var(--text-muted)', display: 'block', marginTop: '6px' }}>
                      {formatDate(item.watchedAt)}
                    </span>
                  </div>
                </div>
                <div>
                  <Link to={`/watch/${item.showId}/ep-${item.episodeNumber}`} className="btn-primary" style={{ padding: '8px 16px', fontSize: '13px' }}>
                    <Play size={14} fill="#fff" />
                    <span>Watch Again</span>
                  </Link>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
