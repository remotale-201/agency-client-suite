# ==========================================
# Multi-Stage Production Docker Build
# Unified Fullstack: Backend + Vite Frontend
# ==========================================

# Stage 1: Build Frontend Assets
FROM node:20-alpine AS builder

WORKDIR /app

# Install frontend dependencies
COPY frontend/package*.json ./frontend/
RUN cd frontend && npm ci

# Copy frontend source and build
COPY frontend/ ./frontend/
RUN cd frontend && npm run build

# Stage 2: Production Container
FROM node:20-alpine AS runner

WORKDIR /app

ENV NODE_ENV=production
ENV PORT=5000

# Install backend dependencies (production only)
COPY backend/package*.json ./backend/
RUN cd backend && npm install --production

# Copy backend source
COPY backend/ ./backend/

# Copy compiled frontend from builder stage into position
COPY --from=builder /app/frontend/dist ./frontend/dist

# Expose server port
EXPOSE 5000

WORKDIR /app/backend

CMD ["node", "server.js"]
