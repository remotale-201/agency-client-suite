import React, { useState, useEffect, useMemo } from 'react';
import './AddNewProjectModal.css';
import { RemotaleLogo } from './RemotaleAuthFlow';

// SVG Icons
function ArrowLeftIcon({ size = 20, color = 'currentColor' }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
      <line x1="19" y1="12" x2="5" y2="12" />
      <polyline points="12 19 5 12 12 5" />
    </svg>
  );
}

function DocDetailsIcon({ size = 20, color = '#6366F1' }) {
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

function LayersIcon({ size = 20, color = '#6366F1' }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <polygon points="12 2 2 7 12 12 22 7 12 2" />
      <polyline points="2 17 12 22 22 17" />
      <polyline points="2 12 12 17 22 12" />
    </svg>
  );
}

function CalendarIcon({ size = 18, color = '#6366F1' }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <rect x="3" y="4" width="18" height="18" rx="2" ry="2" />
      <line x1="16" y1="2" x2="16" y2="6" />
      <line x1="8" y1="2" x2="8" y2="6" />
      <line x1="3" y1="10" x2="21" y2="10" />
    </svg>
  );
}

function LockShieldIcon({ size = 20, color = '#6366F1' }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <rect x="3" y="11" width="18" height="11" rx="2" ry="2" />
      <path d="M7 11V7a5 5 0 0 1 10 0v4" />
    </svg>
  );
}

function PaperclipIcon({ size = 20, color = '#6366F1' }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="m21.44 11.05-9.19 9.19a6 6 0 0 1-8.49-8.49l8.57-8.57A4 4 0 1 1 18 8.84l-8.59 8.57a2 2 0 0 1-2.83-2.83l8.49-8.48" />
    </svg>
  );
}

function NotepadIcon({ size = 20, color = '#6366F1' }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M16 4h2a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2h2" />
      <rect x="8" y="2" width="8" height="4" rx="1" ry="1" />
      <path d="M9 12h6" />
      <path d="M9 16h6" />
    </svg>
  );
}

function SendPlaneIcon({ size = 18, color = '#FFFFFF' }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
      <line x1="22" y1="2" x2="11" y2="13" />
      <polygon points="22 2 15 22 11 13 2 9 22 2" />
    </svg>
  );
}

function CheckmarkIcon({ size = 12, color = '#FFFFFF' }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
      <polyline points="20 6 9 17 4 12" />
    </svg>
  );
}

export default function AddNewProjectModal({
  isOpen,
  onClose,
  onSubmit,
  isAdmin = false,
  clients = [],
  currentUser,
  projectToEdit = null
}) {
  // Form State
  const [title, setTitle] = useState(projectToEdit?.title || '');
  const [description, setDescription] = useState(projectToEdit?.description || '');
  const [selectedClientId, setSelectedClientId] = useState(() => {
    if (projectToEdit?.client_id || projectToEdit?.clientId) return projectToEdit.client_id || projectToEdit.clientId;
    if (isAdmin && clients.length > 0) return clients[0].id;
    return currentUser?.id || 'client-1';
  });
  const todayStr = useMemo(() => new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }), []);
  const defaultDeadlineStr = useMemo(() => new Date(Date.now() + 7 * 86400000).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }), []);

  const [projectType, setProjectType] = useState(projectToEdit?.project_type || projectToEdit?.projectType || 'Web Development');
  const [startDate, setStartDate] = useState(projectToEdit?.start_date || projectToEdit?.startDate || todayStr);
  const [deadline, setDeadline] = useState(projectToEdit?.deadline || defaultDeadlineStr);
  const [priority, setPriority] = useState(projectToEdit?.priority || 'Medium');
  const [status, setStatus] = useState(projectToEdit?.status || 'in-progress');
  const [progress, setProgress] = useState(projectToEdit?.progress || (projectToEdit?.status === 'completed' ? 100 : 70));

  // Credentials list state
  const [credentialsList, setCredentialsList] = useState(() => {
    if (projectToEdit?.credentials) {
      try {
        const parsed = typeof projectToEdit.credentials === 'string' ? JSON.parse(projectToEdit.credentials) : projectToEdit.credentials;
        if (Array.isArray(parsed) && parsed.length > 0) return parsed;
      } catch (e) {}
    }
    return [{ platform: '', username: '', password: '', showPw: false }];
  });

  // Files & reference link
  const [referenceLink, setReferenceLink] = useState(projectToEdit?.reference_link || projectToEdit?.referenceLink || '');
  const [uploadedFiles, setUploadedFiles] = useState([]);

  // Notes
  const [notes, setNotes] = useState(projectToEdit?.notes || '');
  const [loading, setLoading] = useState(false);

  // Sync state whenever projectToEdit or isOpen changes
  useEffect(() => {
    if (projectToEdit) {
      setTitle(projectToEdit.title || '');
      setDescription(projectToEdit.description || '');
      setSelectedClientId(projectToEdit.client_id || projectToEdit.clientId || (isAdmin && clients.length > 0 ? clients[0].id : currentUser?.id || 'client-1'));
      setProjectType(projectToEdit.project_type || projectToEdit.projectType || 'Web Development');
      setStartDate(projectToEdit.start_date || projectToEdit.startDate || todayStr);
      setDeadline(projectToEdit.deadline || defaultDeadlineStr);
      setPriority(projectToEdit.priority || 'Medium');
      setStatus(projectToEdit.status || 'in-progress');
      setProgress(projectToEdit.progress ?? (projectToEdit.status === 'completed' ? 100 : 70));
      if (projectToEdit.credentials) {
        try {
          const parsed = typeof projectToEdit.credentials === 'string' ? JSON.parse(projectToEdit.credentials) : projectToEdit.credentials;
          if (Array.isArray(parsed) && parsed.length > 0) {
            setCredentialsList(parsed);
          } else {
            setCredentialsList([{ platform: '', username: '', password: '', showPw: false }]);
          }
        } catch (e) {
          setCredentialsList([{ platform: '', username: '', password: '', showPw: false }]);
        }
      } else {
        setCredentialsList([{ platform: '', username: '', password: '', showPw: false }]);
      }
      setReferenceLink(projectToEdit.reference_link || projectToEdit.referenceLink || '');
      setNotes(projectToEdit.notes || '');
      setUploadedFiles([]);
    } else {
      setTitle('');
      setDescription('');
      setSelectedClientId(isAdmin && clients.length > 0 ? clients[0].id : currentUser?.id || 'client-1');
      setProjectType('Web Development');
      setStartDate(todayStr);
      setDeadline(defaultDeadlineStr);
      setPriority('Medium');
      setStatus('in-progress');
      setProgress(70);
      setCredentialsList([{ platform: '', username: '', password: '', showPw: false }]);
      setReferenceLink('');
      setUploadedFiles([]);
      setNotes('');
    }
  }, [projectToEdit, isOpen, isAdmin, clients, currentUser]);

  // Add another credential row
  const handleAddCredential = () => {
    setCredentialsList(prev => [
      ...prev,
      { platform: '', username: '', password: '', showPw: false }
    ]);
  };

  const handleUpdateCredential = (index, field, value) => {
    setCredentialsList(prev => {
      const updated = [...prev];
      updated[index][field] = value;
      return updated;
    });
  };

  const handleFileUpload = (e) => {
    const files = Array.from(e.target.files || []);
    if (files.length > 0) {
      setUploadedFiles(prev => [
        ...prev,
        ...files.map(f => ({ name: f.name, size: `${Math.round(f.size / 1024)} KB` }))
      ]);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!title.trim()) {
      alert('Please enter a project title');
      return;
    }

    setLoading(true);
    try {
      await onSubmit({
        id: projectToEdit?.id,
        title: title.trim(),
        description: description.trim(),
        clientId: isAdmin ? selectedClientId : (currentUser?.id || 'client-1'),
        projectType,
        startDate,
        deadline,
        priority,
        status: (Number(progress) >= 100 || status === 'completed') ? 'completed' : status,
        progress: (Number(progress) >= 100 || status === 'completed') ? 100 : Number(progress),
        credentials: credentialsList.filter(c => (c.platform && c.platform.trim()) || (c.username && c.username.trim()) || (c.password && c.password.trim())),
        referenceLink: referenceLink.trim(),
        notes: notes.trim()
      });
      onClose();
    } catch (err) {
      console.error('Failed to submit project:', err);
    } finally {
      setLoading(false);
    }
  };

  // Types list matching Screenshot
  const projectTypes = [
    {
      id: 'Web Development',
      name: 'Web Development',
      desc: 'Websites, Web Apps, Shopify, etc.',
      icon: (
        <span style={{ fontSize: '18px', fontWeight: 700, color: '#4F46E5', fontFamily: 'monospace' }}>
          {'</>'}
        </span>
      )
    },
    {
      id: 'Graphics',
      name: 'Graphics',
      desc: 'Logos, Banners, Social Media, etc.',
      icon: (
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#6366F1" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M12 20h9" />
          <path d="M16.5 3.5a2.121 2.121 0 0 1 3 3L7 19l-4 1 1-4L16.5 3.5z" />
        </svg>
      )
    },
    {
      id: 'Videos',
      name: 'Videos',
      desc: 'Editing, Reels, Ads, Animations, etc.',
      icon: (
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#6366F1" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <rect x="2" y="4" width="20" height="16" rx="2" />
          <polygon points="10 8 16 12 10 16 10 8" fill="#6366F1" />
        </svg>
      )
    },
    {
      id: 'SEO',
      name: 'SEO',
      desc: 'On-page, Off-page, Technical SEO, etc.',
      icon: (
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#6366F1" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <line x1="18" y1="20" x2="18" y2="10" />
          <line x1="12" y1="20" x2="12" y2="4" />
          <line x1="6" y1="20" x2="6" y2="14" />
        </svg>
      )
    }
  ];

  if (!isOpen) return null;

  return (
    <div className="anp-overlay">
      <div className="anp-container">
        {/* Top Header Bar */}
        <header className="anp-top-bar">
          <div className="anp-top-left">
            <button type="button" className="anp-back-btn" onClick={onClose} title="Back">
              <ArrowLeftIcon size={18} color="#0F172A" />
            </button>
            <div className="anp-brand-group">
              <RemotaleLogo size={24} />
              <span className="anp-brand-name">Remotale</span>
            </div>
          </div>

          <div className="anp-user-pill">
            <div className="anp-avatar-circle">
              {currentUser?.name?.[0] || (isAdmin ? 'A' : 'A')}
            </div>
            <div className="anp-user-text">
              <span className="anp-user-name">
                {currentUser?.name || (isAdmin ? 'Abdullah' : 'Ali Khan')}
              </span>
              <span className="anp-user-role">
                {isAdmin ? 'Admin' : 'Client'} ⌵
              </span>
            </div>
          </div>
        </header>

        {/* Hero Section */}
        <div className="anp-hero-section">
          <h1 className="anp-hero-title">{projectToEdit ? 'Edit Project Details' : 'Add New Project'}</h1>
          <p className="anp-hero-sub">
            {projectToEdit ? 'Update specifications and tracking requirements.' : 'Fill in the details below to create a new project.'}
          </p>
        </div>

        {/* Main Form */}
        <form onSubmit={handleSubmit} className="anp-form">
          {/* Card 1: Project Details */}
          <section className="anp-card">
            <div className="anp-card-header">
              <div className="anp-card-icon-box">
                <DocDetailsIcon size={20} color="#4F46E5" />
              </div>
              <div>
                <h3 className="anp-card-title">Project Details</h3>
                <p className="anp-card-desc">Basic information about your project.</p>
              </div>
            </div>

            {/* Admin Client Assignment Dropdown */}
            {isAdmin && (
              <div className="anp-field-group" style={{ marginBottom: '16px' }}>
                <label className="anp-label">
                  Assign to Client <span className="anp-required">*</span>
                </label>
                <select
                  className="anp-input anp-select"
                  value={selectedClientId}
                  onChange={(e) => setSelectedClientId(e.target.value)}
                  required
                >
                  {clients.length === 0 ? (
                    <option value="client-1">Ali Khan (ali@remotale.com)</option>
                  ) : (
                    clients.map(c => (
                      <option key={c.id} value={c.id}>
                        {c.name} ({c.email || c.company || 'Client'})
                      </option>
                    ))
                  )}
                </select>
                <span className="anp-field-hint">
                  Select which client account this project will be assigned to.
                </span>
              </div>
            )}

            <div className="anp-field-group">
              <label className="anp-label">
                Project Title <span className="anp-required">*</span>
              </label>
              <input
                type="text"
                className="anp-input"
                placeholder="e.g. E-commerce Website, Brand Logo, Promotional Video, SEO for Store"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                required
                autoFocus
              />
            </div>

            <div className="anp-field-group" style={{ marginBottom: 0 }}>
              <label className="anp-label">
                Description <span className="anp-required">*</span>
              </label>
              <textarea
                className="anp-textarea"
                placeholder="Describe your project, goals, requirements, and any specific details..."
                value={description}
                maxLength={1000}
                onChange={(e) => setDescription(e.target.value)}
                rows={4}
                required
              />
              <div className="anp-char-count">{description.length}/1000</div>
            </div>
          </section>

          {/* Card 2: Project Type */}
          <section className="anp-card">
            <div className="anp-card-header">
              <div className="anp-card-icon-box">
                <LayersIcon size={20} color="#4F46E5" />
              </div>
              <div>
                <h3 className="anp-card-title">Project Type</h3>
                <p className="anp-card-desc">Select the type of project you want to work on.</p>
              </div>
            </div>

            <div className="anp-types-grid">
              {projectTypes.map(t => {
                const isSelected = projectType === t.id;
                return (
                  <div
                    key={t.id}
                    className={`anp-type-card ${isSelected ? 'selected' : ''}`}
                    onClick={() => setProjectType(t.id)}
                  >
                    {isSelected && (
                      <div className="anp-type-check-badge">
                        <CheckmarkIcon size={10} color="#FFFFFF" />
                      </div>
                    )}
                    <div className="anp-type-icon-wrapper">
                      {t.icon}
                    </div>
                    <div className="anp-type-name">{t.name}</div>
                    <div className="anp-type-desc">{t.desc}</div>
                  </div>
                );
              })}
            </div>
          </section>

          {/* Card 3: Timeline & Priority */}
          <section className="anp-card">
            <div className="anp-card-header">
              <div className="anp-card-icon-box">
                <CalendarIcon size={20} color="#4F46E5" />
              </div>
              <div>
                <h3 className="anp-card-title">Timeline & Priority</h3>
                <p className="anp-card-desc">Set your project timeline and priority level.</p>
              </div>
            </div>

            <div className="anp-timeline-grid">
              <div className="anp-field-group">
                <label className="anp-label">
                  Start Date <span className="anp-required">*</span>
                </label>
                <div className="anp-input-with-icon">
                  <span className="anp-input-left-icon">📅</span>
                  <input
                    type="text"
                    className="anp-input"
                    value={startDate}
                    onChange={(e) => setStartDate(e.target.value)}
                    placeholder={todayStr}
                    required
                  />
                </div>
              </div>

              <div className="anp-field-group">
                <label className="anp-label">
                  Deadline <span className="anp-required">*</span>
                </label>
                <div className="anp-input-with-icon">
                  <span className="anp-input-left-icon">📅</span>
                  <input
                    type="text"
                    className="anp-input"
                    value={deadline}
                    onChange={(e) => setDeadline(e.target.value)}
                    placeholder={defaultDeadlineStr}
                    required
                  />
                </div>
              </div>

              <div className="anp-field-group">
                <label className="anp-label">
                  Priority <span className="anp-required">*</span>
                </label>
                <div className="anp-input-with-icon">
                  <span className="anp-input-left-icon">🚩</span>
                  <select
                    className="anp-input anp-select"
                    value={priority}
                    onChange={(e) => setPriority(e.target.value)}
                  >
                    <option value="Low">Low</option>
                    <option value="Medium">Medium</option>
                    <option value="High">High</option>
                    <option value="Urgent">Urgent</option>
                  </select>
                </div>
              </div>
            </div>
          </section>

          {/* Card 4: Credentials (Optional) */}
          <section className="anp-card">
            <div className="anp-card-header-between">
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                <div className="anp-card-icon-box">
                  <LockShieldIcon size={20} color="#4F46E5" />
                </div>
                <div>
                  <h3 className="anp-card-title">Credentials (Optional)</h3>
                  <p className="anp-card-desc">Share any required login details or access for this project.</p>
                </div>
              </div>

              <div className="anp-badge-secure">
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#4F46E5" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
                  <polyline points="9 12 11 14 15 10" />
                </svg>
                <span>Your credentials are encrypted and secure.</span>
              </div>
            </div>

            {credentialsList.map((cred, idx) => (
              <div key={idx} className="anp-cred-row">
                <div className="anp-field-group">
                  <label className="anp-label">Platform / Service</label>
                  <input
                    type="text"
                    className="anp-input"
                    placeholder="e.g. Shopify, WordPress, Google..."
                    value={cred.platform}
                    onChange={(e) => handleUpdateCredential(idx, 'platform', e.target.value)}
                  />
                </div>

                <div className="anp-field-group">
                  <label className="anp-label">Username / Email</label>
                  <input
                    type="text"
                    className="anp-input"
                    placeholder="Enter username or email"
                    value={cred.username}
                    onChange={(e) => handleUpdateCredential(idx, 'username', e.target.value)}
                  />
                </div>

                <div className="anp-field-group">
                  <label className="anp-label">Password</label>
                  <div className="anp-input-pw-wrapper">
                    <input
                      type={cred.showPw ? 'text' : 'password'}
                      className="anp-input"
                      placeholder="Enter password"
                      value={cred.password}
                      onChange={(e) => handleUpdateCredential(idx, 'password', e.target.value)}
                    />
                    <button
                      type="button"
                      className="anp-pw-eye-btn"
                      onClick={() => handleUpdateCredential(idx, 'showPw', !cred.showPw)}
                      title={cred.showPw ? 'Hide password' : 'Show password'}
                    >
                      {cred.showPw ? '👁️' : '👁️‍🗨️'}
                    </button>
                  </div>
                </div>
              </div>
            ))}

            <button
              type="button"
              className="anp-btn-add-credential"
              onClick={handleAddCredential}
            >
              <span>+ Add Another Credential</span>
            </button>
          </section>

          {/* Card 5: Files & References (Optional) */}
          <section className="anp-card">
            <div className="anp-card-header">
              <div className="anp-card-icon-box">
                <PaperclipIcon size={20} color="#4F46E5" />
              </div>
              <div>
                <h3 className="anp-card-title">Files & References (Optional)</h3>
                <p className="anp-card-desc">Upload any relevant files, documents, or reference links.</p>
              </div>
            </div>

            <div className="anp-files-grid">
              {/* File Upload Box */}
              <label className="anp-upload-box">
                <input
                  type="file"
                  multiple
                  style={{ display: 'none' }}
                  onChange={handleFileUpload}
                />
                <div className="anp-upload-icon-circle">
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#4F46E5" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
                    <polyline points="17 8 12 3 7 8" />
                    <line x1="12" y1="3" x2="12" y2="15" />
                  </svg>
                </div>
                <div className="anp-upload-title">Upload Files</div>
                <div className="anp-upload-desc">Drag & drop files here, or tap to browse</div>
                <div className="anp-upload-hint">Supports: Images, PDFs, ZIP (Max 50MB)</div>

                {uploadedFiles.length > 0 && (
                  <div className="anp-uploaded-tags">
                    {uploadedFiles.map((f, i) => (
                      <span key={i} className="anp-file-tag">📄 {f.name}</span>
                    ))}
                  </div>
                )}
              </label>

              {/* Reference Link Box */}
              <div className="anp-field-group" style={{ marginBottom: 0 }}>
                <label className="anp-label">Reference Link (Optional)</label>
                <div className="anp-input-with-icon" style={{ marginTop: '6px' }}>
                  <span className="anp-input-left-icon">🔗</span>
                  <input
                    type="url"
                    className="anp-input"
                    placeholder="e.g. Figma, Google Drive, Website URL"
                    value={referenceLink}
                    onChange={(e) => setReferenceLink(e.target.value)}
                  />
                </div>
              </div>
            </div>
          </section>

          {/* Card 6: Notepad / Additional Notes (Optional) */}
          <section className="anp-card">
            <div className="anp-card-header">
              <div className="anp-card-icon-box">
                <NotepadIcon size={20} color="#4F46E5" />
              </div>
              <div>
                <h3 className="anp-card-title">Notepad / Additional Notes (Optional)</h3>
                <p className="anp-card-desc">Add any extra notes, ideas, or instructions for your team.</p>
              </div>
            </div>

            <div className="anp-field-group" style={{ marginBottom: 0 }}>
              <textarea
                className="anp-textarea"
                placeholder="Write any additional notes, design preferences, references, or special instructions..."
                value={notes}
                maxLength={1000}
                onChange={(e) => setNotes(e.target.value)}
                rows={4}
              />
              <div className="anp-char-count">{notes.length}/1000</div>
            </div>
          </section>

          {/* Submit Action Button */}
          <button
            type="submit"
            className="anp-submit-btn"
            disabled={loading}
          >
            <SendPlaneIcon size={18} color="#FFFFFF" />
            <span>
              {loading
                ? 'Saving to Database...'
                : projectToEdit
                ? 'Save Changes'
                : 'Create Project'}
            </span>
          </button>
        </form>
      </div>
    </div>
  );
}
