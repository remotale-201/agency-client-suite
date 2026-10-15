const { Pool } = require('pg');
require('dotenv').config({ path: __dirname + '/.env' });

async function seedRealProjects() {
  const pool = new Pool({
    connectionString: process.env.DATABASE_URL,
    ssl: { rejectUnauthorized: false }
  });

  const client = await pool.connect();
  try {
    console.log('[Seed] Connected to database.');

    // 1. Ensure users awais, afshal, and admin exist with correct IDs
    await client.query(`
      INSERT INTO users (id, name, email, password, role, company, avatar, username)
      VALUES 
        ('admin-1', 'Abdullah', 'admin@remotale.com', 'admin', 'admin', 'Remotale', 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&auto=format&fit=crop&q=80', 'admin'),
        ('client-awais', 'Awais', 'awais@remotale.com', 'awais', 'client', 'Awais Agency', 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&auto=format&fit=crop&q=80', 'awais'),
        ('client-afshal', 'Afshal', 'afshal@remotale.com', 'afshal', 'client', 'Afshal Brand', 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100&auto=format&fit=crop&q=80', 'afshal')
      ON CONFLICT (email) DO UPDATE SET 
        name = EXCLUDED.name,
        password = EXCLUDED.password,
        role = EXCLUDED.role,
        company = EXCLUDED.company,
        avatar = EXCLUDED.avatar,
        username = EXCLUDED.username;
    `);
    console.log('[Seed] Users verified.');

    // 2. Remove all old demo projects and tasks
    await client.query(`DELETE FROM tasks;`);
    await client.query(`DELETE FROM projects;`);
    console.log('[Seed] Cleared old demo projects and tasks.');

    // 3. Define Real Projects Data
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
        tasks: [
          'Header',
          'Graphics',
          'Product Page',
          'Product Card',
          'Other Pages',
          'Footer',
          'Buy and Connect Domain',
          'Final Changes'
        ]
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
        tasks: [
          'Header',
          'Graphics',
          'Product Page',
          'Product Card',
          'Other Pages',
          'Footer',
          'Buy and Connect Domain',
          'Final Changes'
        ]
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
        tasks: [
          '25% Done',
          '50% Done',
          '75% Done',
          '100% Done'
        ]
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
        tasks: [
          '25% Done',
          '50% Done',
          '75% Done',
          '100% Done'
        ]
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
        tasks: [
          'Product Listing',
          'Organization',
          'Banners'
        ]
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
        tasks: [
          'Header',
          'Graphics',
          'Product Page',
          'Product Card',
          'Other Pages',
          'Footer',
          'Buy and Connect Domain',
          'Final Changes'
        ]
      }
    ];

    const assignees = [
      { name: 'Ahmed', avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=100&auto=format&fit=crop&q=80' },
      { name: 'Sara', avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100&auto=format&fit=crop&q=80' },
      { name: 'Usman', avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&auto=format&fit=crop&q=80' }
    ];

    for (const proj of realProjects) {
      await client.query(`
        INSERT INTO projects (
          id, client_id, title, description, status, progress, budget, deadline,
          project_type, start_date, priority, credentials, notes, files
        )
        VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14)
      `, [
        proj.id,
        proj.clientId,
        proj.title,
        proj.description,
        proj.status,
        proj.progress,
        0,
        proj.deadline,
        proj.projectType,
        proj.startDate,
        proj.priority,
        '[]',
        proj.notes,
        '[]'
      ]);

      // Insert tasks for this project
      let taskIdx = 1;
      for (const t of proj.tasks) {
        const taskTitle = typeof t === 'string' ? t : t.title;
        const taskCompleted = typeof t === 'object' ? Boolean(t.completed) : false;
        const assigned = assignees[(taskIdx - 1) % assignees.length];
        const taskId = `task-${proj.id}-${taskIdx}`;

        await client.query(`
          INSERT INTO tasks (id, project_id, client_id, title, due_date, completed, assigned_name, assigned_avatar)
          VALUES ($1, $2, $3, $4, $5, $6, $7, $8)
        `, [
          taskId,
          proj.id,
          proj.clientId,
          taskTitle,
          proj.deadline,
          taskCompleted,
          assigned.name,
          assigned.avatar
        ]);
        taskIdx++;
      }
    }

    console.log(`[Seed] Successfully seeded all 10 real projects and their tasks!`);
  } catch (err) {
    console.error('[Seed Error]', err);
  } finally {
    client.release();
    await pool.end();
  }
}

seedRealProjects();
