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
app.use(express.json({ limit: '25mb' }));
app.use(express.urlencoded({ extended: true, limit: '25mb' }));

// Health check
app.get('/api/health', (req, res) => {
  res.json({
    status: 'healthy',
    timestamp: new Date().toISOString(),
    driver: db.getDriver(),
    service: 'Remotale Platform API'
  });
});

// ==========================================
// Authentication API
// ==========================================
app.post('/api/auth/login', async (req, res) => {
  try {
    const { identifier, email, username, password } = req.body;
    const loginId = (identifier || email || username || '').trim();
    if (!loginId || !password) {
      return res.status(400).json({ error: 'Please enter both your email/username and password.' });
    }

    const authUser = await db.authenticate(loginId, password);
    if (!authUser) {
      return res.status(401).json({ error: 'Invalid login credentials. Please verify your email/username and password.' });
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

// Registration API
app.post('/api/auth/register', async (req, res) => {
  try {
    const { name, email, password, role, company } = req.body;
    if (!name || !email || !password) {
      return res.status(400).json({ error: 'Name, email, and password are required.' });
    }

    const cleanEmail = email.trim().toLowerCase();
    const existing = await db.authenticate(cleanEmail, 'dummy_check_pw');
    // If existing account found
    if (existing) {
      return res.status(400).json({ error: 'An account with this email already exists. Please sign in.' });
    }

    const isTeamRole = (role === 'admin' || role === 'team' || role === 'Admin / Team');
    const newUser = {
      id: `user-${Date.now()}`,
      name: name.trim(),
      email: cleanEmail,
      password: password.trim(),
      role: isTeamRole ? 'admin' : 'client',
      company: company || (isTeamRole ? 'Remotale Team' : `${name.trim()}'s Brand`),
      avatar: isTeamRole
        ? `https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&auto=format&fit=crop&q=80`
        : `https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&auto=format&fit=crop&q=80`
    };

    const saved = await db.register(newUser);
    const token = crypto.randomBytes(32).toString('hex');

    res.status(201).json({
      success: true,
      user: saved,
      token
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Forgot / Reset Password API
app.post('/api/auth/forgot-password', async (req, res) => {
  try {
    const { email, newPassword } = req.body;
    if (!email || !newPassword) {
      return res.status(400).json({ error: 'Both email and new password are required.' });
    }

    if (newPassword.length < 6) {
      return res.status(400).json({ error: 'Password must be at least 6 characters long.' });
    }

    const ok = await db.resetPassword(email, newPassword);
    if (!ok) {
      return res.status(404).json({ error: 'No account found with this email address.' });
    }

    res.json({
      success: true,
      message: 'Password successfully updated. You can now log in with your new password.'
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// ==========================================
// Overview Stats API
// ==========================================
app.get('/api/stats', async (req, res) => {
  try {
    const { clientId } = req.query;
    const stats = await db.getStats(clientId);
    res.json(stats);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Settings API
app.get('/api/settings', async (req, res) => {
  try {
    const settings = await db.getSettings();
    res.json(settings);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// ==========================================
// Clients API
// ==========================================
app.get('/api/clients', async (req, res) => {
  try {
    const clients = await db.getClients();
    res.json(clients);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.get('/api/clients/:id', async (req, res) => {
  try {
    const client = await db.getClientById(req.params.id);
    if (!client) return res.status(404).json({ error: 'Client not found' });
    const projects = await db.getProjects(client.id);
    res.json({ ...client, projects });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// ==========================================
// Projects API
// ==========================================
app.get('/api/projects', async (req, res) => {
  try {
    const { clientId, status } = req.query;
    let projects = await db.getProjects(clientId);
    const allTasks = await db.getTasks(clientId);
    projects = projects.map(p => {
      const pTasks = allTasks.filter(t => t.project_id === p.id);
      const total = pTasks.length;
      const done = pTasks.filter(t => t.completed).length;
      const taskPct = total > 0 ? Math.round((done / total) * 100) : null;
      const pct = taskPct !== null ? taskPct : (Number(p.progress) || 0);
      const isCompleted = pct >= 100 || (total > 0 && done === total) || p.status === 'completed';
      return {
        ...p,
        progress: isCompleted ? 100 : pct,
        status: isCompleted ? 'completed' : p.status,
        tasks: pTasks
      };
    });
    if (status) {
      projects = projects.filter(p => p.status === status);
    }
    res.json(projects);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.get('/api/projects/:id', async (req, res) => {
  try {
    const project = await db.getProjectById(req.params.id);
    if (!project) return res.status(404).json({ error: 'Project not found' });
    const tasks = await db.getTasks(null, project.id);
    const total = tasks.length;
    const done = tasks.filter(t => t.completed).length;
    const taskPct = total > 0 ? Math.round((done / total) * 100) : null;
    const pct = taskPct !== null ? taskPct : (Number(project.progress) || 0);
    const isCompleted = pct >= 100 || (total > 0 && done === total) || project.status === 'completed';
    res.json({
      ...project,
      progress: isCompleted ? 100 : pct,
      status: isCompleted ? 'completed' : project.status,
      tasks
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.post('/api/projects', async (req, res) => {
  try {
    const { 
      title, clientId, description, budget, deadline, status, progress,
      projectType, startDate, priority, credentials, referenceLink, notes,
      assignedTo, assigned_to, assignedName, assigned_name, assignedMembers, assigned_members
    } = req.body;
    if (!title) {
      return res.status(400).json({ error: 'Project title is required' });
    }

    const numProgress = Number(progress);
    const isCompleted = numProgress >= 100 || status === 'completed';

    const newProject = {
      id: `proj-${Date.now()}`,
      client_id: clientId || 'client-1',
      title: title.trim(),
      description: description || '',
      status: isCompleted ? 'completed' : (status || 'in-progress'),
      progress: isCompleted ? 100 : (Number.isFinite(numProgress) ? numProgress : (status === 'under-review' ? 90 : 70)),
      budget: Number(budget) || 0,
      deadline: deadline || 'Oct 31, 2024',
      project_type: projectType || 'Web Development',
      start_date: startDate || 'Oct 24, 2024',
      priority: priority || 'Medium',
      credentials: credentials || [],
      reference_link: referenceLink || '',
      notes: notes || '',
      assigned_to: assigned_to || assignedTo || null,
      assigned_name: assigned_name || assignedName || null,
      assigned_members: assigned_members || assignedMembers || []
    };

    const created = await db.addProject(newProject);
    res.status(201).json(created);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.put('/api/projects/:id', async (req, res) => {
  try {
    const updates = { ...req.body };
    if (Number(updates.progress) >= 100 && (!updates.status || updates.status === 'in-progress')) {
      updates.status = 'completed';
      updates.progress = 100;
    }
    const updated = await db.updateProject(req.params.id, updates);
    if (!updated) return res.status(404).json({ error: 'Project not found' });
    const tasks = await db.getTasks(null, updated.id);
    const total = tasks.length;
    const done = tasks.filter(t => t.completed).length;
    const taskPct = total > 0 ? Math.round((done / total) * 100) : null;
    const pct = taskPct !== null ? taskPct : (Number(updated.progress) || 0);
    const isCompleted = pct >= 100 || (total > 0 && done === total) || updated.status === 'completed';
    res.json({
      ...updated,
      progress: isCompleted ? 100 : pct,
      status: isCompleted ? 'completed' : updated.status,
      tasks
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Dedicated Project Notepad endpoints
app.get('/api/projects/:id/notepad', async (req, res) => {
  try {
    const proj = await db.getProjectById(req.params.id);
    if (!proj) return res.status(404).json({ error: 'Project not found' });
    res.json({ projectId: proj.id, content: proj.notes || '' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.put('/api/projects/:id/notepad', async (req, res) => {
  try {
    const { content } = req.body;
    const updated = await db.updateProject(req.params.id, { notes: content });
    if (!updated) return res.status(404).json({ error: 'Project not found' });
    res.json({ projectId: updated.id, content: updated.notes || '' });
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

// ==========================================
// Tasks API
// ==========================================
app.get('/api/tasks', async (req, res) => {
  try {
    const { clientId, projectId } = req.query;
    const tasks = await db.getTasks(clientId, projectId);
    res.json(tasks);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.post('/api/tasks', async (req, res) => {
  try {
    const { title, dueDate, clientId, projectId, assignedName, assignedAvatar, completed, completedAt } = req.body;
    if (!title || !title.trim()) {
      return res.status(400).json({ error: 'Task title is required' });
    }

    const isCompleted = Boolean(completed);
    const newTask = {
      id: `task-${Date.now()}`,
      project_id: projectId || null,
      client_id: clientId || null,
      title: title.trim(),
      due_date: dueDate || new Date(Date.now() + 7 * 86400000).toLocaleDateString('en-GB'),
      completed: isCompleted,
      completed_at: isCompleted ? (completedAt || new Date().toISOString()) : null,
      assigned_name: assignedName || 'Abdullah',
      assigned_avatar: assignedAvatar || ''
    };

    const saved = await db.addTask(newTask);
    res.status(201).json(saved);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.patch('/api/tasks/:id/toggle', async (req, res) => {
  try {
    const updated = await db.toggleTask(req.params.id, req.body.completed);
    if (!updated) return res.status(404).json({ error: 'Task not found' });
    res.json(updated);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.put('/api/tasks/:id', async (req, res) => {
  try {
    const updated = await db.updateTask(req.params.id, req.body);
    if (!updated) return res.status(404).json({ error: 'Task not found' });
    res.json(updated);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.delete('/api/tasks/:id', async (req, res) => {
  try {
    const result = await db.deleteTask(req.params.id);
    res.json(result);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// ==========================================
// Messages API
// ==========================================
app.get('/api/messages', async (req, res) => {
  try {
    const { clientId, projectId } = req.query;
    const messages = await db.getMessages(clientId, projectId);
    res.json(messages);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.post('/api/messages', async (req, res) => {
  try {
    const senderId = req.body.senderId || req.body.sender_id || 'user-1';
    const senderName = req.body.senderName || req.body.sender_name || 'User';
    const senderAvatar = req.body.senderAvatar || req.body.sender_avatar || '';
    const receiverId = req.body.receiverId || req.body.receiver_id || null;
    const projectId = req.body.projectId || req.body.project_id || null;
    const finalImage = req.body.imageUrl || req.body.image_url || null;
    const finalContent = (req.body.content || '').trim();
    if (!finalContent && !finalImage) {
      return res.status(400).json({ error: 'Message content or image is required' });
    }

    const newMsg = {
      id: req.body.id || `msg-${Date.now()}-${Math.random().toString(36).substr(2, 6)}`,
      sender_id: senderId,
      sender_name: senderName,
      sender_avatar: senderAvatar,
      receiver_id: receiverId,
      project_id: projectId,
      content: finalContent,
      image_url: finalImage,
      created_at: req.body.created_at || new Date().toISOString()
    };

    const saved = await db.addMessage(newMsg);
    res.status(201).json(saved);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// ==========================================
// Team API
// ==========================================
app.get('/api/team', async (req, res) => {
  try {
    const team = await db.getTeam();
    res.json(team);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.post('/api/team', async (req, res) => {
  try {
    const { name, role, email, avatar, password } = req.body;
    if (!name || !email) {
      return res.status(400).json({ error: 'Name and email are required for a team member' });
    }
    const member = await db.addTeamMember({ name, role, email, avatar, password });
    res.status(201).json(member);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.delete('/api/team/:id', async (req, res) => {
  try {
    const result = await db.deleteTeamMember(req.params.id);
    res.json({ success: true, ...result });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.get(['/api/team/activities', '/api/team-activities', '/api/activities'], async (req, res) => {
  try {
    const activities = await db.getTeamActivities();
    res.json(activities);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// ==========================================
// Invoices API
// ==========================================
app.get('/api/invoices', async (req, res) => {
  try {
    const { clientId, projectId, status, includeDeleted } = req.query;
    const invoices = await db.getInvoices(clientId, projectId, status, includeDeleted === 'true');
    res.json(invoices);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.get('/api/invoices/:id', async (req, res) => {
  try {
    const invoice = await db.getInvoiceById(req.params.id);
    if (!invoice) return res.status(404).json({ error: 'Invoice not found' });
    res.json(invoice);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.post('/api/invoices', async (req, res) => {
  try {
    const invoice = await db.createInvoice(req.body);
    res.status(201).json(invoice);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.put('/api/invoices/:id', async (req, res) => {
  try {
    const updated = await db.updateInvoice(req.params.id, req.body);
    if (!updated) return res.status(404).json({ error: 'Invoice not found' });
    res.json(updated);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.patch('/api/invoices/:id/publish', async (req, res) => {
  try {
    const published = await db.publishInvoice(req.params.id);
    if (!published) return res.status(404).json({ error: 'Invoice not found' });
    res.json(published);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.patch('/api/invoices/:id/restore', async (req, res) => {
  try {
    const restored = await db.restoreInvoice(req.params.id);
    if (!restored) return res.status(404).json({ error: 'Invoice not found' });
    res.json(restored);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.patch('/api/invoices/:id/status', async (req, res) => {
  try {
    const { status } = req.body;
    const updated = await db.updateInvoice(req.params.id, { status });
    if (!updated) return res.status(404).json({ error: 'Invoice not found' });
    res.json(updated);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.delete('/api/invoices/:id', async (req, res) => {
  try {
    const result = await db.deleteInvoice(req.params.id);
    res.json({ success: true, ...result });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// ==========================================
// Production Static Frontend Serving
// ==========================================
const distPath = path.join(__dirname, '../frontend/dist');

if (fs.existsSync(distPath)) {
  console.log(`[Production] Serving frontend from: ${distPath}`);
  app.use(express.static(distPath));

  app.use((req, res, next) => {
    if (req.method === 'GET' && !req.path.startsWith('/api')) {
      return res.sendFile(path.join(distPath, 'index.html'));
    }
    next();
  });
} else {
  app.get('/', (req, res) => {
    res.json({
      status: 'online',
      service: 'Remotale Platform API',
      health: '/api/health'
    });
  });
}

app.use('/api', (req, res) => {
  res.status(404).json({ error: 'API endpoint not found' });
});

app.listen(PORT, () => {
  console.log(`[Remotale API] Server running on port ${PORT}`);
  console.log(`[Database Driver] ${db.getDriver()}`);
});
