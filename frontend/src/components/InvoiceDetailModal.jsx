import React, { useRef } from 'react';
import './InvoicesView.css';

export default function InvoiceDetailModal({
  invoice,
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

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="inv-modal-overlay" onClick={onClose}>
      <div className="inv-modal-content" onClick={(e) => e.stopPropagation()}>
        {/* Actions Header (Hidden when printing) */}
        <div className="inv-modal-actions-bar no-print">
          <div className="inv-modal-actions-left">
            <span className={`inv-status-pill ${invoice.status || 'published'}`}>
              {isPaid ? '✓ Paid' : isDraft ? 'Draft (Not sent)' : '● Published to Client'}
            </span>
            <span className="inv-number-tag">{invoice.invoice_number || 'INV-2026-001'}</span>
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

        {/* Printable Invoice Sheet */}
        <div className="inv-sheet" ref={printRef}>
          {/* Header Banner */}
          <div className="inv-sheet-header">
            <div className="inv-sheet-brand">
              <div className="inv-brand-logo-box">
                <svg width="28" height="28" viewBox="0 0 24 24" fill="none">
                  <rect width="24" height="24" rx="7" fill="#4F46E5" />
                  <path d="M7 12L12 7L17 12L12 17L7 12Z" fill="#FFFFFF" />
                  <circle cx="12" cy="12" r="2.5" fill="#C7D2FE" />
                </svg>
                <div className="inv-brand-text">
                  <span className="inv-brand-name">Remotale</span>
                  <span className="inv-brand-tag">Digital Project Suite</span>
                </div>
              </div>
              <div className="inv-agency-contact">
                <p><strong>Remotale Agency</strong></p>
                <p>Lead: Abdullah</p>
                <p>admin@remotale.com</p>
                <p>www.remotale.com</p>
              </div>
            </div>

            <div className="inv-sheet-meta">
              <div className="inv-title-badge">INVOICE</div>
              <table className="inv-meta-table">
                <tbody>
                  <tr>
                    <td>Invoice #:</td>
                    <td><strong>{invoice.invoice_number || 'INV-2026-001'}</strong></td>
                  </tr>
                  <tr>
                    <td>Issue Date:</td>
                    <td>{invoice.issue_date || '15/10/2026'}</td>
                  </tr>
                  <tr>
                    <td>Due Date:</td>
                    <td><strong>{invoice.due_date || '25/10/2026'}</strong></td>
                  </tr>
                  <tr>
                    <td>Payment Status:</td>
                    <td>
                      <span className={`inv-sheet-status ${invoice.status || 'published'}`}>
                        {isPaid ? 'PAID' : isDraft ? 'DRAFT' : 'PAYMENT DUE'}
                      </span>
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>

          <div className="inv-sheet-divider" />

          {/* Billed To / Project Info */}
          <div className="inv-sheet-billing-row">
            <div className="inv-bill-col">
              <span className="inv-col-label">Billed To Client:</span>
              <h3 className="inv-client-name">{invoice.client_name || 'Client'}</h3>
              <p className="inv-client-detail">{invoice.client_company || 'Agency Client Partner'}</p>
              {invoice.client_email && (
                <p className="inv-client-detail">{invoice.client_email}</p>
              )}
            </div>

            <div className="inv-bill-col">
              {(() => {
                const projectTitles = Array.isArray(invoice.project_titles) && invoice.project_titles.length > 0
                  ? invoice.project_titles
                  : (invoice.project_title ? invoice.project_title.split(',').map(s => s.trim()).filter(Boolean) : []);

                if (projectTitles.length > 1) {
                  return (
                    <>
                      <span className="inv-col-label">Covered Projects ({projectTitles.length}):</span>
                      <div className="inv-sheet-projects-list">
                        {projectTitles.map((t, idx) => (
                          <span key={idx} className="inv-sheet-project-pill">📁 {t}</span>
                        ))}
                      </div>
                      <p className="inv-client-detail">Consolidated Multi-Project Milestone Statement</p>
                    </>
                  );
                }

                return (
                  <>
                    <span className="inv-col-label">Associated Project:</span>
                    <h4 className="inv-project-title">{projectTitles[0] || invoice.project_title || invoice.title}</h4>
                    <p className="inv-client-detail">Deliverables & Milestone Billing</p>
                  </>
                );
              })()}
            </div>
          </div>

          {/* Items Table */}
          <div className="inv-items-table-wrapper">
            <table className="inv-items-table">
              <thead>
                <tr>
                  <th style={{ width: '50px' }}>#</th>
                  <th>Service Description / Milestone</th>
                  <th style={{ width: '80px', textAlign: 'center' }}>Qty</th>
                  <th style={{ width: '130px', textAlign: 'right' }}>Unit Rate</th>
                  <th style={{ width: '140px', textAlign: 'right' }}>Total Amount</th>
                </tr>
              </thead>
              <tbody>
                {Array.isArray(invoice.items) && invoice.items.length > 0 ? (
                  invoice.items.map((item, idx) => (
                    <tr key={idx}>
                      <td>{idx + 1}</td>
                      <td>
                        {item.project_title && (
                          <div className="inv-item-project-tag">📁 {item.project_title}</div>
                        )}
                        <strong>{item.description || 'Project Development Milestone'}</strong>
                      </td>
                      <td style={{ textAlign: 'center' }}>{item.qty || 1}</td>
                      <td style={{ textAlign: 'right' }}>{currency} {Number(item.rate || item.amount || 0).toLocaleString()}</td>
                      <td style={{ textAlign: 'right' }}><strong>{currency} {Number(item.amount || (item.qty * item.rate) || 0).toLocaleString()}</strong></td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td>1</td>
                    <td>
                      <strong>{invoice.title || 'Project Development & Design Services'}</strong>
                    </td>
                    <td style={{ textAlign: 'center' }}>1</td>
                    <td style={{ textAlign: 'right' }}>{currency} {total.toLocaleString()}</td>
                    <td style={{ textAlign: 'right' }}><strong>{currency} {total.toLocaleString()}</strong></td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>

          {/* Summary & Totals */}
          <div className="inv-sheet-bottom-row">
            <div className="inv-payment-instructions-box">
              <span className="inv-box-label">💳 Payment Instructions & Bank Details:</span>
              <pre className="inv-instructions-text">
                {invoice.payment_details || `Bank: Meezan Bank / HBL
Account Title: Abdullah
Account No: 0102-0103948291
EasyPaisa / JazzCash: 0300-1234567
Wise / USDT (TRC-20): TXYZ981724918237918`}
              </pre>
              {invoice.notes && (
                <div className="inv-notes-block">
                  <strong>Notes:</strong> {invoice.notes}
                </div>
              )}
            </div>

            <div className="inv-totals-box">
              <div className="inv-totals-line">
                <span>Subtotal:</span>
                <span>{currency} {subtotal.toLocaleString()}</span>
              </div>
              {discount > 0 && (
                <div className="inv-totals-line discount">
                  <span>Discount:</span>
                  <span>- {currency} {discount.toLocaleString()}</span>
                </div>
              )}
              {tax > 0 && (
                <div className="inv-totals-line">
                  <span>Tax:</span>
                  <span>+ {currency} {tax.toLocaleString()}</span>
                </div>
              )}
              <div className="inv-totals-grand">
                <span>Total Amount Due:</span>
                <span className="inv-grand-amount">{currency} {total.toLocaleString()}</span>
              </div>
            </div>
          </div>

          {/* Footer & Signature Stamp */}
          <div className="inv-sheet-footer">
            <div className="inv-footer-stamp">
              <div className="inv-stamp-circle">
                <span>REMOTALE</span>
                <strong>OFFICIAL</strong>
                <span>DIGITAL VERIFIED</span>
              </div>
              <div className="inv-signature-box">
                <span className="inv-sig-name">Abdullah</span>
                <span className="inv-sig-title">Authorized Agency Director</span>
              </div>
            </div>

            <div className="inv-footer-thanks">
              <p>Thank you for choosing <strong>Remotale</strong> as your digital technology partner.</p>
              <p className="inv-confidential">This is a system-generated authentic client invoice from Remotale Client Suite.</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
