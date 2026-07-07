import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { request } from '../services/api';
import { Mail, Lock, Key, ShieldCheck, ArrowLeft, AlertCircle, Eye, EyeOff } from 'lucide-react';
import logo from '../assets/images/logo.png';

export default function ForgotPassword() {
  const navigate = useNavigate();
  
  const [step, setStep] = useState(1); // 1: Request OTP, 2: Reset Password
  const [email, setEmail] = useState('');
  const [otp, setOtp] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [successMessage, setSuccessMessage] = useState('');

  // Handle Step 1: Request OTP
  const handleRequestOTP = async (e) => {
    e.preventDefault();
    if (!email) {
      setError('Please enter your email address');
      return;
    }
    setError('');
    setLoading(true);
    try {
      await request('/auth/forgot-password', {
        method: 'POST',
        body: JSON.stringify({ email }),
      });
      setStep(2);
    } catch (err) {
      setError(err.message || 'Failed to send reset code. Please make sure the email is correct.');
    } finally {
      setLoading(false);
    }
  };

  // Handle Step 2: Reset Password
  const handleResetPassword = async (e) => {
    e.preventDefault();
    if (!otp || !newPassword || !confirmPassword) {
      setError('Please fill in all fields');
      return;
    }
    if (newPassword.length < 6) {
      setError('Password must be at least 6 characters long');
      return;
    }
    if (newPassword !== confirmPassword) {
      setError('Passwords do not match');
      return;
    }
    
    setError('');
    setLoading(true);
    try {
      await request('/auth/reset-password', {
        method: 'POST',
        body: JSON.stringify({ email, otp, newPassword }),
      });
      setSuccessMessage('Password reset successfully! Redirecting you to login page...');
      setTimeout(() => {
        navigate('/login');
      }, 3000);
    } catch (err) {
      setError(err.message || 'Invalid or expired OTP. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-page-container">
      {/* Background blurs */}
      <div className="auth-glow-circle circle-1"></div>
      <div className="auth-glow-circle circle-2"></div>
      
      <div className="auth-glass-card animate-fade-in">
        <div className="auth-card-header">
          <img src={logo} alt="missUmovie Logo" className="auth-logo-image" />
          <h2>Reset Password</h2>
          
          {step === 1 ? (
            <p>Enter your email to receive a 6-digit password reset code</p>
          ) : (
            <p>Enter the 6-digit code sent to your email and your new password</p>
          )}
        </div>

        {error && (
          <div className="auth-error-banner">
            <AlertCircle size={16} style={{ flexShrink: 0 }} />
            <span>{error}</span>
          </div>
        )}

        {successMessage && (
          <div className="auth-error-banner" style={{ background: 'rgba(16, 185, 129, 0.1)', border: '1px solid rgba(16, 185, 129, 0.2)', color: '#10b981' }}>
            <ShieldCheck size={18} style={{ flexShrink: 0 }} />
            <span>{successMessage}</span>
          </div>
        )}

        {step === 1 && !successMessage && (
          <form onSubmit={handleRequestOTP} className="auth-form">
            <div className="auth-input-group">
              <label htmlFor="email">Email Address</label>
              <div className="auth-input-wrapper">
                <Mail size={18} className="auth-input-icon" />
                <input
                  id="email"
                  type="email"
                  placeholder="you@example.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  disabled={loading}
                />
              </div>
            </div>

            <button type="submit" className="auth-submit-btn btn-primary" style={{ height: '48px' }} disabled={loading}>
              {loading ? 'Sending Code...' : 'Send Reset Code'}
            </button>
          </form>
        )}

        {step === 2 && !successMessage && (
          <form onSubmit={handleResetPassword} className="auth-form">
            <div className="auth-input-group">
              <label htmlFor="otp">Reset Code (OTP)</label>
              <div className="auth-input-wrapper">
                <Key size={18} className="auth-input-icon" />
                <input
                  id="otp"
                  type="text"
                  placeholder="Enter 6-digit code"
                  value={otp}
                  onChange={(e) => setOtp(e.target.value)}
                  required
                  maxLength={6}
                  disabled={loading}
                />
              </div>
            </div>

            <div className="auth-input-group">
              <label htmlFor="newPassword">New Password</label>
              <div className="auth-input-wrapper">
                <Lock size={18} className="auth-input-icon" />
                <input
                  id="newPassword"
                  type={showPassword ? 'text' : 'password'}
                  placeholder="Minimum 6 characters"
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  required
                  disabled={loading}
                />
                <button
                  type="button"
                  className="auth-password-toggle"
                  onClick={() => setShowPassword(!showPassword)}
                  aria-label={showPassword ? "Hide password" : "Show password"}
                >
                  {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
            </div>

            <div className="auth-input-group">
              <label htmlFor="confirmPassword">Confirm Password</label>
              <div className="auth-input-wrapper">
                <Lock size={18} className="auth-input-icon" />
                <input
                  id="confirmPassword"
                  type={showPassword ? 'text' : 'password'}
                  placeholder="Repeat new password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  required
                  disabled={loading}
                />
              </div>
            </div>

            <button type="submit" className="auth-submit-btn btn-primary" style={{ height: '48px' }} disabled={loading}>
              {loading ? 'Resetting Password...' : 'Reset Password'}
            </button>

            <button type="button" className="auth-submit-btn" style={{ background: 'transparent', border: '1px solid var(--border-color)', color: 'var(--text-primary)', height: '44px' }} onClick={() => setStep(1)} disabled={loading}>
              Back to Step 1
            </button>
          </form>
        )}

        <div className="auth-footer" style={{ borderTop: '1px solid var(--border-color)', paddingTop: '16px', marginTop: '8px' }}>
          <Link to="/login" className="auth-link" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px', textDecoration: 'none' }}>
            <ArrowLeft size={16} />
            <span>Back to Login</span>
          </Link>
        </div>
      </div>
    </div>
  );
}
