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
import RemotaleAuthFlow from './components/RemotaleAuthFlow';
import RemotaleDashboard from './components/RemotaleDashboard';
import { NewProjectModal, NewClientModal, NewChangeModal } from './components/Modals';

export default function App() {
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState(null);
  const [clients, setClients] = useState([]);
  const [projects, setProjects] = useState([]);
  const [changes, setChanges] = useState([]);
  const [notifications, setNotifications] = useState([]);
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
      const [statsData, clientsData, projectsData, changesData, notifsData, healthData] = await Promise.all([
        api.getStats().catch(() => null),
        api.getClients().catch(() => []),
        api.getProjects().catch(() => []),
        api.getChanges().catch(() => []),
        api.getNotifications().catch(() => []),
        api.checkHealth().catch(() => ({ driver: 'local' }))
      ]);

      setStats(statsData);
      setClients(clientsData);
      setProjects(projectsData);
      setChanges(changesData);
      setNotifications(notifsData);
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

    // Auto-sync notifications & stats every 8 seconds for real-time responsiveness
    const timer = setInterval(() => {
      api.getNotifications().then(setNotifications).catch(() => {});
      api.getStats().then(setStats).catch(() => {});
    }, 8000);

    return () => clearInterval(timer);
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

  const handleRegister = async (clientData) => {
    const res = await api.register(clientData);
    if (res && res.user) {
      setAuthUser(res.user);
      localStorage.setItem('byteforge_auth_user', JSON.stringify(res.user));
      setCurrentPersona({ type: 'client', id: res.user.id });
      setActiveTab('client-projects');
      setSelectedProject(null);
      showToast(`Account created! Welcome, ${res.user.name || res.user.company}`);
      loadData();
      return res.user;
    }
  };

  const handleMarkNotificationRead = async (id) => {
    try {
      await api.markNotificationRead(id);
      setNotifications(prev => prev.map(n => n.id === id ? { ...n, read: true } : n));
    } catch (err) {
      console.error('Failed to mark notification read:', err);
    }
  };

  const handleClearNotifications = async () => {
    try {
      await api.clearNotifications();
      setNotifications([]);
      showToast('Notifications cleared');
    } catch (err) {
      console.error('Failed to clear notifications:', err);
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
    : projects.filter(p => (p.clientId === currentPersona.id || p.client_id === currentPersona.id));

  const visibleChanges = isAdmin 
    ? changes 
    : changes.filter(c => c.clientId === currentPersona.id);

  // Critical change notice
  const criticalPending = changes.find(c => c.urgency === 'critical' && c.status !== 'completed');

  // Gate: Unauthenticated users land directly on the Remotale Auth Flow
  if (!authUser) {
    const params = new URLSearchParams(window.location.search);
    const portalParam = params.get('portal');

    return (
      <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column', width: '100%' }}>
        {toast && (
          <div className="toast-container">
            <div className={`toast ${toast.type}`}>
              <span>{toast.message}</span>
            </div>
          </div>
        )}
        <RemotaleAuthFlow 
          onLogin={handleLogin} 
          onRegister={handleRegister}
          initialPortalToken={portalParam} 
        />
      </div>
    );
  }

  return (
    <>
      {toast && (
        <div className="toast-container">
          <div className={`toast ${toast.type}`}>
            <span>{toast.message}</span>
          </div>
        </div>
      )}
      <RemotaleDashboard user={authUser} onLogout={handleLogout} />
    </>
  );
}
