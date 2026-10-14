import React from 'react';

export default function ClientsView({ 
  clients, 
  onOpenNewClient, 
  onSwitchToClient, 
  onCopyPortalLink, 
  onDeleteClient,
  copiedToken 
}) {
  return (
    <div>
      <div className="section-header">
        <div className="section-header-title">
          <h2>Client Directory & Portals</h2>
          <span className="badge-count">{clients.length} Active Clients</span>
        </div>

        <button className="btn btn-primary btn-sm" onClick={onOpenNewClient}>
          + Create Client Portal
        </button>
      </div>

      {clients.length === 0 ? (
        <div style={{
          textAlign: 'center',
          padding: '60px 24px',
          background: 'var(--bg-surface)',
          borderRadius: 'var(--radius-lg)',
          border: '1px solid var(--border-subtle)',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          gap: '16px'
        }}>
          <div style={{ fontSize: '18px', fontWeight: 800, color: 'var(--text-primary)' }}>
            No Client Portals Yet
          </div>
          <p style={{ color: 'var(--text-muted)', maxWidth: '420px', fontSize: '13px', lineHeight: 1.6 }}>
            Your agency database is completely clean. Create client portals with dedicated login credentials, custom portal URLs, and revision tracking.
          </p>
          <button className="btn btn-primary" onClick={onOpenNewClient}>
            + Create Your First Client Portal
          </button>
        </div>
      ) : (
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
                  <span className="badge-pill status-completed">Active Portal</span>
                </div>

                {/* Client Contact Info */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: '4px', margin: '14px 0', fontSize: '12px', color: 'var(--text-muted)' }}>
                  <div>
                    Login Email: <strong style={{ color: 'var(--text-primary)' }}>{client.email || 'N/A'}</strong>
                  </div>
                  {client.password && (
                    <div>
                      Password: <strong style={{ color: 'var(--accent-primary)', fontFamily: 'var(--font-mono)' }}>{client.password}</strong>
                    </div>
                  )}
                  {client.phone && (
                    <div>
                      Phone: <strong style={{ color: 'var(--text-secondary)' }}>{client.phone}</strong>
                    </div>
                  )}
                </div>

                {/* Client Operational Metrics */}
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
                      Projects
                    </div>
                    <div style={{ fontSize: '16px', fontWeight: 800, color: 'var(--text-primary)', fontFamily: 'var(--font-mono)' }}>
                      {client.totalProjects || 0}
                    </div>
                  </div>
                  <div>
                    <div style={{ fontSize: '11px', color: 'var(--text-muted)', textTransform: 'uppercase', fontWeight: 600 }}>
                      Revisions
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
                  marginBottom: '14px'
                }}>
                  <div style={{ overflow: 'hidden' }}>
                    <div style={{ fontSize: '10px', textTransform: 'uppercase', color: 'var(--text-muted)', fontWeight: 700 }}>
                      Portal Access Slug
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

              {/* Actions */}
              <div style={{ display: 'flex', gap: '8px', marginTop: '10px' }}>
                <button 
                  className="btn btn-secondary btn-sm"
                  style={{ flex: 1 }}
                  onClick={() => onSwitchToClient(client.id)}
                >
                  Preview Portal →
                </button>
                {onDeleteClient && (
                  <button
                    className="btn btn-danger btn-sm"
                    onClick={() => {
                      if (window.confirm(`Delete client portal for "${client.company}" and all associated projects?`)) {
                        onDeleteClient(client.id);
                      }
                    }}
                    title="Delete Client Portal"
                  >
                    Delete
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
