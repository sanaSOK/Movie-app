import React, { useState } from 'react';
import { HelpCircle, ChevronDown, ChevronUp } from 'lucide-react';

export default function FAQ() {
  const [openIdx, setOpenIdx] = useState(null);

  const faqs = [
    {
      q: "What is missUmovie?",
      a: "missUmovie is a premium streaming hub where you can browse and watch your favorite K-Dramas, movies, anime, and variety shows in high definition with multi-language subtitles."
    },
    {
      q: "Is there any charge to use the service?",
      a: "No, missUmovie is completely free to use. We do not require credit card details or active subscriptions."
    },
    {
      q: "How can I add a show to my watchlist?",
      a: "Simply browse to any show's detail page and click the 'Add to Watchlist' button. You can then access all your saved shows in the 'Favorites' tab."
    },
    {
      q: "Can I request a movie or drama that is not listed?",
      a: "Yes! Use the 'Request Drama' page in the top menu bar to suggest new additions. We update our libraries daily."
    },
    {
      q: "Why is the video player failing to load?",
      a: "Ensure you have a stable internet connection. If a specific source is loading slowly, you can switch between different servers (e.g. Server 1, Server 2) using the source selectors below the player."
    }
  ];

  const toggleFaq = (idx) => {
    setOpenIdx(openIdx === idx ? null : idx);
  };

  return (
    <div className="watchlist-page-container">
      <div style={{ padding: '40px 0', maxWidth: '800px', margin: '0 auto' }}>
        <div className="section-header" style={{ marginBottom: '32px' }}>
          <HelpCircle className="section-icon" size={24} />
          <h2>Frequently Asked Questions</h2>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          {faqs.map((faq, idx) => (
            <div
              key={idx}
              style={{
                backgroundColor: 'var(--bg-surface)',
                border: '1px solid var(--border-color)',
                borderRadius: 'var(--radius-md)',
                overflow: 'hidden'
              }}
            >
              <button
                onClick={() => toggleFaq(idx)}
                style={{
                  width: '100%',
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  padding: '20px',
                  background: 'none',
                  border: 'none',
                  color: 'var(--text-primary)',
                  fontWeight: 700,
                  fontSize: '16px',
                  cursor: 'pointer',
                  textAlign: 'left'
                }}
              >
                <span>{faq.q}</span>
                {openIdx === idx ? <ChevronUp size={18} /> : <ChevronDown size={18} />}
              </button>

              {openIdx === idx && (
                <div
                  style={{
                    padding: '0 20px 20px',
                    color: 'var(--text-secondary)',
                    fontSize: '14px',
                    lineHeight: '1.6',
                    borderTop: '1px solid rgba(255,255,255,0.03)'
                  }}
                >
                  {faq.a}
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
