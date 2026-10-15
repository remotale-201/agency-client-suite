import React, { useState } from 'react';

// Section Configurations
const SECTION_METADATA = {
  tasks: {
    badge: 'Under Active Development',
    title: 'Tasks & Milestone Tracker',
    subtitle: 'A high-powered sprint board, automated milestone manager, and to-do timeline are arriving soon.',
    icon: (
      <svg width="38" height="38" viewBox="0 0 24 24" fill="none" stroke="#4F46E5" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M9 11l3 3L22 4" />
        <path d="M21 12v7a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11" />
      </svg>
    ),
    features: [
      {
        icon: '📋',
        title: 'Kanban & Sprint Boards',
        desc: 'Drag-and-drop workflow columns for Wireframing, Production, Client Review, and Final QA.'
      },
      {
        icon: '⏱️',
        title: 'Deadline & Milestone Alerts',
        desc: 'Automated urgency reminders sent before deliverables are due so projects always stay on track.'
      },
      {
        icon: '🤝',
        title: 'Sub-Task Checklists',
        desc: 'Break project milestones into granular check items with real-time progress percentage recalculations.'
      }
    ]
  },
  messages: {
    badge: 'Preview Mode',
    title: 'Client Messaging & Collaboration Hub',
    subtitle: 'Direct real-time conversations, asset drops, and audio notes synced directly between Admin and Client portals.',
    icon: (
      <svg width="38" height="38" viewBox="0 0 24 24" fill="none" stroke="#0284C7" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
      </svg>
    ),
    features: [
      {
        icon: '💬',
        title: 'Real-Time Instant Chat',
        desc: 'Blazing fast instant messaging with typing indicators, delivery timestamps, and read receipts.'
      },
      {
        icon: '📎',
        title: 'In-Thread File Dropping',
        desc: 'Attach Figma boards, zip archives, and design assets straight inside project discussion threads.'
      },
      {
        icon: '🔔',
        title: 'Instant Push & Email Alerts',
        desc: 'Get notified the moment a client drops feedback or an admin signs off on an urgent revision.'
      }
    ]
  },
  files: {
    badge: 'Arriving Soon',
    title: 'Cloud Files & Digital Asset Vault',
    subtitle: 'Secure cloud storage for all project files, high-resolution media, Figma designs, and brand kits.',
    icon: (
      <svg width="38" height="38" viewBox="0 0 24 24" fill="none" stroke="#9333EA" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M14.5 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7.5L14.5 2z" />
        <polyline points="14 2 14 8 20 8" />
      </svg>
    ),
    features: [
      {
        icon: '☁️',
        title: 'High-Speed Cloud Storage',
        desc: 'CDN-accelerated file vault supporting ZIP, RAR, PDF, PNG, SVG, and high-res raw assets.'
      },
      {
        icon: '🔍',
        title: 'In-Browser Previews',
        desc: 'Preview graphic creatives, brand kits, and design deliverables without downloading large files.'
      },
      {
        icon: '🔒',
        title: 'Version History & Access Control',
        desc: 'Keep track of all file revisions with rollback safety and client download permission toggles.'
      }
    ]
  },
  billing: {
    badge: 'Next Release',
    title: 'Billing & Invoicing Portal',
    subtitle: 'Automated invoice generation, payment receipts, and contract retainers for all agency clients.',
    icon: (
      <svg width="38" height="38" viewBox="0 0 24 24" fill="none" stroke="#16A34A" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
        <rect x="2" y="5" width="20" height="14" rx="2" />
        <line x1="2" y1="10" x2="22" y2="10" />
      </svg>
    ),
    features: [
      {
        icon: '💳',
        title: 'Instant Invoicing & Checkout',
        desc: 'Generate PDF invoices with 1-click links for Stripe, Bank Wire, EasyPaisa, and JazzCash.'
      },
      {
        icon: '🧾',
        title: 'Automated Receipts & History',
        desc: 'Download paid invoices and itemized service bills with automatic tax calculation.'
      },
      {
        icon: '📊',
        title: 'Retainer & Revenue Tracker',
        desc: 'Live financial summary showing paid retainers, pending milestone disbursements, and monthly totals.'
      }
    ]
  },
  invoices: {
    badge: 'Next Release',
    title: 'Invoices & Financial Ledger',
    subtitle: 'Comprehensive financial dashboard for tracking client payments, milestone billing, and tax receipts.',
    icon: (
      <svg width="38" height="38" viewBox="0 0 24 24" fill="none" stroke="#16A34A" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
        <rect x="2" y="5" width="20" height="14" rx="2" />
        <line x1="2" y1="10" x2="22" y2="10" />
      </svg>
    ),
    features: [
      {
        icon: '💳',
        title: 'Instant Invoicing & Checkout',
        desc: 'Generate PDF invoices with 1-click links for Stripe, Bank Wire, EasyPaisa, and JazzCash.'
      },
      {
        icon: '🧾',
        title: 'Automated Receipts & History',
        desc: 'Download paid invoices and itemized service bills with automatic tax calculation.'
      },
      {
        icon: '📊',
        title: 'Retainer & Revenue Tracker',
        desc: 'Live financial summary showing paid retainers, pending milestone disbursements, and monthly totals.'
      }
    ]
  }
};

export default function ComingSoonView({ section = 'tasks', onBackToProjects }) {
  const [notified, setNotified] = useState(false);
  const meta = SECTION_METADATA[section] || SECTION_METADATA.tasks;

  return (
    <div className="remotale-coming-soon-wrapper">
      <div className="remotale-coming-soon-card">
        {/* Glow Header */}
        <div className="remotale-cs-header">
          <div className="remotale-cs-icon-wrap">
            {meta.icon}
          </div>
          <span className="remotale-cs-badge">
            ✨ {meta.badge}
          </span>
          <h2 className="remotale-cs-title">{meta.title}</h2>
          <p className="remotale-cs-subtitle">{meta.subtitle}</p>
        </div>

        {/* Feature Cards Grid */}
        <div className="remotale-cs-features-grid">
          {meta.features.map((feat, idx) => (
            <div key={idx} className="remotale-cs-feature-card">
              <span className="remotale-cs-feat-icon">{feat.icon}</span>
              <h4 className="remotale-cs-feat-title">{feat.title}</h4>
              <p className="remotale-cs-feat-desc">{feat.desc}</p>
            </div>
          ))}
        </div>

        {/* Actions Row */}
        <div className="remotale-cs-actions">
          <button
            type="button"
            className="remotale-cs-btn-back"
            onClick={onBackToProjects}
          >
            ← Back to Projects
          </button>

          <button
            type="button"
            className={`remotale-cs-btn-notify ${notified ? 'notified' : ''}`}
            onClick={() => setNotified(true)}
          >
            {notified ? '✓ Notification Enabled' : '🔔 Notify Me When Live'}
          </button>
        </div>
      </div>
    </div>
  );
}
