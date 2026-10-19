import React, { useRef, useState } from 'react';
import InvoicePrintSheet from './InvoicePrintSheet';
import { exportElementToPdf } from '../utils/pdfExport';
import './InvoicesView.css';

export default function InvoiceDetailModal({
  invoice,
  clients = [],
  onClose,
  onPublish,
  onMarkPaid,
  onDelete,
  onRestore,
  onEdit,
  isAdmin = false
}) {
  const printRef = useRef(null);
  const [isExportingPdf, setIsExportingPdf] = useState(false);

  if (!invoice) return null;

  const isArchived = invoice.status === 'archived' || invoice.is_deleted;
  const isPaid = invoice.status === 'paid';
  const isDraft = invoice.status === 'draft';

  const handleExportPdf = async () => {
    if (!printRef.current || isExportingPdf) return;
    try {
      setIsExportingPdf(true);
      const filename = `Invoice-${invoice.invoice_number || 'INV-2026-08'}.pdf`;
      await exportElementToPdf(printRef.current, filename);
    } catch (err) {
      console.error('[PDF Export Error]', err);
      // Native print dialog fallback
      window.print();
    } finally {
      setIsExportingPdf(false);
    }
  };

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="inv-modal-overlay" onClick={onClose}>
      <div className="inv-modal-content" onClick={(e) => e.stopPropagation()}>
        {/* Actions Header Bar (Hidden when printing/exporting PDF) */}
        <div className="inv-modal-actions-bar no-print">
          <div className="inv-modal-actions-left">
            <span className={`inv-status-pill ${invoice.status || 'published'}`}>
              {isArchived ? '📦 Archived / Preserved in DB' : isPaid ? '✓ Paid' : isDraft ? 'Draft (Not sent)' : '● Published to Client'}
            </span>
            <span className="inv-number-tag">{invoice.invoice_number || 'INV-2026-08'}</span>
          </div>

          <div className="inv-modal-actions-right">
            {isAdmin && isArchived && onRestore && (
              <button
                type="button"
                className="inv-btn-publish"
                style={{ backgroundColor: '#4F46E5' }}
                onClick={() => {
                  onRestore(invoice.id);
                  onClose();
                }}
              >
                <span>♻️</span>
                <span>Restore to Active</span>
              </button>
            )}

            {isAdmin && isDraft && !isArchived && onPublish && (
              <button
                type="button"
                className="inv-btn-publish"
                onClick={() => onPublish(invoice.id)}
              >
                <span>🚀</span>
                <span>Publish to Client</span>
              </button>
            )}

            {isAdmin && !isPaid && !isArchived && onMarkPaid && (
              <button
                type="button"
                className="inv-btn-paid"
                onClick={() => onMarkPaid(invoice.id)}
              >
                <span>✓</span>
                <span>Mark as Paid</span>
              </button>
            )}

            {isAdmin && !isArchived && onEdit && (
              <button
                type="button"
                className="inv-btn-edit-modal"
                onClick={() => {
                  onClose();
                  onEdit(invoice);
                }}
                title="Edit this invoice"
              >
                <span>✏️</span>
                <span>Edit</span>
              </button>
            )}

            {isAdmin && !isArchived && onDelete && (
              <button
                type="button"
                className="inv-btn-delete-modal"
                onClick={() => {
                  onDelete(invoice.id);
                  onClose();
                }}
                title="Archive invoice safely"
              >
                <span>🗑️</span>
                <span>Archive</span>
              </button>
            )}

            {/* Direct PDF Download Button */}
            <button
              type="button"
              className="inv-btn-export-pdf"
              onClick={handleExportPdf}
              disabled={isExportingPdf}
              title="Download official PDF file"
            >
              <span>{isExportingPdf ? '⏳' : '📥'}</span>
              <span>{isExportingPdf ? 'Downloading PDF...' : 'Export PDF'}</span>
            </button>

            {/* Standard Print Button */}
            <button
              type="button"
              className="inv-btn-print"
              onClick={handlePrint}
              title="Print Invoice / Print to PDF"
            >
              <span>🖨️</span>
              <span>Print</span>
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

        {/* Printable Terracotta & Cream Luxury Sheet */}
        <InvoicePrintSheet ref={printRef} invoice={invoice} clients={clients} />
      </div>
    </div>
  );
}
