import React, { useState, useEffect, useRef } from 'react';
import './MyProjectsView.css';
import LetterAvatar from './LetterAvatar';

// SVG Icons
function PlusIcon({ size = 16, color = 'currentColor' }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
      <line x1="12" y1="5" x2="12" y2="19" />
      <line x1="5" y1="12" x2="19" y2="12" />
    </svg>
  );
}

function SearchIcon({ size = 16, color = 'currentColor' }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="11" cy="11" r="8" />
      <line x1="21" y1="21" x2="16.65" y2="16.65" />
    </svg>
  );
}

function FilterFunnelIcon({ size = 16, color = 'currentColor' }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <polygon points="22 3 2 3 10 12.46 10 19 14 21 14 12.46 22 3" />
    </svg>
  );
}

function SortArrowsIcon({ size = 16, color = 'currentColor' }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <polyline points="17 11 12 6 7 11" />
      <polyline points="17 18 12 13 7 18" />
    </svg>
  );
}

function ChevronDownIcon({ size = 14, color = 'currentColor' }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <polyline points="6 9 12 15 18 9" />
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

function CalendarIcon({ size = 15, color = 'currentColor' }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <rect x="3" y="4" width="18" height="18" rx="2" ry="2" />
      <line x1="16" y1="2" x2="16" y2="6" />
      <line x1="8" y1="2" x2="8" y2="6" />
      <line x1="3" y1="10" x2="21" y2="10" />
    </svg>
  );
}

function CodeIcon({ size = 20, color = 'currentColor' }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
      <polyline points="16 18 22 12 16 6" />
      <polyline points="8 6 2 12 8 18" />
    </svg>
  );
}

function EditIcon({ size = 18, color = 'currentColor' }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M12 20h9" />
      <path d="M16.5 3.5a2.121 2.121 0 0 1 3 3L7 19l-4 1 1-4L16.5 3.5z" />
    </svg>
  );
}

function TrashIcon({ size = 15, color = 'currentColor' }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <polyline points="3 6 5 6 21 6" />
      <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2" />
      <line x1="10" y1="11" x2="10" y2="17" />
      <line x1="14" y1="11" x2="14" y2="17" />
    </svg>
  );
}

function PlayVideoIcon({ size = 20, color = 'currentColor' }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <rect x="2" y="4" width="20" height="16" rx="2.18" ry="2.18" />
      <polygon points="10 8 16 12 10 16 10 8" fill={color} />
    </svg>
  );
}

function BarChartIcon({ size = 20, color = 'currentColor' }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
      <line x1="18" y1="20" x2="18" y2="10" />
      <line x1="12" y1="20" x2="12" y2="4" />
      <line x1="6" y1="20" x2="6" y2="14" />
    </svg>
  );
}

export default function MyProjectsView({
  projects = [],
  onSelectProject,
  onOpenAddProject,
  onEditProject,
  onDeleteProject,
  currentUser,
  onLogout
}) {
  const [activeFilter, setActiveFilter] = useState('all'); // 'all', 'in-progress', 'under-review', 'completed'
  const [searchTerm, setSearchTerm] = useState('');
  const [sortBy, setSortBy] = useState('latest');
  const [openMenuId, setOpenMenuId] = useState(null);

  // Close dropdown on click outside
  const menuRef = useRef(null);
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (menuRef.current && !menuRef.current.contains(e.target)) {
        setOpenMenuId(null);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Compute counts
  const totalCount = projects.length;
  const inProgressCount = projects.filter(p => p.status === 'in-progress' && Number(p.progress || 0) < 100).length;
  const underReviewCount = projects.filter(p => p.status === 'under-review').length;
  const completedCount = projects.filter(p => p.status === 'completed' || Number(p.progress || 0) >= 100).length;

  // Filter projects
  const filteredProjects = projects.filter(p => {
    const isCompleted = p.status === 'completed' || Number(p.progress || 0) >= 100;
    // Tab filter
    if (activeFilter === 'in-progress' && (p.status !== 'in-progress' || isCompleted)) return false;
    if (activeFilter === 'under-review' && p.status !== 'under-review') return false;
    if (activeFilter === 'completed' && !isCompleted) return false;

    // Search filter
    if (searchTerm.trim()) {
      const q = searchTerm.toLowerCase();
      const matchTitle = (p.title || '').toLowerCase().includes(q);
      const matchDesc = (p.description || '').toLowerCase().includes(q);
      const matchType = (p.project_type || p.projectType || '').toLowerCase().includes(q);
      if (!matchTitle && !matchDesc && !matchType) return false;
    }

    return true;
  });

  // Sort projects
  const sortedProjects = [...filteredProjects].sort((a, b) => {
    if (sortBy === 'progress') {
      return (b.progress || 0) - (a.progress || 0);
    }
    // Default latest
    const timeA = new Date(a.created_at || 0).getTime() || 0;
    const timeB = new Date(b.created_at || 0).getTime() || 0;
    return timeB - timeA;
  });

  // Category Icon & styling resolver
  const getCategoryMeta = (type, title = '') => {
    const lowerType = (type || '').toLowerCase();
    const lowerTitle = (title || '').toLowerCase();

    if (lowerType.includes('web') || lowerTitle.includes('website') || lowerTitle.includes('store') || lowerTitle.includes('shop')) {
      return {
        icon: <CodeIcon size={20} color="#6366F1" />,
        className: 'web',
        label: 'Web Development',
        color: '#6366F1'
      };
    }
    if (lowerType.includes('graphic') || lowerTitle.includes('logo') || lowerTitle.includes('brand') || lowerTitle.includes('ui/ux') || lowerTitle.includes('app')) {
      return {
        icon: <EditIcon size={19} color="#DB2777" />,
        className: 'graphics',
        label: 'Graphics',
        color: '#DB2777'
      };
    }
    if (lowerType.includes('video') || lowerTitle.includes('video') || lowerTitle.includes('promotional') || lowerTitle.includes('reels')) {
      return {
        icon: <PlayVideoIcon size={20} color="#9333EA" />,
        className: 'videos',
        label: 'Videos',
        color: '#9333EA'
      };
    }
    if (lowerType.includes('seo') || lowerTitle.includes('seo') || lowerTitle.includes('rank')) {
      return {
        icon: <BarChartIcon size={20} color="#16A34A" />,
        className: 'seo',
        label: 'SEO',
        color: '#16A34A'
      };
    }

    return {
      icon: <CodeIcon size={20} color="#6366F1" />,
      className: 'web',
      label: type || 'Development',
      color: '#6366F1'
    };
  };

  // Status Badge Resolver
  const renderStatusBadge = (status, progress) => {
    if (status === 'completed' || Number(progress || 0) >= 100) {
      return <span className="my-project-status-badge status-completed">Completed</span>;
    }
    switch (status) {
      case 'in-progress':
        return <span className="my-project-status-badge status-in-progress">In Progress</span>;
      case 'under-review':
        return <span className="my-project-status-badge status-under-review">Under Review</span>;
      default:
        return <span className="my-project-status-badge status-pending">Pending</span>;
    }
  };

  // Client Name Resolver
  const getClientName = (proj) => {
    if (proj.clientName && proj.clientName !== 'Client') return proj.clientName;
    const cid = proj.client_id || proj.clientId;
    if (cid === 'client-awais') return 'Awais';
    if (cid === 'client-afshal') return 'Afshal';
    if (cid === 'client-1') return 'Ali Khan';
    return 'Client';
  };

  return (
    <div className="my-projects-container">
      {/* Top Header */}
      <div className="my-projects-header">
        <div className="my-projects-header-left">
          <h1>My Projects</h1>
          <p>Manage and track all your projects in one place.</p>
        </div>

        <div className="my-projects-header-actions">
          {onLogout && (
            <button
              type="button"
              className="my-projects-btn-logout"
              onClick={onLogout}
              title="Log Out of your account"
            >
              <span>🚪</span>
              <span>Log Out</span>
            </button>
          )}

          <button
            type="button"
            className="my-projects-btn-add"
            onClick={onOpenAddProject}
          >
            <PlusIcon size={17} color="#FFFFFF" />
            <span>Add Project</span>
          </button>
        </div>
      </div>

      {/* Filter Tabs */}
      <div className="my-projects-filter-pills">
        <button
          type="button"
          className={`my-projects-pill ${activeFilter === 'all' ? 'active' : ''}`}
          onClick={() => setActiveFilter('all')}
        >
          <span>All Projects</span>
          <span className="my-projects-pill-badge badge-all">{totalCount}</span>
        </button>

        <button
          type="button"
          className={`my-projects-pill ${activeFilter === 'in-progress' ? 'active' : ''}`}
          onClick={() => setActiveFilter('in-progress')}
        >
          <span>In Progress</span>
          <span className="my-projects-pill-badge badge-inprogress">{inProgressCount}</span>
        </button>

        <button
          type="button"
          className={`my-projects-pill ${activeFilter === 'under-review' ? 'active' : ''}`}
          onClick={() => setActiveFilter('under-review')}
        >
          <span>Under Review</span>
          <span className="my-projects-pill-badge badge-underreview">{underReviewCount}</span>
        </button>

        <button
          type="button"
          className={`my-projects-pill ${activeFilter === 'completed' ? 'active' : ''}`}
          onClick={() => setActiveFilter('completed')}
        >
          <span>Completed</span>
          <span className="my-projects-pill-badge badge-completed">{completedCount}</span>
        </button>
      </div>

      {/* Search and Dropdowns Bar */}
      <div className="my-projects-search-bar">
        <div className="my-projects-search-input-wrap">
          <span className="my-projects-search-icon">
            <SearchIcon size={17} />
          </span>
          <input
            type="text"
            className="my-projects-search-input"
            placeholder="Search projects..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>

        <button
          type="button"
          className="my-projects-dropdown-btn"
          onClick={() => {
            const nextFilter = activeFilter === 'all' ? 'in-progress' : (activeFilter === 'in-progress' ? 'completed' : 'all');
            setActiveFilter(nextFilter);
          }}
        >
          <FilterFunnelIcon size={15} color="#64748B" />
          <span>Filters</span>
          <ChevronDownIcon size={13} color="#94A3B8" />
        </button>

        <button
          type="button"
          className="my-projects-dropdown-btn"
          onClick={() => setSortBy(prev => prev === 'latest' ? 'progress' : 'latest')}
        >
          <SortArrowsIcon size={15} color="#64748B" />
          <span>{sortBy === 'latest' ? 'Latest' : 'Progress'}</span>
          <ChevronDownIcon size={13} color="#94A3B8" />
        </button>
      </div>

      {/* Projects List */}
      {sortedProjects.length === 0 ? (
        <div className="my-projects-empty">
          <div className="my-projects-empty-icon">
            <CodeIcon size={28} />
          </div>
          <h3>No projects found</h3>
          <p>Try adjusting your search query or create a new project.</p>
          <button
            type="button"
            className="my-projects-btn-add"
            onClick={onOpenAddProject}
          >
            <PlusIcon size={16} />
            <span>Create First Project</span>
          </button>
        </div>
      ) : (
        <div className="my-projects-list" ref={menuRef}>
          {sortedProjects.map((proj) => {
            const meta = getCategoryMeta(proj.project_type || proj.projectType, proj.title);
            const isMenuOpen = openMenuId === proj.id;
            const clientName = getClientName(proj);

            return (
              <div
                key={proj.id}
                className="my-project-card"
                onClick={() => onSelectProject(proj)}
              >
                {/* Top Row: Icon + Title + Meta + 3-dots */}
                <div className="my-project-card-top">
                  <div className={`my-project-icon-box ${meta.className}`}>
                    {meta.icon}
                  </div>

                  <div className="my-project-card-info">
                    <h3 className="my-project-title">{proj.title}</h3>
                    <div className="my-project-card-meta-row">
                      <span className={`my-project-cat-badge ${meta.className}`}>
                        {meta.label}
                      </span>
                      {renderStatusBadge(proj.status, proj.progress)}
                      {clientName && (
                        <span className="my-project-client-badge">
                          👤 {clientName}
                        </span>
                      )}
                    </div>
                  </div>

                  <div
                    className="my-project-card-top-right"
                    onClick={(e) => e.stopPropagation()}
                  >
                    <button
                      type="button"
                      className="my-project-dots-btn"
                      title="Project actions"
                      onClick={(e) => {
                        e.stopPropagation();
                        setOpenMenuId(isMenuOpen ? null : proj.id);
                      }}
                    >
                      <MoreVerticalIcon size={18} color="#64748B" />
                    </button>

                    {/* 3-dots Menu Dropdown with Edit and Delete */}
                    {isMenuOpen && (
                      <div className="my-project-dropdown-menu">
                        <button
                          type="button"
                          className="my-project-dropdown-item"
                          onClick={(e) => {
                            e.stopPropagation();
                            setOpenMenuId(null);
                            onEditProject(proj);
                          }}
                        >
                          <EditIcon size={14} color="#4F46E5" />
                          <span>Edit Project</span>
                        </button>
                        <button
                          type="button"
                          className="my-project-dropdown-item delete"
                          onClick={(e) => {
                            e.stopPropagation();
                            setOpenMenuId(null);
                            onDeleteProject(proj.id);
                          }}
                        >
                          <TrashIcon size={14} color="#EF4444" />
                          <span>Delete Project</span>
                        </button>
                      </div>
                    )}
                  </div>
                </div>

                {/* Description */}
                <p className="my-project-desc">{proj.description}</p>

                {/* Progress Bar */}
                <div className="my-project-progress-wrap">
                  <div className="my-project-progress-track">
                    <div
                      className="my-project-progress-fill"
                      style={{ width: `${proj.progress || 0}%`, transition: 'width 0.35s ease' }}
                    />
                  </div>
                  <span className="my-project-progress-pct">{proj.progress || 0}%</span>
                </div>

                {/* Footer Row: Admin Lead + Deadline */}
                <div className="my-project-card-footer">
                  <div className="my-project-team-row" style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <LetterAvatar name="Abdullah" size={24} />
                    <span className="my-project-team-count" style={{ fontWeight: 600, color: '#475569', fontSize: '12px' }}>
                      Admin: Abdullah
                    </span>
                  </div>

                  <div className="my-project-deadline-badge">
                    <CalendarIcon size={14} color="#94A3B8" />
                    <span>{proj.deadline || '25 Oct 2024'}</span>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
