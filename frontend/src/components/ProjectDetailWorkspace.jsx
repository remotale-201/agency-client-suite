import React, { useState, useEffect, useRef } from 'react';
import './ProjectDetailWorkspace.css';
import { RemotaleLogo } from './RemotaleAuthFlow';

// SVG Icons
function ArrowLeftIcon({ size = 20, color = 'currentColor' }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round">
      <line x1="19" y1="12" x2="5" y2="12" />
      <polyline points="12 19 5 12 12 5" />
    </svg>
  );
}

function MoreVerticalIcon({ size = 18, color = 'currentColor' }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="12" cy="5" r="1.5" fill={color} />
      <circle cx="12" cy="12" r="1.5" fill={color} />
      <circle cx="12" cy="19" r="1.5" fill={color} />
    </svg>
  );
}

function ShoppingBagIcon({ size = 28, color = 'currentColor' }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M6 2L3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z" />
      <line x1="3" y1="6" x2="21" y2="6" />
      <path d="M16 10a4 4 0 0 1-8 0" />
    </svg>
  );
}

function CalendarIcon({ size = 16, color = 'currentColor' }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <rect x="3" y="4" width="18" height="18" rx="2" ry="2" />
      <line x1="16" y1="2" x2="16" y2="6" />
      <line x1="8" y1="2" x2="8" y2="6" />
      <line x1="3" y1="10" x2="21" y2="10" />
    </svg>
  );
}

function FlagIcon({ size = 15, color = 'currentColor' }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M4 15s1-1 4-1 5 2 8 2 4-1 4-1V3s-1 1-4 1-5-2-8-2-4 1-4 1z" />
      <line x1="4" y1="22" x2="4" y2="15" />
    </svg>
  );
}

function DocIcon({ size = 18, color = 'currentColor' }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
      <polyline points="14 2 14 8 20 8" />
      <line x1="16" y1="13" x2="8" y2="13" />
      <line x1="16" y1="17" x2="8" y2="17" />
      <polyline points="10 9 9 9 8 9" />
    </svg>
  );
}

function CheckSquareIcon({ size = 18, color = 'currentColor' }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <polyline points="9 11 12 14 22 4" />
      <path d="M21 12v7a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11" />
    </svg>
  );
}

function ShieldLockIcon({ size = 18, color = 'currentColor' }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
    </svg>
  );
}

function PencilEditIcon({ size = 14, color = 'currentColor' }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M12 20h9" />
      <path d="M16.5 3.5a2.121 2.121 0 0 1 3 3L7 19l-4 1 1-4L16.5 3.5z" />
    </svg>
  );
}

function CopyIcon({ size = 14, color = 'currentColor' }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <rect x="9" y="9" width="13" height="13" rx="2" ry="2" />
      <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1" />
    </svg>
  );
}

function CheckIcon({ size = 14, color = '#10B981' }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
      <polyline points="20 6 9 17 4 12" />
    </svg>
  );
}

function PlusIcon({ size = 14, color = 'currentColor' }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
      <line x1="12" y1="5" x2="12" y2="19" />
      <line x1="5" y1="12" x2="19" y2="12" />
    </svg>
  );
}

function UploadIcon({ size = 14, color = 'currentColor' }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
      <polyline points="17 8 12 3 7 8" />
      <line x1="12" y1="3" x2="12" y2="15" />
    </svg>
  );
}

function DownloadIcon({ size = 15, color = 'currentColor' }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
      <polyline points="7 10 12 15 17 10" />
      <line x1="12" y1="15" x2="12" y2="3" />
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

function TrashIcon({ size = 14, color = 'currentColor' }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <polyline points="3 6 5 6 21 6" />
      <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2" />
      <line x1="10" y1="11" x2="10" y2="17" />
      <line x1="14" y1="11" x2="14" y2="17" />
    </svg>
  );
}

// Brand SVG icons for Shopify, WordPress, Figma
function ShopifyBrandIcon() {
  return (
    <div style={{ width: '32px', height: '32px', borderRadius: '8px', background: '#ecfdf5', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      <span style={{ fontSize: '18px' }}>🛍️</span>
    </div>
  );
}

function WordPressBrandIcon() {
  return (
    <div style={{ width: '32px', height: '32px', borderRadius: '8px', background: '#eff6ff', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#2563eb', fontWeight: 800, fontSize: '16px' }}>
      W
    </div>
  );
}

function FigmaFileIcon() {
  return (
    <div style={{ width: '36px', height: '36px', borderRadius: '10px', background: '#1e1e1e', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      <svg width="18" height="18" viewBox="0 0 24 24">
        <path d="M12 2a4 4 0 0 0-4 4v4h4a4 4 0 0 0 0-8z" fill="#F24E1E"/>
        <path d="M8 2a4 4 0 0 0-4 4 4 4 0 0 0 4 4h4V6a4 4 0 0 0-4-4z" fill="#FF7262"/>
        <path d="M8 10a4 4 0 0 0-4 4 4 4 0 0 0 4 4h4v-8H8z" fill="#A259FF"/>
        <path d="M8 18a4 4 0 0 0 4 4 4 4 0 0 0 4-4v-4H8v4z" fill="#0ACF83"/>
        <circle cx="16" cy="14" r="4" fill="#1ABCFE"/>
      </svg>
    </div>
  );
}

function ZipFileIcon() {
  return (
    <div style={{ width: '36px', height: '36px', borderRadius: '10px', background: '#fef3c7', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#d97706', fontSize: '16px' }}>
      🗜️
    </div>
  );
}

function RarFileIcon() {
  return (
    <div style={{ width: '36px', height: '36px', borderRadius: '10px', background: '#f5f3ff', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#7c3aed', fontSize: '16px' }}>
      📦
    </div>
  );
}

function UrlFileIcon() {
  return (
    <div style={{ width: '36px', height: '36px', borderRadius: '10px', background: '#eff6ff', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#2563eb', fontSize: '16px' }}>
      🔗
    </div>
  );
}

export default function ProjectDetailWorkspace({
  project,
  onBack,
  onEditProject,
  onDeleteProject,
  onToggleTask,
  onAddTask,
  onUpdateProject,
  currentUser
}) {
  const [activeTab, setActiveTab] = useState('overview'); // overview, todo, files, credentials, notes
  const [copiedKey, setCopiedKey] = useState(null);
  const [isTopMenuOpen, setIsTopMenuOpen] = useState(false);
  const [isAddingTask, setIsAddingTask] = useState(false);
  const [newTaskTitle, setNewTaskTitle] = useState('');
  const [isAddingCred, setIsAddingCred] = useState(false);
  const [newCredPlatform, setNewCredPlatform] = useState('');
  const [newCredUser, setNewCredUser] = useState('');
  const [newCredPw, setNewCredPw] = useState('');
  const [isEditingNotes, setIsEditingNotes] = useState(false);
  const [notesContent, setNotesContent] = useState('');

  const menuRef = useRef(null);

  // Parse notes
  useEffect(() => {
    setNotesContent(
      project?.notes ||
      `• Client wants a clean and modern design similar to Daraz.\n• Use brand colors and logo.\n• Add product categories: Earbuds, Watches, Accessories.\n• Optimize product pages for SEO.\n• Client may provide new banner images next week.\n• Need to confirm payment gateway details.`
    );
  }, [project]);

  // Click outside menu
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (menuRef.current && !menuRef.current.contains(e.target)) {
        setIsTopMenuOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleCopy = (text, key) => {
    if (!text) return;
    navigator.clipboard.writeText(text);
    setCopiedKey(key);
    setTimeout(() => setCopiedKey(null), 2000);
  };

  // Safe credentials parser
  let credentialsList = [];
  try {
    if (typeof project?.credentials === 'string') {
      credentialsList = JSON.parse(project.credentials);
    } else if (Array.isArray(project?.credentials)) {
      credentialsList = project.credentials;
    }
  } catch (err) {
    credentialsList = [];
  }

  // Default rich fallback credentials matching Image 2
  if (credentialsList.length === 0) {
    credentialsList = [
      {
        id: 'cred-1',
        platform: 'Shopify Admin',
        subText: 'ali.store.myshopify.com',
        username: 'ali.khan@remotale.com',
        password: '••••••••'
      },
      {
        id: 'cred-2',
        platform: 'WordPress Hosting',
        subText: 'example.com/wp-admin',
        username: 'admin',
        password: '••••••••'
      }
    ];
  }

  // Tasks list (from project tasks or defaults matching Image 2)
  const defaultTasks = [
    { id: 't-1', title: 'Design homepage layout', due_date: '12 Oct 2024', completed: true, assigned_avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=100&auto=format&fit=crop&q=80' },
    { id: 't-2', title: 'Setup Shopify theme', due_date: '15 Oct 2024', completed: true, assigned_avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100&auto=format&fit=crop&q=80' },
    { id: 't-3', title: 'Add initial products', due_date: '18 Oct 2024', completed: true, assigned_avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&auto=format&fit=crop&q=80' },
    { id: 't-4', title: 'Integrate payment gateway', due_date: '20 Oct 2024', completed: false, assigned_avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=100&auto=format&fit=crop&q=80' },
    { id: 't-5', title: 'Basic SEO setup', due_date: '22 Oct 2024', completed: false, assigned_avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100&auto=format&fit=crop&q=80' },
    { id: 't-6', title: 'Final testing & review', due_date: '24 Oct 2024', completed: false, assigned_avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&auto=format&fit=crop&q=80' }
  ];

  const currentTasks = (project?.tasks && project.tasks.length > 0) ? project.tasks : defaultTasks;

  // Safe files list matching Image 2
  const filesList = [
    { id: 'f-1', name: 'Homepage Design.fig', meta: 'Figma File • 12 MB', date: '12 Oct 2024', type: 'figma' },
    { id: 'f-2', name: 'Product Banners.zip', meta: 'ZIP File • 24 MB', date: '14 Oct 2024', type: 'zip' },
    { id: 'f-3', name: 'Logo & Brand Kit.rar', meta: 'RAR File • 8 MB', date: '15 Oct 2024', type: 'rar' },
    { id: 'f-4', name: 'Reference Website.url', meta: 'URL Link', date: '16 Oct 2024', type: 'url' }
  ];

  // Activities list matching Image 2
  const activityList = [
    {
      id: 'act-1',
      author: 'Ahmed',
      action: 'updated the design file',
      detail: 'Homepage Design.fig',
      time: '2h ago',
      avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=100&auto=format&fit=crop&q=80'
    },
    {
      id: 'act-2',
      author: 'Sara',
      action: 'marked a task complete',
      detail: 'Setup Shopify theme',
      time: '5h ago',
      avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100&auto=format&fit=crop&q=80'
    },
    {
      id: 'act-3',
      author: 'You',
      action: 'added a new note',
      detail: 'Client wants a clean and modern...',
      time: '1d ago',
      isLetter: true,
      letter: 'A'
    },
    {
      id: 'act-4',
      author: 'Usman',
      action: 'uploaded a file',
      detail: 'Product Banners.zip',
      time: '1d ago',
      avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&auto=format&fit=crop&q=80'
    }
  ];

  // Note bullet lines
  const noteBullets = notesContent
    .split('\n')
    .map(line => line.replace(/^[•\-\*]\s*/, '').trim())
    .filter(Boolean);

  const handleSaveNotes = async () => {
    if (onUpdateProject && project?.id) {
      await onUpdateProject(project.id, { notes: notesContent });
    }
    setIsEditingNotes(false);
  };

  const handleCreateTask = async (e) => {
    e.preventDefault();
    if (!newTaskTitle.trim()) return;
    if (onAddTask) {
      await onAddTask({
        projectId: project?.id,
        title: newTaskTitle.trim(),
        dueDate: 'Oct 25, 2024'
      });
      setNewTaskTitle('');
      setIsAddingTask(false);
    }
  };

  const handleSaveNewCred = async (e) => {
    e.preventDefault();
    if (!newCredPlatform.trim()) return;
    const updated = [
      ...credentialsList,
      {
        platform: newCredPlatform.trim(),
        subText: `${newCredPlatform.toLowerCase().replace(/\s+/g, '')}.com`,
        username: newCredUser.trim(),
        password: newCredPw.trim() || '••••••••'
      }
    ];
    if (onUpdateProject && project?.id) {
      await onUpdateProject(project.id, { credentials: updated });
    }
    setNewCredPlatform('');
    setNewCredUser('');
    setNewCredPw('');
    setIsAddingCred(false);
  };

  return (
    <div className="pdw-container">
      {/* Top Bar with Back, Logo, and 3-dots */}
      <div className="pdw-topbar">
        <button
          type="button"
          className="pdw-back-btn"
          onClick={onBack}
          title="Back to Projects"
        >
          <ArrowLeftIcon size={19} color="#0F172A" />
        </button>

        <div className="pdw-topbar-brand">
          <RemotaleLogo size={24} />
          <span>Remotale</span>
        </div>

        <div className="pdw-topbar-actions" ref={menuRef}>
          <button
            type="button"
            className="pdw-dots-btn"
            title="Options"
            onClick={() => setIsTopMenuOpen(!isTopMenuOpen)}
          >
            <MoreVerticalIcon size={20} color="#64748B" />
          </button>

          {/* 3-dots menu for the project */}
          {isTopMenuOpen && (
            <div className="pdw-menu-dropdown">
              <button
                type="button"
                className="pdw-menu-item"
                onClick={() => {
                  setIsTopMenuOpen(false);
                  onEditProject(project);
                }}
              >
                <PencilEditIcon size={15} color="#4F46E5" />
                <span>Edit Project</span>
              </button>
              <button
                type="button"
                className="pdw-menu-item delete"
                onClick={() => {
                  setIsTopMenuOpen(false);
                  onDeleteProject(project?.id);
                }}
              >
                <TrashIcon size={15} color="#EF4444" />
                <span>Delete Project</span>
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Hero Banner Section */}
      <div className="pdw-hero-card">
        <div className="pdw-hero-top">
          <div className="pdw-hero-icon-box">
            <ShoppingBagIcon size={30} color="#FFFFFF" />
          </div>

          <div className="pdw-hero-info">
            <div className="pdw-status-pill">
              <span className="pdw-status-dot" />
              <span>In Progress</span>
            </div>

            <h1 className="pdw-hero-title">{project?.title || 'E-commerce Website'}</h1>
            <p className="pdw-hero-desc">
              {project?.description || 'Modern Shopify-based store with custom theme and product setup.'}
            </p>
          </div>
        </div>

        {/* 3-Column Stats Row */}
        <div className="pdw-stats-row">
          {/* Col 1: Assigned Team */}
          <div className="pdw-stat-col">
            <div className="pdw-stat-icon-circle">
              <span>{currentUser?.name?.[0] || 'A'}</span>
            </div>
            <div className="pdw-stat-texts">
              <span className="pdw-stat-lbl">Assigned Team</span>
              <span className="pdw-stat-val">3 Members</span>
            </div>
          </div>

          {/* Col 2: Deadline */}
          <div className="pdw-stat-col">
            <div className="pdw-stat-icon-circle" style={{ background: '#f8fafc', color: '#64748b' }}>
              <CalendarIcon size={17} />
            </div>
            <div className="pdw-stat-texts">
              <span className="pdw-stat-lbl">Deadline</span>
              <span className="pdw-stat-val">{project?.deadline || '25 Oct 2024'}</span>
            </div>
          </div>

          {/* Col 3: Progress Bar */}
          <div className="pdw-stat-progress-col">
            <div className="pdw-stat-progress-header">
              <span className="pdw-stat-lbl">Progress</span>
              <span className="pdw-stat-val">{project?.progress || 70}%</span>
            </div>
            <div className="pdw-stat-progress-bar-track">
              <div
                className="pdw-stat-progress-bar-fill"
                style={{ width: `${project?.progress || 70}%` }}
              />
            </div>
          </div>
        </div>
      </div>

      {/* Tabs Row */}
      <div className="pdw-tabs-bar">
        <button
          type="button"
          className={`pdw-tab-btn ${activeTab === 'overview' ? 'active' : ''}`}
          onClick={() => setActiveTab('overview')}
        >
          <DocIcon size={15} color={activeTab === 'overview' ? '#4338CA' : '#64748B'} />
          <span>Overview</span>
        </button>

        <button
          type="button"
          className={`pdw-tab-btn ${activeTab === 'todo' ? 'active' : ''}`}
          onClick={() => setActiveTab('todo')}
        >
          <CheckSquareIcon size={15} color={activeTab === 'todo' ? '#4338CA' : '#64748B'} />
          <span>To Do</span>
        </button>

        <button
          type="button"
          className={`pdw-tab-btn ${activeTab === 'files' ? 'active' : ''}`}
          onClick={() => setActiveTab('files')}
        >
          <UploadIcon size={15} color={activeTab === 'files' ? '#4338CA' : '#64748B'} />
          <span>Files</span>
        </button>

        <button
          type="button"
          className={`pdw-tab-btn ${activeTab === 'credentials' ? 'active' : ''}`}
          onClick={() => setActiveTab('credentials')}
        >
          <ShieldLockIcon size={15} color={activeTab === 'credentials' ? '#4338CA' : '#64748B'} />
          <span>Credentials</span>
        </button>

        <button
          type="button"
          className={`pdw-tab-btn ${activeTab === 'notes' ? 'active' : ''}`}
          onClick={() => setActiveTab('notes')}
        >
          <PencilEditIcon size={14} color={activeTab === 'notes' ? '#4338CA' : '#64748B'} />
          <span>Notes</span>
        </button>
      </div>

      {/* 2-Column Grid (6 Cards) */}
      <div className="pdw-cards-grid">
        {/* CARD 1: Project Information */}
        {(activeTab === 'overview' || activeTab === 'notes') && (
          <div className="pdw-card">
            <div className="pdw-card-header">
              <div className="pdw-card-header-left">
                <div className="pdw-card-icon-box" style={{ color: '#2563EB' }}>
                  <DocIcon size={19} color="#2563EB" />
                </div>
                <h3 className="pdw-card-title">Project Information</h3>
              </div>

              <button
                type="button"
                className="pdw-card-btn-action"
                onClick={() => onEditProject(project)}
              >
                <PencilEditIcon size={13} />
                <span>Edit</span>
              </button>
            </div>

            <div className="pdw-info-field">
              <div className="pdw-info-lbl">Project Title</div>
              <div className="pdw-info-val-title">{project?.title || 'E-commerce Website'}</div>
            </div>

            <div className="pdw-info-field">
              <div className="pdw-info-lbl">Description</div>
              <div className="pdw-info-val-desc">
                {project?.description || 'Modern Shopify-based store with custom theme, product setup, payment integration and basic SEO.'}
              </div>
            </div>

            <div className="pdw-info-grid-2x2">
              <div>
                <div className="pdw-info-lbl">Start Date</div>
                <div className="pdw-info-icon-val">
                  <CalendarIcon size={14} color="#6366F1" />
                  <span>{project?.start_date || project?.startDate || '10 Oct 2024'}</span>
                </div>
              </div>

              <div>
                <div className="pdw-info-lbl">Deadline</div>
                <div className="pdw-info-icon-val">
                  <CalendarIcon size={14} color="#6366F1" />
                  <span>{project?.deadline || '25 Oct 2024'}</span>
                </div>
              </div>

              <div>
                <div className="pdw-info-lbl">Status</div>
                <div className="pdw-info-icon-val">
                  <span className="pdw-info-dot-status" />
                  <span>In Progress</span>
                </div>
              </div>

              <div>
                <div className="pdw-info-lbl">Priority</div>
                <div className="pdw-info-icon-val">
                  <FlagIcon size={14} color="#EA580C" />
                  <span>{project?.priority || 'Medium'}</span>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* CARD 2: Credentials (Optional) */}
        {(activeTab === 'overview' || activeTab === 'credentials') && (
          <div className="pdw-card">
            <div className="pdw-card-header">
              <div className="pdw-card-header-left">
                <div className="pdw-card-icon-box" style={{ color: '#6366F1' }}>
                  <ShieldLockIcon size={19} color="#6366F1" />
                </div>
                <h3 className="pdw-card-title">Credentials <span style={{ fontSize: '13px', fontWeight: 500, color: '#64748b' }}>(Optional)</span></h3>
              </div>

              <button
                type="button"
                className="pdw-card-btn-action"
                onClick={() => setIsAddingCred(!isAddingCred)}
              >
                <PlusIcon size={13} />
                <span>Add</span>
              </button>
            </div>

            {/* Quick add credential form */}
            {isAddingCred && (
              <form onSubmit={handleSaveNewCred} style={{ marginBottom: '14px', padding: '12px', background: '#f8fafc', borderRadius: '12px', border: '1px solid #e2e8f0' }}>
                <input
                  type="text"
                  placeholder="Platform (e.g. Shopify Admin)"
                  value={newCredPlatform}
                  onChange={(e) => setNewCredPlatform(e.target.value)}
                  style={{ width: '100%', padding: '7px 10px', borderRadius: '8px', border: '1px solid #cbd5e1', marginBottom: '8px', fontSize: '12.5px' }}
                  required
                />
                <input
                  type="text"
                  placeholder="Username / Email"
                  value={newCredUser}
                  onChange={(e) => setNewCredUser(e.target.value)}
                  style={{ width: '100%', padding: '7px 10px', borderRadius: '8px', border: '1px solid #cbd5e1', marginBottom: '8px', fontSize: '12.5px' }}
                />
                <input
                  type="password"
                  placeholder="Password"
                  value={newCredPw}
                  onChange={(e) => setNewCredPw(e.target.value)}
                  style={{ width: '100%', padding: '7px 10px', borderRadius: '8px', border: '1px solid #cbd5e1', marginBottom: '10px', fontSize: '12.5px' }}
                />
                <div style={{ display: 'flex', gap: '8px', justifyContent: 'flex-end' }}>
                  <button type="button" onClick={() => setIsAddingCred(false)} style={{ padding: '5px 12px', fontSize: '12px', borderRadius: '6px', border: '1px solid #cbd5e1', background: '#fff', cursor: 'pointer' }}>Cancel</button>
                  <button type="submit" style={{ padding: '5px 12px', fontSize: '12px', borderRadius: '6px', border: 'none', background: '#6366f1', color: '#fff', cursor: 'pointer', fontWeight: 600 }}>Save</button>
                </div>
              </form>
            )}

            <div className="pdw-creds-list">
              {credentialsList.map((cred, idx) => (
                <div key={idx} className="pdw-cred-card">
                  <div className="pdw-cred-card-top">
                    <div className="pdw-cred-platform-wrap">
                      {cred.platform?.toLowerCase().includes('shopify') ? (
                        <ShopifyBrandIcon />
                      ) : cred.platform?.toLowerCase().includes('word') ? (
                        <WordPressBrandIcon />
                      ) : (
                        <div className="pdw-cred-platform-icon" style={{ background: '#f5f3ff', color: '#6366f1' }}>
                          🔑
                        </div>
                      )}
                      <div>
                        <h4 className="pdw-cred-platform-title">{cred.platform || 'Platform Login'}</h4>
                        <p className="pdw-cred-platform-sub">{cred.subText || cred.website || 'admin.portal.com'}</p>
                      </div>
                    </div>

                    <button type="button" className="pdw-btn-copy" title="Options">
                      <MoreVerticalIcon size={16} />
                    </button>
                  </div>

                  <div className="pdw-cred-field-row">
                    <span className="pdw-cred-field-lbl">Username</span>
                    <div className="pdw-cred-field-val-wrap">
                      <span className="pdw-cred-field-val">{cred.username || 'user@example.com'}</span>
                      <button
                        type="button"
                        className="pdw-btn-copy"
                        title="Copy Username"
                        onClick={() => handleCopy(cred.username, `user-${idx}`)}
                      >
                        {copiedKey === `user-${idx}` ? <CheckIcon size={13} /> : <CopyIcon size={13} />}
                      </button>
                    </div>
                  </div>

                  <div className="pdw-cred-field-row">
                    <span className="pdw-cred-field-lbl">Password</span>
                    <div className="pdw-cred-field-val-wrap">
                      <span className="pdw-cred-field-val">{cred.password || '••••••••'}</span>
                      <button
                        type="button"
                        className="pdw-btn-copy"
                        title="Copy Password"
                        onClick={() => handleCopy(cred.password, `pw-${idx}`)}
                      >
                        {copiedKey === `pw-${idx}` ? <CheckIcon size={13} /> : <CopyIcon size={13} />}
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* CARD 3: Notepad */}
        {(activeTab === 'overview' || activeTab === 'notes') && (
          <div className="pdw-card">
            <div className="pdw-card-header">
              <div className="pdw-card-header-left">
                <div className="pdw-card-icon-box" style={{ color: '#9333EA' }}>
                  <DocIcon size={19} color="#9333EA" />
                </div>
                <h3 className="pdw-card-title">Notepad</h3>
              </div>

              <button
                type="button"
                className="pdw-card-btn-action"
                onClick={() => setIsEditingNotes(!isEditingNotes)}
              >
                <PencilEditIcon size={13} />
                <span>{isEditingNotes ? 'Close' : 'Edit'}</span>
              </button>
            </div>

            {isEditingNotes ? (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                <textarea
                  value={notesContent}
                  onChange={(e) => setNotesContent(e.target.value)}
                  rows={6}
                  style={{
                    width: '100%',
                    padding: '10px',
                    borderRadius: '10px',
                    border: '1px solid #cbd5e1',
                    fontSize: '13px',
                    lineHeight: '1.5',
                    color: '#0f172a'
                  }}
                />
                <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '8px' }}>
                  <button
                    type="button"
                    onClick={() => setIsEditingNotes(false)}
                    style={{ padding: '6px 14px', borderRadius: '8px', border: '1px solid #cbd5e1', background: '#fff', cursor: 'pointer', fontSize: '12.5px' }}
                  >
                    Cancel
                  </button>
                  <button
                    type="button"
                    onClick={handleSaveNotes}
                    style={{ padding: '6px 14px', borderRadius: '8px', border: 'none', background: '#6366f1', color: '#fff', cursor: 'pointer', fontWeight: 600, fontSize: '12.5px' }}
                  >
                    Save Notes
                  </button>
                </div>
              </div>
            ) : (
              <ul className="pdw-notepad-list">
                {noteBullets.map((bullet, idx) => (
                  <li key={idx} className="pdw-notepad-item">
                    <span className="pdw-notepad-bullet" />
                    <span>{bullet}</span>
                  </li>
                ))}
              </ul>
            )}
          </div>
        )}

        {/* CARD 4: To Do List */}
        {(activeTab === 'overview' || activeTab === 'todo') && (
          <div className="pdw-card">
            <div className="pdw-card-header">
              <div className="pdw-card-header-left">
                <div className="pdw-card-icon-box" style={{ color: '#4F46E5' }}>
                  <CheckSquareIcon size={19} color="#4F46E5" />
                </div>
                <h3 className="pdw-card-title">To Do List</h3>
              </div>

              <button
                type="button"
                className="pdw-card-btn-action"
                onClick={() => setIsAddingTask(!isAddingTask)}
              >
                <PlusIcon size={13} />
                <span>Add Task</span>
              </button>
            </div>

            {/* Quick add task input */}
            {isAddingTask && (
              <form onSubmit={handleCreateTask} style={{ marginBottom: '12px', display: 'flex', gap: '8px' }}>
                <input
                  type="text"
                  placeholder="Enter task name..."
                  value={newTaskTitle}
                  onChange={(e) => setNewTaskTitle(e.target.value)}
                  autoFocus
                  style={{ flex: 1, padding: '7px 12px', borderRadius: '8px', border: '1px solid #cbd5e1', fontSize: '13px' }}
                />
                <button
                  type="submit"
                  style={{ background: '#6366f1', color: '#fff', border: 'none', padding: '7px 14px', borderRadius: '8px', fontSize: '12.5px', fontWeight: 600, cursor: 'pointer' }}
                >
                  Save
                </button>
                <button
                  type="button"
                  onClick={() => setIsAddingTask(false)}
                  style={{ background: '#f1f5f9', border: '1px solid #e2e8f0', padding: '7px 10px', borderRadius: '8px', fontSize: '12.5px', cursor: 'pointer' }}
                >
                  ✕
                </button>
              </form>
            )}

            <div className="pdw-tasks-list">
              {currentTasks.map((t) => (
                <div key={t.id} className="pdw-task-row">
                  <div className="pdw-task-left">
                    <input
                      type="checkbox"
                      className="pdw-task-checkbox"
                      checked={Boolean(t.completed)}
                      onChange={() => onToggleTask && onToggleTask(t.id, !t.completed)}
                    />
                    <span className={`pdw-task-title ${t.completed ? 'completed' : ''}`}>
                      {t.title}
                    </span>
                  </div>

                  <div className="pdw-task-right">
                    <span className="pdw-task-date">{t.due_date || t.dueDate || '15 Oct 2024'}</span>
                    <img
                      src={t.assigned_avatar || 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=100&auto=format&fit=crop&q=80'}
                      alt="Assignee"
                      className="pdw-task-avatar"
                    />
                    <button type="button" className="pdw-btn-copy">
                      <MoreVerticalIcon size={15} />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* CARD 5: Files & Assets */}
        {(activeTab === 'overview' || activeTab === 'files') && (
          <div className="pdw-card">
            <div className="pdw-card-header">
              <div className="pdw-card-header-left">
                <div className="pdw-card-icon-box" style={{ color: '#4F46E5' }}>
                  <UploadIcon size={19} color="#4F46E5" />
                </div>
                <h3 className="pdw-card-title">Files & Assets</h3>
              </div>

              <label className="pdw-card-btn-action" style={{ cursor: 'pointer' }}>
                <UploadIcon size={13} />
                <span>Upload</span>
                <input type="file" style={{ display: 'none' }} onChange={() => alert('File uploaded successfully to project files!')} />
              </label>
            </div>

            <div className="pdw-files-list">
              {filesList.map((file) => (
                <div key={file.id} className="pdw-file-row">
                  <div className="pdw-file-left">
                    {file.type === 'figma' ? (
                      <FigmaFileIcon />
                    ) : file.type === 'zip' ? (
                      <ZipFileIcon />
                    ) : file.type === 'rar' ? (
                      <RarFileIcon />
                    ) : (
                      <UrlFileIcon />
                    )}

                    <div className="pdw-file-info">
                      <span className="pdw-file-name">{file.name}</span>
                      <span className="pdw-file-meta">{file.meta}</span>
                    </div>
                  </div>

                  <div className="pdw-file-right">
                    <span className="pdw-file-date">{file.date}</span>
                    <button type="button" className="pdw-file-download-btn" title="Download file" onClick={() => alert(`Downloading ${file.name}...`)}>
                      <DownloadIcon size={15} />
                    </button>
                    <button type="button" className="pdw-file-download-btn">
                      <MoreVerticalIcon size={15} />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* CARD 6: Project Activity Timeline */}
        {(activeTab === 'overview' || activeTab === 'todo') && (
          <div className="pdw-card">
            <div className="pdw-card-header">
              <div className="pdw-card-header-left">
                <div className="pdw-card-icon-box" style={{ color: '#4F46E5' }}>
                  <ClockIcon size={19} color="#4F46E5" />
                </div>
                <h3 className="pdw-card-title">Project Activity</h3>
              </div>

              <button
                type="button"
                className="pdw-card-btn-action"
                style={{ background: 'transparent', padding: '0', color: '#6366F1' }}
                onClick={() => setActiveTab('overview')}
              >
                <span>View All →</span>
              </button>
            </div>

            <div className="pdw-activity-timeline">
              <div className="pdw-activity-line" />

              {activityList.map((act) => (
                <div key={act.id} className="pdw-activity-item">
                  <span className="pdw-activity-dot" />

                  <div className="pdw-activity-user-row">
                    {act.isLetter ? (
                      <div className="pdw-activity-avatar-letter">{act.letter}</div>
                    ) : (
                      <img src={act.avatar} alt={act.author} className="pdw-activity-avatar" />
                    )}

                    <div className="pdw-activity-content">
                      <span className="pdw-activity-action-title">
                        {act.author} {act.action}
                      </span>
                      <span className="pdw-activity-action-sub">{act.detail}</span>
                    </div>
                  </div>

                  <span className="pdw-activity-time">{act.time}</span>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
