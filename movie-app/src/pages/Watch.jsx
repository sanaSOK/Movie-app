import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { movieService } from '../services/movieService';
import { useFavorite } from '../context/FavoriteContext';
import VideoPlayer from '../components/player/VideoPlayer';
import Loading from '../components/Loading/Loading';
import { Server, ArrowLeft, MessageSquare, Send } from 'lucide-react';

export default function Watch() {
  const { id, episodeId } = useParams();
  const { addToHistory } = useFavorite();
  const navigate = useNavigate();

  const [show, setShow] = useState(null);
  const [loading, setLoading] = useState(true);
  const [selectedSource, setSelectedSource] = useState(null);
  const [localComments, setLocalComments] = useState([]);
  const [newCommentText, setNewCommentText] = useState('');
  const [isTheaterMode, setIsTheaterMode] = useState(false);

  useEffect(() => {
    async function loadWatchData() {
      setLoading(true);
      try {
        const data = await movieService.getShowById(id);
        setShow(data);

        // Find episode
        const episode = data.episodes.find((ep) => ep.id === episodeId) || data.episodes[0];
        if (episode) {
          setSelectedSource(episode.sources[0] || null);
          addToHistory(data, episode.number, episode.sources[0]?.label || 'Server 1');
        }
      } catch (err) {
        console.error('Failed to load watching details:', err);
      } finally {
        setLoading(false);
      }
    }
    loadWatchData();
  }, [id, episodeId]);

  if (loading) {
    return <Loading message="Loading streaming sources..." />;
  }

  if (!show) {
    return (
      <div className="error-page-container">
        <h2>Show not found</h2>
        <p>The show you are trying to watch does not exist.</p>
        <Link to="/" className="btn-primary">Back to Home</Link>
      </div>
    );
  }

  const episodeIndex = show.episodes.findIndex((ep) => ep.id === episodeId);
  const activeEpisode = show.episodes[episodeIndex] || show.episodes[0];

  if (!activeEpisode) {
    return (
      <div className="error-page-container">
        <h2>Episode not found</h2>
        <p>This episode is currently unavailable.</p>
        <Link to={`/details/${show.id}`} className="btn-primary">Back to Details</Link>
      </div>
    );
  }

  const handleSourceSelect = (source) => {
    setSelectedSource(source);
    addToHistory(show, activeEpisode.number, source.label);
  };

  const handleCommentSubmit = (e) => {
    e.preventDefault();
    if (!newCommentText.trim()) return;

    const newComment = {
      id: `uc-${Date.now()}`,
      user: 'You',
      avatar: 'https://api.dicebear.com/7.x/adventurer/svg?seed=you',
      text: newCommentText.trim(),
      date: 'Just now',
    };

    setLocalComments((prev) => [newComment, ...prev]);
    setNewCommentText('');
  };

  const handleVideoEnded = () => {
    if (!isMovie) {
      const nextEp = show.episodes[episodeIndex + 1];
      if (nextEp) {
        navigate(`/watch/${show.id}/${nextEp.id}`);
      }
    }
  };

  const allComments = [...localComments, ...(show.comments || [])];
  const isMovie = show.type === 'Movie';

  return (
    <div className="watch-page">
      <div style={{ marginTop: '20px', marginBottom: '16px' }}>
        <Link to={`/details/${show.id}`} className="btn-secondary" style={{ padding: '8px 16px', fontSize: '13px' }}>
          <ArrowLeft size={16} />
          <span>Back to Details</span>
        </Link>
      </div>

      <div className={`watch-layout ${isTheaterMode ? 'theater-mode' : ''}`}>
        {/* Row 1/Player Container */}
        <div className="watch-player-container">
          {selectedSource && (
            <VideoPlayer
              sourceUrl={selectedSource.url}
              poster={show.banner}
              onVideoEnded={handleVideoEnded}
              isTheaterMode={isTheaterMode}
              onTheaterModeToggle={() => setIsTheaterMode(!isTheaterMode)}
            />
          )}
        </div>

        {/* Main Content: Sources, Details, Comments */}
        <div className="watch-main-content">
          {/* Source Selectors */}
          <div style={{ backgroundColor: 'var(--bg-surface)', padding: '20px', borderRadius: 'var(--radius-lg)', border: '1px solid var(--border-color)' }}>
            <h3 style={{ fontSize: '16px', display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '16px' }}>
              <Server size={16} />
              <span>Select Server Source</span>
            </h3>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '10px' }}>
              {activeEpisode.sources.map((source) => (
                <button
                  key={source.label}
                  onClick={() => handleSourceSelect(source)}
                  className={`btn-secondary ${selectedSource?.label === source.label ? 'in-watchlist' : ''}`}
                  style={{ fontSize: '13px', padding: '10px 18px' }}
                >
                  {source.label}
                </button>
              ))}
            </div>
          </div>

          {/* Episode Info */}
          <div style={{ marginTop: '24px' }}>
            <h1 style={{ fontSize: '24px', fontFamily: 'var(--font-display)', marginBottom: '6px' }}>
              {show.title} - {isMovie ? 'Full Movie' : `Episode ${activeEpisode.number}`}
            </h1>
            <p style={{ color: 'var(--text-secondary)', fontSize: '14px' }}>
              {activeEpisode.title} &bull; {activeEpisode.duration}
            </p>
          </div>

          {/* Comments Section */}
          <div className="comment-section">
            <h3 style={{ fontSize: '18px', fontFamily: 'var(--font-display)', marginBottom: '20px', display: 'flex', alignItems: 'center', gap: '8px' }}>
              <MessageSquare size={18} />
              <span>Comments ({allComments.length})</span>
            </h3>

            <form className="comment-input-area" onSubmit={handleCommentSubmit}>
              <textarea
                className="comment-textarea"
                placeholder="Join the discussion... Type your comment here."
                value={newCommentText}
                onChange={(e) => setNewCommentText(e.target.value)}
              />
              <button type="submit" className="btn-primary" style={{ padding: '0 20px' }}>
                <Send size={18} />
              </button>
            </form>

            <div className="comments-list">
              {allComments.map((comment) => (
                <div key={comment.id} className="comment-node">
                  <img src={comment.avatar} alt={comment.user} className="comment-avatar" />
                  <div className="comment-bubble">
                    <div className="comment-user-row">
                      <span>{comment.user}</span>
                      <span className="comment-date">{comment.date}</span>
                    </div>
                    <p className="comment-body">{comment.text}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Sidebar: Episodes List */}
        <div className="watch-sidebar">
          {!isMovie && (
            <div style={{ backgroundColor: 'var(--bg-surface)', padding: '24px', borderRadius: 'var(--radius-lg)', border: '1px solid var(--border-color)' }}>
              <div className="episodes-header-block">
                <h3 className="episodes-title" style={{ fontSize: '20px' }}>Episode</h3>
                <span className="episodes-total">Total {show.episodes.length}</span>
              </div>
              <div className="episode-btn-grid">
                {show.episodes.slice().reverse().map((ep) => {
                  const isActive = activeEpisode.id === ep.id;

                  return (
                    <Link
                      key={ep.id}
                      to={`/watch/${show.id}/${ep.id}`}
                      className={`episode-btn-card ${isActive ? 'active' : ''}`}
                    >
                      <span>{ep.number}</span>
                    </Link>
                  );
                })}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
