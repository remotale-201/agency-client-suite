import React, { useState } from 'react';

export default function SignIn({ onLogin, initialPortalToken }) {
  const [activeTab, setActiveTab] = useState(initialPortalToken ? 'client' : 'admin');
  const [identifier, setIdentifier] = useState(
    initialPortalToken || (activeTab === 'admin' ? 'byteforgeofficial.store@gmail.com' : '')
  );
  const [password, setPassword] = useState(activeTab === 'admin' ? 'Agbs1222' : '');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleTabSwitch = (tab) => {
    setActiveTab(tab);
    setError('');
    if (tab === 'admin') {
      setIdentifier('byteforgeofficial.store@gmail.com');
      setPassword('Agbs1222');
    } else {
      setIdentifier(initialPortalToken || '');
      setPassword('');
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!identifier.trim() || !password) {
      setError('Please provide your login ID and password.');
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

  return (
    <div className="signin-page-wrapper">
      <div className="signin-card">
        {/* Brand Header */}
        <div className="signin-header">
          <div className="signin-logo-badge">
            <span className="signin-dot"></span>
            BYTEFORGE STUDIO
          </div>
          <h2>Agency OS & Client Suite</h2>
          <p>
            {activeTab === 'admin' 
              ? 'Authorized Owner & Executive Master Control' 
              : 'Dedicated Client Workspace & Project Revisions'}
          </p>
        </div>

        {/* Portal Switcher Tabs */}
        <div className="signin-tabs">
          <button
            type="button"
            className={`signin-tab ${activeTab === 'admin' ? 'active' : ''}`}
            onClick={() => handleTabSwitch('admin')}
          >
            Admin Portal
          </button>
          <button
            type="button"
            className={`signin-tab ${activeTab === 'client' ? 'active' : ''}`}
            onClick={() => handleTabSwitch('client')}
          >
            Client Portal
          </button>
        </div>

        {/* Error Banner */}
        {error && (
          <div className="signin-error-banner">
            <span>{error}</span>
          </div>
        )}

        {/* Login Form */}
        <form onSubmit={handleSubmit} className="signin-form">
          <div className="form-group">
            <label className="form-label">
              {activeTab === 'admin' ? 'Administrator Email' : 'Client Email or Portal ID'}
            </label>
            <input
              type={activeTab === 'admin' ? 'email' : 'text'}
              className="form-input"
              placeholder={activeTab === 'admin' ? 'byteforgeofficial.store@gmail.com' : 'e.g., client@company.com or acme-portal'}
              value={identifier}
              onChange={(e) => setIdentifier(e.target.value)}
              required
              autoFocus
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
              placeholder="Enter your access password..."
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>

          <button
            type="submit"
            className="btn btn-primary signin-submit-btn"
            disabled={loading}
          >
            {loading ? 'Authenticating...' : `Sign In to ${activeTab === 'admin' ? 'Admin OS' : 'Client Portal'} →`}
          </button>
        </form>

        {/* Security & Access Info */}
        <div className="signin-footer">
          {activeTab === 'admin' ? (
            <div className="signin-hint-box">
              <span className="hint-label">Default Admin Access:</span>
              <code>byteforgeofficial.store@gmail.com</code>
            </div>
          ) : (
            <div className="signin-hint-box">
              <span className="hint-label">Client Access:</span>
              <span>Use the credentials created by your agency administrator.</span>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
