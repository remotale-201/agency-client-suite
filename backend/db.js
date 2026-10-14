const fs = require('fs');
const path = require('path');
const { Pool } = require('pg');
require('dotenv').config();

const DATA_DIR = path.join(__dirname, 'data');
const STORE_PATH = path.join(DATA_DIR, 'store.json');

const INITIAL_DATA = {
  settings: {
    agencyName: "Vanguard Creative Studio",
    tagline: "High-Performance Digital Products & Design",
    currency: "$",
    ownerEmail: "owner@vanguardstudio.agency",
    ownerName: "Alexander Vance",
    supportWhatsapp: "+1 (800) 555-0199"
  },
  clients: [
    {
      id: "client-1",
      name: "Sarah Jenkins",
      company: "FinFlow Technologies",
      email: "sarah@finflow.io",
      phone: "+1 (415) 890-2341",
      portalToken: "finflow-access",
      avatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150&auto=format&fit=crop&q=80",
      createdAt: "2026-08-15T10:00:00Z"
    },
    {
      id: "client-2",
      name: "Dr. Marcus Vance",
      company: "Lumina Health & Wellness",
      email: "marcus@luminahealth.co",
      phone: "+1 (212) 670-9943",
      portalToken: "lumina-access",
      avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80",
      createdAt: "2026-08-20T12:00:00Z"
    },
    {
      id: "client-3",
      name: "Elena Rostova",
      company: "Nexus AI Cloud",
      email: "elena@nexusai.cloud",
      phone: "+44 20 7946 0192",
      portalToken: "nexus-access",
      avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80",
      createdAt: "2026-09-01T09:30:00Z"
    }
  ],
  projects: [
    {
      id: "proj-1",
      clientId: "client-1",
      title: "FinFlow iOS & Android Mobile Banking App",
      description: "High-converting fintech native app UI/UX, micro-interactions, biometric login flow, and card transaction dashboard.",
      budget: 18500,
      currency: "$",
      status: "in-progress",
      progress: 75,
      priority: "high",
      deadline: "2026-10-25",
      deliverables: [
        { id: "d1", title: "Wireframes & UX Architecture", completed: true },
        { id: "d2", title: "Figma High-Fidelity UI Kit", completed: true },
        { id: "d3", title: "React Native Component System", completed: true },
        { id: "d4", title: "API Integration & Staging QA", completed: false },
        { id: "d5", title: "App Store & Play Store Assets", completed: false }
      ],
      links: {
        figma: "https://figma.com/@finflow-app-v2",
        staging: "https://staging.finflow.app",
        drive: "https://drive.google.com/drive/folders/finflow-assets"
      },
      createdAt: "2026-08-25T14:00:00Z",
      updatedAt: "2026-10-10T16:20:00Z"
    },
    {
      id: "proj-2",
      clientId: "client-1",
      title: "FinFlow Brand Identity & Design System",
      description: "Comprehensive branding, logo vector marks, color system, typography scale, and marketing deck guidelines.",
      budget: 6500,
      currency: "$",
      status: "completed",
      progress: 100,
      priority: "normal",
      deadline: "2026-10-05",
      deliverables: [
        { id: "d1", title: "Brand Discovery & Moodboards", completed: true },
        { id: "d2", title: "Primary & Secondary Logo Marks", completed: true },
        { id: "d3", title: "Color Tokens & Typography Kit", completed: true },
        { id: "d4", title: "Export Package (.SVG, .AI, .PNG)", completed: true }
      ],
      links: {
        figma: "https://figma.com/@finflow-brand",
        staging: "https://brand.finflow.app",
        drive: "https://drive.google.com/drive/folders/finflow-brand-assets"
      },
      createdAt: "2026-08-16T11:00:00Z",
      updatedAt: "2026-10-05T18:00:00Z"
    },
    {
      id: "proj-3",
      clientId: "client-2",
      title: "Lumina Telehealth Web Platform",
      description: "Doctor consultation portal, encrypted video room UI, prescription management, and patient EHR dashboard.",
      budget: 24000,
      currency: "$",
      status: "under-review",
      progress: 92,
      priority: "critical",
      deadline: "2026-10-20",
      deliverables: [
        { id: "d1", title: "Patient Onboarding & Triage Flow", completed: true },
        { id: "d2", title: "Doctor Telehealth Schedule Matrix", completed: true },
        { id: "d3", title: "Live Video Consultation UI", completed: true },
        { id: "d4", title: "Prescription Generator & Pharmacy API", completed: true },
        { id: "d5", title: "Compliance & Security Audit Review", completed: false }
      ],
      links: {
        figma: "https://figma.com/@lumina-telehealth",
        staging: "https://telehealth-qa.luminahealth.co",
        drive: "https://drive.google.com/drive/folders/lumina-docs"
      },
      createdAt: "2026-08-22T08:30:00Z",
      updatedAt: "2026-10-11T09:45:00Z"
    },
    {
      id: "proj-4",
      clientId: "client-2",
      title: "Lumina Patient Mobile Portal v2",
      description: "Mobile-first responsive web and PWA for patient appointment booking, lab results viewer, and medication reminders.",
      budget: 14000,
      currency: "$",
      status: "in-progress",
      progress: 45,
      priority: "high",
      deadline: "2026-11-12",
      deliverables: [
        { id: "d1", title: "Appointment Booking UX Flow", completed: true },
        { id: "d2", title: "Lab Results Interactive Visualizer", completed: true },
        { id: "d3", title: "SMS & Push Notification Gateway", completed: false },
        { id: "d4", title: "Multi-language (EN/ES) Localization", completed: false }
      ],
      links: {
        figma: "https://figma.com/@lumina-patient-v2",
        staging: "https://patient-staging.luminahealth.co",
        drive: "https://drive.google.com/drive/folders/lumina-assets"
      },
      createdAt: "2026-09-05T15:10:00Z",
      updatedAt: "2026-10-09T14:15:00Z"
    },
    {
      id: "proj-5",
      clientId: "client-3",
      title: "Nexus AI 3D Landing Page & WebGL Experience",
      description: "Award-winning interactive 3D hero with Three.js, dark cyberpunk aesthetics, and smooth scroll product storytelling.",
      budget: 9800,
      currency: "$",
      status: "completed",
      progress: 100,
      priority: "normal",
      deadline: "2026-10-02",
      deliverables: [
        { id: "d1", title: "3D Neural Network Shaders", completed: true },
        { id: "d2", title: "Interactive Particle Canvas", completed: true },
        { id: "d3", title: "Responsive Layout (Desktop & Mobile 60fps)", completed: true },
        { id: "d4", title: "Vercel Edge CDN Deployment", completed: true }
      ],
      links: {
        figma: "https://figma.com/@nexus-landing",
        staging: "https://nexusai.cloud",
        drive: "https://drive.google.com/drive/folders/nexus-3d-renders"
      },
      createdAt: "2026-09-02T10:00:00Z",
      updatedAt: "2026-10-02T17:30:00Z"
    },
    {
      id: "proj-6",
      clientId: "client-3",
      title: "Nexus AI Analytics & Prompt Studio Dashboard",
      description: "Real-time token usage telemetry charts, multi-model evaluation playground, and API key vault.",
      budget: 16200,
      currency: "$",
      status: "pending",
      progress: 15,
      priority: "normal",
      deadline: "2026-11-30",
      deliverables: [
        { id: "d1", title: "Information Architecture & Personas", completed: true },
        { id: "d2", title: "Prompt Playground UX Mockups", completed: false },
        { id: "d3", title: "Interactive Token Telemetry Views", completed: false },
        { id: "d4", title: "Team RBAC & Billing Limits Module", completed: false }
      ],
      links: {
        figma: "https://figma.com/@nexus-studio",
        staging: "https://dev-studio.nexusai.cloud",
        drive: "https://drive.google.com/drive/folders/nexus-specifications"
      },
      createdAt: "2026-09-18T13:40:00Z",
      updatedAt: "2026-10-08T11:00:00Z"
    }
  ],
  notepads: {
    "proj-1": {
      content: `### Client Notepad: FinFlow Mobile Banking
**Client Direct Notes & Requests:**
1. Transaction history list should feature instantaneous search and merchant category filtering.
2. Ensure biometrics fallback to 6-digit numeric PIN on iOS & Android.
3. Dark mode theme must match OLED true black (#000000).

**Latest Feedback (Sarah):**
- Push notification toggle in Settings works great.
- Waiting on the final export of SVG illustration icons for the KYC step.`,
      updatedAt: "2026-10-10T16:20:00Z",
      lastUpdatedBy: "Sarah Jenkins (FinFlow)"
    },
    "proj-2": {
      content: `### Brand Guidelines Sign-Off
All vector logo packages (.SVG, .EPS, .AI, .PNG transparent) received and approved by FinFlow executive board.
Color codes finalized:
- Primary: #4F46E5 (Indigo 600)
- Accent: #06B6D4 (Cyan 500)
- Neutral Dark: #0F172A (Slate 900)`,
      updatedAt: "2026-10-05T18:00:00Z",
      lastUpdatedBy: "Agency Admin"
    },
    "proj-3": {
      content: `### Telehealth Security & Compliance Directives
**URGENT Requirements from Dr. Marcus Vance:**
1. Video stream signaling must use WebRTC SRTP encryption.
2. Patient session auto-timeout after 15 minutes of inactivity for HIPAA standards.
3. Prescription download PDF must include digital physician stamp and watermark.
4. Immediate priority: Please resolve the patient timezone discrepancy in the booking slot picker.`,
      updatedAt: "2026-10-11T09:45:00Z",
      lastUpdatedBy: "Dr. Marcus Vance (Lumina)"
    },
    "proj-4": {
      content: `### Lumina Patient Portal v2 Notes
- Target launch: Mid-November.
- Multi-language support (English and Spanish) required for 100% of labels.
- Lab result charts should render smoothly on iPhone SE and smaller screens.`,
      updatedAt: "2026-10-09T14:15:00Z",
      lastUpdatedBy: "Dr. Marcus Vance (Lumina)"
    },
    "proj-5": {
      content: `### Nexus AI 3D Landing Page
- Production live on Vercel Edge.
- Lighthouse performance score: 98/100.
- 3D Spline canvas loads under 600ms. Client gave 5-star review!`,
      updatedAt: "2026-10-02T17:30:00Z",
      lastUpdatedBy: "Elena Rostova (Nexus AI)"
    },
    "proj-6": {
      content: `### Analytics Studio Initial Discovery
- Elena requested support for streaming responses in the playground.
- HighCharts or Recharts components should have customized obsidian dark styling.
- Meeting scheduled for next Wednesday for Wireframe signoff.`,
      updatedAt: "2026-10-08T11:00:00Z",
      lastUpdatedBy: "Elena Rostova (Nexus AI)"
    }
  },
  changes: [
    {
      id: "ch-1",
      projectId: "proj-3",
      clientId: "client-2",
      clientName: "Dr. Marcus Vance",
      companyName: "Lumina Health & Wellness",
      projectTitle: "Lumina Telehealth Web Platform",
      title: "Fix patient timezone mismatch in doctor appointment slot selector",
      description: "When patients in PST book with doctors in EST, the slot displays local doctor hours instead of converting to patient's local timezone. Needs immediate correction before Monday clinical pilot.",
      urgency: "critical", // critical, high, normal, low
      deadline: "2026-10-11", // Due Today!
      status: "in-progress", // pending, in-review, in-progress, completed
      resolutionNote: "Engineer assigned; fixing UTC offset parser in booking modal.",
      requestedBy: "Dr. Marcus Vance",
      createdAt: "2026-10-10T08:30:00Z",
      updatedAt: "2026-10-10T11:00:00Z"
    },
    {
      id: "ch-2",
      projectId: "proj-1",
      clientId: "client-1",
      clientName: "Sarah Jenkins",
      companyName: "FinFlow Technologies",
      projectTitle: "FinFlow iOS & Android Mobile Banking App",
      title: "Add biometric FaceID quick-toggle on startup screen",
      description: "Add an option in security settings to bypass PIN if biometric auth is successful, with smooth haptic feedback.",
      urgency: "high",
      deadline: "2026-10-16", // Due This Week!
      status: "in-review",
      resolutionNote: "UI mockups ready in Figma, awaiting engineering review.",
      requestedBy: "Sarah Jenkins",
      createdAt: "2026-10-09T14:10:00Z",
      updatedAt: "2026-10-10T09:15:00Z"
    },
    {
      id: "ch-3",
      projectId: "proj-1",
      clientId: "client-1",
      clientName: "Sarah Jenkins",
      companyName: "FinFlow Technologies",
      projectTitle: "FinFlow iOS & Android Mobile Banking App",
      title: "Update transaction receipt PDF generator layout",
      description: "Receipt PDF should include the sender bank routing code and QR code for instant verification.",
      urgency: "normal",
      deadline: "2026-10-22",
      status: "pending",
      resolutionNote: "",
      requestedBy: "Sarah Jenkins",
      createdAt: "2026-10-08T16:45:00Z",
      updatedAt: "2026-10-08T16:45:00Z"
    },
    {
      id: "ch-4",
      projectId: "proj-3",
      clientId: "client-2",
      clientName: "Dr. Marcus Vance",
      companyName: "Lumina Health & Wellness",
      projectTitle: "Lumina Telehealth Web Platform",
      title: "Add prescription direct download button in patient chat",
      description: "Physicians need to attach prescription directly into the consultation chat window with 1 click.",
      urgency: "high",
      deadline: "2026-10-14", // Due This Week!
      status: "pending",
      resolutionNote: "",
      requestedBy: "Dr. Marcus Vance",
      createdAt: "2026-10-11T09:00:00Z",
      updatedAt: "2026-10-11T09:00:00Z"
    },
    {
      id: "ch-5",
      projectId: "proj-4",
      clientId: "client-2",
      clientName: "Dr. Marcus Vance",
      companyName: "Lumina Health & Wellness",
      projectTitle: "Lumina Patient Mobile Portal v2",
      title: "Refine Spanish language copy for lab results disclaimer",
      description: "Replace medical terminology translation on blood chemistry panel with certified copy provided in Drive.",
      urgency: "low",
      deadline: "2026-10-28",
      status: "completed",
      resolutionNote: "Updated i18n json dictionaries with certified translation.",
      requestedBy: "Dr. Marcus Vance",
      createdAt: "2026-10-07T11:20:00Z",
      updatedAt: "2026-10-09T14:15:00Z"
    }
  ],
  points: {
    "proj-1": [
      { id: "pt-1", text: "Biometric FaceID fallback to 6-digit numeric PIN on iOS & Android.", completed: true, createdBy: "Sarah Jenkins", createdAt: "2026-10-09" },
      { id: "pt-2", text: "Add instant search and merchant category filter in transaction history.", completed: false, createdBy: "Sarah Jenkins", createdAt: "2026-10-10" },
      { id: "pt-3", text: "Ensure AMOLED true black #000000 background on checkout confirmation.", completed: false, createdBy: "Sarah Jenkins", createdAt: "2026-10-11" }
    ],
    "proj-3": [
      { id: "pt-4", text: "Timezone offset must dynamically calculate patient local time.", completed: false, createdBy: "Dr. Marcus Vance", createdAt: "2026-10-11" },
      { id: "pt-5", text: "PDF download for prescriptions must include official digital stamp.", completed: false, createdBy: "Dr. Marcus Vance", createdAt: "2026-10-11" },
      { id: "pt-6", text: "Resolve video chat echo cancellation on Safari mobile.", completed: false, createdBy: "Dr. Marcus Vance", createdAt: "2026-10-11" }
    ],
    "proj-4": [
      { id: "pt-7", text: "Spanish language translations for laboratory blood panels approved.", completed: true, createdBy: "Dr. Marcus Vance", createdAt: "2026-10-08" },
      { id: "pt-8", text: "Appointment calendar picker needs to block national holidays.", completed: false, createdBy: "Dr. Marcus Vance", createdAt: "2026-10-11" }
    ]
  }
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

    // Prevent process exit on idle client drops from serverless PostgreSQL (e.g. Neon)
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
    return JSON.parse(raw);
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
        console.log('[Neon DB] Tables initialized and seeded with agency data.');
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
        if (res.rows.length > 0) return res.rows[0].value;
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

  async getSettings() {
    const data = await this.getAllData();
    return data.settings;
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

    // Deadlines calculations (Today & This Week)
    // Dynamic reference: 2026-10-11 or current system date
    const todayStr = "2026-10-11";
    const refDate = new Date(todayStr);
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
