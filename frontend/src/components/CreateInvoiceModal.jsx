import React, { useState, useEffect } from 'react';
import './InvoicesView.css';

export default function CreateInvoiceModal({
  isOpen,
  onClose,
  onSubmit,
  clients = [],
  projects = []
}) {
  const [selectedClientId, setSelectedClientId] = useState('');
  const [selectedProjectIds, setSelectedProjectIds] = useState([]);
  const [invoiceTitle, setInvoiceTitle] = useState('');
  const [currency, setCurrency] = useState('PKR');
  const [invoiceNumber, setInvoiceNumber] = useState('');
  const [issueDate, setIssueDate] = useState('');
  const [dueDate, setDueDate] = useState('');
  const [notes, setNotes] = useState('');
  const [paymentDetails, setPaymentDetails] = useState(
    'Bank: Meezan Bank / HBL\nAccount Title: Abdullah\nAccount No: 0102-0103948291\nEasyPaisa / JazzCash: 0300-1234567\nWise / USDT (TRC-20): TXYZ981724918237918'
  );
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Line items state (each item can be assigned to a specific project)
  const [items, setItems] = useState([
    {
      description: 'Project Development & Milestone Deliverable',
      project_id: '',
      project_title: '',
      qty: 1,
      rate: 85000,
      amount: 85000
    }
  ]);
  const [discount, setDiscount] = useState(0);
  const [tax, setTax] = useState(0);

  // Initialize dates and invoice number
  useEffect(() => {
    if (isOpen) {
      const now = new Date();
      const issueStr = `${String(now.getDate()).padStart(2, '0')}/${String(now.getMonth() + 1).padStart(2, '0')}/${now.getFullYear()}`;
      
      const due = new Date();
      due.setDate(due.getDate() + 10);
      const dueStr = `${String(due.getDate()).padStart(2, '0')}/${String(due.getMonth() + 1).padStart(2, '0')}/${due.getFullYear()}`;
      
      setIssueDate(issueStr);
      setDueDate(dueStr);
      setInvoiceNumber(`INV-${now.getFullYear()}-${Math.floor(100 + Math.random() * 900)}`);
      
      // Default to first client if available
      if (clients.length > 0 && !selectedClientId) {
        setSelectedClientId(clients[0].id);
      }
    }
  }, [isOpen, clients]);

  // Filter projects by selected client
  const clientProjects = projects.filter(p => {
    const pCId = p.client_id || p.clientId;
    return pCId === selectedClientId;
  });

  // When client changes, auto-select first project if available
  useEffect(() => {
    if (clientProjects.length > 0 && selectedProjectIds.length === 0) {
      const firstProj = clientProjects[0];
      setSelectedProjectIds([firstProj.id]);
      setInvoiceTitle(`${firstProj.title} Invoice`);
      setItems([
        {
          description: `${firstProj.title} - Scope of Work & Milestones`,
          project_id: firstProj.id,
          project_title: firstProj.title,
          qty: 1,
          rate: 85000,
          amount: 85000
        }
      ]);
    }
  }, [selectedClientId]);

  // Toggle a project selection
  const handleToggleProject = (projId) => {
    const proj = clientProjects.find(p => p.id === projId);
    if (!proj) return;

    if (selectedProjectIds.includes(projId)) {
      const updated = selectedProjectIds.filter(id => id !== projId);
      setSelectedProjectIds(updated);
      updateTitleFromProjects(updated);
    } else {
      const updated = [...selectedProjectIds, projId];
      setSelectedProjectIds(updated);
      updateTitleFromProjects(updated);

      // Also add a line item for this project if not already present
      const hasItem = items.some(it => it.project_id === projId);
      if (!hasItem) {
        setItems(prev => [
          ...prev,
          {
            description: `${proj.title} - Deliverable Milestone`,
            project_id: proj.id,
            project_title: proj.title,
            qty: 1,
            rate: 65000,
            amount: 65000
          }
        ]);
      }
    }
  };

  // Select all client projects
  const handleSelectAllProjects = () => {
    const allIds = clientProjects.map(p => p.id);
    setSelectedProjectIds(allIds);
    updateTitleFromProjects(allIds);
  };

  // Clear all selected projects
  const handleClearProjects = () => {
    setSelectedProjectIds([]);
    setInvoiceTitle('Client Project Invoice');
  };

  // Update title helper
  const updateTitleFromProjects = (projIds) => {
    const projs = clientProjects.filter(p => projIds.includes(p.id));
    if (projs.length === 0) {
      setInvoiceTitle('Client Milestone Invoice');
    } else if (projs.length === 1) {
      setInvoiceTitle(`${projs[0].title} Invoice`);
    } else if (projs.length === 2) {
      setInvoiceTitle(`${projs[0].title} & ${projs[1].title} Invoice`);
    } else {
      setInvoiceTitle(`Combined Multi-Project Invoice (${projs.length} Projects)`);
    }
  };

  // Add line item
  const handleAddItem = (defaultProjId = '') => {
    const proj = clientProjects.find(p => p.id === defaultProjId);
    setItems([
      ...items,
      {
        description: proj ? `${proj.title} - Milestone Deliverable` : 'Additional Project Service',
        project_id: proj ? proj.id : '',
        project_title: proj ? proj.title : '',
        qty: 1,
        rate: 25000,
        amount: 25000
      }
    ]);
  };

  // Remove line item
  const handleRemoveItem = (index) => {
    if (items.length <= 1) return;
    setItems(items.filter((_, i) => i !== index));
  };

  // Update item field
  const handleItemChange = (index, field, value) => {
    const updated = [...items];
    const item = { ...updated[index] };

    if (field === 'description') {
      item.description = value;
    } else if (field === 'qty') {
      item.qty = Math.max(1, Number(value) || 1);
      item.amount = item.qty * item.rate;
    } else if (field === 'rate') {
      item.rate = Math.max(0, Number(value) || 0);
      item.amount = item.qty * item.rate;
    } else if (field === 'project_id') {
      item.project_id = value;
      const proj = clientProjects.find(p => p.id === value);
      item.project_title = proj ? proj.title : '';
      if (value && !selectedProjectIds.includes(value)) {
        setSelectedProjectIds(prev => [...prev, value]);
      }
    }

    updated[index] = item;
    setItems(updated);
  };

  // Calculations
  const subtotal = items.reduce((acc, it) => acc + (Number(it.amount) || 0), 0);
  const numDiscount = Number(discount) || 0;
  const numTax = Number(tax) || 0;
  const grandTotal = Math.max(0, subtotal + numTax - numDiscount);

  // Submit invoice handler (Draft or Publish)
  const handleSave = async (publishImmediately = false) => {
    if (!selectedClientId) {
      alert('Please select a client for this invoice.');
      return;
    }

    const selectedClient = clients.find(c => c.id === selectedClientId);

    // Collect all project IDs referenced in selection OR in line items
    const combinedProjectIds = Array.from(new Set([
      ...selectedProjectIds,
      ...items.map(it => it.project_id).filter(Boolean)
    ]));

    const includedProjects = clientProjects.filter(p => combinedProjectIds.includes(p.id));
    const projectTitles = includedProjects.map(p => p.title);
    const allTitles = projectTitles.length > 0 
      ? projectTitles 
      : items.map(it => it.project_title).filter(Boolean);

    const clientName = selectedClient?.name || (selectedClientId === 'client-afshal' ? 'Afshal' : 'Awais');
    const clientCompany = selectedClient?.company || (clientName === 'Afshal' ? 'Afshal Brand' : 'Awais Agency');
    const clientEmail = selectedClient?.email || (clientName === 'Afshal' ? 'afshal@remotale.com' : 'awais@remotale.com');

    const invoicePayload = {
      client_id: selectedClientId,
      client_name: clientName,
      client_company: clientCompany,
      client_email: clientEmail,
      project_ids: combinedProjectIds,
      project_titles: allTitles,
      project_id: combinedProjectIds[0] || null,
      project_title: allTitles.join(', ') || (items[0]?.description || 'Project Invoice'),
      title: invoiceTitle.trim() || (allTitles.length > 0 ? `${allTitles.join(' & ')} Invoice` : 'Client Invoice'),
      invoice_number: invoiceNumber || `INV-${Date.now()}`,
      currency,
      subtotal,
      tax: numTax,
      discount: numDiscount,
      amount: grandTotal,
      status: publishImmediately ? 'published' : 'draft',
      published: publishImmediately,
      issue_date: issueDate,
      due_date: dueDate,
      notes: notes || 'Thank you for your business. We look forward to reaching the next milestone.',
      payment_details: paymentDetails,
      items: items.map(it => ({
        description: it.description || 'Service Deliverable',
        project_id: it.project_id || null,
        project_title: it.project_title || '',
        qty: Number(it.qty) || 1,
        rate: Number(it.rate) || 0,
        amount: Number(it.amount) || 0
      }))
    };

    setIsSubmitting(true);
    try {
      await onSubmit(invoicePayload, publishImmediately);
      onClose();
    } catch (err) {
      alert(err.message || 'Failed to create invoice');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="inv-modal-overlay" onClick={onClose}>
      <div className="inv-create-modal" onClick={(e) => e.stopPropagation()}>
        {/* Header */}
        <div className="inv-create-header">
          <div>
            <h2 className="inv-create-title">Generate New Invoice</h2>
            <p className="inv-create-sub">
              Create an itemized bill for one or multiple projects with custom milestone pricing and instant client publication.
            </p>
          </div>
          <button type="button" className="inv-btn-close" onClick={onClose}>✕</button>
        </div>

        <div className="inv-create-body">
          {/* Top Form Grid */}
          <div className="inv-form-grid">
            {/* 1. Client Select */}
            <div className="inv-form-group">
              <label className="inv-form-label">Client <span className="req">*</span></label>
              <select
                className="inv-form-select"
                value={selectedClientId}
                onChange={(e) => {
                  setSelectedClientId(e.target.value);
                  setSelectedProjectIds([]);
                }}
              >
                <option value="">-- Select Client --</option>
                {clients.map(c => (
                  <option key={c.id} value={c.id}>
                    {c.name} {c.company ? `(${c.company})` : ''}
                  </option>
                ))}
              </select>
            </div>

            {/* 2. Invoice Title */}
            <div className="inv-form-group">
              <label className="inv-form-label">Invoice Title</label>
              <input
                type="text"
                className="inv-form-input"
                value={invoiceTitle}
                onChange={(e) => setInvoiceTitle(e.target.value)}
                placeholder="e.g. Phase 1 Development & Store Design"
              />
            </div>

            {/* 3. Currency */}
            <div className="inv-form-group">
              <label className="inv-form-label">Currency</label>
              <select
                className="inv-form-select"
                value={currency}
                onChange={(e) => setCurrency(e.target.value)}
              >
                <option value="PKR">PKR (Rs.)</option>
                <option value="$">USD ($)</option>
                <option value="EUR">EUR (€)</option>
                <option value="GBP">GBP (£)</option>
              </select>
            </div>

            {/* 4. Invoice Number */}
            <div className="inv-form-group">
              <label className="inv-form-label">Invoice Number</label>
              <input
                type="text"
                className="inv-form-input"
                value={invoiceNumber}
                onChange={(e) => setInvoiceNumber(e.target.value)}
                placeholder="INV-2026-001"
              />
            </div>

            {/* 5. Issue Date */}
            <div className="inv-form-group">
              <label className="inv-form-label">Issue Date</label>
              <input
                type="text"
                className="inv-form-input"
                value={issueDate}
                onChange={(e) => setIssueDate(e.target.value)}
                placeholder="15/10/2026"
              />
            </div>

            {/* 6. Due Date */}
            <div className="inv-form-group">
              <label className="inv-form-label">Due Date</label>
              <input
                type="text"
                className="inv-form-input"
                value={dueDate}
                onChange={(e) => setDueDate(e.target.value)}
                placeholder="25/10/2026"
              />
            </div>
          </div>

          {/* Multi-Project Inclusion Block */}
          <div className="inv-multi-projects-block">
            <div className="inv-multi-projects-header">
              <div className="inv-multi-projects-title-box">
                <span className="inv-multi-projects-label">Projects to Bill:</span>
                <span className="inv-multi-projects-count-pill">
                  {selectedProjectIds.length} of {clientProjects.length} Selected
                </span>
              </div>
              {clientProjects.length > 1 && (
                <div className="inv-multi-projects-actions">
                  <button
                    type="button"
                    className="inv-link-action-btn"
                    onClick={handleSelectAllProjects}
                  >
                    Select All
                  </button>
                  <span className="inv-action-dot">•</span>
                  <button
                    type="button"
                    className="inv-link-action-btn"
                    onClick={handleClearProjects}
                  >
                    Clear All
                  </button>
                </div>
              )}
            </div>

            {clientProjects.length === 0 ? (
              <div className="inv-projects-empty-hint">
                No active projects found under this client. You can still add custom services below.
              </div>
            ) : (
              <div className="inv-projects-chips-wrap">
                {clientProjects.map(p => {
                  const isSelected = selectedProjectIds.includes(p.id);
                  return (
                    <button
                      key={p.id}
                      type="button"
                      className={`inv-project-chip ${isSelected ? 'active' : ''}`}
                      onClick={() => handleToggleProject(p.id)}
                      title={`Click to ${isSelected ? 'remove' : 'include'} ${p.title}`}
                    >
                      <span className="inv-chip-indicator">{isSelected ? '✓' : '+'}</span>
                      <span className="inv-chip-text">{p.title}</span>
                      <span className="inv-chip-badge">{p.status || 'Active'}</span>
                    </button>
                  );
                })}
              </div>
            )}
          </div>

          {/* Line Items & Project Price Section */}
          <div className="inv-items-section">
            <div className="inv-items-header">
              <div>
                <h3 className="inv-section-title">Invoice Line Items & Pricing</h3>
                <p className="inv-section-sub">
                  Assign each milestone to a project or general service, set quantity, and adjust rupee rates.
                </p>
              </div>

              <div className="inv-items-header-actions">
                <button
                  type="button"
                  className="inv-btn-add-item"
                  onClick={() => handleAddItem()}
                >
                  + Add Line Item
                </button>
              </div>
            </div>

            {/* Quick Add Buttons for Selected Projects */}
            {selectedProjectIds.length > 0 && (
              <div className="inv-quick-add-projects-bar">
                <span className="inv-quick-add-lbl">Quick Add Milestone for:</span>
                <div className="inv-quick-add-btns">
                  {clientProjects
                    .filter(p => selectedProjectIds.includes(p.id))
                    .map(p => (
                      <button
                        key={p.id}
                        type="button"
                        className="inv-quick-proj-add-btn"
                        onClick={() => handleAddItem(p.id)}
                      >
                        + {p.title}
                      </button>
                    ))}
                </div>
              </div>
            )}

            <div className="inv-items-table-container">
              <table className="inv-editor-table">
                <thead>
                  <tr>
                    <th style={{ width: '220px' }}>Project</th>
                    <th>Milestone / Service Description</th>
                    <th style={{ width: '75px', textAlign: 'center' }}>Qty</th>
                    <th style={{ width: '135px', textAlign: 'right' }}>Price ({currency})</th>
                    <th style={{ width: '135px', textAlign: 'right' }}>Total</th>
                    <th style={{ width: '45px' }}></th>
                  </tr>
                </thead>
                <tbody>
                  {items.map((item, idx) => (
                    <tr key={idx}>
                      <td>
                        <select
                          className="inv-table-select-proj"
                          value={item.project_id || ''}
                          onChange={(e) => handleItemChange(idx, 'project_id', e.target.value)}
                        >
                          <option value="">-- General Service --</option>
                          {clientProjects.map(cp => (
                            <option key={cp.id} value={cp.id}>
                              📁 {cp.title}
                            </option>
                          ))}
                        </select>
                      </td>
                      <td>
                        <input
                          type="text"
                          className="inv-table-input"
                          value={item.description}
                          onChange={(e) => handleItemChange(idx, 'description', e.target.value)}
                          placeholder="e.g. White Label Store Development, Product Page Design..."
                        />
                      </td>
                      <td>
                        <input
                          type="number"
                          className="inv-table-input"
                          style={{ textAlign: 'center' }}
                          value={item.qty}
                          min="1"
                          onChange={(e) => handleItemChange(idx, 'qty', e.target.value)}
                        />
                      </td>
                      <td>
                        <input
                          type="number"
                          className="inv-table-input"
                          style={{ textAlign: 'right', fontWeight: 600 }}
                          value={item.rate}
                          min="0"
                          step="1000"
                          onChange={(e) => handleItemChange(idx, 'rate', e.target.value)}
                        />
                      </td>
                      <td style={{ textAlign: 'right', fontWeight: 700, color: '#0f172a' }}>
                        {currency} {Number(item.amount || 0).toLocaleString()}
                      </td>
                      <td style={{ textAlign: 'center' }}>
                        {items.length > 1 && (
                          <button
                            type="button"
                            className="inv-btn-delete-row"
                            onClick={() => handleRemoveItem(idx)}
                            title="Remove row"
                          >
                            ✕
                          </button>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Calculations Row */}
            <div className="inv-calc-row">
              <div className="inv-calc-notes">
                <div className="inv-form-group">
                  <label className="inv-form-label">Payment Instructions (Shown on invoice)</label>
                  <textarea
                    className="inv-form-textarea"
                    rows={3}
                    value={paymentDetails}
                    onChange={(e) => setPaymentDetails(e.target.value)}
                  />
                </div>
                <div className="inv-form-group" style={{ marginTop: '10px' }}>
                  <label className="inv-form-label">Notes to Client</label>
                  <input
                    type="text"
                    className="inv-form-input"
                    value={notes}
                    onChange={(e) => setNotes(e.target.value)}
                    placeholder="Thank you for partnering with Remotale Agency."
                  />
                </div>
              </div>

              <div className="inv-calc-summary">
                <div className="inv-calc-line">
                  <span>Subtotal:</span>
                  <span><strong>{currency} {subtotal.toLocaleString()}</strong></span>
                </div>
                <div className="inv-calc-line">
                  <span>Discount ({currency}):</span>
                  <input
                    type="number"
                    min="0"
                    className="inv-mini-input"
                    value={discount}
                    onChange={(e) => setDiscount(e.target.value)}
                  />
                </div>
                <div className="inv-calc-line">
                  <span>Tax ({currency}):</span>
                  <input
                    type="number"
                    min="0"
                    className="inv-mini-input"
                    value={tax}
                    onChange={(e) => setTax(e.target.value)}
                  />
                </div>
                <div className="inv-calc-grand-box">
                  <span>Total Amount:</span>
                  <span className="inv-calc-grand-val">{currency} {grandTotal.toLocaleString()}</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Modal Footer Actions */}
        <div className="inv-create-footer">
          <button
            type="button"
            className="inv-btn-cancel"
            onClick={onClose}
            disabled={isSubmitting}
          >
            Cancel
          </button>

          <div style={{ display: 'flex', gap: '10px' }}>
            <button
              type="button"
              className="inv-btn-draft"
              onClick={() => handleSave(false)}
              disabled={isSubmitting}
            >
              Save as Draft
            </button>

            <button
              type="button"
              className="inv-btn-submit-publish"
              onClick={() => handleSave(true)}
              disabled={isSubmitting}
            >
              <span>🚀</span>
              <span>{isSubmitting ? 'Publishing...' : 'Publish to Client Now'}</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
