# Full-Stack Setup Guide: Dynamic Student Health Platform

## 🎯 Project Overview

This guide will help you transform the static Student Health Digital Platform into a fully dynamic application with:
- **Backend**: Node.js + Express (Deployed on Render)
- **Database**: Supabase (PostgreSQL)
- **Frontend**: React + Vite (Deployed on Vercel)
- **Authentication**: JWT-based with backend validation

---

## 📋 Architecture

```
┌─────────────────────────────────────────────────────────┐
│                     Frontend (Vercel)                    │
│              React + Vite + TypeScript                   │
└────────────┬────────────────────────────────────────────┘
             │ API Calls (HTTPS)
┌────────────▼────────────────────────────────────────────┐
│                  Backend (Render)                        │
│           Node.js + Express + TypeScript                 │
└────────────┬────────────────────────────────────────────┘
             │ Database Queries
┌────────────▼────────────────────────────────────────────┐
│               Database (Supabase)                        │
│              PostgreSQL + Auth                           │
└─────────────────────────────────────────────────────────┘
```

---

## 🚀 Quick Start

### Phase 1: Local Development Setup

#### 1. Install Dependencies

```bash
# Install frontend dependencies
npm install

# Install backend dependencies
cd backend
npm install
cd ..
```

#### 2. Set Up Supabase

1. Go to [supabase.com](https://supabase.com)
2. Create a new project
3. Go to Project Settings → API
4. Copy your:
   - **Project URL** → `SUPABASE_URL`
   - **Anon Key** → `SUPABASE_KEY`
5. Go to SQL Editor and run the SQL from `backend/supabase-schema.sql`:
   - Click "New Query"
   - Paste the entire SQL schema
   - Click "Run"

#### 3. Create Environment Files

**Backend**: Create `backend/.env`
```env
PORT=3000
NODE_ENV=development
FRONTEND_URL=http://localhost:5173
SUPABASE_URL=your_supabase_url_here
SUPABASE_KEY=your_supabase_key_here
JWT_SECRET=your-secret-key-development
```

**Frontend**: Create `.env`
```env
VITE_API_URL=http://localhost:3000
```

#### 4. Run Locally

**Terminal 1** - Start Backend:
```bash
cd backend
npm run dev
```
Backend runs on `http://localhost:3000`

**Terminal 2** - Start Frontend:
```bash
npm run dev
```
Frontend runs on `http://localhost:5173`

---

## 🌐 Phase 2: Backend Deployment (Render)

### Steps:

1. **Push to GitHub** (if not already done)
   ```bash
   git add .
   git commit -m "Add full-stack setup with backend and Supabase"
   git push origin master
   ```

2. **Create Render Account**
   - Go to [render.com](https://render.com)
   - Sign up with GitHub

3. **Deploy Backend Service**
   - Click "New +"
   - Select "Web Service"
   - Connect your GitHub repository
   - Fill in the details:
     - **Name**: `student-health-backend`
     - **Environment**: Node
     - **Build Command**: `cd backend && npm install && npm run build`
     - **Start Command**: `cd backend && node dist/index.js`

4. **Add Environment Variables**
   In Render Dashboard → Environment:
   ```
   PORT=3000
   NODE_ENV=production
   FRONTEND_URL=https://student-health-platform.vercel.app
   SUPABASE_URL=your_supabase_url
   SUPABASE_KEY=your_supabase_key
   JWT_SECRET=generate-a-secure-random-key
   ```

5. **Deploy**
   - Click "Create Web Service"
   - Wait for deployment to complete
   - Your backend URL: `https://student-health-backend.onrender.com`

---

## 🎨 Phase 3: Frontend Deployment (Vercel)

### Steps:

1. **Create Vercel Account**
   - Go to [vercel.com](https://vercel.com)
   - Sign up with GitHub

2. **Deploy Frontend**
   - Click "Add New Project"
   - Import your GitHub repository
   - Select root directory (or auto-detected)
   - Skip framework selection (Vite auto-detected)

3. **Configure Environment Variables**
   In Vercel → Project Settings → Environment Variables:
   ```
   VITE_API_URL=https://student-health-backend.onrender.com
   ```

4. **Deploy**
   - Click "Deploy"
   - Wait for deployment to complete
   - Your frontend URL: `https://student-health-platform.vercel.app`

---

## 🔄 Phase 4: Connect Frontend to Backend

### Update Frontend API Client

Create `src/services/api.ts` or update if exists:

```typescript
const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000';

export const apiClient = {
  async login(email: string, password: string, role: string) {
    const response = await fetch(`${API_URL}/api/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password, role }),
    });
    return response.json();
  },

  async register(data: any) {
    const response = await fetch(`${API_URL}/api/auth/register`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });
    return response.json();
  },

  async getProfile(token: string) {
    const response = await fetch(`${API_URL}/api/auth/profile`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    return response.json();
  },

  async getHealthRecords(token: string) {
    const response = await fetch(`${API_URL}/api/health-records`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    return response.json();
  },

  async createHealthRecord(token: string, data: any) {
    const response = await fetch(`${API_URL}/api/health-records`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(data),
    });
    return response.json();
  },
};
```

---

## ✅ Testing Endpoints

Use tools like Postman, Insomnia, or curl to test:

### Login
```bash
curl -X POST http://localhost:3000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "student@example.com",
    "password": "password123",
    "role": "student"
  }'
```

### Register
```bash
curl -X POST http://localhost:3000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "email": "newstudent@example.com",
    "password": "password123",
    "firstName": "John",
    "lastName": "Doe",
    "role": "student"
  }'
```

### Get Health Records
```bash
curl -X GET http://localhost:3000/api/health-records \
  -H "Authorization: Bearer YOUR_TOKEN_HERE"
```

---

## 🔒 Security Checklist

- [ ] Change `JWT_SECRET` in production
- [ ] Change `SUPABASE_KEY` to use restricted API key (not anon key)
- [ ] Enable HTTPS everywhere
- [ ] Set proper CORS origins
- [ ] Use environment variables for sensitive data
- [ ] Enable rate limiting on Render
- [ ] Set up database backups in Supabase
- [ ] Enable Row Level Security (RLS) policies in Supabase

---

## 📚 Useful Resources

- [Express.js Documentation](https://expressjs.com/)
- [Supabase Docs](https://supabase.com/docs)
- [Render Deployment Docs](https://render.com/docs)
- [Vercel Deployment Docs](https://vercel.com/docs)
- [Vite Configuration](https://vitejs.dev/config/)

---

## 🆘 Troubleshooting

### CORS Errors
Make sure `FRONTEND_URL` in backend `.env` matches your frontend URL exactly.

### Backend not connecting to Supabase
Check that `SUPABASE_URL` and `SUPABASE_KEY` are correct.

### JWT Token Issues
Ensure `JWT_SECRET` is the same in backend and that tokens are being sent in `Authorization: Bearer <token>` format.

### Render Deploy Fails
Check the build logs in Render Dashboard. Common issues:
- Wrong build command path
- Missing dependencies in `package.json`

---

## 📝 Next Steps

1. Update React components to use the new API endpoints
2. Add error handling and loading states
3. Implement proper state management (Redux, Zustand, etc.)
4. Add more API endpoints as needed
5. Set up automated testing
6. Configure CI/CD pipeline

---

## 📞 Need Help?

Refer to the individual deployment guides:
- [RENDER_DEPLOYMENT.md](./RENDER_DEPLOYMENT.md)
- [VERCEL_CONFIG.md](./VERCEL_CONFIG.md)

Happy coding! 🚀
