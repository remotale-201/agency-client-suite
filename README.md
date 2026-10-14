# Vanguard Studio • Agency OS & Multi-Client Portal System

An elite, high-performance agency management platform and client portal designed with a minimal Dribbble-grade dark aesthetic. Built specifically for digital agencies, development studios, and freelancers to manage client projects, track revenues, share live project notepads, and manage urgency-flagged revision requests with deadlines.

---

## 🌟 Key Features

### 👑 1. Agency Owner / Admin Dashboard
- **Executive Revenue Metrics**: Real-time tracking of total contract values ($89,000+ default seed), completed projects, active pipelines, and pending kickoffs.
- **Urgent Action Banner**: Highlights `🔥 Critical` revision requests requiring immediate engineering attention.
- **Live Client Changes Feed**: Centralized board of all requested revisions with urgency badges, target completion dates, and status toggles (`Pending` → `In Review` → `In Progress` → `Completed`).
- **Direct Client Notepads Aggregator**: Inspect every client project's notepad, requirements, and meeting notes in one place.
- **Client Directory & Portal Links**: Generate and copy custom client portal access links (e.g. `/?portal=finflow-access`).
- **Project Management**: Add deliverables, set budgets, define deadlines, and attach design/preview links (Figma, live staging, Drive).

### 👤 2. Dedicated Client Portals
- **Client-Branded Workspace**: Personalized greeting, active deliverables progress bar, and external links.
- **Interactive Project Notepad**:
  - Live, real-time sync notepad for notes, specs, and comments.
  - Quick-insert helpers: `+ Revision Request`, `+ Review Notes`, `+ Bug Report`.
- **Urgency-Flagged Change Requests**:
  - `🔥 Critical` (Blocks launch / showstopper)
  - `⚡ High` (Priority revisions)
  - `🟢 Normal` (Standard feedback)
  - `☕ Low` (Nice-to-have cosmetic refinements)
  - **Target Completion Date** selector.
  - Full revision history and agency resolution tracking.
- **Deliverables & Milestones**: Interactive checklist showing exact progress % for each project.

### 🎭 3. Instant Persona Switcher
- Convenient top bar allowing you to switch between **Agency Owner (Admin)** and multiple client portals (**FinFlow Technologies**, **Lumina Health**, **Nexus AI**) with a single click — perfect for client presentations, screen shares, and testing!

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
