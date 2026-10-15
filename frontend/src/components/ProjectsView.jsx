import React, { useState } from 'react';

export default function ProjectsView({ 
  projects, 
  onSelectProject, 
  onOpenNewProject, 
  isAdmin, 
  onToggleDeliverable,
  clients
}) {
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [clientFilter, setClientFilter] = useState('all');

  const filteredProjects = projects.filter(p => {
    const matchesSearch = 
      p.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      p.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (p.companyName && p.companyName.toLowerCase().includes(searchTerm.toLowerCase()));
    
    const effectiveStatus = (p.status === 'completed' || Number(p.progress) >= 100) ? 'completed' : p.status;
    const matchesStatus = statusFilter === 'all' || effectiveStatus === statusFilter;
    const matchesClient = clientFilter === 'all' || p.clientId === clientFilter;

    return matchesSearch && matchesStatus && matchesClient;
  });

  const getStatusBadge = (status, progress) => {
    if (status === 'completed' || Number(progress) >= 100) {
      return <span className="badge-pill status-completed">Completed</span>;
    }
    switch (status) {
      case 'in-progress':
        return <span className="badge-pill status-in-progress">In Progress</span>;
      case 'under-review':
        return <span className="badge-pill status-under-review">Under Review</span>;
      default:
        return <span className="badge-pill status-pending">Pending</span>;
    }
  };

  return (
    <div>
      {/* Header & Controls */}
      <div className="section-header">
        <div className="section-header-title">
          <h2>{isAdmin ? 'All Agency Client Projects' : 'Assigned Projects'}</h2>
          <span className="badge-count">{filteredProjects.length}</span>
        </div>

        <button className="btn btn-primary btn-sm" onClick={onOpenNewProject}>
          {isAdmin ? '+ Create Project' : '+ Add Project'}
        </button>
      </div>

      {/* Filter and Search Bar */}
      <div className="filter-bar">
        <div className="search-input-wrapper">
          <input
            type="text"
            className="input-field"
            placeholder="Search projects, clients, or keywords..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>

        <select 
          className="select-field"
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
        >
          <option value="all">All Statuses</option>
          <option value="in-progress">In Progress</option>
          <option value="under-review">Under Review</option>
          <option value="completed">Completed</option>
          <option value="pending">Pending Kickoff</option>
        </select>

        {isAdmin && clients && (
          <select 
            className="select-field"
            value={clientFilter}
            onChange={(e) => setClientFilter(e.target.value)}
          >
            <option value="all">All Clients</option>
            {clients.map(c => (
              <option key={c.id} value={c.id}>{c.company}</option>
            ))}
          </select>
        )}
      </div>

      {/* Projects Grid */}
      {filteredProjects.length === 0 ? (
        <div style={{
          textAlign: 'center',
          padding: '48px 24px',
          background: 'var(--bg-surface)',
          borderRadius: 'var(--radius-lg)',
          border: '1px solid var(--border-subtle)',
          color: 'var(--text-muted)'
        }}>
          <p>No projects matched your criteria.</p>
          <button 
            className="btn btn-primary btn-sm" 
            style={{ marginTop: '12px' }} 
            onClick={onOpenNewProject}
          >
            {isAdmin ? '+ Create First Project' : '+ Submit First Project Request'}
          </button>
        </div>
      ) : (
        <div className="projects-grid">
          {filteredProjects.map(proj => {
            const completedDelivs = (proj.deliverables || []).filter(d => d.completed).length;
            const totalDelivs = (proj.deliverables || []).length;

            return (
              <div key={proj.id} className="project-card">
                <div>
                  <div className="project-card-top">
                    <span className="project-client-name">
                      {proj.companyName || 'Client Project'}
                    </span>
                    {getStatusBadge(proj.status, proj.progress)}
                  </div>

                  <h3 className="project-card-title">{proj.title}</h3>
                  <p className="project-card-desc">{proj.description}</p>

                  {/* Progress bar */}
                  <div className="progress-container">
                    <div className="progress-info">
                      <span>Milestones: {completedDelivs}/{totalDelivs}</span>
                      <span style={{ fontFamily: 'var(--font-mono)', fontWeight: 700, color: 'var(--text-primary)' }}>
                        {proj.progress}%
                      </span>
                    </div>
                    <div className="progress-track">
                      <div 
                        className="progress-fill" 
                        style={{ width: `${proj.progress}%` }}
                      ></div>
                    </div>
                  </div>

                  {/* Open changes alerts */}
                  {proj.openChangesCount > 0 && (
                    <div style={{
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      fontSize: '12px',
                      color: proj.criticalChangesCount > 0 ? 'var(--critical-text)' : 'var(--high-text)',
                      background: proj.criticalChangesCount > 0 ? 'var(--critical-bg)' : 'var(--high-bg)',
                      border: `1px solid ${proj.criticalChangesCount > 0 ? 'var(--critical-border)' : 'var(--high-border)'}`,
                      padding: '6px 12px',
                      borderRadius: 'var(--radius-md)',
                      marginBottom: '14px',
                      fontWeight: 600
                    }}>
                      <span>{proj.openChangesCount} Revision Request{proj.openChangesCount > 1 ? 's' : ''}</span>
                      {proj.criticalChangesCount > 0 && (
                        <span className="badge-pill urgency-critical" style={{ fontSize: '10px' }}>
                          Critical
                        </span>
                      )}
                    </div>
                  )}
                </div>

                {/* Bottom Meta & Actions (No budget / contract value displayed) */}
                <div>
                  <div className="project-card-meta">
                    <span>Deadline Target:</span>
                    <span style={{ fontWeight: 600, color: 'var(--text-primary)' }}>
                      {proj.deadline}
                    </span>
                  </div>

                  <div className="project-card-actions">
                    <button 
                      className="btn btn-secondary btn-sm"
                      style={{ width: '100%' }}
                      onClick={() => onSelectProject(proj)}
                    >
                      Open Notepad & Workspace →
                    </button>
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
