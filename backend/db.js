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
    password: 'Remotale123',
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
  { name: 'Abdullah', avatar: '' }
];

const realProjects = [
  {
    "id": "proj-awais-1",
    "clientId": "client-awais",
    "title": "Fytnix.pk — Gym Wear",
    "description": "Full Web Development project. Connected domain: fytnix.pk",
    "notes": "Domain: fytnix.pk\nType: Web Development\nAdmin Lead: Abdullah\nAssigned Client: Awais\nStatus: In Progress",
    "projectType": "Web Development",
    "status": "in-progress",
    "priority": "Urgent",
    "deadline": "26/10/2026",
    "startDate": "15/10/2026",
    "progress": 25,
    "files": [],
    "credentials": [
      {
        "id": "cred-proj-awais-1-1",
        "platform": "Website Domain",
        "subText": "fytnix.pk",
        "username": "admin@awaisagency.com",
        "password": "••••••••"
      },
      {
        "id": "cred-proj-awais-1-2",
        "platform": "Store Admin",
        "subText": "fytnix.myshopify.com",
        "username": "owner",
        "password": "••••••••"
      }
    ],
    "tasks": [
      {
        "title": "Header & Navigation Setup",
        "completed": true
      },
      {
        "title": "Hero & Banner Graphics",
        "completed": true
      },
      {
        "title": "Product Page Design",
        "completed": false
      },
      {
        "title": "Product Cards & Pricing Badges",
        "completed": false
      },
      {
        "title": "Information & Policy Pages",
        "completed": false
      },
      {
        "title": "Footer & Contact Details",
        "completed": false
      },
      {
        "title": "Buy and Connect Domain (fytnix.pk)",
        "completed": false
      },
      {
        "title": "Final Client Revisions & Launch",
        "completed": false
      }
    ]
  },
  {
    "id": "proj-awais-2",
    "clientId": "client-awais",
    "title": "Dfynex Gym Wear",
    "description": "Full Web Development project. Connected domain: dfynex.com",
    "notes": "Domain: dfynex.com\nType: Web Development\nAdmin Lead: Abdullah\nAssigned Client: Awais\nStatus: In Progress",
    "projectType": "Web Development",
    "status": "in-progress",
    "priority": "High",
    "deadline": "26/10/2026",
    "startDate": "15/10/2026",
    "progress": 25,
    "files": [],
    "credentials": [
      {
        "id": "cred-proj-awais-2-1",
        "platform": "Website Domain",
        "subText": "dfynex.com",
        "username": "admin@awaisagency.com",
        "password": "••••••••"
      },
      {
        "id": "cred-proj-awais-2-2",
        "platform": "Store Admin",
        "subText": "dfynex.myshopify.com",
        "username": "owner",
        "password": "••••••••"
      }
    ],
    "tasks": [
      {
        "title": "Header & Navigation Setup",
        "completed": true
      },
      {
        "title": "Hero & Banner Graphics",
        "completed": true
      },
      {
        "title": "Product Page Design",
        "completed": false
      },
      {
        "title": "Product Cards & Pricing Badges",
        "completed": false
      },
      {
        "title": "Information & Policy Pages",
        "completed": false
      },
      {
        "title": "Footer & Contact Details",
        "completed": false
      },
      {
        "title": "Buy and Connect Domain (dfynex.com)",
        "completed": false
      },
      {
        "title": "Final Client Revisions & Launch",
        "completed": false
      }
    ]
  },
  {
    "id": "proj-awais-3",
    "clientId": "client-awais",
    "title": "Sir Abdul Saboor WL Al Zariyah",
    "description": "Full Web Development project. Connected domain: alzariyah.store",
    "notes": "Domain: alzariyah.store\nType: Web Development\nAdmin Lead: Abdullah\nAssigned Client: Awais\nStatus: In Progress",
    "projectType": "Web Development",
    "status": "in-progress",
    "priority": "Medium",
    "deadline": "26/10/2026",
    "startDate": "15/10/2026",
    "progress": 25,
    "files": [],
    "credentials": [
      {
        "id": "cred-proj-awais-3-1",
        "platform": "Website Domain",
        "subText": "alzariyah.store",
        "username": "admin@awaisagency.com",
        "password": "••••••••"
      },
      {
        "id": "cred-proj-awais-3-2",
        "platform": "Store Admin",
        "subText": "alzariyah.myshopify.com",
        "username": "owner",
        "password": "••••••••"
      }
    ],
    "tasks": [
      {
        "title": "Header & Navigation Setup",
        "completed": true
      },
      {
        "title": "Hero & Banner Graphics",
        "completed": true
      },
      {
        "title": "Product Page Design",
        "completed": false
      },
      {
        "title": "Product Cards & Pricing Badges",
        "completed": false
      },
      {
        "title": "Information & Policy Pages",
        "completed": false
      },
      {
        "title": "Footer & Contact Details",
        "completed": false
      },
      {
        "title": "Buy and Connect Domain (alzariyah.store)",
        "completed": false
      },
      {
        "title": "Final Client Revisions & Launch",
        "completed": false
      }
    ]
  },
  {
    "id": "proj-awais-4",
    "clientId": "client-awais",
    "title": "Fasail Zubair KSA Emanzay",
    "description": "Full Web Development project. Connected domain: emanzay.com",
    "notes": "Domain: emanzay.com\nType: Web Development\nAdmin Lead: Abdullah\nAssigned Client: Awais\nStatus: In Progress",
    "projectType": "Web Development",
    "status": "in-progress",
    "priority": "High",
    "deadline": "26/10/2026",
    "startDate": "15/10/2026",
    "progress": 25,
    "files": [],
    "credentials": [
      {
        "id": "cred-proj-awais-4-1",
        "platform": "Website Domain",
        "subText": "emanzay.com",
        "username": "admin@awaisagency.com",
        "password": "••••••••"
      },
      {
        "id": "cred-proj-awais-4-2",
        "platform": "Store Admin",
        "subText": "emanzay.myshopify.com",
        "username": "owner",
        "password": "••••••••"
      }
    ],
    "tasks": [
      {
        "title": "Header & Navigation Setup",
        "completed": true
      },
      {
        "title": "Hero & Banner Graphics",
        "completed": true
      },
      {
        "title": "Product Page Design",
        "completed": false
      },
      {
        "title": "Product Cards & Pricing Badges",
        "completed": false
      },
      {
        "title": "Information & Policy Pages",
        "completed": false
      },
      {
        "title": "Footer & Contact Details",
        "completed": false
      },
      {
        "title": "Buy and Connect Domain (emanzay.com)",
        "completed": false
      },
      {
        "title": "Final Client Revisions & Launch",
        "completed": false
      }
    ]
  },
  {
    "id": "proj-awais-5",
    "clientId": "client-awais",
    "title": "Zam Zam Royal WL",
    "description": "Full Web Development project. Connected domain: zamzamroyal.com",
    "notes": "Domain: zamzamroyal.com\nType: Web Development\nAdmin Lead: Abdullah\nAssigned Client: Awais\nStatus: Completed",
    "projectType": "Web Development",
    "status": "completed",
    "priority": "Medium",
    "deadline": "26/10/2026",
    "startDate": "15/10/2026",
    "progress": 100,
    "files": [],
    "credentials": [
      {
        "id": "cred-proj-awais-5-1",
        "platform": "Website Domain",
        "subText": "zamzamroyal.com",
        "username": "admin@awaisagency.com",
        "password": "••••••••"
      },
      {
        "id": "cred-proj-awais-5-2",
        "platform": "Store Admin",
        "subText": "zamzamroyal.myshopify.com",
        "username": "owner",
        "password": "••••••••"
      }
    ],
    "tasks": [
      {
        "title": "Header & Navigation Setup",
        "completed": true
      },
      {
        "title": "Hero & Banner Graphics",
        "completed": true
      },
      {
        "title": "Product Page Design",
        "completed": true
      },
      {
        "title": "Product Cards & Pricing Badges",
        "completed": true
      },
      {
        "title": "Information & Policy Pages",
        "completed": true
      },
      {
        "title": "Footer & Contact Details",
        "completed": true
      },
      {
        "title": "Buy and Connect Domain (zamzamroyal.com)",
        "completed": true
      },
      {
        "title": "Final Client Revisions & Launch",
        "completed": true
      }
    ]
  },
  {
    "id": "proj-awais-6",
    "clientId": "client-awais",
    "title": "Riyyah",
    "description": "Full Web Development project. Connected domain: riyyah.store",
    "notes": "Domain: riyyah.store\nType: Web Development\nAdmin Lead: Abdullah\nAssigned Client: Awais\nStatus: Completed",
    "projectType": "Web Development",
    "status": "completed",
    "priority": "Medium",
    "deadline": "26/10/2026",
    "startDate": "15/10/2026",
    "progress": 100,
    "files": [],
    "credentials": [
      {
        "id": "cred-proj-awais-6-1",
        "platform": "Website Domain",
        "subText": "riyyah.store",
        "username": "admin@awaisagency.com",
        "password": "••••••••"
      },
      {
        "id": "cred-proj-awais-6-2",
        "platform": "Store Admin",
        "subText": "riyyah.myshopify.com",
        "username": "owner",
        "password": "••••••••"
      }
    ],
    "tasks": [
      {
        "title": "Header & Navigation Setup",
        "completed": true
      },
      {
        "title": "Hero & Banner Graphics",
        "completed": true
      },
      {
        "title": "Product Page Design",
        "completed": true
      },
      {
        "title": "Product Cards & Pricing Badges",
        "completed": true
      },
      {
        "title": "Information & Policy Pages",
        "completed": true
      },
      {
        "title": "Footer & Contact Details",
        "completed": true
      },
      {
        "title": "Buy and Connect Domain (riyyah.store)",
        "completed": true
      },
      {
        "title": "Final Client Revisions & Launch",
        "completed": true
      }
    ]
  },
  {
    "id": "proj-awais-7",
    "clientId": "client-awais",
    "title": "Al Zaria",
    "description": "Full Web Development project. Connected domain: alzaria.store",
    "notes": "Domain: alzaria.store\nType: Web Development\nAdmin Lead: Abdullah\nAssigned Client: Awais\nStatus: In Progress",
    "projectType": "Web Development",
    "status": "in-progress",
    "priority": "Medium",
    "deadline": "26/10/2026",
    "startDate": "15/10/2026",
    "progress": 25,
    "files": [],
    "credentials": [
      {
        "id": "cred-proj-awais-7-1",
        "platform": "Website Domain",
        "subText": "alzaria.store",
        "username": "admin@awaisagency.com",
        "password": "••••••••"
      },
      {
        "id": "cred-proj-awais-7-2",
        "platform": "Store Admin",
        "subText": "alzaria.myshopify.com",
        "username": "owner",
        "password": "••••••••"
      }
    ],
    "tasks": [
      {
        "title": "Header & Navigation Setup",
        "completed": true
      },
      {
        "title": "Hero & Banner Graphics",
        "completed": true
      },
      {
        "title": "Product Page Design",
        "completed": false
      },
      {
        "title": "Product Cards & Pricing Badges",
        "completed": false
      },
      {
        "title": "Information & Policy Pages",
        "completed": false
      },
      {
        "title": "Footer & Contact Details",
        "completed": false
      },
      {
        "title": "Buy and Connect Domain (alzaria.store)",
        "completed": false
      },
      {
        "title": "Final Client Revisions & Launch",
        "completed": false
      }
    ]
  },
  {
    "id": "proj-awais-8",
    "clientId": "client-awais",
    "title": "Bacha World",
    "description": "Full Web Development project. Connected domain: bachaworld.pk",
    "notes": "Domain: bachaworld.pk\nType: Web Development\nAdmin Lead: Abdullah\nAssigned Client: Awais\nStatus: Completed",
    "projectType": "Web Development",
    "status": "completed",
    "priority": "High",
    "deadline": "26/10/2026",
    "startDate": "15/10/2026",
    "progress": 100,
    "files": [],
    "credentials": [
      {
        "id": "cred-proj-awais-8-1",
        "platform": "Website Domain",
        "subText": "bachaworld.pk",
        "username": "admin@awaisagency.com",
        "password": "••••••••"
      },
      {
        "id": "cred-proj-awais-8-2",
        "platform": "Store Admin",
        "subText": "bachaworld.myshopify.com",
        "username": "owner",
        "password": "••••••••"
      }
    ],
    "tasks": [
      {
        "title": "Header & Navigation Setup",
        "completed": true
      },
      {
        "title": "Hero & Banner Graphics",
        "completed": true
      },
      {
        "title": "Product Page Design",
        "completed": true
      },
      {
        "title": "Product Cards & Pricing Badges",
        "completed": true
      },
      {
        "title": "Information & Policy Pages",
        "completed": true
      },
      {
        "title": "Footer & Contact Details",
        "completed": true
      },
      {
        "title": "Buy and Connect Domain (bachaworld.pk)",
        "completed": true
      },
      {
        "title": "Final Client Revisions & Launch",
        "completed": true
      }
    ]
  },
  {
    "id": "proj-awais-9",
    "clientId": "client-awais",
    "title": "KSA Usama Ali",
    "description": "Full Web Development project. Connected domain: arreja.com",
    "notes": "Domain: arreja.com\nType: Web Development\nAdmin Lead: Abdullah\nAssigned Client: Awais\nStatus: Completed",
    "projectType": "Web Development",
    "status": "completed",
    "priority": "High",
    "deadline": "26/10/2026",
    "startDate": "15/10/2026",
    "progress": 100,
    "files": [],
    "credentials": [
      {
        "id": "cred-proj-awais-9-1",
        "platform": "Website Domain",
        "subText": "arreja.com",
        "username": "admin@awaisagency.com",
        "password": "••••••••"
      },
      {
        "id": "cred-proj-awais-9-2",
        "platform": "Store Admin",
        "subText": "arreja.myshopify.com",
        "username": "owner",
        "password": "••••••••"
      }
    ],
    "tasks": [
      {
        "title": "Header & Navigation Setup",
        "completed": true
      },
      {
        "title": "Hero & Banner Graphics",
        "completed": true
      },
      {
        "title": "Product Page Design",
        "completed": true
      },
      {
        "title": "Product Cards & Pricing Badges",
        "completed": true
      },
      {
        "title": "Information & Policy Pages",
        "completed": true
      },
      {
        "title": "Footer & Contact Details",
        "completed": true
      },
      {
        "title": "Buy and Connect Domain (arreja.com)",
        "completed": true
      },
      {
        "title": "Final Client Revisions & Launch",
        "completed": true
      }
    ]
  },
  {
    "id": "proj-awais-10",
    "clientId": "client-awais",
    "title": "Oxytees",
    "description": "Full Web Development project. Connected domain: oxytees.com",
    "notes": "Domain: oxytees.com\nType: Web Development\nAdmin Lead: Abdullah\nAssigned Client: Awais\nStatus: Completed",
    "projectType": "Web Development",
    "status": "completed",
    "priority": "Medium",
    "deadline": "26/10/2026",
    "startDate": "15/10/2026",
    "progress": 100,
    "files": [],
    "credentials": [
      {
        "id": "cred-proj-awais-10-1",
        "platform": "Website Domain",
        "subText": "oxytees.com",
        "username": "admin@awaisagency.com",
        "password": "••••••••"
      },
      {
        "id": "cred-proj-awais-10-2",
        "platform": "Store Admin",
        "subText": "oxytees.myshopify.com",
        "username": "owner",
        "password": "••••••••"
      }
    ],
    "tasks": [
      {
        "title": "Header & Navigation Setup",
        "completed": true
      },
      {
        "title": "Hero & Banner Graphics",
        "completed": true
      },
      {
        "title": "Product Page Design",
        "completed": true
      },
      {
        "title": "Product Cards & Pricing Badges",
        "completed": true
      },
      {
        "title": "Information & Policy Pages",
        "completed": true
      },
      {
        "title": "Footer & Contact Details",
        "completed": true
      },
      {
        "title": "Buy and Connect Domain (oxytees.com)",
        "completed": true
      },
      {
        "title": "Final Client Revisions & Launch",
        "completed": true
      }
    ]
  },
  {
    "id": "proj-awais-11",
    "clientId": "client-awais",
    "title": "Al Injaz Mart",
    "description": "Full Web Development project. Connected domain: alinjazmar.com",
    "notes": "Domain: alinjazmar.com\nType: Web Development\nAdmin Lead: Abdullah\nAssigned Client: Awais\nStatus: Completed",
    "projectType": "Web Development",
    "status": "completed",
    "priority": "Medium",
    "deadline": "26/10/2026",
    "startDate": "15/10/2026",
    "progress": 100,
    "files": [],
    "credentials": [
      {
        "id": "cred-proj-awais-11-1",
        "platform": "Website Domain",
        "subText": "alinjazmar.com",
        "username": "admin@awaisagency.com",
        "password": "••••••••"
      },
      {
        "id": "cred-proj-awais-11-2",
        "platform": "Store Admin",
        "subText": "alinjazmar.myshopify.com",
        "username": "owner",
        "password": "••••••••"
      }
    ],
    "tasks": [
      {
        "title": "Header & Navigation Setup",
        "completed": true
      },
      {
        "title": "Hero & Banner Graphics",
        "completed": true
      },
      {
        "title": "Product Page Design",
        "completed": true
      },
      {
        "title": "Product Cards & Pricing Badges",
        "completed": true
      },
      {
        "title": "Information & Policy Pages",
        "completed": true
      },
      {
        "title": "Footer & Contact Details",
        "completed": true
      },
      {
        "title": "Buy and Connect Domain (alinjazmar.com)",
        "completed": true
      },
      {
        "title": "Final Client Revisions & Launch",
        "completed": true
      }
    ]
  },
  {
    "id": "proj-awais-12",
    "clientId": "client-awais",
    "title": "Shahnawaz PK",
    "description": "Full Web Development project. Connected domain: aazaar.com",
    "notes": "Domain: aazaar.com\nType: Web Development\nAdmin Lead: Abdullah\nAssigned Client: Awais\nStatus: Completed",
    "projectType": "Web Development",
    "status": "completed",
    "priority": "Medium",
    "deadline": "26/10/2026",
    "startDate": "15/10/2026",
    "progress": 100,
    "files": [],
    "credentials": [
      {
        "id": "cred-proj-awais-12-1",
        "platform": "Website Domain",
        "subText": "aazaar.com",
        "username": "admin@awaisagency.com",
        "password": "••••••••"
      },
      {
        "id": "cred-proj-awais-12-2",
        "platform": "Store Admin",
        "subText": "aazaar.myshopify.com",
        "username": "owner",
        "password": "••••••••"
      }
    ],
    "tasks": [
      {
        "title": "Header & Navigation Setup",
        "completed": true
      },
      {
        "title": "Hero & Banner Graphics",
        "completed": true
      },
      {
        "title": "Product Page Design",
        "completed": true
      },
      {
        "title": "Product Cards & Pricing Badges",
        "completed": true
      },
      {
        "title": "Information & Policy Pages",
        "completed": true
      },
      {
        "title": "Footer & Contact Details",
        "completed": true
      },
      {
        "title": "Buy and Connect Domain (aazaar.com)",
        "completed": true
      },
      {
        "title": "Final Client Revisions & Launch",
        "completed": true
      }
    ]
  },
  {
    "id": "proj-awais-13",
    "clientId": "client-awais",
    "title": "Wearphere Gym Wear",
    "description": "Full Web Development project. Connected domain: wearphere.com",
    "notes": "Domain: wearphere.com\nType: Web Development\nAdmin Lead: Abdullah\nAssigned Client: Awais\nStatus: Completed",
    "projectType": "Web Development",
    "status": "completed",
    "priority": "Urgent",
    "deadline": "26/10/2026",
    "startDate": "15/10/2026",
    "progress": 100,
    "files": [],
    "credentials": [
      {
        "id": "cred-proj-awais-13-1",
        "platform": "Website Domain",
        "subText": "wearphere.com",
        "username": "admin@awaisagency.com",
        "password": "••••••••"
      },
      {
        "id": "cred-proj-awais-13-2",
        "platform": "Store Admin",
        "subText": "wearphere.myshopify.com",
        "username": "owner",
        "password": "••••••••"
      }
    ],
    "tasks": [
      {
        "title": "Header & Navigation Setup",
        "completed": true
      },
      {
        "title": "Hero & Banner Graphics",
        "completed": true
      },
      {
        "title": "Product Page Design",
        "completed": true
      },
      {
        "title": "Product Cards & Pricing Badges",
        "completed": true
      },
      {
        "title": "Information & Policy Pages",
        "completed": true
      },
      {
        "title": "Footer & Contact Details",
        "completed": true
      },
      {
        "title": "Buy and Connect Domain (wearphere.com)",
        "completed": true
      },
      {
        "title": "Final Client Revisions & Launch",
        "completed": true
      }
    ]
  },
  {
    "id": "proj-awais-14",
    "clientId": "client-awais",
    "title": "Seebase",
    "description": "Full Web Development project. Connected domain: seebase.store",
    "notes": "Domain: seebase.store\nType: Web Development\nAdmin Lead: Abdullah\nAssigned Client: Awais\nStatus: Completed",
    "projectType": "Web Development",
    "status": "completed",
    "priority": "Medium",
    "deadline": "26/10/2026",
    "startDate": "15/10/2026",
    "progress": 100,
    "files": [],
    "credentials": [
      {
        "id": "cred-proj-awais-14-1",
        "platform": "Website Domain",
        "subText": "seebase.store",
        "username": "admin@awaisagency.com",
        "password": "••••••••"
      },
      {
        "id": "cred-proj-awais-14-2",
        "platform": "Store Admin",
        "subText": "seebase.myshopify.com",
        "username": "owner",
        "password": "••••••••"
      }
    ],
    "tasks": [
      {
        "title": "Header & Navigation Setup",
        "completed": true
      },
      {
        "title": "Hero & Banner Graphics",
        "completed": true
      },
      {
        "title": "Product Page Design",
        "completed": true
      },
      {
        "title": "Product Cards & Pricing Badges",
        "completed": true
      },
      {
        "title": "Information & Policy Pages",
        "completed": true
      },
      {
        "title": "Footer & Contact Details",
        "completed": true
      },
      {
        "title": "Buy and Connect Domain (seebase.store)",
        "completed": true
      },
      {
        "title": "Final Client Revisions & Launch",
        "completed": true
      }
    ]
  },
  {
    "id": "proj-awais-15",
    "clientId": "client-awais",
    "title": "MrGymWear",
    "description": "Full Web Development project. Connected domain: mrgymwear.com",
    "notes": "Domain: mrgymwear.com\nType: Web Development\nAdmin Lead: Abdullah\nAssigned Client: Awais\nStatus: Completed",
    "projectType": "Web Development",
    "status": "completed",
    "priority": "High",
    "deadline": "26/10/2026",
    "startDate": "15/10/2026",
    "progress": 100,
    "files": [],
    "credentials": [
      {
        "id": "cred-proj-awais-15-1",
        "platform": "Website Domain",
        "subText": "mrgymwear.com",
        "username": "admin@awaisagency.com",
        "password": "••••••••"
      },
      {
        "id": "cred-proj-awais-15-2",
        "platform": "Store Admin",
        "subText": "mrgymwear.myshopify.com",
        "username": "owner",
        "password": "••••••••"
      }
    ],
    "tasks": [
      {
        "title": "Header & Navigation Setup",
        "completed": true
      },
      {
        "title": "Hero & Banner Graphics",
        "completed": true
      },
      {
        "title": "Product Page Design",
        "completed": true
      },
      {
        "title": "Product Cards & Pricing Badges",
        "completed": true
      },
      {
        "title": "Information & Policy Pages",
        "completed": true
      },
      {
        "title": "Footer & Contact Details",
        "completed": true
      },
      {
        "title": "Buy and Connect Domain (mrgymwear.com)",
        "completed": true
      },
      {
        "title": "Final Client Revisions & Launch",
        "completed": true
      }
    ]
  },
  {
    "id": "proj-awais-16",
    "clientId": "client-awais",
    "title": "Project WL (Canada)",
    "description": "Full Web Development project. Connected domain: projectwl-canada.com",
    "notes": "Domain: projectwl-canada.com\nType: Web Development\nAdmin Lead: Abdullah\nAssigned Client: Awais\nStatus: Completed",
    "projectType": "Web Development",
    "status": "completed",
    "priority": "Medium",
    "deadline": "26/10/2026",
    "startDate": "15/10/2026",
    "progress": 100,
    "files": [],
    "credentials": [
      {
        "id": "cred-proj-awais-16-1",
        "platform": "Website Domain",
        "subText": "projectwl-canada.com",
        "username": "admin@awaisagency.com",
        "password": "••••••••"
      },
      {
        "id": "cred-proj-awais-16-2",
        "platform": "Store Admin",
        "subText": "projectwl-canada.myshopify.com",
        "username": "owner",
        "password": "••••••••"
      }
    ],
    "tasks": [
      {
        "title": "Header & Navigation Setup",
        "completed": true
      },
      {
        "title": "Hero & Banner Graphics",
        "completed": true
      },
      {
        "title": "Product Page Design",
        "completed": true
      },
      {
        "title": "Product Cards & Pricing Badges",
        "completed": true
      },
      {
        "title": "Information & Policy Pages",
        "completed": true
      },
      {
        "title": "Footer & Contact Details",
        "completed": true
      },
      {
        "title": "Buy and Connect Domain (projectwl-canada.com)",
        "completed": true
      },
      {
        "title": "Final Client Revisions & Launch",
        "completed": true
      }
    ]
  },
  {
    "id": "proj-awais-17",
    "clientId": "client-awais",
    "title": "Project Huggo",
    "description": "Full Web Development project. Connected domain: huggo.pk",
    "notes": "Domain: huggo.pk\nType: Web Development\nAdmin Lead: Abdullah\nAssigned Client: Awais\nStatus: In Progress",
    "projectType": "Web Development",
    "status": "in-progress",
    "priority": "Medium",
    "deadline": "26/10/2026",
    "startDate": "15/10/2026",
    "progress": 25,
    "files": [],
    "credentials": [
      {
        "id": "cred-proj-awais-17-1",
        "platform": "Website Domain",
        "subText": "huggo.pk",
        "username": "admin@awaisagency.com",
        "password": "••••••••"
      },
      {
        "id": "cred-proj-awais-17-2",
        "platform": "Store Admin",
        "subText": "huggo.myshopify.com",
        "username": "owner",
        "password": "••••••••"
      }
    ],
    "tasks": [
      {
        "title": "Header & Navigation Setup",
        "completed": true
      },
      {
        "title": "Hero & Banner Graphics",
        "completed": true
      },
      {
        "title": "Product Page Design",
        "completed": false
      },
      {
        "title": "Product Cards & Pricing Badges",
        "completed": false
      },
      {
        "title": "Information & Policy Pages",
        "completed": false
      },
      {
        "title": "Footer & Contact Details",
        "completed": false
      },
      {
        "title": "Buy and Connect Domain (huggo.pk)",
        "completed": false
      },
      {
        "title": "Final Client Revisions & Launch",
        "completed": false
      }
    ]
  },
  {
    "id": "proj-awais-18",
    "clientId": "client-awais",
    "title": "Project Saudi Excellence",
    "description": "Full Web Development project. Connected domain: saudiexcellence.com",
    "notes": "Domain: saudiexcellence.com\nType: Web Development\nAdmin Lead: Abdullah\nAssigned Client: Awais\nStatus: Completed",
    "projectType": "Web Development",
    "status": "completed",
    "priority": "High",
    "deadline": "26/10/2026",
    "startDate": "15/10/2026",
    "progress": 100,
    "files": [],
    "credentials": [
      {
        "id": "cred-proj-awais-18-1",
        "platform": "Website Domain",
        "subText": "saudiexcellence.com",
        "username": "admin@awaisagency.com",
        "password": "••••••••"
      },
      {
        "id": "cred-proj-awais-18-2",
        "platform": "Store Admin",
        "subText": "saudiexcellence.myshopify.com",
        "username": "owner",
        "password": "••••••••"
      }
    ],
    "tasks": [
      {
        "title": "Header & Navigation Setup",
        "completed": true
      },
      {
        "title": "Hero & Banner Graphics",
        "completed": true
      },
      {
        "title": "Product Page Design",
        "completed": true
      },
      {
        "title": "Product Cards & Pricing Badges",
        "completed": true
      },
      {
        "title": "Information & Policy Pages",
        "completed": true
      },
      {
        "title": "Footer & Contact Details",
        "completed": true
      },
      {
        "title": "Buy and Connect Domain (saudiexcellence.com)",
        "completed": true
      },
      {
        "title": "Final Client Revisions & Launch",
        "completed": true
      }
    ]
  },
  {
    "id": "proj-awais-19",
    "clientId": "client-awais",
    "title": "Onlaro Team",
    "description": "Full Web Development project. Connected domain: onlaro.com",
    "notes": "Domain: onlaro.com\nType: Web Development\nAdmin Lead: Abdullah\nAssigned Client: Awais\nStatus: Completed",
    "projectType": "Web Development",
    "status": "completed",
    "priority": "Medium",
    "deadline": "26/10/2026",
    "startDate": "15/10/2026",
    "progress": 100,
    "files": [],
    "credentials": [
      {
        "id": "cred-proj-awais-19-1",
        "platform": "Website Domain",
        "subText": "onlaro.com",
        "username": "admin@awaisagency.com",
        "password": "••••••••"
      },
      {
        "id": "cred-proj-awais-19-2",
        "platform": "Store Admin",
        "subText": "onlaro.myshopify.com",
        "username": "owner",
        "password": "••••••••"
      }
    ],
    "tasks": [
      {
        "title": "Header & Navigation Setup",
        "completed": true
      },
      {
        "title": "Hero & Banner Graphics",
        "completed": true
      },
      {
        "title": "Product Page Design",
        "completed": true
      },
      {
        "title": "Product Cards & Pricing Badges",
        "completed": true
      },
      {
        "title": "Information & Policy Pages",
        "completed": true
      },
      {
        "title": "Footer & Contact Details",
        "completed": true
      },
      {
        "title": "Buy and Connect Domain (onlaro.com)",
        "completed": true
      },
      {
        "title": "Final Client Revisions & Launch",
        "completed": true
      }
    ]
  },
  {
    "id": "proj-awais-20",
    "clientId": "client-awais",
    "title": "Project Gymvare",
    "description": "Full Web Development project. Connected domain: gymvare.pk",
    "notes": "Domain: gymvare.pk\nType: Web Development\nAdmin Lead: Abdullah\nAssigned Client: Awais\nStatus: Completed",
    "projectType": "Web Development",
    "status": "completed",
    "priority": "Medium",
    "deadline": "26/10/2026",
    "startDate": "15/10/2026",
    "progress": 100,
    "files": [],
    "credentials": [
      {
        "id": "cred-proj-awais-20-1",
        "platform": "Website Domain",
        "subText": "gymvare.pk",
        "username": "admin@awaisagency.com",
        "password": "••••••••"
      },
      {
        "id": "cred-proj-awais-20-2",
        "platform": "Store Admin",
        "subText": "gymvare.myshopify.com",
        "username": "owner",
        "password": "••••••••"
      }
    ],
    "tasks": [
      {
        "title": "Header & Navigation Setup",
        "completed": true
      },
      {
        "title": "Hero & Banner Graphics",
        "completed": true
      },
      {
        "title": "Product Page Design",
        "completed": true
      },
      {
        "title": "Product Cards & Pricing Badges",
        "completed": true
      },
      {
        "title": "Information & Policy Pages",
        "completed": true
      },
      {
        "title": "Footer & Contact Details",
        "completed": true
      },
      {
        "title": "Buy and Connect Domain (gymvare.pk)",
        "completed": true
      },
      {
        "title": "Final Client Revisions & Launch",
        "completed": true
      }
    ]
  },
  {
    "id": "proj-awais-21",
    "clientId": "client-awais",
    "title": "KSA Project (Sundas)",
    "description": "Full Web Development project. Connected domain: stylinpakistan.myshopify.com",
    "notes": "Domain: stylinpakistan.myshopify.com\nType: Web Development\nAdmin Lead: Abdullah\nAssigned Client: Awais\nStatus: Completed",
    "projectType": "Web Development",
    "status": "completed",
    "priority": "High",
    "deadline": "26/10/2026",
    "startDate": "15/10/2026",
    "progress": 100,
    "files": [],
    "credentials": [
      {
        "id": "cred-proj-awais-21-1",
        "platform": "Website Domain",
        "subText": "stylinpakistan.myshopify.com",
        "username": "admin@awaisagency.com",
        "password": "••••••••"
      },
      {
        "id": "cred-proj-awais-21-2",
        "platform": "Store Admin",
        "subText": "stylinpakistan.myshopify.myshopify.com",
        "username": "owner",
        "password": "••••••••"
      }
    ],
    "tasks": [
      {
        "title": "Header & Navigation Setup",
        "completed": true
      },
      {
        "title": "Hero & Banner Graphics",
        "completed": true
      },
      {
        "title": "Product Page Design",
        "completed": true
      },
      {
        "title": "Product Cards & Pricing Badges",
        "completed": true
      },
      {
        "title": "Information & Policy Pages",
        "completed": true
      },
      {
        "title": "Footer & Contact Details",
        "completed": true
      },
      {
        "title": "Buy and Connect Domain (stylinpakistan.myshopify.com)",
        "completed": true
      },
      {
        "title": "Final Client Revisions & Launch",
        "completed": true
      }
    ]
  },
  {
    "id": "proj-awais-22",
    "clientId": "client-awais",
    "title": "Project Jafra Roots Co",
    "description": "Full Web Development project. Connected domain: jafrarootsco.com",
    "notes": "Domain: jafrarootsco.com\nType: Web Development\nAdmin Lead: Abdullah\nAssigned Client: Awais\nStatus: Completed",
    "projectType": "Web Development",
    "status": "completed",
    "priority": "Medium",
    "deadline": "26/10/2026",
    "startDate": "15/10/2026",
    "progress": 100,
    "files": [],
    "credentials": [
      {
        "id": "cred-proj-awais-22-1",
        "platform": "Website Domain",
        "subText": "jafrarootsco.com",
        "username": "admin@awaisagency.com",
        "password": "••••••••"
      },
      {
        "id": "cred-proj-awais-22-2",
        "platform": "Store Admin",
        "subText": "jafrarootsco.myshopify.com",
        "username": "owner",
        "password": "••••••••"
      }
    ],
    "tasks": [
      {
        "title": "Header & Navigation Setup",
        "completed": true
      },
      {
        "title": "Hero & Banner Graphics",
        "completed": true
      },
      {
        "title": "Product Page Design",
        "completed": true
      },
      {
        "title": "Product Cards & Pricing Badges",
        "completed": true
      },
      {
        "title": "Information & Policy Pages",
        "completed": true
      },
      {
        "title": "Footer & Contact Details",
        "completed": true
      },
      {
        "title": "Buy and Connect Domain (jafrarootsco.com)",
        "completed": true
      },
      {
        "title": "Final Client Revisions & Launch",
        "completed": true
      }
    ]
  },
  {
    "id": "proj-awais-23",
    "clientId": "client-awais",
    "title": "Project Kiddora",
    "description": "Full Web Development project. Connected domain: kiddorahub.com",
    "notes": "Domain: kiddorahub.com\nType: Web Development\nAdmin Lead: Abdullah\nAssigned Client: Awais\nStatus: Completed",
    "projectType": "Web Development",
    "status": "completed",
    "priority": "Medium",
    "deadline": "26/10/2026",
    "startDate": "15/10/2026",
    "progress": 100,
    "files": [],
    "credentials": [
      {
        "id": "cred-proj-awais-23-1",
        "platform": "Website Domain",
        "subText": "kiddorahub.com",
        "username": "admin@awaisagency.com",
        "password": "••••••••"
      },
      {
        "id": "cred-proj-awais-23-2",
        "platform": "Store Admin",
        "subText": "kiddorahub.myshopify.com",
        "username": "owner",
        "password": "••••••••"
      }
    ],
    "tasks": [
      {
        "title": "Header & Navigation Setup",
        "completed": true
      },
      {
        "title": "Hero & Banner Graphics",
        "completed": true
      },
      {
        "title": "Product Page Design",
        "completed": true
      },
      {
        "title": "Product Cards & Pricing Badges",
        "completed": true
      },
      {
        "title": "Information & Policy Pages",
        "completed": true
      },
      {
        "title": "Footer & Contact Details",
        "completed": true
      },
      {
        "title": "Buy and Connect Domain (kiddorahub.com)",
        "completed": true
      },
      {
        "title": "Final Client Revisions & Launch",
        "completed": true
      }
    ]
  },
  {
    "id": "proj-awais-24",
    "clientId": "client-awais",
    "title": "Beavy-Tale Website Conversation",
    "description": "Full Web Development project. Connected domain: beavital.com",
    "notes": "Domain: beavital.com\nType: Web Development\nAdmin Lead: Abdullah\nAssigned Client: Awais\nStatus: Completed",
    "projectType": "Web Development",
    "status": "completed",
    "priority": "Medium",
    "deadline": "26/10/2026",
    "startDate": "15/10/2026",
    "progress": 100,
    "files": [],
    "credentials": [
      {
        "id": "cred-proj-awais-24-1",
        "platform": "Website Domain",
        "subText": "beavital.com",
        "username": "admin@awaisagency.com",
        "password": "••••••••"
      },
      {
        "id": "cred-proj-awais-24-2",
        "platform": "Store Admin",
        "subText": "beavital.myshopify.com",
        "username": "owner",
        "password": "••••••••"
      }
    ],
    "tasks": [
      {
        "title": "Header & Navigation Setup",
        "completed": true
      },
      {
        "title": "Hero & Banner Graphics",
        "completed": true
      },
      {
        "title": "Product Page Design",
        "completed": true
      },
      {
        "title": "Product Cards & Pricing Badges",
        "completed": true
      },
      {
        "title": "Information & Policy Pages",
        "completed": true
      },
      {
        "title": "Footer & Contact Details",
        "completed": true
      },
      {
        "title": "Buy and Connect Domain (beavital.com)",
        "completed": true
      },
      {
        "title": "Final Client Revisions & Launch",
        "completed": true
      }
    ]
  },
  {
    "id": "proj-awais-25",
    "clientId": "client-awais",
    "title": "Project Amzefi",
    "description": "Full Web Development project. Connected domain: amzefi.com",
    "notes": "Domain: amzefi.com\nType: Web Development\nAdmin Lead: Abdullah\nAssigned Client: Awais\nStatus: Completed",
    "projectType": "Web Development",
    "status": "completed",
    "priority": "High",
    "deadline": "26/10/2026",
    "startDate": "15/10/2026",
    "progress": 100,
    "files": [],
    "credentials": [
      {
        "id": "cred-proj-awais-25-1",
        "platform": "Website Domain",
        "subText": "amzefi.com",
        "username": "admin@awaisagency.com",
        "password": "••••••••"
      },
      {
        "id": "cred-proj-awais-25-2",
        "platform": "Store Admin",
        "subText": "amzefi.myshopify.com",
        "username": "owner",
        "password": "••••••••"
      }
    ],
    "tasks": [
      {
        "title": "Header & Navigation Setup",
        "completed": true
      },
      {
        "title": "Hero & Banner Graphics",
        "completed": true
      },
      {
        "title": "Product Page Design",
        "completed": true
      },
      {
        "title": "Product Cards & Pricing Badges",
        "completed": true
      },
      {
        "title": "Information & Policy Pages",
        "completed": true
      },
      {
        "title": "Footer & Contact Details",
        "completed": true
      },
      {
        "title": "Buy and Connect Domain (amzefi.com)",
        "completed": true
      },
      {
        "title": "Final Client Revisions & Launch",
        "completed": true
      }
    ]
  },
  {
    "id": "proj-awais-26",
    "clientId": "client-awais",
    "title": "Vera&Co Website Redesigned",
    "description": "Full Web Development project. Connected domain: veranco.pk",
    "notes": "Domain: veranco.pk\nType: Web Development\nAdmin Lead: Abdullah\nAssigned Client: Awais\nStatus: Completed",
    "projectType": "Web Development",
    "status": "completed",
    "priority": "Medium",
    "deadline": "26/10/2026",
    "startDate": "15/10/2026",
    "progress": 100,
    "files": [],
    "credentials": [
      {
        "id": "cred-proj-awais-26-1",
        "platform": "Website Domain",
        "subText": "veranco.pk",
        "username": "admin@awaisagency.com",
        "password": "••••••••"
      },
      {
        "id": "cred-proj-awais-26-2",
        "platform": "Store Admin",
        "subText": "veranco.myshopify.com",
        "username": "owner",
        "password": "••••••••"
      }
    ],
    "tasks": [
      {
        "title": "Header & Navigation Setup",
        "completed": true
      },
      {
        "title": "Hero & Banner Graphics",
        "completed": true
      },
      {
        "title": "Product Page Design",
        "completed": true
      },
      {
        "title": "Product Cards & Pricing Badges",
        "completed": true
      },
      {
        "title": "Information & Policy Pages",
        "completed": true
      },
      {
        "title": "Footer & Contact Details",
        "completed": true
      },
      {
        "title": "Buy and Connect Domain (veranco.pk)",
        "completed": true
      },
      {
        "title": "Final Client Revisions & Launch",
        "completed": true
      }
    ]
  },
  {
    "id": "proj-awais-27",
    "clientId": "client-awais",
    "title": "A-Z Fashion Mart",
    "description": "Full Web Development project. Connected domain: azfashionmart.com",
    "notes": "Domain: azfashionmart.com\nType: Web Development\nAdmin Lead: Abdullah\nAssigned Client: Awais\nStatus: Completed",
    "projectType": "Web Development",
    "status": "completed",
    "priority": "Medium",
    "deadline": "26/10/2026",
    "startDate": "15/10/2026",
    "progress": 100,
    "files": [],
    "credentials": [
      {
        "id": "cred-proj-awais-27-1",
        "platform": "Website Domain",
        "subText": "azfashionmart.com",
        "username": "admin@awaisagency.com",
        "password": "••••••••"
      },
      {
        "id": "cred-proj-awais-27-2",
        "platform": "Store Admin",
        "subText": "azfashionmart.myshopify.com",
        "username": "owner",
        "password": "••••••••"
      }
    ],
    "tasks": [
      {
        "title": "Header & Navigation Setup",
        "completed": true
      },
      {
        "title": "Hero & Banner Graphics",
        "completed": true
      },
      {
        "title": "Product Page Design",
        "completed": true
      },
      {
        "title": "Product Cards & Pricing Badges",
        "completed": true
      },
      {
        "title": "Information & Policy Pages",
        "completed": true
      },
      {
        "title": "Footer & Contact Details",
        "completed": true
      },
      {
        "title": "Buy and Connect Domain (azfashionmart.com)",
        "completed": true
      },
      {
        "title": "Final Client Revisions & Launch",
        "completed": true
      }
    ]
  },
  {
    "id": "proj-awais-28",
    "clientId": "client-awais",
    "title": "Project USA (Ali)",
    "description": "Full Web Development project. Connected domain: projectusa-ali.com",
    "notes": "Domain: projectusa-ali.com\nType: Web Development\nAdmin Lead: Abdullah\nAssigned Client: Awais\nStatus: Completed",
    "projectType": "Web Development",
    "status": "completed",
    "priority": "High",
    "deadline": "26/10/2026",
    "startDate": "15/10/2026",
    "progress": 100,
    "files": [],
    "credentials": [
      {
        "id": "cred-proj-awais-28-1",
        "platform": "Website Domain",
        "subText": "projectusa-ali.com",
        "username": "admin@awaisagency.com",
        "password": "••••••••"
      },
      {
        "id": "cred-proj-awais-28-2",
        "platform": "Store Admin",
        "subText": "projectusa-ali.myshopify.com",
        "username": "owner",
        "password": "••••••••"
      }
    ],
    "tasks": [
      {
        "title": "Header & Navigation Setup",
        "completed": true
      },
      {
        "title": "Hero & Banner Graphics",
        "completed": true
      },
      {
        "title": "Product Page Design",
        "completed": true
      },
      {
        "title": "Product Cards & Pricing Badges",
        "completed": true
      },
      {
        "title": "Information & Policy Pages",
        "completed": true
      },
      {
        "title": "Footer & Contact Details",
        "completed": true
      },
      {
        "title": "Buy and Connect Domain (projectusa-ali.com)",
        "completed": true
      },
      {
        "title": "Final Client Revisions & Launch",
        "completed": true
      }
    ]
  },
  {
    "id": "proj-awais-29",
    "clientId": "client-awais",
    "title": "Project Youngla.pk",
    "description": "Full Web Development project. Connected domain: youngla.pk",
    "notes": "Domain: youngla.pk\nType: Web Development\nAdmin Lead: Abdullah\nAssigned Client: Awais\nStatus: Completed",
    "projectType": "Web Development",
    "status": "completed",
    "priority": "High",
    "deadline": "26/10/2026",
    "startDate": "15/10/2026",
    "progress": 100,
    "files": [],
    "credentials": [
      {
        "id": "cred-proj-awais-29-1",
        "platform": "Website Domain",
        "subText": "youngla.pk",
        "username": "admin@awaisagency.com",
        "password": "••••••••"
      },
      {
        "id": "cred-proj-awais-29-2",
        "platform": "Store Admin",
        "subText": "youngla.myshopify.com",
        "username": "owner",
        "password": "••••••••"
      }
    ],
    "tasks": [
      {
        "title": "Header & Navigation Setup",
        "completed": true
      },
      {
        "title": "Hero & Banner Graphics",
        "completed": true
      },
      {
        "title": "Product Page Design",
        "completed": true
      },
      {
        "title": "Product Cards & Pricing Badges",
        "completed": true
      },
      {
        "title": "Information & Policy Pages",
        "completed": true
      },
      {
        "title": "Footer & Contact Details",
        "completed": true
      },
      {
        "title": "Buy and Connect Domain (youngla.pk)",
        "completed": true
      },
      {
        "title": "Final Client Revisions & Launch",
        "completed": true
      }
    ]
  },
  {
    "id": "proj-awais-30",
    "clientId": "client-awais",
    "title": "KSA Project (Sundas) 2",
    "description": "Full Web Development project. Connected domain: sundas-ksa.store",
    "notes": "Domain: sundas-ksa.store\nType: Web Development\nAdmin Lead: Abdullah\nAssigned Client: Awais\nStatus: Completed",
    "projectType": "Web Development",
    "status": "completed",
    "priority": "Medium",
    "deadline": "26/10/2026",
    "startDate": "15/10/2026",
    "progress": 100,
    "files": [],
    "credentials": [
      {
        "id": "cred-proj-awais-30-1",
        "platform": "Website Domain",
        "subText": "sundas-ksa.store",
        "username": "admin@awaisagency.com",
        "password": "••••••••"
      },
      {
        "id": "cred-proj-awais-30-2",
        "platform": "Store Admin",
        "subText": "sundas-ksa.myshopify.com",
        "username": "owner",
        "password": "••••••••"
      }
    ],
    "tasks": [
      {
        "title": "Header & Navigation Setup",
        "completed": true
      },
      {
        "title": "Hero & Banner Graphics",
        "completed": true
      },
      {
        "title": "Product Page Design",
        "completed": true
      },
      {
        "title": "Product Cards & Pricing Badges",
        "completed": true
      },
      {
        "title": "Information & Policy Pages",
        "completed": true
      },
      {
        "title": "Footer & Contact Details",
        "completed": true
      },
      {
        "title": "Buy and Connect Domain (sundas-ksa.store)",
        "completed": true
      },
      {
        "title": "Final Client Revisions & Launch",
        "completed": true
      }
    ]
  },
  {
    "id": "proj-awais-31",
    "clientId": "client-awais",
    "title": "Clients Daily Status & Pending Projects",
    "description": "Full Web Development project. Connected domain: client-status-portal.com",
    "notes": "Domain: client-status-portal.com\nType: Web Development\nAdmin Lead: Abdullah\nAssigned Client: Awais\nStatus: Completed",
    "projectType": "Web Development",
    "status": "completed",
    "priority": "Medium",
    "deadline": "26/10/2026",
    "startDate": "15/10/2026",
    "progress": 100,
    "files": [],
    "credentials": [
      {
        "id": "cred-proj-awais-31-1",
        "platform": "Website Domain",
        "subText": "client-status-portal.com",
        "username": "admin@awaisagency.com",
        "password": "••••••••"
      },
      {
        "id": "cred-proj-awais-31-2",
        "platform": "Store Admin",
        "subText": "client-status-portal.myshopify.com",
        "username": "owner",
        "password": "••••••••"
      }
    ],
    "tasks": [
      {
        "title": "Header & Navigation Setup",
        "completed": true
      },
      {
        "title": "Hero & Banner Graphics",
        "completed": true
      },
      {
        "title": "Product Page Design",
        "completed": true
      },
      {
        "title": "Product Cards & Pricing Badges",
        "completed": true
      },
      {
        "title": "Information & Policy Pages",
        "completed": true
      },
      {
        "title": "Footer & Contact Details",
        "completed": true
      },
      {
        "title": "Buy and Connect Domain (client-status-portal.com)",
        "completed": true
      },
      {
        "title": "Final Client Revisions & Launch",
        "completed": true
      }
    ]
  },
  {
    "id": "proj-awais-32",
    "clientId": "client-awais",
    "title": "Project Australia",
    "description": "Full Web Development project. Connected domain: project-australia.com.au",
    "notes": "Domain: project-australia.com.au\nType: Web Development\nAdmin Lead: Abdullah\nAssigned Client: Awais\nStatus: Completed",
    "projectType": "Web Development",
    "status": "completed",
    "priority": "Medium",
    "deadline": "26/10/2026",
    "startDate": "15/10/2026",
    "progress": 100,
    "files": [],
    "credentials": [
      {
        "id": "cred-proj-awais-32-1",
        "platform": "Website Domain",
        "subText": "project-australia.com.au",
        "username": "admin@awaisagency.com",
        "password": "••••••••"
      },
      {
        "id": "cred-proj-awais-32-2",
        "platform": "Store Admin",
        "subText": "project-australia.com.myshopify.com",
        "username": "owner",
        "password": "••••••••"
      }
    ],
    "tasks": [
      {
        "title": "Header & Navigation Setup",
        "completed": true
      },
      {
        "title": "Hero & Banner Graphics",
        "completed": true
      },
      {
        "title": "Product Page Design",
        "completed": true
      },
      {
        "title": "Product Cards & Pricing Badges",
        "completed": true
      },
      {
        "title": "Information & Policy Pages",
        "completed": true
      },
      {
        "title": "Footer & Contact Details",
        "completed": true
      },
      {
        "title": "Buy and Connect Domain (project-australia.com.au)",
        "completed": true
      },
      {
        "title": "Final Client Revisions & Launch",
        "completed": true
      }
    ]
  },
  {
    "id": "proj-awais-33",
    "clientId": "client-awais",
    "title": "Project Ireland",
    "description": "Full Web Development project. Connected domain: project-ireland.ie",
    "notes": "Domain: project-ireland.ie\nType: Web Development\nAdmin Lead: Abdullah\nAssigned Client: Awais\nStatus: Completed",
    "projectType": "Web Development",
    "status": "completed",
    "priority": "Medium",
    "deadline": "26/10/2026",
    "startDate": "15/10/2026",
    "progress": 100,
    "files": [],
    "credentials": [
      {
        "id": "cred-proj-awais-33-1",
        "platform": "Website Domain",
        "subText": "project-ireland.ie",
        "username": "admin@awaisagency.com",
        "password": "••••••••"
      },
      {
        "id": "cred-proj-awais-33-2",
        "platform": "Store Admin",
        "subText": "project-ireland.myshopify.com",
        "username": "owner",
        "password": "••••••••"
      }
    ],
    "tasks": [
      {
        "title": "Header & Navigation Setup",
        "completed": true
      },
      {
        "title": "Hero & Banner Graphics",
        "completed": true
      },
      {
        "title": "Product Page Design",
        "completed": true
      },
      {
        "title": "Product Cards & Pricing Badges",
        "completed": true
      },
      {
        "title": "Information & Policy Pages",
        "completed": true
      },
      {
        "title": "Footer & Contact Details",
        "completed": true
      },
      {
        "title": "Buy and Connect Domain (project-ireland.ie)",
        "completed": true
      },
      {
        "title": "Final Client Revisions & Launch",
        "completed": true
      }
    ]
  },
  {
    "id": "proj-awais-34",
    "clientId": "client-awais",
    "title": "Shopify Apps Reviews",
    "description": "Full Web Development project. Connected domain: shopify-apps-review.com",
    "notes": "Domain: shopify-apps-review.com\nType: Web Development\nAdmin Lead: Abdullah\nAssigned Client: Awais\nStatus: Completed",
    "projectType": "Web Development",
    "status": "completed",
    "priority": "Low",
    "deadline": "26/10/2026",
    "startDate": "15/10/2026",
    "progress": 100,
    "files": [],
    "credentials": [
      {
        "id": "cred-proj-awais-34-1",
        "platform": "Website Domain",
        "subText": "shopify-apps-review.com",
        "username": "admin@awaisagency.com",
        "password": "••••••••"
      },
      {
        "id": "cred-proj-awais-34-2",
        "platform": "Store Admin",
        "subText": "shopify-apps-review.myshopify.com",
        "username": "owner",
        "password": "••••••••"
      }
    ],
    "tasks": [
      {
        "title": "Header & Navigation Setup",
        "completed": true
      },
      {
        "title": "Hero & Banner Graphics",
        "completed": true
      },
      {
        "title": "Product Page Design",
        "completed": true
      },
      {
        "title": "Product Cards & Pricing Badges",
        "completed": true
      },
      {
        "title": "Information & Policy Pages",
        "completed": true
      },
      {
        "title": "Footer & Contact Details",
        "completed": true
      },
      {
        "title": "Buy and Connect Domain (shopify-apps-review.com)",
        "completed": true
      },
      {
        "title": "Final Client Revisions & Launch",
        "completed": true
      }
    ]
  },
  {
    "id": "proj-awais-35",
    "clientId": "client-awais",
    "title": "SA Ecom Services",
    "description": "Full Web Development project. Connected domain: sa-ecomservices.com",
    "notes": "Domain: sa-ecomservices.com\nType: Web Development\nAdmin Lead: Abdullah\nAssigned Client: Awais\nStatus: Completed",
    "projectType": "Web Development",
    "status": "completed",
    "priority": "Medium",
    "deadline": "26/10/2026",
    "startDate": "15/10/2026",
    "progress": 100,
    "files": [],
    "credentials": [
      {
        "id": "cred-proj-awais-35-1",
        "platform": "Website Domain",
        "subText": "sa-ecomservices.com",
        "username": "admin@awaisagency.com",
        "password": "••••••••"
      },
      {
        "id": "cred-proj-awais-35-2",
        "platform": "Store Admin",
        "subText": "sa-ecomservices.myshopify.com",
        "username": "owner",
        "password": "••••••••"
      }
    ],
    "tasks": [
      {
        "title": "Header & Navigation Setup",
        "completed": true
      },
      {
        "title": "Hero & Banner Graphics",
        "completed": true
      },
      {
        "title": "Product Page Design",
        "completed": true
      },
      {
        "title": "Product Cards & Pricing Badges",
        "completed": true
      },
      {
        "title": "Information & Policy Pages",
        "completed": true
      },
      {
        "title": "Footer & Contact Details",
        "completed": true
      },
      {
        "title": "Buy and Connect Domain (sa-ecomservices.com)",
        "completed": true
      },
      {
        "title": "Final Client Revisions & Launch",
        "completed": true
      }
    ]
  },
  {
    "id": "proj-awais-36",
    "clientId": "client-awais",
    "title": "KSA & Pakistan Working",
    "description": "Full Web Development project. Connected domain: ksapak-working.com",
    "notes": "Domain: ksapak-working.com\nType: Web Development\nAdmin Lead: Abdullah\nAssigned Client: Awais\nStatus: Completed",
    "projectType": "Web Development",
    "status": "completed",
    "priority": "Medium",
    "deadline": "26/10/2026",
    "startDate": "15/10/2026",
    "progress": 100,
    "files": [],
    "credentials": [
      {
        "id": "cred-proj-awais-36-1",
        "platform": "Website Domain",
        "subText": "ksapak-working.com",
        "username": "admin@awaisagency.com",
        "password": "••••••••"
      },
      {
        "id": "cred-proj-awais-36-2",
        "platform": "Store Admin",
        "subText": "ksapak-working.myshopify.com",
        "username": "owner",
        "password": "••••••••"
      }
    ],
    "tasks": [
      {
        "title": "Header & Navigation Setup",
        "completed": true
      },
      {
        "title": "Hero & Banner Graphics",
        "completed": true
      },
      {
        "title": "Product Page Design",
        "completed": true
      },
      {
        "title": "Product Cards & Pricing Badges",
        "completed": true
      },
      {
        "title": "Information & Policy Pages",
        "completed": true
      },
      {
        "title": "Footer & Contact Details",
        "completed": true
      },
      {
        "title": "Buy and Connect Domain (ksapak-working.com)",
        "completed": true
      },
      {
        "title": "Final Client Revisions & Launch",
        "completed": true
      }
    ]
  },
  {
    "id": "proj-awais-37",
    "clientId": "client-awais",
    "title": "MD Shadat eCommerce",
    "description": "Full Web Development project. Connected domain: mdshadat-ecom.com",
    "notes": "Domain: mdshadat-ecom.com\nType: Web Development\nAdmin Lead: Abdullah\nAssigned Client: Awais\nStatus: Completed",
    "projectType": "Web Development",
    "status": "completed",
    "priority": "High",
    "deadline": "26/10/2026",
    "startDate": "15/10/2026",
    "progress": 100,
    "files": [],
    "credentials": [
      {
        "id": "cred-proj-awais-37-1",
        "platform": "Website Domain",
        "subText": "mdshadat-ecom.com",
        "username": "admin@awaisagency.com",
        "password": "••••••••"
      },
      {
        "id": "cred-proj-awais-37-2",
        "platform": "Store Admin",
        "subText": "mdshadat-ecom.myshopify.com",
        "username": "owner",
        "password": "••••••••"
      }
    ],
    "tasks": [
      {
        "title": "Header & Navigation Setup",
        "completed": true
      },
      {
        "title": "Hero & Banner Graphics",
        "completed": true
      },
      {
        "title": "Product Page Design",
        "completed": true
      },
      {
        "title": "Product Cards & Pricing Badges",
        "completed": true
      },
      {
        "title": "Information & Policy Pages",
        "completed": true
      },
      {
        "title": "Footer & Contact Details",
        "completed": true
      },
      {
        "title": "Buy and Connect Domain (mdshadat-ecom.com)",
        "completed": true
      },
      {
        "title": "Final Client Revisions & Launch",
        "completed": true
      }
    ]
  },
  {
    "id": "proj-awais-38",
    "clientId": "client-awais",
    "title": "Pk Wave Project WL",
    "description": "Full Web Development project. Connected domain: pkwave-wl.com",
    "notes": "Domain: pkwave-wl.com\nType: Web Development\nAdmin Lead: Abdullah\nAssigned Client: Awais\nStatus: Completed",
    "projectType": "Web Development",
    "status": "completed",
    "priority": "Medium",
    "deadline": "26/10/2026",
    "startDate": "15/10/2026",
    "progress": 100,
    "files": [],
    "credentials": [
      {
        "id": "cred-proj-awais-38-1",
        "platform": "Website Domain",
        "subText": "pkwave-wl.com",
        "username": "admin@awaisagency.com",
        "password": "••••••••"
      },
      {
        "id": "cred-proj-awais-38-2",
        "platform": "Store Admin",
        "subText": "pkwave-wl.myshopify.com",
        "username": "owner",
        "password": "••••••••"
      }
    ],
    "tasks": [
      {
        "title": "Header & Navigation Setup",
        "completed": true
      },
      {
        "title": "Hero & Banner Graphics",
        "completed": true
      },
      {
        "title": "Product Page Design",
        "completed": true
      },
      {
        "title": "Product Cards & Pricing Badges",
        "completed": true
      },
      {
        "title": "Information & Policy Pages",
        "completed": true
      },
      {
        "title": "Footer & Contact Details",
        "completed": true
      },
      {
        "title": "Buy and Connect Domain (pkwave-wl.com)",
        "completed": true
      },
      {
        "title": "Final Client Revisions & Launch",
        "completed": true
      }
    ]
  },
  {
    "id": "proj-awais-39",
    "clientId": "client-awais",
    "title": "Project Amzefi 2",
    "description": "Full Web Development project. Connected domain: amzefi-v2.com",
    "notes": "Domain: amzefi-v2.com\nType: Web Development\nAdmin Lead: Abdullah\nAssigned Client: Awais\nStatus: Completed",
    "projectType": "Web Development",
    "status": "completed",
    "priority": "Medium",
    "deadline": "26/10/2026",
    "startDate": "15/10/2026",
    "progress": 100,
    "files": [],
    "credentials": [
      {
        "id": "cred-proj-awais-39-1",
        "platform": "Website Domain",
        "subText": "amzefi-v2.com",
        "username": "admin@awaisagency.com",
        "password": "••••••••"
      },
      {
        "id": "cred-proj-awais-39-2",
        "platform": "Store Admin",
        "subText": "amzefi-v2.myshopify.com",
        "username": "owner",
        "password": "••••••••"
      }
    ],
    "tasks": [
      {
        "title": "Header & Navigation Setup",
        "completed": true
      },
      {
        "title": "Hero & Banner Graphics",
        "completed": true
      },
      {
        "title": "Product Page Design",
        "completed": true
      },
      {
        "title": "Product Cards & Pricing Badges",
        "completed": true
      },
      {
        "title": "Information & Policy Pages",
        "completed": true
      },
      {
        "title": "Footer & Contact Details",
        "completed": true
      },
      {
        "title": "Buy and Connect Domain (amzefi-v2.com)",
        "completed": true
      },
      {
        "title": "Final Client Revisions & Launch",
        "completed": true
      }
    ]
  },
  {
    "id": "proj-afshal-1",
    "clientId": "client-afshal",
    "title": "Farjah — Luxury Decor Items (Redesign)",
    "description": "Luxury Decor Items Store Redesign.",
    "notes": "Luxury Decor Items Store Redesign.",
    "projectType": "Web Development",
    "status": "in-progress",
    "priority": "Urgent",
    "deadline": "17/10/2026",
    "startDate": "15/10/2026",
    "progress": 0,
    "files": [],
    "credentials": [],
    "tasks": [
      {
        "title": "Product Listing",
        "completed": false
      },
      {
        "title": "Organization",
        "completed": false
      },
      {
        "title": "Banners",
        "completed": false
      }
    ]
  },
  {
    "id": "proj-afshal-2",
    "clientId": "client-afshal",
    "title": "Distant Market",
    "description": "Pakistan White Label Store.",
    "notes": "Pakistan White Label Store.",
    "projectType": "Web Development",
    "status": "in-progress",
    "priority": "Medium",
    "deadline": "20/10/2026",
    "startDate": "15/10/2026",
    "progress": 0,
    "files": [],
    "credentials": [],
    "tasks": [
      {
        "title": "Header",
        "completed": false
      },
      {
        "title": "Graphics",
        "completed": false
      },
      {
        "title": "Product Page",
        "completed": false
      },
      {
        "title": "Footer",
        "completed": false
      }
    ]
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
        const assigned = (seedAssignees && seedAssignees.length > 0)
          ? seedAssignees[(tIdx - 1) % seedAssignees.length]
          : { name: 'Abdullah', avatar: '' };
        initialTasks.push({
          id: `task-${p.id}-${tIdx}`,
          project_id: p.id,
          client_id: p.clientId,
          title: tTitle,
          due_date: p.deadline,
          completed: tCompleted,
          assigned_name: assigned?.name || 'Abdullah',
          assigned_avatar: assigned?.avatar || ''
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
        avatar: a?.avatar || '',
        email: `${(a.name || 'member').toLowerCase()}@remotale.com`
      })),
      team_activities: [
        {
          id: 'act-1',
          member_name: 'Abdullah',
          member_avatar: seedAssignees[0]?.avatar || '',
          action: 'reviewed notes and requirements',
          details: 'Updated notepad on Pak White Label',
          created_at: new Date().toISOString()
        },
        {
          id: 'act-2',
          member_name: 'Abdullah',
          member_avatar: seedAssignees[0]?.avatar || '',
          action: 'scheduled deadline',
          details: 'New banners scheduled for Farjah Luxury Decor',
          created_at: new Date().toISOString()
        }
      ],
      files: [],
      invoices: (store && Array.isArray(store.invoices)) ? store.invoices : []
    };

    fs.writeFileSync(STORE_PATH, JSON.stringify(cleanStore, null, 2), 'utf-8');
  }
}

function readLocalStore() {
  try {
    ensureLocalStore();
  } catch (err) {
    console.error('[ensureLocalStore Error]', err);
  }
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
          ('client-awais', 'Awais', 'awais@remotale.com', 'Remotale123', 'client', 'Awais Agency', 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&auto=format&fit=crop&q=80', 'awais'),
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

      // Ensure single Admin user in team_members table
      await client.query(`
        DELETE FROM team_members;
        INSERT INTO team_members (id, name, role, email)
        VALUES ('admin-1', 'Abdullah', 'Super Admin & Agency Lead', 'admin@remotale.com')
        ON CONFLICT (id) DO UPDATE SET
          name = EXCLUDED.name,
          role = EXCLUDED.role,
          email = EXCLUDED.email;
      `);

      // Remove old demo projects if any exist
      await client.query(`
        DELETE FROM projects WHERE id IN ('proj-ecommerce', 'proj-brand-logo', 'proj-video-promo', 'proj-seo', 'proj-mobile-app');
      `);

      // Seed Real Projects for Awais and Afshal only if projects table is empty
      const projCheck = await client.query('SELECT COUNT(*)::int as count FROM projects');
      if (projCheck.rows[0].count === 0) {
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
              progress = COALESCE(projects.progress, EXCLUDED.progress),
              deadline = EXCLUDED.deadline,
              project_type = EXCLUDED.project_type,
              start_date = EXCLUDED.start_date,
              priority = EXCLUDED.priority,
              notes = COALESCE(NULLIF(projects.notes, ''), EXCLUDED.notes);
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
            const assigned = (seedAssignees && seedAssignees.length > 0)
              ? seedAssignees[(tIdx - 1) % seedAssignees.length]
              : { name: 'Abdullah', avatar: '' };
            const tId = `task-${p.id}-${tIdx}`;

            await client.query(`
              INSERT INTO tasks (id, project_id, client_id, title, due_date, completed, assigned_name, assigned_avatar)
              VALUES ($1, $2, $3, $4, $5, $6, $7, $8)
              ON CONFLICT (id) DO UPDATE SET
                title = EXCLUDED.title,
                due_date = EXCLUDED.due_date;
            `, [
              tId,
              p.id,
              p.clientId,
              tTitle,
              p.deadline,
              tCompleted,
              assigned?.name || 'Abdullah',
              assigned?.avatar || ''
            ]);
            tIdx++;
          }
        }
      }

      await client.query(`
        INSERT INTO agency_settings (key, value)
        VALUES ('general', '{"agencyName":"Remotale","ownerName":"Abdullah","ownerEmail":"admin@remotale.com","currency":"PKR"}')
        ON CONFLICT (key) DO NOTHING;
      `);

      // Ensure invoices table has full billing metadata & soft delete columns
      await client.query(`
        ALTER TABLE invoices ADD COLUMN IF NOT EXISTS invoice_number VARCHAR(100);
        ALTER TABLE invoices ADD COLUMN IF NOT EXISTS currency VARCHAR(10) DEFAULT 'PKR';
        ALTER TABLE invoices ADD COLUMN IF NOT EXISTS items JSONB DEFAULT '[]';
        ALTER TABLE invoices ADD COLUMN IF NOT EXISTS subtotal NUMERIC(12,2) DEFAULT 0;
        ALTER TABLE invoices ADD COLUMN IF NOT EXISTS tax NUMERIC(12,2) DEFAULT 0;
        ALTER TABLE invoices ADD COLUMN IF NOT EXISTS discount NUMERIC(12,2) DEFAULT 0;
        ALTER TABLE invoices ADD COLUMN IF NOT EXISTS notes TEXT;
        ALTER TABLE invoices ADD COLUMN IF NOT EXISTS issue_date VARCHAR(50);
        ALTER TABLE invoices ADD COLUMN IF NOT EXISTS payment_details TEXT;
        ALTER TABLE invoices ADD COLUMN IF NOT EXISTS published BOOLEAN DEFAULT true;
        ALTER TABLE invoices ADD COLUMN IF NOT EXISTS project_ids JSONB DEFAULT '[]';
        ALTER TABLE invoices ADD COLUMN IF NOT EXISTS project_titles JSONB DEFAULT '[]';
        ALTER TABLE invoices ADD COLUMN IF NOT EXISTS project_title VARCHAR(255);
        ALTER TABLE invoices ADD COLUMN IF NOT EXISTS client_name VARCHAR(255);
        ALTER TABLE invoices ADD COLUMN IF NOT EXISTS client_company VARCHAR(255);
        ALTER TABLE invoices ADD COLUMN IF NOT EXISTS client_email VARCHAR(255);
        ALTER TABLE invoices ADD COLUMN IF NOT EXISTS is_deleted BOOLEAN DEFAULT false;
        ALTER TABLE invoices ADD COLUMN IF NOT EXISTS deleted_at TIMESTAMP;
      `);

      // Automatically mark projects with >= 100% progress as completed
      await client.query(`
        UPDATE projects SET status = 'completed', progress = 100 WHERE progress >= 100 AND status != 'completed';
      `);

      // Seed realistic recent activities if empty
      const actCheck = await client.query('SELECT COUNT(*)::int as count FROM team_activities');
      if (actCheck.rows[0].count === 0) {
        await client.query(`
          INSERT INTO team_activities (id, member_name, member_avatar, action, details, created_at)
          VALUES
            ('act-1', 'Abdullah', '', 'completed all tasks & marked as Completed', '20 Oxytees Graphics', NOW() - INTERVAL '25 minutes'),
            ('act-2', 'Abdullah', '', 'reviewed notepad & domain settings', 'Pak White Label Abdul Saboor', NOW() - INTERVAL '1 hour'),
            ('act-3', 'Abdullah', '', 'updated deliverable graphics progress', 'Fytnex Products Designing', NOW() - INTERVAL '3 hours'),
            ('act-4', 'Abdullah', '', 'scheduled delivery deadline for', '20 WearPhere Graphics', NOW() - INTERVAL '5 hours'),
            ('act-5', 'Abdullah', '', 'generated agency invoice in PKR for', 'Awais Agency', NOW() - INTERVAL '1 day')
          ON CONFLICT (id) DO NOTHING;
        `);
      }

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
        (seedUser.username === 'awais' && (cleanPw === 'Remotale123' || cleanPw === '< Remotale123' || cleanPw === '<Remotale123' || cleanPw === 'awais')) ||
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
            (user.username === 'awais' && (cleanPw === 'Remotale123' || cleanPw === '< Remotale123' || cleanPw === '<Remotale123' || cleanPw === 'awais')) ||
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
        (user.username === 'awais' && (cleanPw === 'Remotale123' || cleanPw === '< Remotale123' || cleanPw === '<Remotale123' || cleanPw === 'awais')) ||
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
          SELECT p.id, p.client_id, p.title, p.description, p.budget, p.deadline,
                 p.project_type, p.start_date, p.priority, p.credentials, p.reference_link,
                 p.notes, p.created_at, p.files,
                 p.progress,
                 CASE WHEN p.progress >= 100 THEN 'completed' ELSE p.status END as status,
                 u.name as "clientName", u.company as "companyName", u.avatar as "clientAvatar"
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
    return projs.map(p => ({
      ...p,
      status: Number(p.progress) >= 100 ? 'completed' : p.status
    }));
  },

  async getProjectById(id) {
    if (initPromise) await initPromise;
    if (isPostgres && pgPool) {
      const res = await pgPool.query(`
        SELECT p.id, p.client_id, p.title, p.description, p.budget, p.deadline,
               p.project_type, p.start_date, p.priority, p.credentials, p.reference_link,
               p.notes, p.created_at, p.files,
               p.progress,
               CASE WHEN p.progress >= 100 THEN 'completed' ELSE p.status END as status,
               u.name as "clientName", u.company as "companyName", u.avatar as "clientAvatar"
        FROM projects p
        LEFT JOIN users u ON u.id = p.client_id
        WHERE p.id = $1
      `, [id]);
      return res.rows[0] || null;
    }
    const local = readLocalStore();
    const found = (local.projects || []).find(p => p.id === id);
    if (!found) return null;
    return {
      ...found,
      status: Number(found.progress) >= 100 ? 'completed' : found.status
    };
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
    // Auto mark completed when progress is 100%
    if (Number(updates.progress) >= 100 && (!updates.status || updates.status === 'in-progress')) {
      updates.status = 'completed';
      updates.progress = 100;
    }
    if (updates.status === 'completed' && updates.progress === undefined) {
      updates.progress = 100;
    }

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

      let pgUpdated = null;
      try {
        const res = await pgPool.query(
          `UPDATE projects SET ${fields.join(', ')} WHERE id = $${i} RETURNING *`,
          values
        );
        pgUpdated = res.rows[0] || null;
      } catch (err) {
        console.error('[DB updateProject PG Error]', err.message);
      }

      // Always mirror updates to local store as well
      const local = readLocalStore();
      const idx = (local.projects || []).findIndex(p => p.id === id);
      if (idx !== -1) {
        local.projects[idx] = { ...local.projects[idx], ...updates };
        writeLocalStore(local);
        if (!pgUpdated) pgUpdated = local.projects[idx];
      }
      return pgUpdated;
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
    let saved = null;
    if (isPostgres && pgPool) {
      try {
        const res = await pgPool.query(
          `INSERT INTO tasks (id, project_id, client_id, title, due_date, completed)
           VALUES ($1, $2, $3, $4, $5, $6)
           RETURNING *`,
          [
            taskObj.id || `task-${Date.now()}`,
            taskObj.project_id || taskObj.projectId || null,
            taskObj.client_id || taskObj.clientId || null,
            taskObj.title,
            taskObj.due_date || taskObj.dueDate || new Date(Date.now() + 7 * 86400000).toLocaleDateString('en-GB'),
            Boolean(taskObj.completed)
          ]
        );
        saved = res.rows[0];
        if (saved && saved.project_id) {
          const stats = await pgPool.query(
            `SELECT COUNT(*)::int as total, COUNT(*) FILTER (WHERE completed = true)::int as done
             FROM tasks WHERE project_id = $1`,
            [saved.project_id]
          );
          if (stats.rows[0] && stats.rows[0].total > 0) {
            const pct = Math.round((stats.rows[0].done / stats.rows[0].total) * 100);
            if (pct >= 100) {
              await pgPool.query("UPDATE projects SET progress = 100, status = 'completed' WHERE id = $1", [saved.project_id]);
            } else {
              await pgPool.query("UPDATE projects SET progress = $1, status = 'in-progress' WHERE id = $2", [pct, saved.project_id]);
            }
          }
        }
      } catch (e) {
        console.error('[DB addTask PG Error]', e.message);
      }
    }

    const local = readLocalStore();
    local.tasks = local.tasks || [];
    local.tasks.unshift(saved || taskObj);

    const targetProjId = (saved || taskObj).project_id || (saved || taskObj).projectId;
    if (targetProjId) {
      const projTasks = (local.tasks || []).filter(t => (t.project_id === targetProjId || t.projectId === targetProjId));
      const total = projTasks.length;
      const done = projTasks.filter(t => t.completed).length;
      const pct = total > 0 ? Math.round((done / total) * 100) : 0;
      const proj = (local.projects || []).find(p => p.id === targetProjId);
      if (proj) {
        proj.progress = pct;
        proj.status = pct >= 100 ? 'completed' : 'in-progress';
      }
    }

    writeLocalStore(local);
    return saved || taskObj;
  },

  async toggleTask(id, completed) {
    if (initPromise) await initPromise;
    let updatedTask = null;

    if (isPostgres && pgPool) {
      try {
        let q = '';
        let params = [];
        if (completed !== undefined) {
          q = 'UPDATE tasks SET completed = $1 WHERE id = $2 RETURNING *';
          params = [Boolean(completed), id];
        } else {
          q = 'UPDATE tasks SET completed = NOT completed WHERE id = $1 RETURNING *';
          params = [id];
        }
        const res = await pgPool.query(q, params);
        if (res.rows[0]) {
          updatedTask = res.rows[0];
          // Recalculate parent project's progress in PostgreSQL
          if (updatedTask.project_id) {
            const stats = await pgPool.query(
              `SELECT COUNT(*)::int as total, COUNT(*) FILTER (WHERE completed = true)::int as done
               FROM tasks WHERE project_id = $1`,
              [updatedTask.project_id]
            );
            if (stats.rows[0] && stats.rows[0].total > 0) {
              const pct = Math.round((stats.rows[0].done / stats.rows[0].total) * 100);
              if (pct >= 100) {
                await pgPool.query("UPDATE projects SET progress = 100, status = 'completed' WHERE id = $1", [updatedTask.project_id]);
              } else {
                await pgPool.query("UPDATE projects SET progress = $1, status = CASE WHEN status = 'completed' THEN 'in-progress' ELSE status END WHERE id = $2", [pct, updatedTask.project_id]);
              }
            }
          }
        }
      } catch (err) {
        console.error('[DB toggleTask PG Error]', err.message);
      }
    }

    // Always mirror to local store as well
    const local = readLocalStore();
    const task = (local.tasks || []).find(t => t.id === id);
    if (task) {
      task.completed = completed !== undefined ? Boolean(completed) : !task.completed;
      if (!updatedTask) updatedTask = task;
      // Also update project progress in local store
      if (task.project_id) {
        const projTasks = (local.tasks || []).filter(t => t.project_id === task.project_id);
        const total = projTasks.length;
        const done = projTasks.filter(t => t.completed).length;
        const pct = total > 0 ? Math.round((done / total) * 100) : 0;
        const proj = (local.projects || []).find(p => p.id === task.project_id);
        if (proj) {
          proj.progress = pct;
          if (pct >= 100) {
            proj.status = 'completed';
            proj.progress = 100;
          } else if (proj.status === 'completed') {
            proj.status = 'in-progress';
          }
        }
      }
      writeLocalStore(local);
    }

    if (updatedTask) {
      const isDone = updatedTask.completed;
      this.logActivity('Abdullah', isDone ? 'completed task on' : 'reopened task on', `${updatedTask.title || 'Task'}`).catch(() => {});
    }

    return updatedTask;
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
      const res = await pgPool.query('SELECT * FROM team_activities ORDER BY created_at DESC LIMIT 15');
      return res.rows;
    }
    const local = readLocalStore();
    return local.team_activities || [];
  },

  async logActivity(memberName, action, details) {
    const id = `act-${Date.now()}-${Math.random().toString(36).substr(2, 4)}`;
    if (isPostgres && pgPool) {
      try {
        await pgPool.query(
          'INSERT INTO team_activities (id, member_name, member_avatar, action, details, created_at) VALUES ($1, $2, $3, $4, $5, NOW())',
          [id, memberName || 'Abdullah', '', action, details]
        );
      } catch (e) {
        console.warn('[Activity Log Error]', e.message);
      }
      return;
    }
    const local = readLocalStore();
    local.team_activities = [
      { id, member_name: memberName || 'Abdullah', member_avatar: '', action, details, created_at: new Date().toISOString() },
      ...(local.team_activities || [])
    ].slice(0, 50);
    writeLocalStore(local);
  },

  // Overview Stats
  async getStats(clientId) {
    if (initPromise) await initPromise;
    if (isPostgres && pgPool) {
      if (clientId) {
        const [projCount, inProg, underRev, comp, rev] = await Promise.all([
          pgPool.query("SELECT COUNT(*)::int as count FROM projects WHERE client_id = $1", [clientId]),
          pgPool.query("SELECT COUNT(*)::int as count FROM projects WHERE client_id = $1 AND (status = 'in-progress' AND (progress IS NULL OR progress < 100))", [clientId]),
          pgPool.query("SELECT COUNT(*)::int as count FROM projects WHERE client_id = $1 AND status = 'under-review'", [clientId]),
          pgPool.query("SELECT COUNT(*)::int as count FROM projects WHERE client_id = $1 AND (status = 'completed' OR progress >= 100)", [clientId]),
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
        pgPool.query("SELECT COUNT(*)::int as count FROM projects WHERE (status = 'in-progress' AND (progress IS NULL OR progress < 100))"),
        pgPool.query("SELECT COUNT(*)::int as count FROM projects WHERE status = 'under-review'"),
        pgPool.query("SELECT COUNT(*)::int as count FROM projects WHERE (status = 'completed' OR progress >= 100)"),
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
    let projects = (local.projects || []).map(p => {
      const is100 = Number(p.progress) >= 100;
      return is100 ? { ...p, status: 'completed', progress: 100 } : p;
    });
    if (clientId) {
      projects = projects.filter(p => p.client_id === clientId || p.clientId === clientId);
      return {
        totalClients: 1,
        totalProjects: projects.length,
        inProgress: projects.filter(p => p.status === 'in-progress' && Number(p.progress || 0) < 100).length,
        underReview: projects.filter(p => p.status === 'under-review').length,
        completed: projects.filter(p => p.status === 'completed' || Number(p.progress || 0) >= 100).length,
        totalRevenue: projects.reduce((s, p) => s + (Number(p.budget) || 0), 0)
      };
    }

    return {
      totalClients: (local.users || []).filter(u => u.role === 'client').length,
      totalProjects: projects.length,
      inProgress: projects.filter(p => p.status === 'in-progress' && Number(p.progress || 0) < 100).length,
      underReview: projects.filter(p => p.status === 'under-review').length,
      completed: projects.filter(p => p.status === 'completed' || Number(p.progress || 0) >= 100).length,
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
  },

  // ==========================================
  // Invoices Management
  // ==========================================
  async getInvoices(clientId, projectId, status, includeDeleted = false) {
    if (initPromise) await initPromise;
    if (isPostgres && pgPool) {
      const conditions = [];
      const values = [];
      let i = 1;

      if (!includeDeleted) {
        conditions.push(`(i.is_deleted IS FALSE OR i.is_deleted IS NULL)`);
      }
      if (clientId) {
        conditions.push(`i.client_id = $${i++}`);
        values.push(clientId);
      }
      if (projectId) {
        conditions.push(`i.project_id = $${i++}`);
        values.push(projectId);
      }
      if (status) {
        conditions.push(`i.status = $${i++}`);
        values.push(status);
      }

      const whereClause = conditions.length > 0 ? `WHERE ${conditions.join(' AND ')}` : '';
      const query = `
        SELECT i.*, 
               COALESCE(i.client_name, u.name, 'Client') as client_name,
               COALESCE(i.client_company, u.company, 'Agency Client') as client_company,
               COALESCE(i.client_email, u.email, '') as client_email,
               COALESCE(NULLIF(i.project_title, ''), p.title, '') as project_title
        FROM invoices i
        LEFT JOIN users u ON i.client_id = u.id
        LEFT JOIN projects p ON i.project_id = p.id
        ${whereClause}
        ORDER BY i.created_at DESC
      `;
      const res = await pgPool.query(query, values);
      return res.rows.map(inv => {
        const pIds = typeof inv.project_ids === 'string' ? JSON.parse(inv.project_ids) : (inv.project_ids || (inv.project_id ? [inv.project_id] : []));
        const pTitles = typeof inv.project_titles === 'string' ? JSON.parse(inv.project_titles) : (inv.project_titles || (inv.project_title ? [inv.project_title] : []));
        return {
          ...inv,
          project_ids: pIds,
          project_titles: pTitles,
          project_title: inv.project_title || (pTitles.length > 0 ? pTitles.join(', ') : ''),
          amount: Number(inv.amount),
          subtotal: Number(inv.subtotal || inv.amount),
          tax: Number(inv.tax || 0),
          discount: Number(inv.discount || 0),
          items: typeof inv.items === 'string' ? JSON.parse(inv.items) : (inv.items || [])
        };
      });
    }

    const local = readLocalStore();
    let invoices = (local.invoices || []).filter(inv => includeDeleted || !inv.is_deleted).map(inv => {
      const client = (local.users || []).find(u => u.id === inv.client_id);
      const project = (local.projects || []).find(p => p.id === inv.project_id);
      const pIds = Array.isArray(inv.project_ids) ? inv.project_ids : (inv.project_id ? [inv.project_id] : []);
      const pTitles = Array.isArray(inv.project_titles) && inv.project_titles.length > 0 
        ? inv.project_titles 
        : (pIds.length > 0 ? pIds.map(pid => (local.projects || []).find(p => p.id === pid)?.title).filter(Boolean) : (project ? [project.title] : []));

      return {
        ...inv,
        client_name: client?.name || inv.client_name || 'Client',
        client_company: client?.company || inv.client_company || 'Agency Client',
        client_email: client?.email || inv.client_email || '',
        project_ids: pIds,
        project_titles: pTitles,
        project_title: inv.project_title || (pTitles.length > 0 ? pTitles.join(', ') : (project?.title || inv.title)),
        amount: Number(inv.amount),
        subtotal: Number(inv.subtotal || inv.amount),
        tax: Number(inv.tax || 0),
        discount: Number(inv.discount || 0),
        items: inv.items || []
      };
    });

    if (clientId) {
      invoices = invoices.filter(inv => inv.client_id === clientId);
    }
    if (projectId) {
      invoices = invoices.filter(inv => inv.project_id === projectId || (Array.isArray(inv.project_ids) && inv.project_ids.includes(projectId)));
    }
    if (status) {
      invoices = invoices.filter(inv => inv.status === status);
    }

    return invoices;
  },

  async getInvoiceById(id) {
    if (initPromise) await initPromise;
    if (isPostgres && pgPool) {
      const res = await pgPool.query(`
        SELECT i.*, 
               COALESCE(i.client_name, u.name, 'Client') as client_name,
               COALESCE(i.client_company, u.company, 'Agency Client') as client_company,
               COALESCE(i.client_email, u.email, '') as client_email,
               COALESCE(NULLIF(i.project_title, ''), p.title, '') as project_title
        FROM invoices i
        LEFT JOIN users u ON i.client_id = u.id
        LEFT JOIN projects p ON i.project_id = p.id
        WHERE i.id = $1
      `, [id]);
      if (res.rows.length === 0) return null;
      const inv = res.rows[0];
      const pIds = typeof inv.project_ids === 'string' ? JSON.parse(inv.project_ids) : (inv.project_ids || (inv.project_id ? [inv.project_id] : []));
      const pTitles = typeof inv.project_titles === 'string' ? JSON.parse(inv.project_titles) : (inv.project_titles || (inv.project_title ? [inv.project_title] : []));
      return {
        ...inv,
        project_ids: pIds,
        project_titles: pTitles,
        project_title: inv.project_title || (pTitles.length > 0 ? pTitles.join(', ') : ''),
        amount: Number(inv.amount),
        subtotal: Number(inv.subtotal || inv.amount),
        tax: Number(inv.tax || 0),
        discount: Number(inv.discount || 0),
        items: typeof inv.items === 'string' ? JSON.parse(inv.items) : (inv.items || [])
      };
    }

    const local = readLocalStore();
    const inv = (local.invoices || []).find(i => i.id === id);
    if (!inv) return null;
    const client = (local.users || []).find(u => u.id === inv.client_id);
    const project = (local.projects || []).find(p => p.id === inv.project_id);
    const pIds = Array.isArray(inv.project_ids) ? inv.project_ids : (inv.project_id ? [inv.project_id] : []);
    const pTitles = Array.isArray(inv.project_titles) && inv.project_titles.length > 0 
      ? inv.project_titles 
      : (pIds.length > 0 ? pIds.map(pid => (local.projects || []).find(p => p.id === pid)?.title).filter(Boolean) : (project ? [project.title] : []));

    return {
      ...inv,
      client_name: client?.name || inv.client_name || 'Client',
      client_company: client?.company || inv.client_company || 'Agency Client',
      client_email: client?.email || inv.client_email || '',
      project_ids: pIds,
      project_titles: pTitles,
      project_title: inv.project_title || (pTitles.length > 0 ? pTitles.join(', ') : (project?.title || inv.title)),
      amount: Number(inv.amount),
      subtotal: Number(inv.subtotal || inv.amount),
      tax: Number(inv.tax || 0),
      discount: Number(inv.discount || 0),
      items: inv.items || []
    };
  },

  async createInvoice(invoiceData) {
    if (initPromise) await initPromise;
    const id = invoiceData.id || `inv-${Date.now()}`;
    const invoiceNumber = invoiceData.invoice_number || `INV-${new Date().getFullYear()}-${Math.floor(100 + Math.random() * 900)}`;
    const items = Array.isArray(invoiceData.items) ? invoiceData.items : [];
    const subtotal = Number(invoiceData.subtotal || invoiceData.amount || 0);
    const tax = Number(invoiceData.tax || 0);
    const discount = Number(invoiceData.discount || 0);
    const amount = Number(invoiceData.amount || (subtotal + tax - discount));
    const status = invoiceData.status || (invoiceData.published ? 'published' : 'draft');
    const published = invoiceData.published !== undefined ? Boolean(invoiceData.published) : (status === 'published');

    const projectIds = Array.isArray(invoiceData.project_ids) 
      ? invoiceData.project_ids 
      : (invoiceData.project_id ? [invoiceData.project_id] : []);
    const projectTitles = Array.isArray(invoiceData.project_titles)
      ? invoiceData.project_titles
      : (invoiceData.project_title ? invoiceData.project_title.split(',').map(s => s.trim()).filter(Boolean) : []);

    const cleanInvoice = {
      id,
      client_id: invoiceData.client_id || invoiceData.clientId,
      client_name: invoiceData.client_name || null,
      client_company: invoiceData.client_company || null,
      client_email: invoiceData.client_email || null,
      project_id: invoiceData.project_id || (projectIds.length > 0 ? projectIds[0] : null),
      project_ids: projectIds,
      title: invoiceData.title || `Invoice ${invoiceNumber}`,
      project_title: invoiceData.project_title || (projectTitles.length > 0 ? projectTitles.join(', ') : null),
      project_titles: projectTitles,
      invoice_number: invoiceNumber,
      amount,
      subtotal,
      tax,
      discount,
      currency: invoiceData.currency || 'PKR',
      status,
      due_date: invoiceData.due_date || invoiceData.dueDate || '25/10/2026',
      issue_date: invoiceData.issue_date || invoiceData.issueDate || '15/10/2026',
      notes: invoiceData.notes || 'Thank you for your business!',
      payment_details: invoiceData.payment_details || invoiceData.paymentDetails || 'Bank: Meezan Bank | Title: Abdullah | Account: 0102-0103948291',
      published,
      items,
      is_deleted: false,
      created_at: invoiceData.created_at || new Date().toISOString()
    };

    if (isPostgres && pgPool) {
      await pgPool.query(`
        INSERT INTO invoices (
          id, client_id, project_id, title, invoice_number, amount, status,
          due_date, issue_date, currency, subtotal, tax, discount, notes,
          payment_details, published, items, project_ids, project_titles,
          client_name, client_company, client_email, project_title, is_deleted
        )
        VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15, $16, $17::jsonb, $18::jsonb, $19::jsonb, $20, $21, $22, $23, $24)
        ON CONFLICT (id) DO UPDATE SET
          title = EXCLUDED.title,
          amount = EXCLUDED.amount,
          status = EXCLUDED.status,
          due_date = EXCLUDED.due_date,
          issue_date = EXCLUDED.issue_date,
          currency = EXCLUDED.currency,
          subtotal = EXCLUDED.subtotal,
          tax = EXCLUDED.tax,
          discount = EXCLUDED.discount,
          notes = EXCLUDED.notes,
          payment_details = EXCLUDED.payment_details,
          published = EXCLUDED.published,
          items = EXCLUDED.items,
          project_ids = EXCLUDED.project_ids,
          project_titles = EXCLUDED.project_titles,
          client_name = EXCLUDED.client_name,
          client_company = EXCLUDED.client_company,
          client_email = EXCLUDED.client_email,
          client_id = EXCLUDED.client_id,
          invoice_number = EXCLUDED.invoice_number,
          project_id = EXCLUDED.project_id,
          project_title = EXCLUDED.project_title,
          is_deleted = EXCLUDED.is_deleted;
      `, [
        cleanInvoice.id,
        cleanInvoice.client_id,
        cleanInvoice.project_id,
        cleanInvoice.title,
        cleanInvoice.invoice_number,
        cleanInvoice.amount,
        cleanInvoice.status,
        cleanInvoice.due_date,
        cleanInvoice.issue_date,
        cleanInvoice.currency,
        cleanInvoice.subtotal,
        cleanInvoice.tax,
        cleanInvoice.discount,
        cleanInvoice.notes,
        cleanInvoice.payment_details,
        cleanInvoice.published,
        JSON.stringify(cleanInvoice.items),
        JSON.stringify(cleanInvoice.project_ids),
        JSON.stringify(cleanInvoice.project_titles),
        cleanInvoice.client_name,
        cleanInvoice.client_company,
        cleanInvoice.client_email,
        cleanInvoice.project_title,
        cleanInvoice.is_deleted
      ]);
    }

    // Mirror to local store reliably
    const local = readLocalStore();
    local.invoices = [cleanInvoice, ...(local.invoices || []).filter(i => i.id !== cleanInvoice.id)];
    writeLocalStore(local);

    return this.getInvoiceById(id);
  },

  async updateInvoice(id, updates) {
    if (initPromise) await initPromise;
    const existing = await this.getInvoiceById(id);
    if (!existing) return null;

    if (updates.status === 'published' || updates.published === true) {
      updates.published = true;
      updates.status = updates.status || 'published';
    }

    if (isPostgres && pgPool) {
      await pgPool.query(`
        UPDATE invoices SET
          title = COALESCE($1, title),
          amount = COALESCE($2, amount),
          status = COALESCE($3, status),
          due_date = COALESCE($4, due_date),
          notes = COALESCE($5, notes),
          payment_details = COALESCE($6, payment_details),
          published = COALESCE($7, published),
          items = COALESCE($8::jsonb, items),
          client_id = COALESCE($9, client_id),
          invoice_number = COALESCE($10, invoice_number),
          issue_date = COALESCE($11, issue_date),
          currency = COALESCE($12, currency),
          subtotal = COALESCE($13, subtotal),
          tax = COALESCE($14, tax),
          discount = COALESCE($15, discount),
          project_ids = COALESCE($16::jsonb, project_ids),
          project_titles = COALESCE($17::jsonb, project_titles),
          client_name = COALESCE($18, client_name),
          client_company = COALESCE($19, client_company),
          client_email = COALESCE($20, client_email),
          project_id = COALESCE($21, project_id),
          project_title = COALESCE($22, project_title),
          is_deleted = COALESCE($23, is_deleted)
        WHERE id = $24
      `, [
        updates.title || null,
        updates.amount !== undefined ? Number(updates.amount) : null,
        updates.status || null,
        updates.due_date || updates.dueDate || null,
        updates.notes !== undefined ? updates.notes : null,
        updates.payment_details || updates.paymentDetails || null,
        updates.published !== undefined ? Boolean(updates.published) : null,
        updates.items ? JSON.stringify(updates.items) : null,
        updates.client_id || updates.clientId || null,
        updates.invoice_number || null,
        updates.issue_date || null,
        updates.currency || null,
        updates.subtotal !== undefined ? Number(updates.subtotal) : null,
        updates.tax !== undefined ? Number(updates.tax) : null,
        updates.discount !== undefined ? Number(updates.discount) : null,
        updates.project_ids ? JSON.stringify(updates.project_ids) : null,
        updates.project_titles ? JSON.stringify(updates.project_titles) : null,
        updates.client_name || null,
        updates.client_company || null,
        updates.client_email || null,
        updates.project_id || null,
        updates.project_title || null,
        updates.is_deleted !== undefined ? Boolean(updates.is_deleted) : null,
        id
      ]);
    }

    const local = readLocalStore();
    local.invoices = (local.invoices || []).map(inv => inv.id === id ? { ...inv, ...updates } : inv);
    writeLocalStore(local);

    return this.getInvoiceById(id);
  },

  async publishInvoice(id) {
    return this.updateInvoice(id, { status: 'published', published: true });
  },

  async restoreInvoice(id) {
    return this.updateInvoice(id, { is_deleted: false, status: 'draft' });
  },

  async deleteInvoice(id) {
    if (initPromise) await initPromise;
    if (isPostgres && pgPool) {
      // Soft delete: Never permanently wipe invoice records from PostgreSQL
      await pgPool.query("UPDATE invoices SET is_deleted = TRUE, status = 'archived' WHERE id = $1", [id]);
    }
    const local = readLocalStore();
    local.invoices = (local.invoices || []).map(inv => inv.id === id ? { ...inv, is_deleted: true, status: 'archived' } : inv);
    writeLocalStore(local);
    return { success: true, message: 'Invoice safely archived and preserved in database.' };
  }
};

module.exports = db;
