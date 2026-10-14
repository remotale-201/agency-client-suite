import React, { useState, useEffect } from 'react';
import { api } from '../api';

export default function ProjectNotepadWorkspace({ 
  project, 
  notepad, 
  changes, 
  onSaveNotepad, 
  onCreateChange, 
  onUpdateChangeStatus, 
  onToggleDeliverable, 
  onBack, 
  isAdmin, 
  currentUser 
}) {
  const [content, setContent] = useState(notepad?.content || '');
  const [saveStatus, setSaveStatus] = useState('Saved');
  const [lastSavedTime, setLastSavedTime] = useState(notepad?.updatedAt ? new Date(notepad.updatedAt).toLocaleTimeString() : 'Just now');

  // Client Points State
  const [points, setPoints] = useState([]);
  const [newPointText, setNewPointText] = useState('');
  const [isAddingPoint, setIsAddingPoint] = useState(false);

  // Change request form state
  const [changeTitle, setChangeTitle] = useState('');
  const [changeDescription, setChangeDescription] = useState('');
  const [changeUrgency, setChangeUrgency] = useState('normal'); // critical, high, normal, low
  const [changeDeadline, setChangeDeadline] = useState('');
  const [isSubmittingChange, setIsSubmittingChange] = useState(false);

  useEffect(() => {
    if (notepad) {
      setContent(notepad.content || '');
      setSaveStatus('Saved');
      if (notepad.updatedAt) {
        setLastSavedTime(new Date(notepad.updatedAt).toLocaleTimeString());
      }
    }
  }, [notepad]);

  // Load points for this project
  useEffect(() => {
    if (project?.id) {
      api.getPoints(project.id)
        .then(setPoints)
        .catch(() => setPoints([]));
    }
  }, [project?.id]);

  const handleContentChange = (e) => {
    setContent(e.target.value);
    setSaveStatus('Unsaved');
  };

  const handleManualSave = async () => {
    setSaveStatus('Saving...');
    try {
      await onSaveNotepad(project.id, content, currentUser?.name || (isAdmin ? 'Agency Admin' : 'Client'));
      setSaveStatus('Saved');
      setLastSavedTime(new Date().toLocaleTimeString());
    } catch (err) {
      setSaveStatus('Error');
    }
  };

  const handleAddPoint = async (e) => {
    if (e) e.preventDefault();
    if (!newPointText.trim()) return;

    setIsAddingPoint(true);
    try {
      const added = await api.addPoint(
        project.id, 
        newPointText.trim(), 
        currentUser?.name || (isAdmin ? 'Agency Admin' : 'Client')
      );
      setPoints(prev => [...prev, added]);
      setNewPointText('');
    } catch (err) {
      console.error('Error adding point:', err);
    } finally {
      setIsAddingPoint(false);
    }
  };

  const handleTogglePoint = async (pointId, currentCompleted) => {
    try {
      const updated = await api.togglePoint(project.id, pointId, !currentCompleted);
      setPoints(prev => prev.map(p => p.id === pointId ? { ...p, completed: !currentCompleted } : p));
    } catch (err) {
      console.error('Error toggling point:', err);
    }
  };

  const handleDeletePoint = async (pointId) => {
    try {
      await api.deletePoint(project.id, pointId);
      setPoints(prev => prev.filter(p => p.id !== pointId));
    } catch (err) {
      console.error('Error deleting point:', err);
    }
  };

  const handleSubmitChange = async (e) => {
    e.preventDefault();
    if (!changeTitle.trim()) return;

    setIsSubmittingChange(true);
    try {
      await onCreateChange({
        projectId: project.id,
        clientId: project.clientId,
        title: changeTitle,
        description: changeDescription,
        urgency: changeUrgency,
        deadline: changeDeadline,
        requestedBy: currentUser?.name || (isAdmin ? 'Agency Admin' : 'Client')
      });

      setChangeTitle('');
      setChangeDescription('');
      setChangeUrgency('normal');
      setChangeDeadline('');
    } finally {
      setIsSubmittingChange(false);
    }
  };

  const insertTemplate = (type) => {
    let template = '';
    const dateStr = new Date().toLocaleDateString();
    if (type === 'revision') {
      template = `\n\n### Revision Request (${dateStr})\n- Component: [Specify Header / Modal / Button]\n- Current Behavior: [Describe issue]\n- Expected Behavior: [Describe desired result]\n- Priority: Normal`;
    } else if (type === 'feedback') {
      template = `\n\n### Meeting & Review Notes (${dateStr})\n1. Design alignment complete.\n2. Assets pending review.\n3. Next check-in scheduled for Friday.`;
    } else if (type === 'bug') {
      template = `\n\n### Issue / Bug Report (${dateStr})\n- URL/Screen: [Page link]\n- Steps to reproduce:\n  1. Open page\n  2. Click button\n- Expected: `;
    }

    setContent(prev => prev + template);
    setSaveStatus('Unsaved');
  };

  const projectChanges = changes.filter(c => c.projectId === project.id);
  const completedPointsCount = points.filter(p => p.completed).length;

  return (
    <div className="workspace-wrapper">
      {/* Workspace Header */}
      <div className="workspace-header">
        <div className="workspace-header-top">
          <div>
            <button 
              className="btn btn-outline btn-sm" 
              onClick={onBack}
              style={{ marginBottom: '12px' }}
            >
              ← Back to Projects
            </button>
            <div className="workspace-title-box">
              <h2>{project.title}</h2>
              <p style={{ color: 'var(--text-muted)', fontSize: '13px' }}>
                Client: <strong style={{ color: 'var(--text-primary)' }}>{project.companyName || 'Client'}</strong> • Target Deadline: <strong style={{ color: 'var(--text-primary)' }}>{project.deadline}</strong>
              </p>
            </div>
          </div>

          <div className="workspace-links">
            {project.links?.figma && (
              <a href={project.links.figma} target="_blank" rel="noreferrer" className="link-chip">
                Figma Board ↗
              </a>
            )}
            {project.links?.staging && (
              <a href={project.links.staging} target="_blank" rel="noreferrer" className="link-chip">
                Live Staging ↗
              </a>
            )}
            {project.links?.drive && (
              <a href={project.links.drive} target="_blank" rel="noreferrer" className="link-chip">
                Assets Drive ↗
              </a>
            )}
          </div>
        </div>

        {/* Deliverables Progress bar */}
        <div className="progress-container" style={{ margin: 0 }}>
          <div className="progress-info">
            <span>Overall Milestone Progress</span>
            <span style={{ fontFamily: 'var(--font-mono)', fontWeight: 700 }}>
              {project.progress}% Complete
            </span>
          </div>
          <div className="progress-track">
            <div className="progress-fill" style={{ width: `${project.progress}%` }}></div>
          </div>
        </div>
      </div>

      {/* Main Workspace Split Grid */}
      <div className="workspace-grid">
        {/* Left Column: Dedicated Notepage & Client Action Points */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
          
          {/* 1. Client Structured Points (Client Points Tracker) */}
          <div className="notepad-card">
            <div className="notepad-header">
              <div>
                <div className="notepad-title">Client Feedback & Action Points</div>
                <div style={{ fontSize: '12px', color: 'var(--text-muted)', marginTop: '2px' }}>
                  Mention specific points or requirements for the agency to review
                </div>
              </div>
              <span className="badge-count">
                {completedPointsCount}/{points.length} Resolved
              </span>
            </div>

            {/* Add Point Form */}
            <form onSubmit={handleAddPoint} style={{ display: 'flex', gap: '8px' }}>
              <input
                type="text"
                className="form-input"
                placeholder="Mention a specific point (e.g., Update header nav on iPad, fix button padding)..."
                value={newPointText}
                onChange={(e) => setNewPointText(e.target.value)}
                style={{ flex: 1 }}
              />
              <button 
                type="submit" 
                className="btn btn-primary btn-sm"
                disabled={isAddingPoint || !newPointText.trim()}
              >
                + Add Point
              </button>
            </form>

            {/* List of Points */}
            {points.length === 0 ? (
              <div style={{
                padding: '16px',
                textAlign: 'center',
                color: 'var(--text-muted)',
                fontSize: '13px',
                background: 'var(--bg-surface-elevated)',
                borderRadius: 'var(--radius-md)',
                border: '1px solid var(--border-subtle)'
              }}>
                No points mentioned yet. Type a point above to log feedback for this project.
              </div>
            ) : (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                {points.map((pt, idx) => (
                  <div 
                    key={pt.id}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      padding: '10px 14px',
                      background: pt.completed ? 'var(--normal-bg)' : 'var(--bg-surface)',
                      border: `1px solid ${pt.completed ? 'var(--normal-border)' : 'var(--border-subtle)'}`,
                      borderRadius: 'var(--radius-md)',
                      transition: 'all 0.15s ease',
                      gap: '12px'
                    }}
                  >
                    <div style={{ display: 'flex', alignItems: 'center', gap: '10px', flex: 1 }}>
                      <input 
                        type="checkbox" 
                        checked={pt.completed} 
                        onChange={() => handleTogglePoint(pt.id, pt.completed)}
                        style={{ accentColor: 'var(--accent-primary)', width: '16px', height: '16px', cursor: 'pointer' }}
                      />
                      <span style={{ 
                        fontSize: '13px', 
                        fontWeight: 600,
                        color: pt.completed ? 'var(--text-muted)' : 'var(--text-primary)',
                        textDecoration: pt.completed ? 'line-through' : 'none'
                      }}>
                        Point {idx + 1}: {pt.text}
                      </span>
                    </div>

                    <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                      <span style={{ fontSize: '11px', color: 'var(--text-muted)', whiteSpace: 'nowrap' }}>
                        By {pt.createdBy || 'Client'}
                      </span>
                      <button 
                        type="button" 
                        onClick={() => handleDeletePoint(pt.id)}
                        style={{ background: 'none', border: 'none', color: 'var(--critical-text)', cursor: 'pointer', fontWeight: 700 }}
                      >
                        ✕
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* 2. Dedicated Project Notepage / Notepad */}
          <div className="notepad-card">
            <div className="notepad-header">
              <div className="notepad-title">
                Dedicated Project Notepage
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                <span className="notepad-status">
                  {saveStatus === 'Saving...' ? 'Saving...' : `Saved at ${lastSavedTime}`}
                </span>
                <button 
                  className={`btn ${saveStatus === 'Unsaved' ? 'btn-primary' : 'btn-secondary'} btn-sm`}
                  onClick={handleManualSave}
                >
                  {saveStatus === 'Unsaved' ? 'Save Changes' : 'Saved'}
                </button>
              </div>
            </div>

            {/* Template Shortcuts */}
            <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
              <span style={{ fontSize: '12px', color: 'var(--text-muted)', alignSelf: 'center' }}>
                Quick helpers:
              </span>
              <button 
                type="button" 
                className="btn btn-outline btn-sm"
                onClick={() => insertTemplate('revision')}
              >
                + Revision Request
              </button>
              <button 
                type="button" 
                className="btn btn-outline btn-sm"
                onClick={() => insertTemplate('feedback')}
              >
                + Review Notes
              </button>
              <button 
                type="button" 
                className="btn btn-outline btn-sm"
                onClick={() => insertTemplate('bug')}
              >
                + Bug Report
              </button>
            </div>

            <textarea
              className="notepad-editor"
              value={content}
              onChange={handleContentChange}
              placeholder="Write client project specifications, meeting notes, bullet items, or freeform comments here... Synced directly to Neon cloud DB."
              rows={12}
            />

            <div style={{ fontSize: '12px', color: 'var(--text-muted)', display: 'flex', justifyContent: 'space-between' }}>
              <span>Synced with cloud database</span>
              <span>Last edited by: {notepad?.lastUpdatedBy || 'You'}</span>
            </div>
          </div>

          {/* 3. Submit Change Request Box */}
          <div className="notepad-card">
            <div className="notepad-header">
              <div className="notepad-title">
                Log New Revision / Change Request
              </div>
              <span className="badge-pill status-in-progress">
                Priority Notification
              </span>
            </div>

            <form onSubmit={handleSubmitChange} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              <div className="form-group">
                <label className="form-label">Change Title / Headline *</label>
                <input
                  type="text"
                  className="form-input"
                  placeholder="e.g., Update primary button style and refine modal form copy"
                  value={changeTitle}
                  onChange={(e) => setChangeTitle(e.target.value)}
                  required
                />
              </div>

              <div className="form-group">
                <label className="form-label">Urgency Level *</label>
                <div className="urgency-selector-group">
                  <button
                    type="button"
                    className={`urgency-btn-option ${changeUrgency === 'critical' ? 'selected critical' : ''}`}
                    onClick={() => setChangeUrgency('critical')}
                  >
                    <span>Critical</span>
                    <span style={{ fontSize: '10px', opacity: 0.8 }}>Blocks release</span>
                  </button>

                  <button
                    type="button"
                    className={`urgency-btn-option ${changeUrgency === 'high' ? 'selected high' : ''}`}
                    onClick={() => setChangeUrgency('high')}
                  >
                    <span>High</span>
                    <span style={{ fontSize: '10px', opacity: 0.8 }}>Urgent revision</span>
                  </button>

                  <button
                    type="button"
                    className={`urgency-btn-option ${changeUrgency === 'normal' ? 'selected normal' : ''}`}
                    onClick={() => setChangeUrgency('normal')}
                  >
                    <span>Normal</span>
                    <span style={{ fontSize: '10px', opacity: 0.8 }}>Standard task</span>
                  </button>

                  <button
                    type="button"
                    className={`urgency-btn-option ${changeUrgency === 'low' ? 'selected low' : ''}`}
                    onClick={() => setChangeUrgency('low')}
                  >
                    <span>Low</span>
                    <span style={{ fontSize: '10px', opacity: 0.8 }}>Minor tweak</span>
                  </button>
                </div>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
                <div className="form-group">
                  <label className="form-label">Target Completion Deadline</label>
                  <input
                    type="date"
                    className="form-input"
                    value={changeDeadline}
                    onChange={(e) => setChangeDeadline(e.target.value)}
                  />
                </div>

                <div className="form-group">
                  <label className="form-label">Requested By</label>
                  <input
                    type="text"
                    className="form-input"
                    value={currentUser?.name || (isAdmin ? 'Agency Admin' : 'Client')}
                    readOnly
                    style={{ background: '#f8fafc', color: 'var(--text-muted)' }}
                  />
                </div>
              </div>

              <div className="form-group">
                <label className="form-label">Detailed Notes & Context</label>
                <textarea
                  className="form-textarea"
                  placeholder="Explain why this change is needed, reference URLs, Figma screen links, or specific wording..."
                  value={changeDescription}
                  onChange={(e) => setChangeDescription(e.target.value)}
                  rows={3}
                />
              </div>

              <button 
                type="submit" 
                className="btn btn-primary"
                disabled={isSubmittingChange || !changeTitle.trim()}
                style={{ alignSelf: 'flex-start' }}
              >
                {isSubmittingChange ? 'Submitting...' : 'Log Change Request'}
              </button>
            </form>
          </div>
        </div>

        {/* Right Column: Milestones Checklist & Project Revision Log */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
          {/* Deliverables Checklist */}
          <div className="notepad-card">
            <div className="notepad-header">
              <div className="notepad-title">
                Deliverables & Milestones
              </div>
              <span className="badge-count">
                {(project.deliverables || []).filter(d => d.completed).length}/{(project.deliverables || []).length}
              </span>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
              {(project.deliverables || []).map(d => (
                <div 
                  key={d.id}
                  onClick={() => onToggleDeliverable(project.id, d.id, !d.completed)}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '12px',
                    padding: '10px 14px',
                    background: d.completed ? 'var(--normal-bg)' : 'var(--bg-surface)',
                    border: `1px solid ${d.completed ? 'var(--normal-border)' : 'var(--border-subtle)'}`,
                    borderRadius: 'var(--radius-md)',
                    cursor: 'pointer',
                    transition: 'all 0.15s ease'
                  }}
                >
                  <input 
                    type="checkbox" 
                    checked={d.completed} 
                    onChange={() => {}} 
                    style={{ accentColor: 'var(--accent-primary)', width: '16px', height: '16px', cursor: 'pointer' }}
                  />
                  <span style={{ 
                    fontSize: '13px', 
                    color: d.completed ? 'var(--text-muted)' : 'var(--text-primary)',
                    textDecoration: d.completed ? 'line-through' : 'none',
                    fontWeight: 500
                  }}>
                    {d.title}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Project Change Requests History */}
          <div className="notepad-card">
            <div className="notepad-header">
              <div className="notepad-title">
                Changes for this Project
              </div>
              <span className="badge-count">{projectChanges.length}</span>
            </div>

            {projectChanges.length === 0 ? (
              <p style={{ fontSize: '13px', color: 'var(--text-muted)' }}>
                No revision requests logged yet. Use the form above to add revisions.
              </p>
            ) : (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                {projectChanges.map(c => (
                  <div 
                    key={c.id}
                    style={{
                      padding: '12px',
                      background: 'var(--bg-surface-elevated)',
                      border: `1px solid ${c.urgency === 'critical' ? 'var(--critical-border)' : 'var(--border-subtle)'}`,
                      borderRadius: 'var(--radius-md)',
                      display: 'flex',
                      flexDirection: 'column',
                      gap: '8px'
                    }}
                  >
                    <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: '8px' }}>
                      <span style={{ fontSize: '13px', fontWeight: 700, color: 'var(--text-primary)' }}>
                        {c.title}
                      </span>
                      <span className={`badge-pill urgency-${c.urgency}`} style={{ fontSize: '10px', padding: '2px 8px' }}>
                        {c.urgency}
                      </span>
                    </div>

                    {c.description && (
                      <p style={{ fontSize: '12px', color: 'var(--text-secondary)' }}>
                        {c.description}
                      </p>
                    )}

                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', fontSize: '11px', color: 'var(--text-muted)' }}>
                      <span>Target: {c.deadline || 'Flexible'}</span>
                      {isAdmin ? (
                        <select
                          className="select-field"
                          style={{ padding: '3px 8px', fontSize: '11px' }}
                          value={c.status}
                          onChange={(e) => onUpdateChangeStatus(c.id, e.target.value)}
                        >
                          <option value="pending">Pending</option>
                          <option value="in-review">In Review</option>
                          <option value="in-progress">In Progress</option>
                          <option value="completed">Completed</option>
                        </select>
                      ) : (
                        <span className={`badge-pill status-${c.status}`} style={{ fontSize: '10px' }}>
                          {c.status}
                        </span>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
