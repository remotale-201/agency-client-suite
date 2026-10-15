import React, { useState, useEffect, useMemo, useRef } from 'react';
import './RemotaleDashboard.css';
import { api } from '../api';
import { RemotaleLogo } from './RemotaleAuthFlow';
import AddNewProjectModal from './AddNewProjectModal';
import MyProjectsView from './MyProjectsView';
import ProjectDetailWorkspace from './ProjectDetailWorkspace';
import LetterAvatar from './LetterAvatar';

// ==========================================
// SVG ICONS
// ==========================================
function HomeIcon({ size = 18, color = 'currentColor' }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="m3 9 9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" />
      <polyline points="9 22 9 12 15 12 15 22" />
    </svg>
  );
}

function FolderIcon({ size = 18, color = 'currentColor' }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M4 20h16a2 2 0 0 0 2-2V8a2 2 0 0 0-2-2h-7.93a2 2 0 0 1-1.66-.9l-.82-1.2A2 2 0 0 0 7.93 3H4a2 2 0 0 0-2 2v13c0 1.1.9 2 2 2Z" />
    </svg>
  );
}

function TasksIcon({ size = 18, color = 'currentColor' }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M9 11l3 3L22 4" />
      <path d="M21 12v7a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11" />
    </svg>
  );
}

function MessagesIcon({ size = 18, color = 'currentColor' }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
    </svg>
  );
}

function FilesIcon({ size = 18, color = 'currentColor' }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M14.5 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7.5L14.5 2z" />
      <polyline points="14 2 14 8 20 8" />
    </svg>
  );
}

function BillingIcon({ size = 18, color = 'currentColor' }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <rect x="2" y="5" width="20" height="14" rx="2" />
      <line x1="2" y1="10" x2="22" y2="10" />
    </svg>
  );
}

function UsersIcon({ size = 18, color = 'currentColor' }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" />
      <circle cx="9" cy="7" r="4" />
      <path d="M22 21v-2a4 4 0 0 0-3-3.87" />
      <path d="M16 3.13a4 4 0 0 1 0 7.75" />
    </svg>
  );
}

function PulseIcon({ size = 18, color = 'currentColor' }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
      <polyline points="22 12 18 12 15 21 9 3 6 12 2 12" />
    </svg>
  );
}

function CheckmarkIcon({ size = 18, color = 'currentColor' }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round">
      <polyline points="20 6 9 17 4 12" />
    </svg>
  );
}

function TargetIcon({ size = 18, color = 'currentColor' }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="12" cy="12" r="10" />
      <circle cx="12" cy="12" r="6" />
      <circle cx="12" cy="12" r="2" />
    </svg>
  );
}

function ClockIcon({ size = 18, color = 'currentColor' }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="12" cy="12" r="10" />
      <polyline points="12 6 12 12 16 14" />
    </svg>
  );
}

function ShoppingBagIcon({ size = 20, color = 'currentColor' }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M6 2 3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4Z" />
      <line x1="3" y1="6" x2="21" y2="6" />
      <path d="M16 10a4 4 0 0 1-8 0" />
    </svg>
  );
}

function SmartphoneIcon({ size = 20, color = 'currentColor' }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <rect x="5" y="2" width="14" height="20" rx="2" ry="2" />
      <line x1="12" y1="18" x2="12.01" y2="18" />
    </svg>
  );
}

function SettingsIcon({ size = 18, color = 'currentColor' }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M12.22 2h-.44a2 2 0 0 0-2 2v.18a2 2 0 0 1-1 1.73l-.43.25a2 2 0 0 1-2 0l-.15-.08a2 2 0 0 0-2.73.73l-.22.38a2 2 0 0 0 .73 2.73l.15.1a2 2 0 0 1 1 1.72v.51a2 2 0 0 1-1 1.74l-.15.09a2 2 0 0 0-.73 2.73l.22.38a2 2 0 0 0 2.73.73l.15-.08a2 2 0 0 1 2 0l.43.25a2 2 0 0 1 1 1.73V20a2 2 0 0 0 2 2h.44a2 2 0 0 0 2-2v-.18a2 2 0 0 1 1-1.73l.43-.25a2 2 0 0 1 2 0l.15.08a2 2 0 0 0 2.73-.73l.22-.39a2 2 0 0 0-.73-2.73l-.15-.08a2 2 0 0 1-1-1.74v-.5a2 2 0 0 1 1-1.74l.15-.09a2 2 0 0 0 .73-2.73l-.22-.38a2 2 0 0 0-2.73-.73l-.15.08a2 2 0 0 1-2 0l-.43-.25a2 2 0 0 1-1-1.73V4a2 2 0 0 0-2-2z" />
      <circle cx="12" cy="12" r="3" />
    </svg>
  );
}

function BellIcon({ size = 18, color = 'currentColor' }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M6 8a6 6 0 0 1 12 0c0 7 3 9 3 9H3s3-2 3-9" />
      <path d="M10.3 21a1.94 1.94 0 0 0 3.4 0" />
    </svg>
  );
}

// ==========================================
// MAIN DASHBOARD COMPONENT
// ==========================================
export default function RemotaleDashboard({ user, onLogout }) {
  const isRealAdmin = user?.role === 'admin';
  // Role: 'admin' or 'client'
  const [role, setRole] = useState(() => (isRealAdmin ? 'admin' : 'client'));
  const [previewClientId, setPreviewClientId] = useState('client-awais');

  const [isMobileScreen, setIsMobileScreen] = useState(() => (typeof window !== 'undefined' ? window.innerWidth < 1024 : false));

  useEffect(() => {
    const handleResize = () => setIsMobileScreen(window.innerWidth < 1024);
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // Profile dropdown menu state
  const [isProfileMenuOpen, setIsProfileMenuOpen] = useState(false);
  const profileMenuRef = useRef(null);

  useEffect(() => {
    const handleOutsideClick = (e) => {
      if (profileMenuRef.current && !profileMenuRef.current.contains(e.target)) {
        setIsProfileMenuOpen(false);
      }
    };
    document.addEventListener('mousedown', handleOutsideClick);
    return () => document.removeEventListener('mousedown', handleOutsideClick);
  }, []);

  // Active navigation tab
  const [activeTab, setActiveTab] = useState('home');

  // Mobile Sub-tabs: for Admin: 'recent-projects', 'upcoming-deadlines', 'team-activity', 'revenue'
  // for Client: 'my-projects', 'recent-activity', 'messages'
  const [mobileSubTab, setMobileSubTab] = useState('my-projects');

  // Live Database State
  const [stats, setStats] = useState({
    totalClients: 0,
    totalProjects: 0,
    inProgress: 0,
    underReview: 0,
    completed: 0,
    totalRevenue: 0
  });
  const [projects, setProjects] = useState([]);
  const [tasks, setTasks] = useState([]);
  const [messages, setMessages] = useState([]);
  const [clients, setClients] = useState([]);
  const [teamActivities, setTeamActivities] = useState([]);
  const [loading, setLoading] = useState(true);

  // Selected Project for Detail View (Image 2)
  const [selectedProject, setSelectedProject] = useState(null);
  const selectedProjectRef = useRef(selectedProject);
  useEffect(() => {
    selectedProjectRef.current = selectedProject;
  }, [selectedProject]);

  // Project to Edit in Modal
  const [projectToEdit, setProjectToEdit] = useState(null);

  // Effective client ID when in client view:
  // If real client: user.id (e.g. client-awais, client-afshal, client-1)
  // If admin previewing client: previewClientId
  const effectiveClientId = !isRealAdmin ? (user?.id || 'client-awais') : (role === 'client' ? previewClientId : null);

  // Active Client User Object
  const currentClientUser = useMemo(() => {
    if (!isRealAdmin) return user;
    const found = clients.find(c => c.id === effectiveClientId);
    if (found) return found;
    if (effectiveClientId === 'client-awais') return { id: 'client-awais', name: 'Awais', email: 'awais@remotale.com', company: 'Awais Agency' };
    if (effectiveClientId === 'client-afshal') return { id: 'client-afshal', name: 'Afshal', email: 'afshal@remotale.com', company: 'Afshal Brand' };
    return { id: 'client-1', name: 'Ali Khan', email: 'ali@remotale.com', company: 'Acme Brand' };
  }, [isRealAdmin, user, clients, effectiveClientId]);

  // Client Display Name Helper for Admin views
  const getClientDisplayName = (clientId, fallback) => {
    if (clientId === 'client-awais') return 'Awais';
    if (clientId === 'client-afshal') return 'Afshal';
    if (clientId === 'client-1') return 'Ali Khan';
    const c = clients.find(cl => cl.id === clientId);
    if (c?.name) return c.name;
    if (fallback && fallback !== 'Ali Khan') return fallback;
    return 'Awais';
  };

  // Filter projects strictly:
  // For client view: ONLY show this client's projects!
  // For admin view: show all 10 projects!
  const visibleProjects = useMemo(() => {
    if (role === 'admin') {
      return projects;
    }
    return projects.filter(p => {
      const pClientId = p.client_id || p.clientId;
      return pClientId === effectiveClientId;
    });
  }, [role, projects, effectiveClientId]);

  // Filter tasks strictly:
  const visibleTasks = useMemo(() => {
    if (role === 'admin') {
      return tasks;
    }
    const visibleProjIds = new Set(visibleProjects.map(p => p.id));
    return tasks.filter(t => (t.client_id === effectiveClientId || visibleProjIds.has(t.project_id)));
  }, [role, tasks, visibleProjects, effectiveClientId]);

  // Filter messages strictly:
  const visibleMessages = useMemo(() => {
    if (role === 'admin') {
      return messages;
    }
    const visibleProjIds = new Set(visibleProjects.map(p => p.id));
    return messages.filter(m => (m.sender_id === effectiveClientId || m.receiver_id === effectiveClientId || visibleProjIds.has(m.project_id)));
  }, [role, messages, visibleProjects, effectiveClientId]);

  // Active Dots Dropdown ID on Project cards
  const [activeDotsId, setActiveDotsId] = useState(null);

  // New Project Modal State
  const [isNewProjectModalOpen, setIsNewProjectModalOpen] = useState(false);
  const [newProjTitle, setNewProjTitle] = useState('');
  const [newProjDesc, setNewProjDesc] = useState('');
  const [newProjStatus, setNewProjStatus] = useState('in-progress');
  const [newProjDeadline, setNewProjDeadline] = useState('25 Oct 2024');
  const [newProjBudget, setNewProjBudget] = useState('1500');
  const [modalLoading, setModalLoading] = useState(false);

  // New Task Quick State
  const [newTaskTitle, setNewTaskTitle] = useState('');
  const [isAddingTask, setIsAddingTask] = useState(false);

  // Fetch all real database data with real-time sync
  const loadData = async () => {
    try {
      const [statsRes, projsRes, tasksRes, msgsRes, clientsRes, actsRes] = await Promise.all([
        api.getStats().catch(() => null),
        api.getProjects().catch(() => []),
        api.getTasks().catch(() => []),
        api.getMessages().catch(() => []),
        api.getClients().catch(() => []),
        api.getTeamActivities().catch(() => [])
      ]);

      if (statsRes) setStats(statsRes);
      setProjects(projsRes || []);
      setTasks(tasksRes || []);
      setMessages(msgsRes || []);
      setClients(clientsRes || []);
      setTeamActivities(actsRes || []);

      // If a project is currently open in detail view, keep it synchronized in real-time
      const currentSelected = selectedProjectRef.current;
      if (currentSelected) {
        const found = (projsRes || []).find(p => p.id === currentSelected.id);
        if (found) {
          const projTasks = (tasksRes || []).filter(t => t.project_id === found.id);
          setSelectedProject({ ...found, tasks: projTasks });
        }
      }
    } catch (err) {
      console.error('Failed to load dashboard data:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
    // Fast 3-second real-time sync between Client & Admin
    const interval = setInterval(loadData, 3000);
    return () => clearInterval(interval);
  }, []);

  // Handle New Project Creation -> saves to PostgreSQL 'projects' table
  const handleCreateProject = async (projectData) => {
    try {
      const payload = {
        ...projectData,
        clientId: !isRealAdmin ? (user?.id || 'client-awais') : (projectData.clientId || effectiveClientId || 'client-awais')
      };
      const created = await api.createProject(payload);
      setProjects(prev => [created, ...prev]);
      setIsNewProjectModalOpen(false);
      setProjectToEdit(null);
      loadData();
      return created;
    } catch (err) {
      alert(err.message || 'Failed to create project');
      throw err;
    }
  };

  // Handle Project Delete -> deletes in PostgreSQL and state
  const handleDeleteProject = async (projectId) => {
    if (!window.confirm('Are you sure you want to delete this project?')) return;
    try {
      await api.deleteProject(projectId);
      setProjects(prev => prev.filter(p => p.id !== projectId));
      if (selectedProject?.id === projectId) {
        setSelectedProject(null);
      }
      await loadData();
    } catch (err) {
      alert(err.message || 'Failed to delete project');
    }
  };

  // Handle Project Update -> updates in PostgreSQL and state
  const handleUpdateProject = async (projectId, updates) => {
    try {
      const updated = await api.updateProject(projectId, updates);
      setProjects(prev => prev.map(p => p.id === projectId ? { ...p, ...updated } : p));
      if (selectedProject?.id === projectId) {
        setSelectedProject(prev => ({ ...prev, ...updated }));
      }
      await loadData();
      return updated;
    } catch (err) {
      alert(err.message || 'Failed to update project');
      throw err;
    }
  };

  // Unified Save (Create or Edit)
  const handleSaveProject = async (projectData) => {
    try {
      if (projectData.id) {
        await handleUpdateProject(projectData.id, projectData);
      } else {
        await handleCreateProject(projectData);
      }
      setIsNewProjectModalOpen(false);
      setProjectToEdit(null);
    } catch (err) {
      console.error('Error saving project:', err);
    }
  };

  // Handle Add Task inside Project Detail View
  const handleAddTaskInDetail = async ({ projectId, title, dueDate }) => {
    try {
      const targetProjId = projectId || selectedProject?.id;
      const targetClientId = selectedProject?.client_id || selectedProject?.clientId;
      const created = await api.createTask({
        projectId: targetProjId,
        clientId: targetClientId,
        title,
        dueDate: dueDate || 'Oct 25, 2024'
      });
      setTasks(prev => [created, ...prev]);
      if (selectedProject) {
        setSelectedProject(prev => ({
          ...prev,
          tasks: [...(prev.tasks || []), created]
        }));
      }
      setProjects(prev => prev.map(p => p.id === targetProjId ? {
        ...p,
        tasks: [...(p.tasks || []), created]
      } : p));
      await loadData();
    } catch (err) {
      console.error('Error adding task:', err);
    }
  };

  // Handle Task Toggle -> updates PostgreSQL 'tasks' table and all local state optimistically
  const handleToggleTask = async (taskId, currentCompleted) => {
    const nextCompleted = !currentCompleted;

    // 1. Optimistically update tasks state
    setTasks(prev => prev.map(t => t.id === taskId ? { ...t, completed: nextCompleted } : t));

    // 2. Optimistically update selectedProject state and recalculate progress percentage
    setSelectedProject(prev => {
      if (!prev) return null;
      const updatedTasks = (prev.tasks || []).map(t => t.id === taskId ? { ...t, completed: nextCompleted } : t);
      const total = updatedTasks.length;
      const done = updatedTasks.filter(t => t.completed).length;
      const newProgress = total > 0 ? Math.round((done / total) * 100) : prev.progress;
      return {
        ...prev,
        progress: newProgress,
        tasks: updatedTasks
      };
    });

    // 3. Optimistically update projects state with new tasks & progress
    setProjects(prev => prev.map(p => {
      const hasTask = (p.tasks || []).some(t => t.id === taskId);
      if (!hasTask) return p;
      const updatedTasks = (p.tasks || []).map(t => t.id === taskId ? { ...t, completed: nextCompleted } : t);
      const total = updatedTasks.length;
      const done = updatedTasks.filter(t => t.completed).length;
      const newProgress = total > 0 ? Math.round((done / total) * 100) : p.progress;
      return {
        ...p,
        progress: newProgress,
        tasks: updatedTasks
      };
    }));

    // 4. Send to backend database
    try {
      await api.toggleTask(taskId, nextCompleted);
      // Soft sync in background
      api.getProjects().then(setProjects).catch(() => {});
      api.getTasks().then(setTasks).catch(() => {});
    } catch (err) {
      console.error('Error toggling task:', err);
      // Revert if error
      loadData();
    }
  };

  // Handle Add Task -> saves to PostgreSQL 'tasks' table
  const handleAddTask = async (e) => {
    e.preventDefault();
    if (!newTaskTitle.trim()) return;

    try {
      const created = await api.createTask({
        title: newTaskTitle.trim(),
        dueDate: 'Oct 25, 2024'
      });
      setTasks(prev => [created, ...prev]);
      setNewTaskTitle('');
      setIsAddingTask(false);
    } catch (err) {
      alert(err.message || 'Failed to add task');
    }
  };

  // Project Icon Selector
  const getProjectIcon = (index) => {
    if (index % 3 === 0) return <ShoppingBagIcon size={20} color="#FFFFFF" />;
    if (index % 3 === 1) return <SmartphoneIcon size={20} color="#FFFFFF" />;
    return <TargetIcon size={20} color="#FFFFFF" />;
  };

  const getProjectIconBg = (index) => {
    if (index % 3 === 0) return 'blue';
    if (index % 3 === 1) return 'purple';
    return 'blue';
  };

  // 3-dots Menu Helper for project cards
  const renderProjectDotsMenu = (proj) => {
    const isOpen = activeDotsId === proj.id;
    return (
      <div style={{ position: 'relative' }} onClick={(e) => e.stopPropagation()}>
        <button
          type="button"
          style={{
            background: 'transparent',
            border: 'none',
            color: '#94a3b8',
            cursor: 'pointer',
            padding: '2px 6px',
            borderRadius: '6px',
            fontSize: '16px',
            lineHeight: 1
          }}
          title="Project options"
          onClick={(e) => {
            e.stopPropagation();
            setActiveDotsId(isOpen ? null : proj.id);
          }}
        >
          ⋮
        </button>

        {isOpen && (
          <div
            style={{
              position: 'absolute',
              right: 0,
              top: '100%',
              background: '#ffffff',
              border: '1px solid #e2e8f0',
              boxShadow: '0 10px 25px -5px rgba(15, 23, 42, 0.15)',
              borderRadius: '10px',
              padding: '6px',
              minWidth: '135px',
              zIndex: 99
            }}
          >
            <button
              type="button"
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                width: '100%',
                padding: '7px 10px',
                border: 'none',
                background: 'transparent',
                borderRadius: '6px',
                fontSize: '12.5px',
                color: '#334155',
                cursor: 'pointer',
                textAlign: 'left'
              }}
              onClick={(e) => {
                e.stopPropagation();
                setActiveDotsId(null);
                setProjectToEdit(proj);
                setIsNewProjectModalOpen(true);
              }}
            >
              <span>✏️ Edit Project</span>
            </button>
            <button
              type="button"
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                width: '100%',
                padding: '7px 10px',
                border: 'none',
                background: 'transparent',
                borderRadius: '6px',
                fontSize: '12.5px',
                color: '#ef4444',
                cursor: 'pointer',
                textAlign: 'left'
              }}
              onClick={(e) => {
                e.stopPropagation();
                setActiveDotsId(null);
                handleDeleteProject(proj.id);
              }}
            >
              <span>🗑️ Delete</span>
            </button>
          </div>
        )}
      </div>
    );
  };

  // ==========================================
  // DEADLINE PARSER & NEAREST-TO-FARTHEST LOGIC
  // ==========================================
  const parseDeadlineDate = (dateStr) => {
    if (!dateStr) return new Date(8640000000000000);
    const trimmed = String(dateStr).trim();
    // Handle DD/MM/YYYY or DD-MM-YYYY
    const dmyMatch = trimmed.match(/^(\d{1,2})[\/\-](\d{1,2})[\/\-](\d{4})$/);
    if (dmyMatch) {
      return new Date(Number(dmyMatch[3]), Number(dmyMatch[2]) - 1, Number(dmyMatch[1]));
    }
    const parsed = new Date(trimmed);
    return isNaN(parsed.getTime()) ? new Date(8640000000000000) : parsed;
  };

  const getDaysRemainingBadge = (dateStr) => {
    const d = parseDeadlineDate(dateStr);
    if (d.getTime() >= 8640000000000000) return { text: 'No date', color: '#64748b', bg: '#f1f5f9' };
    const now = new Date();
    now.setHours(0, 0, 0, 0);
    const diffTime = d.getTime() - now.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    if (diffDays < 0) return { text: `${Math.abs(diffDays)}d overdue`, color: '#dc2626', bg: '#fee2e2' };
    if (diffDays === 0) return { text: 'Due today', color: '#ea580c', bg: '#ffedd5' };
    if (diffDays === 1) return { text: 'Due tomorrow', color: '#d97706', bg: '#fef3c7' };
    if (diffDays <= 7) return { text: `${diffDays} days left`, color: '#d97706', bg: '#fef3c7' };
    return { text: `${diffDays} days left`, color: '#4338ca', bg: '#e0e7ff' };
  };

  // Projects strictly ordered from nearest to farthest deadline
  const sortedDeadlines = useMemo(() => {
    return [...visibleProjects].sort((a, b) => {
      return parseDeadlineDate(a.deadline) - parseDeadlineDate(b.deadline);
    });
  }, [visibleProjects]);

  // ==========================================
  // RENDER: TEAM VIEW (1 Super Admin Abdullah with Universal Access)
  // ==========================================
  const renderTeamView = () => (
    <div style={{ padding: '28px 32px', maxWidth: '1080px', margin: '0 auto' }}>
      {/* Header */}
      <div style={{ marginBottom: '24px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '8px' }}>
          <span style={{ fontSize: '24px' }}>👥</span>
          <h1 style={{ fontSize: '24px', fontWeight: 800, color: '#0f172a', margin: 0 }}>Agency Team & Administration</h1>
        </div>
        <p style={{ fontSize: '13.5px', color: '#64748b', margin: 0, lineHeight: 1.6 }}>
          Remotale operates under centralized administrative leadership. There is <strong>1 Super Admin</strong> who oversees and has universal access to all projects, client workspaces, credentials, and deliverables.
        </p>
      </div>

      {/* Admin Highlight Banner */}
      <div style={{
        background: 'linear-gradient(135deg, #0f172a 0%, #1e1b4b 100%)',
        color: '#ffffff',
        borderRadius: '16px',
        padding: '26px 30px',
        boxShadow: '0 10px 25px -5px rgba(15, 23, 42, 0.25)',
        marginBottom: '28px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        flexWrap: 'wrap',
        gap: '20px'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '22px' }}>
          <LetterAvatar name="Abdullah" size={68} />
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '6px' }}>
              <h2 style={{ fontSize: '22px', fontWeight: 800, margin: 0, color: '#ffffff' }}>Abdullah</h2>
              <span style={{
                background: '#4f46e5',
                color: '#ffffff',
                fontSize: '11px',
                fontWeight: 700,
                padding: '3px 12px',
                borderRadius: '999px',
                letterSpacing: '0.3px'
              }}>
                👑 Super Admin & Agency Lead
              </span>
            </div>
            <p style={{ margin: '0 0 8px 0', fontSize: '13px', color: '#cbd5e1' }}>
              ✉️ admin@remotale.com • 🌐 Universal Access for All Clients & Projects
            </p>
            <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
              <span style={{ background: 'rgba(255,255,255,0.12)', padding: '4px 10px', borderRadius: '6px', fontSize: '11.5px', color: '#e2e8f0', fontWeight: 500 }}>
                Full System Administration
              </span>
              <span style={{ background: 'rgba(255,255,255,0.12)', padding: '4px 10px', borderRadius: '6px', fontSize: '11.5px', color: '#e2e8f0', fontWeight: 500 }}>
                All 10 Client Projects
              </span>
              <span style={{ background: 'rgba(255,255,255,0.12)', padding: '4px 10px', borderRadius: '6px', fontSize: '11.5px', color: '#e2e8f0', fontWeight: 500 }}>
                Credentials & Files Access
              </span>
            </div>
          </div>
        </div>

        <div style={{
          background: 'rgba(255, 255, 255, 0.08)',
          border: '1px solid rgba(255, 255, 255, 0.15)',
          borderRadius: '14px',
          padding: '16px 24px',
          textAlign: 'center'
        }}>
          <div style={{ fontSize: '28px', fontWeight: 800, color: '#38bdf8' }}>1</div>
          <div style={{ fontSize: '12px', color: '#94a3b8', fontWeight: 600 }}>Active Admin User</div>
        </div>
      </div>

      {/* Permissions & Security Grid */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '18px' }}>
        <div style={{ background: '#ffffff', border: '1px solid #e2e8f0', borderRadius: '14px', padding: '20px', boxShadow: '0 1px 3px rgba(0,0,0,0.04)' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '8px' }}>
            <span style={{ fontSize: '20px' }}>🔐</span>
            <h4 style={{ margin: 0, fontSize: '14px', fontWeight: 700, color: '#0f172a' }}>Universal Access</h4>
          </div>
          <p style={{ margin: 0, fontSize: '12.5px', color: '#64748b', lineHeight: 1.5 }}>
            The Super Admin account has universal visibility across all client records, tasks, files, and project environments without restriction.
          </p>
        </div>

        <div style={{ background: '#ffffff', border: '1px solid #e2e8f0', borderRadius: '14px', padding: '20px', boxShadow: '0 1px 3px rgba(0,0,0,0.04)' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '8px' }}>
            <span style={{ fontSize: '20px' }}>⚡</span>
            <h4 style={{ margin: 0, fontSize: '14px', fontWeight: 700, color: '#0f172a' }}>Real-Time Synchronization</h4>
          </div>
          <p style={{ margin: 0, fontSize: '12.5px', color: '#64748b', lineHeight: 1.5 }}>
            All task completions, credential changes, notes, and progress updates submitted by the Super Admin sync instantly with client dashboards.
          </p>
        </div>

        <div style={{ background: '#ffffff', border: '1px solid #e2e8f0', borderRadius: '14px', padding: '20px', boxShadow: '0 1px 3px rgba(0,0,0,0.04)' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '8px' }}>
            <span style={{ fontSize: '20px' }}>🛡️</span>
            <h4 style={{ margin: 0, fontSize: '14px', fontWeight: 700, color: '#0f172a' }}>Isolated Client Views</h4>
          </div>
          <p style={{ margin: 0, fontSize: '12.5px', color: '#64748b', lineHeight: 1.5 }}>
            Clients only see their own assigned projects and nearest deadlines. Universal team management is retained solely by the Super Admin.
          </p>
        </div>
      </div>
    </div>
  );

  // ==========================================
  // RENDER: DESKTOP CLIENT HOMEPAGE (Image 1, Left)
  // ==========================================
  const renderDesktopClient = () => (
    <div className="remotale-desktop-layout">
      {/* Left Sidebar */}
      <aside className="remotale-desktop-sidebar">
        <div className="remotale-sidebar-top">
          {/* Brand */}
          <div className="remotale-sidebar-brand">
            <RemotaleLogo size={24} />
            <span className="remotale-sidebar-brand-name">Remotale</span>
          </div>

          {/* Navigation Items */}
          <nav className="remotale-sidebar-nav">
            <button
              type="button"
              className={`remotale-nav-item ${activeTab === 'home' && !selectedProject ? 'active' : ''}`}
              onClick={() => {
                setSelectedProject(null);
                setActiveTab('home');
              }}
            >
              <HomeIcon size={17} color={activeTab === 'home' && !selectedProject ? '#4F46E5' : '#64748B'} />
              <span>Home</span>
            </button>

            <button
              type="button"
              className={`remotale-nav-item ${(activeTab === 'projects' || selectedProject) ? 'active' : ''}`}
              onClick={() => {
                setSelectedProject(null);
                setActiveTab('projects');
              }}
            >
              <FolderIcon size={17} color={(activeTab === 'projects' || selectedProject) ? '#4F46E5' : '#64748B'} />
              <span>Projects</span>
            </button>

            <button
              type="button"
              className={`remotale-nav-item ${activeTab === 'tasks' ? 'active' : ''}`}
              onClick={() => {
                setSelectedProject(null);
                setActiveTab('tasks');
              }}
            >
              <TasksIcon size={17} color={activeTab === 'tasks' ? '#4F46E5' : '#64748B'} />
              <span>Tasks</span>
            </button>

            <button
              type="button"
              className={`remotale-nav-item ${activeTab === 'messages' ? 'active' : ''}`}
              onClick={() => {
                setSelectedProject(null);
                setActiveTab('messages');
              }}
            >
              <MessagesIcon size={17} color={activeTab === 'messages' ? '#4F46E5' : '#64748B'} />
              <span>Messages</span>
            </button>

            <button
              type="button"
              className={`remotale-nav-item ${activeTab === 'files' ? 'active' : ''}`}
              onClick={() => {
                setSelectedProject(null);
                setActiveTab('files');
              }}
            >
              <FilesIcon size={17} color={activeTab === 'files' ? '#4F46E5' : '#64748B'} />
              <span>Files</span>
            </button>

            <button
              type="button"
              className={`remotale-nav-item ${activeTab === 'billing' ? 'active' : ''}`}
              onClick={() => {
                setSelectedProject(null);
                setActiveTab('billing');
              }}
            >
              <BillingIcon size={17} color={activeTab === 'billing' ? '#4F46E5' : '#64748B'} />
              <span>Billing</span>
            </button>
          </nav>
        </div>

        {/* Bottom User Section with Dedicated Logout */}
        <div style={{ marginTop: 'auto', padding: '14px', borderTop: '1px solid #e2e8f0', background: '#fafafa' }}>
          <div className="remotale-sidebar-user-pill" style={{ marginBottom: '10px' }}>
            <div className="remotale-sidebar-avatar-circle">{currentClientUser?.name?.[0] || 'C'}</div>
            <div className="remotale-sidebar-user-info" style={{ flex: 1, minWidth: 0 }}>
              <span className="remotale-sidebar-user-name" style={{ overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', display: 'block' }}>{currentClientUser?.name || 'Client'}</span>
              <span className="remotale-sidebar-user-role">{currentClientUser?.company || 'Client'}</span>
            </div>
          </div>
          <button
            type="button"
            onClick={onLogout}
            style={{
              width: '100%',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '8px',
              padding: '10px 14px',
              background: '#fee2e2',
              color: '#dc2626',
              border: '1px solid #fecaca',
              borderRadius: '8px',
              fontSize: '13px',
              fontWeight: 700,
              cursor: 'pointer',
              boxShadow: '0 1px 3px rgba(220, 38, 38, 0.1)',
              transition: 'all 0.15s ease'
            }}
            title="Log Out of your account"
          >
            <span style={{ fontSize: '15px' }}>🚪</span>
            <span>Log Out</span>
          </button>
        </div>
      </aside>

      {/* Main Content Area */}
      <main className="remotale-desktop-main">
        {selectedProject ? (
          <ProjectDetailWorkspace
            project={selectedProject}
            onBack={() => setSelectedProject(null)}
            onEditProject={(p) => {
              setProjectToEdit(p);
              setIsNewProjectModalOpen(true);
            }}
            onDeleteProject={handleDeleteProject}
            onToggleTask={handleToggleTask}
            onAddTask={handleAddTaskInDetail}
            onUpdateProject={handleUpdateProject}
            currentUser={currentClientUser}
            onLogout={onLogout}
          />
        ) : activeTab === 'projects' ? (
          <MyProjectsView
            projects={visibleProjects}
            onSelectProject={(proj) => setSelectedProject(proj)}
            onOpenAddProject={() => {
              setProjectToEdit(null);
              setIsNewProjectModalOpen(true);
            }}
            onEditProject={(proj) => {
              setProjectToEdit(proj);
              setIsNewProjectModalOpen(true);
            }}
            onDeleteProject={handleDeleteProject}
            currentUser={currentClientUser}
            onLogout={onLogout}
          />
        ) : activeTab === 'team' ? (
          renderTeamView()
        ) : (
          <>
        {/* Top Header */}
        <div className="remotale-main-header">
          <div className="remotale-main-greeting">
            <h1>Hello, {currentClientUser?.name?.split(' ')[0] || 'Client'} 👋</h1>
            <p>Here's an overview of your projects.</p>
          </div>

          <div className="remotale-header-actions">
            {isRealAdmin && (
              <button
                type="button"
                onClick={() => {
                  setRole('admin');
                  setSelectedProject(null);
                }}
                style={{
                  background: '#0f172a',
                  color: '#ffffff',
                  border: 'none',
                  borderRadius: '999px',
                  padding: '7px 14px',
                  fontSize: '12px',
                  fontWeight: 700,
                  cursor: 'pointer',
                  boxShadow: '0 2px 6px rgba(0,0,0,0.1)'
                }}
              >
                👑 Return to Admin View
              </button>
            )}

            <button type="button" className="remotale-bell-btn" title="Notifications">
              <BellIcon size={18} />
              <span className="remotale-bell-dot" />
            </button>

            <div style={{ position: 'relative' }} ref={profileMenuRef}>
              <button
                type="button"
                onClick={() => setIsProfileMenuOpen(!isProfileMenuOpen)}
                style={{
                  cursor: 'pointer',
                  background: 'transparent',
                  border: 'none',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px',
                  padding: '4px 8px',
                  borderRadius: '999px'
                }}
                title="Account Menu"
              >
                <div className="remotale-header-avatar-circle" title="Profile">
                  <span>{currentClientUser?.name?.[0] || 'C'}</span>
                </div>
                <div style={{ display: 'flex', flexDirection: 'column', textAlign: 'left', lineHeight: 1.15 }}>
                  <span style={{ fontSize: '13px', fontWeight: 700, color: '#0f172a' }}>{currentClientUser?.name || 'Client'}</span>
                  <span style={{ fontSize: '11px', color: '#64748b' }}>{currentClientUser?.company || 'Client'} ⌵</span>
                </div>
              </button>

              {isProfileMenuOpen && (
                <div className="remotale-user-dropdown-popover">
                  <div className="remotale-dropdown-user-header">
                    <span className="remotale-dropdown-user-name">{currentClientUser?.name || 'Client'}</span>
                    <span className="remotale-dropdown-user-email">{currentClientUser?.email || 'client@remotale.com'}</span>
                    <span className="remotale-dropdown-badge">👤 Client Portal</span>
                  </div>
                  <div className="remotale-dropdown-divider" />
                  <button
                    type="button"
                    className="remotale-dropdown-logout-item"
                    onClick={() => {
                      setIsProfileMenuOpen(false);
                      onLogout();
                    }}
                  >
                    <span>🚪</span>
                    <span>Log Out</span>
                  </button>
                </div>
              )}
            </div>

            <button
              type="button"
              className="remotale-btn-new-project"
              onClick={() => setIsNewProjectModalOpen(true)}
            >
              <span>+ New Project</span>
            </button>
          </div>
        </div>

        {/* Stat Cards Row */}
        <div className="remotale-stat-cards-grid">
          {/* Card 1: Total Projects */}
          <div className="remotale-stat-card">
            <div className="remotale-stat-icon-row">
              <div className="remotale-stat-icon-box purple">
                <FolderIcon size={18} color="#4F46E5" />
              </div>
            </div>
            <div>
              <div className="remotale-stat-val">{visibleProjects.length}</div>
              <div className="remotale-stat-lbl">Total Projects</div>
            </div>
          </div>

          {/* Card 2: In Progress */}
          <div className="remotale-stat-card">
            <div className="remotale-stat-icon-row">
              <div className="remotale-stat-icon-box blue">
                <TargetIcon size={18} color="#2563EB" />
              </div>
            </div>
            <div>
              <div className="remotale-stat-val">{visibleProjects.filter(p => p.status === 'in-progress').length}</div>
              <div className="remotale-stat-lbl">In Progress</div>
            </div>
          </div>

          {/* Card 3: Under Review */}
          <div className="remotale-stat-card">
            <div className="remotale-stat-icon-row">
              <div className="remotale-stat-icon-box amber">
                <ClockIcon size={18} color="#CA8A04" />
              </div>
            </div>
            <div>
              <div className="remotale-stat-val">{visibleProjects.filter(p => p.status === 'under-review').length}</div>
              <div className="remotale-stat-lbl">Under Review</div>
            </div>
          </div>

          {/* Card 4: Completed */}
          <div className="remotale-stat-card">
            <div className="remotale-stat-icon-row">
              <div className="remotale-stat-icon-box green">
                <CheckmarkIcon size={18} color="#16A34A" />
              </div>
            </div>
            <div>
              <div className="remotale-stat-val">{visibleProjects.filter(p => p.status === 'completed').length}</div>
              <div className="remotale-stat-lbl">Completed</div>
            </div>
          </div>
        </div>

        {/* Two-Column Grid: Left Projects, Right Tasks & Messages */}
        <div className="remotale-client-grid">
          {/* Left Column: My Projects */}
          <section className="remotale-card-container">
            <div className="remotale-card-header">
              <h3>My Projects</h3>
              <button
                type="button"
                className="remotale-card-view-all"
                onClick={() => setActiveTab('projects')}
              >
                View All →
              </button>
            </div>

            {visibleProjects.length === 0 ? (
              <div className="remotale-empty-card">
                <p>No projects created yet.</p>
                <button
                  type="button"
                  className="remotale-btn-new-project"
                  style={{ margin: '10px auto 0', display: 'inline-flex' }}
                  onClick={() => setIsNewProjectModalOpen(true)}
                >
                  + Create Your First Project
                </button>
              </div>
            ) : (
              visibleProjects.slice(0, 3).map((proj, idx) => (
                <div
                  key={proj.id}
                  className="remotale-project-card"
                  style={{ cursor: 'pointer' }}
                  onClick={() => setSelectedProject(proj)}
                >
                  <div className="remotale-proj-top">
                    <div className={`remotale-proj-icon-box ${getProjectIconBg(idx)}`}>
                      {getProjectIcon(idx)}
                    </div>
                    <div className="remotale-proj-title-row">
                      <span className="remotale-proj-title">{proj.title}</span>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                        <span className={`remotale-status-pill ${proj.status}`}>
                          {proj.status === 'in-progress' ? 'In Progress' : (proj.status === 'under-review' ? 'Under Review' : 'Completed')}
                        </span>
                        {renderProjectDotsMenu(proj)}
                      </div>
                    </div>
                  </div>

                  <p className="remotale-proj-desc">{proj.description || 'Deliverables and custom client integration.'}</p>

                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '6px' }}>
                    <span style={{ fontSize: '11px', color: '#64748b', fontWeight: 600 }}>Progress</span>
                    <span style={{ fontSize: '12px', color: '#1e293b', fontWeight: 700 }}>{proj.progress || 0}%</span>
                  </div>
                  <div className="remotale-progress-bar-wrap">
                    <div
                      className="remotale-progress-bar-fill"
                      style={{ width: `${proj.progress || 0}%`, transition: 'width 0.35s ease' }}
                    />
                  </div>

                  <div className="remotale-proj-footer">
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                      <LetterAvatar name="Abdullah" size={24} />
                      <span style={{ fontSize: '12px', fontWeight: 600, color: '#475569' }}>Admin: Abdullah</span>
                    </div>

                    <div className="remotale-proj-due">
                      <span>📅</span>
                      <span>Due {proj.deadline || '25 Oct 2024'}</span>
                    </div>
                  </div>
                </div>
              ))
            )}
          </section>

          {/* Right Column: Project Deadlines (Nearest to Farthest) & Recent Messages */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
            {/* Project Deadlines Section */}
            <section className="remotale-card-container">
              <div className="remotale-card-header">
                <div>
                  <h3 style={{ margin: 0, fontSize: '15px', fontWeight: 700, color: '#0f172a' }}>Project Deadlines</h3>
                  <span style={{ fontSize: '11px', color: '#64748b', fontWeight: 500 }}>Nearest to farthest due dates</span>
                </div>
                <span style={{ fontSize: '11.5px', fontWeight: 700, color: '#4f46e5', background: '#eef2ff', padding: '3px 9px', borderRadius: '999px' }}>
                  {sortedDeadlines.length} Active
                </span>
              </div>

              {sortedDeadlines.length === 0 ? (
                <div className="remotale-empty-card" style={{ padding: '24px', textAlign: 'center' }}>
                  <p style={{ margin: 0, color: '#94a3b8', fontSize: '13px' }}>No upcoming project deadlines.</p>
                </div>
              ) : (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                  {sortedDeadlines.map((p) => {
                    const badge = getDaysRemainingBadge(p.deadline);
                    const pct = (p.progress !== undefined && p.progress !== null) ? Number(p.progress) : (p.status === 'completed' ? 100 : 0);

                    return (
                      <div
                        key={p.id}
                        onClick={() => setSelectedProject(p)}
                        style={{
                          display: 'flex',
                          flexDirection: 'column',
                          gap: '6px',
                          padding: '12px',
                          background: '#f8fafc',
                          border: '1px solid #e2e8f0',
                          borderRadius: '10px',
                          cursor: 'pointer',
                          transition: 'all 0.15s ease'
                        }}
                        onMouseEnter={(e) => { e.currentTarget.style.borderColor = '#c7d2fe'; e.currentTarget.style.background = '#f1f5f9'; }}
                        onMouseLeave={(e) => { e.currentTarget.style.borderColor = '#e2e8f0'; e.currentTarget.style.background = '#f8fafc'; }}
                        title="Click to view project details"
                      >
                        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '8px' }}>
                          <span style={{ fontWeight: 700, fontSize: '13px', color: '#1e293b', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                            {p.title}
                          </span>
                          <span style={{
                            padding: '2px 8px',
                            borderRadius: '999px',
                            fontSize: '11px',
                            fontWeight: 700,
                            background: badge.bg,
                            color: badge.color,
                            flexShrink: 0
                          }}>
                            {badge.text}
                          </span>
                        </div>

                        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', fontSize: '11.5px', color: '#64748b' }}>
                          <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                            <span>📅</span>
                            <span>Due: <strong>{p.deadline || 'No deadline'}</strong></span>
                          </span>
                          <span style={{ fontWeight: 700, color: '#475569' }}>
                            {pct}% done
                          </span>
                        </div>

                        {/* Realtime Animated Progress bar track */}
                        <div style={{ width: '100%', height: '5px', background: '#e2e8f0', borderRadius: '999px', overflow: 'hidden' }}>
                          <div
                            style={{
                              width: `${pct}%`,
                              height: '100%',
                              background: pct === 100 ? '#10b981' : '#4f46e5',
                              borderRadius: '999px',
                              transition: 'width 0.35s ease'
                            }}
                          />
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </section>

            {/* Recent Messages */}
            <section className="remotale-card-container">
              <div className="remotale-card-header">
                <h3>Recent Messages</h3>
                <button
                  type="button"
                  className="remotale-card-view-all"
                  onClick={() => setActiveTab('messages')}
                >
                  View All →
                </button>
              </div>

              {visibleMessages.length === 0 ? (
                <div className="remotale-empty-card" style={{ padding: '20px' }}>
                  <p>No messages yet.</p>
                </div>
              ) : (
                visibleMessages.slice(0, 3).map(msg => (
                  <div key={msg.id} className="remotale-message-item">
                    <LetterAvatar name={msg.sender_name || 'Admin'} size={32} />
                    <div className="remotale-msg-body">
                      <div className="remotale-msg-header">
                        <span className="remotale-msg-sender">{msg.sender_name}</span>
                        <span className="remotale-msg-time">2h ago</span>
                      </div>
                      <span className="remotale-msg-snippet">{msg.content}</span>
                    </div>
                  </div>
                ))
              )}
            </section>
          </div>
        </div>
          </>
        )}
      </main>
    </div>
  );

  // ==========================================
  // RENDER: DESKTOP ADMIN HOMEPAGE (Image 1, Right)
  // ==========================================
  const renderDesktopAdmin = () => (
    <div className="remotale-desktop-layout">
      {/* Left Sidebar */}
      <aside className="remotale-desktop-sidebar">
        <div className="remotale-sidebar-top">
          {/* Brand */}
          <div className="remotale-sidebar-brand">
            <RemotaleLogo size={24} />
            <span className="remotale-sidebar-brand-name">Remotale</span>
          </div>

          {/* Navigation Items */}
          <nav className="remotale-sidebar-nav">
            <button
              type="button"
              className={`remotale-nav-item ${activeTab === 'home' && !selectedProject ? 'active' : ''}`}
              onClick={() => {
                setSelectedProject(null);
                setActiveTab('home');
              }}
            >
              <HomeIcon size={17} color={activeTab === 'home' && !selectedProject ? '#4F46E5' : '#64748B'} />
              <span>Home</span>
            </button>

            <button
              type="button"
              className={`remotale-nav-item ${activeTab === 'clients' ? 'active' : ''}`}
              onClick={() => {
                setSelectedProject(null);
                setActiveTab('clients');
              }}
            >
              <UsersIcon size={17} color={activeTab === 'clients' ? '#4F46E5' : '#64748B'} />
              <span>Clients</span>
            </button>

            <button
              type="button"
              className={`remotale-nav-item ${(activeTab === 'projects' || selectedProject) ? 'active' : ''}`}
              onClick={() => {
                setSelectedProject(null);
                setActiveTab('projects');
              }}
            >
              <FolderIcon size={17} color={(activeTab === 'projects' || selectedProject) ? '#4F46E5' : '#64748B'} />
              <span>Projects</span>
            </button>

            <button
              type="button"
              className={`remotale-nav-item ${activeTab === 'tasks' ? 'active' : ''}`}
              onClick={() => setActiveTab('tasks')}
            >
              <TasksIcon size={17} color={activeTab === 'tasks' ? '#4F46E5' : '#64748B'} />
              <span>Tasks</span>
            </button>

            <button
              type="button"
              className={`remotale-nav-item ${activeTab === 'team' ? 'active' : ''}`}
              onClick={() => setActiveTab('team')}
            >
              <UsersIcon size={17} color={activeTab === 'team' ? '#4F46E5' : '#64748B'} />
              <span>Team</span>
            </button>

            <button
              type="button"
              className={`remotale-nav-item ${activeTab === 'messages' ? 'active' : ''}`}
              onClick={() => setActiveTab('messages')}
            >
              <MessagesIcon size={17} color={activeTab === 'messages' ? '#4F46E5' : '#64748B'} />
              <span>Messages</span>
            </button>

            <button
              type="button"
              className={`remotale-nav-item ${activeTab === 'files' ? 'active' : ''}`}
              onClick={() => setActiveTab('files')}
            >
              <FilesIcon size={17} color={activeTab === 'files' ? '#4F46E5' : '#64748B'} />
              <span>Files</span>
            </button>

            <button
              type="button"
              className={`remotale-nav-item ${activeTab === 'invoices' ? 'active' : ''}`}
              onClick={() => setActiveTab('invoices')}
            >
              <BillingIcon size={17} color={activeTab === 'invoices' ? '#4F46E5' : '#64748B'} />
              <span>Invoices</span>
            </button>

            <button
              type="button"
              className={`remotale-nav-item ${activeTab === 'reports' ? 'active' : ''}`}
              onClick={() => setActiveTab('reports')}
            >
              <PulseIcon size={17} color={activeTab === 'reports' ? '#4F46E5' : '#64748B'} />
              <span>Reports</span>
            </button>

            <button
              type="button"
              className={`remotale-nav-item ${activeTab === 'settings' ? 'active' : ''}`}
              onClick={() => setActiveTab('settings')}
            >
              <SettingsIcon size={17} color={activeTab === 'settings' ? '#4F46E5' : '#64748B'} />
              <span>Settings</span>
            </button>
          </nav>
        </div>

        {/* Bottom Admin Section with Dedicated Logout */}
        <div style={{ marginTop: 'auto', padding: '14px', borderTop: '1px solid #e2e8f0', background: '#fafafa' }}>
          <div className="remotale-sidebar-user-pill" style={{ marginBottom: '10px' }}>
            <div className="remotale-sidebar-avatar-circle" style={{ background: '#0f172a', color: '#ffffff' }}>A</div>
            <div className="remotale-sidebar-user-info" style={{ flex: 1, minWidth: 0 }}>
              <span className="remotale-sidebar-user-name">Abdullah</span>
              <span className="remotale-sidebar-user-role">Super Admin</span>
            </div>
          </div>
          <button
            type="button"
            onClick={onLogout}
            style={{
              width: '100%',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '8px',
              padding: '10px 14px',
              background: '#fee2e2',
              color: '#dc2626',
              border: '1px solid #fecaca',
              borderRadius: '8px',
              fontSize: '13px',
              fontWeight: 700,
              cursor: 'pointer',
              boxShadow: '0 1px 3px rgba(220, 38, 38, 0.1)',
              transition: 'all 0.15s ease'
            }}
            title="Log Out of your account"
          >
            <span style={{ fontSize: '15px' }}>🚪</span>
            <span>Log Out</span>
          </button>
        </div>
      </aside>

      {/* Main Content Area */}
      <main className="remotale-desktop-main">
        {selectedProject ? (
          <ProjectDetailWorkspace
            project={selectedProject}
            onBack={() => setSelectedProject(null)}
            onEditProject={(p) => {
              setProjectToEdit(p);
              setIsNewProjectModalOpen(true);
            }}
            onDeleteProject={handleDeleteProject}
            onToggleTask={handleToggleTask}
            onAddTask={handleAddTaskInDetail}
            onUpdateProject={handleUpdateProject}
            currentUser={user}
            onLogout={onLogout}
          />
        ) : activeTab === 'projects' ? (
          <MyProjectsView
            projects={projects}
            onSelectProject={(proj) => setSelectedProject(proj)}
            onOpenAddProject={() => {
              setProjectToEdit(null);
              setIsNewProjectModalOpen(true);
            }}
            onEditProject={(proj) => {
              setProjectToEdit(proj);
              setIsNewProjectModalOpen(true);
            }}
            onDeleteProject={handleDeleteProject}
            currentUser={user}
            onLogout={onLogout}
          />
        ) : activeTab === 'team' ? (
          renderTeamView()
        ) : (
          <>
        {/* Top Header */}
        <div className="remotale-main-header">
          <div className="remotale-main-greeting">
            <h1>Welcome Back, Abdullah</h1>
            <p>Here's what's happening with your business today.</p>
          </div>

          <div className="remotale-header-actions">
            {isRealAdmin && (
              <select
                className="remotale-persona-select"
                value={role === 'admin' ? 'admin' : previewClientId}
                onChange={(e) => {
                  const val = e.target.value;
                  if (val === 'admin') {
                    setRole('admin');
                  } else {
                    setRole('client');
                    setPreviewClientId(val);
                  }
                  setSelectedProject(null);
                }}
                style={{
                  background: role === 'admin' ? '#0f172a' : '#4338ca',
                  color: '#ffffff',
                  border: '1px solid #cbd5e1',
                  borderRadius: '999px',
                  padding: '7px 14px',
                  fontWeight: 700,
                  fontSize: '12px',
                  cursor: 'pointer',
                  outline: 'none',
                  boxShadow: '0 1px 4px rgba(0,0,0,0.06)'
                }}
                title="Switch between Super Admin and specific Client Portals"
              >
                <option value="admin" style={{ background: '#0f172a', color: '#ffffff' }}>👑 Super Admin (All 10 Projects)</option>
                <option value="client-awais" style={{ background: '#0f172a', color: '#ffffff' }}>👤 Client Portal: Awais (8 Projects)</option>
                <option value="client-afshal" style={{ background: '#0f172a', color: '#ffffff' }}>👤 Client Portal: Afshal (2 Projects)</option>
                <option value="client-1" style={{ background: '#0f172a', color: '#ffffff' }}>👤 Client Portal: Ali Khan</option>
              </select>
            )}

            <button
              type="button"
              className="remotale-btn-new-project"
              onClick={() => setIsNewProjectModalOpen(true)}
              style={{ display: 'inline-flex', padding: '8px 14px', fontSize: '12px' }}
            >
              <span>+ New Project</span>
            </button>

            <button type="button" className="remotale-date-filter-btn">
              <span>📅 Oct 24, 2024 ⌵</span>
            </button>

            <button type="button" className="remotale-bell-btn" title="Notifications">
              <BellIcon size={18} />
              <span className="remotale-bell-dot" />
            </button>

            <div style={{ position: 'relative' }} ref={profileMenuRef}>
              <button
                type="button"
                className="remotale-header-user-btn"
                onClick={() => setIsProfileMenuOpen(!isProfileMenuOpen)}
                style={{ cursor: 'pointer' }}
                title="Account Menu"
              >
                <LetterAvatar name="Abdullah" size={34} />
                <div className="remotale-header-admin-text">
                  <span className="remotale-header-admin-name">Admin</span>
                  <span className="remotale-header-admin-role">Super Admin ⌵</span>
                </div>
              </button>

              {isProfileMenuOpen && (
                <div className="remotale-user-dropdown-popover">
                  <div className="remotale-dropdown-user-header">
                    <span className="remotale-dropdown-user-name">Abdullah</span>
                    <span className="remotale-dropdown-user-email">admin@remotale.com</span>
                    <span className="remotale-dropdown-badge">👑 Super Admin</span>
                  </div>
                  <div className="remotale-dropdown-divider" />
                  <button
                    type="button"
                    className="remotale-dropdown-logout-item"
                    onClick={() => {
                      setIsProfileMenuOpen(false);
                      onLogout();
                    }}
                  >
                    <span>🚪</span>
                    <span>Log Out</span>
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Stat Cards Row */}
        <div className="remotale-stat-cards-grid">
          {/* Card 1: Total Clients */}
          <div className="remotale-stat-card">
            <div className="remotale-stat-icon-row">
              <div className="remotale-stat-icon-box purple">
                <UsersIcon size={18} color="#4F46E5" />
              </div>
            </div>
            <div>
              <div className="remotale-stat-val">{stats.totalClients || clients.length}</div>
              <div className="remotale-stat-lbl">Total Clients</div>
            </div>
          </div>

          {/* Card 2: Total Projects */}
          <div className="remotale-stat-card">
            <div className="remotale-stat-icon-row">
              <div className="remotale-stat-icon-box blue">
                <FolderIcon size={18} color="#2563EB" />
              </div>
            </div>
            <div>
              <div className="remotale-stat-val">{stats.totalProjects || projects.length}</div>
              <div className="remotale-stat-lbl">Total Projects</div>
            </div>
          </div>

          {/* Card 3: In Progress */}
          <div className="remotale-stat-card">
            <div className="remotale-stat-icon-row">
              <div className="remotale-stat-icon-box green">
                <PulseIcon size={18} color="#16A34A" />
              </div>
            </div>
            <div>
              <div className="remotale-stat-val">{stats.inProgress || projects.filter(p => p.status === 'in-progress').length}</div>
              <div className="remotale-stat-lbl">In Progress</div>
            </div>
          </div>

          {/* Card 4: Completed */}
          <div className="remotale-stat-card">
            <div className="remotale-stat-icon-row">
              <div className="remotale-stat-icon-box green">
                <CheckmarkIcon size={18} color="#16A34A" />
              </div>
            </div>
            <div>
              <div className="remotale-stat-val">{stats.completed || projects.filter(p => p.status === 'completed').length}</div>
              <div className="remotale-stat-lbl">Completed</div>
            </div>
          </div>
        </div>

        {/* 2x2 Grid Content */}
        <div className="remotale-admin-grid">
          {/* 1. Recent Projects */}
          <section className="remotale-card-container">
            <div className="remotale-card-header">
              <h3>Recent Projects</h3>
              <button type="button" className="remotale-card-view-all" onClick={() => setActiveTab('projects')}>
                View All →
              </button>
            </div>

            {projects.length === 0 ? (
              <div className="remotale-empty-card">
                <p>No projects recorded in database.</p>
                <button
                  type="button"
                  className="remotale-btn-new-project"
                  style={{ margin: '10px auto 0', display: 'inline-flex' }}
                  onClick={() => setIsNewProjectModalOpen(true)}
                >
                  + Add Project
                </button>
              </div>
            ) : (
              projects.slice(0, 3).map((proj, idx) => (
                <div
                  key={proj.id}
                  className="remotale-admin-list-item"
                  style={{ cursor: 'pointer' }}
                  onClick={() => setSelectedProject(proj)}
                >
                  <div className="remotale-admin-item-left">
                    <div className={`remotale-proj-icon-box ${getProjectIconBg(idx)}`} style={{ width: '36px', height: '36px' }}>
                      {getProjectIcon(idx)}
                    </div>
                    <div className="remotale-admin-item-text">
                      <span className="remotale-admin-item-title">{proj.title}</span>
                      <span className="remotale-admin-item-sub">Client: {getClientDisplayName(proj.client_id || proj.clientId, proj.clientName)}</span>
                    </div>
                  </div>

                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <span className={`remotale-status-pill ${proj.status}`}>
                      {proj.status === 'in-progress' ? 'In Progress' : (proj.status === 'under-review' ? 'Under Review' : 'Completed')}
                    </span>
                    {renderProjectDotsMenu(proj)}
                  </div>
                </div>
              ))
            )}
          </section>

          {/* 2. Upcoming Deadlines */}
          <section className="remotale-card-container">
            <div className="remotale-card-header">
              <h3>Upcoming Deadlines</h3>
              <button type="button" className="remotale-card-view-all">View All →</button>
            </div>

            {projects.length === 0 ? (
              <div className="remotale-empty-card"><p>No upcoming deadlines.</p></div>
            ) : (
              projects.slice(0, 3).map((p, i) => (
                <div key={p.id} className="remotale-admin-list-item">
                  <div className="remotale-admin-item-left">
                    <div className="remotale-stat-icon-box purple" style={{ width: '36px', height: '36px' }}>
                      <FolderIcon size={16} color="#4F46E5" />
                    </div>
                    <div className="remotale-admin-item-text">
                      <span className="remotale-admin-item-title">{p.title}</span>
                      <span className="remotale-admin-item-sub">Client: {getClientDisplayName(p.client_id || p.clientId, p.clientName)}</span>
                    </div>
                  </div>

                  <span className={`remotale-days-left-badge ${i === 0 ? 'red' : (i === 1 ? 'amber' : 'purple')}`}>
                    {i === 0 ? '2 days left' : (i === 1 ? '5 days left' : '8 days left')}
                  </span>
                </div>
              ))
            )}
          </section>

          {/* 3. Recent Clients */}
          <section className="remotale-card-container">
            <div className="remotale-card-header">
              <h3>Recent Clients</h3>
              <button type="button" className="remotale-card-view-all" onClick={() => setActiveTab('clients')}>
                View All →
              </button>
            </div>

            {clients.length === 0 ? (
              <div className="remotale-empty-card"><p>No clients registered yet.</p></div>
            ) : (
              clients.slice(0, 3).map(c => (
                <div key={c.id} className="remotale-admin-list-item">
                  <div className="remotale-admin-item-left">
                    <LetterAvatar name={c.name} size={34} />
                    <div className="remotale-admin-item-text">
                      <span className="remotale-admin-item-title">{c.name}</span>
                      <span className="remotale-admin-item-sub">{c.totalProjects || 1} Projects</span>
                    </div>
                  </div>
                  <span style={{ color: '#94a3b8', cursor: 'pointer', fontSize: '15px' }}>⋮</span>
                </div>
              ))
            )}
          </section>

          {/* 4. Team Activity */}
          <section className="remotale-card-container">
            <div className="remotale-card-header">
              <h3>Team Activity</h3>
              <button type="button" className="remotale-card-view-all">View All →</button>
            </div>

            {teamActivities.length === 0 ? (
              <div className="remotale-empty-card"><p>No team activity logged.</p></div>
            ) : (
              teamActivities.slice(0, 3).map(act => (
                <div key={act.id} className="remotale-admin-list-item">
                  <div className="remotale-admin-item-left">
                    <LetterAvatar name={act.member_name || 'Abdullah'} size={34} />
                    <div className="remotale-admin-item-text">
                      <span className="remotale-admin-item-title">{act.member_name} {act.action}</span>
                      <span className="remotale-admin-item-sub">{act.details}</span>
                    </div>
                  </div>
                  <span style={{ fontSize: '11px', color: '#94a3b8' }}>2h ago</span>
                </div>
              ))
            )}
          </section>
        </div>
          </>
        )}
      </main>
    </div>
  );

  // ==========================================
  // RENDER: MOBILE ADMIN PANEL (Image 2)
  // ==========================================
  const renderMobileAdmin = () => {
    if (selectedProject) {
      return (
        <div className="remotale-mobile-wrapper">
          <div className="remotale-mobile-card">
            <ProjectDetailWorkspace
              project={selectedProject}
              onBack={() => setSelectedProject(null)}
              onEditProject={(p) => {
                setProjectToEdit(p);
                setIsNewProjectModalOpen(true);
              }}
              onDeleteProject={handleDeleteProject}
              onToggleTask={handleToggleTask}
              onAddTask={handleAddTaskInDetail}
              onUpdateProject={handleUpdateProject}
              currentUser={user}
            />
            {/* Mobile Bottom Navigation */}
            <div className="remotale-mobile-bottom-nav">
              <button
                type="button"
                className="remotale-bottom-nav-item"
                onClick={() => {
                  setSelectedProject(null);
                  setActiveTab('home');
                }}
              >
                <HomeIcon size={18} color="#64748B" />
                <span>Home</span>
              </button>
              <button
                type="button"
                className="remotale-bottom-nav-item"
                onClick={() => {
                  setSelectedProject(null);
                  setActiveTab('clients');
                }}
              >
                <UsersIcon size={18} color="#64748B" />
                <span>Clients</span>
              </button>
              <button
                type="button"
                className="remotale-bottom-nav-item active"
                onClick={() => {
                  setSelectedProject(null);
                  setActiveTab('projects');
                }}
              >
                <FolderIcon size={18} color="#4F46E5" />
                <span>Projects</span>
              </button>
              <button
                type="button"
                className="remotale-bottom-nav-item"
                onClick={() => {
                  setSelectedProject(null);
                  setActiveTab('team');
                }}
              >
                <UsersIcon size={18} color="#64748B" />
                <span>Team</span>
              </button>
            </div>
          </div>
        </div>
      );
    }

    if (activeTab === 'projects') {
      return (
        <div className="remotale-mobile-wrapper">
          <div className="remotale-mobile-card">
            <div className="remotale-mobile-header">
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <RemotaleLogo size={22} />
                <span style={{ fontWeight: 800, fontSize: '17px', color: '#0f172a' }}>Remotale</span>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <button type="button" className="remotale-bell-btn" style={{ width: '32px', height: '32px' }}>
                  <BellIcon size={16} />
                  <span className="remotale-bell-dot" />
                </button>
                <div style={{ position: 'relative' }}>
                  <div
                    style={{ cursor: 'pointer', display: 'flex', alignItems: 'center' }}
                    onClick={() => setIsProfileMenuOpen(!isProfileMenuOpen)}
                  >
                    <LetterAvatar name="Abdullah" size={32} />
                  </div>
                  {isProfileMenuOpen && (
                    <div className="remotale-user-dropdown-popover">
                      <div className="remotale-dropdown-user-header">
                        <span className="remotale-dropdown-user-name">Abdullah</span>
                        <span className="remotale-dropdown-user-email">admin@remotale.com</span>
                        <span className="remotale-dropdown-badge">👑 Super Admin</span>
                      </div>
                      <div className="remotale-dropdown-divider" />
                      <button
                        type="button"
                        className="remotale-dropdown-logout-item"
                        onClick={() => {
                          setIsProfileMenuOpen(false);
                          onLogout();
                        }}
                      >
                        <span>🚪</span>
                        <span>Log Out</span>
                      </button>
                    </div>
                  )}
                </div>
              </div>
            </div>

            <MyProjectsView
              projects={projects}
              onSelectProject={(proj) => setSelectedProject(proj)}
              onOpenAddProject={() => {
                setProjectToEdit(null);
                setIsNewProjectModalOpen(true);
              }}
              onEditProject={(proj) => {
                setProjectToEdit(proj);
                setIsNewProjectModalOpen(true);
              }}
              onDeleteProject={handleDeleteProject}
              currentUser={user}
              onLogout={onLogout}
            />

            {/* Mobile Bottom Navigation */}
            <div className="remotale-mobile-bottom-nav">
              <button
                type="button"
                className="remotale-bottom-nav-item"
                onClick={() => {
                  setSelectedProject(null);
                  setActiveTab('home');
                }}
              >
                <HomeIcon size={18} color="#64748B" />
                <span>Home</span>
              </button>
              <button
                type="button"
                className="remotale-bottom-nav-item"
                onClick={() => {
                  setSelectedProject(null);
                  setActiveTab('clients');
                }}
              >
                <UsersIcon size={18} color="#64748B" />
                <span>Clients</span>
              </button>
              <button
                type="button"
                className="remotale-bottom-nav-item active"
                onClick={() => {
                  setSelectedProject(null);
                  setActiveTab('projects');
                }}
              >
                <FolderIcon size={18} color="#4F46E5" />
                <span>Projects</span>
              </button>
              <button
                type="button"
                className="remotale-bottom-nav-item"
                onClick={() => {
                  setSelectedProject(null);
                  setActiveTab('team');
                }}
              >
                <UsersIcon size={18} color="#64748B" />
                <span>Team</span>
              </button>
            </div>
          </div>
        </div>
      );
    }

    if (activeTab === 'team') {
      return (
        <div className="remotale-mobile-wrapper">
          <div className="remotale-mobile-card">
            <div className="remotale-mobile-header">
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <RemotaleLogo size={22} />
                <span style={{ fontWeight: 800, fontSize: '17px', color: '#0f172a' }}>Remotale</span>
              </div>
              <LetterAvatar name="Abdullah" size={32} />
            </div>

            {renderTeamView()}

            <div className="remotale-mobile-bottom-nav">
              <button
                type="button"
                className="remotale-bottom-nav-item"
                onClick={() => {
                  setSelectedProject(null);
                  setActiveTab('home');
                }}
              >
                <HomeIcon size={18} color="#64748B" />
                <span>Home</span>
              </button>
              <button
                type="button"
                className="remotale-bottom-nav-item"
                onClick={() => {
                  setSelectedProject(null);
                  setActiveTab('clients');
                }}
              >
                <UsersIcon size={18} color="#64748B" />
                <span>Clients</span>
              </button>
              <button
                type="button"
                className="remotale-bottom-nav-item"
                onClick={() => {
                  setSelectedProject(null);
                  setActiveTab('projects');
                }}
              >
                <FolderIcon size={18} color="#64748B" />
                <span>Projects</span>
              </button>
              <button
                type="button"
                className="remotale-bottom-nav-item active"
                onClick={() => {
                  setSelectedProject(null);
                  setActiveTab('team');
                }}
              >
                <UsersIcon size={18} color="#4F46E5" />
                <span>Team</span>
              </button>
            </div>
          </div>
        </div>
      );
    }

    return (
    <div className="remotale-mobile-wrapper">
      <div className="remotale-mobile-card">
        {/* Header */}
        <div className="remotale-mobile-header">
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <RemotaleLogo size={22} />
            <span style={{ fontWeight: 800, fontSize: '17px', color: '#0f172a' }}>Remotale</span>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <button type="button" className="remotale-bell-btn" style={{ width: '32px', height: '32px' }}>
              <BellIcon size={16} />
              <span className="remotale-bell-dot" />
            </button>
            <div style={{ position: 'relative' }}>
              <div
                style={{ display: 'flex', alignItems: 'center', gap: '6px', cursor: 'pointer' }}
                onClick={() => setIsProfileMenuOpen(!isProfileMenuOpen)}
              >
                <LetterAvatar name="Abdullah" size={32} />
                <div style={{ display: 'flex', flexDirection: 'column', lineHeight: 1.1 }}>
                  <span style={{ fontSize: '11.5px', fontWeight: 700, color: '#0f172a' }}>Admin</span>
                  <span style={{ fontSize: '9.5px', color: '#64748b' }}>Super Admin ⌵</span>
                </div>
              </div>
              {isProfileMenuOpen && (
                <div className="remotale-user-dropdown-popover">
                  <div className="remotale-dropdown-user-header">
                    <span className="remotale-dropdown-user-name">Abdullah</span>
                    <span className="remotale-dropdown-user-email">admin@remotale.com</span>
                    <span className="remotale-dropdown-badge">👑 Super Admin</span>
                  </div>
                  <div className="remotale-dropdown-divider" />
                  <button
                    type="button"
                    className="remotale-dropdown-logout-item"
                    onClick={() => {
                      setIsProfileMenuOpen(false);
                      onLogout();
                    }}
                  >
                    <span>🚪</span>
                    <span>Log Out</span>
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Body */}
        <div className="remotale-mobile-body">
          {/* Greeting */}
          <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between' }}>
            <div>
              <h2 style={{ fontSize: '18px', fontWeight: 800, margin: '0 0 2px 0', color: '#0f172a' }}>
                Welcome Back, Abdullah
              </h2>
              <p style={{ fontSize: '11.5px', color: '#64748b', margin: 0 }}>
                Here's what's happening with your business today.
              </p>
            </div>
            <div style={{ display: 'flex', gap: '6px', alignItems: 'center' }}>
              <button
                type="button"
                className="remotale-btn-new-project"
                style={{ padding: '4px 8px', fontSize: '11px', display: 'inline-flex' }}
                onClick={() => setIsNewProjectModalOpen(true)}
              >
                <span>+ Project</span>
              </button>
              <button type="button" className="remotale-date-filter-btn" style={{ padding: '4px 8px', fontSize: '11px' }}>
                <span>📅 Oct 24, 2024 ⌵</span>
              </button>
            </div>
          </div>

          {/* 4 Stat Cards with Percentage Badges */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '8px' }}>
            {/* 1. Clients */}
            <div className="remotale-stat-card" style={{ padding: '10px 8px', gap: '6px' }}>
              <div className="remotale-stat-icon-box purple" style={{ width: '28px', height: '28px' }}>
                <UsersIcon size={14} color="#4F46E5" />
              </div>
              <div>
                <div style={{ fontSize: '18px', fontWeight: 800, color: '#0f172a' }}>{stats.totalClients || clients.length}</div>
                <div style={{ fontSize: '9.5px', color: '#64748b', marginTop: '2px' }}>Total Clients</div>
                <span className="remotale-stat-growth-pill" style={{ fontSize: '9px', padding: '1px 4px' }}>↑ +20%</span>
              </div>
            </div>

            {/* 2. Projects */}
            <div className="remotale-stat-card" style={{ padding: '10px 8px', gap: '6px' }}>
              <div className="remotale-stat-icon-box blue" style={{ width: '28px', height: '28px' }}>
                <FolderIcon size={14} color="#2563EB" />
              </div>
              <div>
                <div style={{ fontSize: '18px', fontWeight: 800, color: '#0f172a' }}>{stats.totalProjects || projects.length}</div>
                <div style={{ fontSize: '9.5px', color: '#64748b', marginTop: '2px' }}>Total Projects</div>
                <span className="remotale-stat-growth-pill" style={{ fontSize: '9px', padding: '1px 4px' }}>↑ +12%</span>
              </div>
            </div>

            {/* 3. In Progress */}
            <div className="remotale-stat-card" style={{ padding: '10px 8px', gap: '6px' }}>
              <div className="remotale-stat-icon-box green" style={{ width: '28px', height: '28px' }}>
                <PulseIcon size={14} color="#16A34A" />
              </div>
              <div>
                <div style={{ fontSize: '18px', fontWeight: 800, color: '#0f172a' }}>{stats.inProgress || projects.filter(p=>p.status==='in-progress').length}</div>
                <div style={{ fontSize: '9.5px', color: '#64748b', marginTop: '2px' }}>In Progress</div>
                <span className="remotale-stat-growth-pill" style={{ fontSize: '9px', padding: '1px 4px' }}>↑ +8%</span>
              </div>
            </div>

            {/* 4. Completed */}
            <div className="remotale-stat-card" style={{ padding: '10px 8px', gap: '6px' }}>
              <div className="remotale-stat-icon-box green" style={{ width: '28px', height: '28px' }}>
                <CheckmarkIcon size={14} color="#16A34A" />
              </div>
              <div>
                <div style={{ fontSize: '18px', fontWeight: 800, color: '#0f172a' }}>{stats.completed || projects.filter(p=>p.status==='completed').length}</div>
                <div style={{ fontSize: '9.5px', color: '#64748b', marginTop: '2px' }}>Completed</div>
                <span className="remotale-stat-growth-pill" style={{ fontSize: '9px', padding: '1px 4px' }}>↑ +40%</span>
              </div>
            </div>
          </div>

          {/* Sub-tabs */}
          <div className="remotale-mobile-subtabs">
            <button
              type="button"
              className={`remotale-mobile-subtab-btn ${mobileSubTab === 'recent-projects' ? 'active' : ''}`}
              onClick={() => setMobileSubTab('recent-projects')}
            >
              Recent Projects
            </button>
            <button
              type="button"
              className={`remotale-mobile-subtab-btn ${mobileSubTab === 'upcoming-deadlines' ? 'active' : ''}`}
              onClick={() => setMobileSubTab('upcoming-deadlines')}
            >
              Upcoming Deadlines
            </button>
            <button
              type="button"
              className={`remotale-mobile-subtab-btn ${mobileSubTab === 'team-activity' ? 'active' : ''}`}
              onClick={() => setMobileSubTab('team-activity')}
            >
              Team Activity
            </button>
            <button
              type="button"
              className={`remotale-mobile-subtab-btn ${mobileSubTab === 'revenue' ? 'active' : ''}`}
              onClick={() => setMobileSubTab('revenue')}
            >
              Revenue
            </button>
          </div>

          {/* Recent Projects List */}
          <section className="remotale-card-container" style={{ padding: '14px' }}>
            <div className="remotale-card-header" style={{ marginBottom: '10px' }}>
              <h3 style={{ fontSize: '13.5px' }}>Recent Projects</h3>
              <button
                type="button"
                className="remotale-card-view-all"
                onClick={() => {
                  setSelectedProject(null);
                  setActiveTab('projects');
                }}
              >
                View All →
              </button>
            </div>

            {projects.length === 0 ? (
              <div className="remotale-empty-card" style={{ padding: '16px' }}><p>No projects recorded.</p></div>
            ) : (
              projects.slice(0, 3).map((p, idx) => (
                <div
                  key={p.id}
                  style={{ marginBottom: '10px', cursor: 'pointer' }}
                  onClick={() => setSelectedProject(p)}
                >
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '4px' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                      <div className={`remotale-proj-icon-box ${getProjectIconBg(idx)}`} style={{ width: '32px', height: '32px' }}>
                        {getProjectIcon(idx)}
                      </div>
                      <div>
                        <div style={{ fontSize: '12.5px', fontWeight: 700, color: '#0f172a' }}>{p.title}</div>
                        <div style={{ fontSize: '10.5px', color: '#64748b' }}>Client: {getClientDisplayName(p.client_id || p.clientId, p.clientName)}</div>
                      </div>
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                      <span className={`remotale-status-pill ${p.status}`} style={{ fontSize: '10px', padding: '2px 8px' }}>
                        {p.status === 'in-progress' ? 'In Progress' : (p.status === 'under-review' ? 'Under Review' : 'Completed')}
                      </span>
                      {renderProjectDotsMenu(p)}
                    </div>
                  </div>
                  <div className="remotale-progress-bar-wrap" style={{ height: '4px', margin: '4px 0 0 0' }}>
                    <div className="remotale-progress-bar-fill" style={{ width: `${p.progress || 70}%` }} />
                  </div>
                </div>
              ))
            )}
          </section>

          {/* Donut Chart & Project Status Progress Bars Row */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
            {/* Clients Overview Donut Chart */}
            <div className="remotale-card-container" style={{ padding: '12px' }}>
              <div className="remotale-card-header" style={{ marginBottom: '8px' }}>
                <h3 style={{ fontSize: '12.5px' }}>Clients Overview</h3>
                <button type="button" className="remotale-card-view-all">View All →</button>
              </div>
              <div className="remotale-donut-card" style={{ padding: '4px 0' }}>
                <div className="remotale-donut-circle" style={{ width: '70px', height: '70px' }}>
                  <div className="remotale-donut-hole" style={{ width: '46px', height: '46px' }}>
                    <span className="remotale-donut-num">{stats.totalClients || clients.length}</span>
                    <span className="remotale-donut-sub">Total</span>
                  </div>
                </div>
                <div className="remotale-donut-legend">
                  <div className="remotale-legend-item"><span className="remotale-legend-dot purple" /> 5 Active</div>
                  <div className="remotale-legend-item"><span className="remotale-legend-dot blue" /> 3 On Hold</div>
                  <div className="remotale-legend-item"><span className="remotale-legend-dot green" /> 2 Done</div>
                  <div className="remotale-legend-item"><span className="remotale-legend-dot amber" /> 2 New</div>
                </div>
              </div>
            </div>

            {/* Project Status */}
            <div className="remotale-card-container" style={{ padding: '12px' }}>
              <div className="remotale-card-header" style={{ marginBottom: '8px' }}>
                <h3 style={{ fontSize: '12.5px' }}>Project Status</h3>
                <button type="button" className="remotale-card-view-all">View All →</button>
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                <div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '10px', fontWeight: 600, color: '#334155' }}>
                    <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}><span className="remotale-legend-dot purple" style={{ width: '6px', height: '6px' }} /> In Progress</span>
                    <span>{stats.inProgress || 16}</span>
                  </div>
                  <div className="remotale-progress-bar-wrap" style={{ height: '4px', margin: '3px 0 0' }}>
                    <div className="remotale-progress-bar-fill" style={{ width: '65%' }} />
                  </div>
                </div>
                <div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '10px', fontWeight: 600, color: '#334155' }}>
                    <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}><span className="remotale-legend-dot amber" style={{ width: '6px', height: '6px' }} /> Under Review</span>
                    <span>{stats.underReview || 5}</span>
                  </div>
                  <div className="remotale-progress-bar-wrap" style={{ height: '4px', margin: '3px 0 0' }}>
                    <div className="remotale-progress-bar-fill" style={{ width: '35%', background: '#f59e0b' }} />
                  </div>
                </div>
                <div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '10px', fontWeight: 600, color: '#334155' }}>
                    <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}><span className="remotale-legend-dot green" style={{ width: '6px', height: '6px' }} /> Completed</span>
                    <span>{stats.completed || 7}</span>
                  </div>
                  <div className="remotale-progress-bar-wrap" style={{ height: '4px', margin: '3px 0 0' }}>
                    <div className="remotale-progress-bar-fill" style={{ width: '80%', background: '#16a34a' }} />
                  </div>
                </div>
                <div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '10px', fontWeight: 600, color: '#334155' }}>
                    <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}><span className="remotale-legend-dot" style={{ width: '6px', height: '6px', background: '#ef4444' }} /> On Hold</span>
                    <span>3</span>
                  </div>
                  <div className="remotale-progress-bar-wrap" style={{ height: '4px', margin: '3px 0 0' }}>
                    <div className="remotale-progress-bar-fill" style={{ width: '25%', background: '#ef4444' }} />
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Upcoming Deadlines & Team Activity Row (Image 2) */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px', marginTop: '10px' }}>
            {/* Upcoming Deadlines */}
            <div className="remotale-card-container" style={{ padding: '12px' }}>
              <div className="remotale-card-header" style={{ marginBottom: '8px' }}>
                <h3 style={{ fontSize: '12.5px' }}>Upcoming Deadlines</h3>
                <button type="button" className="remotale-card-view-all">View All →</button>
              </div>

              {projects.length === 0 ? (
                <div style={{ padding: '8px 0', textAlign: 'center', color: '#94a3b8', fontSize: '11px' }}>
                  No deadlines pending
                </div>
              ) : (
                projects.slice(0, 3).map((p, idx) => (
                  <div key={p.id} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '6px 0', borderBottom: idx < 2 ? '1px solid #f8fafc' : 'none' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                      <div className={`remotale-proj-icon-box ${getProjectIconBg(idx)}`} style={{ width: '26px', height: '26px' }}>
                        {getProjectIcon(idx)}
                      </div>
                      <div>
                        <div style={{ fontSize: '11px', fontWeight: 700, color: '#0f172a' }}>{p.title}</div>
                        <div style={{ fontSize: '9px', color: '#64748b' }}>Client: {getClientDisplayName(p.client_id || p.clientId, p.clientName)}</div>
                      </div>
                    </div>
                    <span className={`remotale-days-left-badge ${idx === 0 ? 'red' : (idx === 1 ? 'amber' : 'purple')}`} style={{ fontSize: '9px', padding: '2px 5px' }}>
                      {idx === 0 ? '2 days left' : (idx === 1 ? '5 days left' : '8 days left')}
                    </span>
                  </div>
                ))
              )}
            </div>

            {/* Team Activity */}
            <div className="remotale-card-container" style={{ padding: '12px' }}>
              <div className="remotale-card-header" style={{ marginBottom: '8px' }}>
                <h3 style={{ fontSize: '12.5px' }}>Team Activity</h3>
                <button type="button" className="remotale-card-view-all">View All →</button>
              </div>

              {teamActivities.length === 0 ? (
                <div style={{ padding: '8px 0', textAlign: 'center', color: '#94a3b8', fontSize: '11px' }}>
                  No activity recorded
                </div>
              ) : (
                teamActivities.slice(0, 3).map((act, idx) => (
                  <div key={act.id} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '6px 0', borderBottom: idx < 2 ? '1px solid #f8fafc' : 'none' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                      <LetterAvatar name={act.member_name || 'Abdullah'} size={24} />
                      <div>
                        <div style={{ fontSize: '10.5px', fontWeight: 700, color: '#0f172a' }}>{act.member_name} {act.action}</div>
                        <div style={{ fontSize: '8.5px', color: '#64748b' }}>{act.details}</div>
                      </div>
                    </div>
                    <span style={{ fontSize: '8.5px', color: '#94a3b8' }}>2h ago</span>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>

        {/* Mobile Bottom Navigation */}
        <div className="remotale-mobile-bottom-nav">
          <button
            type="button"
            className={`remotale-bottom-nav-item ${activeTab === 'home' && !selectedProject ? 'active' : ''}`}
            onClick={() => {
              setSelectedProject(null);
              setActiveTab('home');
            }}
          >
            <HomeIcon size={18} color={activeTab === 'home' && !selectedProject ? '#4F46E5' : '#64748B'} />
            <span>Home</span>
          </button>
          <button
            type="button"
            className={`remotale-bottom-nav-item ${activeTab === 'clients' ? 'active' : ''}`}
            onClick={() => {
              setSelectedProject(null);
              setActiveTab('clients');
            }}
          >
            <UsersIcon size={18} color="#64748B" />
            <span>Clients</span>
          </button>
          <button
            type="button"
            className={`remotale-bottom-nav-item ${(activeTab === 'projects' || selectedProject) ? 'active' : ''}`}
            onClick={() => {
              setSelectedProject(null);
              setActiveTab('projects');
            }}
          >
            <FolderIcon size={18} color={(activeTab === 'projects' || selectedProject) ? '#4F46E5' : '#64748B'} />
            <span>Projects</span>
          </button>
          <button
            type="button"
            className={`remotale-bottom-nav-item ${activeTab === 'team' ? 'active' : ''}`}
            onClick={() => {
              setSelectedProject(null);
              setActiveTab('team');
            }}
          >
            <UsersIcon size={18} color="#64748B" />
            <span>Team</span>
          </button>
        </div>
      </div>
    </div>
  );
};

  // ==========================================
  // RENDER: MOBILE CLIENT PANEL (Image 3)
  // ==========================================
  const renderMobileClient = () => {
    if (selectedProject) {
      return (
        <div className="remotale-mobile-wrapper">
          <div className="remotale-mobile-card">
            <ProjectDetailWorkspace
              project={selectedProject}
              onBack={() => setSelectedProject(null)}
              onEditProject={(p) => {
                setProjectToEdit(p);
                setIsNewProjectModalOpen(true);
              }}
              onDeleteProject={handleDeleteProject}
              onToggleTask={handleToggleTask}
              onAddTask={handleAddTaskInDetail}
              onUpdateProject={handleUpdateProject}
              currentUser={currentClientUser}
              onLogout={onLogout}
            />
            {/* Mobile Bottom Navigation */}
            <div className="remotale-mobile-bottom-nav">
              <button
                type="button"
                className="remotale-bottom-nav-item"
                onClick={() => {
                  setSelectedProject(null);
                  setActiveTab('home');
                  setMobileSubTab('my-projects');
                }}
              >
                <HomeIcon size={18} color="#64748B" />
                <span>Home</span>
              </button>
              <button
                type="button"
                className="remotale-bottom-nav-item active"
                onClick={() => {
                  setSelectedProject(null);
                  setActiveTab('projects');
                }}
              >
                <FolderIcon size={18} color="#4F46E5" />
                <span>Projects</span>
              </button>
              <button
                type="button"
                className="remotale-bottom-nav-item"
                onClick={() => {
                  setSelectedProject(null);
                  setActiveTab('home');
                  setMobileSubTab('messages');
                }}
              >
                <MessagesIcon size={18} color="#64748B" />
                <span>Messages</span>
              </button>
              <button
                type="button"
                className={`remotale-bottom-nav-item ${isProfileMenuOpen ? 'active' : ''}`}
                onClick={() => {
                  setIsProfileMenuOpen(!isProfileMenuOpen);
                }}
              >
                <UsersIcon size={18} color={isProfileMenuOpen ? '#4F46E5' : '#64748B'} />
                <span>Profile</span>
              </button>
            </div>
          </div>
        </div>
      );
    }

    if (activeTab === 'projects') {
      return (
        <div className="remotale-mobile-wrapper">
          <div className="remotale-mobile-card">
            {/* Header matching Image 1 */}
            <div className="remotale-mobile-header">
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <RemotaleLogo size={22} />
                <span style={{ fontWeight: 800, fontSize: '17px', color: '#0f172a' }}>Remotale</span>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <button type="button" className="remotale-bell-btn" style={{ width: '32px', height: '32px' }}>
                  <BellIcon size={16} />
                  <span className="remotale-bell-dot" />
                </button>
                <div style={{ position: 'relative' }}>
                  <div
                    style={{ display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer' }}
                    onClick={() => setIsProfileMenuOpen(!isProfileMenuOpen)}
                  >
                    <div className="remotale-header-avatar-circle" style={{ width: '32px', height: '32px', fontSize: '13px', background: '#EDE9FE', color: '#7C3AED' }}>
                      <span>{currentClientUser?.name ? currentClientUser.name[0].toUpperCase() : 'C'}</span>
                    </div>
                    <div style={{ display: 'flex', flexDirection: 'column', lineHeight: 1.2 }}>
                      <span style={{ fontSize: '13px', fontWeight: 700, color: '#0f172a' }}>{currentClientUser?.name || 'Client'}</span>
                      <span style={{ fontSize: '11px', color: '#64748b' }}>{currentClientUser?.company || 'Client'} ⌵</span>
                    </div>
                  </div>
                  {isProfileMenuOpen && (
                    <div className="remotale-user-dropdown-popover">
                      <div className="remotale-dropdown-user-header">
                        <span className="remotale-dropdown-user-name">{currentClientUser?.name || 'Client'}</span>
                        <span className="remotale-dropdown-user-email">{currentClientUser?.email || 'client@remotale.com'}</span>
                        <span className="remotale-dropdown-badge">👤 Client Portal</span>
                      </div>
                      <div className="remotale-dropdown-divider" />
                      <button
                        type="button"
                        className="remotale-dropdown-logout-item"
                        onClick={() => {
                          setIsProfileMenuOpen(false);
                          onLogout();
                        }}
                      >
                        <span>🚪</span>
                        <span>Log Out</span>
                      </button>
                    </div>
                  )}
                </div>
              </div>
            </div>

            <MyProjectsView
              projects={visibleProjects}
              onSelectProject={(proj) => setSelectedProject(proj)}
              onOpenAddProject={() => {
                setProjectToEdit(null);
                setIsNewProjectModalOpen(true);
              }}
              onEditProject={(proj) => {
                setProjectToEdit(proj);
                setIsNewProjectModalOpen(true);
              }}
              onDeleteProject={handleDeleteProject}
              currentUser={currentClientUser}
              onLogout={onLogout}
            />

            {/* Mobile Bottom Navigation */}
            <div className="remotale-mobile-bottom-nav">
              <button
                type="button"
                className="remotale-bottom-nav-item"
                onClick={() => {
                  setSelectedProject(null);
                  setActiveTab('home');
                  setMobileSubTab('my-projects');
                }}
              >
                <HomeIcon size={18} color="#64748B" />
                <span>Home</span>
              </button>
              <button
                type="button"
                className="remotale-bottom-nav-item active"
                onClick={() => {
                  setSelectedProject(null);
                  setActiveTab('projects');
                }}
              >
                <FolderIcon size={18} color="#4F46E5" />
                <span>Projects</span>
              </button>
              <button
                type="button"
                className="remotale-bottom-nav-item"
                onClick={() => {
                  setSelectedProject(null);
                  setActiveTab('home');
                  setMobileSubTab('messages');
                }}
              >
                <MessagesIcon size={18} color="#64748B" />
                <span>Messages</span>
              </button>
              <button
                type="button"
                className={`remotale-bottom-nav-item ${isProfileMenuOpen ? 'active' : ''}`}
                onClick={() => {
                  setIsProfileMenuOpen(!isProfileMenuOpen);
                }}
              >
                <UsersIcon size={18} color={isProfileMenuOpen ? '#4F46E5' : '#64748B'} />
                <span>Profile</span>
              </button>
            </div>
          </div>
        </div>
      );
    }

    return (
      <div className="remotale-mobile-wrapper">
        <div className="remotale-mobile-card">
          {/* Header */}
          <div className="remotale-mobile-header">
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <RemotaleLogo size={22} />
              <span style={{ fontWeight: 800, fontSize: '17px', color: '#0f172a' }}>Remotale</span>
            </div>

            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <button type="button" className="remotale-bell-btn" style={{ width: '32px', height: '32px' }}>
                <BellIcon size={16} />
                <span className="remotale-bell-dot" />
              </button>
              <div style={{ position: 'relative' }}>
                <div
                  style={{ display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer' }}
                  onClick={() => setIsProfileMenuOpen(!isProfileMenuOpen)}
                >
                  <div className="remotale-header-avatar-circle" style={{ width: '32px', height: '32px', fontSize: '13px', background: '#EDE9FE', color: '#7C3AED' }}>
                    <span>{currentClientUser?.name ? currentClientUser.name[0].toUpperCase() : 'C'}</span>
                  </div>
                  <div style={{ display: 'flex', flexDirection: 'column', lineHeight: 1.2 }}>
                    <span style={{ fontSize: '13px', fontWeight: 700, color: '#0f172a' }}>{currentClientUser?.name || 'Client'}</span>
                    <span style={{ fontSize: '11px', color: '#64748b' }}>{currentClientUser?.company || 'Client'} ⌵</span>
                  </div>
                </div>
                {isProfileMenuOpen && (
                  <div className="remotale-user-dropdown-popover">
                    <div className="remotale-dropdown-user-header">
                      <span className="remotale-dropdown-user-name">{currentClientUser?.name || 'Client'}</span>
                      <span className="remotale-dropdown-user-email">{currentClientUser?.email || 'client@remotale.com'}</span>
                      <span className="remotale-dropdown-badge">👤 Client Portal</span>
                    </div>
                    <div className="remotale-dropdown-divider" />
                    <button
                      type="button"
                      className="remotale-dropdown-logout-item"
                      onClick={() => {
                        setIsProfileMenuOpen(false);
                        onLogout();
                      }}
                    >
                      <span>🚪</span>
                      <span>Log Out</span>
                    </button>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Body */}
          <div className="remotale-mobile-body">
            {/* Greeting */}
            <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between' }}>
              <div>
                <h2 style={{ fontSize: '18px', fontWeight: 800, margin: '0 0 2px 0', color: '#0f172a' }}>
                  Hello, {currentClientUser?.name?.split(' ')[0] || 'Client'} 👋
                </h2>
                <p style={{ fontSize: '11.5px', color: '#64748b', margin: 0 }}>
                  Here's an overview of your projects.
                </p>
              </div>
              <button
                type="button"
                className="remotale-btn-new-project"
                style={{ padding: '6px 12px', fontSize: '11px' }}
                onClick={() => {
                  setProjectToEdit(null);
                  setIsNewProjectModalOpen(true);
                }}
              >
                <span>+ New Project</span>
              </button>
            </div>

            {/* 4 Stat Cards */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '8px' }}>
              <div className="remotale-stat-card" style={{ padding: '10px 8px', gap: '4px' }}>
                <div className="remotale-stat-icon-box purple" style={{ width: '28px', height: '28px' }}>
                  <FolderIcon size={14} color="#4F46E5" />
                </div>
                <div style={{ fontSize: '18px', fontWeight: 800, color: '#0f172a' }}>{visibleProjects.length}</div>
                <div style={{ fontSize: '9px', color: '#64748b' }}>Total</div>
              </div>

              <div className="remotale-stat-card" style={{ padding: '10px 8px', gap: '4px' }}>
                <div className="remotale-stat-icon-box blue" style={{ width: '28px', height: '28px' }}>
                  <TargetIcon size={14} color="#2563EB" />
                </div>
                <div style={{ fontSize: '18px', fontWeight: 800, color: '#0f172a' }}>{visibleProjects.filter(p => p.status === 'in-progress').length}</div>
                <div style={{ fontSize: '9px', color: '#64748b' }}>In Progress</div>
              </div>

              <div className="remotale-stat-card" style={{ padding: '10px 8px', gap: '4px' }}>
                <div className="remotale-stat-icon-box amber" style={{ width: '28px', height: '28px' }}>
                  <ClockIcon size={14} color="#CA8A04" />
                </div>
                <div style={{ fontSize: '18px', fontWeight: 800, color: '#0f172a' }}>{visibleProjects.filter(p => p.status === 'under-review').length}</div>
                <div style={{ fontSize: '9px', color: '#64748b' }}>Review</div>
              </div>

              <div className="remotale-stat-card" style={{ padding: '10px 8px', gap: '4px' }}>
                <div className="remotale-stat-icon-box green" style={{ width: '28px', height: '28px' }}>
                  <CheckmarkIcon size={14} color="#16A34A" />
                </div>
                <div style={{ fontSize: '18px', fontWeight: 800, color: '#0f172a' }}>{visibleProjects.filter(p => p.status === 'completed').length}</div>
                <div style={{ fontSize: '9px', color: '#64748b' }}>Done</div>
              </div>
            </div>

            {/* Sub-tabs */}
            <div className="remotale-mobile-subtabs">
              <button
                type="button"
                className={`remotale-mobile-subtab-btn ${mobileSubTab === 'my-projects' ? 'active' : ''}`}
                onClick={() => setMobileSubTab('my-projects')}
              >
                My Projects
              </button>
              <button
                type="button"
                className={`remotale-mobile-subtab-btn ${mobileSubTab === 'recent-activity' ? 'active' : ''}`}
                onClick={() => setMobileSubTab('recent-activity')}
              >
                Recent Activity
              </button>
              <button
                type="button"
                className={`remotale-mobile-subtab-btn ${mobileSubTab === 'messages' ? 'active' : ''}`}
                onClick={() => setMobileSubTab('messages')}
              >
                Messages
              </button>
            </div>

            {/* Projects List */}
            <section className="remotale-card-container" style={{ padding: '14px' }}>
              {visibleProjects.length === 0 ? (
                <div className="remotale-empty-card" style={{ padding: '16px' }}>
                  <p>No projects yet.</p>
                  <button
                    type="button"
                    className="remotale-btn-new-project"
                    style={{ margin: '8px auto 0', display: 'inline-flex', padding: '6px 12px', fontSize: '11px' }}
                    onClick={() => {
                      setProjectToEdit(null);
                      setIsNewProjectModalOpen(true);
                    }}
                  >
                    + Create Project
                  </button>
                </div>
              ) : (
                visibleProjects.slice(0, 3).map((proj, idx) => (
                  <div
                    key={proj.id}
                    className="remotale-project-card"
                    style={{ padding: '12px', marginBottom: '10px', cursor: 'pointer', position: 'relative' }}
                    onClick={() => setSelectedProject(proj)}
                  >
                    <div className="remotale-proj-top" style={{ gap: '8px', marginBottom: '6px', justifyContent: 'space-between' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                        <div className={`remotale-proj-icon-box ${getProjectIconBg(idx)}`} style={{ width: '32px', height: '32px' }}>
                          {getProjectIcon(idx)}
                        </div>
                        <div className="remotale-proj-title-row">
                          <span className="remotale-proj-title" style={{ fontSize: '13px' }}>{proj.title}</span>
                          <span className={`remotale-status-pill ${proj.status}`} style={{ fontSize: '9.5px', padding: '2px 6px' }}>
                            {proj.status === 'in-progress' ? 'In Progress' : (proj.status === 'under-review' ? 'Under Review' : 'Completed')}
                          </span>
                        </div>
                      </div>
                      {renderProjectDotsMenu(proj)}
                    </div>
                    <p className="remotale-proj-desc" style={{ fontSize: '11px', marginBottom: '6px' }}>{proj.description}</p>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '3px' }}>
                      <span style={{ fontSize: '9.5px', color: '#64748b', fontWeight: 600 }}>Progress</span>
                      <span style={{ fontSize: '10px', color: '#1e293b', fontWeight: 700 }}>{proj.progress || 0}%</span>
                    </div>
                    <div className="remotale-progress-bar-wrap" style={{ height: '4px', marginBottom: '8px' }}>
                      <div className="remotale-progress-bar-fill" style={{ width: `${proj.progress || 0}%`, transition: 'width 0.35s ease' }} />
                    </div>
                    <div className="remotale-proj-footer">
                      <div style={{ display: 'flex', alignItems: 'center', gap: '5px' }}>
                        <LetterAvatar name="Abdullah" size={18} />
                        <span style={{ fontSize: '10.5px', fontWeight: 600, color: '#475569' }}>Admin: Abdullah</span>
                      </div>
                      <span style={{ fontSize: '10px', color: '#64748b' }}>📅 Due {proj.deadline || '25 Oct 2024'}</span>
                    </div>
                  </div>
                ))
              )}
            </section>

            {/* Project Deadlines & Recent Messages 2-Column Split (Image 3) */}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
              {/* Project Deadlines Section (Nearest to Farthest) */}
              <section className="remotale-card-container" style={{ padding: '12px' }}>
                <div className="remotale-card-header" style={{ marginBottom: '8px' }}>
                  <h3 style={{ fontSize: '12px', margin: 0, fontWeight: 700 }}>Project Deadlines</h3>
                  <span style={{ fontSize: '9px', fontWeight: 700, color: '#4f46e5', background: '#eef2ff', padding: '1px 5px', borderRadius: '999px' }}>
                    Nearest
                  </span>
                </div>

                {sortedDeadlines.length === 0 ? (
                  <p style={{ fontSize: '11px', color: '#94a3b8', margin: 0 }}>No deadlines pending.</p>
                ) : (
                  sortedDeadlines.slice(0, 3).map(p => {
                    const badge = getDaysRemainingBadge(p.deadline);
                    const pct = (p.progress !== undefined && p.progress !== null) ? Number(p.progress) : (p.status === 'completed' ? 100 : 0);

                    return (
                      <div
                        key={p.id}
                        onClick={() => setSelectedProject(p)}
                        style={{ padding: '6px 0', borderBottom: '1px solid #f8fafc', cursor: 'pointer' }}
                      >
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2px' }}>
                          <span style={{ fontSize: '11px', fontWeight: 700, color: '#0f172a', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', maxWidth: '85px' }}>
                            {p.title}
                          </span>
                          <span style={{ fontSize: '8px', fontWeight: 700, padding: '1px 4px', borderRadius: '999px', background: badge.bg, color: badge.color, flexShrink: 0 }}>
                            {badge.text}
                          </span>
                        </div>
                        <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '9px', color: '#64748b', marginBottom: '3px' }}>
                          <span>📅 {p.deadline}</span>
                          <span style={{ fontWeight: 700 }}>{pct}%</span>
                        </div>
                        <div style={{ width: '100%', height: '3px', background: '#e2e8f0', borderRadius: '999px', overflow: 'hidden' }}>
                          <div style={{ width: `${pct}%`, height: '100%', background: pct === 100 ? '#10b981' : '#4f46e5', transition: 'width 0.35s ease' }} />
                        </div>
                      </div>
                    );
                  })
                )}
              </section>

              {/* Recent Messages */}
              <section className="remotale-card-container" style={{ padding: '12px' }}>
                <div className="remotale-card-header" style={{ marginBottom: '8px' }}>
                  <h3 style={{ fontSize: '12.5px' }}>Recent Messages</h3>
                  <button type="button" className="remotale-card-view-all">View All →</button>
                </div>

                {messages.length === 0 ? (
                  <p style={{ fontSize: '11px', color: '#94a3b8', margin: 0 }}>No messages yet.</p>
                ) : (
                  messages.slice(0, 3).map(msg => (
                    <div key={msg.id} className="remotale-message-item" style={{ padding: '5px 0', gap: '8px' }}>
                      <LetterAvatar name={msg.sender_name || 'Admin'} size={24} />
                      <div className="remotale-msg-body">
                        <div className="remotale-msg-header">
                          <span className="remotale-msg-sender" style={{ fontSize: '10.5px' }}>{msg.sender_name}</span>
                          <span className="remotale-msg-time" style={{ fontSize: '8.5px' }}>2h ago</span>
                        </div>
                        <span className="remotale-msg-snippet" style={{ fontSize: '9.5px' }}>{msg.content}</span>
                      </div>
                    </div>
                  ))
                )}
              </section>
            </div>
          </div>

          {/* Mobile Bottom Navigation */}
          <div className="remotale-mobile-bottom-nav">
            <button
              type="button"
              className={`remotale-bottom-nav-item ${activeTab === 'home' && !selectedProject && mobileSubTab !== 'messages' ? 'active' : ''}`}
              onClick={() => {
                setSelectedProject(null);
                setActiveTab('home');
                setMobileSubTab('my-projects');
              }}
            >
              <HomeIcon size={18} color={activeTab === 'home' && !selectedProject && mobileSubTab !== 'messages' ? '#4F46E5' : '#64748B'} />
              <span>Home</span>
            </button>
            <button
              type="button"
              className={`remotale-bottom-nav-item ${(activeTab === 'projects' || selectedProject) ? 'active' : ''}`}
              onClick={() => {
                setSelectedProject(null);
                setActiveTab('projects');
              }}
            >
              <FolderIcon size={18} color={(activeTab === 'projects' || selectedProject) ? '#4F46E5' : '#64748B'} />
              <span>Projects</span>
            </button>
            <button
              type="button"
              className={`remotale-bottom-nav-item ${mobileSubTab === 'messages' ? 'active' : ''}`}
              onClick={() => {
                setSelectedProject(null);
                setActiveTab('home');
                setMobileSubTab('messages');
              }}
            >
              <MessagesIcon size={18} color={mobileSubTab === 'messages' ? '#4F46E5' : '#64748B'} />
              <span>Messages</span>
            </button>
            <button
              type="button"
              className={`remotale-bottom-nav-item ${isProfileMenuOpen ? 'active' : ''}`}
              onClick={() => {
                setIsProfileMenuOpen(!isProfileMenuOpen);
              }}
            >
              <UsersIcon size={18} color={isProfileMenuOpen ? '#4F46E5' : '#64748B'} />
              <span>Profile</span>
            </button>
          </div>
        </div>
      </div>
    );
  };

  return (
    <div style={{ minHeight: '100vh', background: '#f8fafc', display: 'flex', flexDirection: 'column' }}>
      {/* Main View Area - Clean production layout without preview headers */}
      {isMobileScreen ? (
        role === 'admin' ? renderMobileAdmin() : renderMobileClient()
      ) : (
        role === 'admin' ? renderDesktopAdmin() : renderDesktopClient()
      )}

      {/* Add New Project Modal - Exact replica of user screenshot with Admin Client assignment */}
      <AddNewProjectModal
        isOpen={isNewProjectModalOpen}
        onClose={() => {
          setIsNewProjectModalOpen(false);
          setProjectToEdit(null);
        }}
        onSubmit={handleSaveProject}
        projectToEdit={projectToEdit}
        isAdmin={role === 'admin'}
        clients={clients}
        currentUser={user}
      />
    </div>
  );
}
