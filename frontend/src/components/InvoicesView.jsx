import React, { useState, useMemo, useRef } from 'react';
import CreateInvoiceModal from './CreateInvoiceModal';
import InvoiceDetailModal from './InvoiceDetailModal';
import InvoicePrintSheet from './InvoicePrintSheet';
import LetterAvatar from './LetterAvatar';
import { exportElementToPdf } from '../utils/pdfExport';
import './InvoicesView.css';

export default function InvoicesView({
  invoices = [],
  clients = [],
  projects = [],
  currentUser = null,
  isAdmin = false,
  onCreateInvoice,
  onPublishInvoice,
  onMarkPaidInvoice,
  onDeleteInvoice,
  onRestoreInvoice,
  onUpdateInvoice
}) {
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [clientFilter, setClientFilter] = useState('all');
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [selectedInvoice, setSelectedInvoice] = useState(null);
  const [editingInvoice, setEditingInvoice] = useState(null);
  const [exportingInv, setExportingInv] = useState(null);
  const [exportingInvId, setExportingInvId] = useState(null);
  const offscreenExportRef = useRef(null);

  const handleDownloadInvoicePdf = async (inv) => {
    if (exportingInvId) return;
    try {
      setExportingInvId(inv.id);
      setExportingInv(inv);
      // Wait for React to render offscreen sheet
      await new Promise(r => setTimeout(r, 80));
      if (offscreenExportRef.current) {
        const filename = `Invoice-${inv.invoice_number || 'INV-2026-08'}.pdf`;
        await exportElementToPdf(offscreenExportRef.current, filename);
      }
    } catch (err) {
      console.error('[Quick PDF Export Error]', err);
    } finally {
      setExportingInv(null);
      setExportingInvId(null);
    }
  };

  // Filter invoices based on user role and filters
  const filteredInvoices = useMemo(() => {
    return invoices.filter(inv => {
      const isArchived = inv.status === 'archived' || inv.is_deleted;

      // Client role: only show invoices for this specific client and only if published or paid (never archived/draft)!
      if (!isAdmin && currentUser) {
        const isForClient = inv.client_id === currentUser.id || inv.clientId === currentUser.id;
        const isPublic = (inv.status === 'published' || inv.status === 'paid' || inv.published) && !isArchived;
        if (!isForClient || !isPublic) return false;
      }

      // Admin client filter
      if (isAdmin && clientFilter !== 'all') {
        const cId = inv.client_id || inv.clientId;
        if (cId !== clientFilter) return false;
      }

      // Status filter
      if (statusFilter === 'all') {
        // In "All" view, do not clutter with archived items
        if (isArchived) return false;
      } else if (statusFilter === 'published') {
        if (inv.status !== 'published' || isArchived) return false;
      } else if (statusFilter === 'draft') {
        if (inv.status !== 'draft' || isArchived) return false;
      } else if (statusFilter === 'paid') {
        if (inv.status !== 'paid' || isArchived) return false;
      } else if (statusFilter === 'archived') {
        if (!isArchived) return false;
      }

      // Search query
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        const matchesNumber = (inv.invoice_number || '').toLowerCase().includes(q);
        const matchesTitle = (inv.title || '').toLowerCase().includes(q);
        const matchesClient = (inv.client_name || '').toLowerCase().includes(q);
        const matchesProj = (inv.project_title || '').toLowerCase().includes(q) ||
          (Array.isArray(inv.project_titles) && inv.project_titles.some(pt => pt.toLowerCase().includes(q))) ||
          (Array.isArray(inv.items) && inv.items.some(it => (it.project_title || '').toLowerCase().includes(q)));
        if (!matchesNumber && !matchesTitle && !matchesClient && !matchesProj) return false;
      }

      return true;
    });
  }, [invoices, isAdmin, currentUser, clientFilter, statusFilter, searchQuery]);

  // Compute stats
  const stats = useMemo(() => {
    let totalInv = 0;
    let paidVal = 0;
    let pendingVal = 0;
    let draftCount = 0;
    let archivedCount = 0;

    const baseList = !isAdmin && currentUser 
      ? invoices.filter(i => (i.client_id === currentUser.id || i.clientId === currentUser.id) && (i.status === 'published' || i.status === 'paid' || i.published) && i.status !== 'archived')
      : invoices;

    baseList.forEach(inv => {
      const isArchived = inv.status === 'archived' || inv.is_deleted;
      if (isArchived) {
        archivedCount++;
        return;
      }

      const amt = Number(inv.amount || 0);
      totalInv += amt;
      if (inv.status === 'paid') {
        paidVal += amt;
      } else if (inv.status === 'published' || inv.published) {
        pendingVal += amt;
      } else if (inv.status === 'draft') {
        draftCount++;
      }
    });

    return { totalInv, paidVal, pendingVal, draftCount, archivedCount };
  }, [invoices, isAdmin, currentUser]);

  const handleCreateSubmit = async (payload, publishImmediately) => {
    if (onCreateInvoice) {
      await onCreateInvoice(payload, publishImmediately);
    }
  };

  const handleEditSubmit = async (payload, publishImmediately, invoiceId) => {
    if (onUpdateInvoice && invoiceId) {
      await onUpdateInvoice(invoiceId, payload);
      if (selectedInvoice && selectedInvoice.id === invoiceId) {
        setSelectedInvoice(prev => ({ ...prev, ...payload }));
      }
    }
    setEditingInvoice(null);
  };

  const handlePublishClick = async (invoiceId) => {
    if (onPublishInvoice) {
      await onPublishInvoice(invoiceId);
      if (selectedInvoice && selectedInvoice.id === invoiceId) {
        setSelectedInvoice(prev => ({ ...prev, status: 'published', published: true }));
      }
    }
  };

  const handlePaidClick = async (invoiceId) => {
    if (onMarkPaidInvoice) {
      await onMarkPaidInvoice(invoiceId);
      if (selectedInvoice && selectedInvoice.id === invoiceId) {
        setSelectedInvoice(prev => ({ ...prev, status: 'paid' }));
      }
    }
  };

  const handleDeleteClick = async (invoiceId) => {
    if (window.confirm('Do you want to archive this invoice? It will remain safely preserved in the database and can be restored anytime.')) {
      if (onDeleteInvoice) {
        await onDeleteInvoice(invoiceId);
        if (selectedInvoice && selectedInvoice.id === invoiceId) {
          setSelectedInvoice(prev => ({ ...prev, status: 'archived', is_deleted: true }));
        }
      }
    }
  };

  const handleRestoreClick = async (invoiceId) => {
    if (onRestoreInvoice) {
      await onRestoreInvoice(invoiceId);
      if (selectedInvoice && selectedInvoice.id === invoiceId) {
        setSelectedInvoice(prev => ({ ...prev, status: 'draft', is_deleted: false }));
      }
    }
  };

  return (
    <div className="invoices-view-container">
      {/* Top Banner Header */}
      <div className="invoices-header">
        <div className="invoices-header-left">
          <div className="invoices-badge-pill">
            <span>💳</span>
            <span>Billing & Financial Center</span>
          </div>
          <h1 className="invoices-title">
            {isAdmin ? 'Invoices & Billing Manager' : 'My Invoices & Statements'}
          </h1>
          <p className="invoices-subtitle">
            {isAdmin 
              ? 'Generate itemized project invoices, publish them directly to clients, and export branded PDFs.' 
              : 'Review your project milestones, payment receipts, and download official PDF statements.'}
          </p>
        </div>

        {isAdmin && (
          <div className="invoices-header-right">
            <button
              type="button"
              className="invoices-btn-create"
              onClick={() => setIsCreateOpen(true)}
            >
              <span style={{ fontSize: '16px' }}>+</span>
              <span>Generate Invoice</span>
            </button>
          </div>
        )}
      </div>

      {/* Financial Stats Bar */}
      <div className="invoices-stats-grid">
        <div className="inv-stat-card">
          <div className="inv-stat-icon purple">💼</div>
          <div>
            <div className="inv-stat-val">PKR {stats.totalInv.toLocaleString()}</div>
            <div className="inv-stat-lbl">Total Invoiced</div>
          </div>
        </div>

        <div className="inv-stat-card">
          <div className="inv-stat-icon green">✓</div>
          <div>
            <div className="inv-stat-val">PKR {stats.paidVal.toLocaleString()}</div>
            <div className="inv-stat-lbl">Paid & Settled</div>
          </div>
        </div>

        <div className="inv-stat-card">
          <div className="inv-stat-icon amber">⏳</div>
          <div>
            <div className="inv-stat-val">PKR {stats.pendingVal.toLocaleString()}</div>
            <div className="inv-stat-lbl">Pending / Published</div>
          </div>
        </div>

        {isAdmin && (
          <div className="inv-stat-card">
            <div className="inv-stat-icon gray">📝</div>
            <div>
              <div className="inv-stat-val">{stats.draftCount}</div>
              <div className="inv-stat-lbl">Unpublished Drafts</div>
            </div>
          </div>
        )}
      </div>

      {/* Filter and Search Bar */}
      <div className="invoices-controls-row">
        <div className="inv-search-wrap">
          <span className="inv-search-icon">🔍</span>
          <input
            type="text"
            className="inv-search-input"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search by Invoice #, Project, or Client name..."
          />
          {searchQuery && (
            <button
              type="button"
              className="inv-search-clear"
              onClick={() => setSearchQuery('')}
            >
              ✕
            </button>
          )}
        </div>

        <div className="inv-filters-wrap">
          {/* Status Filter */}
          <div className="inv-filter-pills">
            <button
              type="button"
              className={`inv-filter-btn ${statusFilter === 'all' ? 'active' : ''}`}
              onClick={() => setStatusFilter('all')}
            >
              All
            </button>
            <button
              type="button"
              className={`inv-filter-btn ${statusFilter === 'published' ? 'active' : ''}`}
              onClick={() => setStatusFilter('published')}
            >
              Published
            </button>
            {isAdmin && (
              <button
                type="button"
                className={`inv-filter-btn ${statusFilter === 'draft' ? 'active' : ''}`}
                onClick={() => setStatusFilter('draft')}
              >
                Drafts ({stats.draftCount})
              </button>
            )}
            <button
              type="button"
              className={`inv-filter-btn ${statusFilter === 'paid' ? 'active' : ''}`}
              onClick={() => setStatusFilter('paid')}
            >
              Paid
            </button>
            {isAdmin && (
              <button
                type="button"
                className={`inv-filter-btn ${statusFilter === 'archived' ? 'active' : ''}`}
                onClick={() => setStatusFilter('archived')}
              >
                Archived ({stats.archivedCount || 0})
              </button>
            )}
          </div>

          {/* Client Filter (Admin only) */}
          {isAdmin && clients.length > 0 && (
            <select
              className="inv-client-select"
              value={clientFilter}
              onChange={(e) => setClientFilter(e.target.value)}
            >
              <option value="all">All Clients</option>
              {clients.map(c => (
                <option key={c.id} value={c.id}>
                  {c.name} {c.company ? `(${c.company})` : ''}
                </option>
              ))}
            </select>
          )}
        </div>
      </div>

      {/* Invoices List / Table */}
      {filteredInvoices.length === 0 ? (
        <div className="invoices-empty-card">
          <div className="inv-empty-icon">📄</div>
          <h3>{statusFilter === 'archived' ? 'No Archived Invoices' : statusFilter === 'draft' ? 'No Draft Invoices' : 'No Invoices Found'}</h3>
          <p>
            {statusFilter === 'archived'
              ? 'There are no archived invoices. Every invoice remains active in the database.'
              : isAdmin 
                ? 'Click the button below to generate your client project invoice.' 
                : 'There are currently no active or published invoices for your account.'}
          </p>
          {isAdmin && statusFilter !== 'archived' && (
            <button
              type="button"
              className="invoices-btn-create"
              style={{ marginTop: '14px', display: 'inline-flex' }}
              onClick={() => setIsCreateOpen(true)}
            >
              + Generate First Invoice
            </button>
          )}
        </div>
      ) : (
        <div className="invoices-card-list">
          {filteredInvoices.map((inv) => {
            const isArchived = inv.status === 'archived' || inv.is_deleted;
            const isPaid = inv.status === 'paid';
            const isDraft = inv.status === 'draft';
            const isPub = inv.status === 'published' || inv.published;
            const currency = inv.currency || 'PKR';
            const amount = Number(inv.amount || 0);

            return (
              <div key={inv.id} className="inv-item-card" style={isArchived ? { opacity: 0.9, borderColor: '#CBD5E1' } : {}}>
                {/* Left Section: Info */}
                <div className="inv-card-left">
                  <div className="inv-card-number-row">
                    <span className="inv-card-number">{inv.invoice_number || 'INV-2026-001'}</span>
                    <span className={`inv-status-pill ${inv.status || 'published'}`}>
                      {isArchived ? '📦 Archived (Saved in DB)' : isPaid ? '✓ Paid' : isDraft ? 'Draft' : '● Published'}
                    </span>
                  </div>

                  <h3 className="inv-card-title">{inv.title || 'Project Milestone Invoice'}</h3>

                  <div className="inv-card-details-row">
                    <div className="inv-card-client-pill">
                      <LetterAvatar name={inv.client_name || 'Client'} size={20} />
                      <span>{inv.client_name || 'Client'}</span>
                      {inv.client_company && <span className="inv-company-tag">({inv.client_company})</span>}
                    </div>

                    {(() => {
                      const projectBadges = Array.isArray(inv.project_titles) && inv.project_titles.length > 0
                        ? inv.project_titles
                        : (inv.project_title ? inv.project_title.split(',').map(s => s.trim()).filter(Boolean) : []);

                      if (projectBadges.length === 0) return null;

                      return projectBadges.map((projTitle, pIdx) => (
                        <span key={pIdx} className="inv-card-proj-badge" title={projTitle}>
                          📁 {projTitle}
                        </span>
                      ));
                    })()}

                    <span className="inv-card-date">
                      📅 Due: <strong>{inv.due_date || '25/10/2026'}</strong>
                    </span>
                  </div>
                </div>

                {/* Right Section: Price & Actions */}
                <div className="inv-card-right">
                  <div className="inv-card-price-box">
                    <span className="inv-price-lbl">Amount</span>
                    <span className="inv-price-val">{currency} {amount.toLocaleString()}</span>
                  </div>

                  <div className="inv-card-actions">
                    <button
                      type="button"
                      className="inv-action-btn export-pdf-btn"
                      onClick={() => handleDownloadInvoicePdf(inv)}
                      disabled={exportingInvId === inv.id}
                      title="Download Invoice as PDF"
                    >
                      <span>{exportingInvId === inv.id ? '⏳' : '📥'}</span>
                      <span>{exportingInvId === inv.id ? 'Exporting...' : 'Export PDF'}</span>
                    </button>

                    <button
                      type="button"
                      className="inv-action-btn view-btn"
                      onClick={() => setSelectedInvoice(inv)}
                      title="View & Print Invoice"
                    >
                      <span>👁️</span>
                      <span>View</span>
                    </button>

                    {isAdmin && !isArchived && (
                      <button
                        type="button"
                        className="inv-action-btn edit-btn"
                        onClick={() => setEditingInvoice(inv)}
                        title="Edit this invoice"
                      >
                        <span>✏️</span>
                        <span>Edit</span>
                      </button>
                    )}

                    {isAdmin && isDraft && !isArchived && (
                      <button
                        type="button"
                        className="inv-action-btn publish-btn"
                        onClick={() => handlePublishClick(inv.id)}
                        title="Publish this invoice to the client portal"
                      >
                        <span>🚀</span>
                        <span>Publish</span>
                      </button>
                    )}

                    {isAdmin && !isPaid && !isArchived && (
                      <button
                        type="button"
                        className="inv-action-btn paid-btn"
                        onClick={() => handlePaidClick(inv.id)}
                        title="Mark invoice as paid"
                      >
                        <span>✓</span>
                        <span>Paid</span>
                      </button>
                    )}

                    {isAdmin && (
                      isArchived ? (
                        <button
                          type="button"
                          className="inv-action-btn restore-btn"
                          style={{ backgroundColor: '#EEF2FF', color: '#4F46E5', borderColor: '#C7D2FE', fontWeight: 600 }}
                          onClick={() => handleRestoreClick(inv.id)}
                          title="Restore invoice back to active drafts"
                        >
                          <span>♻️</span>
                          <span>Restore</span>
                        </button>
                      ) : (
                        <button
                          type="button"
                          className="inv-action-btn delete-btn"
                          onClick={() => handleDeleteClick(inv.id)}
                          title="Archive invoice (safely preserved in database)"
                        >
                          🗑️
                        </button>
                      )
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Modals */}
      <CreateInvoiceModal
        isOpen={isCreateOpen}
        onClose={() => setIsCreateOpen(false)}
        onSubmit={handleCreateSubmit}
        clients={clients}
        projects={projects}
      />

      {selectedInvoice && (
        <InvoiceDetailModal
          invoice={selectedInvoice}
          clients={clients}
          onClose={() => setSelectedInvoice(null)}
          onPublish={handlePublishClick}
          onMarkPaid={handlePaidClick}
          onDelete={handleDeleteClick}
          onRestore={handleRestoreClick}
          onEdit={(inv) => setEditingInvoice(inv)}
          isAdmin={isAdmin}
        />
      )}

      {/* Edit Invoice Modal */}
      {editingInvoice && (
        <CreateInvoiceModal
          isOpen={Boolean(editingInvoice)}
          initialInvoice={editingInvoice}
          onClose={() => setEditingInvoice(null)}
          onSubmit={handleEditSubmit}
          clients={clients}
          projects={projects}
        />
      )}

      {/* Hidden Offscreen Container for Direct PDF Exports */}
      {exportingInv && (
        <div style={{ position: 'fixed', left: '-9999px', top: '-9999px', width: '800px', pointerEvents: 'none', zIndex: -100 }}>
          <InvoicePrintSheet ref={offscreenExportRef} invoice={exportingInv} clients={clients} />
        </div>
      )}
    </div>
  );
}
