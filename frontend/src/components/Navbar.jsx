import React from 'react';

export default function Navbar({ 
  currentPersona, 
  setCurrentPersona, 
  clients, 
  activeTab, 
  setActiveTab,
  stats,
  onOpenNewProject,
  onOpenNewChange,
  onOpenNewClient,
  driver,
  theme,
  setTheme
}) {
  const isClient = currentPersona.type === 'client';
  const currentClient = isClient ? clients.find(c => c.id === currentPersona.id) : null;

  return (
    <>
      {/* Top Persona Switcher Bar (Zero green dots, zero clutter) */}
      <div className="persona-bar">
        <div className="persona-left">
          <span className="persona-label">View:</span>
          <div className="persona-chips">
            <button
              className={`persona-chip ${currentPersona.type === 'admin' ? 'active' : ''}`}
              onClick={() => setCurrentPersona({ type: 'admin', id: 'admin' })}
            >
              Agency Admin
            </button>

            {clients.map(client => (
              <button
                key={client.id}
                className={`persona-chip ${currentPersona.type === 'client' && currentPersona.id === client.id ? 'active' : ''}`}
                onClick={() => setCurrentPersona({ type: 'client', id: client.id })}
              >
                {client.company}
              </button>
            ))}
          </div>
        </div>

        <div className="persona-right">
          <div className="env-pill">
            DB: {driver === 'neon-postgres' ? 'Neon Cloud DB' : 'Local DB'}
          </div>
          <button
            className="theme-toggle-btn"
            onClick={() => setTheme(prev => prev === 'dark' ? 'light' : 'dark')}
            title="Switch theme"
          >
            {theme === 'dark' ? 'Neon Dark' : 'Light Mode'}
          </button>
          {currentPersona.type === 'admin' ? (
            <button 
              className="btn btn-secondary btn-sm"
              onClick={onOpenNewClient}
            >
              + Add Client
            </button>
          ) : (
            <div className="env-pill">
              Token: {currentClient?.portalToken}
            </div>
          )}
        </div>
      </div>

      {/* Main App Header */}
      <header className="app-header">
        <div className="header-brand">
          <div className="brand-text-block">
            {isClient ? (
              <>
                <h1>
                  {currentClient?.company || 'Client Portal'}
                  <span className="badge-pill status-completed">Client Portal</span>
                </h1>
                <p>Welcome, {currentClient?.name || 'Client'} • Vanguard Agency Platform</p>
              </>
            ) : (
              <>
                <h1>
                  Vanguard Studio
                  <span className="badge-pill status-in-progress">Owner Panel</span>
                </h1>
                <p>Digital Agency Master Control • Multi-Client Operations</p>
              </>
            )}
          </div>
        </div>

        {/* Dynamic Navigation Tabs (No icons) */}
        <nav className="nav-tabs">
          {currentPersona.type === 'admin' ? (
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
                Clients
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
                Track Changes
              </button>
            </>
          )}
        </nav>

        {/* Action Button */}
        <div className="header-actions">
          {currentPersona.type === 'admin' ? (
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
