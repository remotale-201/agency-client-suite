import React, { useState } from 'react';

export default function ChangesFeed({ 
  changes, 
  onUpdateStatus, 
  onSelectProjectById, 
  isAdmin, 
  onOpenNewChange 
}) {
  const [urgencyFilter, setUrgencyFilter] = useState('all');
  const [statusFilter, setStatusFilter] = useState('all');
  const [search, setSearch] = useState('');
  const [resolutionDrafts, setResolutionDrafts] = useState({});

  const filteredChanges = changes.filter(c => {
    const matchesUrgency = urgencyFilter === 'all' || c.urgency === urgencyFilter;
    const matchesStatus = statusFilter === 'all' || c.status === statusFilter;
    const matchesSearch = 
      (c.title && c.title.toLowerCase().includes(search.toLowerCase())) ||
      (c.description && c.description.toLowerCase().includes(search.toLowerCase())) ||
      (c.companyName && c.companyName.toLowerCase().includes(search.toLowerCase())) ||
      (c.projectTitle && c.projectTitle.toLowerCase().includes(search.toLowerCase()));

    return matchesUrgency && matchesStatus && matchesSearch;
  });

  const getUrgencyBadge = (urgency) => {
    switch (urgency) {
      case 'critical':
        return <span className="badge-pill urgency-critical">Critical</span>;
      case 'high':
        return <span className="badge-pill urgency-high">High Priority</span>;
      case 'normal':
        return <span className="badge-pill urgency-normal">Normal</span>;
      case 'low':
      default:
        return <span className="badge-pill urgency-low">Low</span>;
    }
  };

  const getStatusBadge = (status) => {
    switch (status) {
      case 'completed':
        return <span className="badge-pill status-completed">Completed</span>;
      case 'in-progress':
        return <span className="badge-pill status-in-progress">In Progress</span>;
      case 'in-review':
        return <span className="badge-pill status-under-review">Under Review</span>;
      default:
        return <span className="badge-pill status-pending">Pending</span>;
    }
  };

  const handleStatusChange = (changeId, newStatus) => {
    const note = resolutionDrafts[changeId] || '';
    onUpdateStatus(changeId, newStatus, note);
  };

  return (
    <div>
      {/* Header */}
      <div className="section-header">
        <div className="section-header-title">
          <h2>Client Revision & Change Feed</h2>
          <span className="badge-count">{filteredChanges.length}</span>
        </div>

        {!isAdmin && (
          <button className="btn btn-primary btn-sm" onClick={onOpenNewChange}>
            + Request New Change
          </button>
        )}
      </div>

      {/* Filter and Search Bar */}
      <div className="filter-bar">
        <div className="search-input-wrapper">
          <input
            type="text"
            className="input-field"
            placeholder="Search by change notes, project, or client..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>

        <select 
          className="select-field"
          value={urgencyFilter}
          onChange={(e) => setUrgencyFilter(e.target.value)}
        >
          <option value="all">All Urgency Levels</option>
          <option value="critical">Critical Urgency</option>
          <option value="high">High Priority</option>
          <option value="normal">Normal</option>
          <option value="low">Low Priority</option>
        </select>

        <select 
          className="select-field"
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
        >
          <option value="all">All Statuses</option>
          <option value="pending">Pending</option>
          <option value="in-review">Under Review</option>
          <option value="in-progress">In Progress</option>
          <option value="completed">Completed</option>
        </select>
      </div>

      {/* Changes List */}
      {filteredChanges.length === 0 ? (
        <div style={{
          textAlign: 'center',
          padding: '48px 24px',
          background: 'var(--bg-surface)',
          borderRadius: 'var(--radius-lg)',
          border: '1px solid var(--border-subtle)',
          color: 'var(--text-muted)'
        }}>
          <p>No revision requests matching your filters.</p>
        </div>
      ) : (
        <div className="changes-container">
          {filteredChanges.map(change => (
            <div 
              key={change.id} 
              className={`change-item-card ${change.urgency === 'critical' && change.status !== 'completed' ? 'is-critical' : ''}`}
            >
              <div className="change-header-row">
                <div className="change-title-block">
                  <h3>{change.title}</h3>
                  <p>
                    <strong>{change.companyName}</strong> • {change.projectTitle}
                  </p>
                </div>

                <div className="change-badges-row">
                  {getUrgencyBadge(change.urgency)}
                  {getStatusBadge(change.status)}
                </div>
              </div>

              {change.description && (
                <div className="change-desc">
                  {change.description}
                </div>
              )}

              {change.resolutionNote && (
                <div style={{
                  fontSize: '12px',
                  color: '#15803d',
                  background: '#f0fdf4',
                  border: '1px solid #bbf7d0',
                  padding: '8px 12px',
                  borderRadius: 'var(--radius-md)'
                }}>
                  <strong>Agency Note:</strong> {change.resolutionNote}
                </div>
              )}

              <div className="change-footer-row">
                <div className="change-meta-left">
                  <span>Requested By: <strong>{change.requestedBy || 'Client'}</strong></span>
                  {change.deadline && (
                    <span style={{ 
                      color: change.urgency === 'critical' ? '#b91c1c' : 'inherit',
                      fontWeight: change.urgency === 'critical' ? 700 : 500
                    }}>
                      Target Deadline: <strong>{change.deadline}</strong>
                    </span>
                  )}
                  <span>Date: {new Date(change.createdAt).toLocaleDateString()}</span>
                </div>

                <div className="change-actions-right">
                  <button 
                    className="btn btn-outline btn-sm"
                    onClick={() => onSelectProjectById(change.projectId)}
                  >
                    Open Project Notepad
                  </button>

                  {isAdmin && (
                    <select
                      className="select-field"
                      style={{ padding: '5px 10px', fontSize: '12px' }}
                      value={change.status}
                      onChange={(e) => handleStatusChange(change.id, e.target.value)}
                    >
                      <option value="pending">Pending</option>
                      <option value="in-review">In Review</option>
                      <option value="in-progress">In Progress</option>
                      <option value="completed">Mark Completed</option>
                    </select>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
