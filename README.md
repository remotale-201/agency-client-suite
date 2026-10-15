# Remotale OS • Agency Platform & Multi-Client Portal System

An elite agency management platform and isolated multi-client portal system. Built for digital agencies, development studios, and freelancers to manage client projects, track deliverables, share project details, and maintain secure project isolation between clients.

---

## 🔑 Published System Credentials & Access Directory

The system is pre-configured with verified credentials for **Super Admin** and all **Client Portals**:

| Role | User / Client | Username | Email | Password | Assigned Projects | Access Scope |
| :--- | :--- | :--- | :--- | :--- | :--- | :--- |
| **👑 Super Admin** | Abdullah | `admin` | `admin@remotale.com` | `admin` *(or `admin123`)* | **All 10 Projects** | Full Agency Access (All Clients & Projects) |
| **👤 Client** | Awais (Awais Agency) | `awais` | `awais@remotale.com` | `awais` | **8 Projects Only** | Strictly Awais's 8 Assigned Projects |
| **👤 Client** | Afshal (Afshal Brand) | `afshal` | `afshal@remotale.com` | `afshal` | **2 Projects Only** | Strictly Afshal's 2 Assigned Projects |
| **👤 Client** | Ali Khan (Acme Brand) | `ali` | `ali@remotale.com` | `client123` | **Client Projects** | Strictly Ali Khan's Projects |

> **Client Data Isolation Policy**:
> - Each client logs in and sees **ONLY their own assigned projects, deliverables, tasks, and messages**.
> - Clients cannot view or access other clients' projects.
> - The **Super Admin** sees **all 10 projects** across all clients and can preview any individual client portal instantly using the persona selector.

---

### 📦 Client Project Breakdown

#### 1. Awais (Client Portal — 8 Assigned Projects)
1. **Pak White Label Abdul Saboor** (Web Development • In Progress)
2. **Pak White Label Store (Latest)** (Web Development • In Progress)
3. **Fytnex Products Designing** (Graphics • In Progress • 25% Done)
4. **20 Dfynex Graphics** (Graphics • Pending finalization)
5. **20 Fytnix Graphics** (Graphics • Pending article designing)
6. **20 WearPhere Graphics** (Graphics • Urgent • 25% Done)
7. **20 Oxytees Graphics** (Graphics • Urgent • 25% Done)
8. **20 MrGymWear Graphics** (Graphics • High Priority • 25% Done)

#### 2. Afshal (Client Portal — 2 Assigned Projects)
1. **Farjah — Luxury Decor Items (Redesign)** (Web Development • Urgent)
2. **Distant Market** (Web Development • Medium Priority)

---

## 🌟 Key Features

### 👑 1. Agency Owner / Admin Dashboard
- **All 10 Projects Overview**: Complete visibility into all active client projects, deadlines, and progress.
- **Client Management**: Create, assign, and manage projects per client.
- **Client Persona Preview**: Admin can switch to preview any specific client portal (`Awais`, `Afshal`, `Ali Khan`) to inspect their experience in real time.

### 👤 2. Dedicated Client Portals
- **Isolated Workspace**: Personalized greeting (`Hello, Awais 👋`, `Hello, Afshal 👋`), brand profile, and metrics.
- **Filtered Project Catalog**: Each client only sees their own projects, progress bars, and deliverables.
- **Project Detail Workspace**: Full project overview with task completion checklists and project notes.

---

## 🚀 Quick Start (Local Development)

Both frontend and backend start simultaneously with a single command:

```bash
# From the root directory:
npm run dev
```

- **Frontend (Vite + React)**: [http://localhost:3000](http://localhost:3000)
- **Backend API (Node.js + Express)**: [http://localhost:5000](http://localhost:5000)

> **Zero Configuration Required**: Out of the box, the server operates on a persistent local database engine (`backend/data/store.json`). All changes, notepads, projects, and revisions are persisted across restarts without needing any external accounts or credentials!

---

## ☁️ Production Deployment Guide

The platform supports **both deployment models**:
1. **Single-Service Unified Fullstack** (Easiest & Free: Render, Railway, Docker, VPS, Fly.io) — Runs backend API and serves pre-built React frontend from one single service!
2. **Decoupled Split Architecture** (Vercel Frontend + Render/Northflank Backend) — Maximum edge speed for frontend with dedicated backend.

---

### 🗄️ Step 1: Database Setup (Neon PostgreSQL)
1. Sign up for free at [Neon.tech](https://neon.tech).
2. Create a new PostgreSQL project.
3. Copy your database connection string:
   ```env
   DATABASE_URL=postgres://neondb_owner:password@ep-snowflake-123456.us-east-2.aws.neon.tech/neondb?sslmode=require
   ```
*(Note: If `DATABASE_URL` is omitted, the app automatically falls back to the embedded JSON database engine in `backend/data/store.json`)*.

---

### 🚀 Option A: 1-Click Unified Fullstack (Render)
Deploy backend + frontend together on a single Render Web Service:
1. Push this repository to your GitHub account.
2. Go to [Render Dashboard](https://dashboard.render.com) → **New** → **Blueprint** (or **Web Service**).
   - If using **Web Service**:
     - **Build Command**: `npm run build:all`
     - **Start Command**: `npm run start`
     - **Health Check Path**: `/api/health`
3. Add Environment Variables:
   - `NODE_ENV=production`
   - `PORT=5000`
   - `DATABASE_URL=<your-neon-postgres-url>`
4. Click **Create Web Service**. Your entire application and client portals are live on one URL!

---

### ⚡ Option B: Vercel (Frontend) + Render/Northflank (Backend)

#### 1. Deploy the Backend (Render or Northflank):
- **Root Directory**: `backend` (or use root with `node backend/server.js`)
- **Start Command**: `node server.js`
- **Port**: `5000`
- **Environment Variables**:
  - `DATABASE_URL=<your-neon-postgres-url>`
  - `PORT=5000`
- Note your live backend URL (e.g., `https://vanguard-api.onrender.com`).

#### 2. Deploy Frontend to Vercel:
- Connect your GitHub repo to [Vercel](https://vercel.com).
- Root directory can be `.` or `frontend` (`vercel.json` handles both automatically).
- In Vercel **Environment Variables**:
  ```env
  VITE_API_URL=https://vanguard-api.onrender.com
  ```
- Click **Deploy**!

---

### 🚂 Option C: Railway or Heroku
1. Push repo to GitHub.
2. In Railway / Heroku, connect the repo.
3. Railway automatically detects `Procfile` (`web: node backend/server.js`) and root `package.json`.
4. Set Build Command to `npm run build:all` and Start Command to `npm start`.
5. Add `DATABASE_URL` environment variable.

---

### 🐳 Option D: Docker & Docker Compose (Self-Hosted / VPS / Coolify)
To build and run the production container locally or on a VPS:

```bash
# Using Docker Compose (Single command):
docker compose up -d --build

# Or standard Docker:
docker build -t vanguard-agency .
docker run -p 5000:5000 -e DATABASE_URL="<your-neon-url>" vanguard-agency
```
The app will be accessible at `http://localhost:5000` with the healthcheck at `http://localhost:5000/api/health`.

---

## 🛠️ Tech Stack & Design System
- **Frontend**: React 18, Vite, Vanilla CSS with curated obsidian dark theme (`#070a12`, `#0e1424`), Lucide icons, Google Fonts (`Plus Jakarta Sans` & `JetBrains Mono`).
- **Backend**: Express, CORS, dual-mode persistence (`pg` for Neon PostgreSQL + local JSON store fallback).
- **Tooling**: Concurrently for unified local execution.
