import React, { useState, useMemo, useRef, useEffect } from 'react';
import LetterAvatar from './LetterAvatar';
import './MessagesView.css';

// Compress/resize attached image via HTML5 Canvas to keep base64 strings clean and fast
async function processImageFile(file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      const img = new Image();
      img.onload = () => {
        const maxDimension = 1280;
        let { width, height } = img;
        if (width > maxDimension || height > maxDimension) {
          if (width > height) {
            height = Math.round((height * maxDimension) / width);
            width = maxDimension;
          } else {
            width = Math.round((width * maxDimension) / height);
            height = maxDimension;
          }
        }
        const canvas = document.createElement('canvas');
        canvas.width = width;
        canvas.height = height;
        const ctx = canvas.getContext('2d');
        ctx.drawImage(img, 0, 0, width, height);
        // Export as JPEG with 0.82 quality
        const compressedDataUrl = canvas.toDataURL('image/jpeg', 0.82);
        resolve(compressedDataUrl);
      };
      img.onerror = () => reject(new Error('Failed to load image for compression'));
      img.src = e.target.result;
    };
    reader.onerror = () => reject(new Error('Failed to read image file'));
    reader.readAsDataURL(file);
  });
}

function formatRelativeTime(dateStr) {
  if (!dateStr) return '';
  const d = new Date(dateStr);
  if (isNaN(d.getTime())) return '';
  const now = new Date();
  const diffSec = Math.floor((now - d) / 1000);
  if (diffSec < 60) return 'Just now';
  if (diffSec < 3600) return `${Math.floor(diffSec / 60)}m ago`;
  if (diffSec < 86400) {
    return d.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  }
  if (diffSec < 86400 * 2) return 'Yesterday';
  return d.toLocaleDateString([], { month: 'short', day: 'numeric' });
}

function formatMessageTime(dateStr) {
  if (!dateStr) return '';
  const d = new Date(dateStr);
  if (isNaN(d.getTime())) return '';
  return d.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
}

export default function MessagesView({
  projects = [],
  clients = [],
  currentUser = null,
  isAdmin = false,
  messages = [],
  onSendMessage,
  initialProjectId = null,
  onOpenProject,
  onSelectProject
}) {
  const handleOpenWorkspace = onOpenProject || onSelectProject;

  // Active Project ID
  const [selectedProjectId, setSelectedProjectId] = useState(() => {
    if (initialProjectId && projects.some(p => p.id === initialProjectId)) {
      return initialProjectId;
    }
    return projects[0]?.id || null;
  });

  // Keep selected project valid if projects list changes
  useEffect(() => {
    if (projects.length > 0) {
      if (!selectedProjectId || !projects.some(p => p.id === selectedProjectId)) {
        setSelectedProjectId(initialProjectId && projects.some(p => p.id === initialProjectId) ? initialProjectId : projects[0].id);
      }
    }
  }, [projects, initialProjectId]);

  const [searchQuery, setSearchQuery] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');
  const [textInput, setTextInput] = useState('');
  const [attachedImage, setAttachedImage] = useState(null);
  const [attachedImageName, setAttachedImageName] = useState('');
  const [sending, setSending] = useState(false);
  const [lightboxImg, setLightboxImg] = useState(null);

  const fileInputRef = useRef(null);
  const messagesEndRef = useRef(null);

  // Active project object
  const activeProject = useMemo(() => {
    return projects.find(p => p.id === selectedProjectId) || projects[0] || null;
  }, [projects, selectedProjectId]);

  // Client name helper
  const getClientName = (proj) => {
    if (!proj) return 'Client';
    if (proj.clientName || proj.client_name) return proj.clientName || proj.client_name;
    const cId = proj.client_id || proj.clientId;
    if (cId === 'client-awais') return 'Awais (Awais Agency)';
    if (cId === 'client-afshal') return 'Afshal (Afshal Brand)';
    const found = clients.find(c => c.id === cId);
    return found ? (found.company || found.name) : 'Awais Agency';
  };

  // Filter projects for the channel list
  const filteredProjects = useMemo(() => {
    return projects.filter(p => {
      if (filterStatus === 'in-progress' && p.status === 'completed') return false;
      if (filterStatus === 'completed' && p.status !== 'completed') return false;
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        const matchesTitle = (p.title || '').toLowerCase().includes(q);
        const matchesClient = getClientName(p).toLowerCase().includes(q);
        if (!matchesTitle && !matchesClient) return false;
      }
      return true;
    });
  }, [projects, filterStatus, searchQuery, clients]);

  // Messages scoped to the currently selected project (excluding legacy demo messages)
  const projectMessages = useMemo(() => {
    if (!selectedProjectId) return [];
    return messages
      .filter(m => (m.project_id === selectedProjectId || m.projectId === selectedProjectId))
      .filter(m => m.id !== 'msg-1' && m.id !== 'msg-2' && m.id !== 'msg-3')
      .sort((a, b) => new Date(a.created_at || 0) - new Date(b.created_at || 0));
  }, [messages, selectedProjectId]);

  // Map of project last message
  const lastMessageMap = useMemo(() => {
    const map = {};
    messages
      .filter(m => m.id !== 'msg-1' && m.id !== 'msg-2' && m.id !== 'msg-3')
      .forEach(m => {
        const pid = m.project_id || m.projectId;
        if (!pid) return;
        if (!map[pid] || new Date(m.created_at || 0) > new Date(map[pid].created_at || 0)) {
          map[pid] = m;
        }
      });
    return map;
  }, [messages]);

  // Scroll to bottom when project messages change
  const scrollToBottom = (behavior = 'smooth') => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior });
    }
  };

  useEffect(() => {
    scrollToBottom('auto');
  }, [selectedProjectId]);

  useEffect(() => {
    scrollToBottom('smooth');
  }, [projectMessages.length]);

  // File attach handler
  const handleFileSelect = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (!file.type.startsWith('image/')) {
      alert('Please select an image file (PNG, JPG, WebP, GIF).');
      return;
    }
    try {
      const dataUrl = await processImageFile(file);
      setAttachedImage(dataUrl);
      setAttachedImageName(file.name);
    } catch (err) {
      console.error('[Image Processing Error]', err);
      alert('Could not process this image. Please try another image.');
    } finally {
      if (fileInputRef.current) fileInputRef.current.value = '';
    }
  };

  // Send message
  const handleSend = async (e) => {
    if (e) e.preventDefault();
    const content = textInput.trim();
    if (!content && !attachedImage) return;
    if (!selectedProjectId) return;

    setSending(true);
    try {
      const isSenderAdmin = isAdmin || currentUser?.role === 'admin' || currentUser?.id === 'admin-1';
      const senderId = currentUser?.id || (isSenderAdmin ? 'admin-1' : 'client-awais');
      const senderName = currentUser?.name || (isSenderAdmin ? 'Abdullah' : 'Awais');
      const senderAvatar = currentUser?.avatar || '';

      const newMsg = {
        id: `msg-${Date.now()}-${Math.random().toString(36).substr(2, 6)}`,
        project_id: selectedProjectId,
        projectId: selectedProjectId,
        sender_id: senderId,
        senderId: senderId,
        sender_name: senderName,
        senderName: senderName,
        sender_avatar: senderAvatar,
        senderAvatar: senderAvatar,
        content,
        image_url: attachedImage || null,
        imageUrl: attachedImage || null,
        created_at: new Date().toISOString()
      };

      if (onSendMessage) {
        await onSendMessage(newMsg);
      }

      setTextInput('');
      setAttachedImage(null);
      setAttachedImageName('');
    } catch (err) {
      console.error('[Send Message Error]', err);
    } finally {
      setSending(false);
    }
  };

  // Role tag helper
  const getSenderRoleTag = (senderId, senderName) => {
    const sId = (senderId || '').toLowerCase();
    const sName = (senderName || '').toLowerCase();
    if (sId === 'admin-1' || sId === 'admin' || sName.includes('abdullah')) {
      return { label: '👑 Admin', className: 'admin' };
    }
    if (sId.startsWith('client') || sName.includes('awais') || sName.includes('afshal')) {
      return { label: '👤 Client', className: 'client' };
    }
    return { label: '⚡ Team Member', className: 'member' };
  };

  return (
    <div className="messages-suite-container">
      {/* ------------------------------------------------------------------
          LEFT: PROJECT CHANNELS SIDEBAR
          ------------------------------------------------------------------ */}
      <aside className="msg-channels-sidebar">
        <div className="msg-channels-header">
          <div className="msg-channels-top-row">
            <div className="msg-channels-title-group">
              <span style={{ fontSize: '18px' }}>💬</span>
              <h2 className="msg-channels-title">Project Chats</h2>
            </div>
            <span className="msg-channels-count">{filteredProjects.length} Projects</span>
          </div>

          {/* Search Box */}
          <div className="msg-search-box">
            <span className="msg-search-icon">🔍</span>
            <input
              type="text"
              className="msg-search-input"
              placeholder="Search projects or clients..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>

          {/* Filter Pills */}
          <div className="msg-filter-pills">
            <button
              type="button"
              className={`msg-filter-pill ${filterStatus === 'all' ? 'active' : ''}`}
              onClick={() => setFilterStatus('all')}
            >
              All
            </button>
            <button
              type="button"
              className={`msg-filter-pill ${filterStatus === 'in-progress' ? 'active' : ''}`}
              onClick={() => setFilterStatus('in-progress')}
            >
              Active
            </button>
            <button
              type="button"
              className={`msg-filter-pill ${filterStatus === 'completed' ? 'active' : ''}`}
              onClick={() => setFilterStatus('completed')}
            >
              Completed
            </button>
          </div>
        </div>

        {/* Project Channels List */}
        <div className="msg-channels-list">
          {filteredProjects.length === 0 ? (
            <div style={{ padding: '24px 16px', textAlign: 'center', color: '#94a3b8', fontSize: '13px' }}>
              No project channels found
            </div>
          ) : (
            filteredProjects.map((p) => {
              const isSelected = p.id === selectedProjectId;
              const lastMsg = lastMessageMap[p.id];
              const clientLabel = getClientName(p);
              const statusClass = p.status === 'completed' ? 'completed' : (p.status === 'under-review' ? 'under-review' : 'in-progress');

              return (
                <div
                  key={p.id}
                  className={`msg-channel-item ${isSelected ? 'active' : ''}`}
                  onClick={() => setSelectedProjectId(p.id)}
                >
                  <div className="msg-channel-avatar-wrap">
                    <LetterAvatar name={p.title || 'Project'} size={40} />
                    <span className={`msg-channel-status-dot ${statusClass}`} />
                  </div>

                  <div className="msg-channel-content">
                    <div className="msg-channel-top-meta">
                      <span className="msg-channel-name" title={p.title}>{p.title}</span>
                      {lastMsg && (
                        <span className="msg-channel-time">{formatRelativeTime(lastMsg.created_at)}</span>
                      )}
                    </div>

                    <span className="msg-channel-client-tag" title={clientLabel}>
                      👤 {clientLabel}
                    </span>

                    <div className="msg-channel-snippet-row">
                      <p className="msg-channel-snippet">
                        {lastMsg 
                          ? (lastMsg.image_url && !lastMsg.content ? '📷 Shared an image' : lastMsg.content)
                          : 'No messages yet'}
                      </p>
                    </div>
                  </div>
                </div>
              );
            })
          )}
        </div>
      </aside>

      {/* ------------------------------------------------------------------
          RIGHT: ACTIVE PROJECT CHAT AREA
          ------------------------------------------------------------------ */}
      <main className="msg-chat-main">
        {activeProject ? (
          <>
            {/* Header */}
            <header className="msg-chat-header">
              <div className="msg-header-left">
                <div className="msg-header-icon-box">
                  💬
                </div>
                <div className="msg-header-details">
                  <div className="msg-header-title-row">
                    <h3 className="msg-header-title">{activeProject.title}</h3>
                    <span className={`msg-header-status-pill ${activeProject.status || 'in-progress'}`}>
                      {activeProject.status === 'completed' ? '✓ Completed' : '● In Progress'}
                    </span>
                  </div>
                  <div className="msg-header-sub-row">
                    <span className="msg-header-meta-item">
                      <strong>Client:</strong> {getClientName(activeProject)}
                    </span>
                    <span>•</span>
                    <span className="msg-header-meta-item">
                      <strong>Deadline:</strong> {activeProject.deadline || 'Upcoming'}
                    </span>
                    {activeProject.assigned_name && (
                      <>
                        <span>•</span>
                        <span className="msg-header-meta-item">
                          <strong>Assigned:</strong> {activeProject.assigned_name}
                        </span>
                      </>
                    )}
                  </div>
                </div>
              </div>

              <div className="msg-header-right">
                {handleOpenWorkspace && (
                  <button
                    type="button"
                    className="msg-btn-workspace"
                    onClick={() => handleOpenWorkspace(activeProject)}
                    title="Open full project details, tasks, notepad and credentials"
                  >
                    <span>📂 Open Workspace</span>
                  </button>
                )}
              </div>
            </header>

            {/* Chat Body */}
            <div className="msg-stream-body">
              {projectMessages.length === 0 ? (
                <div className="msg-empty-chat">
                  <div className="msg-empty-icon">✉️</div>
                  <h4 className="msg-empty-title">Project Discussion Channel</h4>
                  <p className="msg-empty-desc">
                    No messages in <strong>{activeProject.title}</strong> yet. Send project updates, share feedback, or attach screenshots below.
                  </p>
                  <div className="msg-quick-prompts">
                    <button
                      type="button"
                      className="msg-prompt-btn"
                      onClick={() => setTextInput('👋 Assalam o Alaikum! Starting work on this project milestone.')}
                    >
                      👋 Starting work on this project
                    </button>
                    <button
                      type="button"
                      className="msg-prompt-btn"
                      onClick={() => setTextInput('Design preview is ready. Please review and share your thoughts.')}
                    >
                      🎨 Design preview ready for review
                    </button>
                    <button
                      type="button"
                      className="msg-prompt-btn"
                      onClick={() => setTextInput('All core tasks completed and responsive testing verified.')}
                    >
                      ✅ Tasks completed & verified
                    </button>
                  </div>
                </div>
              ) : (
                projectMessages.map((msg, idx) => {
                  const sId = msg.sender_id || msg.senderId;
                  const sName = (msg.sender_name || msg.senderName || '').toLowerCase();
                  const cId = currentUser?.id;
                  const cName = (currentUser?.name || '').toLowerCase();

                  const isOutgoing = (cId && sId === cId) ||
                    (cName && sName && sName === cName) ||
                    (isAdmin && (sId === 'admin-1' || sId === 'admin' || sName.includes('abdullah')));

                  const roleTag = getSenderRoleTag(msg.sender_id, msg.sender_name);

                  return (
                    <div
                      key={msg.id || idx}
                      className={`msg-row ${isOutgoing ? 'outgoing' : 'incoming'}`}
                    >
                      <LetterAvatar
                        name={msg.sender_name || 'User'}
                        size={34}
                      />

                      <div className="msg-bubble-wrap">
                        <div className="msg-sender-meta">
                          <span className="msg-sender-name">{msg.sender_name || 'User'}</span>
                          <span className={`msg-sender-role-tag ${roleTag.className}`}>
                            {roleTag.label}
                          </span>
                        </div>

                        <div className="msg-bubble">
                          {/* Image Attachment (if any) */}
                          {msg.image_url && (
                            <div
                              className="msg-attachment-card"
                              onClick={() => setLightboxImg(msg.image_url)}
                              title="Click to view full image"
                            >
                              <img
                                src={msg.image_url}
                                alt="Attachment"
                                className="msg-attachment-img"
                              />
                              <div className="msg-attachment-overlay">
                                🔍 Click to expand
                              </div>
                            </div>
                          )}

                          {/* Text Content */}
                          {msg.content && <div>{msg.content}</div>}
                        </div>

                        <span className="msg-time-stamp">
                          {formatMessageTime(msg.created_at)}
                        </span>
                      </div>
                    </div>
                  );
                })
              )}
              <div ref={messagesEndRef} />
            </div>

            {/* Input Bar */}
            <div className="msg-input-wrap">
              {/* Image Preview before sending */}
              {attachedImage && (
                <div className="msg-preview-thumb-box">
                  <img src={attachedImage} alt="Preview" className="msg-preview-thumb-img" />
                  <div className="msg-preview-thumb-info">
                    <div>Image Attached</div>
                    <div style={{ fontSize: '10.5px', color: '#64748b' }}>{attachedImageName || 'Ready to send'}</div>
                  </div>
                  <button
                    type="button"
                    className="msg-preview-remove-btn"
                    onClick={() => {
                      setAttachedImage(null);
                      setAttachedImageName('');
                    }}
                    title="Remove image"
                  >
                    ✕
                  </button>
                </div>
              )}

              <form className="msg-form" onSubmit={handleSend}>
                <input
                  type="file"
                  accept="image/*"
                  ref={fileInputRef}
                  style={{ display: 'none' }}
                  onChange={handleFileSelect}
                />

                <button
                  type="button"
                  className="msg-attach-btn"
                  onClick={() => fileInputRef.current?.click()}
                  title="Attach an image screenshot"
                >
                  📷
                </button>

                <input
                  type="text"
                  className="msg-text-input"
                  placeholder={`Write a message for ${activeProject.title}... (Press Enter to send)`}
                  value={textInput}
                  onChange={(e) => setTextInput(e.target.value)}
                  disabled={sending}
                />

                <button
                  type="submit"
                  className="msg-send-btn"
                  disabled={(!textInput.trim() && !attachedImage) || sending}
                >
                  <span>{sending ? 'Sending...' : 'Send'}</span>
                  <span>➤</span>
                </button>
              </form>
            </div>
          </>
        ) : (
          <div className="msg-empty-chat">
            <div className="msg-empty-icon">📁</div>
            <h4 className="msg-empty-title">Select a Project Channel</h4>
            <p className="msg-empty-desc">Choose any client project from the left sidebar to open its dedicated chat channel.</p>
          </div>
        )}
      </main>

      {/* ------------------------------------------------------------------
          LIGHTBOX MODAL FOR FULL SCREEN IMAGE PREVIEW
          ------------------------------------------------------------------ */}
      {lightboxImg && (
        <div className="msg-lightbox-overlay" onClick={() => setLightboxImg(null)}>
          <div className="msg-lightbox-wrap" onClick={(e) => e.stopPropagation()}>
            <button
              type="button"
              className="msg-lightbox-close"
              onClick={() => setLightboxImg(null)}
              title="Close image"
            >
              ✕
            </button>
            <img src={lightboxImg} alt="Full Preview" className="msg-lightbox-img" />
          </div>
        </div>
      )}
    </div>
  );
}
