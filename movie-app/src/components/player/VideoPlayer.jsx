import React, { useRef, useState, useEffect } from 'react';
import { Play, Pause, Volume2, VolumeX, Maximize, Monitor, Lock, Unlock, MoreVertical, PlayCircle, SkipForward, RotateCw, Check } from 'lucide-react';

const SKIP_OPTIONS = [
  { label: 'None', value: 'none' },
  { label: '5 Second', value: 5 },
  { label: '10 Second', value: 10 },
  { label: '15 Second', value: 15 },
  { label: '30 Second', value: 30 },
  { label: '45 Second', value: 45 },
  { label: '1 Minute', value: 60 },
  { label: '1 Minute 15 Second', value: 75 },
  { label: '1 Minute 30 Second', value: 90 },
  { label: '2 Minute', value: 120 },
  { label: '2 Minute 15 Second', value: 135 },
  { label: '2 Minute 30 Second', value: 150 }
];

const MOCK_SUBTITLES = {
  english: [
    { start: 0, end: 5, text: "[Upbeat introductory music plays]" },
    { start: 5, end: 12, text: "Hello everyone! Welcome to our learning series." },
    { start: 12, end: 20, text: "Today we will explore structure, syntax, and layout design." },
    { start: 20, end: 30, text: "Let's dive right in and start coding!" },
    { start: 85, end: 95, text: "As you can see, our player controls are highly interactive." }
  ],
  khmer: [
    { start: 0, end: 5, text: "[តន្ត្រីកំដរអារម្មណ៍លេង]" },
    { start: 5, end: 12, text: "សួស្តីអ្នកទាំងអស់គ្នា! សូមស្វាគមន៍មកកាន់វគ្គសិក្សារបស់យើង។" },
    { start: 12, end: 20, text: "ថ្ងៃនេះយើងនឹងសិក្សាអំពី រចនាសម្ព័ន្ធ វាក្យសម្ព័ន្ធ និងការរចនាប្លង់។" },
    { start: 20, end: 30, text: "តោះចាប់ផ្តើមសរសេរកូដទាំងអស់គ្នា!" },
    { start: 85, end: 95, text: "ដូចដែលអ្នកបានឃើញហើយ ផ្ទាំងបញ្ជាកម្មវិធីចាក់វីដេអូរបស់យើងមានភាពងាយស្រួល។" }
  ]
};

const getDurationLabel = (val) => {
  if (val === 'none') return 'None';
  if (val < 60) return `${val} Second`;
  const mins = Math.floor(val / 60);
  const secs = val % 60;
  return `${mins} Minute${secs > 0 ? ` ${secs} Second` : ''}`;
};

export default function VideoPlayer({ sourceUrl, poster, onVideoEnded, isTheaterMode, onTheaterModeToggle }) {
  const videoRef = useRef(null);
  const hasSkippedRef = useRef(false);

  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [volume, setVolume] = useState(0.8);
  const [isMuted, setIsMuted] = useState(false);

  // Advanced States
  const [isLocked, setIsLocked] = useState(false);
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [currentSpeed, setCurrentSpeed] = useState(1);
  const [showSubmenu, setShowSubmenu] = useState(null); // 'speed' | 'skip' | 'next' | 'cc' | null
  const [showToast, setShowToast] = useState('');
  
  const [currentCc, setCurrentCc] = useState(() => {
    const saved = localStorage.getItem('player_cc_lang');
    return saved !== null ? saved : 'none'; // 'none' | 'english' | 'khmer'
  });

  const [autoSkipDuration, setAutoSkipDuration] = useState(() => {
    const saved = localStorage.getItem('player_auto_skip_duration');
    if (saved !== null) {
      try {
        const parsed = JSON.parse(saved);
        return parsed === true ? 90 : parsed;
      } catch {
        return saved === 'none' ? 'none' : parseInt(saved, 10) || 'none';
      }
    }
    return 'none';
  });
  
  const [autoNextEpisode, setAutoNextEpisode] = useState(() => {
    const saved = localStorage.getItem('player_auto_next');
    return saved !== null ? JSON.parse(saved) : true;
  });

  const [showSkipBtn, setShowSkipBtn] = useState(false);

  // Migration from old boolean autoSkipIntro key
  useEffect(() => {
    const oldSkip = localStorage.getItem('player_auto_skip');
    if (oldSkip !== null) {
      try {
        if (JSON.parse(oldSkip) === true && autoSkipDuration === 'none') {
          setAutoSkipDuration(90);
        }
      } catch (err) {
        console.error(err);
      }
      localStorage.removeItem('player_auto_skip');
    }
  }, []);

  // Sync speed and reset states on load or source change
  useEffect(() => {
    setIsPlaying(false);
    setCurrentTime(0);
    setShowSkipBtn(false);
    setIsSettingsOpen(false);
    setShowSubmenu(null);
    hasSkippedRef.current = false;
    if (videoRef.current) {
      videoRef.current.load();
      videoRef.current.playbackRate = currentSpeed;
    }
  }, [sourceUrl]);

  // Persist settings
  useEffect(() => {
    localStorage.setItem('player_auto_skip_duration', JSON.stringify(autoSkipDuration));
  }, [autoSkipDuration]);

  useEffect(() => {
    localStorage.setItem('player_auto_next', JSON.stringify(autoNextEpisode));
  }, [autoNextEpisode]);

  useEffect(() => {
    localStorage.setItem('player_cc_lang', currentCc);
  }, [currentCc]);

  const togglePlay = () => {
    if (isLocked) return;
    if (!videoRef.current) return;
    if (isPlaying) {
      videoRef.current.pause();
    } else {
      videoRef.current.play().catch((err) => console.log('Autoplay blocked:', err));
    }
    setIsPlaying(!isPlaying);
  };

  const triggerToast = (msg) => {
    setShowToast(msg);
    setTimeout(() => setShowToast(''), 3000);
  };

  const handleTimeUpdate = () => {
    if (!videoRef.current) return;
    const time = videoRef.current.currentTime;
    setCurrentTime(time);

    // Auto Skip Intro Logic
    if (autoSkipDuration !== 'none') {
      if (!hasSkippedRef.current && time > 0.1 && time < autoSkipDuration) {
        hasSkippedRef.current = true;
        videoRef.current.currentTime = autoSkipDuration;
        setCurrentTime(autoSkipDuration);
        triggerToast(`Skipped Intro automatically (${getDurationLabel(autoSkipDuration)})`);
      }
    } else {
      // Manual skip button between 5s and 90s if auto skip is None
      if (time >= 5 && time < 90) {
        setShowSkipBtn(true);
      } else {
        if (showSkipBtn) setShowSkipBtn(false);
      }
    }
  };

  const handleManualSkip = () => {
    if (!videoRef.current) return;
    videoRef.current.currentTime = 90;
    setCurrentTime(90);
    setShowSkipBtn(false);
    triggerToast("Intro skipped");
  };

  const handleLoadedMetadata = () => {
    if (videoRef.current) {
      setDuration(videoRef.current.duration);
    }
  };

  const handleProgressClick = (e) => {
    if (isLocked) return;
    if (!videoRef.current || !duration) return;
    const rect = e.currentTarget.getBoundingClientRect();
    const clickX = e.clientX - rect.left;
    const width = rect.width;
    const newTime = (clickX / width) * duration;
    videoRef.current.currentTime = newTime;
    setCurrentTime(newTime);
  };

  const handleVolumeChange = (e) => {
    if (isLocked) return;
    const newVolume = parseFloat(e.target.value);
    setVolume(newVolume);
    if (videoRef.current) {
      videoRef.current.volume = newVolume;
      videoRef.current.muted = newVolume === 0;
    }
    setIsMuted(newVolume === 0);
  };

  const toggleMute = () => {
    if (isLocked) return;
    if (!videoRef.current) return;
    const nextMute = !isMuted;
    setIsMuted(nextMute);
    videoRef.current.muted = nextMute;
  };

  const handleFullscreen = () => {
    if (isLocked) return;
    if (!videoRef.current) return;
    if (videoRef.current.requestFullscreen) {
      videoRef.current.requestFullscreen();
    } else if (videoRef.current.webkitRequestFullscreen) {
      videoRef.current.webkitRequestFullscreen();
    } else if (videoRef.current.msRequestFullscreen) {
      videoRef.current.msRequestFullscreen();
    }
  };

  const handleSpeedSelect = (speed) => {
    setCurrentSpeed(speed);
    if (videoRef.current) {
      videoRef.current.playbackRate = speed;
    }
    setShowSubmenu(null);
    setIsSettingsOpen(false);
    triggerToast(`Playback speed: ${speed}x`);
  };

  const handleVideoEnded = () => {
    setIsPlaying(false);
    if (autoNextEpisode && onVideoEnded) {
      triggerToast("Loading next episode...");
      setTimeout(() => {
        onVideoEnded();
      }, 1500);
    }
  };

  const formatPlayerTime = (time) => {
    if (isNaN(time)) return '0:00';
    const minutes = Math.floor(time / 60);
    const seconds = Math.floor(time % 60);
    return `${minutes}:${seconds < 10 ? '0' : ''}${seconds}`;
  };

  const progressPercent = duration ? (currentTime / duration) * 100 : 0;

  // Active Subtitle Selector
  const activeSubtitleText = (() => {
    if (currentCc === 'none') return '';
    const track = MOCK_SUBTITLES[currentCc];
    if (!track) return '';
    const currentItem = track.find(item => currentTime >= item.start && currentTime <= item.end);
    return currentItem ? currentItem.text : '';
  })();

  const handleCcBtnClick = () => {
    if (isLocked) return;
    setIsSettingsOpen(true);
    setShowSubmenu(showSubmenu === 'cc' ? null : 'cc');
  };

  return (
    <div className={`custom-player-wrapper ${isLocked ? 'is-locked' : ''}`}>
      <video
        ref={videoRef}
        src={sourceUrl}
        poster={poster}
        onTimeUpdate={handleTimeUpdate}
        onLoadedMetadata={handleLoadedMetadata}
        onEnded={handleVideoEnded}
        onClick={togglePlay}
        className="player-video"
      />

      {/* Dynamic Subtitle Display */}
      {currentCc !== 'none' && activeSubtitleText && (
        <div className="player-subtitle-overlay animate-fade-in">
          <span className="player-subtitle-text">{activeSubtitleText}</span>
        </div>
      )}

      {/* Ambient Toast Message */}
      {showToast && <div className="player-toast">{showToast}</div>}

      {/* Floating Skip Intro Button */}
      {showSkipBtn && autoSkipDuration === 'none' && (
        <button className="player-skip-intro-btn" onClick={handleManualSkip}>
          <SkipForward size={16} />
          <span>Skip Intro</span>
        </button>
      )}

      {/* Locked State Overlay Unlock Button */}
      {isLocked && (
        <button 
          className="player-unlock-btn" 
          onClick={() => {
            setIsLocked(false);
            triggerToast("Controls unlocked");
          }}
          title="Unlock controls"
        >
          <Unlock size={20} />
        </button>
      )}

      {/* Main Controls Overlay */}
      <div className={`player-controls-overlay ${isLocked ? 'locked-hidden' : ''}`}>
        
        {/* Top Controls Bar */}
        <div className="player-controls-top-bar">
          <button 
            className="player-btn" 
            onClick={() => {
              setIsLocked(true);
              setIsSettingsOpen(false);
              triggerToast("Controls locked. Hover actions disabled.");
            }} 
            title="Lock screen controls"
          >
            <Lock size={18} />
          </button>
          
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            {/* CC Badge Button */}
            <span 
              className={`player-cc-badge ${currentCc !== 'none' ? 'active-cc' : ''}`} 
              onClick={handleCcBtnClick}
              title="Closed Captions / Subtitles"
            >
              CC
            </span>
            
            <button 
              className={`player-btn ${isSettingsOpen ? 'text-primary' : ''}`} 
              onClick={() => {
                setIsSettingsOpen(!isSettingsOpen);
                setShowSubmenu(null);
              }}
              title="Settings"
            >
              <MoreVertical size={20} />
            </button>
          </div>
        </div>

        {/* Settings Panel */}
        {isSettingsOpen && !isLocked && (
          <div className="player-settings-dropdown animate-fade-in">
            {showSubmenu === null ? (
              <>
                <button className="player-settings-item" onClick={() => setShowSubmenu('speed')}>
                  <div className="settings-item-label">
                    <PlayCircle size={16} />
                    <span>Playback speed</span>
                  </div>
                  <span className="settings-item-value">{currentSpeed === 1 ? 'Normal' : `${currentSpeed}x`} &rsaquo;</span>
                </button>

                <button className="player-settings-item" onClick={() => setShowSubmenu('skip')}>
                  <div className="settings-item-label">
                    <SkipForward size={16} />
                    <span>Auto Skip Intro</span>
                  </div>
                  <span className="settings-item-value">{getDurationLabel(autoSkipDuration)} &rsaquo;</span>
                </button>

                <button className="player-settings-item" onClick={() => setShowSubmenu('cc')}>
                  <div className="settings-item-label">
                    <span style={{ fontSize: '11px', fontWeight: 'bold', border: '1px solid currentColor', padding: '1px 3px', borderRadius: '3px' }}>CC</span>
                    <span>Subtitles / CC</span>
                  </div>
                  <span className="settings-item-value">{currentCc === 'none' ? 'Off' : currentCc === 'english' ? 'English' : 'Khmer'} &rsaquo;</span>
                </button>

                <button className="player-settings-item" onClick={() => setShowSubmenu('next')}>
                  <div className="settings-item-label">
                    <RotateCw size={16} />
                    <span>Auto Next Ep</span>
                  </div>
                  <span className="settings-item-value">{autoNextEpisode ? 'Enabled' : 'Disabled'} &rsaquo;</span>
                </button>
              </>
            ) : showSubmenu === 'speed' ? (
              // Playback Speed Submenu
              <div className="settings-submenu">
                <button className="player-settings-item back-item" onClick={() => setShowSubmenu(null)}>
                  <span>&lsaquo; Back to Settings</span>
                </button>
                {[0.5, 1, 1.25, 1.5, 2].map((speed) => (
                  <button 
                    key={speed} 
                    className="player-settings-item" 
                    onClick={() => handleSpeedSelect(speed)}
                  >
                    <span>{speed === 1 ? '1x (Normal)' : `${speed}x`}</span>
                    {currentSpeed === speed && <Check size={16} className="text-primary" />}
                  </button>
                ))}
              </div>
            ) : showSubmenu === 'skip' ? (
              // Auto Skip Intro Submenu
              <div className="settings-submenu" style={{ maxHeight: '200px', overflowY: 'auto' }}>
                <button className="player-settings-item back-item" onClick={() => setShowSubmenu(null)}>
                  <span>&lsaquo; Back to Settings</span>
                </button>
                {SKIP_OPTIONS.map((opt) => (
                  <button 
                    key={opt.value} 
                    className="player-settings-item" 
                    onClick={() => {
                      setAutoSkipDuration(opt.value);
                      setShowSubmenu(null);
                      setIsSettingsOpen(false);
                      triggerToast(`Auto Skip Intro: ${opt.label}`);
                    }}
                  >
                    <span>{opt.label}</span>
                    {autoSkipDuration === opt.value && <Check size={16} className="text-primary" />}
                  </button>
                ))}
              </div>
            ) : showSubmenu === 'next' ? (
              // Auto Next Episode Submenu
              <div className="settings-submenu">
                <button className="player-settings-item back-item" onClick={() => setShowSubmenu(null)}>
                  <span>&lsaquo; Back to Settings</span>
                </button>
                <button 
                  className="player-settings-item" 
                  onClick={() => {
                    setAutoNextEpisode(true);
                    setShowSubmenu(null);
                    setIsSettingsOpen(false);
                    triggerToast("Auto Next Episode enabled");
                  }}
                >
                  <span>Enable Auto Next Ep</span>
                  {autoNextEpisode === true && <Check size={16} className="text-primary" />}
                </button>
                <button 
                  className="player-settings-item" 
                  onClick={() => {
                    setAutoNextEpisode(false);
                    setShowSubmenu(null);
                    setIsSettingsOpen(false);
                    triggerToast("Auto Next Episode disabled");
                  }}
                >
                  <span>Disable Auto Next Ep</span>
                  {autoNextEpisode === false && <Check size={16} className="text-primary" />}
                </button>
              </div>
            ) : showSubmenu === 'cc' ? (
              // Closed Captions Submenu
              <div className="settings-submenu">
                <button className="player-settings-item back-item" onClick={() => setShowSubmenu(null)}>
                  <span>&lsaquo; Back to Settings</span>
                </button>
                {[
                  { label: 'Off', value: 'none' },
                  { label: 'English', value: 'english' },
                  { label: 'Khmer', value: 'khmer' }
                ].map((track) => (
                  <button 
                    key={track.value} 
                    className="player-settings-item" 
                    onClick={() => {
                      setCurrentCc(track.value);
                      setShowSubmenu(null);
                      setIsSettingsOpen(false);
                      triggerToast(`Subtitles set to: ${track.label}`);
                    }}
                  >
                    <span>{track.label}</span>
                    {currentCc === track.value && <Check size={16} className="text-primary" />}
                  </button>
                ))}
              </div>
            ) : null}
          </div>
        )}

        {/* Bottom Playback Slider & Control Row */}
        <div style={{ marginTop: 'auto' }}>
          <div className="player-progress-bar" onClick={handleProgressClick}>
            <div className="player-progress-filled" style={{ width: `${progressPercent}%` }} />
          </div>
          <div className="player-control-row">
            <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
              <button className="player-btn" onClick={togglePlay}>
                {isPlaying ? <Pause size={20} /> : <Play size={20} />}
              </button>
              <button className="player-btn" onClick={toggleMute}>
                {isMuted ? <VolumeX size={20} /> : <Volume2 size={20} />}
              </button>
              <input
                type="range"
                min="0"
                max="1"
                step="0.05"
                value={isMuted ? 0 : volume}
                onChange={handleVolumeChange}
                style={{ width: '80px', accentColor: 'var(--primary)' }}
              />
              <span style={{ fontSize: '13px', color: '#fff', fontWeight: 600 }}>
                {formatPlayerTime(currentTime)} / {formatPlayerTime(duration)}
              </span>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
              {onTheaterModeToggle && (
                <button 
                  className="player-btn" 
                  onClick={onTheaterModeToggle}
                  title={isTheaterMode ? "Default view" : "Theater view"}
                  aria-label="Toggle theater mode"
                >
                  <Monitor 
                    size={20} 
                    style={{ 
                      color: isTheaterMode ? 'var(--primary)' : 'inherit',
                      filter: isTheaterMode ? 'drop-shadow(0 0 4px var(--primary-glow))' : 'none' 
                    }} 
                  />
                </button>
              )}
              <button className="player-btn" onClick={handleFullscreen} title="Fullscreen" aria-label="Fullscreen">
                <Maximize size={20} />
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
