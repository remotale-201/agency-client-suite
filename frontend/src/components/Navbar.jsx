import React from 'react';

export default function Navbar({ 
  user,
  onLogout,
  currentPersona, 
  setCurrentPersona, 
  clients, 
  activeTab, 
  setActiveTab,
  stats,
  onOpenNewProject,
  onOpenNewChange,
  onOpenNewClient,
  onResetData,
  driver,
  theme,
  setTheme
}) {
  const isActualAdmin = user?.type === 'admin';
  const isPreviewingClient = isActualAdmin && currentPersona.type === 'client';
  const isClientView = currentPersona.type === 'client';
  const currentClient = isClientView 
    ? (clients.find(c => c.id === currentPersona.id) || user) 
    : null;

  return (
    <>
      {/* Top User & Session Bar */}
      <div className="persona-bar">
        <div className="persona-left">
          {isPreviewingClient ? (
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <span className="badge-pill urgency-high" style={{ fontSize: '11px' }}>
                Admin Preview Mode
              </span>
              <span style={{ fontSize: '13px', fontWeight: 700, color: 'var(--text-primary)' }}>
                Viewing: {currentClient?.company || 'Client Portal'}
              </span>
              <button
                className="btn btn-outline btn-sm"
                onClick={() => {
                  setCurrentPersona({ type: 'admin', id: 'admin' });
                  setActiveTab('dashboard');
                }}
                style={{ padding: '3px 8px', fontSize: '11px' }}
              >
                ✕ Exit Preview
              </button>
            </div>
          ) : (
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <div style={{
                width: '8px',
                height: '8px',
                borderRadius: '50%',
                background: 'var(--accent-primary)',
                boxShadow: '0 0 8px var(--accent-glow)'
              }} />
              <span style={{ fontSize: '12px', fontWeight: 700, color: 'var(--text-primary)' }}>
                {isActualAdmin ? 'ByteForge Admin' : (user?.company || user?.name || 'Client')}
              </span>
              <span className={`badge-pill ${isActualAdmin ? 'status-in-progress' : 'status-completed'}`} style={{ fontSize: '10px' }}>
                {isActualAdmin ? 'Owner OS' : 'Client Access'}
              </span>
            </div>
          )}
        </div>

        <div className="persona-right">
          <div className="env-pill">
            DB: {driver === 'neon-postgres' ? 'Neon Cloud' : 'Active'}
          </div>

          <button
            className="theme-toggle-btn"
            onClick={() => setTheme(prev => prev === 'dark' ? 'light' : 'dark')}
            title="Switch theme"
          >
            {theme === 'dark' ? 'Neon Dark' : 'Light Mode'}
          </button>

          {isActualAdmin && !isPreviewingClient && (
            <button 
              className="btn btn-secondary btn-sm"
              onClick={onOpenNewClient}
            >
              + Create Client
            </button>
          )}

          <button
            className="btn btn-outline btn-sm"
            onClick={onLogout}
            title="Sign out of portal"
            style={{ borderColor: 'var(--border-subtle)', color: 'var(--text-secondary)' }}
          >
            Log Out
          </button>
        </div>
      </div>

      {/* Main App Header */}
      <header className="app-header">
        <div className="header-brand">
          <div className="brand-text-block">
            {isClientView ? (
              <>
                <h1>
                  {currentClient?.company || 'Client Portal'}
                  <span className="badge-pill status-completed">Client Suite</span>
                </h1>
                <p>Welcome, {currentClient?.name || 'Client'} • ByteForge Agency Platform</p>
              </>
            ) : (
              <>
                <h1>
                  ByteForge Studio
                  <span className="badge-pill status-in-progress">Admin OS</span>
                </h1>
                <p>Agency Master Operations • Multi-Client Portals & Revisions</p>
              </>
            )}
          </div>
        </div>

        {/* Dynamic Navigation Tabs */}
        <nav className="nav-tabs">
          {!isClientView ? (
            <>
              <button 
                className={`nav-tab-btn ${activeTab === 'dashboard' ? 'active' : ''}`}
                onClick={() => setActiveTab('dashboard')}
              >
                Overview
              </button>

              <button 
                className={`nav-tab-btn ${activeTab === 'projects' ? 'active' : ''}`}
                onClick={() => setActiveTab('projects')}
              >
                Projects
                <span className="badge-count">{stats?.totalProjects || 0}</span>
              </button>

              <button 
                className={`nav-tab-btn ${activeTab === 'changes' ? 'active' : ''}`}
                onClick={() => setActiveTab('changes')}
              >
                Client Changes
                {stats?.criticalChanges > 0 ? (
                  <span className="badge-count critical">{stats.criticalChanges} Critical</span>
                ) : (
                  <span className="badge-count">{stats?.openChanges || 0}</span>
                )}
              </button>

              <button 
                className={`nav-tab-btn ${activeTab === 'notepads' ? 'active' : ''}`}
                onClick={() => setActiveTab('notepads')}
              >
                Notepads
              </button>

              <button 
                className={`nav-tab-btn ${activeTab === 'clients' ? 'active' : ''}`}
                onClick={() => setActiveTab('clients')}
              >
                Client Portals
                <span className="badge-count">{stats?.totalClients || 0}</span>
              </button>
            </>
          ) : (
            <>
              <button 
                className={`nav-tab-btn ${activeTab === 'client-projects' ? 'active' : ''}`}
                onClick={() => setActiveTab('client-projects')}
              >
                My Projects
              </button>

              <button 
                className={`nav-tab-btn ${activeTab === 'client-workspace' ? 'active' : ''}`}
                onClick={() => setActiveTab('client-workspace')}
              >
                Project Notepad
              </button>

              <button 
                className={`nav-tab-btn ${activeTab === 'client-changes' ? 'active' : ''}`}
                onClick={() => setActiveTab('client-changes')}
              >
                Track Revisions
              </button>
            </>
          )}
        </nav>

        {/* Action Button */}
        <div className="header-actions">
          {!isClientView ? (
            <button className="btn btn-primary" onClick={onOpenNewProject}>
              + New Project
            </button>
          ) : (
            <button className="btn btn-primary" onClick={onOpenNewChange}>
              + Submit Change
            </button>
          )}
        </div>
      </header>
    </>
  );
}
