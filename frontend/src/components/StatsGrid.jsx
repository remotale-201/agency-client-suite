import React from 'react';

export default function StatsGrid({ stats }) {
  if (!stats) return null;

  return (
    <div className="stats-grid">
      <div className="stat-card" style={{ borderLeft: stats.deadlinesToday > 0 ? '4px solid var(--critical-text)' : '1px solid var(--border-subtle)' }}>
        <div className="stat-card-header">
          <span className="stat-label">Deadlines Today</span>
          {stats.deadlinesToday > 0 && (
            <span className="badge-pill urgency-critical" style={{ fontSize: '10px' }}>
              Action Due
            </span>
          )}
        </div>
        <div className="stat-value" style={{ color: stats.deadlinesToday > 0 ? 'var(--critical-text)' : 'inherit' }}>
          {stats.deadlinesToday || 0}
        </div>
        <div className="stat-subtext">
          {stats.deadlinesToday > 0 ? 'Tasks or revisions due today' : 'No deadlines today'}
        </div>
      </div>

      <div className="stat-card" style={{ borderLeft: stats.deadlinesThisWeek > 0 ? '4px solid var(--high-text)' : '1px solid var(--border-subtle)' }}>
        <div className="stat-card-header">
          <span className="stat-label">Deadlines This Week</span>
          {stats.deadlinesThisWeek > 0 && (
            <span className="badge-pill urgency-high" style={{ fontSize: '10px' }}>
              Next 7 Days
            </span>
          )}
        </div>
        <div className="stat-value" style={{ color: stats.deadlinesThisWeek > 0 ? 'var(--high-text)' : 'inherit' }}>
          {stats.deadlinesThisWeek || 0}
        </div>
        <div className="stat-subtext">
          Deliverables & changes scheduled this week
        </div>
      </div>

      <div className="stat-card">
        <div className="stat-card-header">
          <span className="stat-label">Total Projects</span>
        </div>
        <div className="stat-value">{stats.totalProjects}</div>
        <div className="stat-subtext">Across client portfolios</div>
      </div>

      <div className="stat-card">
        <div className="stat-card-header">
          <span className="stat-label">In Progress & Review</span>
        </div>
        <div className="stat-value">{stats.inProgressProjects + stats.underReviewProjects}</div>
        <div className="stat-subtext">{stats.inProgressProjects} active, {stats.underReviewProjects} in QA</div>
      </div>

      <div className="stat-card">
        <div className="stat-card-header">
          <span className="stat-label">Completed</span>
        </div>
        <div className="stat-value">{stats.completedProjects}</div>
        <div className="stat-subtext">Delivered & approved</div>
      </div>

      <div className="stat-card">
        <div className="stat-card-header">
          <span className="stat-label">Open Revisions</span>
        </div>
        <div className="stat-value">{stats.openChanges}</div>
        <div className="stat-subtext">
          {stats.criticalChanges > 0 ? `${stats.criticalChanges} marked Critical` : 'Active revision requests'}
        </div>
      </div>
    </div>
  );
}
