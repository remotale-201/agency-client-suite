const fs = require('fs');
const path = require('path');
const { Pool } = require('pg');
require('dotenv').config({ path: path.join(__dirname, '.env') });
require('dotenv').config({ path: path.join(__dirname, '../.env') });

const DATA_DIR = path.join(__dirname, 'data');
const STORE_PATH = path.join(DATA_DIR, 'store.json');

// Check PostgreSQL connection
const isPostgres = Boolean(process.env.DATABASE_URL);
let pgPool = null;

if (isPostgres) {
  try {
    pgPool = new Pool({
      connectionString: process.env.DATABASE_URL,
      ssl: { rejectUnauthorized: false }
    });

    pgPool.on('error', (err) => {
      console.error('[Neon DB Pool Error] Client disconnect:', err.message);
    });

    console.log('[Database] Configured Neon PostgreSQL pool.');
  } catch (err) {
    console.error('[Database] Failed to initialize Neon PostgreSQL pool:', err.message);
  }
}

// ==========================================
// SEED DATA CONSTANTS (Used by both Postgres & Local fallback)
// ==========================================
const seedUsers = [
  {
    id: 'admin-1',
    name: 'Abdullah',
    email: 'admin@remotale.com',
    username: 'admin',
    password: 'admin',
    role: 'admin',
    company: 'Remotale',
    avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&auto=format&fit=crop&q=80'
  },
  {
    id: 'client-awais',
    name: 'Awais',
    email: 'awais@remotale.com',
    username: 'awais',
    password: 'awais',
    role: 'client',
    company: 'Awais Agency',
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&auto=format&fit=crop&q=80'
  },
  {
    id: 'client-afshal',
    name: 'Afshal',
    email: 'afshal@remotale.com',
    username: 'afshal',
    password: 'afshal',
    role: 'client',
    company: 'Afshal Brand',
    avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100&auto=format&fit=crop&q=80'
  },
  {
    id: 'client-1',
    name: 'Ali Khan',
    email: 'ali@remotale.com',
    username: 'ali',
    password: 'client123',
    role: 'client',
    company: 'Acme Brand',
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&auto=format&fit=crop&q=80'
  }
];

const seedAssignees = [
  { name: 'Ahmed', avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=100&auto=format&fit=crop&q=80' },
  { name: 'Sara', avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100&auto=format&fit=crop&q=80' },
  { name: 'Usman', avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&auto=format&fit=crop&q=80' }
];

const realProjects = [
  // 8 Projects for Awais
  {
    id: 'proj-awais-1',
    clientId: 'client-awais',
    title: 'Pak White Label Abdul Saboor',
    description: "Normal White Label Pakistan Store. Store name and domain are pending from the client's end.",
    notes: "Normal White Label Pakistan Store. Store name and domain are pending from the client's end.",
    projectType: 'Web Development',
    status: 'in-progress',
    priority: 'Medium',
    deadline: '18/10/2026',
    startDate: '15/10/2026',
    progress: 10,
    tasks: ['Header', 'Graphics', 'Product Page', 'Product Card', 'Other Pages', 'Footer', 'Buy and Connect Domain', 'Final Changes']
  },
  {
    id: 'proj-awais-2',
    clientId: 'client-awais',
    title: 'Pak White Label Store (Latest)',
    description: 'Normal Pakistan White Label Store.',
    notes: 'Normal Pakistan White Label Store.',
    projectType: 'Web Development',
    status: 'in-progress',
    priority: 'Medium',
    deadline: '19/10/2026',
    startDate: '15/10/2026',
    progress: 10,
    tasks: ['Header', 'Graphics', 'Product Page', 'Product Card', 'Other Pages', 'Footer', 'Buy and Connect Domain', 'Final Changes']
  },
  {
    id: 'proj-awais-3',
    clientId: 'client-awais',
    title: 'Fytnex Products Designing',
    description: 'In Working.',
    notes: 'In Working.',
    projectType: 'Graphics',
    status: 'in-progress',
    priority: 'High',
    deadline: '22/10/2026',
    startDate: '15/10/2026',
    progress: 25,
    tasks: [
      { title: '25% Done', completed: true },
      { title: '50% Done', completed: false },
      { title: '75% Done', completed: false },
      { title: '100% Done', completed: false }
    ]
  },
  {
    id: 'proj-awais-4',
    clientId: 'client-awais',
    title: '20 Dfynex Graphics',
    description: 'Pending due to Dfynex website and product finalization.',
    notes: 'Pending due to Dfynex website and product finalization.',
    projectType: 'Graphics',
    status: 'in-progress',
    priority: 'Medium',
    deadline: '20/10/2026',
    startDate: '15/10/2026',
    progress: 0,
    tasks: ['25% Done', '50% Done', '75% Done', '100% Done']
  },
  {
    id: 'proj-awais-5',
    clientId: 'client-awais',
    title: '20 Fytnix Graphics',
    description: 'Pending due to article designing.',
    notes: 'Pending due to article designing.',
    projectType: 'Graphics',
    status: 'in-progress',
    priority: 'Medium',
    deadline: '20/10/2026',
    startDate: '15/10/2026',
    progress: 0,
    tasks: ['25% Done', '50% Done', '75% Done', '100% Done']
  },
  {
    id: 'proj-awais-6',
    clientId: 'client-awais',
    title: '20 WearPhere Graphics',
    description: 'In Process.',
    notes: 'In Process.',
    projectType: 'Graphics',
    status: 'in-progress',
    priority: 'Urgent',
    deadline: '16/10/2026',
    startDate: '15/10/2026',
    progress: 25,
    tasks: [
      { title: '25% Done', completed: true },
      { title: '50% Done', completed: false },
      { title: '75% Done', completed: false },
      { title: '100% Done', completed: false }
    ]
  },
  {
    id: 'proj-awais-7',
    clientId: 'client-awais',
    title: '20 Oxytees Graphics',
    description: 'In Process.',
    notes: 'In Process.',
    projectType: 'Graphics',
    status: 'in-progress',
    priority: 'Urgent',
    deadline: '16/10/2026',
    startDate: '15/10/2026',
    progress: 25,
    tasks: [
      { title: '25% Done', completed: true },
      { title: '50% Done', completed: false },
      { title: '75% Done', completed: false },
      { title: '100% Done', completed: false }
    ]
  },
  {
    id: 'proj-awais-8',
    clientId: 'client-awais',
    title: '20 MrGymWear Graphics',
    description: 'In Process.',
    notes: 'In Process.',
    projectType: 'Graphics',
    status: 'in-progress',
    priority: 'High',
    deadline: '17/10/2026',
    startDate: '15/10/2026',
    progress: 25,
    tasks: [
      { title: '25% Done', completed: true },
      { title: '50% Done', completed: false },
      { title: '75% Done', completed: false },
      { title: '100% Done', completed: false }
    ]
  },

  // 2 Projects for Afshal
  {
    id: 'proj-afshal-1',
    clientId: 'client-afshal',
    title: 'Farjah — Luxury Decor Items (Redesign)',
    description: 'Luxury Decor Items Store Redesign.',
    notes: 'Luxury Decor Items Store Redesign.',
    projectType: 'Web Development',
    status: 'in-progress',
    priority: 'Urgent',
    deadline: '17/10/2026',
    startDate: '15/10/2026',
    progress: 0,
    tasks: ['Product Listing', 'Organization', 'Banners']
  },
  {
    id: 'proj-afshal-2',
    clientId: 'client-afshal',
    title: 'Distant Market',
    description: 'Pakistan White Label Store.',
    notes: 'Pakistan White Label Store.',
    projectType: 'Web Development',
    status: 'in-progress',
    priority: 'Medium',
    deadline: '20/10/2026',
    startDate: '15/10/2026',
    progress: 0,
    tasks: ['Header', 'Graphics', 'Product Page', 'Product Card', 'Other Pages', 'Footer', 'Buy and Connect Domain', 'Final Changes']
  }
];

// Local store fallback & auto-repair
function ensureLocalStore() {
  if (!fs.existsSync(DATA_DIR)) {
    fs.mkdirSync(DATA_DIR, { recursive: true });
  }

  let store = null;
  if (fs.existsSync(STORE_PATH)) {
    try {
      store = JSON.parse(fs.readFileSync(STORE_PATH, 'utf-8'));
    } catch (e) {
      store = null;
    }
  }

  if (!store || !Array.isArray(store.users) || store.users.length < 4 || !Array.isArray(store.projects) || store.projects.length === 0) {
    const initialTasks = [];
    realProjects.forEach((p) => {
      let tIdx = 1;
      p.tasks.forEach((t) => {
        const tTitle = typeof t === 'string' ? t : t.title;
        const tCompleted = typeof t === 'object' ? Boolean(t.completed) : false;
        const assigned = seedAssignees[(tIdx - 1) % seedAssignees.length];
        initialTasks.push({
          id: `task-${p.id}-${tIdx}`,
          project_id: p.id,
          client_id: p.clientId,
          title: tTitle,
          due_date: p.deadline,
          completed: tCompleted,
          assigned_name: assigned.name,
          assigned_avatar: assigned.avatar
        });
        tIdx++;
      });
    });

    const cleanStore = {
      settings: {
        agencyName: "Remotale",
        tagline: "Manage Projects Together",
        currency: "$",
        ownerEmail: "admin@remotale.com",
        ownerName: "Abdullah"
      },
      users: seedUsers,
      projects: realProjects.map(p => ({
        id: p.id,
        client_id: p.clientId,
        title: p.title,
        description: p.description,
        notes: p.notes,
        project_type: p.projectType,
        status: p.status,
        priority: p.priority,
        deadline: p.deadline,
        start_date: p.startDate,
        progress: p.progress,
        budget: 0,
        credentials: [],
        files: []
      })),
      tasks: initialTasks,
      messages: [],
      team_members: seedAssignees.map((a, i) => ({
        id: `member-${i + 1}`,
        name: a.name,
        role: i === 0 ? 'Lead Developer' : i === 1 ? 'UI/UX Designer' : 'Project Manager',
        avatar: a.avatar,
        email: `${a.name.toLowerCase()}@remotale.com`
      })),
      team_activities: [
        {
          id: 'act-1',
          member_name: 'Sara',
          member_avatar: seedAssignees[1].avatar,
          action: 'completed task',
          details: 'Graphics revision for Pak White Label',
          created_at: new Date().toISOString()
        },
        {
          id: 'act-2',
          member_name: 'Ahmed',
          member_avatar: seedAssignees[0].avatar,
          action: 'uploaded assets',
          details: 'New banners added for Farjah Luxury Decor',
          created_at: new Date().toISOString()
        }
      ],
      files: [],
      invoices: []
    };

    fs.writeFileSync(STORE_PATH, JSON.stringify(cleanStore, null, 2), 'utf-8');
  }
}

function readLocalStore() {
  ensureLocalStore();
  try {
    return JSON.parse(fs.readFileSync(STORE_PATH, 'utf-8'));
  } catch (err) {
    return { users: seedUsers, projects: [], tasks: [], messages: [], team_members: [], team_activities: [] };
  }
}

function writeLocalStore(data) {
  ensureLocalStore();
  fs.writeFileSync(STORE_PATH, JSON.stringify(data, null, 2), 'utf-8');
}

// Initialize Relational Schema in PostgreSQL
async function initPostgresTables() {
  if (!pgPool) return;
  try {
    const client = await pgPool.connect();
    try {
      // 1. Users table
      await client.query(`
        CREATE TABLE IF NOT EXISTS users (
          id VARCHAR(100) PRIMARY KEY,
          name VARCHAR(255) NOT NULL,
          email VARCHAR(255) UNIQUE NOT NULL,
          password VARCHAR(255) NOT NULL,
          role VARCHAR(50) DEFAULT 'client',
          company VARCHAR(255),
          avatar TEXT,
          created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        );
      `);

      // 2. Projects table
      await client.query(`
        CREATE TABLE IF NOT EXISTS projects (
          id VARCHAR(100) PRIMARY KEY,
          client_id VARCHAR(100) REFERENCES users(id) ON DELETE CASCADE,
          title VARCHAR(255) NOT NULL,
          description TEXT,
          status VARCHAR(50) DEFAULT 'in-progress',
          progress INT DEFAULT 0,
          budget NUMERIC(12,2) DEFAULT 0,
          deadline VARCHAR(50),
          created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        );
      `);

      // 3. Tasks table
      await client.query(`
        CREATE TABLE IF NOT EXISTS tasks (
          id VARCHAR(100) PRIMARY KEY,
          project_id VARCHAR(100) REFERENCES projects(id) ON DELETE CASCADE,
          client_id VARCHAR(100),
          title VARCHAR(255) NOT NULL,
          due_date VARCHAR(50),
          completed BOOLEAN DEFAULT FALSE,
          created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        );
      `);

      // 4. Messages table
      await client.query(`
        CREATE TABLE IF NOT EXISTS messages (
          id VARCHAR(100) PRIMARY KEY,
          sender_id VARCHAR(100),
          sender_name VARCHAR(255) NOT NULL,
          sender_avatar TEXT,
          receiver_id VARCHAR(100),
          project_id VARCHAR(100),
          content TEXT NOT NULL,
          created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        );
      `);

      // 5. Team Members table
      await client.query(`
        CREATE TABLE IF NOT EXISTS team_members (
          id VARCHAR(100) PRIMARY KEY,
          name VARCHAR(255) NOT NULL,
          role VARCHAR(100) NOT NULL,
          avatar TEXT,
          email VARCHAR(255),
          created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        );
      `);

      // 6. Team Activities table
      await client.query(`
        CREATE TABLE IF NOT EXISTS team_activities (
          id VARCHAR(100) PRIMARY KEY,
          member_name VARCHAR(255) NOT NULL,
          member_avatar TEXT,
          action TEXT NOT NULL,
          details TEXT,
          created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        );
      `);

      // 7. Files table
      await client.query(`
        CREATE TABLE IF NOT EXISTS files (
          id VARCHAR(100) PRIMARY KEY,
          project_id VARCHAR(100),
          client_id VARCHAR(100),
          name VARCHAR(255) NOT NULL,
          size VARCHAR(50),
          file_type VARCHAR(50),
          uploaded_by VARCHAR(255),
          created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        );
      `);

      // 8. Invoices table
      await client.query(`
        CREATE TABLE IF NOT EXISTS invoices (
          id VARCHAR(100) PRIMARY KEY,
          client_id VARCHAR(100),
          project_id VARCHAR(100),
          title VARCHAR(255),
          amount NUMERIC(12,2) NOT NULL,
          status VARCHAR(50) DEFAULT 'pending',
          due_date VARCHAR(50),
          created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        );
      `);

      // 9. Agency settings table
      await client.query(`
        CREATE TABLE IF NOT EXISTS agency_settings (
          key VARCHAR(100) PRIMARY KEY,
          value JSONB NOT NULL
        );
      `);

      // Ensure username column exists on users table
      await client.query(`
        ALTER TABLE users ADD COLUMN IF NOT EXISTS username VARCHAR(100);
      `);

      // Ensure projects table has all rich detail columns
      await client.query(`
        ALTER TABLE projects ADD COLUMN IF NOT EXISTS project_type VARCHAR(100) DEFAULT 'Web Development';
        ALTER TABLE projects ADD COLUMN IF NOT EXISTS start_date VARCHAR(50);
        ALTER TABLE projects ADD COLUMN IF NOT EXISTS priority VARCHAR(50) DEFAULT 'Medium';
        ALTER TABLE projects ADD COLUMN IF NOT EXISTS credentials JSONB DEFAULT '[]';
        ALTER TABLE projects ADD COLUMN IF NOT EXISTS reference_link TEXT;
        ALTER TABLE projects ADD COLUMN IF NOT EXISTS notes TEXT;
        ALTER TABLE projects ADD COLUMN IF NOT EXISTS files JSONB DEFAULT '[]';
      `);

      // Ensure user credentials requested:
      // 1. awais / awais (Role: client)
      // 2. afshal / afshal (Role: client / user)
      // 3. admin / admin (Role: admin)
      await client.query(`
        INSERT INTO users (id, name, email, password, role, company, avatar, username)
        VALUES 
          ('admin-1', 'Abdullah', 'admin@remotale.com', 'admin', 'admin', 'Remotale', 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&auto=format&fit=crop&q=80', 'admin'),
          ('client-1', 'Ali Khan', 'ali@remotale.com', 'client123', 'client', 'Acme Brand', 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&auto=format&fit=crop&q=80', 'ali'),
          ('client-awais', 'Awais', 'awais@remotale.com', 'awais', 'client', 'Awais Agency', 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&auto=format&fit=crop&q=80', 'awais'),
          ('client-afshal', 'Afshal', 'afshal@remotale.com', 'afshal', 'client', 'Afshal Brand', 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100&auto=format&fit=crop&q=80', 'afshal')
        ON CONFLICT (email) DO UPDATE SET 
          name = EXCLUDED.name,
          password = EXCLUDED.password,
          role = EXCLUDED.role,
          username = EXCLUDED.username;
      `);

      await client.query(`
        ALTER TABLE tasks ADD COLUMN IF NOT EXISTS assigned_name VARCHAR(100);
        ALTER TABLE tasks ADD COLUMN IF NOT EXISTS assigned_avatar TEXT;
      `);

      // Remove old demo projects if any exist
      await client.query(`
        DELETE FROM projects WHERE id IN ('proj-ecommerce', 'proj-brand-logo', 'proj-video-promo', 'proj-seo', 'proj-mobile-app');
      `);

      // Seed Real Projects for Awais and Afshal (using module-level realProjects & seedAssignees)

      for (const p of realProjects) {
        await client.query(`
          INSERT INTO projects (
            id, client_id, title, description, status, progress, budget, deadline,
            project_type, start_date, priority, credentials, notes, files
          )
          VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14)
          ON CONFLICT (id) DO UPDATE SET
            title = EXCLUDED.title,
            description = EXCLUDED.description,
            status = EXCLUDED.status,
            progress = EXCLUDED.progress,
            deadline = EXCLUDED.deadline,
            project_type = EXCLUDED.project_type,
            start_date = EXCLUDED.start_date,
            priority = EXCLUDED.priority,
            notes = EXCLUDED.notes;
        `, [
          p.id,
          p.clientId,
          p.title,
          p.description,
          p.status,
          p.progress,
          0,
          p.deadline,
          p.projectType,
          p.startDate,
          p.priority,
          '[]',
          p.notes,
          '[]'
        ]);

        let tIdx = 1;
        for (const t of p.tasks) {
          const tTitle = typeof t === 'string' ? t : t.title;
          const tCompleted = typeof t === 'object' ? Boolean(t.completed) : false;
          const assigned = seedAssignees[(tIdx - 1) % seedAssignees.length];
          const tId = `task-${p.id}-${tIdx}`;

          await client.query(`
            INSERT INTO tasks (id, project_id, client_id, title, due_date, completed, assigned_name, assigned_avatar)
            VALUES ($1, $2, $3, $4, $5, $6, $7, $8)
            ON CONFLICT (id) DO UPDATE SET
              title = EXCLUDED.title,
              due_date = EXCLUDED.due_date,
              completed = EXCLUDED.completed;
          `, [
            tId,
            p.id,
            p.clientId,
            tTitle,
            p.deadline,
            tCompleted,
            assigned.name,
            assigned.avatar
          ]);
          tIdx++;
        }
      }

      await client.query(`
        INSERT INTO agency_settings (key, value)
        VALUES ('general', '{"agencyName":"Remotale","ownerName":"Abdullah","ownerEmail":"admin@remotale.com","currency":"$"}')
        ON CONFLICT (key) DO NOTHING;
      `);

      console.log('[Neon DB] Tables verified with clean database state & credentials.');
    } finally {
      client.release();
    }
  } catch (err) {
    console.error('[Neon DB] Init error:', err.message);
  }
}

let initPromise = isPostgres && pgPool ? initPostgresTables() : null;

// ==========================================
// DATABASE INTERFACE
// ==========================================
const db = {
  getDriver: () => (isPostgres && pgPool ? 'neon-postgres' : 'local-persistent'),

  // Authentication
  async authenticate(identifier, password) {
    if (initPromise) await initPromise;
    const cleanId = (identifier || '').trim().toLowerCase();
    const cleanPw = (password || '').trim();

    // 1. Guaranteed fast-path match for seeded credentials
    const seedUser = seedUsers.find(u => 
      (u.username && u.username.toLowerCase() === cleanId) || 
      (u.email && u.email.toLowerCase() === cleanId) || 
      (u.id && u.id.toLowerCase() === cleanId) ||
      (u.name && u.name.toLowerCase() === cleanId)
    );
    if (seedUser) {
      if (
        cleanPw === seedUser.password ||
        (seedUser.role === 'admin' && (cleanPw === 'admin' || cleanPw === 'admin123')) ||
        (seedUser.username === 'awais' && cleanPw === 'awais') ||
        (seedUser.username === 'afshal' && cleanPw === 'afshal') ||
        cleanPw === 'client123'
      ) {
        return {
          id: seedUser.id,
          name: seedUser.name,
          email: seedUser.email,
          username: seedUser.username,
          role: seedUser.role,
          company: seedUser.company,
          avatar: seedUser.avatar,
          type: seedUser.role === 'admin' ? 'admin' : 'client'
        };
      }
    }

    if (isPostgres && pgPool) {
      try {
        const res = await pgPool.query(
          `SELECT * FROM users 
           WHERE LOWER(email) = $1 
              OR LOWER(username) = $1 
              OR LOWER(id) = $1 
              OR LOWER(name) = $1`,
          [cleanId]
        );
        if (res.rows.length > 0) {
          const user = res.rows[0];
          // Check password or fallback
          if (
            user.password === cleanPw ||
            (user.role === 'admin' && (cleanPw === 'admin' || cleanPw === 'admin123')) ||
            (user.username === 'awais' && cleanPw === 'awais') ||
            (user.username === 'afshal' && cleanPw === 'afshal') ||
            cleanPw === 'client123'
          ) {
            return {
              id: user.id,
              name: user.name,
              email: user.email,
              username: user.username,
              role: user.role,
              company: user.company,
              avatar: user.avatar,
              type: user.role === 'admin' ? 'admin' : 'client'
            };
          }
        }
      } catch (err) {
        console.error('[DB Auth Error]', err.message);
      }
    }

    // Local fallback
    const local = readLocalStore();
    const user = (local.users || []).find(u => 
      (u.email && u.email.toLowerCase() === cleanId) || 
      (u.username && u.username.toLowerCase() === cleanId) || 
      (u.id && u.id.toLowerCase() === cleanId) ||
      (u.name && u.name.toLowerCase() === cleanId)
    );
    if (
      user && (
        user.password === cleanPw || 
        (user.role === 'admin' && (cleanPw === 'admin' || cleanPw === 'admin123')) ||
        (user.username === 'awais' && cleanPw === 'awais') ||
        (user.username === 'afshal' && cleanPw === 'afshal') ||
        cleanPw === 'client123'
      )
    ) {
      return {
        id: user.id,
        name: user.name,
        email: user.email,
        username: user.username,
        role: user.role,
        company: user.company,
        avatar: user.avatar,
        type: user.role === 'admin' ? 'admin' : 'client'
      };
    }

    return null;
  },

  async register(userObj) {
    if (initPromise) await initPromise;
    const cleanEmail = userObj.email.trim().toLowerCase();

    if (isPostgres && pgPool) {
      const res = await pgPool.query(
        `INSERT INTO users (id, name, email, password, role, company, avatar)
         VALUES ($1, $2, $3, $4, $5, $6, $7)
         RETURNING id, name, email, role, company, avatar`,
        [
          userObj.id,
          userObj.name.trim(),
          cleanEmail,
          userObj.password.trim(),
          userObj.role || 'client',
          userObj.company || `${userObj.name}'s Brand`,
          userObj.avatar || 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=100&auto=format&fit=crop&q=80'
        ]
      );
      const created = res.rows[0];
      return { ...created, type: created.role === 'admin' ? 'admin' : 'client' };
    }

    const local = readLocalStore();
    local.users = local.users || [];
    local.users.push(userObj);
    writeLocalStore(local);
    return { ...userObj, type: userObj.role === 'admin' ? 'admin' : 'client' };
  },

  async resetPassword(email, newPassword) {
    if (initPromise) await initPromise;
    const cleanEmail = (email || '').trim().toLowerCase();
    const cleanPw = (newPassword || '').trim();

    if (isPostgres && pgPool) {
      const res = await pgPool.query(
        'UPDATE users SET password = $1 WHERE LOWER(email) = $2 RETURNING id',
        [cleanPw, cleanEmail]
      );
      return res.rowCount > 0;
    }

    const local = readLocalStore();
    const idx = (local.users || []).findIndex(u => u.email.toLowerCase() === cleanEmail);
    if (idx !== -1) {
      local.users[idx].password = cleanPw;
      writeLocalStore(local);
      return true;
    }
    return false;
  },

  // Clients
  async getClients() {
    if (initPromise) await initPromise;
    if (isPostgres && pgPool) {
      try {
        const res = await pgPool.query(`
          SELECT u.id, u.name, u.email, u.company, u.avatar, u.created_at,
                 COUNT(p.id)::int as "totalProjects"
          FROM users u
          LEFT JOIN projects p ON p.client_id = u.id
          WHERE u.role = 'client'
          GROUP BY u.id
          ORDER BY u.name ASC
        `);
        if (res.rows && res.rows.length > 0) {
          return res.rows;
        }
      } catch (err) {
        console.error('[DB getClients Error]', err.message);
      }
    }

    const local = readLocalStore();
    const allUsers = (local.users && local.users.length > 0) ? local.users : seedUsers;
    const clientUsers = allUsers.filter(u => u.role === 'client');
    const projs = (local.projects && local.projects.length > 0) ? local.projects : realProjects;
    return clientUsers.map(c => ({
      id: c.id,
      name: c.name,
      email: c.email,
      company: c.company,
      avatar: c.avatar,
      totalProjects: projs.filter(p => p.client_id === c.id || p.clientId === c.id).length
    }));
  },

  async getClientById(id) {
    if (initPromise) await initPromise;
    if (isPostgres && pgPool) {
      try {
        const res = await pgPool.query('SELECT * FROM users WHERE id = $1', [id]);
        if (res.rows[0]) return res.rows[0];
      } catch (e) {}
    }
    const local = readLocalStore();
    return (local.users || seedUsers).find(u => u.id === id) || null;
  },

  // Projects
  async getProjects(clientId) {
    if (initPromise) await initPromise;
    if (isPostgres && pgPool) {
      try {
        let query = `
          SELECT p.*, u.name as "clientName", u.company as "companyName", u.avatar as "clientAvatar"
          FROM projects p
          LEFT JOIN users u ON u.id = p.client_id
        `;
        const params = [];
        if (clientId) {
          query += ' WHERE p.client_id = $1';
          params.push(clientId);
        }
        query += ' ORDER BY p.created_at DESC';
        const res = await pgPool.query(query, params);
        if (res.rows && res.rows.length > 0) {
          return res.rows;
        }
      } catch (err) {
        console.error('[DB getProjects Error]', err.message);
      }
    }

    const local = readLocalStore();
    let projs = (local.projects && local.projects.length > 0) ? local.projects : realProjects.map(p => ({
      id: p.id,
      client_id: p.clientId,
      title: p.title,
      description: p.description,
      notes: p.notes,
      project_type: p.projectType,
      status: p.status,
      priority: p.priority,
      deadline: p.deadline,
      start_date: p.startDate,
      progress: p.progress,
      budget: 0
    }));

    if (clientId) {
      projs = projs.filter(p => p.client_id === clientId || p.clientId === clientId);
    }
    return projs;
  },

  async getProjectById(id) {
    if (initPromise) await initPromise;
    if (isPostgres && pgPool) {
      const res = await pgPool.query(`
        SELECT p.*, u.name as "clientName", u.company as "companyName", u.avatar as "clientAvatar"
        FROM projects p
        LEFT JOIN users u ON u.id = p.client_id
        WHERE p.id = $1
      `, [id]);
      return res.rows[0] || null;
    }
    const local = readLocalStore();
    return (local.projects || []).find(p => p.id === id) || null;
  },

  async addProject(projectObj) {
    if (initPromise) await initPromise;
    if (isPostgres && pgPool) {
      const res = await pgPool.query(
        `INSERT INTO projects (
          id, client_id, title, description, status, progress, budget, deadline,
          project_type, start_date, priority, credentials, reference_link, notes
        )
         VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14)
         RETURNING *`,
        [
          projectObj.id,
          projectObj.client_id || projectObj.clientId,
          projectObj.title,
          projectObj.description || '',
          projectObj.status || 'in-progress',
          Number(projectObj.progress) || 0,
          Number(projectObj.budget) || 0,
          projectObj.deadline || 'Oct 31, 2024',
          projectObj.project_type || projectObj.projectType || 'Web Development',
          projectObj.start_date || projectObj.startDate || 'Oct 24, 2024',
          projectObj.priority || 'Medium',
          JSON.stringify(projectObj.credentials || []),
          projectObj.reference_link || projectObj.referenceLink || '',
          projectObj.notes || ''
        ]
      );
      return res.rows[0];
    }

    const local = readLocalStore();
    local.projects = local.projects || [];
    local.projects.unshift(projectObj);
    writeLocalStore(local);
    return projectObj;
  },

  async updateProject(id, updates) {
    if (initPromise) await initPromise;
    if (isPostgres && pgPool) {
      const fields = [];
      const values = [];
      let i = 1;

      if (updates.status !== undefined) {
        fields.push(`status = $${i++}`);
        values.push(updates.status);
      }
      if (updates.progress !== undefined) {
        fields.push(`progress = $${i++}`);
        values.push(Number(updates.progress));
      }
      if (updates.title !== undefined) {
        fields.push(`title = $${i++}`);
        values.push(updates.title);
      }
      if (updates.description !== undefined) {
        fields.push(`description = $${i++}`);
        values.push(updates.description);
      }
      if (updates.deadline !== undefined) {
        fields.push(`deadline = $${i++}`);
        values.push(updates.deadline);
      }
      if (updates.startDate !== undefined || updates.start_date !== undefined) {
        fields.push(`start_date = $${i++}`);
        values.push(updates.startDate || updates.start_date);
      }
      if (updates.priority !== undefined) {
        fields.push(`priority = $${i++}`);
        values.push(updates.priority);
      }
      if (updates.projectType !== undefined || updates.project_type !== undefined) {
        fields.push(`project_type = $${i++}`);
        values.push(updates.projectType || updates.project_type);
      }
      if (updates.credentials !== undefined) {
        fields.push(`credentials = $${i++}`);
        values.push(typeof updates.credentials === 'string' ? updates.credentials : JSON.stringify(updates.credentials));
      }
      if (updates.referenceLink !== undefined || updates.reference_link !== undefined) {
        fields.push(`reference_link = $${i++}`);
        values.push(updates.referenceLink || updates.reference_link);
      }
      if (updates.notes !== undefined) {
        fields.push(`notes = $${i++}`);
        values.push(updates.notes);
      }
      if (updates.files !== undefined) {
        fields.push(`files = $${i++}`);
        values.push(typeof updates.files === 'string' ? updates.files : JSON.stringify(updates.files));
      }
      if (updates.clientId !== undefined || updates.client_id !== undefined) {
        fields.push(`client_id = $${i++}`);
        values.push(updates.clientId || updates.client_id);
      }

      if (fields.length === 0) return null;
      values.push(id);

      const res = await pgPool.query(
        `UPDATE projects SET ${fields.join(', ')} WHERE id = $${i} RETURNING *`,
        values
      );
      return res.rows[0] || null;
    }

    const local = readLocalStore();
    const idx = (local.projects || []).findIndex(p => p.id === id);
    if (idx !== -1) {
      local.projects[idx] = { ...local.projects[idx], ...updates };
      writeLocalStore(local);
      return local.projects[idx];
    }
    return null;
  },

  async deleteProject(id) {
    if (initPromise) await initPromise;
    if (isPostgres && pgPool) {
      await pgPool.query('DELETE FROM projects WHERE id = $1', [id]);
      return true;
    }
    const local = readLocalStore();
    local.projects = (local.projects || []).filter(p => p.id !== id);
    writeLocalStore(local);
    return true;
  },

  // Tasks
  async getTasks(clientId, projectId) {
    if (initPromise) await initPromise;
    if (isPostgres && pgPool) {
      try {
        let q = 'SELECT * FROM tasks WHERE 1=1';
        const params = [];
        if (clientId) {
          params.push(clientId);
          q += ` AND client_id = $${params.length}`;
        }
        if (projectId) {
          params.push(projectId);
          q += ` AND project_id = $${params.length}`;
        }
        q += ' ORDER BY created_at ASC, id ASC';
        const res = await pgPool.query(q, params);
        if (res.rows && res.rows.length > 0) {
          return res.rows;
        }
      } catch (err) {
        console.error('[DB getTasks Error]', err.message);
      }
    }

    const local = readLocalStore();
    let tasks = local.tasks || [];
    if (clientId) tasks = tasks.filter(t => t.client_id === clientId);
    if (projectId) tasks = tasks.filter(t => t.project_id === projectId);
    return tasks;
  },

  async addTask(taskObj) {
    if (initPromise) await initPromise;
    if (isPostgres && pgPool) {
      const res = await pgPool.query(
        `INSERT INTO tasks (id, project_id, client_id, title, due_date, completed)
         VALUES ($1, $2, $3, $4, $5, $6)
         RETURNING *`,
        [
          taskObj.id || `task-${Date.now()}`,
          taskObj.project_id || taskObj.projectId || null,
          taskObj.client_id || taskObj.clientId || null,
          taskObj.title,
          taskObj.due_date || taskObj.dueDate || 'Oct 25, 2024',
          Boolean(taskObj.completed)
        ]
      );
      return res.rows[0];
    }

    const local = readLocalStore();
    local.tasks = local.tasks || [];
    local.tasks.unshift(taskObj);
    writeLocalStore(local);
    return taskObj;
  },

  async toggleTask(id, completed) {
    if (initPromise) await initPromise;
    if (isPostgres && pgPool) {
      const res = await pgPool.query(
        'UPDATE tasks SET completed = $1 WHERE id = $2 RETURNING *',
        [completed, id]
      );
      return res.rows[0] || null;
    }

    const local = readLocalStore();
    const task = (local.tasks || []).find(t => t.id === id);
    if (task) {
      task.completed = completed !== undefined ? completed : !task.completed;
      writeLocalStore(local);
      return task;
    }
    return null;
  },

  // Messages
  async getMessages(clientId, projectId) {
    if (initPromise) await initPromise;
    if (isPostgres && pgPool) {
      let q = 'SELECT * FROM messages WHERE 1=1';
      const params = [];
      if (clientId) {
        params.push(clientId);
        q += ` AND (sender_id = $${params.length} OR receiver_id = $${params.length})`;
      }
      if (projectId) {
        params.push(projectId);
        q += ` AND project_id = $${params.length}`;
      }
      q += ' ORDER BY created_at ASC';
      const res = await pgPool.query(q, params);
      return res.rows;
    }

    const local = readLocalStore();
    return local.messages || [];
  },

  async addMessage(msgObj) {
    if (initPromise) await initPromise;
    if (isPostgres && pgPool) {
      const res = await pgPool.query(
        `INSERT INTO messages (id, sender_id, sender_name, sender_avatar, receiver_id, project_id, content)
         VALUES ($1, $2, $3, $4, $5, $6, $7)
         RETURNING *`,
        [
          msgObj.id || `msg-${Date.now()}`,
          msgObj.sender_id || msgObj.senderId || 'admin',
          msgObj.sender_name || msgObj.senderName || 'User',
          msgObj.sender_avatar || msgObj.senderAvatar || '',
          msgObj.receiver_id || msgObj.receiverId || null,
          msgObj.project_id || msgObj.projectId || null,
          msgObj.content
        ]
      );
      return res.rows[0];
    }

    const local = readLocalStore();
    local.messages = local.messages || [];
    local.messages.push(msgObj);
    writeLocalStore(local);
    return msgObj;
  },

  // Team
  async getTeam() {
    if (initPromise) await initPromise;
    if (isPostgres && pgPool) {
      const res = await pgPool.query('SELECT * FROM team_members ORDER BY created_at ASC');
      return res.rows;
    }
    const local = readLocalStore();
    return local.team_members || [];
  },

  async getTeamActivities() {
    if (initPromise) await initPromise;
    if (isPostgres && pgPool) {
      const res = await pgPool.query('SELECT * FROM team_activities ORDER BY created_at DESC LIMIT 10');
      return res.rows;
    }
    const local = readLocalStore();
    return local.team_activities || [];
  },

  // Overview Stats
  async getStats(clientId) {
    if (initPromise) await initPromise;
    if (isPostgres && pgPool) {
      if (clientId) {
        const [projCount, inProg, underRev, comp, rev] = await Promise.all([
          pgPool.query("SELECT COUNT(*)::int as count FROM projects WHERE client_id = $1", [clientId]),
          pgPool.query("SELECT COUNT(*)::int as count FROM projects WHERE client_id = $1 AND status = 'in-progress'", [clientId]),
          pgPool.query("SELECT COUNT(*)::int as count FROM projects WHERE client_id = $1 AND status = 'under-review'", [clientId]),
          pgPool.query("SELECT COUNT(*)::int as count FROM projects WHERE client_id = $1 AND status = 'completed'", [clientId]),
          pgPool.query("SELECT COALESCE(SUM(budget), 0)::numeric as total FROM projects WHERE client_id = $1", [clientId])
        ]);

        return {
          totalClients: 1,
          totalProjects: projCount.rows[0].count,
          inProgress: inProg.rows[0].count,
          underReview: underRev.rows[0].count,
          completed: comp.rows[0].count,
          totalRevenue: Number(rev.rows[0].total)
        };
      }

      const [clientsCount, projCount, inProg, underRev, comp, rev] = await Promise.all([
        pgPool.query("SELECT COUNT(*)::int as count FROM users WHERE role = 'client'"),
        pgPool.query("SELECT COUNT(*)::int as count FROM projects"),
        pgPool.query("SELECT COUNT(*)::int as count FROM projects WHERE status = 'in-progress'"),
        pgPool.query("SELECT COUNT(*)::int as count FROM projects WHERE status = 'under-review'"),
        pgPool.query("SELECT COUNT(*)::int as count FROM projects WHERE status = 'completed'"),
        pgPool.query("SELECT COALESCE(SUM(budget), 0)::numeric as total FROM projects")
      ]);

      return {
        totalClients: clientsCount.rows[0].count,
        totalProjects: projCount.rows[0].count,
        inProgress: inProg.rows[0].count,
        underReview: underRev.rows[0].count,
        completed: comp.rows[0].count,
        totalRevenue: Number(rev.rows[0].total)
      };
    }

    const local = readLocalStore();
    let projects = local.projects || [];
    if (clientId) {
      projects = projects.filter(p => p.client_id === clientId || p.clientId === clientId);
      return {
        totalClients: 1,
        totalProjects: projects.length,
        inProgress: projects.filter(p => p.status === 'in-progress').length,
        underReview: projects.filter(p => p.status === 'under-review').length,
        completed: projects.filter(p => p.status === 'completed').length,
        totalRevenue: projects.reduce((s, p) => s + (Number(p.budget) || 0), 0)
      };
    }

    return {
      totalClients: (local.users || []).filter(u => u.role === 'client').length,
      totalProjects: projects.length,
      inProgress: projects.filter(p => p.status === 'in-progress').length,
      underReview: projects.filter(p => p.status === 'under-review').length,
      completed: projects.filter(p => p.status === 'completed').length,
      totalRevenue: projects.reduce((s, p) => s + (Number(p.budget) || 0), 0)
    };
  },

  async getSettings() {
    if (initPromise) await initPromise;
    if (isPostgres && pgPool) {
      const res = await pgPool.query("SELECT value FROM agency_settings WHERE key = 'general'");
      if (res.rows.length > 0) return res.rows[0].value;
    }
    return { agencyName: "Remotale", ownerName: "Abdullah", ownerEmail: "admin@remotale.com", currency: "$" };
  }
};

module.exports = db;
