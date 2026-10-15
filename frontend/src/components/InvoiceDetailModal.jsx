import React, { useRef } from 'react';
import './InvoicesView.css';

export default function InvoiceDetailModal({
  invoice,
  clients = [],
  onClose,
  onPublish,
  onMarkPaid,
  isAdmin = false
}) {
  const printRef = useRef(null);

  if (!invoice) return null;

  const currency = invoice.currency || 'PKR';
  const subtotal = Number(invoice.subtotal || invoice.amount || 0);
  const tax = Number(invoice.tax || 0);
  const discount = Number(invoice.discount || 0);
  const total = Number(invoice.amount || (subtotal + tax - discount));
  const isPaid = invoice.status === 'paid';
  const isDraft = invoice.status === 'draft';
  const isPublished = invoice.status === 'published' || invoice.published;

  // Resolve client info: prioritize invoice fields > matched clients > Awais as default
  const matchedClient = (clients || []).find(c => c.id === (invoice.client_id || invoice.clientId)) || {};
  const clientName = invoice.client_name || matchedClient.name || (invoice.client_id === 'client-afshal' ? 'Afshal' : 'Awais');
  const clientCompany = invoice.client_company || matchedClient.company || (clientName === 'Afshal' ? 'Afshal Brand' : 'Awais Agency');
  const clientEmail = invoice.client_email || matchedClient.email || (clientName === 'Afshal' ? 'afshal@remotale.com' : 'awais@remotale.com');
  const clientPhone = invoice.client_phone || '+92 300 1234567';
  const clientAddress = invoice.client_address || (clientName === 'Afshal' ? 'Karachi, Sindh, Pakistan' : 'Lahore, Punjab, Pakistan');

  const handlePrint = () => {
    window.print();
  };

  // Helper to highlight last word of title in vibrant purple as shown in the theme
  const renderStyledTitle = (rawTitle) => {
    const title = (rawTitle || 'Project Invoice').trim();
    const parts = title.split(' ');
    if (parts.length <= 1) {
      return <span className="inv-title-highlight">{title}</span>;
    }
    const lastWord = parts.pop();
    const rest = parts.join(' ');
    return (
      <>
        <span>{rest} </span>
        <span className="inv-title-highlight">{lastWord}</span>
      </>
    );
  };

  // Extract project titles
  const projectTitles = Array.isArray(invoice.project_titles) && invoice.project_titles.length > 0
    ? invoice.project_titles
    : (Array.isArray(invoice.items) && invoice.items.some(it => it.project_title)
      ? Array.from(new Set(invoice.items.map(it => it.project_title).filter(Boolean)))
      : (invoice.project_title ? invoice.project_title.split(',').map(s => s.trim()).filter(Boolean) : []));

  const isMultiProject = projectTitles.length > 1;
  const primaryProjectTitle = projectTitles[0] || invoice.project_title || invoice.title || 'Project Milestone Deliverable';

  // Parse payment details or provide structured defaults matching the theme
  const parsePaymentInfo = () => {
    let title = 'Remotale (Pvt. Ltd.)';
    let bank = 'Meezan Bank';
    let account = '1234 5678 9012 3456';
    let iban = 'PK36 MEZN 0001 2345 6789 0123';
    let method = 'Bank Transfer / EasyPaisa / JazzCash';

    const raw = invoice.payment_details || '';
    if (raw) {
      if (raw.includes('Title:')) {
        const m = raw.match(/Title:\s*([^|\n]+)/i);
        if (m) title = m[1].trim();
      }
      if (raw.includes('Bank:')) {
        const m = raw.match(/Bank:\s*([^|\n]+)/i);
        if (m) bank = m[1].trim();
      }
      if (raw.includes('Account:')) {
        const m = raw.match(/Account:\s*([^|\n]+)/i);
        if (m) account = m[1].trim();
      }
      if (raw.includes('EasyPaisa') || raw.includes('JazzCash')) {
        method = 'Bank Transfer / EasyPaisa / JazzCash';
      }
    }

    return { title, bank, account, iban, method };
  };

  const payment = parsePaymentInfo();

  return (
    <div className="inv-modal-overlay" onClick={onClose}>
      <div className="inv-modal-content" onClick={(e) => e.stopPropagation()}>
        {/* Actions Header Bar (Hidden when printing/exporting PDF) */}
        <div className="inv-modal-actions-bar no-print">
          <div className="inv-modal-actions-left">
            <span className={`inv-status-pill ${invoice.status || 'published'}`}>
              {isPaid ? '✓ Paid' : isDraft ? 'Draft (Not sent)' : '● Published to Client'}
            </span>
            <span className="inv-number-tag">{invoice.invoice_number || 'RMT-2024-018'}</span>
          </div>

          <div className="inv-modal-actions-right">
            {isAdmin && isDraft && onPublish && (
              <button
                type="button"
                className="inv-btn-publish"
                onClick={() => onPublish(invoice.id)}
              >
                <span>🚀</span>
                <span>Publish to Client</span>
              </button>
            )}

            {isAdmin && !isPaid && onMarkPaid && (
              <button
                type="button"
                className="inv-btn-paid"
                onClick={() => onMarkPaid(invoice.id)}
              >
                <span>✓</span>
                <span>Mark as Paid</span>
              </button>
            )}

            <button
              type="button"
              className="inv-btn-print"
              onClick={handlePrint}
              title="Export as PDF / Print Invoice"
            >
              <span>🖨️</span>
              <span>Export PDF / Print</span>
            </button>

            <button
              type="button"
              className="inv-btn-close"
              onClick={onClose}
              title="Close Modal"
            >
              ✕
            </button>
          </div>
        </div>

        {/* Printable Invoice Sheet - Exactly matching the user's reference theme */}
        <div className="inv-sheet inv-theme-sheet" ref={printRef}>
          {/* Subtle Corner Ambient Auras */}
          <div className="inv-ambient-accent-top" />
          <div className="inv-ambient-accent-bottom" />

          <div className="inv-sheet-inner">
            {/* Top Header Row */}
            <div className="inv-theme-header">
              {/* Brand Logo & Tagline */}
              <div className="inv-theme-logo-box">
                <svg width="42" height="42" viewBox="0 0 38 38" fill="none">
                  <path d="M7 6C7 4.89543 7.89543 4 9 4H23C27.9706 4 32 8.02944 32 13C32 16.9427 29.4674 20.2929 25.9328 21.503L33.2 32.4C33.6 33 33.15 34 32.35 34H26.5C25.9 34 25.35 33.7 25 33.2L18.8 24H14V33C14 33.5523 13.5523 34 13 34H8C7.44772 34 7 33.5523 7 33V6Z" fill="url(#rmtGrad)" />
                  <path d="M14 10V18H22C24.2091 18 26 16.2091 26 14C26 11.7909 24.2091 10 22 10H14Z" fill="#FFFFFF" />
                  <defs>
                    <linearGradient id="rmtGrad" x1="7" y1="4" x2="33" y2="34" gradientUnits="userSpaceOnUse">
                      <stop stopColor="#6366F1" />
                      <stop offset="0.5" stopColor="#4F46E5" />
                      <stop offset="1" stopColor="#7C3AED" />
                    </linearGradient>
                  </defs>
                </svg>
                <div className="inv-theme-brand-titles">
                  <span className="inv-theme-brand-name">Remotale</span>
                  <span className="inv-theme-brand-tagline">Design &nbsp;·&nbsp; Develop &nbsp;·&nbsp; Grow</span>
                </div>
              </div>

              {/* Right Meta Block & Status */}
              <div className="inv-theme-meta-right">
                <div className="inv-theme-meta-row">
                  <span className="inv-theme-meta-lbl">Invoice No:</span>
                  <span className="inv-theme-meta-val">{invoice.invoice_number || 'RMT-2024-018'}</span>
                </div>
                <div className="inv-theme-meta-row">
                  <span className="inv-theme-meta-lbl">Issue Date:</span>
                  <span className="inv-theme-meta-val">{invoice.issue_date || '12 Oct 2024'}</span>
                </div>
                <div className="inv-theme-meta-row">
                  <span className="inv-theme-meta-lbl">Due Date:</span>
                  <span className="inv-theme-meta-val">{invoice.due_date || '25 Oct 2024'}</span>
                </div>
                <div className="inv-theme-status-pill-wrap">
                  <span className={`inv-theme-status-pill ${isPaid ? 'paid' : isDraft ? 'draft' : 'pending'}`}>
                    {isPaid ? 'Paid' : isDraft ? 'Draft Invoice' : 'Pending Payment'}
                  </span>
                </div>
              </div>
            </div>

            {/* Big Title Banner */}
            <div className="inv-theme-title-banner">
              <span className="inv-theme-section-label">PROJECT INVOICE</span>
              <h1 className="inv-theme-hero-title">
                {renderStyledTitle(invoice.title || primaryProjectTitle)}
              </h1>
              <p className="inv-theme-hero-sub">
                {invoice.notes || 'Thank you for choosing Remotale. Here is the detailed invoice and payment summary for your project.'}
              </p>
            </div>

            {/* Two-Column Info Cards: Billed To & Covered Projects / Project Details */}
            <div className="inv-theme-cards-grid">
              {/* Card 1: Billed To */}
              <div className="inv-theme-card">
                <div className="inv-theme-card-header">
                  <div className="inv-theme-icon-square purple">
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
                      <path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z"/>
                    </svg>
                  </div>
                  <h3 className="inv-theme-card-title">Billed To</h3>
                </div>

                <div className="inv-theme-kv-list">
                  <div className="inv-theme-kv-row">
                    <span className="inv-theme-k">Name</span>
                    <span className="inv-theme-sep">:</span>
                    <span className="inv-theme-v font-bold" style={{ fontSize: '13.5px', color: '#1e1b4b' }}>
                      {clientName}
                    </span>
                  </div>

                  <div className="inv-theme-kv-row">
                    <span className="inv-theme-k">Company</span>
                    <span className="inv-theme-sep">:</span>
                    <span className="inv-theme-v">{clientCompany}</span>
                  </div>

                  <div className="inv-theme-kv-row">
                    <span className="inv-theme-k">Email</span>
                    <span className="inv-theme-sep">:</span>
                    <span className="inv-theme-v">{clientEmail}</span>
                  </div>

                  <div className="inv-theme-kv-row">
                    <span className="inv-theme-k">Phone</span>
                    <span className="inv-theme-sep">:</span>
                    <span className="inv-theme-v">{clientPhone}</span>
                  </div>

                  <div className="inv-theme-kv-row">
                    <span className="inv-theme-k">Address</span>
                    <span className="inv-theme-sep">:</span>
                    <span className="inv-theme-v">{clientAddress}</span>
                  </div>
                </div>
              </div>

              {/* Card 2: Covered Projects or Project Details */}
              <div className="inv-theme-card">
                {isMultiProject ? (
                  <>
                    <div className="inv-theme-card-header">
                      <div className="inv-theme-icon-square purple">
                        <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
                          <path d="M20 6h-8l-2-2H4c-1.1 0-1.99.9-1.99 2L2 18c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V8c0-1.1-.9-2-2-2zm0 12H4V8h16v10z"/>
                        </svg>
                      </div>
                      <h3 className="inv-theme-card-title" style={{ color: '#4338ca', fontWeight: 800, letterSpacing: '0.04em', textTransform: 'uppercase', fontSize: '12.5px' }}>
                        COVERED PROJECTS ({projectTitles.length}):
                      </h3>
                    </div>

                    <div className="inv-covered-projects-content">
                      <div className="inv-sheet-projects-list">
                        {projectTitles.map((t, idx) => (
                          <span key={idx} className="inv-sheet-project-pill">📁 {t}</span>
                        ))}
                      </div>
                      <p className="inv-covered-statement-sub">
                        Consolidated Multi-Project Milestone Statement
                      </p>
                    </div>
                  </>
                ) : (
                  <>
                    <div className="inv-theme-card-header">
                      <div className="inv-theme-icon-square purple">
                        <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
                          <path d="M20 6h-8l-2-2H4c-1.1 0-1.99.9-1.99 2L2 18c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V8c0-1.1-.9-2-2-2zm0 12H4V8h16v10z"/>
                        </svg>
                      </div>
                      <h3 className="inv-theme-card-title">Project Details</h3>
                    </div>

                    <div className="inv-theme-kv-list">
                      <div className="inv-theme-kv-row">
                        <span className="inv-theme-k">Project Title</span>
                        <span className="inv-theme-sep">:</span>
                        <span className="inv-theme-v font-bold">{primaryProjectTitle}</span>
                      </div>

                      <div className="inv-theme-kv-row">
                        <span className="inv-theme-k">Project Type</span>
                        <span className="inv-theme-sep">:</span>
                        <span className="inv-theme-v">Web Development & Store Setup</span>
                      </div>

                      <div className="inv-theme-kv-row">
                        <span className="inv-theme-k">Timeline</span>
                        <span className="inv-theme-sep">:</span>
                        <span className="inv-theme-v">{invoice.issue_date || '15/10/2026'} – {invoice.due_date || '25/10/2026'}</span>
                      </div>

                      <div className="inv-theme-kv-row">
                        <span className="inv-theme-k">Status</span>
                        <span className="inv-theme-sep">:</span>
                        <span className="inv-theme-v">
                          <span className="inv-theme-dot-badge">
                            <span className="inv-theme-dot" />
                            <span>In Progress</span>
                          </span>
                        </span>
                      </div>
                    </div>
                  </>
                )}
              </div>
            </div>

            {/* Invoice Breakdown Table Card */}
            <div className="inv-theme-card inv-table-card">
              <div className="inv-theme-table-card-header">
                <div className="inv-theme-header-left">
                  <div className="inv-theme-icon-square purple">
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
                      <path d="M19 3H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zm-5 14H7v-2h7v2zm3-4H7v-2h10v2zm0-4H7V7h10v2z"/>
                    </svg>
                  </div>
                  <h3 className="inv-theme-card-title">Invoice Breakdown</h3>
                </div>

                <div className="inv-theme-currency-tag">
                  Currency: {currency}
                </div>
              </div>

              <div className="inv-theme-table-wrap">
                <table className="inv-theme-table">
                  <thead>
                    <tr>
                      <th style={{ width: '45px', textAlign: 'center' }}>#</th>
                      <th>Service / Description</th>
                      <th style={{ width: '65px', textAlign: 'center' }}>Qty</th>
                      <th style={{ width: '150px', textAlign: 'right' }}>Unit Price ({currency})</th>
                      <th style={{ width: '150px', textAlign: 'right' }}>Amount ({currency})</th>
                    </tr>
                  </thead>
                  <tbody>
                    {Array.isArray(invoice.items) && invoice.items.length > 0 ? (
                      invoice.items.map((item, idx) => (
                        <tr key={idx}>
                          <td style={{ textAlign: 'center', color: '#64748b' }}>{idx + 1}</td>
                          <td>
                            <div className="inv-theme-item-title-box">
                              {item.project_title && (
                                <span className="inv-theme-item-proj-tag">📁 {item.project_title}</span>
                              )}
                              <span className="inv-theme-item-title">
                                {item.description || 'Milestone Deliverable'}
                              </span>
                            </div>
                            <span className="inv-theme-item-sub">
                              Modern, responsive, and conversion-focused deliverable.
                            </span>
                          </td>
                          <td style={{ textAlign: 'center', fontWeight: 600 }}>{item.qty || 1}</td>
                          <td style={{ textAlign: 'right', fontWeight: 600, color: '#1e293b' }}>
                            {Number(item.rate || item.amount || 0).toLocaleString()}
                          </td>
                          <td style={{ textAlign: 'right', fontWeight: 700, color: '#0f172a' }}>
                            {Number(item.amount || ((item.qty || 1) * (item.rate || 0))).toLocaleString()}
                          </td>
                        </tr>
                      ))
                    ) : (
                      <tr>
                        <td style={{ textAlign: 'center' }}>1</td>
                        <td>
                          <span className="inv-theme-item-title">{invoice.title || 'Store Setup & Web Services'}</span>
                          <span className="inv-theme-item-sub">Full scope development and responsive UI design.</span>
                        </td>
                        <td style={{ textAlign: 'center' }}>1</td>
                        <td style={{ textAlign: 'right' }}>{total.toLocaleString()}</td>
                        <td style={{ textAlign: 'right' }}>{total.toLocaleString()}</td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>

            {/* Two-Column Section: Payment Information & Invoice Summary */}
            <div className="inv-theme-cards-grid bottom-grid">
              {/* Card 1: Payment Information */}
              <div className="inv-theme-card">
                <div className="inv-theme-card-header">
                  <div className="inv-theme-icon-square purple">
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
                      <path d="M20 4H4c-1.11 0-1.99.89-1.99 2L2 18c0 1.11.89 2 2 2h16c1.11 0 2-.89 2-2V6c0-1.11-.89-2-2-2zm0 14H4v-6h16v6zm0-10H4V6h16v2z"/>
                    </svg>
                  </div>
                  <h3 className="inv-theme-card-title">Payment Information</h3>
                </div>

                <div className="inv-theme-kv-list">
                  <div className="inv-theme-kv-row">
                    <span className="inv-theme-k">Account Title</span>
                    <span className="inv-theme-sep">:</span>
                    <span className="inv-theme-v">{payment.title}</span>
                  </div>

                  <div className="inv-theme-kv-row">
                    <span className="inv-theme-k">Bank Name</span>
                    <span className="inv-theme-sep">:</span>
                    <span className="inv-theme-v">{payment.bank}</span>
                  </div>

                  <div className="inv-theme-kv-row">
                    <span className="inv-theme-k">Account Number</span>
                    <span className="inv-theme-sep">:</span>
                    <span className="inv-theme-v">{payment.account}</span>
                  </div>

                  <div className="inv-theme-kv-row">
                    <span className="inv-theme-k">IBAN</span>
                    <span className="inv-theme-sep">:</span>
                    <span className="inv-theme-v">{payment.iban}</span>
                  </div>

                  <div className="inv-theme-kv-row">
                    <span className="inv-theme-k">Payment Method</span>
                    <span className="inv-theme-sep">:</span>
                    <span className="inv-theme-v">{payment.method}</span>
                  </div>
                </div>
              </div>

              {/* Card 2: Invoice Summary */}
              <div className="inv-theme-card summary-card">
                <div className="inv-theme-card-header">
                  <div className="inv-theme-icon-square soft-violet">
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
                      <path d="M19 3H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zm-7 14h-2v-2h2v2zm0-4h-2V7h2v6zm4 4h-2v-2h2v2zm0-4h-2v-2h2v2z"/>
                    </svg>
                  </div>
                  <h3 className="inv-theme-card-title summary-title">Invoice Summary</h3>
                </div>

                <div className="inv-theme-summary-lines">
                  <div className="inv-theme-summary-line">
                    <span className="inv-theme-sum-lbl">Subtotal</span>
                    <span className="inv-theme-sum-val">{currency} {subtotal.toLocaleString()}</span>
                  </div>

                  {discount > 0 && (
                    <div className="inv-theme-summary-line discount">
                      <span className="inv-theme-sum-lbl">Discount</span>
                      <span className="inv-theme-sum-val">- {currency} {discount.toLocaleString()}</span>
                    </div>
                  )}

                  <div className="inv-theme-summary-line">
                    <span className="inv-theme-sum-lbl">Tax ({tax > 0 ? `${tax}%` : '0%'})</span>
                    <span className="inv-theme-sum-val">{currency} {tax.toLocaleString()}</span>
                  </div>

                  <div className="inv-theme-summary-total-row">
                    <span className="inv-theme-grand-lbl">Total Amount</span>
                    <span className="inv-theme-grand-val">{currency} {total.toLocaleString()}</span>
                  </div>

                  <div className="inv-theme-due-notice-box">
                    <div className="inv-theme-due-notice-title">
                      <span className="inv-theme-info-icon">ⓘ</span>
                      <span>Payment is due by {invoice.due_date || '25 Oct 2024'}</span>
                    </div>
                    <span className="inv-theme-due-notice-sub">
                      Please complete the payment to keep your project on track.
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* Thank You & Official Authorized Stamp Row */}
            <div className="inv-theme-cards-grid signature-grid">
              {/* Left Box: Thank You! */}
              <div className="inv-theme-card thank-you-card">
                <div className="inv-theme-icon-square soft-violet">
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M20 4H4c-1.1 0-1.99.9-1.99 2L2 18c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2zm0 4l-8 5-8-5V6l8 5 8-5v2z"/>
                  </svg>
                </div>
                <div>
                  <h4 className="inv-theme-thanks-title">Thank You!</h4>
                  <p className="inv-theme-thanks-text">
                    We appreciate your trust in Remotale and look forward to a successful collaboration. If you have any questions regarding this invoice, feel free to contact us.
                  </p>
                </div>
              </div>

              {/* Right Box: Authorized Signature & Circular Stamp */}
              <div className="inv-theme-auth-box">
                <div className="inv-theme-sig-col">
                  <span className="inv-theme-auth-label">Authorized By</span>
                  <div className="inv-theme-signature-wrapper">
                    {/* Authentic cursive signature SVG matching the photo */}
                    <svg width="130" height="42" viewBox="0 0 140 45" fill="none">
                      <path d="M12 32C18 19 28 8 36 12C42 15 32 35 24 38C18 40 22 26 38 24C52 22 75 16 90 22C102 27 88 34 78 30C70 27 82 18 105 18C118 18 128 22 135 25" stroke="#1e1b4b" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" />
                      <path d="M30 20L48 35" stroke="#1e1b4b" strokeWidth="1.8" strokeLinecap="round" />
                    </svg>
                  </div>
                  <span className="inv-theme-signee-name">Abdullah</span>
                  <span className="inv-theme-signee-title">Lead Director, Remotale</span>
                </div>

                {/* Circular Double-Ring Official Stamp matching the photo */}
                <div className="inv-theme-stamp-col">
                  <svg width="86" height="86" viewBox="0 0 100 100">
                    <defs>
                      <path id="themeStampTop" d="M 21,50 A 29,29 0 1,1 79,50" />
                      <path id="themeStampBottom" d="M 79,50 A 29,29 0 1,1 21,50" />
                    </defs>
                    {/* Double Outer Rings */}
                    <circle cx="50" cy="50" r="46" fill="none" stroke="#1e1b4b" strokeWidth="2.2" />
                    <circle cx="50" cy="50" r="42" fill="none" stroke="#1e1b4b" strokeWidth="0.9" strokeDasharray="3,2" />
                    <circle cx="50" cy="50" r="27" fill="none" stroke="#1e1b4b" strokeWidth="1.5" />
                    {/* Curved Top & Bottom Texts */}
                    <text fill="#1e1b4b" fontSize="6.2" fontWeight="800" letterSpacing="1.2">
                      <textPath href="#themeStampTop" startOffset="50%" textAnchor="middle">
                        REMOTALE (PVT. LTD.)
                      </textPath>
                    </text>
                    <text fill="#1e1b4b" fontSize="5.2" fontWeight="700" letterSpacing="1.1">
                      <textPath href="#themeStampBottom" startOffset="50%" textAnchor="middle">
                        ★ KARACHI, PAKISTAN ★
                      </textPath>
                    </text>
                    {/* Central R Mark */}
                    <g transform="translate(38, 36) scale(0.64)">
                      <path d="M4 4H15C17.7614 4 20 6.23858 20 9C20 11.7614 17.7614 14 15 14H9V20H4V4Z" fill="#1e1b4b" />
                      <path d="M9 8H14C14.5523 8 15 8.44772 15 9C15 9.55228 14.5523 10 14 10H9V8Z" fill="#FFFFFF" />
                      <path d="M14 14L20 20H15L10 14H14Z" fill="#1e1b4b" />
                    </g>
                  </svg>
                </div>
              </div>
            </div>

            {/* Bottom Footer Bar */}
            <div className="inv-theme-footer-bar">
              <div className="inv-theme-footer-contacts">
                <span className="inv-theme-contact-item">
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-1 17.93c-3.95-.49-7-3.85-7-7.93 0-.62.08-1.21.21-1.79L9 15v1c0 1.1.9 2 2 2v1.93zm6.9-2.54c-.26-.81-1-1.39-1.9-1.39h-1v-3c0-.55-.45-1-1-1H8v-2h2c.55 0 1-.45 1-1V7h2c1.1 0 2-.9 2-2v-.41c2.93 1.19 5 4.06 5 7.41 0 2.08-.8 3.97-2.1 5.39z"/>
                  </svg>
                  <span>www.remotale.com</span>
                </span>

                <span className="inv-theme-contact-item">
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M20 4H4c-1.1 0-1.99.9-1.99 2L2 18c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2zm0 4l-8 5-8-5V6l8 5 8-5v2z"/>
                  </svg>
                  <span>support@remotale.com</span>
                </span>

                <span className="inv-theme-contact-item">
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M6.62 10.79c1.44 2.83 3.76 5.14 6.59 6.59l2.2-2.2c.27-.27.67-.36 1.02-.24 1.12.37 2.33.57 3.57.57.55 0 1 .45 1 1V20c0 .55-.45 1-1 1-9.39 0-17-7.61-17-17 0-.55.45-1 1-1h3.5c.55 0 1 .45 1 1 0 1.25.2 2.45.57 3.57.11.35.03.74-.25 1.02l-2.2 2.2z"/>
                  </svg>
                  <span>+92 300 1234567</span>
                </span>
              </div>

              {/* Social Icons */}
              <div className="inv-theme-social-icons">
                {/* LinkedIn */}
                <a href="#linkedin" className="inv-theme-social-link" title="LinkedIn">
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M19 3a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h14m-.5 15.5v-5.3a3.26 3.26 0 0 0-3.26-3.26c-.85 0-1.84.52-2.28 1.3v-1.11h-2.79v8.37h2.79v-4.93c0-.77.62-1.4 1.39-1.4a1.4 1.4 0 0 1 1.4 1.4v4.93h2.75M6.46 8.76a1.59 1.59 0 1 0-.01-3.18 1.59 1.59 0 0 0 .01 3.18m1.39 9.74v-8.37H5.07v8.37h2.78z"/>
                  </svg>
                </a>
                {/* Instagram */}
                <a href="#instagram" className="inv-theme-social-link" title="Instagram">
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/>
                  </svg>
                </a>
                {/* YouTube */}
                <a href="#youtube" className="inv-theme-social-link" title="YouTube">
                  <svg width="15" height="15" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M10 15l5.19-3L10 9v6m11.56-7.83c.13.47.22 1.1.28 1.9.07.8.1 1.49.1 2.09L22 12c0 2.19-.16 3.8-.44 4.83-.25.9-.83 1.48-1.73 1.73-.47.13-1.33.22-2.65.28-1.3.07-2.49.1-3.59.1L12 19c-4.19 0-6.8-.16-7.83-.44-.9-.25-1.48-.83-1.73-1.73-.13-.47-.22-1.1-.28-1.9-.07-.8-.1-1.49-.1-2.09L2 12c0-2.19.16-3.8.44-4.83.25-.9.83-1.48 1.73-1.73.47-.13 1.33-.22 2.65-.28 1.3-.07 2.49-.1 3.59-.1L12 5c4.19 0 6.8.16 7.83.44.9.25 1.48.83 1.73 1.73z"/>
                  </svg>
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
