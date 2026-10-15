import React, { useState } from 'react';

export default function SignIn({ onLogin, onRegister, initialPortalToken }) {
  const [mode, setMode] = useState('signin'); // 'signin' or 'register'
  
  // Sign In state
  const [identifier, setIdentifier] = useState(initialPortalToken || '');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);

  // Register state
  const [regName, setRegName] = useState('');
  const [regCompany, setRegCompany] = useState('');
  const [regEmail, setRegEmail] = useState('');
  const [regPassword, setRegPassword] = useState('');
  const [regConfirmPassword, setRegConfirmPassword] = useState('');
  const [showRegPassword, setShowRegPassword] = useState(false);

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSwitchMode = (newMode) => {
    setMode(newMode);
    setError('');
  };

  const handleSignInSubmit = async (e) => {
    e.preventDefault();
    if (!identifier.trim() || !password) {
      setError('Please provide your email address and password.');
      return;
    }

    setLoading(true);
    setError('');

    try {
      await onLogin(identifier.trim(), password);
    } catch (err) {
      setError(err.message || 'Authentication failed. Please verify your credentials.');
    } finally {
      setLoading(false);
    }
  };

  const handleRegisterSubmit = async (e) => {
    e.preventDefault();
    if (!regName.trim() || !regCompany.trim() || !regEmail.trim() || !regPassword) {
      setError('Please fill in all required fields.');
      return;
    }

    if (regPassword !== regConfirmPassword) {
      setError('Passwords do not match. Please re-enter your password.');
      return;
    }

    if (regPassword.length < 6) {
      setError('Password must be at least 6 characters long.');
      return;
    }

    setLoading(true);
    setError('');

    try {
      if (onRegister) {
        await onRegister({
          name: regName.trim(),
          company: regCompany.trim(),
          email: regEmail.trim(),
          password: regPassword.trim()
        });
      }
    } catch (err) {
      setError(err.message || 'Registration failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="signin-page-wrapper">
      <div className="signin-card">
        {/* Brand Header */}
        <div className="signin-header">
          <div className="signin-logo-badge">
            <span className="signin-dot"></span>
            BYTEFORGE STUDIO
          </div>
          <h2>{mode === 'signin' ? 'Welcome Back' : 'Create Client Portal'}</h2>
          <p>
            {mode === 'signin' 
              ? 'Enter your credentials to access your workspace' 
              : 'Set up your company workspace to manage deliverables & revisions'}
          </p>
        </div>

        {/* Error Banner */}
        {error && (
          <div className="signin-error-banner" role="alert">
            <span>{error}</span>
          </div>
        )}

        {/* Sign In Form */}
        {mode === 'signin' ? (
          <form onSubmit={handleSignInSubmit} className="signin-form">
            <div className="form-group">
              <label className="form-label">Email / Username</label>
              <input
                type="text"
                className="form-input"
                placeholder="name@company.com or username"
                value={identifier}
                onChange={(e) => setIdentifier(e.target.value)}
                required
                autoFocus
                autoComplete="username"
              />
            </div>

            <div className="form-group">
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <label className="form-label">Password</label>
                <button
                  type="button"
                  className="signin-show-pw-btn"
                  onClick={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? 'Hide' : 'Show'}
                </button>
              </div>
              <input
                type={showPassword ? 'text' : 'password'}
                className="form-input"
                placeholder="Enter your password..."
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                autoComplete="current-password"
              />
            </div>

            <button
              type="submit"
              className="btn btn-primary signin-submit-btn"
              disabled={loading}
            >
              {loading ? 'Authenticating...' : 'Sign In →'}
            </button>
          </form>
        ) : (
          /* Register / Create Account Form */
          <form onSubmit={handleRegisterSubmit} className="signin-form">
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
              <div className="form-group">
                <label className="form-label">Full Name *</label>
                <input
                  type="text"
                  className="form-input"
                  placeholder="e.g., Alex Vance"
                  value={regName}
                  onChange={(e) => setRegName(e.target.value)}
                  required
                  autoFocus
                />
              </div>

              <div className="form-group">
                <label className="form-label">Company / Brand *</label>
                <input
                  type="text"
                  className="form-input"
                  placeholder="e.g., Acme Labs"
                  value={regCompany}
                  onChange={(e) => setRegCompany(e.target.value)}
                  required
                />
              </div>
            </div>

            <div className="form-group">
              <label className="form-label">Work Email *</label>
              <input
                type="email"
                className="form-input"
                placeholder="alex@company.com"
                value={regEmail}
                onChange={(e) => setRegEmail(e.target.value)}
                required
                autoComplete="email"
              />
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
              <div className="form-group">
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <label className="form-label">Password *</label>
                  <button
                    type="button"
                    className="signin-show-pw-btn"
                    onClick={() => setShowRegPassword(!showRegPassword)}
                  >
                    {showRegPassword ? 'Hide' : 'Show'}
                  </button>
                </div>
                <input
                  type={showRegPassword ? 'text' : 'password'}
                  className="form-input"
                  placeholder="Min 6 characters"
                  value={regPassword}
                  onChange={(e) => setRegPassword(e.target.value)}
                  required
                  autoComplete="new-password"
                />
              </div>

              <div className="form-group">
                <label className="form-label">Confirm Password *</label>
                <input
                  type={showRegPassword ? 'text' : 'password'}
                  className="form-input"
                  placeholder="Confirm password"
                  value={regConfirmPassword}
                  onChange={(e) => setRegConfirmPassword(e.target.value)}
                  required
                  autoComplete="new-password"
                />
              </div>
            </div>

            <button
              type="submit"
              className="btn btn-primary signin-submit-btn"
              disabled={loading}
            >
              {loading ? 'Creating Account...' : 'Create Account & Enter Portal →'}
            </button>
          </form>
        )}

        {/* Mode Toggle Footer */}
        <div className="signin-footer">
          {mode === 'signin' ? (
            <div style={{ fontSize: '13px', color: 'var(--text-secondary)' }}>
              New to ByteForge?{' '}
              <button
                type="button"
                className="signin-mode-link"
                onClick={() => handleSwitchMode('register')}
                style={{
                  background: 'none',
                  border: 'none',
                  color: 'var(--accent-primary)',
                  fontWeight: 700,
                  cursor: 'pointer',
                  padding: 0,
                  textDecoration: 'underline'
                }}
              >
                Create client account
              </button>
            </div>
          ) : (
            <div style={{ fontSize: '13px', color: 'var(--text-secondary)' }}>
              Already registered?{' '}
              <button
                type="button"
                className="signin-mode-link"
                onClick={() => handleSwitchMode('signin')}
                style={{
                  background: 'none',
                  border: 'none',
                  color: 'var(--accent-primary)',
                  fontWeight: 700,
                  cursor: 'pointer',
                  padding: 0,
                  textDecoration: 'underline'
                }}
              >
                Sign in to your portal
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
