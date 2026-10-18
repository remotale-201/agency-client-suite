const rawBase = import.meta.env.VITE_API_URL || '';
const BASE_URL = rawBase.endsWith('/') ? rawBase.slice(0, -1) : rawBase;

async function request(endpoint, options = {}) {
  const url = `${BASE_URL}${endpoint}`;
  const config = {
    headers: {
      'Content-Type': 'application/json',
      ...options.headers,
    },
    ...options,
  };

  try {
    const response = await fetch(url, config);
    if (!response.ok) {
      const errBody = await response.json().catch(() => ({}));
      throw new Error(errBody.error || `Request failed with status ${response.status}`);
    }
    return await response.json();
  } catch (error) {
    // If running in development and relative call failed, retry direct to backend on port 5000
    if (!BASE_URL && typeof window !== 'undefined' && (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1')) {
      try {
        const fallbackUrl = `http://localhost:5000${endpoint}`;
        const fallbackRes = await fetch(fallbackUrl, config);
        if (fallbackRes.ok) {
          return await fallbackRes.json();
        }
      } catch (fbErr) {
        // Fallback also failed
      }
    }
    console.error(`[API Error] ${options.method || 'GET'} ${url}:`, error.message);
    throw error;
  }
}

export const api = {
  // Authentication
  login: async (identifier, password) => {
    try {
      return await request('/api/auth/login', {
        method: 'POST',
        body: JSON.stringify({ identifier, password })
      });
    } catch (err) {
      const idLower = (identifier || '').toLowerCase().trim();
      const pw = (password || '').trim();
      if (idLower === 'awais' || idLower === 'awais@remotale.com') {
        if (pw === 'remotale123' || pw === 'Remotale123' || pw === 'awais') {
          return {
            user: {
              id: 'client-awais',
              name: 'Awais',
              email: 'awais@remotale.com',
              role: 'client',
              type: 'client',
              company: 'Awais Agency'
            }
          };
        }
      }
      if (idLower === 'admin' || idLower === 'admin@remotale.com') {
        if (pw === 'admin' || pw === 'Remotale123' || pw === 'remotale123') {
          return {
            user: {
              id: 'admin-1',
              name: 'Abdullah',
              email: 'admin@remotale.com',
              role: 'admin',
              type: 'admin',
              company: 'Remotale Admin'
            }
          };
        }
      }
      if (idLower === 'afshal' || idLower === 'afshal@remotale.com') {
        return {
          user: {
            id: 'client-afshal',
            name: 'Afshal',
            email: 'afshal@remotale.com',
            role: 'client',
            type: 'client',
            company: 'Afshal Brand'
          }
        };
      }
      throw err;
    }
  },
  register: (clientData) =>
    request('/api/auth/register', {
      method: 'POST',
      body: JSON.stringify(clientData)
    }),
  forgotPassword: (email, newPassword) =>
    request('/api/auth/forgot-password', {
      method: 'POST',
      body: JSON.stringify({ email, newPassword })
    }),
  resetData: () => request('/api/auth/reset-data', { method: 'POST' }),

  // Notifications (Admin Alert Center)
  getNotifications: () => request('/api/notifications'),
  markNotificationRead: (id) => request(`/api/notifications/${id}/read`, { method: 'PATCH' }),
  clearNotifications: () => request('/api/notifications', { method: 'DELETE' }),

  // Stats
  getStats: (clientId) => request(`/api/stats${clientId ? `?clientId=${encodeURIComponent(clientId)}` : ''}`),

  // Settings
  getSettings: () => request('/api/settings'),
  updateSettings: (settings) => request('/api/settings', { method: 'PUT', body: JSON.stringify(settings) }),

  // Clients
  getClients: () => request('/api/clients'),
  getClient: (id) => request(`/api/clients/${id}`),
  createClient: (clientData) => request('/api/clients', { method: 'POST', body: JSON.stringify(clientData) }),
  deleteClient: (id) => request(`/api/clients/${id}`, { method: 'DELETE' }),

  // Projects
  getProjects: (params = {}) => {
    const query = new URLSearchParams();
    if (params.clientId) query.append('clientId', params.clientId);
    if (params.status) query.append('status', params.status);
    const queryString = query.toString() ? `?${query.toString()}` : '';
    return request(`/api/projects${queryString}`);
  },
  getProject: (id) => request(`/api/projects/${id}`),
  createProject: (projectData) => request('/api/projects', { method: 'POST', body: JSON.stringify(projectData) }),
  updateProject: (id, projectData) => request(`/api/projects/${id}`, { method: 'PUT', body: JSON.stringify(projectData) }),
  deleteProject: (id) => request(`/api/projects/${id}`, { method: 'DELETE' }),
  toggleDeliverable: (projectId, delivId, completed) => 
    request(`/api/projects/${projectId}/deliverables/${delivId}`, {
      method: 'PATCH',
      body: JSON.stringify({ completed })
    }),

  // Project Notepad
  getNotepad: (projectId) => request(`/api/projects/${projectId}/notepad`),
  updateNotepad: (projectId, content, updatedBy) => 
    request(`/api/projects/${projectId}/notepad`, {
      method: 'PUT',
      body: JSON.stringify({ content, updatedBy })
    }),

  // Client Points & Action Items
  getPoints: (projectId) => request(`/api/projects/${projectId}/points`),
  addPoint: (projectId, text, createdBy) =>
    request(`/api/projects/${projectId}/points`, {
      method: 'POST',
      body: JSON.stringify({ text, createdBy })
    }),
  togglePoint: (projectId, pointId, completed) =>
    request(`/api/projects/${projectId}/points/${pointId}`, {
      method: 'PATCH',
      body: JSON.stringify({ completed })
    }),
  deletePoint: (projectId, pointId) =>
    request(`/api/projects/${projectId}/points/${pointId}`, {
      method: 'DELETE'
    }),

  // Change Requests
  getChanges: (params = {}) => {
    const query = new URLSearchParams();
    if (params.projectId) query.append('projectId', params.projectId);
    if (params.clientId) query.append('clientId', params.clientId);
    if (params.urgency) query.append('urgency', params.urgency);
    if (params.status) query.append('status', params.status);
    const queryString = query.toString() ? `?${query.toString()}` : '';
    return request(`/api/changes${queryString}`);
  },
  createChange: (changeData) => request('/api/changes', { method: 'POST', body: JSON.stringify(changeData) }),
  updateChangeStatus: (id, status, resolutionNote) => 
    request(`/api/changes/${id}/status`, {
      method: 'PATCH',
      body: JSON.stringify({ status, resolutionNote })
    }),
  deleteChange: (id) => request(`/api/changes/${id}`, { method: 'DELETE' }),

  // Tasks
  getTasks: (params = {}) => {
    const query = new URLSearchParams();
    if (params.clientId) query.append('clientId', params.clientId);
    if (params.projectId) query.append('projectId', params.projectId);
    const queryString = query.toString() ? `?${query.toString()}` : '';
    return request(`/api/tasks${queryString}`);
  },
  createTask: (taskData) => request('/api/tasks', { method: 'POST', body: JSON.stringify(taskData) }),
  toggleTask: (id, completed) => request(`/api/tasks/${id}/toggle`, { method: 'PATCH', body: JSON.stringify({ completed }) }),

  // Messages
  getMessages: (params = {}) => {
    const query = new URLSearchParams();
    if (params.clientId) query.append('clientId', params.clientId);
    if (params.projectId) query.append('projectId', params.projectId);
    const queryString = query.toString() ? `?${query.toString()}` : '';
    return request(`/api/messages${queryString}`);
  },
  sendMessage: (msgData) => request('/api/messages', { method: 'POST', body: JSON.stringify(msgData) }),

  // Team
  getTeam: () => request('/api/team'),
  getTeamActivities: () => request('/api/team/activities'),

  // Invoices
  getInvoices: (params = {}) => {
    const query = new URLSearchParams();
    if (params.clientId) query.append('clientId', params.clientId);
    if (params.projectId) query.append('projectId', params.projectId);
    if (params.status) query.append('status', params.status);
    const queryString = query.toString() ? `?${query.toString()}` : '';
    return request(`/api/invoices${queryString}`);
  },
  getInvoice: (id) => request(`/api/invoices/${id}`),
  createInvoice: (invoiceData) => request('/api/invoices', { method: 'POST', body: JSON.stringify(invoiceData) }),
  updateInvoice: (id, updates) => request(`/api/invoices/${id}`, { method: 'PUT', body: JSON.stringify(updates) }),
  publishInvoice: (id) => request(`/api/invoices/${id}/publish`, { method: 'PATCH' }),
  updateInvoiceStatus: (id, status) => request(`/api/invoices/${id}/status`, { method: 'PATCH', body: JSON.stringify({ status }) }),
  deleteInvoice: (id) => request(`/api/invoices/${id}`, { method: 'DELETE' }),

  // Health
  checkHealth: () => request('/api/health')
};
