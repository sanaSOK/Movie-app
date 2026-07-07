import React, { useState, useEffect, useRef } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { getAvatarUrl } from '../utils/avatar';
import { User, Mail, Shield, Calendar, Save, CheckCircle, ArrowLeft, RefreshCw, Upload, AlertCircle } from 'lucide-react';

const PRESET_SEEDS = ['Sana', 'Alex', 'Grace', 'Leo', 'Mia', 'Felix'];

export default function Profile() {
  const { user, isAuthenticated, updateProfile } = useAuth();
  const navigate = useNavigate();
  const fileInputRef = useRef(null);

  useEffect(() => {
    if (!isAuthenticated) {
      navigate('/login');
    }
  }, [isAuthenticated, navigate]);

  const [username, setUsername] = useState(user?.username || '');
  const [avatarSeed, setAvatarSeed] = useState('');
  const [currentAvatar, setCurrentAvatar] = useState('');
  const [selectedFile, setSelectedFile] = useState(null);
  
  const [success, setSuccess] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (user) {
      setUsername(user.username);
      setCurrentAvatar(user.avatar);
      
      // Parse seed from avatar URL if it matches dicebear
      if (user.avatar && user.avatar.includes('seed=')) {
        const seedParam = user.avatar.split('seed=')[1];
        setAvatarSeed(decodeURIComponent(seedParam || ''));
      } else {
        setAvatarSeed('');
      }
    }
  }, [user]);

  if (!user) {
    return null;
  }

  const handleSeedChange = (e) => {
    const val = e.target.value;
    setAvatarSeed(val);
    setSelectedFile(null); // Clear selected file when typing a seed
    if (val.trim()) {
      setCurrentAvatar(`https://api.dicebear.com/7.x/adventurer/svg?seed=${encodeURIComponent(val.trim())}`);
    }
  };

  const handlePresetSelect = (preset) => {
    setAvatarSeed(preset);
    setSelectedFile(null);
    setCurrentAvatar(`https://api.dicebear.com/7.x/adventurer/svg?seed=${preset}`);
  };

  const handleRandomize = () => {
    const randomSeed = Math.random().toString(36).substring(7);
    setAvatarSeed(randomSeed);
    setSelectedFile(null);
    setCurrentAvatar(`https://api.dicebear.com/7.x/adventurer/svg?seed=${randomSeed}`);
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setSelectedFile(file);
      setAvatarSeed(''); // Clear seed since they uploaded a file
      setCurrentAvatar(URL.createObjectURL(file));
    }
  };

  const handleUploadClick = () => {
    if (fileInputRef.current) {
      fileInputRef.current.click();
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!username.trim()) {
      setError('Username cannot be empty');
      return;
    }
    setError('');
    setSuccess('');
    setLoading(true);

    try {
      let payload;
      if (selectedFile) {
        // Upload via FormData
        const formData = new FormData();
        formData.append('username', username.trim());
        formData.append('avatar', selectedFile);
        payload = formData;
      } else {
        // Update via JSON
        payload = {
          username: username.trim(),
          avatar: currentAvatar
        };
      }

      await updateProfile(payload);
      setSelectedFile(null);
      setSuccess('Profile updated successfully!');
      setTimeout(() => setSuccess(''), 4000);
    } catch (err) {
      setError(err.message || 'Failed to update profile');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="profile-page-container">
      {/* Background blurs */}
      <div className="auth-glow-circle circle-1"></div>
      <div className="auth-glow-circle circle-2"></div>

      <div style={{ marginTop: '20px', marginBottom: '16px', zIndex: 10, position: 'relative', width: '100%', maxWidth: '640px' }}>
        <Link to="/" className="btn-secondary" style={{ padding: '8px 16px', fontSize: '13px', display: 'inline-flex' }}>
          <ArrowLeft size={16} />
          <span>Back to Home</span>
        </Link>
      </div>

      <div className="profile-glass-card animate-fade-in">
        <h2 className="profile-header-title">My Account Profile</h2>
        <p className="profile-header-subtitle">Customize your user details and avatar identity</p>

        {success && (
          <div className="profile-success-banner">
            <CheckCircle size={16} />
            <span>{success}</span>
          </div>
        )}

        {error && (
          <div className="auth-error-banner">
            <AlertCircle size={16} style={{ flexShrink: 0 }} />
            <span>{error}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="profile-form">
          {/* Avatar Settings */}
          <div className="profile-avatar-section">
            <div className="profile-avatar-preview-box">
              <img 
                src={selectedFile ? currentAvatar : getAvatarUrl(currentAvatar, user.username)} 
                alt="Avatar Preview" 
                className="profile-avatar-large" 
              />
              <button 
                type="button" 
                className="profile-randomize-btn" 
                onClick={handleRandomize}
                title="Randomize Avatar"
              >
                <RefreshCw size={16} />
              </button>
            </div>

            <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: '12px' }}>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '12px' }}>
                <label style={{ fontSize: '11px', fontWeight: '700', color: 'var(--text-secondary)' }}>
                  AVATAR CREATOR SEED
                </label>
                
                {/* Custom File Upload Trigger */}
                <input 
                  type="file" 
                  ref={fileInputRef} 
                  onChange={handleFileChange} 
                  accept="image/*" 
                  style={{ display: 'none' }} 
                />
                <button 
                  type="button" 
                  className="btn-secondary" 
                  style={{ fontSize: '11px', padding: '6px 12px', height: '28px', display: 'inline-flex', alignItems: 'center', gap: '6px' }}
                  onClick={handleUploadClick}
                >
                  <Upload size={12} />
                  <span>Upload Custom Image</span>
                </button>
              </div>

              <input
                type="text"
                className="profile-input"
                placeholder={selectedFile ? "Using uploaded image file..." : "Type anything to morph avatar..."}
                value={avatarSeed}
                onChange={handleSeedChange}
                disabled={!!selectedFile}
                style={{ height: '40px' }}
              />

              <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                <span style={{ fontSize: '11px', color: 'var(--text-muted)' }}>PRESETS:</span>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
                  {PRESET_SEEDS.map((p) => (
                    <button
                      key={p}
                      type="button"
                      onClick={() => handlePresetSelect(p)}
                      className={`profile-preset-chip ${(!selectedFile && avatarSeed === p) ? 'active' : ''}`}
                    >
                      {p}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </div>

          <hr style={{ border: '0', borderTop: '1px solid var(--border-color)', margin: '8px 0' }} />

          {/* Form details */}
          <div className="profile-input-group">
            <label htmlFor="username">Username</label>
            <div className="auth-input-wrapper">
              <User size={18} className="auth-input-icon" />
              <input
                id="username"
                type="text"
                placeholder="Username"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                required
              />
            </div>
          </div>

          <div className="profile-input-group">
            <label>Email Address (Read-only)</label>
            <div className="auth-input-wrapper" style={{ opacity: 0.65 }}>
              <Mail size={18} className="auth-input-icon" />
              <input
                type="email"
                value={user.email}
                disabled
                style={{ cursor: 'not-allowed' }}
              />
            </div>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px', marginTop: '4px' }}>
            <div>
              <span className="profile-meta-label">
                <Shield size={12} style={{ display: 'inline', marginRight: '4px', verticalAlign: 'middle' }} /> Account Role
              </span>
              <span className="profile-meta-value">{user.role}</span>
            </div>
            <div>
              <span className="profile-meta-label">
                <Calendar size={12} style={{ display: 'inline', marginRight: '4px', verticalAlign: 'middle' }} /> Member Since
              </span>
              <span className="profile-meta-value">
                {new Date(user.createdAt).toLocaleDateString(undefined, { year: 'numeric', month: 'short', day: 'numeric' })}
              </span>
            </div>
          </div>

          <button type="submit" className="auth-submit-btn btn-primary" style={{ height: '48px', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px' }} disabled={loading}>
            <Save size={18} />
            <span>{loading ? 'Saving Changes...' : 'Save Profile'}</span>
          </button>
        </form>
      </div>
    </div>
  );
}
