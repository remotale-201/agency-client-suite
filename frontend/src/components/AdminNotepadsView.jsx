import React, { useState } from 'react';

export default function AdminNotepadsView({ projects, onSelectProject }) {
  const [selectedProjId, setSelectedProjId] = useState(projects[0]?.id || '');

  const activeProj = projects.find(p => p.id === selectedProjId) || projects[0];

  return (
    <div>
      <div className="section-header">
        <div className="section-header-title">
          <h2>All Client Project Notepads & Revision Logs</h2>
          <span className="badge-count">{projects.length} Active Notepads</span>
        </div>
      </div>

      {projects.length === 0 ? (
        <div style={{
          textAlign: 'center',
          padding: '60px 24px',
          background: 'var(--bg-surface)',
          borderRadius: 'var(--radius-lg)',
          border: '1px solid var(--border-subtle)',
          color: 'var(--text-muted)'
        }}>
          <h3 style={{ fontSize: '16px', fontWeight: 700, color: 'var(--text-primary)', marginBottom: '8px' }}>
            No Project Notepads Yet
          </h3>
          <p style={{ fontSize: '13px', maxWidth: '420px', margin: '0 auto', lineHeight: 1.6 }}>
            Create client portals and assign projects to access real-time cloud notepads, deliverable tracking, and revision changelogs.
          </p>
        </div>
      ) : (
        <div className="workspace-grid">
          {/* Project Selector List */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
          {projects.map(p => (
            <div
              key={p.id}
              onClick={() => setSelectedProjId(p.id)}
              style={{
                padding: '14px 16px',
                background: selectedProjId === p.id ? 'var(--bg-surface)' : 'var(--bg-surface-elevated)',
                border: `1px solid ${selectedProjId === p.id ? 'var(--border-active)' : 'var(--border-subtle)'}`,
                borderRadius: 'var(--radius-lg)',
                cursor: 'pointer',
                transition: 'all 0.15s ease',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                boxShadow: selectedProjId === p.id ? 'var(--shadow-sm)' : 'none'
              }}
            >
              <div>
                <div style={{ fontSize: '11px', color: 'var(--text-muted)', fontWeight: 700, textTransform: 'uppercase' }}>
                  {p.companyName}
                </div>
                <div style={{ fontSize: '14px', fontWeight: 700, color: 'var(--text-primary)' }}>
                  {p.title}
                </div>
                <div style={{ fontSize: '12px', color: 'var(--text-secondary)', marginTop: '2px' }}>
                  {p.openChangesCount > 0 ? (
                    <span style={{ color: '#b45309', fontWeight: 600 }}>{p.openChangesCount} revisions open</span>
                  ) : (
                    <span>Progress: {p.progress}%</span>
                  )}
                </div>
              </div>
              <span style={{ fontSize: '14px', color: 'var(--text-muted)' }}>→</span>
            </div>
          ))}
        </div>

        {/* Notepad Preview & Quick Open */}
        {activeProj && (
          <div className="notepad-card" style={{ height: 'fit-content' }}>
            <div className="notepad-header">
              <div>
                <div style={{ fontSize: '12px', color: 'var(--text-muted)', fontWeight: 700, textTransform: 'uppercase' }}>
                  {activeProj.companyName}
                </div>
                <h3 style={{ fontSize: '17px', fontWeight: 800 }}>{activeProj.title}</h3>
              </div>
              <button 
                className="btn btn-primary btn-sm"
                onClick={() => onSelectProject(activeProj)}
              >
                Open Workspace →
              </button>
            </div>

            <div style={{
              display: 'flex',
              gap: '16px',
              padding: '12px 14px',
              background: 'var(--bg-surface-elevated)',
              border: '1px solid var(--border-subtle)',
              borderRadius: 'var(--radius-md)',
              fontSize: '12px',
              color: 'var(--text-secondary)'
            }}>
              <span>Target Deadline: <strong>{activeProj.deadline}</strong></span>
              <span>Status: <strong style={{ textTransform: 'capitalize' }}>{activeProj.status}</strong></span>
            </div>

            <p style={{ fontSize: '13px', color: 'var(--text-secondary)', lineHeight: '1.6' }}>
              {activeProj.description}
            </p>

            <div style={{ display: 'flex', gap: '8px', marginTop: '12px' }}>
              <button 
                className="btn btn-secondary btn-sm"
                style={{ width: '100%' }}
                onClick={() => onSelectProject(activeProj)}
              >
                Edit Notepad & Review Revisions →
              </button>
            </div>
          </div>
        )}
      </div>
      )}
    </div>
  );
}
