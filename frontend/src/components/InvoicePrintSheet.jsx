import React, { forwardRef } from 'react';
import './InvoicesView.css';

const InvoicePrintSheet = forwardRef(function InvoicePrintSheet({ invoice, clients = [] }, ref) {
  if (!invoice) return null;

  const rawCurrency = invoice.currency || 'PKR';
  const currencySymbol = rawCurrency === 'PKR' ? 'Rs.' : rawCurrency;

  const subtotal = Number(invoice.subtotal || invoice.amount || 0);
  const tax = Number(invoice.tax || 0);
  const discount = Number(invoice.discount || 0);
  const total = Number(invoice.amount || (subtotal + tax - discount));

  // Resolve client info: prioritize invoice fields > matched clients > Awais as default
  const matchedClient = (clients || []).find(c => c.id === (invoice.client_id || invoice.clientId)) || {};
  const clientName = invoice.client_name || matchedClient.name || (invoice.client_id === 'client-afshal' ? 'Afshal' : 'Awais');
  const clientCompany = invoice.client_company || matchedClient.company || (clientName === 'Afshal' ? 'Afshal Brand' : 'Awais Agency');
  const clientEmail = invoice.client_email || matchedClient.email || (clientName === 'Afshal' ? 'afshal@remotale.com' : 'client@company.com');
  const clientPhone = invoice.client_phone || '+92 300 1234567';

  // Extract project titles
  const projectTitles = Array.isArray(invoice.project_titles) && invoice.project_titles.length > 0
    ? invoice.project_titles
    : (Array.isArray(invoice.items) && invoice.items.some(it => it.project_title)
      ? Array.from(new Set(invoice.items.map(it => it.project_title).filter(Boolean)))
      : (invoice.project_title ? invoice.project_title.split(',').map(s => s.trim()).filter(Boolean) : []));

  // Payment details lines matching reference theme
  const parsePaymentLines = () => {
    const raw = invoice.payment_details || '';
    if (raw && (raw.includes('JazzCash') || raw.includes('Meezan') || raw.includes('Bank:'))) {
      const lines = raw.split('\n').map(l => l.trim()).filter(Boolean);
      return lines.slice(0, 3);
    }
    return [
      'JazzCash: 03293003719',
      'Meezan Bank A/C: 00300115381875'
    ];
  };

  const paymentLines = parsePaymentLines();
  const formatAmt = (val) => `${currencySymbol} ${Number(val || 0).toLocaleString()}`;

  // Fallback demo items if invoice items are empty
  const invoiceItems = Array.isArray(invoice.items) && invoice.items.length > 0
    ? invoice.items
    : [
        { description: 'Web Development & Store Setup Milestone', qty: 1, rate: total, amount: total }
      ];

  return (
    <div className="inv-terracotta-sheet" ref={ref}>
      {/* Top Banner: Burnt Sienna / Terracotta Curved Header */}
      <div className="inv-tc-header">
        <div className="inv-tc-header-left">
          <h1 className="inv-tc-title">Invoice</h1>
          <p className="inv-tc-subtitle">Web Development & E-Commerce Services</p>
        </div>
        <div className="inv-tc-header-right">
          <div className="inv-tc-pill-badge">Ameen</div>
        </div>
      </div>

      {/* Meta Info Box: Soft Cream / Warm Beige Container */}
      <div className="inv-tc-meta-box">
        <div className="inv-tc-meta-left">
          <div className="inv-tc-label">INVOICE TO</div>
          <div className="inv-tc-client-name">{clientName}</div>
          <div className="inv-tc-client-designation">{clientCompany || 'Designation / Business'}</div>
          <div className="inv-tc-contact-row">
            <span className="inv-tc-contact-item">
              <span className="inv-tc-icon-phone">📞</span>
              <span>{clientPhone}</span>
            </span>
            <span className="inv-tc-contact-item">
              <span className="inv-tc-icon-email">✉</span>
              <span>{clientEmail}</span>
            </span>
          </div>
          {projectTitles.length > 0 && (
            <div className="inv-tc-projects-pills">
              {projectTitles.map((t, idx) => (
                <span key={idx} className="inv-tc-project-pill">📁 {t}</span>
              ))}
            </div>
          )}
        </div>

        <div className="inv-tc-meta-right">
          <div className="inv-tc-label right">INVOICE NO.</div>
          <div className="inv-tc-invoice-no">{invoice.invoice_number || 'INV-2026-08'}</div>
          <div className="inv-tc-date-row">
            <span className="inv-tc-date-lbl">DATE:</span>
            <span className="inv-tc-date-val">{invoice.issue_date || '2026-09-03'}</span>
          </div>
          <div className="inv-tc-amount-pill">
            {formatAmt(total)}
          </div>
        </div>
      </div>

      {/* Itemized Table */}
      <div className="inv-tc-table-wrap">
        <table className="inv-tc-table">
          <thead>
            <tr>
              <th className="th-desc">ITEM DESCRIPTION</th>
              <th className="th-price">UNIT PRICE</th>
              <th className="th-qty">QUANTITY</th>
              <th className="th-amount">AMOUNT</th>
            </tr>
          </thead>
          <tbody>
            {invoiceItems.map((item, idx) => {
              const unitPrice = Number(item.rate || (item.qty ? item.amount / item.qty : item.amount) || 0);
              const qty = Number(item.qty || 1);
              const itemAmt = Number(item.amount || (qty * unitPrice));
              return (
                <tr key={idx}>
                  <td className="td-desc">
                    <div className="inv-tc-item-name">{item.description || 'Deliverable Item'}</div>
                    {item.project_title && (
                      <div className="inv-tc-item-proj">📁 {item.project_title}</div>
                    )}
                  </td>
                  <td className="td-price">{formatAmt(unitPrice)}</td>
                  <td className="td-qty">{qty}</td>
                  <td className="td-amount">{formatAmt(itemAmt)}</td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {/* Sub Total Summary Row */}
      <div className="inv-tc-subtotal-row">
        <span className="inv-tc-subtotal-text">Sub Total : {formatAmt(subtotal || total)}</span>
      </div>

      {/* Two-Column Bottom Grid: Payment Details & Personal Details */}
      <div className="inv-tc-bottom-grid">
        {/* Left: Payment Details & QR Code */}
        <div className="inv-tc-payment-col">
          <div className="inv-tc-bottom-heading">PAYMENT DETAILS</div>
          <div className="inv-tc-payment-lines">
            {paymentLines.map((line, idx) => (
              <div key={idx} className="inv-tc-payment-line">{line}</div>
            ))}
          </div>

          {/* QR Code Container */}
          <div className="inv-tc-qr-card">
            <svg width="68" height="68" viewBox="0 0 68 68" fill="none">
              {/* Top-Left Finder */}
              <rect x="2" y="2" width="20" height="20" rx="3.5" fill="#272422" />
              <rect x="6" y="6" width="12" height="12" rx="2" fill="#FFFFFF" />
              <rect x="9" y="9" width="6" height="6" rx="1" fill="#272422" />

              {/* Top-Right Finder */}
              <rect x="46" y="2" width="20" height="20" rx="3.5" fill="#272422" />
              <rect x="50" y="6" width="12" height="12" rx="2" fill="#FFFFFF" />
              <rect x="53" y="9" width="6" height="6" rx="1" fill="#272422" />

              {/* Bottom-Left Finder */}
              <rect x="2" y="46" width="20" height="20" rx="3.5" fill="#272422" />
              <rect x="6" y="50" width="12" height="12" rx="2" fill="#FFFFFF" />
              <rect x="9" y="53" width="6" height="6" rx="1" fill="#272422" />

              {/* Matrix Micro Patterns */}
              <rect x="26" y="4" width="4" height="4" rx="0.8" fill="#272422" />
              <rect x="34" y="4" width="4" height="4" rx="0.8" fill="#272422" />
              <rect x="26" y="12" width="4" height="4" rx="0.8" fill="#272422" />
              <rect x="38" y="12" width="4" height="4" rx="0.8" fill="#272422" />
              <rect x="30" y="20" width="4" height="4" rx="0.8" fill="#272422" />
              <rect x="4" y="26" width="4" height="4" rx="0.8" fill="#272422" />
              <rect x="12" y="26" width="4" height="4" rx="0.8" fill="#272422" />
              <rect x="20" y="26" width="4" height="4" rx="0.8" fill="#272422" />
              <rect x="28" y="28" width="5" height="5" rx="0.8" fill="#272422" />
              <rect x="36" y="26" width="4" height="4" rx="0.8" fill="#272422" />
              <rect x="44" y="28" width="4" height="4" rx="0.8" fill="#272422" />
              <rect x="52" y="26" width="4" height="4" rx="0.8" fill="#272422" />
              <rect x="60" y="28" width="4" height="4" rx="0.8" fill="#272422" />
              <rect x="28" y="36" width="4" height="4" rx="0.8" fill="#272422" />
              <rect x="36" y="36" width="4" height="4" rx="0.8" fill="#272422" />
              <rect x="48" y="36" width="4" height="4" rx="0.8" fill="#272422" />
              <rect x="56" y="38" width="4" height="4" rx="0.8" fill="#272422" />
              <rect x="26" y="46" width="5" height="5" rx="0.8" fill="#272422" />
              <rect x="34" y="48" width="4" height="4" rx="0.8" fill="#272422" />
              <rect x="44" y="46" width="4" height="4" rx="0.8" fill="#272422" />
              <rect x="52" y="46" width="5" height="5" rx="0.8" fill="#272422" />
              <rect x="60" y="52" width="4" height="4" rx="0.8" fill="#272422" />
              <rect x="28" y="56" width="4" height="4" rx="0.8" fill="#272422" />
              <rect x="38" y="58" width="4" height="4" rx="0.8" fill="#272422" />
              <rect x="48" y="56" width="5" height="5" rx="0.8" fill="#272422" />
              <rect x="58" y="60" width="4" height="4" rx="0.8" fill="#272422" />
            </svg>
          </div>
        </div>

        {/* Right: Personal / Professional Signee */}
        <div className="inv-tc-author-col">
          <div className="inv-tc-author-name">Ameen</div>
          <div className="inv-tc-author-role">Senior Product Designer & Web Developer</div>
          <div className="inv-tc-author-contact">
            <span className="inv-tc-contact-item">
              <span className="inv-tc-icon-phone">📞</span>
              <span>03323531518</span>
            </span>
            <span className="inv-tc-contact-item">
              <span className="inv-tc-icon-email">✉</span>
              <span>ameen.data.2011@gmail.com</span>
            </span>
            <span className="inv-tc-contact-item">
              <span className="inv-tc-icon-web">🌐</span>
              <span>@jameen</span>
            </span>
          </div>
        </div>
      </div>

      {/* Terms & Conditions */}
      <div className="inv-tc-terms-section">
        <div className="inv-tc-terms-title">TERMS & CONDITIONS</div>
        <ol className="inv-tc-terms-list">
          <li>Full payment is due within 7 days of receiving the invoice.</li>
          <li>Project includes 2 rounds of revisions.</li>
          <li>Thank you for your business!</li>
        </ol>
      </div>

      {/* Bottom Accent Bar */}
      <div className="inv-tc-bottom-stripe" />
    </div>
  );
});

export default InvoicePrintSheet;
