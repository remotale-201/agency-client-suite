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
  const [selectedProjectId, setSelectedProjectId] = useState('');
  const [currency, setCurrency] = useState('$');
  const [invoiceNumber, setInvoiceNumber] = useState('');
  const [issueDate, setIssueDate] = useState('');
  const [dueDate, setDueDate] = useState('');
  const [notes, setNotes] = useState('');
  const [paymentDetails, setPaymentDetails] = useState(
    'Bank: Meezan Bank / HBL\nAccount Title: Abdullah\nAccount No: 0102-0103948291\nWise / USDT (TRC-20): TXYZ981724918237918'
  );
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Line items state
  const [items, setItems] = useState([
    { description: 'Project Development & Milestone Deliverable', qty: 1, rate: 350, amount: 350 }
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

  // When selected project changes, prefill line item description
  const handleProjectChange = (projId) => {
    setSelectedProjectId(projId);
    const proj = projects.find(p => p.id === projId);
    if (proj) {
      setItems([
        {
          description: `${proj.title} - Scope of Work & Milestones`,
          qty: 1,
          rate: items[0]?.rate || 350,
          amount: items[0]?.rate || 350
        }
      ]);
    }
  };

  // Add line item
  const handleAddItem = () => {
    setItems([
      ...items,
      { description: 'Additional Project Service', qty: 1, rate: 100, amount: 100 }
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
    const selectedProj = projects.find(p => p.id === selectedProjectId);

    const invoicePayload = {
      client_id: selectedClientId,
      client_name: selectedClient?.name || 'Client',
      client_company: selectedClient?.company || 'Agency Client',
      client_email: selectedClient?.email || '',
      project_id: selectedProjectId || null,
      project_title: selectedProj?.title || (items[0]?.description || 'Project Invoice'),
      title: selectedProj ? `${selectedProj.title} Invoice` : (items[0]?.description || 'Client Invoice'),
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
              Create an itemized project bill with custom pricing and instant client publication.
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
                  setSelectedProjectId('');
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

            {/* 2. Project Select (Filtered by client) */}
            <div className="inv-form-group">
              <label className="inv-form-label">Active Project <span className="req">*</span></label>
              <select
                className="inv-form-select"
                value={selectedProjectId}
                onChange={(e) => handleProjectChange(e.target.value)}
              >
                <option value="">-- Select Active Project --</option>
                {clientProjects.map(p => (
                  <option key={p.id} value={p.id}>
                    {p.title} ({p.status})
                  </option>
                ))}
              </select>
            </div>

            {/* 3. Currency */}
            <div className="inv-form-group">
              <label className="inv-form-label">Currency</label>
              <select
                className="inv-form-select"
                value={currency}
                onChange={(e) => setCurrency(e.target.value)}
              >
                <option value="$">USD ($)</option>
                <option value="PKR">PKR (Rs)</option>
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

          {/* Line Items & Project Price Section */}
          <div className="inv-items-section">
            <div className="inv-items-header">
              <h3 className="inv-section-title">Invoice Line Items & Pricing</h3>
              <button
                type="button"
                className="inv-btn-add-item"
                onClick={handleAddItem}
              >
                + Add Service / Milestone
              </button>
            </div>

            <div className="inv-items-table-container">
              <table className="inv-editor-table">
                <thead>
                  <tr>
                    <th>Milestone / Service Description</th>
                    <th style={{ width: '80px', textAlign: 'center' }}>Qty</th>
                    <th style={{ width: '130px', textAlign: 'right' }}>Price / Rate ({currency})</th>
                    <th style={{ width: '130px', textAlign: 'right' }}>Total</th>
                    <th style={{ width: '50px' }}></th>
                  </tr>
                </thead>
                <tbody>
                  {items.map((item, idx) => (
                    <tr key={idx}>
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
                          step="10"
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
