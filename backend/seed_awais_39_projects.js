const fs = require('fs');
const path = require('path');
const { Pool } = require('pg');

require('dotenv').config({ path: path.join(__dirname, '.env') });
require('dotenv').config({ path: path.join(__dirname, '../.env') });

const STORE_PATH = path.join(__dirname, 'data', 'store.json');

const rawProjectsList = [
  { idNum: 1, title: 'Fytnix.pk — Gym Wear — fytnix.pk', domain: 'fytnix.pk' },
  { idNum: 2, title: 'Dfynex Gym Wear', domain: '' },
  { idNum: 3, title: 'Sir Abdul Saboor WL Al Zariyah', domain: '' },
  { idNum: 4, title: 'Fasail Zubair KSA Emanzay — emanzay.com', domain: 'emanzay.com' },
  { idNum: 5, title: 'Zam Zam Royal WL — zamzamroyal.com', domain: 'zamzamroyal.com' },
  { idNum: 6, title: 'Riyyah — riyyah.store', domain: 'riyyah.store' },
  { idNum: 7, title: 'Al Zaria — alzaria.store', domain: 'alzaria.store' },
  { idNum: 8, title: 'Bacha World — bachaworld.pk', domain: 'bachaworld.pk' },
  { idNum: 9, title: 'KSA Usama Ali — arreja.com', domain: 'arreja.com' },
  { idNum: 10, title: 'Oxytees — oxytees.com', domain: 'oxytees.com' },
  { idNum: 11, title: 'Al Injaz Mart — alinjazmar.com', domain: 'alinjazmar.com' },
  { idNum: 12, title: 'Shahnawaz PK — aazaar.com', domain: 'aazaar.com' },
  { idNum: 13, title: 'Wearphere Gym Wear — wearphere.com', domain: 'wearphere.com' },
  { idNum: 14, title: 'Seebase — seebase.store', domain: 'seebase.store' },
  { idNum: 15, title: 'MrGymWear — mrgymwear.com', domain: 'mrgymwear.com' },
  { idNum: 16, title: 'Project WL (Canada)', domain: '' },
  { idNum: 17, title: 'Project Huggo — huggo.pk', domain: 'huggo.pk' },
  { idNum: 18, title: 'Project Saudi Excellence — saudiexcellence.com', domain: 'saudiexcellence.com' },
  { idNum: 19, title: 'Onlaro Team — onlaro.com', domain: 'onlaro.com' },
  { idNum: 20, title: 'Project Gymvare — gymvare.pk', domain: 'gymvare.pk' },
  { idNum: 21, title: 'KSA Project (Sundas) — stylinpakistan.myshopify.com', domain: 'stylinpakistan.myshopify.com' },
  { idNum: 22, title: 'Project Jafra Roots Co — jafrarootsco.com', domain: 'jafrarootsco.com' },
  { idNum: 23, title: 'Project Kiddora — kiddorahub.com', domain: 'kiddorahub.com' },
  { idNum: 24, title: 'Beavy-Tale Website Conversation — beavital.com', domain: 'beavital.com' },
  { idNum: 25, title: 'Project Amzefi — amzefi.com', domain: 'amzefi.com' },
  { idNum: 26, title: 'Vera&Co Website Redesigned — veranco.pk', domain: 'veranco.pk' },
  { idNum: 27, title: 'A-Z Fashion Mart — azfashionmart.com', domain: 'azfashionmart.com' },
  { idNum: 28, title: 'Project USA (Ali)', domain: '' },
  { idNum: 29, title: 'Project Youngla.pk', domain: 'youngla.pk' },
  { idNum: 30, title: 'KSA Project (Sundas)', domain: '' },
  { idNum: 31, title: 'Clients Daily Status & Pending Projects', domain: '' },
  { idNum: 32, title: 'Project Australia', domain: '' },
  { idNum: 33, title: 'Project Ireland', domain: '' },
  { idNum: 34, title: 'Shopify Apps Reviews', domain: '' },
  { idNum: 35, title: 'SA Ecom Services', domain: '' },
  { idNum: 36, title: 'KSA & Pakistan Working', domain: '' },
  { idNum: 37, title: 'MD Shadat eCommerce', domain: '' },
  { idNum: 38, title: 'Pk Wave Project WL', domain: '' },
  { idNum: 39, title: 'Project Amzefi', domain: '' }
];

const taskTitles = [
  'Header',
  'Graphics',
  'Product Page',
  'Product Card',
  'Other Pages',
  'Footer',
  'Buy and Connect Domain',
  'Final Changes'
];

const formatted39Projects = rawProjectsList.map((p) => {
  const projId = `proj-awais-hist-${p.idNum}`;
  const minute = String(40 - p.idNum).padStart(2, '0');
  const createdAt = `2026-08-18T10:${minute}:00.000Z`;
  const domainUrl = p.domain ? (p.domain.startsWith('http') ? p.domain : `https://${p.domain}`) : '';
  const description = p.domain
    ? `Completed client website project. Domain: ${p.domain}`
    : `Completed client project for Awais Agency.`;

  const tasks = taskTitles.map((title, tIdx) => ({
    id: `task-${projId}-${tIdx + 1}`,
    projectId: projId,
    project_id: projId,
    clientId: 'client-awais',
    client_id: 'client-awais',
    title: title,
    due_date: '25/08/2026',
    completed: true,
    assigned_name: (tIdx % 2 === 0) ? 'Abdullah' : 'Ameen',
    assigned_avatar: '',
    created_at: createdAt
  }));

  return {
    id: projId,
    clientId: 'client-awais',
    client_id: 'client-awais',
    clientName: 'Awais',
    title: p.title,
    description: description,
    notes: 'the projects was successfully completed by abdullah and ameen',
    projectType: 'Web Development',
    project_type: 'Web Development',
    status: 'completed',
    priority: 'Medium',
    deadline: '25/08/2026',
    startDate: '18/08/2026',
    start_date: '18/08/2026',
    progress: 100,
    budget: 0,
    reference_link: domainUrl,
    created_at: createdAt,
    tasks: tasks
  };
});

async function run() {
  console.log(`Starting insertion of ${formatted39Projects.length} historical completed projects for Awais...`);

  // 1. PostgreSQL insertion
  if (process.env.DATABASE_URL) {
    console.log('Connecting to Neon PostgreSQL pool...');
    const pool = new Pool({
      connectionString: process.env.DATABASE_URL,
      ssl: { rejectUnauthorized: false }
    });

    try {
      for (const p of formatted39Projects) {
        await pool.query(`
          INSERT INTO projects (
            id, client_id, title, description, status, progress, budget, deadline,
            project_type, start_date, priority, credentials, reference_link, notes, files, created_at
          )
          VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15, $16)
          ON CONFLICT (id) DO UPDATE SET
            title = EXCLUDED.title,
            description = EXCLUDED.description,
            status = EXCLUDED.status,
            progress = EXCLUDED.progress,
            budget = EXCLUDED.budget,
            deadline = EXCLUDED.deadline,
            project_type = EXCLUDED.project_type,
            start_date = EXCLUDED.start_date,
            priority = EXCLUDED.priority,
            reference_link = EXCLUDED.reference_link,
            notes = EXCLUDED.notes,
            created_at = EXCLUDED.created_at;
        `, [
          p.id,
          p.client_id,
          p.title,
          p.description,
          p.status,
          p.progress,
          p.budget,
          p.deadline,
          p.project_type,
          p.start_date,
          p.priority,
          '[]',
          p.reference_link,
          p.notes,
          '[]',
          p.created_at
        ]);

        for (const t of p.tasks) {
          await pool.query(`
            INSERT INTO tasks (
              id, project_id, client_id, title, due_date, completed, assigned_name, assigned_avatar, created_at
            )
            VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9)
            ON CONFLICT (id) DO UPDATE SET
              title = EXCLUDED.title,
              due_date = EXCLUDED.due_date,
              completed = EXCLUDED.completed,
              assigned_name = EXCLUDED.assigned_name,
              created_at = EXCLUDED.created_at;
          `, [
            t.id,
            t.project_id,
            t.client_id,
            t.title,
            t.due_date,
            t.completed,
            t.assigned_name,
            t.assigned_avatar,
            t.created_at
          ]);
        }
        console.log(`[PG] Saved: ${p.id} - ${p.title}`);
      }

      const verifyCount = await pool.query("SELECT count(*) FROM projects WHERE client_id = 'client-awais'");
      console.log(`[PG] Total Awais projects in DB: ${verifyCount.rows[0].count}`);

      const completedCount = await pool.query("SELECT count(*) FROM projects WHERE client_id = 'client-awais' AND (status = 'completed' OR progress = 100)");
      console.log(`[PG] Completed Awais projects in DB: ${completedCount.rows[0].count}`);

      const tasksCount = await pool.query("SELECT count(*) FROM tasks WHERE client_id = 'client-awais'");
      console.log(`[PG] Total Awais tasks in DB: ${tasksCount.rows[0].count}`);
    } catch (err) {
      console.error('[PG Error]', err.message);
      throw err;
    } finally {
      await pool.end();
    }
  }

  // 2. Update backend/data/store.json
  if (fs.existsSync(STORE_PATH)) {
    console.log('Updating backend/data/store.json...');
    const store = JSON.parse(fs.readFileSync(STORE_PATH, 'utf-8'));
    if (!store.projects) store.projects = [];
    if (!store.tasks) store.tasks = [];

    // Filter out previous hist items if any
    store.projects = store.projects.filter(p => !p.id.startsWith('proj-awais-hist-'));
    store.tasks = store.tasks.filter(t => !t.project_id.startsWith('proj-awais-hist-'));

    for (const p of formatted39Projects) {
      store.projects.push({
        id: p.id,
        client_id: p.client_id,
        title: p.title,
        description: p.description,
        notes: p.notes,
        project_type: p.project_type,
        status: p.status,
        priority: p.priority,
        deadline: p.deadline,
        start_date: p.start_date,
        progress: p.progress,
        budget: p.budget,
        credentials: [],
        files: [],
        reference_link: p.reference_link,
        created_at: p.created_at
      });

      for (const t of p.tasks) {
        store.tasks.push({
          id: t.id,
          project_id: t.project_id,
          client_id: t.client_id,
          title: t.title,
          due_date: t.due_date,
          completed: t.completed,
          assigned_name: t.assigned_name,
          assigned_avatar: t.assigned_avatar,
          created_at: t.created_at
        });
      }
    }

    fs.writeFileSync(STORE_PATH, JSON.stringify(store, null, 2), 'utf-8');
    console.log(`[Store] Updated store.json: total projects = ${store.projects.length}, total tasks = ${store.tasks.length}`);
  }

  console.log('ALL 39 PROJECTS & TASKS SUCCESSFULLY SAVED!');
}

run().catch(err => {
  console.error('Fatal error:', err);
  process.exit(1);
});
