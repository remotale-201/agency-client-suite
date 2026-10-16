import React from 'react';

export default class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, errorInfo) {
    console.error('[Remotale Error Boundary Caught]:', error, errorInfo);
  }

  handleReload = () => {
    window.location.reload();
  };

  handleReset = () => {
    try {
      localStorage.removeItem('byteforge_auth_user');
      localStorage.removeItem('agency_theme');
    } catch (e) {}
    window.location.href = '/';
  };

  render() {
    if (this.state.hasError) {
      return (
        <div style={{
          minHeight: '100vh',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          padding: '24px',
          background: '#0B0F19',
          color: '#F8FAFC',
          fontFamily: "'Plus Jakarta Sans', system-ui, sans-serif",
          textAlign: 'center'
        }}>
          <div style={{
            maxWidth: '460px',
            width: '100%',
            background: '#131926',
            border: '1px solid #1E2638',
            borderRadius: '16px',
            padding: '28px 24px',
            boxShadow: '0 20px 40px rgba(0,0,0,0.5)'
          }}>
            <div style={{
              width: '48px',
              height: '48px',
              borderRadius: '12px',
              background: 'rgba(239, 68, 68, 0.15)',
              color: '#EF4444',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              margin: '0 auto 16px auto',
              fontSize: '24px'
            }}>
              ⚠️
            </div>
            <h2 style={{ fontSize: '18px', fontWeight: 700, margin: '0 0 8px 0', color: '#FFFFFF' }}>
              Something went wrong
            </h2>
            <p style={{ fontSize: '13px', color: '#94A3B8', margin: '0 0 20px 0', lineHeight: 1.5 }}>
              The application encountered a render issue. You can refresh the page or restart your session.
            </p>
            {this.state.error?.message && (
              <div style={{
                background: '#080B11',
                border: '1px solid #1E2638',
                borderRadius: '8px',
                padding: '10px 12px',
                fontSize: '11px',
                fontFamily: 'monospace',
                color: '#F87171',
                textAlign: 'left',
                marginBottom: '20px',
                overflowX: 'auto',
                whiteSpace: 'pre-wrap'
              }}>
                {this.state.error.message}
              </div>
            )}
            <div style={{ display: 'flex', gap: '10px' }}>
              <button
                type="button"
                onClick={this.handleReload}
                style={{
                  flex: 1,
                  padding: '10px 14px',
                  borderRadius: '10px',
                  background: '#4F46E5',
                  color: '#FFFFFF',
                  border: 'none',
                  fontSize: '13px',
                  fontWeight: 600,
                  cursor: 'pointer'
                }}
              >
                Reload App
              </button>
              <button
                type="button"
                onClick={this.handleReset}
                style={{
                  flex: 1,
                  padding: '10px 14px',
                  borderRadius: '10px',
                  background: '#1E2638',
                  color: '#E2E8F0',
                  border: '1px solid #2E3A54',
                  fontSize: '13px',
                  fontWeight: 600,
                  cursor: 'pointer'
                }}
              >
                Clear Session
              </button>
            </div>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}
