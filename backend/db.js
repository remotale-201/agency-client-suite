const fs = require('fs');
const path = require('path');
const { Pool } = require('pg');
require('dotenv').config();

const DATA_DIR = path.join(__dirname, 'data');
const STORE_PATH = path.join(DATA_DIR, 'store.json');

const INITIAL_DATA = {
  settings: {
    agencyName: "ByteForge Studio",
    tagline: "High-Performance Digital Products & Design",
    currency: "$",
    ownerEmail: "byteforgeofficial.store@gmail.com",
    ownerName: "ByteForge Admin",
    supportWhatsapp: ""
  },
  admin: {
    email: "byteforgeofficial.store@gmail.com",
    password: "Agbs1222",
    name: "ByteForge Admin"
  },
  clients: [],
  projects: [],
  notepads: {},
  changes: [],
  points: {}
};

// Check if Neon / PostgreSQL URL is supplied
const isPostgres = Boolean(process.env.DATABASE_URL);
let pgPool = null;

if (isPostgres) {
  try {
    pgPool = new Pool({
      connectionString: process.env.DATABASE_URL,
      ssl: { rejectUnauthorized: false }
    });

    // Prevent process exit on idle client drops from serverless PostgreSQL
    pgPool.on('error', (err) => {
      console.error('[Neon DB Pool Error] Unexpected idle client disconnect:', err.message);
    });

    console.log('[Database] Configured Neon PostgreSQL pool.');
  } catch (err) {
    console.error('[Database] Failed to initialize Neon PostgreSQL pool, falling back to local store:', err.message);
  }
}

// Local store helpers
function ensureLocalStore() {
  if (!fs.existsSync(DATA_DIR)) {
    fs.mkdirSync(DATA_DIR, { recursive: true });
  }
  if (!fs.existsSync(STORE_PATH)) {
    fs.writeFileSync(STORE_PATH, JSON.stringify(INITIAL_DATA, null, 2), 'utf-8');
  }
}

function readLocalStore() {
  ensureLocalStore();
  try {
    const raw = fs.readFileSync(STORE_PATH, 'utf-8');
    const parsed = JSON.parse(raw);
    // Ensure admin credentials always exist
    if (!parsed.admin) {
      parsed.admin = INITIAL_DATA.admin;
    }
    return parsed;
  } catch (err) {
    console.error('[Database] Error reading local store, resetting:', err.message);
    fs.writeFileSync(STORE_PATH, JSON.stringify(INITIAL_DATA, null, 2), 'utf-8');
    return INITIAL_DATA;
  }
}

function writeLocalStore(data) {
  ensureLocalStore();
  fs.writeFileSync(STORE_PATH, JSON.stringify(data, null, 2), 'utf-8');
}

// Neon Postgres Table Initializer (runs when DATABASE_URL is set)
async function initPostgresTables() {
  if (!pgPool) return;
  try {
    const client = await pgPool.connect();
    try {
      await client.query(`
        CREATE TABLE IF NOT EXISTS agency_meta (
          key VARCHAR(100) PRIMARY KEY,
          value JSONB NOT NULL
        );
      `);
      // Check if seeded
      const check = await client.query('SELECT value FROM agency_meta WHERE key = $1', ['store']);
      if (check.rows.length === 0) {
        await client.query('INSERT INTO agency_meta (key, value) VALUES ($1, $2)', ['store', JSON.stringify(INITIAL_DATA)]);
        console.log('[Neon DB] Tables initialized and seeded with clean agency data.');
      } else {
        // Ensure admin credentials exist in DB store
        const current = check.rows[0].value;
        if (!current.admin || current.admin.email !== INITIAL_DATA.admin.email) {
          current.admin = INITIAL_DATA.admin;
          await client.query('UPDATE agency_meta SET value = $1 WHERE key = $2', [JSON.stringify(current), 'store']);
        }
      }
    } finally {
      client.release();
    }
  } catch (err) {
    console.error('[Neon DB] Initialization error:', err.message);
  }
}

let initPromise = null;

if (isPostgres && pgPool) {
  initPromise = initPostgresTables();
}

// Generic Store Access API
const db = {
  getDriver: () => (isPostgres && pgPool ? 'neon-postgres' : 'local-persistent'),

  async getAllData() {
    if (initPromise) {
      await initPromise;
    }
    if (isPostgres && pgPool) {
      try {
        const res = await pgPool.query('SELECT value FROM agency_meta WHERE key = $1', ['store']);
        if (res.rows.length > 0) {
          const val = res.rows[0].value;
          if (!val.admin) val.admin = INITIAL_DATA.admin;
          return val;
        }
      } catch (err) {
        console.error('[Neon DB] Read error, fallback to local:', err.message);
      }
    }
    return readLocalStore();
  },

  async saveAllData(data) {
    if (initPromise) {
      await initPromise;
    }
    if (isPostgres && pgPool) {
      try {
        await pgPool.query(
          'INSERT INTO agency_meta (key, value) VALUES ($1, $2) ON CONFLICT (key) DO UPDATE SET value = $2',
          ['store', JSON.stringify(data)]
        );
      } catch (err) {
        console.error('[Neon DB] Write error, fallback to local:', err.message);
      }
    }
    writeLocalStore(data);
  },

  async resetDatabase() {
    await this.saveAllData(INITIAL_DATA);
    return INITIAL_DATA;
  },

  async authenticate(identifier, password) {
    const data = await this.getAllData();
    const cleanId = (identifier || '').trim().toLowerCase();
    const cleanPw = (password || '').trim();

    // 1. Check Admin Account (ByteForge Admin)
    const admin = data.admin || INITIAL_DATA.admin;
    if (cleanId === admin.email.toLowerCase() && cleanPw === admin.password) {
      return {
        type: 'admin',
        id: 'admin',
        email: admin.email,
        name: admin.name || 'ByteForge Admin',
        role: 'Administrator'
      };
    }

    // 2. Check Client Portals
    const clients = data.clients || [];
    const client = clients.find(c => 
      (c.email && c.email.toLowerCase() === cleanId) ||
      (c.portalToken && c.portalToken.toLowerCase() === cleanId) ||
      (c.id && c.id.toLowerCase() === cleanId)
    );

    if (client) {
      // Validate password (or if client has no password, match their portalToken)
      const expectedPassword = client.password || client.portalToken;
      if (cleanPw === expectedPassword) {
        return {
          type: 'client',
          id: client.id,
          name: client.name,
          company: client.company,
          email: client.email,
          portalToken: client.portalToken,
          role: 'Client'
        };
      }
    }

    return null;
  },

  async getSettings() {
    const data = await this.getAllData();
    return data.settings || INITIAL_DATA.settings;
  },

  async updateSettings(settingsUpdate) {
    const data = await this.getAllData();
    data.settings = { ...data.settings, ...settingsUpdate };
    await this.saveAllData(data);
    return data.settings;
  },

  async getClients() {
    const data = await this.getAllData();
    return data.clients || [];
  },

  async getClientById(clientId) {
    const data = await this.getAllData();
    return (data.clients || []).find(c => c.id === clientId || c.portalToken === clientId);
  },

  async addClient(clientObj) {
    const data = await this.getAllData();
    data.clients = data.clients || [];
    data.clients.push(clientObj);
    await this.saveAllData(data);
    return clientObj;
  },

  async deleteClient(clientId) {
    const data = await this.getAllData();
    data.clients = (data.clients || []).filter(c => c.id !== clientId);
    // Remove associated projects
    const removedProjects = (data.projects || []).filter(p => p.clientId === clientId).map(p => p.id);
    data.projects = (data.projects || []).filter(p => p.clientId !== clientId);
    // Remove notepads and points
    removedProjects.forEach(pId => {
      if (data.notepads && data.notepads[pId]) delete data.notepads[pId];
      if (data.points && data.points[pId]) delete data.points[pId];
    });
    // Remove changes
    data.changes = (data.changes || []).filter(c => c.clientId !== clientId);
    await this.saveAllData(data);
    return true;
  },

  async getProjects(clientId) {
    const data = await this.getAllData();
    let projs = data.projects || [];
    if (clientId) {
      projs = projs.filter(p => p.clientId === clientId);
    }
    return projs;
  },

  async getProjectById(projectId) {
    const data = await this.getAllData();
    return (data.projects || []).find(p => p.id === projectId);
  },

  async addProject(projectObj) {
    const data = await this.getAllData();
    data.projects = data.projects || [];
    data.projects.push(projectObj);
    data.notepads = data.notepads || {};
    data.notepads[projectObj.id] = {
      content: `### Project Notepad: ${projectObj.title}\n- Initial requirements logged.\n- Feel free to note revisions or comments here.`,
      updatedAt: new Date().toISOString(),
      lastUpdatedBy: "Agency System"
    };
    await this.saveAllData(data);
    return projectObj;
  },

  async updateProject(projectId, updates) {
    const data = await this.getAllData();
    const index = (data.projects || []).findIndex(p => p.id === projectId);
    if (index === -1) return null;
    data.projects[index] = { ...data.projects[index], ...updates, updatedAt: new Date().toISOString() };
    await this.saveAllData(data);
    return data.projects[index];
  },

  async deleteProject(projectId) {
    const data = await this.getAllData();
    data.projects = (data.projects || []).filter(p => p.id !== projectId);
    if (data.notepads && data.notepads[projectId]) {
      delete data.notepads[projectId];
    }
    if (data.points && data.points[projectId]) {
      delete data.points[projectId];
    }
    data.changes = (data.changes || []).filter(c => c.projectId !== projectId);
    await this.saveAllData(data);
    return true;
  },

  async getNotepad(projectId) {
    const data = await this.getAllData();
    return (data.notepads && data.notepads[projectId]) || {
      content: "",
      updatedAt: new Date().toISOString(),
      lastUpdatedBy: "Not set"
    };
  },

  async updateNotepad(projectId, content, updatedBy = "User") {
    const data = await this.getAllData();
    data.notepads = data.notepads || {};
    const entry = {
      content,
      updatedAt: new Date().toISOString(),
      lastUpdatedBy: updatedBy
    };
    data.notepads[projectId] = entry;
    await this.saveAllData(data);
    return entry;
  },

  async getChanges(filter = {}) {
    const data = await this.getAllData();
    let list = data.changes || [];
    if (filter.projectId) {
      list = list.filter(c => c.projectId === filter.projectId);
    }
    if (filter.clientId) {
      list = list.filter(c => c.clientId === filter.clientId);
    }
    if (filter.urgency) {
      list = list.filter(c => c.urgency === filter.urgency);
    }
    if (filter.status) {
      list = list.filter(c => c.status === filter.status);
    }
    return list;
  },

  async addChange(changeObj) {
    const data = await this.getAllData();
    data.changes = data.changes || [];
    data.changes.unshift(changeObj); // latest first
    await this.saveAllData(data);
    return changeObj;
  },

  async updateChangeStatus(changeId, status, resolutionNote) {
    const data = await this.getAllData();
    const index = (data.changes || []).findIndex(c => c.id === changeId);
    if (index === -1) return null;
    data.changes[index].status = status;
    if (resolutionNote !== undefined) {
      data.changes[index].resolutionNote = resolutionNote;
    }
    data.changes[index].updatedAt = new Date().toISOString();
    await this.saveAllData(data);
    return data.changes[index];
  },

  async deleteChange(changeId) {
    const data = await this.getAllData();
    data.changes = (data.changes || []).filter(c => c.id !== changeId);
    await this.saveAllData(data);
    return true;
  },

  async getPoints(projectId) {
    const data = await this.getAllData();
    data.points = data.points || {};
    return data.points[projectId] || [];
  },

  async addPoint(projectId, text, createdBy = "Client") {
    const data = await this.getAllData();
    data.points = data.points || {};
    data.points[projectId] = data.points[projectId] || [];
    const newPoint = {
      id: `pt-${Date.now()}-${Math.floor(Math.random() * 1000)}`,
      text,
      completed: false,
      createdBy,
      createdAt: new Date().toISOString().split('T')[0]
    };
    data.points[projectId].push(newPoint);
    await this.saveAllData(data);
    return newPoint;
  },

  async togglePoint(projectId, pointId, completed) {
    const data = await this.getAllData();
    data.points = data.points || {};
    const list = data.points[projectId] || [];
    const idx = list.findIndex(p => p.id === pointId);
    if (idx === -1) return null;
    list[idx].completed = completed !== undefined ? completed : !list[idx].completed;
    await this.saveAllData(data);
    return list[idx];
  },

  async deletePoint(projectId, pointId) {
    const data = await this.getAllData();
    data.points = data.points || {};
    if (data.points[projectId]) {
      data.points[projectId] = data.points[projectId].filter(p => p.id !== pointId);
      await this.saveAllData(data);
    }
    return true;
  },

  async getStats() {
    const data = await this.getAllData();
    const projects = data.projects || [];
    const changes = data.changes || [];
    const clients = data.clients || [];

    const totalRevenue = projects.reduce((sum, p) => sum + (Number(p.budget) || 0), 0);
    const completedProjects = projects.filter(p => p.status === 'completed').length;
    const inProgressProjects = projects.filter(p => p.status === 'in-progress').length;
    const underReviewProjects = projects.filter(p => p.status === 'under-review').length;
    const pendingProjects = projects.filter(p => p.status === 'pending').length;

    const totalChanges = changes.length;
    const openChanges = changes.filter(c => c.status !== 'completed').length;
    const criticalChanges = changes.filter(c => c.urgency === 'critical' && c.status !== 'completed').length;
    const highUrgencyChanges = changes.filter(c => c.urgency === 'high' && c.status !== 'completed').length;

    const todayStr = new Date().toISOString().split('T')[0];
    const refDate = new Date();
    const next7Days = new Date(refDate.getTime() + 7 * 24 * 60 * 60 * 1000);

    const allDeadlines = [
      ...projects.map(p => {
        const cl = clients.find(c => c.id === p.clientId);
        return {
          id: p.id,
          type: 'Project Milestone',
          title: p.title,
          companyName: cl ? cl.company : 'Client',
          deadline: p.deadline,
          status: p.status,
          projectId: p.id,
          urgency: p.priority || 'normal'
        };
      }),
      ...changes.map(c => ({
        id: c.id,
        type: 'Revision Request',
        title: c.title,
        companyName: c.companyName || 'Client',
        deadline: c.deadline,
        status: c.status,
        projectId: c.projectId,
        urgency: c.urgency
      }))
    ].filter(item => item.deadline && item.status !== 'completed');

    const todayItems = allDeadlines.filter(item => item.deadline === todayStr);
    const thisWeekItems = allDeadlines.filter(item => {
      const d = new Date(item.deadline);
      return d >= refDate && d <= next7Days;
    });

    return {
      totalRevenue,
      currency: data.settings?.currency || "$",
      totalProjects: projects.length,
      completedProjects,
      inProgressProjects,
      underReviewProjects,
      pendingProjects,
      totalClients: clients.length,
      totalChanges,
      openChanges,
      criticalChanges,
      highUrgencyChanges,
      deadlinesToday: todayItems.length,
      deadlinesThisWeek: thisWeekItems.length,
      todayItems,
      thisWeekItems
    };
  }
};

module.exports = db;
