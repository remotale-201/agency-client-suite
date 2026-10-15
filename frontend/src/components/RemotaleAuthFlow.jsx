import React, { useState, useEffect } from 'react';
import './RemotaleAuth.css';
import { api } from '../api';

// ==========================================
// SVG ICONS & BRANDING
// ==========================================

export function RemotaleLogo({ size = 26 }) {
  return (
    <svg width={size} height={size} viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path
        d="M6 7C6 5.34315 7.34315 4 9 4H18.5C22.6421 4 26 7.35786 26 11.5C26 14.8143 23.8558 17.6253 20.8415 18.618L26.3198 26.377C26.9744 27.3033 26.3117 28.5833 25.176 28.5833H20.4852C19.7909 28.5833 19.1419 28.2106 18.7844 27.6083L14.28 20.0833H11.5V27C11.5 27.8284 10.8284 28.5 10 28.5H7.5C6.67157 28.5 6 27.8284 6 27V7Z"
        fill="url(#remotale_grad)"
      />
      <path
        d="M11.5 8.5H18C20.2091 8.5 22 10.067 22 12C22 13.933 20.2091 15.5 18 15.5H11.5V8.5Z"
        fill="#FFFFFF"
      />
      <defs>
        <linearGradient id="remotale_grad" x1="6" y1="4" x2="26" y2="28.5" gradientUnits="userSpaceOnUse">
          <stop stopColor="#4338CA" />
          <stop offset="0.45" stopColor="#4F46E5" />
          <stop offset="1" stopColor="#7C3AED" />
        </linearGradient>
      </defs>
    </svg>
  );
}

function StatusBar() {
  return (
    <div className="remotale-status-bar">
      <span className="remotale-status-time">9:41</span>
      <div className="remotale-status-icons">
        {/* Signal Bars */}
        <svg width="17" height="11" viewBox="0 0 17 11" fill="currentColor">
          <rect x="0" y="8" width="3" height="3" rx="0.5" />
          <rect x="4.5" y="5.5" width="3" height="5.5" rx="0.5" />
          <rect x="9" y="3" width="3" height="8" rx="0.5" />
          <rect x="13.5" y="0" width="3" height="11" rx="0.5" />
        </svg>
        {/* Wi-Fi Icon */}
        <svg width="15" height="11" viewBox="0 0 15 11" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round">
          <path d="M1 3C4.8 -0.8 10.2 -0.8 14 3" />
          <path d="M3.5 5.8C5.8 3.5 9.2 3.5 11.5 5.8" />
          <path d="M6 8.5C6.8 7.7 8.2 7.7 9 8.5" />
          <circle cx="7.5" cy="10" r="0.8" fill="currentColor" />
        </svg>
        {/* Battery Icon */}
        <svg width="22" height="11" viewBox="0 0 22 11" fill="none">
          <rect x="0.5" y="0.5" width="18" height="10" rx="3" stroke="currentColor" />
          <rect x="2" y="2" width="14" height="7" rx="1.5" fill="currentColor" />
          <path d="M20 3.5C20.6 3.8 21 4.4 21 5.5C21 6.6 20.6 7.2 20 7.5" stroke="currentColor" strokeLinecap="round" />
        </svg>
      </div>
    </div>
  );
}

function UserIcon({ size = 18, color = 'currentColor' }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
      <circle cx="12" cy="7" r="4" />
    </svg>
  );
}

function BriefcaseIcon({ size = 18, color = 'currentColor' }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <rect x="2" y="7" width="20" height="14" rx="2" ry="2" />
      <path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16" />
    </svg>
  );
}

function TeamUsersIcon({ size = 20, color = 'currentColor' }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
      <circle cx="9" cy="7" r="4" />
      <path d="M23 21v-2a4 4 0 0 0-3-3.87" />
      <path d="M16 3.13a4 4 0 0 1 0 7.75" />
    </svg>
  );
}

function MailIcon({ size = 18, color = 'currentColor' }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <rect x="2" y="4" width="20" height="16" rx="2" />
      <path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7" />
    </svg>
  );
}

function LockIcon({ size = 18, color = 'currentColor' }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <rect x="3" y="11" width="18" height="11" rx="2" ry="2" />
      <path d="M7 11V7a5 5 0 0 1 10 0v4" />
    </svg>
  );
}

function EyeIcon({ visible, size = 18 }) {
  return visible ? (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
      <circle cx="12" cy="12" r="3" />
    </svg>
  ) : (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24" />
      <line x1="1" y1="1" x2="23" y2="23" />
    </svg>
  );
}

function BackArrowIcon({ size = 20 }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round">
      <line x1="19" y1="12" x2="5" y2="12" />
      <polyline points="12 19 5 12 12 5" />
    </svg>
  );
}

function BarChart3D({ size = 22 }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="#FFFFFF" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
      <line x1="18" y1="20" x2="18" y2="10" />
      <line x1="12" y1="20" x2="12" y2="4" />
      <line x1="6" y1="20" x2="6" y2="14" />
    </svg>
  );
}

// ==========================================
// MAIN REMOTALE AUTH FLOW COMPONENT
// ==========================================

export default function RemotaleAuthFlow({ onLogin, onRegister, initialPortalToken }) {
  // Navigation State: 'welcome' (Screen 1), 'signup' (Screen 2), 'login' (Screen 3)
  const [activeScreen, setActiveScreen] = useState('welcome');
  
  // Showcase View Mode: 'interactive' (Single screen user flow), or 'all' (Side-by-side matching mockup)
  const [viewMode, setViewMode] = useState('interactive');

  // Selected Role: 'client' or 'admin'
  const [selectedRole, setSelectedRole] = useState('client');

  // Sign In State (Screen 3)
  const [loginEmail, setLoginEmail] = useState(() => localStorage.getItem('remotale_remembered_email') || initialPortalToken || '');
  const [loginPassword, setLoginPassword] = useState('');
  const [showLoginPw, setShowLoginPw] = useState(false);
  const [rememberMe, setRememberMe] = useState(() => localStorage.getItem('remotale_remember_me') === 'true');
  const [loginLoading, setLoginLoading] = useState(false);
  const [loginError, setLoginError] = useState('');

  // Sign Up State (Screen 2) - Exactly: Name, Email, Password, Confirm Password
  const [regName, setRegName] = useState('');
  const [regEmail, setRegEmail] = useState('');
  const [regPassword, setRegPassword] = useState('');
  const [regConfirmPassword, setRegConfirmPassword] = useState('');
  const [showRegPw, setShowRegPw] = useState(false);
  const [showRegConfirmPw, setShowRegConfirmPw] = useState(false);
  const [regLoading, setRegLoading] = useState(false);
  const [regError, setRegError] = useState('');

  // Forgot Password Modal State
  const [isForgotModalOpen, setIsForgotModalOpen] = useState(false);
  const [forgotEmail, setForgotEmail] = useState('');
  const [forgotNewPassword, setForgotNewPassword] = useState('');
  const [forgotConfirmPassword, setForgotConfirmPassword] = useState('');
  const [forgotLoading, setForgotLoading] = useState(false);
  const [forgotMessage, setForgotMessage] = useState({ type: '', text: '' });

  // Load remembered role if available
  useEffect(() => {
    const savedRole = localStorage.getItem('remotale_remembered_role');
    if (savedRole) setSelectedRole(savedRole);
  }, []);

  // Handle Login Submit
  const handleLoginSubmit = async (e) => {
    if (e) e.preventDefault();
    if (!loginEmail.trim() || !loginPassword) {
      setLoginError('Please enter your email/username and password.');
      return;
    }

    setLoginLoading(true);
    setLoginError('');

    try {
      if (rememberMe) {
        localStorage.setItem('remotale_remember_me', 'true');
        localStorage.setItem('remotale_remembered_email', loginEmail.trim());
        localStorage.setItem('remotale_remembered_role', selectedRole);
      } else {
        localStorage.removeItem('remotale_remember_me');
        localStorage.removeItem('remotale_remembered_email');
        localStorage.removeItem('remotale_remembered_role');
      }

      await onLogin(loginEmail.trim(), loginPassword);
    } catch (err) {
      setLoginError(err.message || 'Invalid credentials. Please verify your email/username and password.');
    } finally {
      setLoginLoading(false);
    }
  };

  // Handle Register Submit
  const handleRegisterSubmit = async (e) => {
    if (e) e.preventDefault();
    if (!regName.trim() || !regEmail.trim() || !regPassword) {
      setRegError('Please fill in all required fields.');
      return;
    }

    if (regPassword !== regConfirmPassword) {
      setRegError('Passwords do not match. Please verify your password.');
      return;
    }

    if (regPassword.length < 6) {
      setRegError('Password must be at least 6 characters long.');
      return;
    }

    setRegLoading(true);
    setRegError('');

    try {
      await onRegister({
        name: regName.trim(),
        email: regEmail.trim(),
        password: regPassword.trim(),
        role: selectedRole === 'admin' ? 'admin' : 'client'
      });
    } catch (err) {
      setRegError(err.message || 'Registration failed. Please check your details and try again.');
    } finally {
      setRegLoading(false);
    }
  };

  // Handle Forgot Password Submit
  const handleForgotPasswordSubmit = async (e) => {
    e.preventDefault();
    if (!forgotEmail.trim() || !forgotNewPassword) {
      setForgotMessage({ type: 'error', text: 'Email and new password are required.' });
      return;
    }

    if (forgotNewPassword.length < 6) {
      setForgotMessage({ type: 'error', text: 'Password must be at least 6 characters long.' });
      return;
    }

    if (forgotNewPassword !== forgotConfirmPassword) {
      setForgotMessage({ type: 'error', text: 'Passwords do not match.' });
      return;
    }

    setForgotLoading(true);
    setForgotMessage({ type: '', text: '' });

    try {
      const res = await api.forgotPassword(forgotEmail.trim(), forgotNewPassword);
      setForgotMessage({ type: 'success', text: res.message || 'Password successfully updated in database!' });
      setLoginEmail(forgotEmail.trim());
      setLoginPassword(forgotNewPassword);
      setTimeout(() => {
        setIsForgotModalOpen(false);
        setForgotMessage({ type: '', text: '' });
      }, 1600);
    } catch (err) {
      setForgotMessage({ type: 'error', text: err.message || 'Failed to reset password. User not found.' });
    } finally {
      setForgotLoading(false);
    }
  };

  // Quick Demo Autofill Helper for all Published Accounts
  const handleQuickFill = (accountKey) => {
    if (accountKey === 'admin') {
      setSelectedRole('admin');
      setLoginEmail('admin');
      setLoginPassword('admin');
    } else if (accountKey === 'awais') {
      setSelectedRole('client');
      setLoginEmail('awais');
      setLoginPassword('awais');
    } else if (accountKey === 'afshal') {
      setSelectedRole('client');
      setLoginEmail('afshal');
      setLoginPassword('afshal');
    } else if (accountKey === 'ali') {
      setSelectedRole('client');
      setLoginEmail('ali');
      setLoginPassword('client123');
    } else if (accountKey === 'client') {
      setSelectedRole('client');
      setLoginEmail('awais');
      setLoginPassword('awais');
    } else {
      setSelectedRole('admin');
      setLoginEmail('admin');
      setLoginPassword('admin');
    }
    setActiveScreen('login');
  };

  // ==========================================
  // RENDER SCREEN 1: WELCOME / ROLE SELECTION
  // ==========================================
  const renderScreen1 = () => (
    <div className="remotale-phone-frame" id="remotale-screen-1">
      <StatusBar />
      <div className="remotale-screen-body">
        <div className="remotale-welcome-screen">
          {/* Top Brand */}
          <div className="remotale-welcome-top-brand">
            <RemotaleLogo size={28} />
            <span className="remotale-welcome-brand-text">Remotale</span>
          </div>

          {/* Hero Headline */}
          <div>
            <h1 className="remotale-hero-title">
              Manage<br />
              Projects<br />
              <span className="remotale-hero-highlight">Together</span>
            </h1>
            <p className="remotale-hero-description">
              A simple and powerful platform to manage clients, projects, tasks and collaborate with your team.
            </p>
          </div>

          {/* Floating Graphic Section */}
          <div className="remotale-visual-showcase">
            <div className="remotale-ambient-shape" />

            {/* Rising Chart Square */}
            <div className="remotale-chart-badge" title="Live Metrics">
              <BarChart3D size={22} />
            </div>

            {/* Project Progress Card */}
            <div className="remotale-progress-card">
              <div className="remotale-progress-header">
                <span className="remotale-progress-title">Project Progress</span>
                <span className="remotale-progress-percent">70%</span>
              </div>
              <div className="remotale-progress-bar-track">
                <div className="remotale-progress-bar-fill" />
              </div>
              <div className="remotale-checklist">
                <div className="remotale-check-item">
                  <span className="remotale-check-dot">✓</span>
                  <span>Design</span>
                </div>
                <div className="remotale-check-item">
                  <span className="remotale-check-dot">✓</span>
                  <span>Development</span>
                </div>
                <div className="remotale-check-item">
                  <span className="remotale-check-dot">✓</span>
                  <span>Testing</span>
                </div>
              </div>
            </div>

            {/* Team Pill Card */}
            <div className="remotale-team-pill">
              <span className="remotale-team-label">Team</span>
              <div className="remotale-team-avatars">
                <img
                  src="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&auto=format&fit=crop&q=80"
                  alt="Team member 1"
                  className="remotale-avatar-img"
                />
                <img
                  src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&auto=format&fit=crop&q=80"
                  alt="Team member 2"
                  className="remotale-avatar-img"
                />
                <img
                  src="https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100&auto=format&fit=crop&q=80"
                  alt="Team member 3"
                  className="remotale-avatar-img"
                />
                <div className="remotale-avatar-more">+2</div>
              </div>
            </div>
          </div>

          {/* Bottom "Continue as" Container */}
          <div className="remotale-continue-container">
            <h3 className="remotale-continue-heading">Continue as</h3>
            <p className="remotale-continue-subtext">Choose how you want to get started.</p>

            {/* Client Option Card */}
            <button
              type="button"
              className="remotale-role-card"
              onClick={() => {
                setSelectedRole('client');
                setActiveScreen('login');
              }}
            >
              <div className="remotale-role-card-left">
                <div className="remotale-role-icon-box client">
                  <UserIcon size={20} color="#4F46E5" />
                </div>
                <div className="remotale-role-text">
                  <span className="remotale-role-title">Client</span>
                  <span className="remotale-role-desc">Track your projects, give feedback and stay updated.</span>
                </div>
              </div>
              <span className="remotale-role-arrow">→</span>
            </button>

            {/* Admin / Team Option Card */}
            <button
              type="button"
              className="remotale-role-card"
              onClick={() => {
                setSelectedRole('admin');
                setActiveScreen('login');
              }}
            >
              <div className="remotale-role-card-left">
                <div className="remotale-role-icon-box admin">
                  <TeamUsersIcon size={20} color="#2563EB" />
                </div>
                <div className="remotale-role-text">
                  <span className="remotale-role-title">Admin / Team</span>
                  <span className="remotale-role-desc">Manage clients, projects, tasks and your team.</span>
                </div>
              </div>
              <span className="remotale-role-arrow">→</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );

  // ==========================================
  // RENDER SCREEN 2: SIGNUP (Name, Email, Password, Confirm Password)
  // ==========================================
  const renderScreen2 = () => (
    <div className="remotale-phone-frame" id="remotale-screen-2">
      <StatusBar />
      <div className="remotale-screen-body">
        {/* Navigation Header */}
        <div className="remotale-top-nav-row">
          <button
            type="button"
            className="remotale-back-btn"
            onClick={() => setActiveScreen('welcome')}
            title="Back to Welcome"
          >
            <BackArrowIcon size={19} />
          </button>
          <div className="remotale-center-brand">
            <RemotaleLogo size={24} />
            <span>Remotale</span>
          </div>
        </div>

        {/* Title Area */}
        <div className="remotale-screen-title-area">
          <h2>Create Your Account</h2>
          <p>
            {selectedRole === 'admin'
              ? 'Join as an admin / team and start managing your projects with us.'
              : 'Join as a client and start managing your projects with us.'}
          </p>
        </div>

        {/* Role Selection Tabs */}
        <div className="remotale-role-tabs">
          <button
            type="button"
            className={`remotale-role-tab-btn ${selectedRole === 'client' ? 'active' : ''}`}
            onClick={() => setSelectedRole('client')}
          >
            <UserIcon size={15} color={selectedRole === 'client' ? '#4F46E5' : '#64748B'} />
            <span>Client</span>
          </button>
          <button
            type="button"
            className={`remotale-role-tab-btn ${selectedRole === 'admin' ? 'active' : ''}`}
            onClick={() => setSelectedRole('admin')}
          >
            <BriefcaseIcon size={15} color={selectedRole === 'admin' ? '#4F46E5' : '#64748B'} />
            <span>Admin / Team</span>
          </button>
        </div>

        {/* Error Notice */}
        {regError && <div className="remotale-error-notice">{regError}</div>}

        {/* Role Content: Admin shows Contact Owner notice, Client shows 4-field Signup Form */}
        {selectedRole === 'admin' ? (
          <div className="remotale-admin-contact-card">
            <div className="remotale-admin-lock-badge">
              <LockIcon size={24} color="#4F46E5" />
            </div>
            <h3>Contact Owner to Get Signed Up</h3>
            <p>
              Admin and team accounts cannot be self-registered. Please contact the agency owner to get signed up and receive your credentials.
            </p>
            <a 
              href="mailto:admin@remotale.com?subject=Admin%20Account%20Access%20Request%20-%20Remotale" 
              className="remotale-contact-owner-btn"
            >
              <MailIcon size={16} color="#FFFFFF" />
              <span>Contact Owner (admin@remotale.com)</span>
            </a>
            <button
              type="button"
              className="remotale-secondary-action-btn"
              onClick={() => {
                setSelectedRole('admin');
                setActiveScreen('login');
              }}
            >
              Already have an account? Log In →
            </button>
            <button
              type="button"
              className="remotale-link-action-btn"
              onClick={() => setSelectedRole('client')}
            >
              ← Sign up as a Client instead
            </button>
          </div>
        ) : (
          /* Client Form: EXACTLY 4 Fields: Name, Email, Password, Confirm Password */
          <form onSubmit={handleRegisterSubmit} className="remotale-auth-form">
            {/* Field 1: Full Name */}
            <div className="remotale-input-group-with-icon">
              <div className="remotale-input-circle-icon">
                <UserIcon size={18} color="#64748B" />
              </div>
              <div className="remotale-input-field-wrapper">
                <label className="remotale-input-label">Full Name</label>
                <input
                  type="text"
                  className="remotale-input-box"
                  placeholder="Enter your full name"
                  value={regName}
                  onChange={(e) => setRegName(e.target.value)}
                  required
                  autoComplete="name"
                />
              </div>
            </div>

            {/* Field 2: Email / Username */}
            <div className="remotale-input-group-with-icon">
              <div className="remotale-input-circle-icon">
                <MailIcon size={18} color="#64748B" />
              </div>
              <div className="remotale-input-field-wrapper">
                <label className="remotale-input-label">Email / Username</label>
                <input
                  type="text"
                  className="remotale-input-box"
                  placeholder="you@example.com or username"
                  value={regEmail}
                  onChange={(e) => setRegEmail(e.target.value)}
                  required
                  autoComplete="username"
                />
              </div>
            </div>

            {/* Field 3: Password */}
            <div className="remotale-input-group-with-icon">
              <div className="remotale-input-circle-icon">
                <LockIcon size={18} color="#64748B" />
              </div>
              <div className="remotale-input-field-wrapper">
                <label className="remotale-input-label">Password</label>
                <div className="remotale-pw-box-wrapper">
                  <input
                    type={showRegPw ? 'text' : 'password'}
                    className="remotale-input-box"
                    placeholder="Create a strong password"
                    value={regPassword}
                    onChange={(e) => setRegPassword(e.target.value)}
                    required
                    autoComplete="new-password"
                  />
                  <button
                    type="button"
                    className="remotale-eye-toggle-btn"
                    onClick={() => setShowRegPw(!showRegPw)}
                    title={showRegPw ? 'Hide password' : 'Show password'}
                  >
                    <EyeIcon visible={showRegPw} size={16} />
                  </button>
                </div>
              </div>
            </div>

            {/* Field 4: Confirm Password */}
            <div className="remotale-input-group-with-icon">
              <div className="remotale-input-circle-icon">
                <LockIcon size={18} color="#64748B" />
              </div>
              <div className="remotale-input-field-wrapper">
                <label className="remotale-input-label">Confirm Password</label>
                <div className="remotale-pw-box-wrapper">
                  <input
                    type={showRegConfirmPw ? 'text' : 'password'}
                    className="remotale-input-box"
                    placeholder="Confirm your password"
                    value={regConfirmPassword}
                    onChange={(e) => setRegConfirmPassword(e.target.value)}
                    required
                    autoComplete="new-password"
                  />
                  <button
                    type="button"
                    className="remotale-eye-toggle-btn"
                    onClick={() => setShowRegConfirmPw(!showRegConfirmPw)}
                    title={showRegConfirmPw ? 'Hide password' : 'Show password'}
                  >
                    <EyeIcon visible={showRegConfirmPw} size={16} />
                  </button>
                </div>
              </div>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              className="remotale-primary-btn"
              disabled={regLoading}
            >
              {regLoading ? 'Creating Account...' : (
                <>
                  <span>Create Account</span>
                  <span>→</span>
                </>
              )}
            </button>
          </form>
        )}

        {/* Switch to Login Link */}
        <div className="remotale-bottom-footer-link">
          Already have an account?{' '}
          <button
            type="button"
            className="remotale-inline-action-btn"
            onClick={() => setActiveScreen('login')}
          >
            Log In
          </button>
        </div>
      </div>
    </div>
  );

  // ==========================================
  // RENDER SCREEN 3: LOGIN (Email, Password, Remember Me, Forgot Password)
  // ==========================================
  const renderScreen3 = () => (
    <div className="remotale-phone-frame" id="remotale-screen-3">
      <StatusBar />
      <div className="remotale-screen-body">
        {/* Navigation Header */}
        <div className="remotale-top-nav-row">
          <button
            type="button"
            className="remotale-back-btn"
            onClick={() => setActiveScreen('welcome')}
            title="Back to Welcome"
          >
            <BackArrowIcon size={19} />
          </button>
          <div className="remotale-center-brand">
            <RemotaleLogo size={24} />
            <span>Remotale</span>
          </div>
        </div>

        {/* Title Area */}
        <div className="remotale-screen-title-area">
          <h2>Welcome Back</h2>
          <p>Login to your account to continue managing your projects.</p>
        </div>

        {/* Role Selection Tabs */}
        <div className="remotale-role-tabs">
          <button
            type="button"
            className={`remotale-role-tab-btn ${selectedRole === 'client' ? 'active' : ''}`}
            onClick={() => setSelectedRole('client')}
          >
            <UserIcon size={15} color={selectedRole === 'client' ? '#4F46E5' : '#64748B'} />
            <span>Client</span>
          </button>
          <button
            type="button"
            className={`remotale-role-tab-btn ${selectedRole === 'admin' ? 'active' : ''}`}
            onClick={() => setSelectedRole('admin')}
          >
            <BriefcaseIcon size={15} color={selectedRole === 'admin' ? '#4F46E5' : '#64748B'} />
            <span>Admin / Team</span>
          </button>
        </div>

        {/* Error Notice */}
        {loginError && <div className="remotale-error-notice">{loginError}</div>}

        {/* Login Form */}
        <form onSubmit={handleLoginSubmit} className="remotale-auth-form">
          {/* Field 1: Email / Username with Mail Icon Inside */}
          <div className="remotale-input-field-wrapper">
            <label className="remotale-input-label">Email / Username</label>
            <div className="remotale-inline-icon-input">
              <span className="remotale-inline-left-icon">
                <MailIcon size={17} color="#64748B" />
              </span>
              <input
                type="text"
                className="remotale-input-box"
                placeholder="Enter email or username"
                value={loginEmail}
                onChange={(e) => setLoginEmail(e.target.value)}
                required
                autoComplete="username"
              />
            </div>
          </div>

          {/* Field 2: Password with Lock Icon Inside and Eye Toggle on Right (Identical to Email Field Style) */}
          <div className="remotale-input-field-wrapper">
            <label className="remotale-input-label">Password</label>
            <div className="remotale-inline-icon-input remotale-pw-box-wrapper">
              <span className="remotale-inline-left-icon">
                <LockIcon size={17} color="#64748B" />
              </span>
              <input
                type={showLoginPw ? 'text' : 'password'}
                className="remotale-input-box"
                placeholder="Enter your password"
                value={loginPassword}
                onChange={(e) => setLoginPassword(e.target.value)}
                required
                autoComplete="current-password"
                style={{ paddingLeft: '38px', paddingRight: '40px' }}
              />
              <button
                type="button"
                className="remotale-eye-toggle-btn"
                onClick={() => setShowLoginPw(!showLoginPw)}
                title={showLoginPw ? 'Hide password' : 'Show password'}
              >
                <EyeIcon visible={showLoginPw} size={16} />
              </button>
            </div>
          </div>

          {/* Options Row: Remember Me & Forgot Password */}
          <div className="remotale-options-row">
            <label className="remotale-remember-label">
              <div
                className={`remotale-checkbox-custom ${rememberMe ? 'checked' : ''}`}
                onClick={() => setRememberMe(!rememberMe)}
                role="checkbox"
                aria-checked={rememberMe}
                tabIndex={0}
              >
                {rememberMe && (
                  <svg width="10" height="8" viewBox="0 0 10 8" fill="none" stroke="#FFFFFF" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <polyline points="1 4 3.5 6.5 9 1" />
                  </svg>
                )}
              </div>
              <span>Remember me</span>
            </label>

            <button
              type="button"
              className="remotale-forgot-link"
              onClick={() => {
                setForgotEmail(loginEmail || '');
                setIsForgotModalOpen(true);
              }}
            >
              Forgot password?
            </button>
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            className="remotale-primary-btn"
            disabled={loginLoading}
          >
            {loginLoading ? 'Logging In...' : (
              <>
                <span>Log In</span>
                <span>→</span>
              </>
            )}
          </button>
        </form>

        {/* Published Accounts & Quick Access Directory */}
        <div className="remotale-published-accounts-card">
          <div className="remotale-published-header">
            <span className="remotale-published-tag">🔑 Published Credentials</span>
            <span className="remotale-published-sub">1-Click Auto-Fill & Test</span>
          </div>
          <div className="remotale-published-grid">
            <button
              type="button"
              className={`remotale-account-chip ${loginEmail === 'admin' ? 'active' : ''}`}
              onClick={() => handleQuickFill('admin')}
              title="Super Admin • Sees All 10 Projects"
            >
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', width: '100%' }}>
                <span className="remotale-chip-badge admin">👑 Admin</span>
                <span style={{ fontSize: '9.5px', color: '#64748b' }}>All 10 Projs</span>
              </div>
              <span className="remotale-chip-name">Abdullah</span>
              <span className="remotale-chip-cred">admin / admin</span>
            </button>

            <button
              type="button"
              className={`remotale-account-chip ${loginEmail === 'awais' ? 'active' : ''}`}
              onClick={() => handleQuickFill('awais')}
              title="Client Awais • Sees His 8 Projects Only"
            >
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', width: '100%' }}>
                <span className="remotale-chip-badge client">👤 Client</span>
                <span style={{ fontSize: '9.5px', color: '#64748b' }}>8 Projs Only</span>
              </div>
              <span className="remotale-chip-name">Awais</span>
              <span className="remotale-chip-cred">awais / awais</span>
            </button>

            <button
              type="button"
              className={`remotale-account-chip ${loginEmail === 'afshal' ? 'active' : ''}`}
              onClick={() => handleQuickFill('afshal')}
              title="Client Afshal • Sees Her 2 Projects Only"
            >
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', width: '100%' }}>
                <span className="remotale-chip-badge client">👤 Client</span>
                <span style={{ fontSize: '9.5px', color: '#64748b' }}>2 Projs Only</span>
              </div>
              <span className="remotale-chip-name">Afshal</span>
              <span className="remotale-chip-cred">afshal / afshal</span>
            </button>

            <button
              type="button"
              className={`remotale-account-chip ${loginEmail === 'ali' ? 'active' : ''}`}
              onClick={() => handleQuickFill('ali')}
              title="Client Ali Khan • Acme Brand"
            >
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', width: '100%' }}>
                <span className="remotale-chip-badge client">👤 Client</span>
                <span style={{ fontSize: '9.5px', color: '#64748b' }}>Client</span>
              </div>
              <span className="remotale-chip-name">Ali Khan</span>
              <span className="remotale-chip-cred">ali / client123</span>
            </button>
          </div>
        </div>

        {/* Switch to Sign Up Link */}
        <div className="remotale-bottom-footer-link">
          Don't have an account?{' '}
          <button
            type="button"
            className="remotale-inline-action-btn"
            onClick={() => setActiveScreen('signup')}
          >
            Sign Up
          </button>
        </div>
      </div>
    </div>
  );

  return (
    <div className="remotale-auth-viewport">
      {/* Top Interactive Switcher Toolbar */}
      <header className="remotale-top-nav-bar">
        <div className="remotale-top-brand">
          <RemotaleLogo size={22} />
          <span>Remotale OS</span>
        </div>

        {/* Screen Switcher Pills */}
        <div className="remotale-nav-pills">
          <button
            type="button"
            className={`remotale-nav-pill-btn ${viewMode === 'interactive' && activeScreen === 'welcome' ? 'active' : ''}`}
            onClick={() => {
              setViewMode('interactive');
              setActiveScreen('welcome');
            }}
          >
            <span className="remotale-badge-num">1</span>
            <span>Welcome</span>
          </button>

          <button
            type="button"
            className={`remotale-nav-pill-btn ${viewMode === 'interactive' && activeScreen === 'signup' ? 'active' : ''}`}
            onClick={() => {
              setViewMode('interactive');
              setActiveScreen('signup');
            }}
          >
            <span className="remotale-badge-num">2</span>
            <span>Signup</span>
          </button>

          <button
            type="button"
            className={`remotale-nav-pill-btn ${viewMode === 'interactive' && activeScreen === 'login' ? 'active' : ''}`}
            onClick={() => {
              setViewMode('interactive');
              setActiveScreen('login');
            }}
          >
            <span className="remotale-badge-num">3</span>
            <span>Login</span>
          </button>

          <button
            type="button"
            className={`remotale-nav-pill-btn ${viewMode === 'all' ? 'active' : ''}`}
            onClick={() => setViewMode('all')}
          >
            <span>📱 Side-by-Side (Mockup View)</span>
          </button>
        </div>

        {/* Quick Autofill Helper for Published Accounts */}
        <div style={{ display: 'flex', gap: '6px', flexWrap: 'wrap', alignItems: 'center' }}>
          <button
            type="button"
            className="remotale-quick-access-btn"
            onClick={() => handleQuickFill('admin')}
            title="Admin Abdullah (admin / admin) • All 10 Projects"
          >
            <span>👑 Admin</span>
          </button>
          <button
            type="button"
            className="remotale-quick-access-btn"
            onClick={() => handleQuickFill('awais')}
            title="Client Awais (awais / awais) • 8 Projects Only"
          >
            <span>👤 Awais (8 Projs)</span>
          </button>
          <button
            type="button"
            className="remotale-quick-access-btn"
            onClick={() => handleQuickFill('afshal')}
            title="Client Afshal (afshal / afshal) • 2 Projects Only"
          >
            <span>👤 Afshal (2 Projs)</span>
          </button>
          <button
            type="button"
            className="remotale-quick-access-btn"
            onClick={() => handleQuickFill('ali')}
            title="Client Ali Khan (ali / client123)"
          >
            <span>👤 Ali Khan</span>
          </button>
        </div>
      </header>

      {/* Main Container: Single Interactive View or Side-by-Side 3-Screen View */}
      {viewMode === 'all' ? (
        <div className="remotale-screens-container side-by-side">
          {/* Column 1: Screen 1 */}
          <div className="remotale-screen-column">
            <div className="remotale-screen-header-badge">1</div>
            {renderScreen1()}
          </div>

          {/* Column 2: Screen 2 */}
          <div className="remotale-screen-column">
            <div className="remotale-screen-header-badge">2</div>
            {renderScreen2()}
          </div>

          {/* Column 3: Screen 3 */}
          <div className="remotale-screen-column">
            <div className="remotale-screen-header-badge">3</div>
            {renderScreen3()}
          </div>
        </div>
      ) : (
        <div className="remotale-screens-container">
          <div className="remotale-screen-column">
            {activeScreen === 'welcome' && renderScreen1()}
            {activeScreen === 'signup' && renderScreen2()}
            {activeScreen === 'login' && renderScreen3()}
          </div>
        </div>
      )}

      {/* Forgot Password Modal */}
      {isForgotModalOpen && (
        <div className="remotale-modal-overlay" onClick={() => setIsForgotModalOpen(false)}>
          <div className="remotale-modal-box" onClick={(e) => e.stopPropagation()}>
            <button
              type="button"
              className="remotale-modal-close-btn"
              onClick={() => setIsForgotModalOpen(false)}
            >
              ✕
            </button>
            <div style={{ textAlign: 'center', marginBottom: '18px' }}>
              <div style={{ display: 'inline-flex', padding: '10px', background: '#f5f3ff', borderRadius: '50%', color: '#4f46e5', marginBottom: '10px' }}>
                <LockIcon size={24} color="#4F46E5" />
              </div>
              <h3 style={{ fontSize: '18px', fontWeight: 800, margin: '0 0 6px 0', color: '#0f172a' }}>
                Reset Your Password
              </h3>
              <p style={{ fontSize: '12px', color: '#64748b', margin: 0 }}>
                Enter your registered email and choose a new password. It will update directly in the cloud database.
              </p>
            </div>

            {forgotMessage.text && (
              <div className={forgotMessage.type === 'error' ? 'remotale-error-notice' : 'remotale-success-notice'}>
                {forgotMessage.text}
              </div>
            )}

            <form onSubmit={handleForgotPasswordSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              <div className="remotale-input-field-wrapper">
                <label className="remotale-input-label">Registered Email / Username</label>
                <input
                  type="text"
                  className="remotale-input-box"
                  placeholder="you@example.com or username"
                  value={forgotEmail}
                  onChange={(e) => setForgotEmail(e.target.value)}
                  required
                />
              </div>

              <div className="remotale-input-field-wrapper">
                <label className="remotale-input-label">New Password (min 6 chars)</label>
                <input
                  type="password"
                  className="remotale-input-box"
                  placeholder="Enter new password"
                  value={forgotNewPassword}
                  onChange={(e) => setForgotNewPassword(e.target.value)}
                  required
                />
              </div>

              <div className="remotale-input-field-wrapper">
                <label className="remotale-input-label">Confirm New Password</label>
                <input
                  type="password"
                  className="remotale-input-box"
                  placeholder="Confirm new password"
                  value={forgotConfirmPassword}
                  onChange={(e) => setForgotConfirmPassword(e.target.value)}
                  required
                />
              </div>

              <button
                type="submit"
                className="remotale-primary-btn"
                disabled={forgotLoading}
                style={{ marginTop: '10px' }}
              >
                {forgotLoading ? 'Updating Database...' : 'Save New Password & Login'}
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
