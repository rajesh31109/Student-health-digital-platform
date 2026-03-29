# 📁 Project Structure - Frontend & Backend Separation

**Organized on**: March 29, 2026  
**Status**: ✅ Reorganized with clear separation

---

## 📂 Directory Structure

```
Student-health-digital-platform/
│
├── 📁 frontend/                          # React + Vite Frontend Application
│   ├── src/                              # Frontend source code
│   │   ├── components/                   # React components (UI, pages, etc.)
│   │   │   ├── ui/                       # Shadcn UI components
│   │   │   ├── Header.tsx
│   │   │   ├── Footer.tsx
│   │   │   ├── LoginCard.tsx
│   │   │   └── [...more components]
│   │   ├── pages/                        # Page components
│   │   │   ├── Index.tsx
│   │   │   ├── Login.tsx
│   │   │   ├── AdminLogin.tsx
│   │   │   ├── StudentLogin.tsx
│   │   │   ├── MedicalOfficerLogin.tsx
│   │   │   ├── AdminDashboard.tsx
│   │   │   ├── StudentDashboard.tsx
│   │   │   ├── MedicalOfficerDashboard.tsx
│   │   │   ├── About.tsx
│   │   │   └── NotFound.tsx
│   │   ├── services/
│   │   │   └── api.ts                    # API client
│   │   ├── config/
│   │   │   └── api.ts                    # Centralized API configuration
│   │   ├── hooks/
│   │   │   ├── useApi.ts                 # Custom hooks
│   │   │   └── use-mobile.tsx
│   │   ├── lib/
│   │   │   └── utils.ts                  # Utility functions
│   │   ├── App.tsx                       # Main app component
│   │   ├── main.tsx                      # Entry point
│   │   ├── vite-env.d.ts                 # Vite environment types
│   │   ├── App.css                       # Global styles
│   │   └── index.css                     # Tailwind & global CSS
│   ├── public/                           # Static assets
│   │   └── robots.txt
│   ├── index.html                        # HTML entry point
│   ├── .env                              # Frontend environment variables
│   ├── vite.config.ts                    # Vite configuration
│   ├── tsconfig.app.json                 # Frontend TypeScript config
│   ├── vitest.config.ts                  # Vitest configuration
│   ├── tailwind.config.ts                # Tailwind CSS config
│   ├── postcss.config.js                 # PostCSS config
│   ├── components.json                   # Shadcn UI config
│   └── eslint.config.js                  # ESLint config
│
├── 📁 backend/                           # Node.js + Express Backend API
│   ├── src/
│   │   ├── controllers/                  # Business logic (6 files)
│   │   │   ├── adminController.ts
│   │   │   ├── authController.ts
│   │   │   ├── healthRecordController.ts
│   │   │   ├── medicalOfficerController.ts
│   │   │   ├── roleAuthController.ts
│   │   │   └── studentController.ts
│   │   ├── routes/                       # API routes (6 files)
│   │   │   ├── admin.ts
│   │   │   ├── auth.ts
│   │   │   ├── healthRecords.ts
│   │   │   ├── medicalOfficer.ts
│   │   │   ├── roleAuth.ts
│   │   │   └── student.ts
│   │   ├── middleware/                   # Express middleware
│   │   │   ├── auth.ts                   # JWT authentication
│   │   │   └── errorHandler.ts           # Global error handling
│   │   ├── utils/                        # Utility functions
│   │   │   ├── auditLog.ts
│   │   │   ├── jwt.ts
│   │   │   ├── password.ts
│   │   │   ├── studentID.ts
│   │   │   └── supabase.ts
│   │   ├── types/                        # TypeScript types
│   │   │   └── index.ts
│   │   ├── config.ts                     # Configuration
│   │   └── index.ts                      # Entry point
│   ├── dist/                             # Compiled JavaScript output
│   ├── .env                              # Backend environment variables
│   ├── package.json                      # Backend dependencies
│   ├── tsconfig.json                     # Backend TypeScript config
│   ├── SETUP.md                          # Backend setup guide
│   ├── SUPABASE_SETUP.md                 # Database setup
│   └── API_DOCUMENTATION.md              # API docs
│
├── 📄 Common/Shared Files (Root Level)
│   ├── package.json                      # Root scripts (runs frontend & backend)
│   ├── package-lock.json                 # Dependency lock file
│   ├── bun.lockb                         # Bun lock file
│   ├── tsconfig.json                     # Shared TypeScript base config
│   ├── tsconfig.node.json                # Build tool TypeScript config
│   ├── .env                              # Root environment (copied to frontend)
│   ├── .env.example                      # Environment template
│   ├── .gitignore                        # Git ignore rules
│   ├── vercel.json                       # Vercel deployment config
│   ├── node_modules/                     # Shared dependencies
│   └── .git/                             # Git repository
│
├── 📚 Documentation Files (Root Level)
│   ├── README.md                         # Main readme
│   ├── QUICK_START.md                    # Quick start guide
│   ├── SETUP_COMPLETE.md                 # Setup completion guide
│   ├── START_HERE.md                     # Entry point guide
│   ├── WELCOME.md                        # Welcome guide
│   ├── ARCHITECTURE.md                   # Architecture overview
│   ├── TESTING_INSTRUCTIONS.md           # Testing guide
│   ├── FILES_CREATED.md                  # Tracking file creation
│   ├── FULL_STACK_SETUP.md               # Full stack setup
│   ├── COMPLETE_SETUP_GUIDE.md           # Complete setup
│   ├── VITE_CONFIG_UPDATE.md             # Vite config notes
│   ├── VERCEL_CONFIG.md                  # Vercel config notes
│   ├── RENDER_DEPLOYMENT.md              # Render deployment guide
│   ├── DEPLOYMENT_CHECKLIST.md           # Deployment checklist
│   ├── CONNECTION_SUMMARY.md             # Connection summary
│   ├── RENDER_SETUP_GUIDE.md             # Render setup guide
│   ├── VERCEL_ENV_SETUP.md               # Vercel env setup
│   └── PROJECT_STRUCTURE.md              # This file
```

---

## 🚀 Running the Project

### Frontend Development
```bash
npm run dev
# Runs: cd frontend && vite
# Opens: http://localhost:8080
```

### Backend Development
```bash
npm run backend:dev
# Runs: cd backend && npm run dev
# Opens: http://localhost:3001
```

### Frontend Build
```bash
npm run build
# Runs: cd frontend && vite build
# Output: frontend/dist/
```

### Backend Build
```bash
npm run backend:build
# Runs: cd backend && npm run build
# Output: backend/dist/
```

---

## 📋 File Organization Summary

### Frontend Files Location
- **Source Code**: `frontend/src/`
- **Configuration**: `frontend/*.config.ts`, `frontend/*.config.js`, `frontend/*.json`
- **Assets**: `frontend/public/`
- **HTML Entry**: `frontend/index.html`
- **Environment**: `frontend/.env`

### Backend Files Location
- **Source Code**: `backend/src/`
- **Configuration**: `backend/.env`, `backend/package.json`
- **Documentation**: `backend/*.md`
- **Database Setup**: `backend/supabase-schema*.sql`

### Common Files Location
- **Root Scripts**: `package.json` (main project runner)
- **Configuration**: `tsconfig.json`, `tsconfig.node.json`
- **Deployment**: `vercel.json`, backend handles Render
- **Documentation**: All `.md` files at root
- **Dependencies**: `node_modules/` (shared)
- **Version Control**: `.git/`, `.gitignore`

---

## 🔄 How to Update Imports

### If You Reference Frontend Files from Commands
**Before** (old structure):
```bash
cd /workspaces/Student-health-digital-platform
npm run dev
```

**After** (new structure):
```bash
cd /workspaces/Student-health-digital-platform
npm run dev  # Automatically runs from frontend
```

### If You Import Files in Code
Frontend imports remain the same because they're relative to `frontend/src/`:
```typescript
// This still works - paths are relative to frontend/src
import { getApiBaseUrl } from "@/config/api";
import Header from "@/components/Header";
```

### Backend Imports
Backend files use their own paths:
```typescript
// Backend imports remain unchanged
import { authMiddleware } from './middleware/auth';
import { loginStudent } from './controllers/studentController';
```

---

## 📦 Dependencies Management

### Frontend Dependencies
Installed in root `node_modules/` (shared installation):
- React, Vite, TypeScript
- Shadcn UI components
- Axios, React Router
- Tailwind CSS, PostCSS

**Location**: `/workspaces/Student-health-digital-platform/node_modules/`

### Backend Dependencies
Installed in root `node_modules/` (shared installation):
- Express.js, TypeScript
- Supabase client
- JWT, bcryptjs
- CORS, dotenv

**Location**: `/workspaces/Student-health-digital-platform/node_modules/`

**Note**: Both frontend and backend share the same `node_modules` for simplicity. In production (Render/Vercel), they install separately.

---

## 🌍 Environment Variables

### Frontend (.env)
Location: `frontend/.env`
```env
VITE_API_URL=http://localhost:3001
```

### Backend (.env)
Location: `backend/.env`
```env
NODE_ENV=development
PORT=3001
SUPABASE_URL=...
SUPABASE_KEY=...
JWT_SECRET=...
FRONTEND_URL=http://localhost:8081
```

### Root (.env - Optional)
Location: `.env`
Can be used for shared configuration if needed.

---

## 🚢 Deployment Structure

### Vercel (Frontend)
- **Root**: Project root
- **Source Directory**: `frontend`
- **Build Command**: `cd frontend && npm run build --legacy-peer-deps`
- **Output Directory**: `frontend/dist`

### Render (Backend)
- **Root**: Project root
- **Source Directory**: `backend`
- **Build Command**: `cd backend && npm install && npm run build`
- **Start Command**: `node dist/index.js`

---

## ✅ What Was Reorganized

### Moved to `frontend/`
- ✅ `src/`
- ✅ `public/`
- ✅ `index.html`
- ✅ `vite.config.ts`
- ✅ `tsconfig.app.json`
- ✅ `vitest.config.ts`
- ✅ `components.json`
- ✅ `postcss.config.js`
- ✅ `eslint.config.js`
- ✅ `tailwind.config.ts`
- ✅ `.env` (copied)

### Kept at Root
- ✅ `package.json` (updated with new scripts)
- ✅ `tsconfig.json`
- ✅ `tsconfig.node.json`
- ✅ `vercel.json`
- ✅ All documentation (`.md` files)
- ✅ `.env` & `.env.example`
- ✅ `.gitignore`
- ✅ `node_modules/`

### Already in `backend/`
- ✅ All backend source files
- ✅ Backend configuration
- ✅ `.env`
- ✅ `package.json`

---

## 🔍 Quick Navigation Guide

| Component | Location | Purpose |
|-----------|----------|---------|
| React Components | `frontend/src/components/` | UI components |
| Page Components | `frontend/src/pages/` | Route pages |
| API Configuration | `frontend/src/config/api.ts` | Centralized API config |
| Vite Config | `frontend/vite.config.ts` | Frontend build config |
| Express Routes | `backend/src/routes/` | API endpoints |
| Controllers | `backend/src/controllers/` | Business logic |
| Database Config | `backend/src/utils/supabase.ts` | Database connection |
| Frontend Env | `frontend/.env` | Frontend environment |
| Backend Env | `backend/.env` | Backend environment |
| Root Scripts | `package.json` | Project commands |

---

## 📝 Commands Reference

```bash
# Development
npm run dev              # Frontend (http://localhost:8080)
npm run backend:dev      # Backend (http://localhost:3001)

# Production Build
npm run build            # Frontend build
npm run backend:build    # Backend build

# Testing
npm test                 # Frontend tests
npm test:watch           # Frontend tests (watch mode)

# Linting
npm run lint             # Frontend eslint

# Preview
npm run preview          # Preview frontend build
```

---

## 🎯 Benefits of This Structure

✅ **Clear Separation**: Frontend and backend are clearly separated  
✅ **Easy Deployment**: Each service deploys independently  
✅ **Scalability**: Easy to add more services/apps  
✅ **Maintainability**: Easier to understand file organization  
✅ **Team Collaboration**: Frontend team works in `frontend/`, backend in `backend/`  
✅ **Git Management**: Easier to track changes per service  

---

## 🔗 Related Documentation

- [Deployment Checklist](./DEPLOYMENT_CHECKLIST.md)
- [Render Setup Guide](./RENDER_SETUP_GUIDE.md)
- [Vercel Environment Setup](./VERCEL_ENV_SETUP.md)
- [Architecture Documentation](./ARCHITECTURE.md)
- [Quick Start Guide](./QUICK_START.md)

---

**Status**: ✅ Project restructured and organized  
**Date**: March 29, 2026
