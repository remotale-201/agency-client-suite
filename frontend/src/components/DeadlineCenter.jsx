import React, { useState } from 'react';

export default function DeadlineCenter({ stats, onSelectProjectById }) {
  const [filter, setFilter] = useState('all'); // 'all', 'today', 'this-week'

  if (!stats) return null;

  const todayItems = stats.todayItems || [];
  const thisWeekItems = stats.thisWeekItems || [];

  let displayedItems = [];
  if (filter === 'today') {
    displayedItems = todayItems;
  } else if (filter === 'this-week') {
    displayedItems = thisWeekItems;
  } else {
    // Merge unique
    const ids = new Set();
    displayedItems = [...todayItems, ...thisWeekItems].filter(item => {
      if (ids.has(item.id)) return false;
      ids.add(item.id);
      return true;
    });
  }

  return (
    <div className="deadline-center-card">
      <div className="deadline-center-header">
        <div>
          <h3 style={{ fontSize: '16px', fontWeight: 800, color: 'var(--text-primary)', marginBottom: '2px' }}>
            Deadline Priority Center
          </h3>
          <p style={{ fontSize: '12px', color: 'var(--text-muted)' }}>
            Track items scheduled for delivery today or within the next 7 days
          </p>
        </div>

        {/* Filter Tabs */}
        <div className="deadline-tabs">
          <button
            className={`btn btn-sm ${filter === 'all' ? 'btn-primary' : 'btn-outline'}`}
            onClick={() => setFilter('all')}
          >
            All Upcoming ({todayItems.length + thisWeekItems.length})
          </button>
          <button
            className={`btn btn-sm ${filter === 'today' ? 'btn-primary' : 'btn-outline'}`}
            onClick={() => setFilter('today')}
            style={filter === 'today' ? { background: 'var(--critical-bg)', color: 'var(--critical-text)', borderColor: 'var(--critical-border)' } : {}}
          >
            Due Today ({todayItems.length})
          </button>
          <button
            className={`btn btn-sm ${filter === 'this-week' ? 'btn-primary' : 'btn-outline'}`}
            onClick={() => setFilter('this-week')}
            style={filter === 'this-week' ? { background: 'var(--high-bg)', color: 'var(--high-text)', borderColor: 'var(--high-border)' } : {}}
          >
            Due This Week ({thisWeekItems.length})
          </button>
        </div>
      </div>

      {displayedItems.length === 0 ? (
        <div style={{
          padding: '24px',
          textAlign: 'center',
          color: 'var(--text-muted)',
          fontSize: '13px',
          background: 'var(--bg-surface-elevated)',
          borderRadius: 'var(--radius-md)',
          border: '1px solid var(--border-subtle)'
        }}>
          No items matching this deadline window. All tasks on track.
        </div>
      ) : (
        <div className="deadline-items-grid">
          {displayedItems.map(item => {
            const todayIso = new Date().toISOString().slice(0, 10);
            const isToday = item.deadline === todayIso;

            return (
              <div 
                key={item.id}
                style={{
                  padding: '14px 16px',
                  background: isToday ? 'var(--critical-bg)' : 'var(--bg-surface-elevated)',
                  border: `1px solid ${isToday ? 'var(--critical-border)' : 'var(--border-subtle)'}`,
                  borderRadius: 'var(--radius-md)',
                  display: 'flex',
                  flexDirection: 'column',
                  justifyContent: 'space-between',
                  gap: '10px'
                }}
              >
                <div>
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '6px' }}>
                    <span style={{ fontSize: '11px', fontWeight: 700, color: 'var(--text-muted)', textTransform: 'uppercase' }}>
                      {item.companyName} • {item.type}
                    </span>
                    <span className={`badge-pill urgency-${item.urgency || 'normal'}`} style={{ fontSize: '10px', padding: '2px 8px' }}>
                      {item.urgency}
                    </span>
                  </div>

                  <h4 style={{ fontSize: '14px', fontWeight: 700, color: 'var(--text-primary)', marginBottom: '4px' }}>
                    {item.title}
                  </h4>
                </div>

                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', fontSize: '12px', paddingTop: '8px', borderTop: '1px solid var(--border-subtle)' }}>
                  <span style={{ fontWeight: 700, color: isToday ? 'var(--critical-text)' : 'var(--high-text)' }}>
                    {isToday ? `Deadline: Today (${item.deadline})` : `Target: ${item.deadline}`}
                  </span>

                  <button 
                    className="btn btn-secondary btn-sm"
                    style={{ padding: '4px 8px', fontSize: '11px' }}
                    onClick={() => onSelectProjectById(item.projectId)}
                  >
                    Open Notepad →
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
