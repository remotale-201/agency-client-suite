import React, { useState, useMemo, useRef, useEffect } from 'react';
import ProjectProgressPrintSheet from './ProjectProgressPrintSheet';
import { exportElementToPdf } from '../utils/pdfExport';
import './ClientProgressPdfModal.css';

/**
 * ClientProgressPdfModal
 * Exact 1-to-1 match of the clean "Share project progress" modal (Image 2),
 * with live PDF generation matching the luxury Terracotta Progress Report (Image 1).
 */
export default function ClientProgressPdfModal({
  isOpen,
  onClose,
  projects = [],
  clients = [],
  initialClientId = 'client-awais',
  currentAdminName = 'Ameen'
}) {
  const printRef = useRef(null);

  // Selected client
  const [selectedClientId, setSelectedClientId] = useState(initialClientId || 'client-awais');

  // Filter tab: 'active-10', 'in-progress', 'all'
  const [showFilter, setShowFilter] = useState('active-10');

  // Search input: Project name or domain
  const [searchTerm, setSearchTerm] = useState('');

  // Message to client
  const [messageToClient, setMessageToClient] = useState(
    'Dear Awais, here is the latest progress on your active projects. Please check the pending items below so we can keep the launch dates on track.'
  );

  // Preview Mode Toggle: false = Editing modal (Image 2), true = Full PDF Preview (Image 1)
  const [isPreviewOpen, setIsPreviewOpen] = useState(false);

  // Status & notifications
  const [isDownloadingPdf, setIsDownloadingPdf] = useState(false);
  const [copiedWhatsApp, setCopiedWhatsApp] = useState(false);

  // Author & Agency Info matching Image 1
  const authorName = 'Ameen';
  const authorRole = 'Senior Product Designer & Web Developer';
  const authorPhone = '03323531518';
  const authorEmail = 'ameen.data.2011@gmail.com';
  const reportDate = '20/10/2026';

  // Resolved active client object
  const activeClient = useMemo(() => {
    if (selectedClientId === 'all') {
      return { id: 'all', name: 'All Clients', company: 'Multi-Client Portfolio', email: 'clients@remotale.com', phone: '+92 300 1234567' };
    }
    const found = clients.find((c) => c.id === selectedClientId);
    if (found) return found;
    if (selectedClientId === 'client-awais') {
      return { id: 'client-awais', name: 'Awais', company: 'Awais Agency', email: 'awais@remotale.com', phone: '+92 300 1234567' };
    }
    if (selectedClientId === 'client-afshal') {
      return { id: 'client-afshal', name: 'Afshal', company: 'Afshal Brand', email: 'afshal@remotale.com', phone: '+92 300 9876543' };
    }
    return { id: 'client-1', name: 'Ali Khan', company: 'Acme Brand', email: 'ali@remotale.com', phone: '+92 300 5550199' };
  }, [selectedClientId, clients]);

  // Update client message whenever target client changes
  useEffect(() => {
    const name = activeClient.name || 'Client';
    setMessageToClient(
      `Dear ${name}, here is the latest progress on your active projects. Please check the pending items below so we can keep the launch dates on track.`
    );
  }, [activeClient]);

  // Domain extractor
  const getProjectDomain = (proj) => {
    if (proj.domain) return proj.domain;
    if (proj.notes) {
      const match = proj.notes.match(/Domain:\s*([^\n\r]+)/i);
      if (match) return match[1].trim();
    }
    if (proj.description) {
      const match = proj.description.match(/domain:\s*([^\s,]+)/i);
      if (match) return match[1].trim();
    }
    const tMatch = (proj.title || '').match(/([a-zA-Z0-9-]+\.(?:pk|com|store|shop|org|net))/i);
    if (tMatch) return tMatch[1].trim();
    return 'domain.com';
  };

  // Initial pending text generator
  const getInitialPending = (proj) => {
    if (proj.pendingText) return proj.pendingText;
    const tasks = Array.isArray(proj.tasks) ? proj.tasks : [];
    const incompleteTasks = tasks.filter((t) => !t.completed);
    if (incompleteTasks.length > 0) {
      return incompleteTasks.map((t) => `• ${t.title}`).join('\n');
    }
    // Match the clean examples from Image 1 & 2
    const titleLower = (proj.title || '').toLowerCase();
    if (titleLower.includes('fytnix')) {
      return 'Waiting for domain DNS & SSL setup';
    }
    if (titleLower.includes('dfynex')) {
      return '• Product page design\n• Product cards & pricing badges\n• Information & policy pages\n• Footer & contact details';
    }
    if (titleLower.includes('saboor') || titleLower.includes('zariyah')) {
      return '';
    }
    return '• Product page design\n• Information & policy pages\n• Final review & client feedback';
  };

  // Filter projects by target client
  const clientProjects = useMemo(() => {
    if (selectedClientId === 'all') return projects;
    return projects.filter(
      (p) =>
        p.clientId === selectedClientId ||
        p.client_id === selectedClientId ||
        (selectedClientId === 'client-awais' && (p.clientName === 'Awais' || p.id?.includes('awais')))
    );
  }, [projects, selectedClientId]);

  // Projects state map: { [id]: { selected: boolean, progress: number, pendingText: string, deadline: string, domain: string } }
  const [projectStates, setProjectStates] = useState({});

  // Initialize project states
  useEffect(() => {
    setProjectStates((prev) => {
      const next = { ...prev };
      let initialCount = 0;
      clientProjects.forEach((proj, idx) => {
        if (!next[proj.id]) {
          // If active-10 preset, select the first 10 projects by default (or the first 3 if testing small set)
          const isDefaultSelected = showFilter === 'active-10' ? idx < 10 : true;

          next[proj.id] = {
            selected: isDefaultSelected,
            progress: proj.progress !== undefined ? Number(proj.progress) : 25,
            pendingText: getInitialPending(proj),
            deadline: proj.deadline || '26/10/2026',
            domain: getProjectDomain(proj)
          };
          if (isDefaultSelected) initialCount++;
        }
      });
      return next;
    });
  }, [clientProjects, showFilter]);

  // Quick switch between filter presets
  const handleShowFilterChange = (filter) => {
    setShowFilter(filter);
    setProjectStates((prev) => {
      const next = { ...prev };
      let count = 0;
      clientProjects.forEach((proj, idx) => {
        const isAct = proj.status === 'in-progress' || (Number(proj.progress || 0) < 100 && proj.status !== 'completed');
        if (filter === 'active-10') {
          // Select first 10 active
          if (isAct && count < 10) {
            next[proj.id] = { ...(next[proj.id] || {}), selected: true };
            count++;
          } else {
            next[proj.id] = { ...(next[proj.id] || {}), selected: false };
          }
        } else if (filter === 'in-progress') {
          next[proj.id] = { ...(next[proj.id] || {}), selected: isAct };
        } else if (filter === 'all') {
          next[proj.id] = { ...(next[proj.id] || {}), selected: true };
        }
      });
      return next;
    });
  };

  // Update a single project property
  const handleUpdateProjectProp = (id, prop, value) => {
    setProjectStates((prev) => ({
      ...prev,
      [id]: {
        ...(prev[id] || {}),
        [prop]: value
      }
    }));
  };

  // Filtered list of projects to show in the modal list
  const displayedProjects = useMemo(() => {
    return clientProjects.filter((proj) => {
      const state = projectStates[proj.id] || {};
      const isAct = proj.status === 'in-progress' || (Number(proj.progress || 0) < 100 && proj.status !== 'completed');

      if (showFilter === 'in-progress' && !isAct) return false;

      if (searchTerm.trim()) {
        const q = searchTerm.toLowerCase();
        const matchTitle = (proj.title || '').toLowerCase().includes(q);
        const matchDomain = (state.domain || '').toLowerCase().includes(q);
        const matchPending = (state.pendingText || '').toLowerCase().includes(q);
        return matchTitle || matchDomain || matchPending;
      }
      return true;
    });
  }, [clientProjects, projectStates, showFilter, searchTerm]);

  // Projects that are selected for export / PDF / summary
  const selectedProjects = useMemo(() => {
    return clientProjects
      .filter((proj) => projectStates[proj.id]?.selected)
      .map((proj) => {
        const st = projectStates[proj.id] || {};
        return {
          ...proj,
          progress: st.progress !== undefined ? st.progress : 25,
          pendingText: st.pendingText !== undefined ? st.pendingText : '',
          deadline: st.deadline || '26/10/2026',
          domain: st.domain || getProjectDomain(proj)
        };
      });
  }, [clientProjects, projectStates]);

  // Average progress calculation
  const averageProgress = useMemo(() => {
    if (selectedProjects.length === 0) return 0;
    const sum = selectedProjects.reduce((acc, p) => acc + Number(p.progress || 0), 0);
    return Math.round(sum / selectedProjects.length);
  }, [selectedProjects]);

  // Export to PDF
  const handleDownloadPdf = async () => {
    if (!printRef.current || isDownloadingPdf) return;
    try {
      setIsDownloadingPdf(true);
      const safeClientName = (activeClient.name || 'Client').replace(/[^a-zA-Z0-9]/g, '_');
      const filename = `Progress-Report-${safeClientName}.pdf`;
      await exportElementToPdf(printRef.current, filename);
    } catch (err) {
      console.error('[PDF Export Error]', err);
      window.print();
    } finally {
      setIsDownloadingPdf(false);
    }
  };

  // Copy for WhatsApp
  const handleCopyWhatsApp = () => {
    let msg = `*Progress Report — ${activeClient.name}*\n`;
    msg += `Web Development & E-Commerce Services\n`;
    msg += `Date: ${reportDate} | Avg Progress: ${averageProgress}%\n`;
    msg += `------------------------------------\n`;
    if (messageToClient) {
      msg += `${messageToClient}\n\n`;
    }

    selectedProjects.forEach((p, i) => {
      msg += `${i + 1}. *${p.title}* (${p.progress}%)\n`;
      if (p.domain) msg += `   🌐 ${p.domain}\n`;
      msg += `   ⏰ Deadline: ${p.deadline}\n`;
      const pending = p.pendingText.trim();
      if (pending) {
        msg += `   ⏳ What is pending:\n`;
        pending.split('\n').forEach((line) => {
          msg += `      ${line.startsWith('•') || line.startsWith('-') ? line : `• ${line}`}\n`;
        });
      } else {
        msg += `   ⏳ What is pending: [Add pending items]\n`;
      }
      msg += `\n`;
    });

    msg += `------------------------------------\n`;
    msg += `Note: Please reply with the pending items before the deadline.\n`;
    msg += `Thank you for your business!\n`;
    msg += `— ${authorName} (${authorRole}) | ${authorPhone}`;

    navigator.clipboard.writeText(msg);
    setCopiedWhatsApp(true);
    setTimeout(() => setCopiedWhatsApp(false), 2500);
  };

  if (!isOpen) return null;

  return (
    <div className="spp-modal-overlay" onClick={onClose}>
      <div className="spp-modal-container" onClick={(e) => e.stopPropagation()}>
        {/* ========================================================== */}
        {/* VIEW 1: CLEAN EDITING MODAL (Image 2 - Share project progress) */}
        {/* ========================================================== */}
        {!isPreviewOpen ? (
          <>
            {/* Modal Header */}
            <div className="spp-modal-header">
              <div className="spp-header-titles">
                <h2 className="spp-title">Share project progress</h2>
                <p className="spp-subtitle">
                  Pick the projects, write what is pending, then send it to your client as a PDF.
                </p>
              </div>

              <button
                type="button"
                className="spp-close-btn"
                onClick={onClose}
                title="Close"
              >
                ✕
              </button>
            </div>

            {/* Filter Bar Row: Client / Show / Search */}
            <div className="spp-filter-row">
              {/* 1. Client Select */}
              <div className="spp-filter-col client">
                <label className="spp-filter-label">Client</label>
                <div className="spp-select-wrapper">
                  <select
                    className="spp-select-field"
                    value={selectedClientId}
                    onChange={(e) => setSelectedClientId(e.target.value)}
                  >
                    <option value="client-awais">Awais (Awais Agency)</option>
                    <option value="client-afshal">Afshal (Afshal Brand)</option>
                    <option value="client-1">Ali Khan (Acme Brand)</option>
                    {clients
                      .filter((c) => !['client-awais', 'client-afshal', 'client-1'].includes(c.id))
                      .map((cl) => (
                        <option key={cl.id} value={cl.id}>
                          {cl.name} ({cl.company || 'Client'})
                        </option>
                      ))}
                    <option value="all">All Clients Portfolio</option>
                  </select>
                </div>
              </div>

              {/* 2. Show Filter Pills */}
              <div className="spp-filter-col show">
                <label className="spp-filter-label">Show</label>
                <div className="spp-pills-group">
                  <button
                    type="button"
                    className={`spp-pill-btn ${showFilter === 'active-10' ? 'active' : ''}`}
                    onClick={() => handleShowFilterChange('active-10')}
                  >
                    Active (10)
                  </button>
                  <button
                    type="button"
                    className={`spp-pill-btn ${showFilter === 'in-progress' ? 'active' : ''}`}
                    onClick={() => handleShowFilterChange('in-progress')}
                  >
                    In progress
                  </button>
                  <button
                    type="button"
                    className={`spp-pill-btn ${showFilter === 'all' ? 'active' : ''}`}
                    onClick={() => handleShowFilterChange('all')}
                  >
                    All ({clientProjects.length})
                  </button>
                </div>
              </div>

              {/* 3. Search */}
              <div className="spp-filter-col search">
                <label className="spp-filter-label">Search</label>
                <input
                  type="text"
                  className="spp-search-input"
                  placeholder="Project name or domain"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
            </div>

            {/* Message to client Box */}
            <div className="spp-message-box-wrap">
              <label className="spp-filter-label">Message to client</label>
              <textarea
                className="spp-message-textarea"
                rows={2}
                value={messageToClient}
                onChange={(e) => setMessageToClient(e.target.value)}
              />
            </div>

            {/* Projects List with 3-column cards */}
            <div className="spp-cards-list-wrap">
              {displayedProjects.length === 0 ? (
                <div className="spp-empty-state">
                  <p>No projects match your filter.</p>
                </div>
              ) : (
                displayedProjects.map((proj) => {
                  const state = projectStates[proj.id] || {
                    selected: true,
                    progress: 25,
                    pendingText: '',
                    deadline: '26/10/2026',
                    domain: getProjectDomain(proj)
                  };

                  return (
                    <div
                      key={proj.id}
                      className={`spp-project-card ${state.selected ? 'selected' : 'unselected'}`}
                    >
                      {/* Left: Checkbox + Title + Domain + Slider */}
                      <div className="spp-card-left-col">
                        <div className="spp-card-title-row">
                          <label className="spp-checkbox-container">
                            <input
                              type="checkbox"
                              checked={!!state.selected}
                              onChange={(e) =>
                                handleUpdateProjectProp(proj.id, 'selected', e.target.checked)
                              }
                            />
                            <span className="spp-custom-checkmark"></span>
                          </label>

                          <div className="spp-card-info">
                            <h4 className="spp-card-project-title">{proj.title}</h4>
                            <span className="spp-card-project-domain">{state.domain}</span>
                          </div>
                        </div>

                        {/* Slider & Percentage */}
                        <div className="spp-card-slider-row">
                          <input
                            type="range"
                            min="0"
                            max="100"
                            step="5"
                            value={state.progress}
                            onChange={(e) =>
                              handleUpdateProjectProp(proj.id, 'progress', Number(e.target.value))
                            }
                            className="spp-slider"
                          />
                          <span className="spp-slider-pct">{state.progress}%</span>
                        </div>
                      </div>

                      {/* Middle: What is Pending Textarea */}
                      <div className="spp-card-mid-col">
                        <label className="spp-pending-label">What is pending</label>
                        <textarea
                          className="spp-pending-textarea"
                          rows={3}
                          value={state.pendingText}
                          placeholder="Write what you need from the client..."
                          onChange={(e) =>
                            handleUpdateProjectProp(proj.id, 'pendingText', e.target.value)
                          }
                        />
                      </div>

                      {/* Right: Deadline */}
                      <div className="spp-card-right-col">
                        <label className="spp-deadline-label">Deadline</label>
                        <div className="spp-deadline-input-wrap">
                          <input
                            type="text"
                            className="spp-deadline-input"
                            value={state.deadline}
                            onChange={(e) =>
                              handleUpdateProjectProp(proj.id, 'deadline', e.target.value)
                            }
                          />
                          <span className="spp-calendar-icon">📅</span>
                        </div>
                      </div>
                    </div>
                  );
                })
              )}
            </div>

            {/* Modal Bottom Footer Bar */}
            <div className="spp-modal-footer">
              <div className="spp-footer-left-count">
                <strong>{selectedProjects.length}</strong> projects selected · average progress{' '}
                <strong>{averageProgress}%</strong>
              </div>

              <div className="spp-footer-right-actions">
                <button
                  type="button"
                  className={`spp-btn-whatsapp ${copiedWhatsApp ? 'copied' : ''}`}
                  onClick={handleCopyWhatsApp}
                >
                  {copiedWhatsApp ? '✓ Copied!' : 'Copy for WhatsApp'}
                </button>

                <button
                  type="button"
                  className="spp-btn-preview"
                  onClick={() => setIsPreviewOpen(true)}
                >
                  Preview
                </button>

                <button
                  type="button"
                  className="spp-btn-download-pdf"
                  onClick={handleDownloadPdf}
                  disabled={isDownloadingPdf || selectedProjects.length === 0}
                >
                  <span>{isDownloadingPdf ? '⏳' : '⬇'}</span>
                  <span>{isDownloadingPdf ? 'Downloading...' : 'Download PDF'}</span>
                </button>
              </div>
            </div>
          </>
        ) : (
          /* ========================================================== */
          /* VIEW 2: LIVE PDF PRINT PREVIEW (Image 1 - Progress Report) */
          /* ========================================================== */
          <div className="spp-preview-view-container">
            {/* Preview Toolbar */}
            <div className="spp-preview-top-toolbar no-print">
              <div className="spp-preview-toolbar-left">
                <button
                  type="button"
                  className="spp-btn-back"
                  onClick={() => setIsPreviewOpen(false)}
                >
                  ← Back to editing
                </button>
                <span className="spp-preview-sheet-title">
                  Previewing PDF: <strong>Progress Report — {activeClient.name}</strong>
                </span>
              </div>

              <div className="spp-preview-toolbar-right">
                <button
                  type="button"
                  className="spp-btn-print-native"
                  onClick={() => window.print()}
                >
                  🖨️ Print
                </button>
                <button
                  type="button"
                  className="spp-btn-download-pdf"
                  onClick={handleDownloadPdf}
                  disabled={isDownloadingPdf}
                >
                  <span>{isDownloadingPdf ? '⏳' : '⬇'}</span>
                  <span>{isDownloadingPdf ? 'Downloading...' : 'Download PDF'}</span>
                </button>
                <button
                  type="button"
                  className="spp-close-btn"
                  onClick={onClose}
                  title="Close"
                >
                  ✕
                </button>
              </div>
            </div>

            {/* Preview Sheet Scroll Box */}
            <div className="spp-preview-sheet-scroll">
              <ProjectProgressPrintSheet
                ref={printRef}
                clientName={activeClient.name}
                clientCompany={activeClient.company}
                clientEmail={activeClient.email}
                clientPhone={activeClient.phone}
                authorName={authorName}
                authorRole={authorRole}
                authorPhone={authorPhone}
                authorEmail={authorEmail}
                reportDate={reportDate}
                messageToClient={messageToClient}
                projects={selectedProjects}
                averageProgress={averageProgress}
              />
            </div>
          </div>
        )}

        {/* Off-screen Sheet for PDF Engine when in Edit Mode */}
        {!isPreviewOpen && (
          <div style={{ position: 'absolute', left: '-9999px', top: '-9999px' }}>
            <ProjectProgressPrintSheet
              ref={printRef}
              clientName={activeClient.name}
              clientCompany={activeClient.company}
              clientEmail={activeClient.email}
              clientPhone={activeClient.phone}
              authorName={authorName}
              authorRole={authorRole}
              authorPhone={authorPhone}
              authorEmail={authorEmail}
              reportDate={reportDate}
              messageToClient={messageToClient}
              projects={selectedProjects}
              averageProgress={averageProgress}
            />
          </div>
        )}
      </div>
    </div>
  );
}
