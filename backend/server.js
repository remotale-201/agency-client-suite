const express = require('express');
const cors = require('cors');
const crypto = require('crypto');
const path = require('path');
const fs = require('fs');
const db = require('./db');

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors({
  origin: '*',
  methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));
app.use(express.json());

// Health check for deployment & monitoring
app.get('/api/health', (req, res) => {
  res.json({
    status: 'healthy',
    timestamp: new Date().toISOString(),
    driver: db.getDriver(),
    service: 'ByteForge Agency API'
  });
});

// ==========================================
// Authentication API (Admin & Client Portals)
// ==========================================
app.post('/api/auth/login', async (req, res) => {
  try {
    const { identifier, email, portalToken, password } = req.body;
    const loginId = (identifier || email || portalToken || '').trim();
    if (!loginId || !password) {
      return res.status(400).json({ error: 'Please enter both your email or portal access ID and password.' });
    }

    const authUser = await db.authenticate(loginId, password);
    if (!authUser) {
      return res.status(401).json({ error: 'Invalid login credentials. Please check your email/ID and password.' });
    }

    const token = crypto.randomBytes(32).toString('hex');
    res.json({
      success: true,
      user: authUser,
      token
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Wipes demo data and resets to fresh state
app.post('/api/auth/reset-data', async (req, res) => {
  try {
    const fresh = await db.resetDatabase();
    res.json({ success: true, message: 'All demo data cleared and reset to fresh state.', data: fresh });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Overview Stats (Admin Panel metrics)
app.get('/api/stats', async (req, res) => {
  try {
    const stats = await db.getStats();
    res.json(stats);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Agency Settings
app.get('/api/settings', async (req, res) => {
  try {
    const settings = await db.getSettings();
    res.json(settings);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.put('/api/settings', async (req, res) => {
  try {
    const updated = await db.updateSettings(req.body);
    res.json(updated);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Clients API
app.get('/api/clients', async (req, res) => {
  try {
    const clients = await db.getClients();
    const projects = await db.getProjects();
    const changes = await db.getChanges();

    // Enrich clients with dynamic stats
    const enriched = clients.map(client => {
      const clientProjects = projects.filter(p => p.clientId === client.id);
      const clientChanges = changes.filter(c => c.clientId === client.id);
      const totalBudget = clientProjects.reduce((sum, p) => sum + (Number(p.budget) || 0), 0);
      const activeProjects = clientProjects.filter(p => p.status === 'in-progress' || p.status === 'under-review').length;
      const openChanges = clientChanges.filter(c => c.status !== 'completed').length;

      return {
        ...client,
        totalProjects: clientProjects.length,
        activeProjects,
        totalSpend: totalBudget,
        openChanges
      };
    });

    res.json(enriched);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.get('/api/clients/:id', async (req, res) => {
  try {
    const client = await db.getClientById(req.params.id);
    if (!client) {
      return res.status(404).json({ error: 'Client not found' });
    }
    const projects = await db.getProjects(client.id);
    const changes = await db.getChanges({ clientId: client.id });

    res.json({
      ...client,
      projects,
      changes
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.post('/api/clients', async (req, res) => {
  try {
    const { name, company, email, phone, password, portalToken, avatar } = req.body;
    if (!name || !company) {
      return res.status(400).json({ error: 'Name and company are required' });
    }

    const tokenSlug = (portalToken || (company.toLowerCase().replace(/[^a-z0-9]/g, '-') + '-portal')).trim();
    const clientPassword = (password || 'Client123!').trim();

    const newClient = {
      id: `client-${Date.now()}`,
      name,
      company,
      email: (email || '').trim(),
      phone: (phone || '').trim(),
      password: clientPassword,
      portalToken: tokenSlug,
      avatar: avatar || `https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150&auto=format&fit=crop&q=80`,
      createdAt: new Date().toISOString()
    };

    const saved = await db.addClient(newClient);
    res.status(201).json(saved);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.delete('/api/clients/:id', async (req, res) => {
  try {
    await db.deleteClient(req.params.id);
    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Projects API
app.get('/api/projects', async (req, res) => {
  try {
    const { clientId, status } = req.query;
    let projects = await db.getProjects(clientId);
    if (status) {
      projects = projects.filter(p => p.status === status);
    }

    const clients = await db.getClients();
    const changes = await db.getChanges();

    // Attach client info and open changes count
    const enriched = projects.map(proj => {
      const client = clients.find(c => c.id === proj.clientId);
      const projChanges = changes.filter(c => c.projectId === proj.id);
      const openChanges = projChanges.filter(c => c.status !== 'completed').length;
      const criticalChanges = projChanges.filter(c => c.urgency === 'critical' && c.status !== 'completed').length;

      return {
        ...proj,
        clientName: client ? client.name : 'Unknown',
        companyName: client ? client.company : 'Client',
        clientAvatar: client ? client.avatar : '',
        openChangesCount: openChanges,
        criticalChangesCount: criticalChanges
      };
    });

    res.json(enriched);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.get('/api/projects/:id', async (req, res) => {
  try {
    const project = await db.getProjectById(req.params.id);
    if (!project) {
      return res.status(404).json({ error: 'Project not found' });
    }
    const client = await db.getClientById(project.clientId);
    const notepad = await db.getNotepad(project.id);
    const changes = await db.getChanges({ projectId: project.id });

    res.json({
      ...project,
      client,
      notepad,
      changes
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.post('/api/projects', async (req, res) => {
  try {
    const { title, clientId, description, budget, deadline, priority, deliverables, links } = req.body;
    if (!title || !clientId) {
      return res.status(400).json({ error: 'Title and clientId are required' });
    }

    const newProject = {
      id: `proj-${Date.now()}`,
      clientId,
      title,
      description: description || '',
      budget: Number(budget) || 0,
      currency: '$',
      status: 'pending',
      progress: 0,
      priority: priority || 'normal',
      deadline: deadline || new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
      deliverables: Array.isArray(deliverables) && deliverables.length > 0 ? deliverables : [
        { id: `d-${Date.now()}-1`, title: 'Discovery & Requirements Gathering', completed: false },
        { id: `d-${Date.now()}-2`, title: 'Design & Prototype Sign-off', completed: false },
        { id: `d-${Date.now()}-3`, title: 'Core Development & Integration', completed: false },
        { id: `d-${Date.now()}-4`, title: 'Final QA & Production Deployment', completed: false }
      ],
      links: links || {
        figma: '',
        staging: '',
        drive: ''
      },
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };

    const created = await db.addProject(newProject);
    res.status(201).json(created);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.put('/api/projects/:id', async (req, res) => {
  try {
    const updated = await db.updateProject(req.params.id, req.body);
    if (!updated) {
      return res.status(404).json({ error: 'Project not found' });
    }
    res.json(updated);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.delete('/api/projects/:id', async (req, res) => {
  try {
    await db.deleteProject(req.params.id);
    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Deliverable status toggle
app.patch('/api/projects/:id/deliverables/:delivId', async (req, res) => {
  try {
    const project = await db.getProjectById(req.params.id);
    if (!project) return res.status(404).json({ error: 'Project not found' });

    const deliverables = (project.deliverables || []).map(d => {
      if (d.id === req.params.delivId) {
        return { ...d, completed: req.body.completed !== undefined ? req.body.completed : !d.completed };
      }
      return d;
    });

    const completedCount = deliverables.filter(d => d.completed).length;
    const progress = deliverables.length > 0 ? Math.round((completedCount / deliverables.length) * 100) : project.progress;

    const updated = await db.updateProject(project.id, {
      deliverables,
      progress,
      status: progress === 100 ? 'completed' : (progress > 0 ? 'in-progress' : project.status)
    });

    res.json(updated);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Project Notepad Endpoints (Client / Admin notepad with real-time sync)
app.get('/api/projects/:id/notepad', async (req, res) => {
  try {
    const notepad = await db.getNotepad(req.params.id);
    res.json(notepad);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.put('/api/projects/:id/notepad', async (req, res) => {
  try {
    const { content, updatedBy } = req.body;
    const updated = await db.updateNotepad(req.params.id, content, updatedBy || 'Client');
    res.json(updated);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Client Structured Points & Action Items
app.get('/api/projects/:id/points', async (req, res) => {
  try {
    const points = await db.getPoints(req.params.id);
    res.json(points);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.post('/api/projects/:id/points', async (req, res) => {
  try {
    const { text, createdBy } = req.body;
    if (!text || !text.trim()) {
      return res.status(400).json({ error: 'Point text is required' });
    }
    const newPoint = await db.addPoint(req.params.id, text.trim(), createdBy);
    res.status(201).json(newPoint);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.patch('/api/projects/:id/points/:pointId', async (req, res) => {
  try {
    const updated = await db.togglePoint(req.params.id, req.params.pointId, req.body.completed);
    if (!updated) return res.status(404).json({ error: 'Point not found' });
    res.json(updated);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.delete('/api/projects/:id/points/:pointId', async (req, res) => {
  try {
    await db.deletePoint(req.params.id, req.params.pointId);
    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Client Changes & Revisions Hub
app.get('/api/changes', async (req, res) => {
  try {
    const { projectId, clientId, urgency, status } = req.query;
    const changes = await db.getChanges({ projectId, clientId, urgency, status });
    res.json(changes);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.post('/api/changes', async (req, res) => {
  try {
    const { projectId, clientId, title, description, urgency, deadline, requestedBy } = req.body;
    if (!projectId || !title) {
      return res.status(400).json({ error: 'projectId and title are required' });
    }

    const project = await db.getProjectById(projectId);
    const client = clientId ? await db.getClientById(clientId) : (project ? await db.getClientById(project.clientId) : null);

    const newChange = {
      id: `ch-${Date.now()}`,
      projectId,
      clientId: client ? client.id : (project ? project.clientId : ''),
      clientName: client ? client.name : (requestedBy || 'Client'),
      companyName: client ? client.company : 'Client Company',
      projectTitle: project ? project.title : 'Project',
      title,
      description: description || '',
      urgency: urgency || 'normal', // 'critical', 'high', 'normal', 'low'
      deadline: deadline || '',
      status: 'pending', // 'pending', 'in-review', 'in-progress', 'completed'
      resolutionNote: '',
      requestedBy: requestedBy || (client ? client.name : 'Client'),
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };

    const saved = await db.addChange(newChange);
    res.status(201).json(saved);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.patch('/api/changes/:id/status', async (req, res) => {
  try {
    const { status, resolutionNote } = req.body;
    if (!status) {
      return res.status(400).json({ error: 'status is required' });
    }
    const updated = await db.updateChangeStatus(req.params.id, status, resolutionNote);
    if (!updated) {
      return res.status(404).json({ error: 'Change request not found' });
    }
    res.json(updated);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.delete('/api/changes/:id', async (req, res) => {
  try {
    await db.deleteChange(req.params.id);
    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// ==========================================
// Production Static Frontend Serving
// ==========================================
const distCandidate1 = path.join(__dirname, '../frontend/dist');
const distCandidate2 = path.join(__dirname, 'dist');
const distPath = fs.existsSync(distCandidate1)
  ? distCandidate1
  : fs.existsSync(distCandidate2)
    ? distCandidate2
    : null;

if (distPath) {
  console.log(`[Production] Serving compiled frontend from: ${distPath}`);
  app.use(express.static(distPath));

  // Catch-all SPA fallback for client-side routing (Express 5 compatible)
  app.use((req, res, next) => {
    if (req.method === 'GET' && !req.path.startsWith('/api')) {
      return res.sendFile(path.join(distPath, 'index.html'));
    }
    next();
  });
} else {
  // If no dist folder found, provide friendly guide on root
  app.get('/', (req, res) => {
    res.json({
      status: 'online',
      service: 'Vanguard Agency API',
      health: '/api/health',
      stats: '/api/stats',
      note: 'Frontend dist not found. Run "npm run build" in frontend directory to serve UI from this server.'
    });
  });
}

// 404 handler for unknown API routes
app.use('/api', (req, res) => {
  res.status(404).json({ error: 'API endpoint not found' });
});

app.listen(PORT, () => {
  console.log(`[Agency API] Server running on port ${PORT}`);
  console.log(`[Database] Driver active: ${db.getDriver()}`);
});
