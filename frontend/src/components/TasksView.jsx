import React, { useState, useMemo } from 'react';
import './TasksView.css';
import LetterAvatar from './LetterAvatar';

// SVG Icons
function CheckSquareIcon({ size = 20, color = 'currentColor' }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
      <polyline points="9 11 12 14 22 4" />
      <path d="M21 12v7a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11" />
    </svg>
  );
}

function PlusIcon({ size = 16, color = 'currentColor' }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round">
      <line x1="12" y1="5" x2="12" y2="19" />
      <line x1="5" y1="12" x2="19" y2="12" />
    </svg>
  );
}

function SearchIcon({ size = 16, color = '#94a3b8' }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="11" cy="11" r="8" />
      <line x1="21" y1="21" x2="16.65" y2="16.65" />
    </svg>
  );
}

function CalendarIcon({ size = 14, color = '#64748b' }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <rect x="3" y="4" width="18" height="18" rx="2" ry="2" />
      <line x1="16" y1="2" x2="16" y2="6" />
      <line x1="8" y1="2" x2="8" y2="6" />
      <line x1="3" y1="10" x2="21" y2="10" />
    </svg>
  );
}

function CheckCircleIcon({ size = 14, color = '#059669' }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="12" cy="12" r="10" />
      <polyline points="9 12 11 14 15 10" />
    </svg>
  );
}

function TrashIcon({ size = 14, color = '#ef4444' }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <polyline points="3 6 5 6 21 6" />
      <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2" />
      <line x1="10" y1="11" x2="10" y2="17" />
      <line x1="14" y1="11" x2="14" y2="17" />
    </svg>
  );
}

function FolderSmallIcon({ size = 13, color = '#6366f1' }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M4 20h16a2 2 0 0 0 2-2V8a2 2 0 0 0-2-2h-7.93a2 2 0 0 1-1.66-.9l-.82-1.2A2 2 0 0 0 7.93 3H4a2 2 0 0 0-2 2v13c0 1.1.9 2 2 2Z" />
    </svg>
  );
}

function formatCompletionDateTime(timestamp) {
  if (!timestamp) return null;
  try {
    const d = new Date(timestamp);
    if (isNaN(d.getTime())) return null;

    const now = new Date();
    const isToday = d.toDateString() === now.toDateString();

    const timeStr = d.toLocaleTimeString('en-US', {
      hour: 'numeric',
      minute: '2-digit',
      hour12: true
    });

    if (isToday) {
      return `Today at ${timeStr}`;
    }

    const dateStr = d.toLocaleDateString('en-GB', {
      day: 'numeric',
      month: 'short',
      year: 'numeric'
    });
    return `${dateStr} at ${timeStr}`;
  } catch (e) {
    return null;
  }
}

export default function TasksView({
  tasks = [],
  projects = [],
  onToggleTask,
  onAddTask,
  onDeleteTask,
  onSelectProject,
  currentUser
}) {
  const [statusFilter, setStatusFilter] = useState('all'); // 'all', 'pending', 'completed'
  const [selectedProjectId, setSelectedProjectId] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [isAddingTask, setIsAddingTask] = useState(false);

  // New task form state
  const [newTaskTitle, setNewTaskTitle] = useState('');
  const [newTaskProjectId, setNewTaskProjectId] = useState(() => (projects[0]?.id || ''));
  const [newTaskDueDate, setNewTaskDueDate] = useState(() => {
    return new Date(Date.now() + 7 * 86400000).toLocaleDateString('en-GB');
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Map projects for easy title lookup
  const projectMap = useMemo(() => {
    const m = new Map();
    for (const p of projects) {
      m.set(p.id, p);
    }
    return m;
  }, [projects]);

  // Filtered tasks
  const filteredTasks = useMemo(() => {
    return tasks.filter((t) => {
      // Status filter
      if (statusFilter === 'pending' && t.completed) return false;
      if (statusFilter === 'completed' && !t.completed) return false;

      // Project filter
      if (selectedProjectId !== 'all' && t.project_id !== selectedProjectId && t.projectId !== selectedProjectId) {
        return false;
      }

      // Search query
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase().trim();
        const titleMatch = (t.title || '').toLowerCase().includes(q);
        const projTitle = projectMap.get(t.project_id || t.projectId)?.title || '';
        const projMatch = projTitle.toLowerCase().includes(q);
        if (!titleMatch && !projMatch) return false;
      }

      return true;
    });
  }, [tasks, statusFilter, selectedProjectId, searchQuery, projectMap]);

  // Metrics
  const totalCount = tasks.length;
  const completedCount = tasks.filter(t => t.completed).length;
  const pendingCount = totalCount - completedCount;
  const completionRate = totalCount > 0 ? Math.round((completedCount / totalCount) * 100) : 0;

  const handleCreateTask = async (e) => {
    e.preventDefault();
    if (!newTaskTitle.trim()) return;

    setIsSubmitting(true);
    try {
      const targetProj = projectMap.get(newTaskProjectId) || projects[0];
      if (onAddTask) {
        await onAddTask({
          projectId: targetProj?.id || null,
          clientId: targetProj?.client_id || targetProj?.clientId || null,
          title: newTaskTitle.trim(),
          dueDate: newTaskDueDate || '25/10/2026'
        });
      }
      setNewTaskTitle('');
      setIsAddingTask(false);
    } catch (err) {
      console.error('Failed to create task:', err);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="tasks-view-container">
      {/* Top Banner / Header */}
      <div className="tasks-view-header">
        <div className="tasks-view-header-left">
          <div className="tasks-header-icon-box">
            <CheckSquareIcon size={24} color="#4F46E5" />
          </div>
          <div>
            <h1 className="tasks-view-title">Task Management & To-Do List</h1>
            <p className="tasks-view-subtitle">
              Persistent database storage with real-time completion timestamps & progress metrics
            </p>
          </div>
        </div>

        <button
          type="button"
          className="tasks-view-add-btn"
          onClick={() => setIsAddingTask(!isAddingTask)}
        >
          <PlusIcon size={16} />
          <span>{isAddingTask ? 'Close Form' : 'Add New Task'}</span>
        </button>
      </div>

      {/* Metrics Row */}
      <div className="tasks-metrics-grid">
        <div className="task-metric-card">
          <div className="task-metric-label">Total Tasks</div>
          <div className="task-metric-val">{totalCount}</div>
          <div className="task-metric-sub">Across all connected projects</div>
        </div>

        <div className="task-metric-card pending">
          <div className="task-metric-label">Pending Tasks</div>
          <div className="task-metric-val" style={{ color: '#d97706' }}>{pendingCount}</div>
          <div className="task-metric-sub">Require completion or review</div>
        </div>

        <div className="task-metric-card completed">
          <div className="task-metric-label">Completed Tasks</div>
          <div className="task-metric-val" style={{ color: '#059669' }}>{completedCount}</div>
          <div className="task-metric-sub">Verified & ticked with timestamp</div>
        </div>

        <div className="task-metric-card">
          <div className="task-metric-label">Completion Rate</div>
          <div className="task-metric-val" style={{ color: '#4f46e5' }}>{completionRate}%</div>
          <div className="task-metric-progress-track">
            <div
              className="task-metric-progress-fill"
              style={{ width: `${completionRate}%` }}
            />
          </div>
        </div>
      </div>

      {/* Add Task Form Modal / Inline Card */}
      {isAddingTask && (
        <form onSubmit={handleCreateTask} className="task-new-form-card">
          <div className="task-new-form-title">
            <span>+ Create New Project Task</span>
            <button
              type="button"
              className="task-form-close-x"
              onClick={() => setIsAddingTask(false)}
            >
              ✕
            </button>
          </div>

          <div className="task-new-form-grid">
            <div className="task-form-group flex-2">
              <label>Task Title *</label>
              <input
                type="text"
                placeholder="e.g. Design Header Graphics, Set up payment gateway..."
                value={newTaskTitle}
                onChange={(e) => setNewTaskTitle(e.target.value)}
                autoFocus
                required
              />
            </div>

            <div className="task-form-group flex-1">
              <label>Assign to Project *</label>
              <select
                value={newTaskProjectId}
                onChange={(e) => setNewTaskProjectId(e.target.value)}
              >
                {projects.map((p) => (
                  <option key={p.id} value={p.id}>
                    {p.title}
                  </option>
                ))}
              </select>
            </div>

            <div className="task-form-group flex-1">
              <label>Due Date</label>
              <input
                type="text"
                placeholder="DD/MM/YYYY"
                value={newTaskDueDate}
                onChange={(e) => setNewTaskDueDate(e.target.value)}
              />
            </div>
          </div>

          <div className="task-new-form-actions">
            <button
              type="button"
              className="btn-cancel"
              onClick={() => setIsAddingTask(false)}
            >
              Cancel
            </button>
            <button
              type="submit"
              className="btn-submit"
              disabled={isSubmitting || !newTaskTitle.trim()}
            >
              {isSubmitting ? 'Saving to DB...' : 'Save Task in Database'}
            </button>
          </div>
        </form>
      )}

      {/* Controls & Filter Bar */}
      <div className="tasks-control-bar">
        {/* Search */}
        <div className="tasks-search-wrap">
          <SearchIcon size={16} />
          <input
            type="text"
            placeholder="Search tasks by title or project..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
          {searchQuery && (
            <button
              type="button"
              className="tasks-search-clear"
              onClick={() => setSearchQuery('')}
            >
              ✕
            </button>
          )}
        </div>

        {/* Project Selector */}
        <div className="tasks-project-filter">
          <FolderSmallIcon size={14} color="#6366f1" />
          <select
            value={selectedProjectId}
            onChange={(e) => setSelectedProjectId(e.target.value)}
          >
            <option value="all">All Projects ({projects.length})</option>
            {projects.map((p) => (
              <option key={p.id} value={p.id}>
                {p.title}
              </option>
            ))}
          </select>
        </div>

        {/* Status Filter Tabs */}
        <div className="tasks-status-tabs">
          <button
            type="button"
            className={`tasks-status-tab ${statusFilter === 'all' ? 'active' : ''}`}
            onClick={() => setStatusFilter('all')}
          >
            All ({totalCount})
          </button>
          <button
            type="button"
            className={`tasks-status-tab ${statusFilter === 'pending' ? 'active' : ''}`}
            onClick={() => setStatusFilter('pending')}
          >
            Pending ({pendingCount})
          </button>
          <button
            type="button"
            className={`tasks-status-tab ${statusFilter === 'completed' ? 'active' : ''}`}
            onClick={() => setStatusFilter('completed')}
          >
            Completed ({completedCount})
          </button>
        </div>
      </div>

      {/* Task Rows List */}
      <div className="tasks-main-list">
        {filteredTasks.length === 0 ? (
          <div className="tasks-empty-state">
            <div className="tasks-empty-icon">✓</div>
            <h3>No tasks match your filter criteria</h3>
            <p>
              {searchQuery || selectedProjectId !== 'all' || statusFilter !== 'all'
                ? 'Try adjusting your search terms or filter selection.'
                : 'Click "+ Add New Task" to create your first persistent task.'}
            </p>
          </div>
        ) : (
          filteredTasks.map((t) => {
            const proj = projectMap.get(t.project_id || t.projectId);
            const completedDateTime = t.completed ? formatCompletionDateTime(t.completed_at || t.completedAt) : null;

            return (
              <div
                key={t.id}
                className={`task-item-card ${t.completed ? 'is-completed' : ''}`}
              >
                {/* Left side: Checkbox & Title info */}
                <div className="task-item-main">
                  <input
                    type="checkbox"
                    className="task-item-checkbox"
                    checked={Boolean(t.completed)}
                    onChange={() => onToggleTask && onToggleTask(t.id, t.completed)}
                    title={t.completed ? 'Mark as Incomplete' : 'Mark as Completed'}
                  />

                  <div className="task-item-content">
                    <div className="task-item-title-row">
                      <span
                        className={`task-item-title ${t.completed ? 'completed' : ''}`}
                        onClick={() => onToggleTask && onToggleTask(t.id, t.completed)}
                      >
                        {t.title}
                      </span>

                      {proj && (
                        <button
                          type="button"
                          className="task-item-project-tag"
                          title="Open project detail"
                          onClick={() => onSelectProject && onSelectProject(proj)}
                        >
                          <FolderSmallIcon size={12} color="#6366f1" />
                          <span>{proj.title}</span>
                        </button>
                      )}
                    </div>

                    {/* Completion timestamp badge if ticked */}
                    {t.completed && (
                      <div className="task-completion-banner">
                        <CheckCircleIcon size={13} color="#059669" />
                        <span className="task-completion-text">
                          <strong>Ticked on:</strong> {completedDateTime || 'Completed'}
                        </span>
                      </div>
                    )}
                  </div>
                </div>

                {/* Right side: Meta details */}
                <div className="task-item-meta">
                  <div className="task-meta-due" title="Due Date">
                    <CalendarIcon size={13} />
                    <span>Due: {t.due_date || t.dueDate || '18/10/2026'}</span>
                  </div>

                  <div className="task-meta-assignee" title={`Assigned to ${t.assigned_name || 'Abdullah'}`}>
                    <LetterAvatar name={t.assigned_name || 'Abdullah'} size={24} />
                    <span className="task-assignee-name">{t.assigned_name || 'Abdullah'}</span>
                  </div>

                  {onDeleteTask && (
                    <button
                      type="button"
                      className="task-delete-btn"
                      title="Delete task from database"
                      onClick={() => {
                        if (window.confirm(`Delete task "${t.title}" from database?`)) {
                          onDeleteTask(t.id);
                        }
                      }}
                    >
                      <TrashIcon size={14} color="#94a3b8" />
                    </button>
                  )}
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
}
