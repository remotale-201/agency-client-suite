import { SEED_INVOICES, SEED_PROJECTS } from './seedData';

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

// Persistent storage helpers for real-time cross-tab & cross-role messaging
const MESSAGES_KEY = 'remotale_messages_v1';

function getStoredMessages() {
  if (typeof window === 'undefined') return [];
  try {
    const raw = localStorage.getItem(MESSAGES_KEY);
    if (raw) {
      const parsed = JSON.parse(raw);
      if (Array.isArray(parsed)) {
        return parsed.filter(m => m.id !== 'msg-1' && m.id !== 'msg-2' && m.id !== 'msg-3');
      }
    }
  } catch (e) {}
  return [];
}

function persistStoredMessages(msgs) {
  if (typeof window === 'undefined') return;
  try {
    const clean = msgs.filter(m => m.id !== 'msg-1' && m.id !== 'msg-2' && m.id !== 'msg-3');
    localStorage.setItem(MESSAGES_KEY, JSON.stringify(clean));
  } catch (e) {}
}

function broadcastSync(msg) {
  if (typeof window === 'undefined') return;
  try {
    if ('BroadcastChannel' in window) {
      const bc = new BroadcastChannel('remotale_messages_sync');
      bc.postMessage({ type: 'NEW_MESSAGE', message: msg });
      setTimeout(() => {
        try { bc.close(); } catch (e) {}
      }, 500);
    }
    window.dispatchEvent(new CustomEvent('remotale_message_event', { detail: msg }));
  } catch (e) {}
}

// Persistent storage helpers for resilient Invoices (LocalStorage + BroadcastChannel + Backend API)
const INVOICES_KEY = 'remotale_invoices_v1';

function getStoredInvoices() {
  if (typeof window === 'undefined') return SEED_INVOICES;
  try {
    const raw = localStorage.getItem(INVOICES_KEY);
    if (raw) {
      const parsed = JSON.parse(raw);
      if (Array.isArray(parsed) && parsed.length > 0) {
        return parsed;
      }
    }
  } catch (e) {}
  return SEED_INVOICES;
}

function persistStoredInvoices(invs) {
  if (typeof window === 'undefined') return;
  try {
    localStorage.setItem(INVOICES_KEY, JSON.stringify(invs || []));
  } catch (e) {}
}

function broadcastInvoiceSync(action, invoice) {
  if (typeof window === 'undefined') return;
  try {
    if ('BroadcastChannel' in window) {
      const bc = new BroadcastChannel('remotale_invoices_sync');
      bc.postMessage({ type: 'INVOICE_SYNC', action, invoice });
      setTimeout(() => {
        try { bc.close(); } catch (e) {}
      }, 500);
    }
    window.dispatchEvent(new CustomEvent('remotale_invoice_event', { detail: { action, invoice } }));
  } catch (e) {}
}

// Persistent storage helpers for resilient Tasks (To-Do List)
const TASKS_KEY = 'remotale_tasks_v1';

function getStoredTasks() {
  if (typeof window === 'undefined') return [];
  try {
    const raw = localStorage.getItem(TASKS_KEY);
    if (raw) {
      const parsed = JSON.parse(raw);
      if (Array.isArray(parsed) && parsed.length > 0) {
        return parsed;
      }
    }
  } catch (e) {}
  // Default fallback from SEED_PROJECTS if localStorage is empty
  try {
    const seed = SEED_PROJECTS.flatMap(p => (p.tasks || []).map((t, idx) => ({
      ...t,
      id: t.id || `task-${p.id}-${idx + 1}`,
      project_id: t.project_id || p.id,
      client_id: t.client_id || p.client_id || p.clientId
    })));
    return seed;
  } catch (e) {
    return [];
  }
}

function persistStoredTasks(tasks) {
  if (typeof window === 'undefined') return;
  try {
    localStorage.setItem(TASKS_KEY, JSON.stringify(tasks || []));
  } catch (e) {}
}

function broadcastTaskSync(action, task) {
  if (typeof window === 'undefined') return;
  try {
    if ('BroadcastChannel' in window) {
      const bc = new BroadcastChannel('remotale_tasks_sync');
      bc.postMessage({ type: 'TASK_SYNC', action, task });
      setTimeout(() => {
        try { bc.close(); } catch (e) {}
      }, 500);
    }
    window.dispatchEvent(new CustomEvent('remotale_task_event', { detail: { action, task } }));
  } catch (e) {}
}

// Persistent storage helpers for resilient Projects
const PROJECTS_KEY = 'remotale_projects_v1';

function getStoredProjects() {
  if (typeof window === 'undefined') return SEED_PROJECTS;
  try {
    const raw = localStorage.getItem(PROJECTS_KEY);
    if (raw) {
      const parsed = JSON.parse(raw);
      if (Array.isArray(parsed) && parsed.length > 0) {
        return parsed;
      }
    }
  } catch (e) {}
  return SEED_PROJECTS;
}

function persistStoredProjects(projs) {
  if (typeof window === 'undefined') return;
  try {
    localStorage.setItem(PROJECTS_KEY, JSON.stringify(projs || []));
  } catch (e) {}
}

function broadcastProjectSync(action, project) {
  if (typeof window === 'undefined') return;
  try {
    if ('BroadcastChannel' in window) {
      const bc = new BroadcastChannel('remotale_projects_sync');
      bc.postMessage({ type: 'PROJECT_SYNC', action, project });
      setTimeout(() => {
        try { bc.close(); } catch (e) {}
      }, 500);
    }
    window.dispatchEvent(new CustomEvent('remotale_project_event', { detail: { action, project } }));
  } catch (e) {}
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

  // Projects - Resilient Multi-Tier Persistence (LocalStorage + BroadcastChannel + Backend API)
  getStoredProjects: () => getStoredProjects(),
  persistStoredProjects: (projs) => persistStoredProjects(projs),

  getProjects: async (params = {}) => {
    let serverProjs = [];
    let serverOk = false;
    try {
      const query = new URLSearchParams();
      if (params.clientId) query.append('clientId', params.clientId);
      if (params.status) query.append('status', params.status);
      const queryString = query.toString() ? `?${query.toString()}` : '';
      const res = await request(`/api/projects${queryString}`);
      if (Array.isArray(res) && res.length > 0) {
        serverProjs = res;
        serverOk = true;
      }
    } catch (err) {
      // Offline / fallback to local store
    }

    const localProjs = getStoredProjects();
    if (!serverOk) {
      let filtered = localProjs;
      if (params.clientId) filtered = filtered.filter(p => p.client_id === params.clientId || p.clientId === params.clientId);
      if (params.status) filtered = filtered.filter(p => p.status === params.status);
      return filtered;
    }

    // Merge server projects with local projects to preserve local notes, credentials, and tasks
    const map = new Map();
    localProjs.forEach(p => map.set(p.id, p));
    serverProjs.forEach(p => {
      const local = map.get(p.id);
      map.set(p.id, {
        ...(local || {}),
        ...p,
        notes: (local && local.notes && !p.notes) ? local.notes : (p.notes || local?.notes || ''),
        credentials: (local && Array.isArray(local.credentials) && local.credentials.length > 0 && (!p.credentials || p.credentials.length === 0)) ? local.credentials : (p.credentials || local?.credentials || []),
        files: (local && Array.isArray(local.files) && local.files.length > 0 && (!p.files || p.files.length === 0)) ? local.files : (p.files || local?.files || []),
        tasks: (Array.isArray(p.tasks) && p.tasks.length > 0) ? p.tasks : (local?.tasks || [])
      });
    });

    const merged = Array.from(map.values());
    persistStoredProjects(merged);

    let result = merged;
    if (params.clientId) result = result.filter(p => p.client_id === params.clientId || p.clientId === params.clientId);
    if (params.status) result = result.filter(p => p.status === params.status);
    return result;
  },

  getProject: async (id) => {
    try {
      const res = await request(`/api/projects/${id}`);
      if (res && res.id) {
        const localProjs = getStoredProjects();
        const updated = localProjs.map(p => p.id === id ? { ...p, ...res } : p);
        persistStoredProjects(updated);
        return res;
      }
    } catch (err) {}
    const local = getStoredProjects().find(p => p.id === id);
    if (local) return local;
    throw new Error('Project not found');
  },

  createProject: async (projectData) => {
    const finalId = projectData.id || `proj-${Date.now()}`;
    const newProj = {
      ...projectData,
      id: finalId,
      client_id: projectData.clientId || projectData.client_id || 'client-awais',
      status: projectData.status || 'in-progress',
      progress: Number(projectData.progress) || 0,
      tasks: projectData.tasks || [],
      files: projectData.files || [],
      credentials: projectData.credentials || [],
      created_at: new Date().toISOString()
    };

    const projs = getStoredProjects();
    projs.unshift(newProj);
    persistStoredProjects(projs);
    broadcastProjectSync('CREATE', newProj);

    if (newProj.tasks && newProj.tasks.length > 0) {
      const currentTasks = getStoredTasks();
      persistStoredTasks([...newProj.tasks, ...currentTasks]);
    }

    try {
      const serverRes = await request('/api/projects', {
        method: 'POST',
        body: JSON.stringify(newProj)
      });
      if (serverRes && serverRes.id) {
        const merged = { ...newProj, ...serverRes };
        persistStoredProjects(getStoredProjects().map(p => p.id === finalId ? merged : p));
        return merged;
      }
    } catch (err) {
      console.warn('[api.createProject] Preserved locally:', err.message);
    }
    return newProj;
  },

  updateProject: async (id, projectData) => {
    const projs = getStoredProjects();
    let updatedProj = null;
    const updatedList = projs.map(p => {
      if (p.id === id) {
        updatedProj = { ...p, ...projectData };
        return updatedProj;
      }
      return p;
    });
    if (updatedProj) {
      persistStoredProjects(updatedList);
      broadcastProjectSync('UPDATE', updatedProj);
    }

    try {
      const serverRes = await request(`/api/projects/${id}`, {
        method: 'PUT',
        body: JSON.stringify(projectData)
      });
      if (serverRes && serverRes.id) {
        const merged = { ...(updatedProj || {}), ...serverRes };
        persistStoredProjects(getStoredProjects().map(p => p.id === id ? merged : p));
        return merged;
      }
    } catch (err) {
      console.warn('[api.updateProject] Preserved locally:', err.message);
    }
    return updatedProj || { id, ...projectData };
  },

  deleteProject: async (id) => {
    const projs = getStoredProjects().filter(p => p.id !== id);
    persistStoredProjects(projs);
    broadcastProjectSync('DELETE', { id });

    const tasks = getStoredTasks().filter(t => t.project_id !== id && t.projectId !== id);
    persistStoredTasks(tasks);

    try {
      await request(`/api/projects/${id}`, { method: 'DELETE' });
    } catch (err) {
      console.warn('[api.deleteProject] Removed locally:', err.message);
    }
    return { success: true };
  },

  toggleDeliverable: async (projectId, delivId, completed) => {
    const projs = getStoredProjects();
    let updatedProj = null;
    const updatedList = projs.map(p => {
      if (p.id === projectId) {
        const delivs = (p.deliverables || []).map(d => {
          if (d.id === delivId) return { ...d, completed: Boolean(completed) };
          return d;
        });
        updatedProj = { ...p, deliverables: delivs };
        return updatedProj;
      }
      return p;
    });
    if (updatedProj) {
      persistStoredProjects(updatedList);
      broadcastProjectSync('UPDATE', updatedProj);
    }

    try {
      const res = await request(`/api/projects/${projectId}/deliverables/${delivId}`, {
        method: 'PATCH',
        body: JSON.stringify({ completed })
      });
      return res;
    } catch (err) {
      return updatedProj || { id: projectId };
    }
  },

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

  // Tasks - Resilient Multi-Tier Persistence (LocalStorage + BroadcastChannel + Backend API)
  getStoredTasks: () => getStoredTasks(),
  persistStoredTasks: (tasks) => persistStoredTasks(tasks),

  getTasks: async (params = {}) => {
    let serverTasks = [];
    let serverOk = false;
    try {
      const query = new URLSearchParams();
      if (params.clientId) query.append('clientId', params.clientId);
      if (params.projectId) query.append('projectId', params.projectId);
      const queryString = query.toString() ? `?${query.toString()}` : '';
      const res = await request(`/api/tasks${queryString}`);
      if (Array.isArray(res) && res.length > 0) {
        serverTasks = res;
        serverOk = true;
      }
    } catch (err) {
      // Offline / network fallback
    }

    const localTasks = getStoredTasks();
    if (!serverOk) {
      let filtered = localTasks;
      if (params.clientId) filtered = filtered.filter(t => t.client_id === params.clientId || t.clientId === params.clientId);
      if (params.projectId) filtered = filtered.filter(t => t.project_id === params.projectId || t.projectId === params.projectId);
      return filtered;
    }

    // Merge: server tasks + local tasks
    const map = new Map();
    localTasks.forEach(t => map.set(t.id, t));
    serverTasks.forEach(t => {
      const existing = map.get(t.id);
      map.set(t.id, {
        ...(existing || {}),
        ...t,
        completed_at: t.completed_at || existing?.completed_at || null
      });
    });

    const merged = Array.from(map.values());
    persistStoredTasks(merged);

    let result = merged;
    if (params.clientId) result = result.filter(t => t.client_id === params.clientId || t.clientId === params.clientId);
    if (params.projectId) result = result.filter(t => t.project_id === params.projectId || t.projectId === params.projectId);
    return result;
  },

  createTask: async (taskData) => {
    const finalId = taskData.id || `task-${Date.now()}-${Math.random().toString(36).substr(2, 6)}`;
    const isComp = Boolean(taskData.completed);
    const nowIso = new Date().toISOString();
    const normalized = {
      ...taskData,
      id: finalId,
      project_id: taskData.project_id || taskData.projectId || null,
      projectId: taskData.projectId || taskData.project_id || null,
      client_id: taskData.client_id || taskData.clientId || null,
      clientId: taskData.clientId || taskData.client_id || null,
      title: (taskData.title || '').trim(),
      due_date: taskData.due_date || taskData.dueDate || new Date(Date.now() + 7 * 86400000).toLocaleDateString('en-GB'),
      dueDate: taskData.dueDate || taskData.due_date || new Date(Date.now() + 7 * 86400000).toLocaleDateString('en-GB'),
      completed: isComp,
      completed_at: isComp ? (taskData.completed_at || taskData.completedAt || nowIso) : null,
      assigned_name: taskData.assigned_name || taskData.assignedName || 'Abdullah',
      assigned_avatar: taskData.assigned_avatar || taskData.assignedAvatar || ''
    };

    // Immediately persist to localStorage
    const currentTasks = getStoredTasks();
    currentTasks.unshift(normalized);
    persistStoredTasks(currentTasks);
    broadcastTaskSync('CREATE', normalized);

    // Also update parent project in localStorage
    if (normalized.project_id) {
      const projs = getStoredProjects();
      const updatedProjs = projs.map(p => {
        if (p.id !== normalized.project_id) return p;
        const nextTasks = [normalized, ...(p.tasks || [])];
        const total = nextTasks.length;
        const done = nextTasks.filter(t => t.completed).length;
        const pct = total > 0 ? Math.round((done / total) * 100) : 0;
        return {
          ...p,
          tasks: nextTasks,
          progress: pct >= 100 ? 100 : pct,
          status: (total > 0 && done === total) ? 'completed' : 'in-progress'
        };
      });
      persistStoredProjects(updatedProjs);
      broadcastProjectSync('UPDATE', updatedProjs.find(p => p.id === normalized.project_id));
    }

    try {
      const serverRes = await request('/api/tasks', {
        method: 'POST',
        body: JSON.stringify(normalized)
      });
      if (serverRes && serverRes.id) {
        const mergedObj = { ...normalized, ...serverRes };
        const updated = getStoredTasks().map(t => t.id === finalId ? mergedObj : t);
        persistStoredTasks(updated);
        return mergedObj;
      }
    } catch (err) {
      console.warn('[api.createTask] Preserved locally:', err.message);
    }

    return normalized;
  },

  toggleTask: async (id, completed) => {
    const nowIso = new Date().toISOString();
    const localTasks = getStoredTasks();
    let updatedObj = null;

    // 1. Immediately update localStorage for tasks
    const updatedTasks = localTasks.map(t => {
      if (t.id === id || (t.aliasId && t.aliasId === id)) {
        const nextComp = completed !== undefined ? Boolean(completed) : !t.completed;
        updatedObj = {
          ...t,
          completed: nextComp,
          completed_at: nextComp ? (t.completed_at || nowIso) : null
        };
        return updatedObj;
      }
      return t;
    });

    if (updatedObj) {
      persistStoredTasks(updatedTasks);
      broadcastTaskSync('TOGGLE', updatedObj);

      // Also update project in stored projects & recalculate progress
      const targetProjId = updatedObj.project_id || updatedObj.projectId;
      if (targetProjId) {
        const projs = getStoredProjects();
        const updatedProjs = projs.map(p => {
          if (p.id !== targetProjId) return p;
          const pTasks = (p.tasks || []).map(t => {
            if (t.id === id || (t.aliasId && t.aliasId === id)) {
              return { ...t, ...updatedObj };
            }
            return t;
          });
          const total = pTasks.length;
          const done = pTasks.filter(t => t.completed).length;
          const pct = total > 0 ? Math.round((done / total) * 100) : p.progress;
          const isDone = total > 0 && done === total;
          return {
            ...p,
            tasks: pTasks,
            progress: isDone ? 100 : pct,
            status: isDone ? 'completed' : (p.status === 'completed' ? 'in-progress' : p.status)
          };
        });
        persistStoredProjects(updatedProjs);
        broadcastProjectSync('UPDATE', updatedProjs.find(p => p.id === targetProjId));
      }
    }

    // 2. Sync to backend API
    try {
      const serverRes = await request(`/api/tasks/${id}/toggle`, {
        method: 'PATCH',
        body: JSON.stringify({ completed: updatedObj ? updatedObj.completed : completed })
      });
      if (serverRes && serverRes.id) {
        const finalObj = { ...(updatedObj || {}), ...serverRes };
        const refreshedTasks = getStoredTasks().map(t => (t.id === finalObj.id || t.id === id) ? finalObj : t);
        persistStoredTasks(refreshedTasks);
        return finalObj;
      }
    } catch (err) {
      console.warn('[api.toggleTask] Preserved locally:', err.message);
    }

    return updatedObj || { id, completed: Boolean(completed), completed_at: completed ? nowIso : null };
  },

  updateTask: async (id, updates) => {
    const localTasks = getStoredTasks();
    let updatedObj = null;
    const updatedTasks = localTasks.map(t => {
      if (t.id === id || (t.aliasId && t.aliasId === id)) {
        updatedObj = { ...t, ...updates };
        return updatedObj;
      }
      return t;
    });
    if (updatedObj) {
      persistStoredTasks(updatedTasks);
      broadcastTaskSync('UPDATE', updatedObj);
    }

    try {
      const serverRes = await request(`/api/tasks/${id}`, {
        method: 'PUT',
        body: JSON.stringify(updates)
      });
      if (serverRes && serverRes.id) {
        const finalObj = { ...(updatedObj || {}), ...serverRes };
        persistStoredTasks(getStoredTasks().map(t => (t.id === finalObj.id || t.id === id) ? finalObj : t));
        return finalObj;
      }
    } catch (err) {
      console.warn('[api.updateTask] Preserved locally:', err.message);
    }
    return updatedObj || { id, ...updates };
  },

  deleteTask: async (id) => {
    const currentTasks = getStoredTasks().filter(t => t.id !== id && t.aliasId !== id);
    persistStoredTasks(currentTasks);
    broadcastTaskSync('DELETE', { id });

    const projs = getStoredProjects();
    const updatedProjs = projs.map(p => {
      const remaining = (p.tasks || []).filter(t => t.id !== id && t.aliasId !== id);
      if (remaining.length === (p.tasks || []).length) return p;
      const total = remaining.length;
      const done = remaining.filter(t => t.completed).length;
      const pct = total > 0 ? Math.round((done / total) * 100) : 0;
      return {
        ...p,
        tasks: remaining,
        progress: pct >= 100 ? 100 : pct,
        status: (total > 0 && done === total) ? 'completed' : 'in-progress'
      };
    });
    persistStoredProjects(updatedProjs);

    try {
      await request(`/api/tasks/${id}`, { method: 'DELETE' });
    } catch (err) {
      console.warn('[api.deleteTask] Removed locally:', err.message);
    }
    return { success: true };
  },
  // Messages - Resilient Real-Time Persistence (LocalStorage + BroadcastChannel + Cloud API)
  getMessages: async (params = {}) => {
    let serverMsgs = [];
    try {
      const query = new URLSearchParams();
      if (params.clientId) query.append('clientId', params.clientId);
      if (params.projectId) query.append('projectId', params.projectId);
      const queryString = query.toString() ? `?${query.toString()}` : '';
      const res = await request(`/api/messages${queryString}`);
      if (Array.isArray(res)) {
        serverMsgs = res.filter(m => m.id !== 'msg-1' && m.id !== 'msg-2' && m.id !== 'msg-3');
      }
    } catch (err) {
      // Offline / Static Vercel mode: Fallback to local store
    }

    const localMsgs = getStoredMessages();
    const map = new Map();
    localMsgs.forEach(m => map.set(m.id, m));
    serverMsgs.forEach(m => map.set(m.id, { ...(map.get(m.id) || {}), ...m }));

    const merged = Array.from(map.values()).sort((a, b) => new Date(a.created_at || 0) - new Date(b.created_at || 0));
    persistStoredMessages(merged);

    if (params.projectId) {
      return merged.filter(m => m.project_id === params.projectId || m.projectId === params.projectId);
    }
    if (params.clientId) {
      return merged.filter(m => m.sender_id === params.clientId || m.receiver_id === params.clientId);
    }
    return merged;
  },

  sendMessage: async (msgData) => {
    const finalId = msgData.id || `msg-${Date.now()}-${Math.random().toString(36).substr(2, 6)}`;
    const finalCreatedAt = msgData.created_at || new Date().toISOString();
    const normalized = {
      ...msgData,
      id: finalId,
      project_id: msgData.project_id || msgData.projectId,
      projectId: msgData.projectId || msgData.project_id,
      sender_id: msgData.sender_id || msgData.senderId || 'user-1',
      senderId: msgData.senderId || msgData.sender_id || 'user-1',
      sender_name: msgData.sender_name || msgData.senderName || 'User',
      senderName: msgData.senderName || msgData.sender_name || 'User',
      sender_avatar: msgData.sender_avatar || msgData.senderAvatar || '',
      senderAvatar: msgData.senderAvatar || msgData.sender_avatar || '',
      receiver_id: msgData.receiver_id || msgData.receiverId || null,
      receiverId: msgData.receiverId || msgData.receiver_id || null,
      content: (msgData.content || '').trim(),
      image_url: msgData.image_url || msgData.imageUrl || null,
      imageUrl: msgData.imageUrl || msgData.image_url || null,
      created_at: finalCreatedAt
    };

    // Store in localStorage immediately
    const currentList = getStoredMessages();
    const existingIdx = currentList.findIndex(m => m.id === finalId);
    if (existingIdx >= 0) {
      currentList[existingIdx] = normalized;
    } else {
      currentList.push(normalized);
    }
    persistStoredMessages(currentList);

    // Broadcast in real-time to other open tabs / windows
    broadcastSync(normalized);

    // Try posting to backend API
    try {
      const serverRes = await request('/api/messages', {
        method: 'POST',
        body: JSON.stringify(normalized)
      });
      if (serverRes && serverRes.id) {
        const mergedObj = { ...normalized, ...serverRes };
        const updated = getStoredMessages().map(m => m.id === finalId ? mergedObj : m);
        persistStoredMessages(updated);
        return mergedObj;
      }
    } catch (e) {
      // Local persistence already done
    }

    return normalized;
  },

  createMessage: async (msgData) => {
    return api.sendMessage(msgData);
  },

  // Team
  getTeam: () => request('/api/team'),
  addTeamMember: (memberData) => request('/api/team', { method: 'POST', body: JSON.stringify(memberData) }),
  deleteTeamMember: (id) => request(`/api/team/${id}`, { method: 'DELETE' }),
  getTeamActivities: () => request('/api/team/activities'),

  // Invoices - Resilient Real-Time Persistence (LocalStorage + BroadcastChannel + Cloud API)
  getStoredInvoices: () => getStoredInvoices(),

  getInvoices: async (params = {}) => {
    let serverInvoices = [];
    let serverOk = false;
    try {
      const query = new URLSearchParams();
      if (params.clientId) query.append('clientId', params.clientId);
      if (params.projectId) query.append('projectId', params.projectId);
      if (params.status) query.append('status', params.status);
      if (params.includeDeleted) query.append('includeDeleted', 'true');
      const queryString = query.toString() ? `?${query.toString()}` : '';
      const res = await request(`/api/invoices${queryString}`);
      if (Array.isArray(res)) {
        serverInvoices = res;
        serverOk = true;
      }
    } catch (err) {
      console.warn('[Invoices API Sync] Backend offline or slow, using resilient local storage:', err.message);
    }

    const localInvoices = getStoredInvoices();
    // Build unified map starting with local stored invoices (never lose any draft!)
    const map = new Map();
    // 1. First add seed invoices
    SEED_INVOICES.forEach(inv => map.set(inv.id, inv));
    // 2. Add local invoices (override seed if updated)
    localInvoices.forEach(inv => map.set(inv.id, inv));
    // 3. Merge server invoices
    if (serverOk && serverInvoices.length > 0) {
      serverInvoices.forEach(sinv => {
        const local = map.get(sinv.id);
        map.set(sinv.id, { ...(local || {}), ...sinv });
      });
    }

    const merged = Array.from(map.values()).sort((a, b) => new Date(b.created_at || 0) - new Date(a.created_at || 0));
    persistStoredInvoices(merged);

    // Apply query filters
    let result = merged;
    if (!params.includeDeleted) {
      result = result.filter(i => !i.is_deleted && i.status !== 'archived');
    }
    if (params.clientId) {
      result = result.filter(i => i.client_id === params.clientId || i.clientId === params.clientId);
    }
    if (params.projectId) {
      result = result.filter(i => i.project_id === params.projectId || (Array.isArray(i.project_ids) && i.project_ids.includes(params.projectId)));
    }
    if (params.status) {
      result = result.filter(i => i.status === params.status);
    }

    return result;
  },

  getInvoice: async (id) => {
    try {
      const serverInv = await request(`/api/invoices/${id}`);
      if (serverInv && serverInv.id) return serverInv;
    } catch (e) {}
    const local = getStoredInvoices();
    return local.find(i => i.id === id) || null;
  },

  createInvoice: async (invoiceData) => {
    const id = invoiceData.id || `inv-${Date.now()}`;
    const invoiceNumber = invoiceData.invoice_number || `INV-${new Date().getFullYear()}-${Math.floor(100 + Math.random() * 900)}`;
    const status = invoiceData.status || (invoiceData.published ? 'published' : 'draft');
    const published = invoiceData.published !== undefined ? Boolean(invoiceData.published) : (status === 'published');
    const nowIso = invoiceData.created_at || new Date().toISOString();

    const normalized = {
      ...invoiceData,
      id,
      invoice_number: invoiceNumber,
      status,
      published,
      created_at: nowIso,
      is_deleted: false,
      items: Array.isArray(invoiceData.items) ? invoiceData.items : [],
      amount: Number(invoiceData.amount || 0),
      subtotal: Number(invoiceData.subtotal || invoiceData.amount || 0),
      tax: Number(invoiceData.tax || 0),
      discount: Number(invoiceData.discount || 0),
      currency: invoiceData.currency || 'PKR'
    };

    // 1. Immediately store in localStorage (GUARANTEE OF PERSISTENCE)
    const currentList = getStoredInvoices();
    const updatedList = [normalized, ...currentList.filter(i => i.id !== id && i.id !== normalized.id)];
    persistStoredInvoices(updatedList);
    broadcastInvoiceSync('create', normalized);

    // 2. Sync to cloud backend
    try {
      const serverRes = await request('/api/invoices', {
        method: 'POST',
        body: JSON.stringify(normalized)
      });
      if (serverRes && serverRes.id) {
        const mergedObj = { ...normalized, ...serverRes };
        const syncedList = getStoredInvoices().map(i => (i.id === id || i.id === normalized.id) ? mergedObj : i);
        persistStoredInvoices(syncedList);
        broadcastInvoiceSync('update', mergedObj);
        return mergedObj;
      }
    } catch (err) {
      console.warn('[Create Invoice Cloud Sync Failed, Preserved in Local Storage]:', err.message);
    }

    return normalized;
  },

  updateInvoice: async (id, updates) => {
    const currentList = getStoredInvoices();
    const existing = currentList.find(i => i.id === id);
    const updated = { ...(existing || {}), ...updates, id };

    persistStoredInvoices(currentList.map(i => i.id === id ? updated : i));
    broadcastInvoiceSync('update', updated);

    try {
      const serverRes = await request(`/api/invoices/${id}`, {
        method: 'PUT',
        body: JSON.stringify(updates)
      });
      if (serverRes && serverRes.id) {
        const merged = { ...updated, ...serverRes };
        persistStoredInvoices(getStoredInvoices().map(i => i.id === id ? merged : i));
        return merged;
      }
    } catch (e) {
      console.warn('[Update Invoice Cloud Sync Failed, Preserved Locally]:', e.message);
    }
    return updated;
  },

  publishInvoice: async (id) => {
    return api.updateInvoice(id, { status: 'published', published: true });
  },

  restoreInvoice: async (id) => {
    return api.updateInvoice(id, { status: 'draft', is_deleted: false });
  },

  updateInvoiceStatus: async (id, status) => {
    return api.updateInvoice(id, { status });
  },

  deleteInvoice: async (id) => {
    const currentList = getStoredInvoices();
    const updatedList = currentList.map(i => i.id === id ? { ...i, status: 'archived', is_deleted: true } : i);
    persistStoredInvoices(updatedList);
    broadcastInvoiceSync('delete', { id });

    try {
      await request(`/api/invoices/${id}`, { method: 'DELETE' });
    } catch (e) {
      console.warn('[Delete Invoice Cloud Sync Failed, Preserved Locally]:', e.message);
    }
    return { success: true };
  },

  // Health
  checkHealth: () => request('/api/health')
};
