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
    console.error(`[API Error] ${options.method || 'GET'} ${url}:`, error.message);
    throw error;
  }
}

export const api = {
  // Authentication
  login: (identifier, password) => 
    request('/api/auth/login', {
      method: 'POST',
      body: JSON.stringify({ identifier, password })
    }),
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

  // Health
  checkHealth: () => request('/api/health')
};
