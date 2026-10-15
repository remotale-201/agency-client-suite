import React, { useState } from 'react';
import { RemotaleLogo } from './RemotaleAuthFlow';

function timeAgo(dateString) {
  if (!dateString) return 'recently';
  const seconds = Math.floor((new Date() - new Date(dateString)) / 1000);
  if (seconds < 60) return 'Just now';
  const minutes = Math.floor(seconds / 60);
  if (minutes < 60) return `${minutes}m ago`;
  const hours = Math.floor(minutes / 60);
  if (hours < 24) return `${hours}h ago`;
  const days = Math.floor(hours / 24);
  return `${days}d ago`;
}

export default function Navbar({ 
  user,
  onLogout,
  currentPersona, 
  setCurrentPersona, 
  clients, 
  activeTab, 
  setActiveTab,
  stats,
  notifications = [],
  onMarkNotificationRead,
  onClearNotifications,
  onSelectProjectById,
  onOpenNewProject,
  onOpenNewChange,
  onOpenNewClient,
  driver,
  theme,
  setTheme
}) {
  const [isNotifOpen, setIsNotifOpen] = useState(false);
  const isActualAdmin = user?.type === 'admin';
  const isPreviewingClient = isActualAdmin && currentPersona.type === 'client';
  const isClientView = currentPersona.type === 'client';
  const currentClient = isClientView 
    ? (clients.find(c => c.id === currentPersona.id) || user) 
    : null;

  const unreadCount = (notifications || []).filter(n => !n.read).length;

  return (
    <>
      {/* Top User & Session Bar */}
      <div className="persona-bar">
        <div className="persona-left">
          {isPreviewingClient ? (
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', minWidth: 0 }}>
              <span className="badge-pill urgency-high" style={{ fontSize: '10px', flexShrink: 0 }}>
                Preview Mode
              </span>
              <span style={{ 
                fontSize: '12px', 
                fontWeight: 700, 
                color: 'var(--text-primary)',
                overflow: 'hidden',
                textOverflow: 'ellipsis',
                whiteSpace: 'nowrap'
              }}>
                {currentClient?.company || 'Client Portal'}
              </span>
              <button
                className="btn btn-outline btn-sm"
                onClick={() => {
                  setCurrentPersona({ type: 'admin', id: 'admin' });
                  setActiveTab('dashboard');
                }}
                style={{ padding: '2px 7px', fontSize: '10px', flexShrink: 0 }}
              >
                ✕ Exit
              </button>
            </div>
          ) : (
            <div style={{ display: 'flex', alignItems: 'center', gap: '7px', minWidth: 0 }}>
              <div style={{
                width: '7px',
                height: '7px',
                borderRadius: '50%',
                background: 'var(--accent-primary)',
                boxShadow: '0 0 8px var(--accent-glow)',
                flexShrink: 0
              }} />
              <span style={{ 
                fontSize: '12px', 
                fontWeight: 700, 
                color: 'var(--text-primary)',
                overflow: 'hidden',
                textOverflow: 'ellipsis',
                whiteSpace: 'nowrap'
              }}>
                {isActualAdmin ? (user?.name || 'Remotale Admin') : (user?.company || user?.name || 'Client')}
              </span>
              <span className={`badge-pill ${isActualAdmin ? 'status-in-progress' : 'status-completed'}`} style={{ fontSize: '9.5px', flexShrink: 0, padding: '2px 6px' }}>
                {isActualAdmin ? 'Owner OS' : 'Client Access'}
              </span>
            </div>
          )}
        </div>

        <div className="persona-right">
          <div className="env-pill">
            DB: {driver === 'neon-postgres' ? 'Cloud' : 'Active'}
          </div>

          <button
            className="theme-toggle-btn"
            onClick={() => setTheme(prev => prev === 'dark' ? 'light' : 'dark')}
            title="Switch theme"
          >
            {theme === 'dark' ? '🌙 Dark' : '☀️ Light'}
          </button>

          {/* Admin Real-Time Notification Center */}
          {isActualAdmin && (
            <div style={{ position: 'relative' }}>
              <button
                type="button"
                className="btn btn-outline btn-sm notif-bell-btn"
                onClick={() => setIsNotifOpen(!isNotifOpen)}
                title="Notifications"
                style={{ 
                  padding: '4px 8px', 
                  fontSize: '12px', 
                  position: 'relative',
                  borderColor: unreadCount > 0 ? 'var(--accent-primary)' : 'var(--border-subtle)' 
                }}
              >
                🔔
                {unreadCount > 0 && (
                  <span style={{
                    position: 'absolute',
                    top: '-4px',
                    right: '-4px',
                    background: 'var(--critical-bg)',
                    border: '1px solid var(--critical-border)',
                    color: 'var(--critical-text)',
                    fontSize: '9px',
                    fontWeight: 800,
                    minWidth: '15px',
                    height: '15px',
                    borderRadius: '50%',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    padding: '0 3px'
                  }}>
                    {unreadCount}
                  </span>
                )}
              </button>

              {/* Notification Popover Drawer */}
              {isNotifOpen && (
                <>
                  <div 
                    style={{ position: 'fixed', inset: 0, zIndex: 998 }} 
                    onClick={() => setIsNotifOpen(false)}
                  />
                  <div className="notif-dropdown" style={{
                    position: 'absolute',
                    top: 'calc(100% + 8px)',
                    right: 0,
                    width: '320px',
                    maxWidth: 'calc(100vw - 20px)',
                    background: 'var(--bg-surface)',
                    border: '1px solid var(--border-hover)',
                    borderRadius: 'var(--radius-lg)',
                    boxShadow: 'var(--shadow-lg), 0 8px 30px rgba(0,0,0,0.4)',
                    zIndex: 999,
                    overflow: 'hidden',
                    animation: 'fadeIn 0.2s ease'
                  }}>
                    <div style={{
                      padding: '12px 14px',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      borderBottom: '1px solid var(--border-subtle)',
                      background: 'var(--bg-surface-elevated)'
                    }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                        <span style={{ fontSize: '13px', fontWeight: 800, color: 'var(--text-primary)' }}>
                          Alerts & Activity
                        </span>
                        {unreadCount > 0 && (
                          <span className="badge-pill urgency-critical" style={{ fontSize: '9px', padding: '1px 5px' }}>
                            {unreadCount} new
                          </span>
                        )}
                      </div>

                      {notifications.length > 0 && (
                        <button
                          type="button"
                          onClick={() => {
                            if (onClearNotifications) onClearNotifications();
                          }}
                          style={{
                            background: 'none',
                            border: 'none',
                            color: 'var(--text-muted)',
                            fontSize: '11px',
                            cursor: 'pointer',
                            textDecoration: 'underline'
                          }}
                        >
                          Clear all
                        </button>
                      )}
                    </div>

                    <div style={{ maxHeight: '340px', overflowY: 'auto' }}>
                      {notifications.length === 0 ? (
                        <div style={{ padding: '24px 16px', textAlign: 'center', color: 'var(--text-muted)', fontSize: '12px' }}>
                          No notifications yet. You will be alerted here when clients create projects or request revisions.
                        </div>
                      ) : (
                        notifications.map(n => (
                          <div
                            key={n.id}
                            onClick={() => {
                              if (onMarkNotificationRead) onMarkNotificationRead(n.id);
                              if (n.projectId && onSelectProjectById) {
                                onSelectProjectById(n.projectId);
                                setIsNotifOpen(false);
                              }
                            }}
                            style={{
                              padding: '12px 14px',
                              borderBottom: '1px solid var(--border-subtle)',
                              background: n.read ? 'transparent' : 'var(--bg-surface-elevated)',
                              cursor: 'pointer',
                              transition: 'background var(--transition-fast)',
                              display: 'flex',
                              alignItems: 'flex-start',
                              gap: '10px'
                            }}
                          >
                            <span style={{ fontSize: '16px', marginTop: '1px' }}>
                              {n.type === 'project' ? '📁' : '⚡'}
                            </span>
                            <div style={{ flex: 1, minWidth: 0 }}>
                              <div style={{ 
                                fontSize: '12px', 
                                fontWeight: n.read ? 600 : 800, 
                                color: 'var(--text-primary)',
                                marginBottom: '2px' 
                              }}>
                                {n.title}
                              </div>
                              <div style={{ 
                                fontSize: '11px', 
                                color: 'var(--text-secondary)',
                                lineHeight: 1.4,
                                marginBottom: '4px' 
                              }}>
                                {n.message}
                              </div>
                              <div style={{ fontSize: '10px', color: 'var(--text-muted)' }}>
                                {timeAgo(n.createdAt)}
                              </div>
                            </div>
                            {!n.read && (
                              <div style={{
                                width: '6px',
                                height: '6px',
                                borderRadius: '50%',
                                background: 'var(--accent-primary)',
                                marginTop: '4px',
                                flexShrink: 0
                              }} />
                            )}
                          </div>
                        ))
                      )}
                    </div>
                  </div>
                </>
              )}
            </div>
          )}

          {isActualAdmin && !isPreviewingClient && (
            <button 
              className="btn btn-secondary btn-sm"
              onClick={onOpenNewClient}
              style={{ padding: '4px 8px', fontSize: '11px' }}
            >
              + Client
            </button>
          )}

          <button
            className="btn btn-outline btn-sm"
            onClick={onLogout}
            title="Sign out of portal"
            style={{ 
              borderColor: 'var(--border-subtle)', 
              color: 'var(--text-secondary)',
              padding: '4px 8px',
              fontSize: '11px'
            }}
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
                <h1 style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <RemotaleLogo size={24} />
                  <span>{currentClient?.company || 'Client Portal'}</span>
                  <span className="badge-pill status-completed">Client Suite</span>
                </h1>
                <p>Welcome, {currentClient?.name || 'Client'} • Remotale Agency Platform</p>
              </>
            ) : (
              <>
                <h1 style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <RemotaleLogo size={24} />
                  <span>Remotale Studio</span>
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

        {/* Action Button: Accessible to both Admin and Client */}
        <div className="header-actions">
          {!isClientView ? (
            <button className="btn btn-primary" onClick={onOpenNewProject}>
              + New Project
            </button>
          ) : (
            <div style={{ display: 'flex', gap: '8px', width: '100%' }}>
              <button 
                className="btn btn-secondary" 
                style={{ flex: 1 }} 
                onClick={onOpenNewProject}
              >
                + Add Project
              </button>
              <button 
                className="btn btn-primary" 
                style={{ flex: 1 }} 
                onClick={onOpenNewChange}
              >
                + Request Change
              </button>
            </div>
          )}
        </div>
      </header>
    </>
  );
}
