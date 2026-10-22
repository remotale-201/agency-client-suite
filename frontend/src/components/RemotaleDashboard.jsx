import React, { useState, useEffect, useMemo, useRef } from 'react';
import './RemotaleDashboard.css';
import { api } from '../api';
import { RemotaleLogo } from './RemotaleAuthFlow';
import AddNewProjectModal from './AddNewProjectModal';
import MyProjectsView from './MyProjectsView';
import ProjectDetailWorkspace from './ProjectDetailWorkspace';
import InvoicesView from './InvoicesView';
import TasksView from './TasksView';
import MessagesView from './MessagesView';
import ComingSoonView from './ComingSoonView';
import LetterAvatar from './LetterAvatar';
import ClientProgressPdfModal from './ClientProgressPdfModal';
import { SEED_PROJECTS, SEED_CLIENTS, SEED_STATS, SEED_INVOICES, SEED_ACTIVITIES, SEED_TEAM_MEMBERS, SEED_MESSAGES } from '../seedData';

// Helper for relative time formatting
function formatTimeAgo(dateStr) {
  if (!dateStr) return 'Recently';
  const time = new Date(dateStr).getTime();
  if (isNaN(time)) return dateStr;
  const diffSec = Math.floor((Date.now() - time) / 1000);
  if (diffSec < 60) return 'Just now';
  if (diffSec < 3600) return `${Math.floor(diffSec / 60)}m ago`;
  if (diffSec < 86400) return `${Math.floor(diffSec / 3600)}h ago`;
  if (diffSec < 172800) return 'Yesterday';
  return `${Math.floor(diffSec / 86400)}d ago`;
}

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
  const isRealMember = user?.role === 'member';
  // Role: 'admin', 'client', or 'member'
  const [role, setRole] = useState(() => (isRealAdmin ? 'admin' : (isRealMember ? 'member' : 'client')));
  const [previewClientId, setPreviewClientId] = useState('client-awais');
  const [previewMemberId, setPreviewMemberId] = useState('mem-usman');

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

  // Live Database State with Instant Resilience
  const [stats, setStats] = useState(SEED_STATS);
  const [projects, setProjects] = useState(() => (api.getStoredProjects ? api.getStoredProjects() : SEED_PROJECTS));
  const [tasks, setTasks] = useState(() => (api.getStoredTasks ? api.getStoredTasks() : SEED_PROJECTS.flatMap(p => p.tasks || [])));
  const [messages, setMessages] = useState(() => {
    if (typeof window === 'undefined') return [];
    try {
      const raw = localStorage.getItem('remotale_messages_v1');
      if (raw) {
        const parsed = JSON.parse(raw);
        if (Array.isArray(parsed)) {
          return parsed.filter(m => m.id !== 'msg-1' && m.id !== 'msg-2' && m.id !== 'msg-3');
        }
      }
    } catch (e) {}
    return [];
  });
  const [teamMembers, setTeamMembers] = useState(SEED_TEAM_MEMBERS);
  const [clients, setClients] = useState(SEED_CLIENTS);
  const [invoices, setInvoices] = useState(() => {
    try {
      if (api.getStoredInvoices) {
        const stored = api.getStoredInvoices();
        if (Array.isArray(stored) && stored.length > 0) return stored;
      }
    } catch (e) {}
    return SEED_INVOICES;
  });

  // Add Team Member Modal State
  const [isAddTeamModalOpen, setIsAddTeamModalOpen] = useState(false);
  const [newMemberName, setNewMemberName] = useState('');
  const [newMemberEmail, setNewMemberEmail] = useState('');
  const [newMemberRole, setNewMemberRole] = useState('Frontend & Shopify Engineer');
  const [newMemberPw, setNewMemberPw] = useState('');
  const [newMemberInitialProj, setNewMemberInitialProj] = useState('');

  // Selected Project for Detail View (Image 2)
  const [selectedProject, setSelectedProject] = useState(null);
  const selectedProjectRef = useRef(selectedProject);
  useEffect(() => {
    selectedProjectRef.current = selectedProject;
  }, [selectedProject]);

  // Robust project selector that bundles tasks and scrolls to top smoothly
  const handleSelectProject = (proj) => {
    if (!proj) return;
    const projTasks = Array.isArray(tasks) ? tasks.filter(t => t.project_id === proj.id) : (proj.tasks || []);
    setSelectedProject({ ...proj, tasks: projTasks });
    window.scrollTo(0, 0);
  };

  // Project to Edit in Modal
  const [projectToEdit, setProjectToEdit] = useState(null);

  // Effective IDs
  const effectiveClientId = !isRealAdmin ? (user?.id || 'client-awais') : (role === 'client' ? previewClientId : null);
  const effectiveMemberId = isRealMember ? (user?.id || 'mem-usman') : (role === 'member' ? previewMemberId : null);

  // Active Client User Object
  const currentClientUser = useMemo(() => {
    if (!isRealAdmin && !isRealMember) return user;
    const found = clients.find(c => c.id === effectiveClientId);
    if (found) return found;
    if (effectiveClientId === 'client-awais') return { id: 'client-awais', name: 'Awais', email: 'awais@remotale.com', company: 'Awais Agency' };
    if (effectiveClientId === 'client-afshal') return { id: 'client-afshal', name: 'Afshal', email: 'afshal@remotale.com', company: 'Afshal Brand' };
    return { id: 'client-1', name: 'Ali Khan', email: 'ali@remotale.com', company: 'Acme Brand' };
  }, [isRealAdmin, isRealMember, user, clients, effectiveClientId]);

  // Active Team Member User Object
  const currentMemberUser = useMemo(() => {
    if (isRealMember && user) return user;
    const found = teamMembers.find(m => m.id === effectiveMemberId);
    if (found) return found;
    return teamMembers[0] || { id: 'mem-usman', name: 'Usman Ali', role: 'Frontend & Shopify Engineer' };
  }, [isRealMember, user, teamMembers, effectiveMemberId]);

  // Unified Current User for active portal view
  const currentUserForPortal = useMemo(() => {
    if (role === 'admin') {
      return user || { id: 'admin-1', name: 'Abdullah', role: 'admin' };
    }
    if (role === 'member') {
      return currentMemberUser;
    }
    return currentClientUser;
  }, [role, user, currentMemberUser, currentClientUser]);

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
  // For admin: show all projects
  // For member: show projects assigned to this member
  // For client: show projects belonging to this client
  const visibleProjects = useMemo(() => {
    if (role === 'admin') {
      return projects;
    }
    if (role === 'member') {
      return projects.filter(p => {
        const assignedTo = p.assigned_to || p.assignedTo;
        if (assignedTo === effectiveMemberId) return true;
        if (Array.isArray(p.assigned_members)) {
          return p.assigned_members.some(m => (m?.id === effectiveMemberId || m === effectiveMemberId));
        }
        return false;
      });
    }
    return projects.filter(p => {
      const pClientId = p.client_id || p.clientId;
      return pClientId === effectiveClientId;
    });
  }, [role, projects, effectiveClientId, effectiveMemberId]);

  // Filter tasks strictly:
  const visibleTasks = useMemo(() => {
    if (role === 'admin') {
      return tasks;
    }
    const visibleProjIds = new Set(visibleProjects.map(p => p.id));
    if (role === 'member') {
      return tasks.filter(t => (t.assigned_to === effectiveMemberId || visibleProjIds.has(t.project_id)));
    }
    return tasks.filter(t => (t.client_id === effectiveClientId || visibleProjIds.has(t.project_id)));
  }, [role, tasks, visibleProjects, effectiveClientId, effectiveMemberId]);

  // Filter messages strictly:
  const visibleMessages = useMemo(() => {
    if (role === 'admin') {
      return messages;
    }
    const visibleProjIds = new Set(visibleProjects.map(p => p.id));
    const targetId = role === 'member' ? effectiveMemberId : effectiveClientId;
    return messages.filter(m => (
      m.sender_id === targetId ||
      m.receiver_id === targetId ||
      visibleProjIds.has(m.project_id || m.projectId)
    ));
  }, [role, messages, visibleProjects, effectiveClientId, effectiveMemberId]);

  // Active Dots Dropdown ID on Project cards
  const [activeDotsId, setActiveDotsId] = useState(null);

  // New Project Modal State
  const [isNewProjectModalOpen, setIsNewProjectModalOpen] = useState(false);
  // Client Progress PDF Studio Modal State
  const [isProgressPdfModalOpen, setIsProgressPdfModalOpen] = useState(false);
  const [progressPdfClientId, setProgressPdfClientId] = useState('client-awais');
  const [newProjTitle, setNewProjTitle] = useState('');
  const [newProjDesc, setNewProjDesc] = useState('');
  const [newProjStatus, setNewProjStatus] = useState('in-progress');
  const [newProjDeadline, setNewProjDeadline] = useState(() => new Date(Date.now() + 7 * 86400000).toLocaleDateString('en-GB'));
  const [newProjBudget, setNewProjBudget] = useState('1500');
  const [modalLoading, setModalLoading] = useState(false);

  // Dynamic Date Filter State
  const [dateFilterOption, setDateFilterOption] = useState('today');
  const [customDate, setCustomDate] = useState(() => new Date().toISOString().split('T')[0]);
  const [isDatePickerOpen, setIsDatePickerOpen] = useState(false);
  const datePickerRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (datePickerRef.current && !datePickerRef.current.contains(e.target)) {
        setIsDatePickerOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const formattedCurrentDate = useMemo(() => {
    return new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
  }, []);

  const dateFilterLabel = useMemo(() => {
    if (dateFilterOption === 'today') {
      return `📅 ${formattedCurrentDate} ⌵`;
    }
    if (dateFilterOption === 'this-week') {
      return `📅 This Week ⌵`;
    }
    if (dateFilterOption === 'this-month') {
      return `📅 This Month ⌵`;
    }
    if (dateFilterOption === 'custom' && customDate) {
      const parts = customDate.split('-');
      if (parts.length === 3) {
        const d = new Date(Number(parts[0]), Number(parts[1]) - 1, Number(parts[2]));
        return `📅 ${d.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })} ⌵`;
      }
    }
    return `📅 ${formattedCurrentDate} ⌵`;
  }, [dateFilterOption, customDate, formattedCurrentDate]);

  // New Task Quick State
  const [newTaskTitle, setNewTaskTitle] = useState('');
  const [isAddingTask, setIsAddingTask] = useState(false);

  // Fetch all real database data with real-time sync
  const loadData = async () => {
    try {
      const [statsRes, projsRes, tasksRes, msgsRes, clientsRes, actsRes, invsRes, teamRes] = await Promise.all([
        api.getStats().catch((e) => { console.warn('[Stats Sync]', e.message); return null; }),
        api.getProjects().catch((e) => { console.warn('[Projects Sync]', e.message); return null; }),
        api.getTasks().catch((e) => { console.warn('[Tasks Sync]', e.message); return null; }),
        api.getMessages().catch((e) => { console.warn('[Messages Sync]', e.message); return null; }),
        api.getClients().catch((e) => { console.warn('[Clients Sync]', e.message); return null; }),
        api.getTeamActivities().catch((e) => { console.warn('[Activities Sync]', e.message); return null; }),
        api.getInvoices({ includeDeleted: isRealAdmin }).catch((e) => { console.warn('[Invoices Sync]', e.message); return null; }),
        api.getTeamMembers().catch((e) => { console.warn('[Team Members Sync]', e.message); return null; })
      ]);

      if (statsRes && typeof statsRes.totalProjects === 'number') {
        setStats(prev => JSON.stringify(prev) === JSON.stringify(statsRes) ? prev : statsRes);
      }
      if (Array.isArray(projsRes) && projsRes.length > 0) {
        const mappedProjs = projsRes.map(p => {
          const is100 = Number(p.progress) >= 100;
          return {
            ...p,
            progress: is100 ? 100 : p.progress,
            status: is100 ? 'completed' : p.status
          };
        });
        setProjects(prev => JSON.stringify(prev) === JSON.stringify(mappedProjs) ? prev : mappedProjs);
      }
      if (Array.isArray(tasksRes) && tasksRes.length > 0) {
        setTasks(prev => JSON.stringify(prev) === JSON.stringify(tasksRes) ? prev : tasksRes);
      }
      if (Array.isArray(msgsRes)) {
        setMessages(prev => {
          const map = new Map();
          prev.filter(m => m.id !== 'msg-1' && m.id !== 'msg-2' && m.id !== 'msg-3').forEach(m => map.set(m.id, m));
          msgsRes.filter(m => m.id !== 'msg-1' && m.id !== 'msg-2' && m.id !== 'msg-3').forEach(m => map.set(m.id, { ...(map.get(m.id) || {}), ...m }));
          const merged = Array.from(map.values()).sort((a, b) => new Date(a.created_at || 0) - new Date(b.created_at || 0));
          try {
            localStorage.setItem('remotale_messages_v1', JSON.stringify(merged));
          } catch (e) {}
          return JSON.stringify(prev) === JSON.stringify(merged) ? prev : merged;
        });
      }
      if (Array.isArray(clientsRes) && clientsRes.length > 0) {
        setClients(prev => JSON.stringify(prev) === JSON.stringify(clientsRes) ? prev : clientsRes);
      }
      if (Array.isArray(actsRes)) {
        setTeamActivities(prev => JSON.stringify(prev) === JSON.stringify(actsRes) ? prev : actsRes);
      }
      if (Array.isArray(teamRes) && teamRes.length > 0) {
        setTeamMembers(prev => JSON.stringify(prev) === JSON.stringify(teamRes) ? prev : teamRes);
      }
      if (Array.isArray(invsRes)) {
        if (invsRes.length > 0) {
          setInvoices(prev => JSON.stringify(prev) === JSON.stringify(invsRes) ? prev : invsRes);
        } else {
          // Never wipe user's local/optimistic invoices if server returns empty array
          setInvoices(prev => prev.length > 0 ? prev : invsRes);
        }
      }

      // If a project is currently open in detail view, keep it synchronized in real-time
      const currentSelected = selectedProjectRef.current;
      if (currentSelected && Array.isArray(projsRes) && projsRes.length > 0) {
        const found = projsRes.find(p => p.id === currentSelected.id);
        if (found) {
          const projTasks = Array.isArray(tasksRes) ? tasksRes.filter(t => t.project_id === found.id) : (found.tasks || []);
          const is100 = Number(found.progress) >= 100;
          const nextProgress = is100 ? 100 : found.progress;
          const nextStatus = is100 ? 'completed' : found.status;

          setSelectedProject(prev => {
            if (!prev) return null;
            // Avoid creating new object reference if data hasn't changed
            if (
              prev.progress === nextProgress &&
              prev.status === nextStatus &&
              prev.title === found.title &&
              prev.description === found.description &&
              JSON.stringify(prev.tasks || []) === JSON.stringify(projTasks) &&
              JSON.stringify(prev.credentials || []) === JSON.stringify(found.credentials || [])
            ) {
              return prev;
            }
            return {
              ...found,
              progress: nextProgress,
              status: nextStatus,
              tasks: projTasks
            };
          });
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

  // Real-time cross-tab & cross-window messaging synchronization
  useEffect(() => {
    const handleSync = () => {
      try {
        const raw = localStorage.getItem('remotale_messages_v1');
        if (raw) {
          const parsed = JSON.parse(raw);
          if (Array.isArray(parsed)) {
            const clean = parsed.filter(m => m.id !== 'msg-1' && m.id !== 'msg-2' && m.id !== 'msg-3');
            setMessages(prev => {
              const prevStr = JSON.stringify(prev);
              const nextStr = JSON.stringify(clean);
              return prevStr === nextStr ? prev : clean;
            });
          }
        }
      } catch (err) {}
    };

    let bc;
    if (typeof window !== 'undefined' && 'BroadcastChannel' in window) {
      try {
        bc = new BroadcastChannel('remotale_messages_sync');
        bc.onmessage = (event) => {
          if (event.data && event.data.type === 'NEW_MESSAGE' && event.data.message) {
            const incoming = event.data.message;
            if (incoming.id === 'msg-1' || incoming.id === 'msg-2' || incoming.id === 'msg-3') return;
            setMessages(prev => {
              if (prev.some(m => m.id === incoming.id)) return prev;
              const next = [...prev, incoming];
              try {
                localStorage.setItem('remotale_messages_v1', JSON.stringify(next));
              } catch (e) {}
              return next;
            });
          } else {
            handleSync();
          }
        };
      } catch (e) {}
    }

    window.addEventListener('storage', handleSync);
    window.addEventListener('remotale_message_event', handleSync);

    return () => {
      if (bc) {
        try { bc.close(); } catch (e) {}
      }
      window.removeEventListener('storage', handleSync);
      window.removeEventListener('remotale_message_event', handleSync);
    };
  }, []);

  // Real-time cross-tab & cross-window invoices synchronization
  useEffect(() => {
    const handleInvoiceSync = () => {
      try {
        if (api.getStoredInvoices) {
          const stored = api.getStoredInvoices();
          if (Array.isArray(stored) && stored.length > 0) {
            setInvoices(prev => {
              const prevStr = JSON.stringify(prev);
              const nextStr = JSON.stringify(stored);
              return prevStr === nextStr ? prev : stored;
            });
          }
        }
      } catch (err) {}
    };

    let bc;
    if (typeof window !== 'undefined' && 'BroadcastChannel' in window) {
      try {
        bc = new BroadcastChannel('remotale_invoices_sync');
        bc.onmessage = () => {
          handleInvoiceSync();
        };
      } catch (e) {}
    }

    window.addEventListener('storage', handleInvoiceSync);
    window.addEventListener('remotale_invoice_event', handleInvoiceSync);

    return () => {
      if (bc) {
        try { bc.close(); } catch (e) {}
      }
      window.removeEventListener('storage', handleInvoiceSync);
      window.removeEventListener('remotale_invoice_event', handleInvoiceSync);
    };
  }, []);

  // Real-time synchronization for Tasks & Projects across windows and tabs
  useEffect(() => {
    const handleTaskSync = (e) => {
      try {
        const stored = api.getStoredTasks ? api.getStoredTasks() : [];
        if (Array.isArray(stored) && stored.length > 0) {
          setTasks(stored);
        }
      } catch (err) {}
    };

    const handleProjectSync = (e) => {
      try {
        const stored = api.getStoredProjects ? api.getStoredProjects() : [];
        if (Array.isArray(stored) && stored.length > 0) {
          setProjects(stored);
        }
      } catch (err) {}
    };

    let tasksBc;
    let projsBc;
    if (typeof window !== 'undefined' && 'BroadcastChannel' in window) {
      try {
        tasksBc = new BroadcastChannel('remotale_tasks_sync');
        tasksBc.onmessage = handleTaskSync;
        projsBc = new BroadcastChannel('remotale_projects_sync');
        projsBc.onmessage = handleProjectSync;
      } catch (e) {}
    }

    window.addEventListener('storage', handleTaskSync);
    window.addEventListener('remotale_task_event', handleTaskSync);
    window.addEventListener('remotale_project_event', handleProjectSync);

    return () => {
      if (tasksBc) {
        try { tasksBc.close(); } catch (e) {}
      }
      if (projsBc) {
        try { projsBc.close(); } catch (e) {}
      }
      window.removeEventListener('storage', handleTaskSync);
      window.removeEventListener('remotale_task_event', handleTaskSync);
      window.removeEventListener('remotale_project_event', handleProjectSync);
    };
  }, []);

  // Handle New Project Creation -> saves to PostgreSQL 'projects' table
  const handleCreateProject = async (projectData) => {
    try {
      const is100 = Number(projectData.progress) >= 100;
      const payload = {
        ...projectData,
        status: is100 ? 'completed' : (projectData.status || 'in-progress'),
        progress: is100 ? 100 : Number(projectData.progress),
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
  const handleUpdateProject = async (projectId, rawUpdates) => {
    const updates = { ...rawUpdates };
    if (Number(updates.progress) >= 100 && (!updates.status || updates.status === 'in-progress')) {
      updates.status = 'completed';
      updates.progress = 100;
    }
    // Optimistic local state update for instant UI feedback
    setProjects(prev => prev.map(p => p.id === projectId ? { ...p, ...updates } : p));
    if (selectedProject?.id === projectId) {
      setSelectedProject(prev => ({ ...prev, ...updates }));
    }

    try {
      const updated = await api.updateProject(projectId, updates);
      if (updated) {
        setProjects(prev => prev.map(p => p.id === projectId ? { ...p, ...updated } : p));
        if (selectedProject?.id === projectId) {
          setSelectedProject(prev => ({ ...prev, ...updated }));
        }
      }
      await loadData();
      return updated;
    } catch (err) {
      console.error('[Update Project Error]', err);
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

  // Invoices Management Handlers
  const handleCreateInvoice = async (invoicePayload, publishImmediately) => {
    const tempId = `inv-${Date.now()}`;
    const targetStatus = publishImmediately ? 'published' : (invoicePayload.status || 'draft');
    const targetPublished = Boolean(publishImmediately || invoicePayload.published);
    const fullPayload = {
      ...invoicePayload,
      status: targetStatus,
      published: targetPublished
    };
    const optimisticInv = {
      ...fullPayload,
      id: tempId
    };
    setInvoices(prev => [optimisticInv, ...prev.filter(i => i.id !== tempId)]);

    try {
      const created = await api.createInvoice(fullPayload);
      if (created) {
        setInvoices(prev => [created, ...prev.filter(i => i.id !== tempId && i.id !== created.id)]);
      }
      await loadData();
      return created || optimisticInv;
    } catch (err) {
      console.error('[Create Invoice Error]', err);
      return optimisticInv;
    }
  };

  const handlePublishInvoice = async (invoiceId) => {
    setInvoices(prev => prev.map(inv => inv.id === invoiceId ? { ...inv, status: 'published', published: true } : inv));
    try {
      const updated = await api.publishInvoice(invoiceId);
      if (updated) {
        setInvoices(prev => prev.map(inv => inv.id === invoiceId ? { ...inv, ...updated } : inv));
      }
      await loadData();
    } catch (err) {
      console.error('[Publish Invoice Error]', err);
    }
  };

  const handleMarkPaidInvoice = async (invoiceId) => {
    setInvoices(prev => prev.map(inv => inv.id === invoiceId ? { ...inv, status: 'paid' } : inv));
    try {
      const updated = await api.updateInvoiceStatus(invoiceId, 'paid');
      if (updated) {
        setInvoices(prev => prev.map(inv => inv.id === invoiceId ? { ...inv, ...updated } : inv));
      }
      await loadData();
    } catch (err) {
      console.error('[Mark Paid Invoice Error]', err);
    }
  };

  const handleDeleteInvoice = async (invoiceId) => {
    // Soft-archive in state so invoice record is never lost from system
    setInvoices(prev => prev.map(inv => inv.id === invoiceId ? { ...inv, status: 'archived', is_deleted: true } : inv));
    try {
      await api.deleteInvoice(invoiceId);
      await loadData();
    } catch (err) {
      console.error('[Delete Invoice Error]', err);
    }
  };

  const handleRestoreInvoice = async (invoiceId) => {
    setInvoices(prev => prev.map(inv => inv.id === invoiceId ? { ...inv, status: 'draft', is_deleted: false } : inv));
    try {
      const restored = await api.restoreInvoice(invoiceId);
      if (restored) {
        setInvoices(prev => prev.map(inv => inv.id === invoiceId ? { ...inv, ...restored } : inv));
      }
      await loadData();
    } catch (err) {
      console.error('[Restore Invoice Error]', err);
    }
  };

  const handleUpdateInvoice = async (invoiceId, invoicePayload) => {
    setInvoices(prev => prev.map(inv => inv.id === invoiceId ? { ...inv, ...invoicePayload } : inv));
    try {
      const updated = await api.updateInvoice(invoiceId, invoicePayload);
      if (updated) {
        setInvoices(prev => prev.map(inv => inv.id === invoiceId ? { ...inv, ...updated } : inv));
      }
      await loadData();
      return updated;
    } catch (err) {
      console.error('[Update Invoice Error]', err);
    }
  };

  // Persistent Messages Handler (Text + Photo attachments stored as database records)
  const handleSendMessage = async (msgPayload) => {
    const tempId = msgPayload.id || `msg-${Date.now()}-${Math.random().toString(36).substr(2, 6)}`;
    const effectiveSender = currentUserForPortal || user || (role === 'admin' ? { id: 'admin-1', name: 'Abdullah', role: 'admin' } : { id: 'client-awais', name: 'Awais', role: 'client' });

    const fullMsg = {
      ...msgPayload,
      id: tempId,
      project_id: msgPayload.project_id || msgPayload.projectId,
      projectId: msgPayload.projectId || msgPayload.project_id,
      sender_id: msgPayload.sender_id || effectiveSender?.id || (role === 'admin' ? 'admin-1' : 'client-awais'),
      senderId: msgPayload.sender_id || effectiveSender?.id || (role === 'admin' ? 'admin-1' : 'client-awais'),
      sender_name: msgPayload.sender_name || effectiveSender?.name || (role === 'admin' ? 'Abdullah' : 'Awais'),
      senderName: msgPayload.sender_name || effectiveSender?.name || (role === 'admin' ? 'Abdullah' : 'Awais'),
      sender_avatar: msgPayload.sender_avatar || effectiveSender?.avatar || '',
      senderAvatar: msgPayload.sender_avatar || effectiveSender?.avatar || '',
      content: (msgPayload.content || '').trim(),
      image_url: msgPayload.image_url || msgPayload.imageUrl || null,
      imageUrl: msgPayload.imageUrl || msgPayload.image_url || null,
      created_at: msgPayload.created_at || new Date().toISOString()
    };

    // 1. Optimistic state update & local persistence
    setMessages(prev => {
      const filtered = prev.filter(m => m.id !== tempId && m.id !== 'msg-1' && m.id !== 'msg-2' && m.id !== 'msg-3');
      const updated = [...filtered, fullMsg];
      try {
        localStorage.setItem('remotale_messages_v1', JSON.stringify(updated));
      } catch (e) {}
      return updated;
    });

    // 2. Cross-tab real-time broadcast
    try {
      if (typeof window !== 'undefined') {
        if ('BroadcastChannel' in window) {
          const bc = new BroadcastChannel('remotale_messages_sync');
          bc.postMessage({ type: 'NEW_MESSAGE', message: fullMsg });
          setTimeout(() => {
            try { bc.close(); } catch (e) {}
          }, 500);
        }
        window.dispatchEvent(new CustomEvent('remotale_message_event', { detail: fullMsg }));
      }
    } catch (e) {}

    // 3. Persist via API (which handles local storage + backend sync)
    try {
      const saved = await (api.createMessage ? api.createMessage(fullMsg) : api.sendMessage(fullMsg));
      if (saved && saved.id) {
        setMessages(prev => {
          const next = prev.map(m => m.id === tempId ? { ...fullMsg, ...saved } : m);
          try {
            localStorage.setItem('remotale_messages_v1', JSON.stringify(next));
          } catch (e) {}
          return next;
        });
      }
      return saved || fullMsg;
    } catch (err) {
      console.warn('Network message sync deferred, locally persisted:', err);
      return fullMsg;
    }
  };

  // Team Member Management Handlers
  const handleAddTeamMember = async (memberData) => {
    try {
      const created = await api.addTeamMember(memberData);
      setTeamMembers(prev => [...prev.filter(m => m.id !== created.id), created]);
      if (memberData.initialProjectId) {
        await handleUpdateProject(memberData.initialProjectId, {
          assigned_to: created.id,
          assigned_name: created.name,
          assigned_members: [{ id: created.id, name: created.name, role: created.role }]
        });
      }
      setIsAddTeamModalOpen(false);
      setNewMemberName('');
      setNewMemberEmail('');
      setNewMemberRole('Frontend & Shopify Engineer');
      setNewMemberPw('');
      setNewMemberInitialProj('');
      await loadData();
      return created;
    } catch (err) {
      alert(err.message || 'Failed to add team member');
      throw err;
    }
  };

  const handleDeleteTeamMember = async (memberId) => {
    if (!window.confirm('Are you sure you want to remove this team member?')) return;
    try {
      await api.deleteTeamMember(memberId);
      setTeamMembers(prev => prev.filter(m => m.id !== memberId));
      await loadData();
    } catch (err) {
      alert(err.message || 'Failed to remove team member');
    }
  };

  // Handle Add Task inside Project Detail View
  const handleAddTaskInDetail = async ({ projectId, clientId, title, dueDate }) => {
    try {
      const targetProjId = projectId || selectedProject?.id;
      const targetClientId = clientId || selectedProject?.client_id || selectedProject?.clientId;
      const created = await api.createTask({
        projectId: targetProjId,
        clientId: targetClientId,
        title,
        dueDate: dueDate || '25/10/2026'
      });
      setTasks(prev => [created, ...prev.filter(t => t.id !== created.id)]);

      const updateProjWithNewTask = (p) => {
        const nextTasks = [created, ...(p.tasks || []).filter(t => t.id !== created.id)];
        const total = nextTasks.length;
        const done = nextTasks.filter(t => t.completed).length;
        const newProgress = total > 0 ? Math.round((done / total) * 100) : 0;
        const newStatus = (total > 0 && done === total) ? 'completed' : 'in-progress';
        return {
          ...p,
          tasks: nextTasks,
          progress: newProgress,
          status: newStatus
        };
      };

      if (selectedProject) {
        setSelectedProject(prev => prev ? updateProjWithNewTask(prev) : null);
      }
      setProjects(prev => prev.map(p => p.id === targetProjId ? updateProjWithNewTask(p) : p));
      api.updateProject(targetProjId, { status: 'in-progress' }).catch(() => {});
      return created;
    } catch (err) {
      console.error('Error adding task:', err);
      throw err;
    }
  };

  // Handle Task Toggle -> updates PostgreSQL 'tasks' table and all local state optimistically
  const handleToggleTask = async (taskId, currentCompleted) => {
    const nextCompleted = !currentCompleted;
    const nowIso = new Date().toISOString();

    // 1. Optimistically update tasks state with completed_at
    setTasks(prev => prev.map(t => {
      if (t.id === taskId || (t.aliasId && t.aliasId === taskId)) {
        return {
          ...t,
          completed: nextCompleted,
          completed_at: nextCompleted ? (t.completed_at || nowIso) : null
        };
      }
      return t;
    }));

    const recalculateProj = (p) => {
      const updatedTasks = (p.tasks || []).map(t => {
        if (t.id === taskId || (t.aliasId && t.aliasId === taskId)) {
          return {
            ...t,
            completed: nextCompleted,
            completed_at: nextCompleted ? (t.completed_at || nowIso) : null
          };
        }
        return t;
      });
      const total = updatedTasks.length;
      const done = updatedTasks.filter(t => t.completed).length;
      const newProgress = total > 0 ? Math.round((done / total) * 100) : p.progress;
      const isCompleted = total > 0 && done === total;
      const newStatus = isCompleted ? 'completed' : 'in-progress';
      return {
        ...p,
        progress: newProgress,
        status: newStatus,
        tasks: updatedTasks
      };
    };

    // 2. Optimistically update selectedProject state and recalculate progress percentage
    setSelectedProject(prev => {
      if (!prev) return null;
      return recalculateProj(prev);
    });

    // 3. Optimistically update projects state with new tasks & progress
    let targetProjId = null;
    let targetStatus = 'in-progress';
    let targetProgress = 0;
    setProjects(prev => prev.map(p => {
      const hasTask = (p.tasks || []).some(t => t.id === taskId || (t.aliasId && t.aliasId === taskId));
      if (!hasTask) return p;
      const updated = recalculateProj(p);
      targetProjId = updated.id;
      targetStatus = updated.status;
      targetProgress = updated.progress;
      return updated;
    }));

    // 4. Send to backend database (api.toggleTask saves locally and in cloud)
    try {
      const updatedBackendTask = await api.toggleTask(taskId, nextCompleted);
      if (updatedBackendTask) {
        setTasks(prev => prev.map(t => (t.id === taskId || t.id === updatedBackendTask.id || (t.aliasId && t.aliasId === taskId)) ? { ...t, ...updatedBackendTask } : t));
        setSelectedProject(prev => {
          if (!prev) return null;
          return {
            ...prev,
            tasks: (prev.tasks || []).map(t => (t.id === taskId || t.id === updatedBackendTask.id || (t.aliasId && t.aliasId === taskId)) ? { ...t, ...updatedBackendTask } : t)
          };
        });
      }
      if (targetProjId) {
        api.updateProject(targetProjId, { status: targetStatus, progress: targetProgress }).catch(() => {});
      }
    } catch (err) {
      console.warn('Notice syncing task toggle:', err.message);
      // Dual-tier persistence holds state locally; do not revert
    }
  };

  // Handle Delete Task -> removes from PostgreSQL 'tasks' table and local state
  const handleDeleteTask = async (taskId) => {
    setTasks(prev => prev.filter(t => t.id !== taskId));

    let targetProjId = null;
    let targetStatus = 'in-progress';
    let targetProgress = 0;

    const recalculateWithoutTask = (p) => {
      const remaining = (p.tasks || []).filter(t => t.id !== taskId);
      const total = remaining.length;
      const done = remaining.filter(t => t.completed).length;
      const newProgress = total > 0 ? Math.round((done / total) * 100) : 0;
      const newStatus = (total > 0 && done === total) ? 'completed' : 'in-progress';
      return {
        ...p,
        tasks: remaining,
        progress: newProgress,
        status: newStatus
      };
    };

    setSelectedProject(prev => {
      if (!prev) return null;
      return recalculateWithoutTask(prev);
    });

    setProjects(prev => prev.map(p => {
      const hasTask = (p.tasks || []).some(t => t.id === taskId);
      if (!hasTask) return p;
      const updated = recalculateWithoutTask(p);
      targetProjId = updated.id;
      targetStatus = updated.status;
      targetProgress = updated.progress;
      return updated;
    }));

    try {
      await api.deleteTask(taskId);
      if (targetProjId) {
        api.updateProject(targetProjId, { status: targetStatus, progress: targetProgress }).catch(() => {});
      }
      api.getProjects().then(setProjects).catch(() => {});
    } catch (err) {
      console.error('Error deleting task:', err);
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
  // ==========================================
  // RENDER: TEAM VIEW (Super Admin + Team Members with Project Assignments)
  // ==========================================
  const renderTeamView = () => (
    <div style={{ padding: '28px 32px', maxWidth: '1140px', margin: '0 auto' }}>
      {/* Header */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '16px', marginBottom: '24px' }}>
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '6px' }}>
            <span style={{ fontSize: '26px' }}>👥</span>
            <h1 style={{ fontSize: '24px', fontWeight: 800, color: '#0f172a', margin: 0 }}>Agency Team & Members</h1>
          </div>
          <p style={{ fontSize: '13.5px', color: '#64748b', margin: 0, lineHeight: 1.6 }}>
            Manage agency team members. Assign client projects so members receive dedicated project messages, to-do lists, and workspaces.
          </p>
        </div>

        {isRealAdmin && (
          <button
            type="button"
            onClick={() => setIsAddTeamModalOpen(true)}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
              padding: '10px 18px',
              borderRadius: '10px',
              background: '#4f46e5',
              color: '#ffffff',
              border: 'none',
              fontWeight: 700,
              fontSize: '13.5px',
              cursor: 'pointer',
              boxShadow: '0 4px 12px rgba(79, 70, 229, 0.25)',
              transition: 'all 0.15s ease'
            }}
          >
            <span style={{ fontSize: '16px' }}>+</span>
            <span>Add Team Member</span>
          </button>
        )}
      </div>

      {/* Admin Highlight Banner */}
      <div style={{
        background: 'linear-gradient(135deg, #0f172a 0%, #1e1b4b 100%)',
        color: '#ffffff',
        borderRadius: '16px',
        padding: '24px 28px',
        boxShadow: '0 10px 25px -5px rgba(15, 23, 42, 0.25)',
        marginBottom: '28px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        flexWrap: 'wrap',
        gap: '20px'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '20px' }}>
          <LetterAvatar name="Abdullah" size={64} />
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
              ✉️ admin@remotale.com • 🌐 Universal Oversight of All Clients & Projects
            </p>
            <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
              <span style={{ background: 'rgba(255,255,255,0.12)', padding: '3px 9px', borderRadius: '6px', fontSize: '11.5px', color: '#e2e8f0', fontWeight: 500 }}>
                Full System Administration
              </span>
              <span style={{ background: 'rgba(255,255,255,0.12)', padding: '3px 9px', borderRadius: '6px', fontSize: '11.5px', color: '#e2e8f0', fontWeight: 500 }}>
                All {projects.length} Client Projects
              </span>
              <span style={{ background: 'rgba(255,255,255,0.12)', padding: '3px 9px', borderRadius: '6px', fontSize: '11.5px', color: '#e2e8f0', fontWeight: 500 }}>
                Universal Workspace Access
              </span>
            </div>
          </div>
        </div>

        <div style={{
          background: 'rgba(255, 255, 255, 0.08)',
          border: '1px solid rgba(255, 255, 255, 0.15)',
          borderRadius: '14px',
          padding: '14px 22px',
          textAlign: 'center'
        }}>
          <div style={{ fontSize: '26px', fontWeight: 800, color: '#38bdf8' }}>{teamMembers.length + 1}</div>
          <div style={{ fontSize: '11.5px', color: '#94a3b8', fontWeight: 600 }}>Total Agency Users</div>
        </div>
      </div>

      {/* Active Team Members Grid */}
      <div style={{ marginBottom: '32px' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '16px' }}>
          <h3 style={{ fontSize: '17px', fontWeight: 700, color: '#0f172a', margin: 0 }}>
            Active Team Members ({teamMembers.length})
          </h3>
          <span style={{ fontSize: '12.5px', color: '#64748b' }}>
            Click "Preview Portal" to view projects & tasks assigned to each member
          </span>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))', gap: '16px' }}>
          {teamMembers.map((member) => {
            const assignedProjects = projects.filter(p => (
              p.assigned_to === member.id ||
              p.assignedTo === member.id ||
              (Array.isArray(p.assigned_members) && p.assigned_members.some(m => m?.id === member.id || m === member.id))
            ));
            return (
              <div
                key={member.id}
                style={{
                  background: '#ffffff',
                  border: '1px solid #e2e8f0',
                  borderRadius: '14px',
                  padding: '20px',
                  boxShadow: '0 1px 3px rgba(0,0,0,0.04)',
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '14px',
                  transition: 'all 0.2s ease'
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                    <LetterAvatar name={member.name} size={44} />
                    <div>
                      <h4 style={{ margin: '0 0 2px 0', fontSize: '15px', fontWeight: 700, color: '#0f172a' }}>{member.name}</h4>
                      <span style={{ fontSize: '11.5px', color: '#6366f1', fontWeight: 600 }}>{member.role || 'Team Member'}</span>
                    </div>
                  </div>
                  <span style={{ fontSize: '11px', background: '#ecfdf5', color: '#059669', padding: '3px 8px', borderRadius: '12px', fontWeight: 600 }}>
                    Active
                  </span>
                </div>

                <div style={{ fontSize: '12px', color: '#64748b' }}>
                  ✉️ {member.email}
                </div>

                {/* Assigned Projects */}
                <div>
                  <div style={{ fontSize: '11.5px', fontWeight: 600, color: '#475569', marginBottom: '6px' }}>
                    Assigned Projects ({assignedProjects.length}):
                  </div>
                  {assignedProjects.length === 0 ? (
                    <div style={{ fontSize: '11.5px', color: '#94a3b8', fontStyle: 'italic' }}>
                      No projects assigned yet
                    </div>
                  ) : (
                    <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px' }}>
                      {assignedProjects.map(proj => (
                        <span
                          key={proj.id}
                          onClick={() => handleSelectProject(proj)}
                          style={{
                            fontSize: '11px',
                            background: '#eff6ff',
                            color: '#1d4ed8',
                            border: '1px solid #bfdbfe',
                            padding: '3px 8px',
                            borderRadius: '6px',
                            cursor: 'pointer',
                            fontWeight: 500
                          }}
                          title="Open project workspace"
                        >
                          📌 {proj.title}
                        </span>
                      ))}
                    </div>
                  )}
                </div>

                {/* Actions */}
                <div style={{ display: 'flex', gap: '8px', marginTop: 'auto', paddingTop: '10px', borderTop: '1px solid #f1f5f9' }}>
                  <button
                    type="button"
                    onClick={() => {
                      setRole('member');
                      setPreviewMemberId(member.id);
                      setSelectedProject(null);
                    }}
                    style={{
                      flex: 1,
                      padding: '7px 12px',
                      borderRadius: '8px',
                      border: '1px solid #cbd5e1',
                      background: '#f8fafc',
                      color: '#0f172a',
                      fontSize: '12px',
                      fontWeight: 600,
                      cursor: 'pointer'
                    }}
                  >
                    ⚡ Preview Member Portal
                  </button>
                  {isRealAdmin && (
                    <button
                      type="button"
                      onClick={() => handleDeleteTeamMember(member.id)}
                      style={{
                        padding: '7px 10px',
                        borderRadius: '8px',
                        border: '1px solid #fee2e2',
                        background: '#fef2f2',
                        color: '#ef4444',
                        fontSize: '12px',
                        fontWeight: 600,
                        cursor: 'pointer'
                      }}
                      title="Remove Member"
                    >
                      🗑️
                    </button>
                  )}
                </div>
              </div>
            );
          })}
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
            <h4 style={{ margin: 0, fontSize: '14px', fontWeight: 700, color: '#0f172a' }}>Role Synchronization</h4>
          </div>
          <p style={{ margin: 0, fontSize: '12.5px', color: '#64748b', lineHeight: 1.5 }}>
            Projects assigned to members immediately appear in their workspace with live messages, to-do lists, and progress tracking.
          </p>
        </div>

        <div style={{ background: '#ffffff', border: '1px solid #e2e8f0', borderRadius: '14px', padding: '20px', boxShadow: '0 1px 3px rgba(0,0,0,0.04)' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '8px' }}>
            <span style={{ fontSize: '20px' }}>🛡️</span>
            <h4 style={{ margin: 0, fontSize: '14px', fontWeight: 700, color: '#0f172a' }}>Multi-Client Isolation</h4>
          </div>
          <p style={{ margin: 0, fontSize: '12.5px', color: '#64748b', lineHeight: 1.5 }}>
            Clients only see their own assigned projects and nearest deadlines. Team member assignments remain cleanly organized.
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
            <span className="remotale-sidebar-brand-name">ByteForge Suite</span>
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
              className={`remotale-nav-item ${activeTab === 'billing' || activeTab === 'invoices' ? 'active' : ''}`}
              onClick={() => {
                setSelectedProject(null);
                setActiveTab('invoices');
              }}
            >
              <BillingIcon size={17} color={activeTab === 'billing' || activeTab === 'invoices' ? '#4F46E5' : '#64748B'} />
              <span>Invoices</span>
            </button>
          </nav>
        </div>

        {/* Bottom User Section with Dedicated Logout */}
        <div style={{ marginTop: 'auto', padding: '14px', borderTop: '1px solid #e2e8f0', background: '#fafafa' }}>
          <div className="remotale-sidebar-user-pill" style={{ marginBottom: '10px' }}>
            <div className="remotale-sidebar-avatar-circle">{currentUserForPortal?.name?.[0] || (role === 'member' ? 'M' : 'C')}</div>
            <div className="remotale-sidebar-user-info" style={{ flex: 1, minWidth: 0 }}>
              <span className="remotale-sidebar-user-name" style={{ overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', display: 'block' }}>{currentUserForPortal?.name || (role === 'member' ? 'Team Member' : 'Client')}</span>
              <span className="remotale-sidebar-user-role">{role === 'member' ? (currentMemberUser?.role || 'Team Member') : (currentClientUser?.company || 'Client')}</span>
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
            onDeleteTask={handleDeleteTask}
            onUpdateProject={handleUpdateProject}
            currentUser={currentUserForPortal}
            onLogout={onLogout}
            messages={messages}
            onSendMessage={handleSendMessage}
            teamMembers={teamMembers}
            isAdmin={role === 'admin'}
            onOpenProgressPdf={(p) => {
              const targetCid = p?.clientId || p?.client_id || (role === 'client' ? previewClientId : 'client-awais');
              setProgressPdfClientId(targetCid);
              setIsProgressPdfModalOpen(true);
            }}
          />
        ) : activeTab === 'projects' ? (
          <MyProjectsView
            projects={visibleProjects}
            onSelectProject={handleSelectProject}
            onOpenAddProject={() => {
              setProjectToEdit(null);
              setIsNewProjectModalOpen(true);
            }}
            onEditProject={(proj) => {
              setProjectToEdit(proj);
              setIsNewProjectModalOpen(true);
            }}
            onDeleteProject={handleDeleteProject}
            currentUser={currentUserForPortal}
            onLogout={onLogout}
            onOpenProgressPdf={() => {
              const targetCid = role === 'client' ? previewClientId : 'client-awais';
              setProgressPdfClientId(targetCid);
              setIsProgressPdfModalOpen(true);
            }}
          />
        ) : (activeTab === 'invoices' || activeTab === 'billing') ? (
          <InvoicesView
            invoices={invoices}
            clients={clients}
            projects={visibleProjects}
            currentUser={currentUserForPortal}
            isAdmin={false}
            onCreateInvoice={handleCreateInvoice}
            onPublishInvoice={handlePublishInvoice}
            onMarkPaidInvoice={handleMarkPaidInvoice}
            onDeleteInvoice={handleDeleteInvoice}
            onRestoreInvoice={handleRestoreInvoice}
            onUpdateInvoice={handleUpdateInvoice}
          />
        ) : activeTab === 'tasks' ? (
          <TasksView
            tasks={visibleTasks}
            projects={visibleProjects}
            onToggleTask={handleToggleTask}
            onAddTask={handleAddTaskInDetail}
            onDeleteTask={handleDeleteTask}
            onSelectProject={handleSelectProject}
            currentUser={currentUserForPortal}
          />
        ) : activeTab === 'messages' ? (
          <MessagesView
            projects={visibleProjects}
            messages={messages}
            currentUser={currentUserForPortal}
            isAdmin={role === 'admin'}
            onSendMessage={handleSendMessage}
            teamMembers={teamMembers}
            clients={clients}
            onSelectProject={handleSelectProject}
            onOpenProject={handleSelectProject}
          />
        ) : activeTab === 'files' ? (
          <ComingSoonView
            section={activeTab}
            onBackToProjects={() => {
              setSelectedProject(null);
              setActiveTab('projects');
            }}
          />
        ) : activeTab === 'team' ? (
          renderTeamView()
        ) : (
          <>
        {/* Top Header */}
        <div className="remotale-main-header">
          <div className="remotale-main-greeting">
            <h1>Hello, {currentUserForPortal?.name?.split(' ')[0] || (role === 'member' ? 'Member' : 'Client')} 👋</h1>
            <p>{role === 'member' ? "Here's an overview of your assigned projects, tasks, and discussions." : "Here's an overview of your projects."}</p>
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
              <div className="remotale-stat-val">{visibleProjects.filter(p => p.status === 'in-progress' && Number(p.progress || 0) < 100).length}</div>
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
              <div className="remotale-stat-val">{visibleProjects.filter(p => p.status === 'completed' || Number(p.progress || 0) >= 100).length}</div>
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
                  onClick={() => handleSelectProject(proj)}
                >
                  <div className="remotale-proj-top">
                    <div className={`remotale-proj-icon-box ${getProjectIconBg(idx)}`}>
                      {getProjectIcon(idx)}
                    </div>
                    <div className="remotale-proj-title-row">
                      <span className="remotale-proj-title">{proj.title}</span>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                        <span className={`remotale-status-pill ${(proj.status === 'completed' || Number(proj.progress) >= 100) ? 'completed' : proj.status}`}>
                          {(proj.status === 'completed' || Number(proj.progress) >= 100) ? 'Completed' : (proj.status === 'under-review' ? 'Under Review' : 'In Progress')}
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
                      <span>Due {proj.deadline || formattedCurrentDate}</span>
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
                        <span className="remotale-msg-time">{formatTimeAgo(msg.created_at) || 'Recently'}</span>
                      </div>
                      <span className="remotale-msg-snippet">{msg.content}</span>
                    </div>
                  </div>
                ))
              )}
            </section>

            {/* Recent Activity Section for Client */}
            <section className="remotale-card-container">
              <div className="remotale-card-header">
                <div>
                  <h3 style={{ margin: 0, fontSize: '15px', fontWeight: 700, color: '#0f172a' }}>Recent Activity</h3>
                  <span style={{ fontSize: '11px', color: '#64748b' }}>Live project timeline by Admin</span>
                </div>
                <span style={{ fontSize: '11px', fontWeight: 700, color: '#16a34a', background: '#dcfce7', padding: '2px 8px', borderRadius: '999px' }}>
                  Live Feed
                </span>
              </div>

              {teamActivities.length === 0 ? (
                <div className="remotale-empty-card" style={{ padding: '20px' }}>
                  <p>No recent activity recorded yet.</p>
                </div>
              ) : (
                teamActivities.slice(0, 4).map(act => (
                  <div key={act.id} className="remotale-message-item" style={{ padding: '8px 0', borderBottom: '1px solid #f8fafc' }}>
                    <LetterAvatar name={act.member_name || 'Abdullah'} size={32} />
                    <div className="remotale-msg-body">
                      <div className="remotale-msg-header">
                        <span className="remotale-msg-sender">{act.member_name}</span>
                        <span className="remotale-msg-time">{formatTimeAgo(act.created_at) || act.time || 'Recently'}</span>
                      </div>
                      <span style={{ fontSize: '12.5px', fontWeight: 600, color: '#1e293b' }}>{act.action}</span>
                      <span style={{ fontSize: '11.5px', color: '#4f46e5', fontWeight: 600, marginTop: '2px' }}>{act.details}</span>
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
            <span className="remotale-sidebar-brand-name">ByteForge Suite</span>
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
              onClick={() => {
                setSelectedProject(null);
                setActiveTab('invoices');
              }}
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
            onDeleteTask={handleDeleteTask}
            onUpdateProject={handleUpdateProject}
            currentUser={user}
            onLogout={onLogout}
            messages={messages}
            onSendMessage={handleSendMessage}
            teamMembers={teamMembers}
            isAdmin={true}
            onOpenProgressPdf={(p) => {
              const targetCid = p?.clientId || p?.client_id || (role === 'client' ? previewClientId : 'client-awais');
              setProgressPdfClientId(targetCid);
              setIsProgressPdfModalOpen(true);
            }}
          />
        ) : activeTab === 'projects' ? (
          <MyProjectsView
            projects={projects}
            onSelectProject={handleSelectProject}
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
            onOpenProgressPdf={() => {
              const targetCid = role === 'client' ? previewClientId : 'client-awais';
              setProgressPdfClientId(targetCid);
              setIsProgressPdfModalOpen(true);
            }}
          />
        ) : activeTab === 'invoices' ? (
          <InvoicesView
            invoices={invoices}
            clients={clients}
            projects={projects}
            currentUser={user}
            isAdmin={true}
            onCreateInvoice={handleCreateInvoice}
            onPublishInvoice={handlePublishInvoice}
            onMarkPaidInvoice={handleMarkPaidInvoice}
            onDeleteInvoice={handleDeleteInvoice}
            onRestoreInvoice={handleRestoreInvoice}
            onUpdateInvoice={handleUpdateInvoice}
          />
        ) : activeTab === 'tasks' ? (
          <TasksView
            tasks={visibleTasks}
            projects={visibleProjects}
            onToggleTask={handleToggleTask}
            onAddTask={handleAddTaskInDetail}
            onDeleteTask={handleDeleteTask}
            onSelectProject={handleSelectProject}
            currentUser={user}
          />
        ) : activeTab === 'messages' ? (
          <MessagesView
            projects={projects}
            messages={messages}
            currentUser={user || { id: 'admin-1', name: 'Abdullah', role: 'admin' }}
            isAdmin={true}
            onSendMessage={handleSendMessage}
            teamMembers={teamMembers}
            clients={clients}
            onSelectProject={handleSelectProject}
            onOpenProject={handleSelectProject}
          />
        ) : activeTab === 'files' ? (
          <ComingSoonView
            section={activeTab}
            onBackToProjects={() => {
              setSelectedProject(null);
              setActiveTab('projects');
            }}
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
                value={role === 'admin' ? 'admin' : (role === 'member' ? `member-${previewMemberId}` : previewClientId)}
                onChange={(e) => {
                  const val = e.target.value;
                  if (val === 'admin') {
                    setRole('admin');
                  } else if (val.startsWith('member-')) {
                    setRole('member');
                    setPreviewMemberId(val.replace('member-', ''));
                  } else {
                    setRole('client');
                    setPreviewClientId(val);
                  }
                  setSelectedProject(null);
                }}
                style={{
                  background: role === 'admin' ? '#0f172a' : (role === 'member' ? '#047857' : '#4338ca'),
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
                title="Switch between Super Admin, Team Member portals, and Client Portals"
              >
                <option value="admin" style={{ background: '#0f172a', color: '#ffffff' }}>👑 Super Admin (All {projects.length} Projects)</option>
                <optgroup label="── Team Members ──" style={{ background: '#064e3b', color: '#a7f3d0' }}>
                  {teamMembers.map(mem => {
                    const count = projects.filter(p => (p.assigned_to === mem.id || p.assignedTo === mem.id || (Array.isArray(p.assigned_members) && p.assigned_members.some(m => m.id === mem.id || m === mem.id)))).length;
                    return (
                      <option key={mem.id} value={`member-${mem.id}`} style={{ background: '#0f172a', color: '#ffffff' }}>
                        ⚡ Team Member: {mem.name} ({count} {count === 1 ? 'Project' : 'Projects'})
                      </option>
                    );
                  })}
                </optgroup>
                <optgroup label="── Clients ──" style={{ background: '#1e1b4b', color: '#a5b4fc' }}>
                  {clients.map(cl => {
                    const count = projects.filter(p => (p.client_id === cl.id || p.clientId === cl.id)).length;
                    return (
                      <option key={cl.id} value={cl.id} style={{ background: '#0f172a', color: '#ffffff' }}>
                        👤 Client Portal: {cl.name} ({count} {count === 1 ? 'Project' : 'Projects'})
                      </option>
                    );
                  })}
                </optgroup>
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

            <button
              type="button"
              className="remotale-btn-progress-pdf"
              onClick={() => {
                const targetCid = role === 'client' ? previewClientId : 'client-awais';
                setProgressPdfClientId(targetCid);
                setIsProgressPdfModalOpen(true);
              }}
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '6px',
                padding: '8px 14px',
                fontSize: '12px',
                fontWeight: 700,
                borderRadius: '8px',
                background: 'linear-gradient(135deg, #0284c7 0%, #0369a1 100%)',
                color: '#ffffff',
                border: 'none',
                cursor: 'pointer',
                boxShadow: '0 2px 8px rgba(2, 132, 199, 0.28)',
                transition: 'all 0.15s ease'
              }}
              title="Create, customize pending items, and print client project progress PDF"
            >
              <span>📄</span>
              <span>Progress PDF Report</span>
            </button>

            <div style={{ position: 'relative' }} ref={datePickerRef}>
              <button
                type="button"
                className="remotale-date-filter-btn"
                onClick={() => setIsDatePickerOpen(prev => !prev)}
                title="Filter by Date"
              >
                <span>{dateFilterLabel}</span>
              </button>

              {isDatePickerOpen && (
                <div className="remotale-datepicker-dropdown">
                  <div className="remotale-datepicker-header">
                    <span>Date Filter</span>
                  </div>
                  <button
                    type="button"
                    className={`remotale-datepicker-item ${dateFilterOption === 'today' ? 'active' : ''}`}
                    onClick={() => {
                      setDateFilterOption('today');
                      setIsDatePickerOpen(false);
                    }}
                  >
                    <span>📅 Today ({formattedCurrentDate})</span>
                  </button>
                  <button
                    type="button"
                    className={`remotale-datepicker-item ${dateFilterOption === 'this-week' ? 'active' : ''}`}
                    onClick={() => {
                      setDateFilterOption('this-week');
                      setIsDatePickerOpen(false);
                    }}
                  >
                    <span>🗓️ This Week</span>
                  </button>
                  <button
                    type="button"
                    className={`remotale-datepicker-item ${dateFilterOption === 'this-month' ? 'active' : ''}`}
                    onClick={() => {
                      setDateFilterOption('this-month');
                      setIsDatePickerOpen(false);
                    }}
                  >
                    <span>📆 This Month</span>
                  </button>
                  <div className="remotale-datepicker-divider" />
                  <div className="remotale-datepicker-custom">
                    <label>Pick Custom Date:</label>
                    <input
                      type="date"
                      value={customDate}
                      onChange={(e) => {
                        setCustomDate(e.target.value);
                        setDateFilterOption('custom');
                        setIsDatePickerOpen(false);
                      }}
                    />
                  </div>
                </div>
              )}
            </div>

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
              <div className="remotale-stat-val">{stats.totalClients || clients.length || 3}</div>
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
              <div className="remotale-stat-val">{stats.totalProjects || visibleProjects.length || 10}</div>
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
              <div className="remotale-stat-val">{stats.inProgress || visibleProjects.filter(p => p.status === 'in-progress' && Number(p.progress || 0) < 100).length || 0}</div>
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
              <div className="remotale-stat-val">{stats.completed || visibleProjects.filter(p => p.status === 'completed' || Number(p.progress || 0) >= 100).length || 0}</div>
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

            {visibleProjects.length === 0 ? (
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
              visibleProjects.slice(0, 3).map((proj, idx) => (
                <div
                  key={proj.id}
                  className="remotale-admin-list-item"
                  style={{ cursor: 'pointer' }}
                  onClick={() => handleSelectProject(proj)}
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
                    <span className={`remotale-status-pill ${(proj.status === 'completed' || Number(proj.progress) >= 100) ? 'completed' : proj.status}`}>
                      {(proj.status === 'completed' || Number(proj.progress) >= 100) ? 'Completed' : (proj.status === 'under-review' ? 'Under Review' : 'In Progress')}
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

            {visibleProjects.length === 0 ? (
              <div className="remotale-empty-card"><p>No upcoming deadlines.</p></div>
            ) : (
              visibleProjects.slice(0, 3).map((p, i) => (
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
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <button
                      type="button"
                      onClick={() => {
                        setProgressPdfClientId(c.id);
                        setIsProgressPdfModalOpen(true);
                      }}
                      style={{
                        padding: '4px 8px',
                        background: '#f0f9ff',
                        color: '#0284c7',
                        border: '1px solid #bae6fd',
                        borderRadius: '6px',
                        fontSize: '11px',
                        fontWeight: 700,
                        cursor: 'pointer',
                        display: 'inline-flex',
                        alignItems: 'center',
                        gap: '4px'
                      }}
                      title={`Export Progress PDF Report for ${c.name}`}
                    >
                      <span>📄</span>
                      <span>Progress PDF</span>
                    </button>
                    <span style={{ color: '#94a3b8', cursor: 'pointer', fontSize: '15px' }}>⋮</span>
                  </div>
                </div>
              ))
            )}
          </section>

          {/* 4. Team Activity */}
          <section className="remotale-card-container">
            <div className="remotale-card-header">
              <div>
                <h3 style={{ margin: 0 }}>Team Activity</h3>
                <span style={{ fontSize: '11px', color: '#64748b' }}>Recent actions by team & clients</span>
              </div>
              <span style={{ fontSize: '11px', fontWeight: 700, color: '#16a34a', background: '#dcfce7', padding: '2px 8px', borderRadius: '999px' }}>
                Live Feed
              </span>
            </div>

            {teamActivities.length === 0 ? (
              <div className="remotale-empty-card" style={{ padding: '20px' }}>
                <p>No activity recorded yet.</p>
              </div>
            ) : (
              teamActivities.slice(0, 5).map(act => (
                <div key={act.id} className="remotale-admin-list-item" style={{ padding: '10px 0', borderBottom: '1px solid #f1f5f9' }}>
                  <div className="remotale-admin-item-left">
                    <LetterAvatar name={act.member_name || 'Abdullah'} size={34} />
                    <div className="remotale-admin-item-text">
                      <span className="remotale-admin-item-title">
                        <strong>{act.member_name}</strong> {act.action}
                      </span>
                      <span className="remotale-admin-item-sub" style={{ color: '#4f46e5', fontWeight: 600 }}>{act.details}</span>
                    </div>
                  </div>
                  <span style={{ fontSize: '11px', color: '#94a3b8', whiteSpace: 'nowrap' }}>
                    {formatTimeAgo(act.created_at) || act.time || 'Recently'}
                  </span>
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
              onDeleteTask={handleDeleteTask}
              onUpdateProject={handleUpdateProject}
              currentUser={user}
              onLogout={onLogout}
              onOpenProgressPdf={(p) => {
                const targetCid = p?.clientId || p?.client_id || (role === 'client' ? previewClientId : 'client-awais');
                setProgressPdfClientId(targetCid);
                setIsProgressPdfModalOpen(true);
              }}
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
              projects={visibleProjects}
              onSelectProject={handleSelectProject}
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
              onOpenProgressPdf={() => {
                const targetCid = role === 'client' ? previewClientId : 'client-awais';
                setProgressPdfClientId(targetCid);
                setIsProgressPdfModalOpen(true);
              }}
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

    if (activeTab === 'invoices') {
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

            <InvoicesView
              invoices={invoices}
              clients={clients}
              projects={visibleProjects}
              currentUser={user}
              isAdmin={true}
              onCreateInvoice={handleCreateInvoice}
              onPublishInvoice={handlePublishInvoice}
              onMarkPaidInvoice={handleMarkPaidInvoice}
              onDeleteInvoice={handleDeleteInvoice}
              onRestoreInvoice={handleRestoreInvoice}
              onUpdateInvoice={handleUpdateInvoice}
            />

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
                  setActiveTab('invoices');
                }}
              >
                <BillingIcon size={18} color="#4F46E5" />
                <span>Invoices</span>
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
          <div className="remotale-mobile-greeting-row">
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
              <button
                type="button"
                className="remotale-date-filter-btn"
                style={{ padding: '4px 8px', fontSize: '11px' }}
                onClick={() => setIsDatePickerOpen(prev => !prev)}
              >
                <span>{dateFilterLabel}</span>
              </button>
            </div>
          </div>

          {/* 4 Stat Cards with Percentage Badges */}
          <div className="remotale-mobile-stats-grid">
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
                <div style={{ fontSize: '18px', fontWeight: 800, color: '#0f172a' }}>{stats.inProgress || projects.filter(p => p.status === 'in-progress' && Number(p.progress || 0) < 100).length}</div>
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
                <div style={{ fontSize: '18px', fontWeight: 800, color: '#0f172a' }}>{stats.completed || projects.filter(p => p.status === 'completed' || Number(p.progress || 0) >= 100).length}</div>
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

          {/* Team Activity Tab Content for Admin Mobile */}
          {mobileSubTab === 'team-activity' && (
            <section className="remotale-card-container" style={{ padding: '14px', marginBottom: '12px' }}>
              <div className="remotale-card-header" style={{ marginBottom: '10px' }}>
                <h3 style={{ fontSize: '13.5px' }}>Team Activity Feed</h3>
                <span style={{ fontSize: '10px', color: '#16a34a', fontWeight: 700, background: '#dcfce7', padding: '2px 6px', borderRadius: '999px' }}>Live</span>
              </div>
              {teamActivities.length === 0 ? (
                <div style={{ padding: '12px 0', textAlign: 'center', color: '#94a3b8', fontSize: '12px' }}>No activity recorded</div>
              ) : (
                teamActivities.map((act, idx) => (
                  <div key={act.id} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '8px 0', borderBottom: idx < teamActivities.length - 1 ? '1px solid #f1f5f9' : 'none' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                      <LetterAvatar name={act.member_name || 'Abdullah'} size={28} />
                      <div>
                        <div style={{ fontSize: '11.5px', fontWeight: 700, color: '#0f172a' }}>{act.member_name} {act.action}</div>
                        <div style={{ fontSize: '9.5px', color: '#4f46e5', fontWeight: 600 }}>{act.details}</div>
                      </div>
                    </div>
                    <span style={{ fontSize: '9.5px', color: '#94a3b8', whiteSpace: 'nowrap' }}>{formatTimeAgo(act.created_at) || act.time || 'Recently'}</span>
                  </div>
                ))
              )}
            </section>
          )}

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
                  onClick={() => handleSelectProject(p)}
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
                      <span className={`remotale-status-pill ${(p.status === 'completed' || Number(p.progress) >= 100) ? 'completed' : p.status}`} style={{ fontSize: '10px', padding: '2px 8px' }}>
                        {(p.status === 'completed' || Number(p.progress) >= 100) ? 'Completed' : (p.status === 'under-review' ? 'Under Review' : 'In Progress')}
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
                    <span style={{ fontSize: '8.5px', color: '#94a3b8' }}>{formatTimeAgo(act.created_at) || act.time || 'Recently'}</span>
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
              onDeleteTask={handleDeleteTask}
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
                  setActiveTab('messages');
                }}
              >
                <MessagesIcon size={18} color="#64748B" />
                <span>Messages</span>
              </button>
              <button
                type="button"
                className={`remotale-bottom-nav-item ${(activeTab === 'invoices' || activeTab === 'billing') ? 'active' : ''}`}
                onClick={() => {
                  setSelectedProject(null);
                  setActiveTab('invoices');
                }}
              >
                <BillingIcon size={18} color="#64748B" />
                <span>Invoices</span>
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
              onSelectProject={handleSelectProject}
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
                  setActiveTab('messages');
                }}
              >
                <MessagesIcon size={18} color="#64748B" />
                <span>Messages</span>
              </button>
              <button
                type="button"
                className={`remotale-bottom-nav-item ${(activeTab === 'invoices' || activeTab === 'billing') ? 'active' : ''}`}
                onClick={() => {
                  setSelectedProject(null);
                  setActiveTab('invoices');
                }}
              >
                <BillingIcon size={18} color="#64748B" />
                <span>Invoices</span>
              </button>
            </div>
          </div>
        </div>
      );
    }

    if (activeTab === 'tasks' || activeTab === 'messages' || activeTab === 'files') {
      return (
        <div className="remotale-mobile-wrapper">
          <div className="remotale-mobile-card">
            <div className="remotale-mobile-header">
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <RemotaleLogo size={22} />
                <span style={{ fontWeight: 800, fontSize: '17px', color: '#0f172a' }}>Remotale</span>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <div style={{ position: 'relative' }}>
                  <div
                    style={{ display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer' }}
                    onClick={() => setIsProfileMenuOpen(!isProfileMenuOpen)}
                  >
                    <div className="remotale-header-avatar-circle" style={{ width: '32px', height: '32px', fontSize: '13px', background: '#EDE9FE', color: '#7C3AED' }}>
                      <span>{currentClientUser?.name ? currentClientUser.name[0].toUpperCase() : 'C'}</span>
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

            {activeTab === 'tasks' ? (
              <TasksView
                tasks={visibleTasks}
                projects={visibleProjects}
                onToggleTask={handleToggleTask}
                onAddTask={handleAddTaskInDetail}
                onDeleteTask={handleDeleteTask}
                onSelectProject={handleSelectProject}
                currentUser={currentUserForPortal}
              />
            ) : activeTab === 'messages' ? (
              <MessagesView
                projects={visibleProjects}
                messages={messages}
                currentUser={currentUserForPortal}
                isAdmin={false}
                onSendMessage={handleSendMessage}
                teamMembers={teamMembers}
                clients={clients}
                onSelectProject={handleSelectProject}
                onOpenProject={handleSelectProject}
              />
            ) : (
              <ComingSoonView
                section={activeTab}
                onBackToProjects={() => {
                  setSelectedProject(null);
                  setActiveTab('projects');
                }}
              />
            )}

            <div className="remotale-mobile-bottom-nav">
              <button
                type="button"
                className={`remotale-bottom-nav-item ${activeTab === 'home' ? 'active' : ''}`}
                onClick={() => {
                  setSelectedProject(null);
                  setActiveTab('home');
                }}
              >
                <HomeIcon size={18} color={activeTab === 'home' ? '#4F46E5' : '#64748B'} />
                <span>Home</span>
              </button>
              <button
                type="button"
                className={`remotale-bottom-nav-item ${activeTab === 'projects' ? 'active' : ''}`}
                onClick={() => {
                  setSelectedProject(null);
                  setActiveTab('projects');
                }}
              >
                <FolderIcon size={18} color={activeTab === 'projects' ? '#4F46E5' : '#64748B'} />
                <span>Projects</span>
              </button>
              <button
                type="button"
                className={`remotale-bottom-nav-item ${activeTab === 'messages' ? 'active' : ''}`}
                onClick={() => {
                  setSelectedProject(null);
                  setActiveTab('messages');
                }}
              >
                <MessagesIcon size={18} color={activeTab === 'messages' ? '#4F46E5' : '#64748B'} />
                <span>Messages</span>
              </button>
              <button
                type="button"
                className={`remotale-bottom-nav-item ${(activeTab === 'invoices' || activeTab === 'billing') ? 'active' : ''}`}
                onClick={() => {
                  setSelectedProject(null);
                  setActiveTab('invoices');
                }}
              >
                <BillingIcon size={18} color={(activeTab === 'invoices' || activeTab === 'billing') ? '#4F46E5' : '#64748B'} />
                <span>Invoices</span>
              </button>
            </div>
          </div>
        </div>
      );
    }

    if (activeTab === 'invoices' || activeTab === 'billing') {
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
                    style={{ display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer' }}
                    onClick={() => setIsProfileMenuOpen(!isProfileMenuOpen)}
                  >
                    <div className="remotale-header-avatar-circle" style={{ width: '32px', height: '32px', fontSize: '13px', background: '#EDE9FE', color: '#7C3AED' }}>
                      <span>{currentClientUser?.name ? currentClientUser.name[0].toUpperCase() : 'C'}</span>
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

            <InvoicesView
              invoices={invoices}
              clients={clients}
              projects={visibleProjects}
              currentUser={currentClientUser}
              isAdmin={false}
              onCreateInvoice={handleCreateInvoice}
              onPublishInvoice={handlePublishInvoice}
              onMarkPaidInvoice={handleMarkPaidInvoice}
              onDeleteInvoice={handleDeleteInvoice}
              onRestoreInvoice={handleRestoreInvoice}
              onUpdateInvoice={handleUpdateInvoice}
            />

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
                  setActiveTab('projects');
                }}
              >
                <FolderIcon size={18} color="#64748B" />
                <span>Projects</span>
              </button>
              <button
                type="button"
                className="remotale-bottom-nav-item"
                onClick={() => {
                  setSelectedProject(null);
                  setActiveTab('messages');
                }}
              >
                <MessagesIcon size={18} color="#64748B" />
                <span>Messages</span>
              </button>
              <button
                type="button"
                className="remotale-bottom-nav-item active"
                onClick={() => {
                  setSelectedProject(null);
                  setActiveTab('invoices');
                }}
              >
                <BillingIcon size={18} color="#4F46E5" />
                <span>Invoices</span>
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
            <div className="remotale-mobile-greeting-row">
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
            <div className="remotale-mobile-stats-grid">
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
                <div style={{ fontSize: '18px', fontWeight: 800, color: '#0f172a' }}>{visibleProjects.filter(p => p.status === 'in-progress' && Number(p.progress || 0) < 100).length}</div>
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
                <div style={{ fontSize: '18px', fontWeight: 800, color: '#0f172a' }}>{visibleProjects.filter(p => p.status === 'completed' || Number(p.progress || 0) >= 100).length}</div>
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

            {/* Subtab 1: Projects List */}
            {mobileSubTab === 'my-projects' && (
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
                      onClick={() => handleSelectProject(proj)}
                    >
                      <div className="remotale-proj-top" style={{ gap: '8px', marginBottom: '6px', justifyContent: 'space-between' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                          <div className={`remotale-proj-icon-box ${getProjectIconBg(idx)}`} style={{ width: '32px', height: '32px' }}>
                            {getProjectIcon(idx)}
                          </div>
                          <div className="remotale-proj-title-row">
                            <span className="remotale-proj-title" style={{ fontSize: '13px' }}>{proj.title}</span>
                            <span className={`remotale-status-pill ${(proj.status === 'completed' || Number(proj.progress) >= 100) ? 'completed' : proj.status}`} style={{ fontSize: '9.5px', padding: '2px 6px' }}>
                              {(proj.status === 'completed' || Number(proj.progress) >= 100) ? 'Completed' : (proj.status === 'under-review' ? 'Under Review' : 'In Progress')}
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
                        <span style={{ fontSize: '10px', color: '#64748b' }}>📅 Due {proj.deadline || formattedCurrentDate}</span>
                      </div>
                    </div>
                  ))
                )}
              </section>
            )}

            {/* Subtab 2: Recent Activity Feed */}
            {mobileSubTab === 'recent-activity' && (
              <section className="remotale-card-container" style={{ padding: '14px' }}>
                <div className="remotale-card-header" style={{ marginBottom: '10px' }}>
                  <h3 style={{ fontSize: '13px', margin: 0, fontWeight: 700 }}>Recent Activity</h3>
                  <span style={{ fontSize: '10px', color: '#16a34a', fontWeight: 700, background: '#dcfce7', padding: '2px 6px', borderRadius: '999px' }}>
                    Live Feed
                  </span>
                </div>

                <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                  {teamActivities.length === 0 ? (
                    <div style={{ padding: '14px 0', textAlign: 'center', color: '#94a3b8', fontSize: '12px' }}>
                      No recent activities recorded.
                    </div>
                  ) : (
                    teamActivities.map((act, idx) => (
                      <div
                        key={act.id}
                        style={{
                          display: 'flex',
                          alignItems: 'flex-start',
                          gap: '10px',
                          padding: '8px 0',
                          borderBottom: idx < teamActivities.length - 1 ? '1px solid #f1f5f9' : 'none'
                        }}
                      >
                        <LetterAvatar name={act.member_name || 'Abdullah'} size={30} />
                        <div style={{ flex: 1, minWidth: 0 }}>
                          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                            <span style={{ fontSize: '12px', fontWeight: 700, color: '#0f172a' }}>{act.member_name}</span>
                            <span style={{ fontSize: '9px', color: '#94a3b8', whiteSpace: 'nowrap' }}>
                              {formatTimeAgo(act.created_at) || act.time || 'Recently'}
                            </span>
                          </div>
                          <div style={{ fontSize: '11px', color: '#334155', fontWeight: 600, marginTop: '2px' }}>{act.action}</div>
                          <div style={{ fontSize: '10px', color: '#4f46e5', fontWeight: 600, marginTop: '1px' }}>{act.details}</div>
                        </div>
                      </div>
                    ))
                  )}
                </div>
              </section>
            )}

            {/* Project Deadlines & Recent Messages 2-Column Split (Image 3) */}
            <div className="remotale-mobile-split-grid">
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
                        onClick={() => handleSelectProject(p)}
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
                  <button
                    type="button"
                    className="remotale-card-view-all"
                    onClick={() => {
                      setSelectedProject(null);
                      setActiveTab('messages');
                    }}
                  >
                    View All →
                  </button>
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
              className={`remotale-bottom-nav-item ${activeTab === 'messages' ? 'active' : ''}`}
              onClick={() => {
                setSelectedProject(null);
                setActiveTab('messages');
              }}
            >
              <MessagesIcon size={18} color={activeTab === 'messages' ? '#4F46E5' : '#64748B'} />
              <span>Messages</span>
            </button>
            <button
              type="button"
              className={`remotale-bottom-nav-item ${(activeTab === 'invoices' || activeTab === 'billing') ? 'active' : ''}`}
              onClick={() => {
                setSelectedProject(null);
                setActiveTab('invoices');
              }}
            >
              <BillingIcon size={18} color={(activeTab === 'invoices' || activeTab === 'billing') ? '#4F46E5' : '#64748B'} />
              <span>Invoices</span>
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
        teamMembers={teamMembers}
        currentUser={user}
      />

      {/* Client Project Progress & Pending Items PDF Studio Modal */}
      <ClientProgressPdfModal
        isOpen={isProgressPdfModalOpen}
        onClose={() => setIsProgressPdfModalOpen(false)}
        projects={projects}
        clients={clients}
        initialClientId={progressPdfClientId}
        currentAdminName="Ameen"
      />

      {/* Add New Team Member Modal */}
      {isAddTeamModalOpen && (
        <div style={{
          position: 'fixed',
          inset: 0,
          background: 'rgba(15, 23, 42, 0.65)',
          backdropFilter: 'blur(4px)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: 9999,
          padding: '20px'
        }}>
          <div style={{
            background: '#ffffff',
            borderRadius: '16px',
            width: '100%',
            maxWidth: '480px',
            padding: '28px',
            boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.2), 0 10px 10px -5px rgba(0, 0, 0, 0.04)',
            border: '1px solid #e2e8f0',
            animation: 'fadeIn 0.2s ease-out'
          }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '20px' }}>
              <div>
                <h3 style={{ margin: '0 0 4px 0', fontSize: '18px', fontWeight: 800, color: '#0f172a' }}>
                  Add Agency Team Member
                </h3>
                <p style={{ margin: 0, fontSize: '12.5px', color: '#64748b' }}>
                  Create an engineer or designer account and assign projects.
                </p>
              </div>
              <button
                type="button"
                onClick={() => setIsAddTeamModalOpen(false)}
                style={{
                  background: 'none',
                  border: 'none',
                  fontSize: '20px',
                  color: '#94a3b8',
                  cursor: 'pointer',
                  padding: '4px'
                }}
              >
                ✕
              </button>
            </div>

            <form onSubmit={async (e) => {
              e.preventDefault();
              if (!newMemberName.trim() || !newMemberEmail.trim()) return;
              await handleAddTeamMember({
                name: newMemberName.trim(),
                email: newMemberEmail.trim(),
                role: newMemberRole.trim() || 'Frontend Engineer',
                password: newMemberPw.trim() || 'member123',
                initialProjectId: newMemberInitialProj || null
              });
            }}>
              <div style={{ marginBottom: '14px' }}>
                <label style={{ display: 'block', fontSize: '12px', fontWeight: 700, color: '#334155', marginBottom: '5px' }}>
                  Full Name *
                </label>
                <input
                  type="text"
                  placeholder="e.g. Usman Ali or Sarah Jen"
                  value={newMemberName}
                  onChange={(e) => setNewMemberName(e.target.value)}
                  required
                  style={{
                    width: '100%',
                    padding: '9px 12px',
                    borderRadius: '8px',
                    border: '1px solid #cbd5e1',
                    fontSize: '13.5px'
                  }}
                />
              </div>

              <div style={{ marginBottom: '14px' }}>
                <label style={{ display: 'block', fontSize: '12px', fontWeight: 700, color: '#334155', marginBottom: '5px' }}>
                  Email Address (Login ID) *
                </label>
                <input
                  type="email"
                  placeholder="e.g. usman@remotale.com"
                  value={newMemberEmail}
                  onChange={(e) => setNewMemberEmail(e.target.value)}
                  required
                  style={{
                    width: '100%',
                    padding: '9px 12px',
                    borderRadius: '8px',
                    border: '1px solid #cbd5e1',
                    fontSize: '13.5px'
                  }}
                />
              </div>

              <div style={{ marginBottom: '14px' }}>
                <label style={{ display: 'block', fontSize: '12px', fontWeight: 700, color: '#334155', marginBottom: '5px' }}>
                  Role / Title
                </label>
                <input
                  type="text"
                  placeholder="e.g. Frontend & Shopify Engineer"
                  value={newMemberRole}
                  onChange={(e) => setNewMemberRole(e.target.value)}
                  style={{
                    width: '100%',
                    padding: '9px 12px',
                    borderRadius: '8px',
                    border: '1px solid #cbd5e1',
                    fontSize: '13.5px'
                  }}
                />
              </div>

              <div style={{ marginBottom: '14px' }}>
                <label style={{ display: 'block', fontSize: '12px', fontWeight: 700, color: '#334155', marginBottom: '5px' }}>
                  Password
                </label>
                <input
                  type="password"
                  placeholder="Default: member123"
                  value={newMemberPw}
                  onChange={(e) => setNewMemberPw(e.target.value)}
                  style={{
                    width: '100%',
                    padding: '9px 12px',
                    borderRadius: '8px',
                    border: '1px solid #cbd5e1',
                    fontSize: '13.5px'
                  }}
                />
              </div>

              <div style={{ marginBottom: '22px' }}>
                <label style={{ display: 'block', fontSize: '12px', fontWeight: 700, color: '#334155', marginBottom: '5px' }}>
                  Assign Initial Project (Optional)
                </label>
                <select
                  value={newMemberInitialProj}
                  onChange={(e) => setNewMemberInitialProj(e.target.value)}
                  style={{
                    width: '100%',
                    padding: '9px 12px',
                    borderRadius: '8px',
                    border: '1px solid #cbd5e1',
                    fontSize: '13.5px',
                    background: '#ffffff'
                  }}
                >
                  <option value="">No initial project (Assign later)</option>
                  {projects.map(p => (
                    <option key={p.id} value={p.id}>
                      {p.title} ({p.deadline || 'Upcoming'})
                    </option>
                  ))}
                </select>
              </div>

              <div style={{ display: 'flex', gap: '10px', justifyContent: 'flex-end' }}>
                <button
                  type="button"
                  onClick={() => setIsAddTeamModalOpen(false)}
                  style={{
                    padding: '9px 18px',
                    borderRadius: '8px',
                    border: '1px solid #cbd5e1',
                    background: '#f8fafc',
                    color: '#475569',
                    fontWeight: 600,
                    fontSize: '13px',
                    cursor: 'pointer'
                  }}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  style={{
                    padding: '9px 22px',
                    borderRadius: '8px',
                    border: 'none',
                    background: '#4f46e5',
                    color: '#ffffff',
                    fontWeight: 700,
                    fontSize: '13px',
                    cursor: 'pointer',
                    boxShadow: '0 2px 6px rgba(79, 70, 229, 0.3)'
                  }}
                >
                  Create Member
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
