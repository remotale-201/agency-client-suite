import React from 'react';

export default function ClientsView({ 
  clients, 
  onOpenNewClient, 
  onSwitchToClient, 
  onCopyPortalLink, 
  copiedToken 
}) {
  return (
    <div>
      <div className="section-header">
        <div className="section-header-title">
          <h2>Client Directory & Portal Portfolios</h2>
          <span className="badge-count">{clients.length} Active Clients</span>
        </div>

        <button className="btn btn-primary btn-sm" onClick={onOpenNewClient}>
          + Add Client
        </button>
      </div>

      <div className="projects-grid">
        {clients.map(client => (
          <div key={client.id} className="project-card">
            <div>
              <div className="project-card-top">
                <div>
                  <h3 style={{ fontSize: '16px', fontWeight: 800, color: 'var(--text-primary)' }}>
                    {client.company}
                  </h3>
                  <p style={{ fontSize: '13px', color: 'var(--text-secondary)' }}>
                    {client.name}
                  </p>
                </div>
                <span className="badge-pill status-completed">Active Client</span>
              </div>

              {/* Client Contact Info */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: '4px', margin: '14px 0', fontSize: '12px', color: 'var(--text-muted)' }}>
                {client.email && (
                  <div>
                    Email: <strong style={{ color: 'var(--text-secondary)' }}>{client.email}</strong>
                  </div>
                )}
                {client.phone && (
                  <div>
                    Phone: <strong style={{ color: 'var(--text-secondary)' }}>{client.phone}</strong>
                  </div>
                )}
              </div>

              {/* Client Operational Metrics (Without contract value / total spend) */}
              <div style={{
                display: 'grid',
                gridTemplateColumns: '1fr 1fr',
                gap: '8px',
                background: 'var(--bg-surface-elevated)',
                border: '1px solid var(--border-subtle)',
                padding: '12px',
                borderRadius: 'var(--radius-md)',
                marginBottom: '16px',
                textAlign: 'center'
              }}>
                <div>
                  <div style={{ fontSize: '11px', color: 'var(--text-muted)', textTransform: 'uppercase', fontWeight: 600 }}>
                    Active Projects
                  </div>
                  <div style={{ fontSize: '16px', fontWeight: 800, color: 'var(--text-primary)', fontFamily: 'var(--font-mono)' }}>
                    {client.totalProjects || 0}
                  </div>
                </div>
                <div>
                  <div style={{ fontSize: '11px', color: 'var(--text-muted)', textTransform: 'uppercase', fontWeight: 600 }}>
                    Open Revisions
                  </div>
                  <div style={{ fontSize: '16px', fontWeight: 800, color: client.openChanges > 0 ? 'var(--high-text)' : 'var(--text-muted)', fontFamily: 'var(--font-mono)' }}>
                    {client.openChanges || 0}
                  </div>
                </div>
              </div>

              {/* Portal Access Link */}
              <div style={{
                background: 'var(--bg-surface-elevated)',
                border: '1px solid var(--border-subtle)',
                borderRadius: 'var(--radius-md)',
                padding: '10px 12px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                gap: '8px',
                marginBottom: '16px'
              }}>
                <div style={{ overflow: 'hidden' }}>
                  <div style={{ fontSize: '10px', textTransform: 'uppercase', color: 'var(--text-muted)', fontWeight: 700 }}>
                    Portal Access Token
                  </div>
                  <div style={{ fontSize: '12px', fontFamily: 'var(--font-mono)', color: 'var(--text-primary)', fontWeight: 600, textOverflow: 'ellipsis', overflow: 'hidden', whiteSpace: 'nowrap' }}>
                    {client.portalToken}
                  </div>
                </div>

                <button 
                  className="btn btn-outline btn-sm"
                  style={{ padding: '4px 8px', fontSize: '11px' }}
                  onClick={() => onCopyPortalLink(client.portalToken)}
                >
                  {copiedToken === client.portalToken ? 'Copied' : 'Copy Link'}
                </button>
              </div>
            </div>

            {/* Switch Action */}
            <button 
              className="btn btn-secondary btn-sm"
              style={{ width: '100%' }}
              onClick={() => onSwitchToClient(client.id)}
            >
              Open as Client View →
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}
