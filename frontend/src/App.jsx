import React, { useState, useEffect } from 'react';
import { api } from './api';
import Navbar from './components/Navbar';
import StatsGrid from './components/StatsGrid';
import ProjectsView from './components/ProjectsView';
import ChangesFeed from './components/ChangesFeed';
import ProjectNotepadWorkspace from './components/ProjectNotepadWorkspace';
import ClientsView from './components/ClientsView';
import AdminNotepadsView from './components/AdminNotepadsView';
import DeadlineCenter from './components/DeadlineCenter';
import SignIn from './components/SignIn';
import { NewProjectModal, NewClientModal, NewChangeModal } from './components/Modals';

export default function App() {
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState(null);
  const [clients, setClients] = useState([]);
  const [projects, setProjects] = useState([]);
  const [changes, setChanges] = useState([]);
  const [driver, setDriver] = useState('local');

  // Theme State: 'dark' (Neon.tech signature) or 'light' (Dribbble clean)
  const [theme, setTheme] = useState(() => localStorage.getItem('agency_theme') || 'dark');

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
    localStorage.setItem('agency_theme', theme);
  }, [theme]);

  // Auth User State: { type: 'admin', ... } or { type: 'client', ... }
  const [authUser, setAuthUser] = useState(() => {
    try {
      const saved = localStorage.getItem('byteforge_auth_user');
      return saved ? JSON.parse(saved) : null;
    } catch (e) {
      return null;
    }
  });

  // Persona State: { type: 'admin', id: 'admin' } or { type: 'client', id: 'client-1' }
  const [currentPersona, setCurrentPersona] = useState(() => {
    try {
      const saved = localStorage.getItem('byteforge_auth_user');
      if (saved) {
        const parsed = JSON.parse(saved);
        if (parsed.type === 'client') {
          return { type: 'client', id: parsed.id };
        }
      }
    } catch (e) {}
    return { type: 'admin', id: 'admin' };
  });

  const [activeTab, setActiveTab] = useState(() => {
    try {
      const saved = localStorage.getItem('byteforge_auth_user');
      if (saved) {
        const parsed = JSON.parse(saved);
        if (parsed.type === 'client') {
          return 'client-projects';
        }
      }
    } catch (e) {}
    return 'dashboard';
  });

  const [selectedProject, setSelectedProject] = useState(null);
  const [activeNotepad, setActiveNotepad] = useState(null);

  // Modals state
  const [isNewProjectOpen, setIsNewProjectOpen] = useState(false);
  const [isNewClientOpen, setIsNewClientOpen] = useState(false);
  const [isNewChangeOpen, setIsNewChangeOpen] = useState(false);

  // Toast
  const [toast, setToast] = useState(null);
  const [copiedToken, setCopiedToken] = useState(null);

  const showToast = (message, type = 'success') => {
    setToast({ message, type });
    setTimeout(() => {
      setToast(null);
    }, 3500);
  };

  // Initial Data Fetch
  const loadData = async () => {
    try {
      setLoading(true);
      const [statsData, clientsData, projectsData, changesData, healthData] = await Promise.all([
        api.getStats().catch(() => null),
        api.getClients().catch(() => []),
        api.getProjects().catch(() => []),
        api.getChanges().catch(() => []),
        api.checkHealth().catch(() => ({ driver: 'local' }))
      ]);

      setStats(statsData);
      setClients(clientsData);
      setProjects(projectsData);
      setChanges(changesData);
      setDriver(healthData.driver);
    } catch (err) {
      console.error('Failed to load application data:', err);
      showToast('Could not sync with backend server', 'error');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const handleLogin = async (identifier, password) => {
    const res = await api.login(identifier, password);
    if (res && res.user) {
      setAuthUser(res.user);
      localStorage.setItem('byteforge_auth_user', JSON.stringify(res.user));
      if (res.user.type === 'admin') {
        setCurrentPersona({ type: 'admin', id: 'admin' });
        setActiveTab('dashboard');
      } else {
        setCurrentPersona({ type: 'client', id: res.user.id });
        setActiveTab('client-projects');
      }
      setSelectedProject(null);
      showToast(`Welcome, ${res.user.name || res.user.company || 'User'}`);
      loadData();
      return res.user;
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('byteforge_auth_user');
    setAuthUser(null);
    setCurrentPersona({ type: 'admin', id: 'admin' });
    setSelectedProject(null);
    setActiveTab('dashboard');
    showToast('Signed out successfully');
  };

  const handleDeleteClient = async (clientId) => {
    try {
      await api.deleteClient(clientId);
      setClients(prev => prev.filter(c => c.id !== clientId));
      setProjects(prev => prev.filter(p => p.clientId !== clientId));
      setChanges(prev => prev.filter(c => c.clientId !== clientId));
      const updatedStats = await api.getStats();
      setStats(updatedStats);
      showToast('Client portal and related projects removed');
    } catch (err) {
      showToast('Failed to delete client', 'error');
    }
  };

  const handleResetData = async () => {
    if (!window.confirm('Clean all data and reset the system to fresh state?')) return;
    try {
      await api.resetData();
      await loadData();
      showToast('All data cleared. Database ready for your custom inputs.');
    } catch (err) {
      showToast('Failed to reset data', 'error');
    }
  };

  // When switching persona
  const handlePersonaChange = (newPersona) => {
    setCurrentPersona(newPersona);
    setSelectedProject(null);
    if (newPersona.type === 'admin') {
      setActiveTab('dashboard');
    } else {
      setActiveTab('client-projects');
    }
  };

  // When a project is selected to view its notepad
  const handleSelectProject = async (proj) => {
    try {
      setSelectedProject(proj);
      const notepad = await api.getNotepad(proj.id);
      setActiveNotepad(notepad);
    } catch (err) {
      showToast('Failed to load project notepad', 'error');
    }
  };

  const handleSaveNotepad = async (projectId, content, updatedBy) => {
    try {
      const updated = await api.updateNotepad(projectId, content, updatedBy);
      setActiveNotepad(updated);
      showToast('Notepad saved to cloud database');
      return updated;
    } catch (err) {
      showToast('Failed to save notepad', 'error');
      throw err;
    }
  };

  const handleCreateChange = async (changeData) => {
    try {
      const created = await api.createChange(changeData);
      setChanges(prev => [created, ...prev]);
      
      const updatedStats = await api.getStats();
      setStats(updatedStats);
      const updatedProjects = await api.getProjects();
      setProjects(updatedProjects);

      showToast(`Revision logged with ${created.urgency.toUpperCase()} urgency`);
      return created;
    } catch (err) {
      showToast('Failed to submit change request', 'error');
      throw err;
    }
  };

  const handleUpdateChangeStatus = async (changeId, status, resolutionNote) => {
    try {
      const updated = await api.updateChangeStatus(changeId, status, resolutionNote);
      setChanges(prev => prev.map(c => c.id === changeId ? updated : c));

      const updatedStats = await api.getStats();
      setStats(updatedStats);

      showToast(`Status updated to ${status}`);
    } catch (err) {
      showToast('Failed to update change status', 'error');
    }
  };

  const handleToggleDeliverable = async (projectId, delivId, completed) => {
    try {
      const updatedProj = await api.toggleDeliverable(projectId, delivId, completed);
      setProjects(prev => prev.map(p => p.id === projectId ? { ...p, ...updatedProj } : p));
      if (selectedProject?.id === projectId) {
        setSelectedProject(prev => ({ ...prev, ...updatedProj }));
      }
      showToast('Milestone updated');
    } catch (err) {
      showToast('Failed to toggle milestone', 'error');
    }
  };

  const handleCreateProject = async (projectData) => {
    try {
      const created = await api.createProject(projectData);
      setProjects(prev => [created, ...prev]);
      const updatedStats = await api.getStats();
      setStats(updatedStats);
      showToast('New project created successfully');
    } catch (err) {
      showToast('Failed to create project', 'error');
    }
  };

  const handleCreateClient = async (clientData) => {
    try {
      const created = await api.createClient(clientData);
      setClients(prev => [...prev, created]);
      const updatedStats = await api.getStats();
      setStats(updatedStats);
      showToast(`Client portal created for ${created.company}`);
    } catch (err) {
      showToast('Failed to create client', 'error');
    }
  };

  const handleCopyPortalLink = (portalToken) => {
    const url = `${window.location.origin}/?portal=${portalToken}`;
    navigator.clipboard.writeText(url);
    setCopiedToken(portalToken);
    showToast('Portal link copied to clipboard');
    setTimeout(() => setCopiedToken(null), 3000);
  };

  const isAdmin = currentPersona.type === 'admin';
  const currentClient = !isAdmin ? clients.find(c => c.id === currentPersona.id) : null;

  // Filter projects and changes for client view
  const visibleProjects = isAdmin 
    ? projects 
    : projects.filter(p => p.clientId === currentPersona.id);

  const visibleChanges = isAdmin 
    ? changes 
    : changes.filter(c => c.clientId === currentPersona.id);

  // Critical change notice
  const criticalPending = changes.find(c => c.urgency === 'critical' && c.status !== 'completed');

  // Gate: Unauthenticated users must land directly on the Sign-In portal first
  if (!authUser) {
    const params = new URLSearchParams(window.location.search);
    const portalParam = params.get('portal');

    return (
      <div className="app-container" style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
        {toast && (
          <div className="toast-container">
            <div className={`toast ${toast.type}`}>
              <span>{toast.message}</span>
            </div>
          </div>
        )}
        <div style={{ position: 'fixed', top: '16px', right: '16px', zIndex: 100 }}>
          <button
            className="theme-toggle-btn"
            onClick={() => setTheme(prev => prev === 'dark' ? 'light' : 'dark')}
            title="Switch theme"
          >
            {theme === 'dark' ? 'Neon Dark' : 'Light Mode'}
          </button>
        </div>
        <SignIn onLogin={handleLogin} initialPortalToken={portalParam} />
      </div>
    );
  }

  return (
    <div className="app-container">
      {/* Toast Notification */}
      {toast && (
        <div className="toast-container">
          <div className={`toast ${toast.type}`}>
            <span>{toast.message}</span>
          </div>
        </div>
      )}

      {/* Top Navbar & Persona Selector */}
      <Navbar
        user={authUser}
        onLogout={handleLogout}
        currentPersona={currentPersona}
        setCurrentPersona={handlePersonaChange}
        clients={clients}
        activeTab={activeTab}
        setActiveTab={(tab) => {
          setSelectedProject(null);
          setActiveTab(tab);
        }}
        stats={stats}
        onOpenNewProject={() => setIsNewProjectOpen(true)}
        onOpenNewChange={() => setIsNewChangeOpen(true)}
        onOpenNewClient={() => setIsNewClientOpen(true)}
        onResetData={handleResetData}
        driver={driver}
        theme={theme}
        setTheme={setTheme}
      />

      {/* Main Content Area */}
      <main className="main-content">
        {loading ? (
          <div style={{ textAlign: 'center', padding: '80px 0', color: 'var(--text-muted)' }}>
            <p>Loading agency platform...</p>
          </div>
        ) : selectedProject ? (
          /* Dedicated Project Notepad Workspace View */
          <ProjectNotepadWorkspace
            project={selectedProject}
            notepad={activeNotepad}
            changes={changes}
            onSaveNotepad={handleSaveNotepad}
            onCreateChange={handleCreateChange}
            onUpdateChangeStatus={handleUpdateChangeStatus}
            onToggleDeliverable={handleToggleDeliverable}
            onBack={() => setSelectedProject(null)}
            isAdmin={isAdmin}
            currentUser={isAdmin ? { name: 'Agency Director' } : currentClient}
          />
        ) : (
          /* Standard Views based on Tab */
          <>
            {/* Urgent Alert Banner (Shown in Admin Overview if critical issues exist) */}
            {isAdmin && activeTab === 'dashboard' && criticalPending && (
              <div className="alert-banner">
                <div className="alert-banner-content">
                  <div className="alert-banner-text">
                    <h4>Urgent Client Revision Requires Attention</h4>
                    <p>
                      <strong>{criticalPending.companyName}:</strong> {criticalPending.title} (Target: {criticalPending.deadline || 'Immediate'})
                    </p>
                  </div>
                </div>

                <button 
                  className="btn btn-danger btn-sm"
                  onClick={() => {
                    const proj = projects.find(p => p.id === criticalPending.projectId);
                    if (proj) handleSelectProject(proj);
                    else setActiveTab('changes');
                  }}
                >
                  Review Hotfix →
                </button>
              </div>
            )}

            {/* Admin Dashboard Tab */}
            {isAdmin && activeTab === 'dashboard' && (
              <div>
                <StatsGrid stats={stats} />

                {/* Deadline Command Center (Today & This Week) */}
                <DeadlineCenter
                  stats={stats}
                  onSelectProjectById={(pId) => {
                    const p = projects.find(proj => proj.id === pId);
                    if (p) handleSelectProject(p);
                  }}
                />

                {/* Split Overview: Active Projects & Recent Changes */}
                <div className="dashboard-overview-split">
                  {/* Left: Active Projects */}
                  <div>
                    <div className="section-header">
                      <div className="section-header-title">
                        <h2>Active Client Projects</h2>
                        <span className="badge-count">
                          {projects.filter(p => p.status === 'in-progress' || p.status === 'under-review').length}
                        </span>
                      </div>
                      <button className="btn btn-outline btn-sm" onClick={() => setActiveTab('projects')}>
                        View All
                      </button>
                    </div>

                    {projects.length === 0 ? (
                      <div style={{
                        padding: '32px 16px',
                        textAlign: 'center',
                        background: 'var(--bg-surface)',
                        border: '1px solid var(--border-subtle)',
                        borderRadius: 'var(--radius-lg)',
                        color: 'var(--text-muted)',
                        fontSize: '13px'
                      }}>
                        <p style={{ marginBottom: '8px' }}>No active projects yet.</p>
                        <button 
                          className="btn btn-primary btn-sm" 
                          onClick={() => setIsNewProjectOpen(true)}
                        >
                          + Create Project
                        </button>
                      </div>
                    ) : (
                      <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                        {projects.slice(0, 4).map(proj => (
                          <div 
                            key={proj.id}
                            className="project-card"
                            style={{ padding: '16px' }}
                          >
                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '8px' }}>
                              <div>
                                <div style={{ fontSize: '11px', color: 'var(--text-muted)', fontWeight: 700, textTransform: 'uppercase' }}>
                                  {proj.companyName}
                                </div>
                                <h4 style={{ fontSize: '15px', fontWeight: 700, color: 'var(--text-primary)' }}>
                                  {proj.title}
                                </h4>
                              </div>
                              <span className={`badge-pill status-${proj.status}`}>
                                {proj.status}
                              </span>
                            </div>

                            <div className="progress-container" style={{ margin: '8px 0' }}>
                              <div className="progress-track">
                                <div className="progress-fill" style={{ width: `${proj.progress}%` }}></div>
                              </div>
                            </div>

                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: '12px', color: 'var(--text-muted)' }}>
                              <span>Deadline: <strong>{proj.deadline}</strong></span>
                              <button 
                                className="btn btn-secondary btn-sm"
                                style={{ padding: '4px 10px', fontSize: '11px' }}
                                onClick={() => handleSelectProject(proj)}
                              >
                                Open Notepad →
                              </button>
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>

                  {/* Right: Urgent Revisions Feed */}
                  <div>
                    <div className="section-header">
                      <div className="section-header-title">
                        <h2>Recent Client Requests</h2>
                        <span className="badge-count">{changes.length}</span>
                      </div>
                      <button className="btn btn-outline btn-sm" onClick={() => setActiveTab('changes')}>
                        All Revisions
                      </button>
                    </div>

                    {changes.length === 0 ? (
                      <div style={{
                        padding: '32px 16px',
                        textAlign: 'center',
                        background: 'var(--bg-surface)',
                        border: '1px solid var(--border-subtle)',
                        borderRadius: 'var(--radius-lg)',
                        color: 'var(--text-muted)',
                        fontSize: '13px'
                      }}>
                        <p>No revision requests logged yet.</p>
                      </div>
                    ) : (
                      <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                        {changes.slice(0, 4).map(c => (
                          <div 
                            key={c.id} 
                            className={`change-item-card ${c.urgency === 'critical' ? 'is-critical' : ''}`}
                            style={{ padding: '14px' }}
                          >
                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                              <span style={{ fontSize: '13px', fontWeight: 700, color: 'var(--text-primary)' }}>
                                {c.title}
                              </span>
                              <span className={`badge-pill urgency-${c.urgency}`} style={{ fontSize: '10px' }}>
                                {c.urgency}
                              </span>
                            </div>
                            <p style={{ fontSize: '12px', color: 'var(--text-muted)' }}>
                              {c.companyName} • Target: {c.deadline || 'Flexible'}
                            </p>
                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '6px' }}>
                              <span className={`badge-pill status-${c.status}`} style={{ fontSize: '10px' }}>
                                {c.status}
                              </span>
                              <button 
                                className="btn btn-outline btn-sm"
                                style={{ padding: '3px 8px', fontSize: '11px' }}
                                onClick={() => {
                                  const p = projects.find(proj => proj.id === c.projectId);
                                  if (p) handleSelectProject(p);
                                }}
                              >
                                Open Project
                              </button>
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              </div>
            )}

            {/* Admin Projects Tab */}
            {isAdmin && activeTab === 'projects' && (
              <ProjectsView
                projects={visibleProjects}
                onSelectProject={handleSelectProject}
                onOpenNewProject={() => setIsNewProjectOpen(true)}
                isAdmin={true}
                onToggleDeliverable={handleToggleDeliverable}
                clients={clients}
              />
            )}

            {/* Admin Changes Feed Tab */}
            {isAdmin && activeTab === 'changes' && (
              <ChangesFeed
                changes={visibleChanges}
                onUpdateStatus={handleUpdateChangeStatus}
                onSelectProjectById={(pId) => {
                  const p = projects.find(proj => proj.id === pId);
                  if (p) handleSelectProject(p);
                }}
                isAdmin={true}
                onOpenNewChange={() => setIsNewChangeOpen(true)}
              />
            )}

            {/* Admin Notepads Tab */}
            {isAdmin && activeTab === 'notepads' && (
              <AdminNotepadsView
                projects={projects}
                onSelectProject={handleSelectProject}
              />
            )}

            {/* Admin Clients Tab */}
            {isAdmin && activeTab === 'clients' && (
              <ClientsView
                clients={clients}
                onOpenNewClient={() => setIsNewClientOpen(true)}
                onSwitchToClient={(cId) => handlePersonaChange({ type: 'client', id: cId })}
                onCopyPortalLink={handleCopyPortalLink}
                onDeleteClient={handleDeleteClient}
                copiedToken={copiedToken}
              />
            )}

            {/* Client View: My Projects */}
            {!isAdmin && activeTab === 'client-projects' && (
              <div>
                {/* Client Welcome Hero */}
                <div style={{
                  background: 'var(--bg-surface)',
                  border: '1px solid var(--border-subtle)',
                  borderRadius: 'var(--radius-lg)',
                  padding: '24px',
                  marginBottom: '24px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  gap: '16px',
                  flexWrap: 'wrap',
                  boxShadow: 'var(--shadow-xs)'
                }}>
                  <div>
                    <h2 style={{ fontSize: '18px', fontWeight: 800, marginBottom: '4px' }}>
                      Welcome, {currentClient?.name || authUser?.name}
                    </h2>
                    <p style={{ fontSize: '13px', color: 'var(--text-secondary)' }}>
                      Track deliverables, view live project notepads, and submit priority revisions directly to the engineering team.
                    </p>
                  </div>

                  <div>
                    <button 
                      className="btn btn-primary"
                      onClick={() => setIsNewChangeOpen(true)}
                    >
                      + Request Revision
                    </button>
                  </div>
                </div>

                <ProjectsView
                  projects={visibleProjects}
                  onSelectProject={handleSelectProject}
                  onOpenNewProject={() => {}}
                  isAdmin={false}
                  onToggleDeliverable={handleToggleDeliverable}
                  clients={clients}
                />
              </div>
            )}

            {/* Client View: Project Workspace / Notepad Selector */}
            {!isAdmin && activeTab === 'client-workspace' && (
              <div>
                <div className="section-header">
                  <div className="section-header-title">
                    <h2>Select Project to Open Notepad</h2>
                  </div>
                </div>

                {visibleProjects.length === 0 ? (
                  <div style={{
                    padding: '48px 24px',
                    textAlign: 'center',
                    background: 'var(--bg-surface)',
                    border: '1px solid var(--border-subtle)',
                    borderRadius: 'var(--radius-lg)',
                    color: 'var(--text-muted)',
                    fontSize: '13px'
                  }}>
                    <p>No projects assigned to your portal yet.</p>
                  </div>
                ) : (
                  <div className="projects-grid">
                    {visibleProjects.map(proj => (
                      <div key={proj.id} className="project-card">
                        <div>
                          <div className="project-card-top">
                            <span className="project-client-name">{currentClient?.company}</span>
                            <span className={`badge-pill status-${proj.status}`}>{proj.status}</span>
                          </div>
                          <h3 className="project-card-title">{proj.title}</h3>
                          <p className="project-card-desc">{proj.description}</p>
                        </div>

                        <div className="project-card-actions">
                          <button 
                            className="btn btn-primary btn-sm"
                            style={{ width: '100%' }}
                            onClick={() => handleSelectProject(proj)}
                          >
                            Open Project Notepad & Changes →
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}

            {/* Client View: Change Tracker */}
            {!isAdmin && activeTab === 'client-changes' && (
              <ChangesFeed
                changes={visibleChanges}
                onUpdateStatus={handleUpdateChangeStatus}
                onSelectProjectById={(pId) => {
                  const p = projects.find(proj => proj.id === pId);
                  if (p) handleSelectProject(p);
                }}
                isAdmin={false}
                onOpenNewChange={() => setIsNewChangeOpen(true)}
              />
            )}
          </>
        )}
      </main>

      {/* Modals */}
      <NewProjectModal
        isOpen={isNewProjectOpen}
        onClose={() => setIsNewProjectOpen(false)}
        onSubmit={handleCreateProject}
        clients={clients}
      />

      <NewClientModal
        isOpen={isNewClientOpen}
        onClose={() => setIsNewClientOpen(false)}
        onSubmit={handleCreateClient}
      />

      <NewChangeModal
        isOpen={isNewChangeOpen}
        onClose={() => setIsNewChangeOpen(false)}
        onSubmit={handleCreateChange}
        projects={visibleProjects}
        defaultProjectId={selectedProject?.id || visibleProjects[0]?.id}
        requestedBy={currentClient?.name || 'Client'}
      />
    </div>
  );
}
