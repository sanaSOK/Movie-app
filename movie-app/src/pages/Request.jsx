import React, { useState } from 'react';
import { Send, FileText, CheckCircle } from 'lucide-react';

export default function Request() {
  const [title, setTitle] = useState('');
  const [type, setType] = useState('Drama');
  const [year, setYear] = useState('');
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!title.trim()) return;
    setSubmitted(true);
    setTitle('');
    setYear('');
  };

  return (
    <div className="watchlist-page-container">
      <div style={{ padding: '40px 0', maxWidth: '600px', margin: '0 auto' }}>
        <div className="section-header" style={{ marginBottom: '32px' }}>
          <FileText className="section-icon" size={24} />
          <h2>Request Drama / Movie</h2>
        </div>

        {submitted ? (
          <div style={{ textAlign: 'center', padding: '40px', backgroundColor: 'var(--bg-surface)', border: '1px solid var(--border-color)', borderRadius: 'var(--radius-lg)' }}>
            <CheckCircle size={48} style={{ color: 'var(--success)', marginBottom: '16px' }} />
            <h3 style={{ fontSize: '20px', marginBottom: '8px' }}>Request Submitted!</h3>
            <p style={{ color: 'var(--text-secondary)', marginBottom: '24px', fontSize: '14px' }}>
              Thank you! Our content team will review your request and upload the video within 24 hours.
            </p>
            <button onClick={() => setSubmitted(false)} className="btn-primary">Request Another Show</button>
          </div>
        ) : (
          <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '20px', backgroundColor: 'var(--bg-surface)', border: '1px solid var(--border-color)', borderRadius: 'var(--radius-lg)', padding: '32px' }}>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
              <label style={{ fontSize: '14px', fontWeight: 700 }}>Show Title <span style={{ color: 'var(--danger)' }}>*</span></label>
              <input
                type="text"
                required
                placeholder="e.g. Vincenzo Season 2"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                style={{ padding: '12px', borderRadius: 'var(--radius-md)', backgroundColor: 'var(--bg-base)', border: '1px solid var(--border-color)', color: 'var(--text-primary)' }}
              />
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
              <label style={{ fontSize: '14px', fontWeight: 700 }}>Category Type</label>
              <select
                value={type}
                onChange={(e) => setType(e.target.value)}
                style={{ padding: '12px', borderRadius: 'var(--radius-md)', backgroundColor: 'var(--bg-base)', border: '1px solid var(--border-color)', color: 'var(--text-primary)', cursor: 'pointer' }}
              >
                <option value="Drama">Drama</option>
                <option value="Movie">Movie</option>
                <option value="Anime">Anime</option>
              </select>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
              <label style={{ fontSize: '14px', fontWeight: 700 }}>Release Year</label>
              <input
                type="number"
                placeholder="e.g. 2026"
                value={year}
                onChange={(e) => setYear(e.target.value)}
                style={{ padding: '12px', borderRadius: 'var(--radius-md)', backgroundColor: 'var(--bg-base)', border: '1px solid var(--border-color)', color: 'var(--text-primary)' }}
              />
            </div>

            <button type="submit" className="btn-primary" style={{ display: 'flex', gap: '8px', alignSelf: 'flex-start', marginTop: '10px' }}>
              <Send size={16} />
              <span>Submit Request</span>
            </button>
          </form>
        )}
      </div>
    </div>
  );
}
