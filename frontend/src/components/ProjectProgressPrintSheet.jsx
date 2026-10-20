import React, { forwardRef } from 'react';
import './ClientProgressPdfModal.css';

/**
 * ProjectProgressPrintSheet
 * Exact replica of the luxury Terracotta Progress Report (Image 1).
 * Formatted for A4 export via jsPDF/html2canvas and native window.print().
 */
const ProjectProgressPrintSheet = forwardRef(function ProjectProgressPrintSheet(
  {
    clientName = 'Awais',
    clientCompany = 'Awais Agency',
    clientEmail = 'awais@remotale.com',
    clientPhone = '+92 300 1234567',
    authorName = 'Ameen',
    authorRole = 'Senior Product Designer & Web Developer',
    authorPhone = '03323531518',
    authorEmail = 'ameen.data.2011@gmail.com',
    reportDate = new Date().toLocaleDateString('en-GB', { day: '2-digit', month: '2-digit', year: 'numeric' }),
    messageToClient = 'Dear Awais, here is the latest progress on your active projects. Please check the pending items below so we can keep the launch dates on track.',
    projects = [],
    averageProgress = 25
  },
  ref
) {
  return (
    <div className="exact-pdf-sheet" ref={ref}>
      {/* 1. Top Terracotta Banner */}
      <div className="eps-top-banner">
        <div className="eps-banner-left">
          <h1 className="eps-banner-title">Progress Report</h1>
          <p className="eps-banner-sub">Web Development &amp; E-Commerce Services</p>
        </div>
        <div className="eps-banner-right">
          <div className="eps-author-pill">{authorName}</div>
        </div>
      </div>

      {/* 2. Soft Cream Report Details Card */}
      <div className="eps-cream-card">
        <div className="eps-card-left">
          <div className="eps-meta-label">REPORT FOR</div>
          <div className="eps-client-name">{clientName}</div>
          <div className="eps-client-company">{clientCompany}</div>
          <div className="eps-client-contact">
            {clientPhone && <span>{clientPhone}</span>}
            {clientEmail && <span>{clientEmail}</span>}
          </div>
        </div>

        <div className="eps-card-right">
          <div className="eps-meta-label right">REPORT DATE</div>
          <div className="eps-report-date">{reportDate}</div>
          <div className="eps-avg-progress-pill">
            {averageProgress}% average progress
          </div>
        </div>
      </div>

      {/* 3. Message to Client */}
      {messageToClient && (
        <p className="eps-client-message">
          {messageToClient}
        </p>
      )}

      {/* 4. Main Projects Table */}
      <table className="eps-projects-table">
        <thead>
          <tr>
            <th style={{ width: '28%', textAlign: 'left' }}>PROJECT</th>
            <th style={{ width: '17%', textAlign: 'left' }}>PROGRESS</th>
            <th style={{ width: '40%', textAlign: 'left' }}>WHAT IS PENDING</th>
            <th style={{ width: '15%', textAlign: 'right' }}>DEADLINE</th>
          </tr>
        </thead>
        <tbody>
          {projects.length === 0 ? (
            <tr>
              <td colSpan={4} style={{ textAlign: 'center', padding: '24px', color: '#6b7280' }}>
                No projects selected.
              </td>
            </tr>
          ) : (
            projects.map((proj, idx) => {
              const progressVal = Number(proj.progress !== undefined ? proj.progress : 25);
              const pendingRaw = (proj.pendingText || proj.pending || '').trim();
              const pendingLines = pendingRaw
                ? pendingRaw.split('\n').map((l) => l.trim()).filter(Boolean)
                : ['[Add pending items]'];

              return (
                <tr key={proj.id || idx}>
                  {/* PROJECT & DOMAIN */}
                  <td className="eps-cell-project">
                    <div className="eps-proj-title">{proj.title}</div>
                    {proj.domain && (
                      <div className="eps-proj-domain">{proj.domain}</div>
                    )}
                  </td>

                  {/* PROGRESS PERCENTAGE + BAR */}
                  <td className="eps-cell-progress">
                    <div className="eps-progress-val">{progressVal}%</div>
                    <div className="eps-progress-track">
                      <div
                        className="eps-progress-fill"
                        style={{ width: `${Math.min(100, Math.max(0, progressVal))}%` }}
                      />
                    </div>
                  </td>

                  {/* WHAT IS PENDING */}
                  <td className="eps-cell-pending">
                    {pendingLines.length === 1 && !pendingLines[0].startsWith('•') ? (
                      <div className="eps-pending-single">{pendingLines[0]}</div>
                    ) : (
                      <ul className="eps-pending-bullets">
                        {pendingLines.map((line, lIdx) => (
                          <li key={lIdx}>
                            {line.startsWith('•') || line.startsWith('-')
                              ? line.replace(/^[•\-]\s*/, '')
                              : line}
                          </li>
                        ))}
                      </ul>
                    )}
                  </td>

                  {/* DEADLINE */}
                  <td className="eps-cell-deadline">
                    {proj.deadline || '26/10/2026'}
                  </td>
                </tr>
              );
            })
          )}
        </tbody>
      </table>

      {/* Selected Projects Count */}
      <div className="eps-selected-count">
        Selected projects: <strong>{projects.length}</strong>
      </div>

      {/* 5. Footer with Note & Ameen Signature */}
      <div className="eps-footer-row">
        <div className="eps-footer-left">
          <div className="eps-footer-note-title">NOTE</div>
          <ol className="eps-footer-note-list">
            <li>Please reply with the pending items before the deadline.</li>
            <li>Delays on pending items may move the launch date.</li>
            <li>Thank you for your business!</li>
          </ol>
        </div>

        <div className="eps-footer-right">
          <div className="eps-author-name">{authorName}</div>
          <div className="eps-author-role">{authorRole}</div>
          <div className="eps-author-phone">{authorPhone}</div>
          <div className="eps-author-email">{authorEmail}</div>
        </div>
      </div>

      {/* Bottom Terracotta Accent Line */}
      <div className="eps-bottom-accent-line" />
    </div>
  );
});

export default ProjectProgressPrintSheet;
