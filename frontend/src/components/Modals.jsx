import React, { useState } from 'react';

export function NewProjectModal({ isOpen, onClose, onSubmit, clients = [], isClient = false, currentClient = null }) {
  const [title, setTitle] = useState('');
  const [clientId, setClientId] = useState(currentClient?.id || clients[0]?.id || '');
  const [description, setDescription] = useState('');
  const [deadline, setDeadline] = useState('');
  const [priority, setPriority] = useState('normal');
  const [figma, setFigma] = useState('');
  const [staging, setStaging] = useState('');
  const [drive, setDrive] = useState('');
  const [deliverables, setDeliverables] = useState([
    'Discovery & Requirements Definition',
    'Design & Architecture Prototype',
    'Core Development & Implementation',
    'Production Deployment & Sign-off'
  ]);
  const [newDelivText, setNewDelivText] = useState('');

  if (!isOpen) return null;

  const effectiveClientId = isClient ? (currentClient?.id || clientId) : (clientId || clients[0]?.id);

  const handleAddDeliverable = () => {
    if (!newDelivText.trim()) return;
    setDeliverables([...deliverables, newDelivText.trim()]);
    setNewDelivText('');
  };

  const handleRemoveDeliverable = (idx) => {
    setDeliverables(deliverables.filter((_, i) => i !== idx));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!title.trim() || !effectiveClientId) return;

    onSubmit({
      title,
      clientId: effectiveClientId,
      description,
      deadline,
      priority,
      links: { figma, staging, drive },
      deliverables: deliverables.map((d, i) => ({
        id: `d-${Date.now()}-${i}`,
        title: d,
        completed: false
      }))
    });

    onClose();
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <h3>{isClient ? 'Submit New Project Request' : 'Create New Client Project'}</h3>
          <button className="btn btn-outline btn-sm" onClick={onClose}>
            ✕
          </button>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="modal-body">
            {isClient ? (
              <div className="form-group">
                <label className="form-label">Client Workspace</label>
                <div style={{
                  padding: '10px 14px',
                  background: 'var(--bg-surface-elevated)',
                  borderRadius: 'var(--radius-md)',
                  border: '1px solid var(--border-subtle)',
                  fontSize: '13px',
                  fontWeight: 700,
                  color: 'var(--text-primary)'
                }}>
                  {currentClient?.company || 'Your Company Workspace'} ({currentClient?.name})
                </div>
              </div>
            ) : (
              <div className="form-group">
                <label className="form-label">Client Company *</label>
                <select 
                  className="form-select"
                  value={clientId || clients[0]?.id || ''}
                  onChange={(e) => setClientId(e.target.value)}
                  required
                >
                  {clients.map(c => (
                    <option key={c.id} value={c.id}>{c.company} ({c.name})</option>
                  ))}
                </select>
              </div>
            )}

            <div className="form-group">
              <label className="form-label">Project Title *</label>
              <input
                type="text"
                className="form-input"
                placeholder="e.g., Mobile App Redesign & API Integration"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                required
              />
            </div>

            <div className="form-group">
              <label className="form-label">Project Summary / Scope</label>
              <textarea
                className="form-textarea"
                placeholder="Describe key deliverables, target outcomes, and scope..."
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                rows={3}
              />
            </div>

            <div className="form-group">
              <label className="form-label">Target Completion Deadline</label>
              <input
                type="date"
                className="form-input"
                value={deadline}
                onChange={(e) => setDeadline(e.target.value)}
              />
            </div>

            {/* External Links */}
            <div className="form-group">
              <label className="form-label">Design & Staging Links</label>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                <input
                  type="url"
                  className="form-input"
                  placeholder="Figma Link (e.g., https://figma.com/...)"
                  value={figma}
                  onChange={(e) => setFigma(e.target.value)}
                />
                <input
                  type="url"
                  className="form-input"
                  placeholder="Staging / Preview Link (e.g., https://staging.client.com)"
                  value={staging}
                  onChange={(e) => setStaging(e.target.value)}
                />
                <input
                  type="url"
                  className="form-input"
                  placeholder="Google Drive / Assets Link"
                  value={drive}
                  onChange={(e) => setDrive(e.target.value)}
                />
              </div>
            </div>

            {/* Deliverables Milestones */}
            <div className="form-group">
              <label className="form-label">Deliverable Milestones</label>
              <div style={{ display: 'flex', gap: '8px', marginBottom: '8px' }}>
                <input
                  type="text"
                  className="form-input"
                  placeholder="Add milestone (e.g., Wireframe Signoff)..."
                  value={newDelivText}
                  onChange={(e) => setNewDelivText(e.target.value)}
                  onKeyDown={(e) => { if (e.key === 'Enter') { e.preventDefault(); handleAddDeliverable(); }}}
                />
                <button type="button" className="btn btn-secondary btn-sm" onClick={handleAddDeliverable}>
                  + Add
                </button>
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                {deliverables.map((deliv, idx) => (
                  <div 
                    key={idx}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      background: 'var(--bg-surface-elevated)',
                      border: '1px solid var(--border-subtle)',
                      padding: '8px 12px',
                      borderRadius: 'var(--radius-sm)',
                      fontSize: '13px'
                    }}
                  >
                    <span>{deliv}</span>
                    <button 
                      type="button" 
                      onClick={() => handleRemoveDeliverable(idx)}
                      style={{ background: 'none', border: 'none', color: '#b91c1c', cursor: 'pointer', fontWeight: 700 }}
                    >
                      ✕
                    </button>
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div className="modal-footer">
            <button type="button" className="btn btn-outline" onClick={onClose}>
              Cancel
            </button>
            <button type="submit" className="btn btn-primary">
              {isClient ? 'Submit Project Request →' : 'Create Project'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export function NewClientModal({ isOpen, onClose, onSubmit }) {
  const [name, setName] = useState('');
  const [company, setCompany] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [password, setPassword] = useState('Client123!');
  const [portalToken, setPortalToken] = useState('');

  if (!isOpen) return null;

  const handleCompanyChange = (val) => {
    setCompany(val);
    if (!portalToken || portalToken.endsWith('-portal')) {
      const slug = val.toLowerCase().replace(/[^a-z0-9]/g, '-') + '-portal';
      setPortalToken(slug);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!name.trim() || !company.trim()) return;

    onSubmit({
      name: name.trim(),
      company: company.trim(),
      email: email.trim(),
      phone: phone.trim(),
      password: password.trim() || 'Client123!',
      portalToken: portalToken.trim() || (company.toLowerCase().replace(/[^a-z0-9]/g, '-') + '-portal')
    });

    onClose();
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <h3>Add New Client & Create Portal</h3>
          <button className="btn btn-outline btn-sm" onClick={onClose}>
            ✕
          </button>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="modal-body">
            <div className="form-group">
              <label className="form-label">Client Company Name *</label>
              <input
                type="text"
                className="form-input"
                placeholder="e.g., Stripe Global / Acme Corp"
                value={company}
                onChange={(e) => handleCompanyChange(e.target.value)}
                required
              />
            </div>

            <div className="form-group">
              <label className="form-label">Primary Contact Person *</label>
              <input
                type="text"
                className="form-input"
                placeholder="e.g., Jonathan Reed"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
              />
            </div>

            <div className="form-row-2col">
              <div className="form-group">
                <label className="form-label">Client Login Email / Username *</label>
                <input
                  type="text"
                  className="form-input"
                  placeholder="client@company.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
              </div>

              <div className="form-group">
                <label className="form-label">Client Portal Password *</label>
                <input
                  type="text"
                  className="form-input"
                  placeholder="Client login password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />
              </div>
            </div>

            <div className="form-row-2col">
              <div className="form-group">
                <label className="form-label">Portal URL Access Slug</label>
                <input
                  type="text"
                  className="form-input"
                  placeholder="e.g., acme-portal"
                  value={portalToken}
                  onChange={(e) => setPortalToken(e.target.value)}
                />
              </div>

              <div className="form-group">
                <label className="form-label">Phone / WhatsApp</label>
                <input
                  type="text"
                  className="form-input"
                  placeholder="+1 (555) 000-1234"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                />
              </div>
            </div>
          </div>

          <div className="modal-footer">
            <button type="button" className="btn btn-outline" onClick={onClose}>
              Cancel
            </button>
            <button type="submit" className="btn btn-primary">
              Create Client Portal
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export function NewChangeModal({ isOpen, onClose, onSubmit, projects, defaultProjectId, requestedBy }) {
  const [projectId, setProjectId] = useState(defaultProjectId || projects[0]?.id || '');
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [urgency, setUrgency] = useState('normal');
  const [deadline, setDeadline] = useState('');

  if (!isOpen) return null;

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!title.trim() || !projectId) return;

    onSubmit({
      projectId,
      title,
      description,
      urgency,
      deadline,
      requestedBy: requestedBy || 'Client'
    });

    onClose();
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <h3>Submit Project Revision / Change</h3>
          <button className="btn btn-outline btn-sm" onClick={onClose}>
            ✕
          </button>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="modal-body">
            <div className="form-group">
              <label className="form-label">Select Project *</label>
              <select
                className="form-select"
                value={projectId}
                onChange={(e) => setProjectId(e.target.value)}
                required
              >
                {projects.map(p => (
                  <option key={p.id} value={p.id}>
                    {p.title} ({p.companyName || 'Project'})
                  </option>
                ))}
              </select>
            </div>

            <div className="form-group">
              <label className="form-label">Change Request Title *</label>
              <input
                type="text"
                className="form-input"
                placeholder="e.g., Update header typography & fix checkout coupon field"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                required
              />
            </div>

            <div className="form-group">
              <label className="form-label">Urgency Level *</label>
              <div className="urgency-selector-group">
                <button
                  type="button"
                  className={`urgency-btn-option ${urgency === 'critical' ? 'selected critical' : ''}`}
                  onClick={() => setUrgency('critical')}
                >
                  Critical
                </button>

                <button
                  type="button"
                  className={`urgency-btn-option ${urgency === 'high' ? 'selected high' : ''}`}
                  onClick={() => setUrgency('high')}
                >
                  High
                </button>

                <button
                  type="button"
                  className={`urgency-btn-option ${urgency === 'normal' ? 'selected normal' : ''}`}
                  onClick={() => setUrgency('normal')}
                >
                  Normal
                </button>

                <button
                  type="button"
                  className={`urgency-btn-option ${urgency === 'low' ? 'selected low' : ''}`}
                  onClick={() => setUrgency('low')}
                >
                  Low
                </button>
              </div>
            </div>

            <div className="form-group">
              <label className="form-label">Target Completion Deadline</label>
              <input
                type="date"
                className="form-input"
                value={deadline}
                onChange={(e) => setDeadline(e.target.value)}
              />
            </div>

            <div className="form-group">
              <label className="form-label">Detailed Notes & Context</label>
              <textarea
                className="form-textarea"
                placeholder="Mention specific changes, screen names, expected behavior, or links..."
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                rows={4}
              />
            </div>
          </div>

          <div className="modal-footer">
            <button type="button" className="btn btn-outline" onClick={onClose}>
              Cancel
            </button>
            <button type="submit" className="btn btn-primary">
              Submit Change Request
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
