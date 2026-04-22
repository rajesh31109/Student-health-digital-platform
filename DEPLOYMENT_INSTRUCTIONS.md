# Deployment Instructions

## Overview
Both frontend (Vercel) and backend (Render) services are configured and ready for deployment.

## Prerequisites
- GitHub account with repository access
- Vercel account (https://vercel.com)
- Render account (https://render.com)
- Supabase credentials

## 1. Frontend Deployment (Vercel)

### Option A: Auto-deploy via GitHub (Recommended)
1. Go to https://vercel.com/new
2. Import repository: `rajesh31109/Student-health-digital-platform`
3. Select root directory: `frontend`
4. Add environment variable:
   - `VITE_API_URL`: `https://student-health-backend.onrender.com/api`
5. Click "Deploy"

### Option B: Manual CLI deployment
```bash
npm install -g vercel
cd frontend
vercel deploy --prod
```

## 2. Backend Deployment (Render)

### Option A: Blueprint Deploy (Recommended)
1. Go to https://dashboard.render.com
2. Click "New +" → "Blueprint"
3. Connect your GitHub repo
4. Render detects `render.yaml` and deploys automatically
5. Add environment variables in Render dashboard:
   - `SUPABASE_URL=https://hnbuxvarpgwoqntehoev.supabase.co`
   - `SUPABASE_KEY=eyJhbGc...` (your anon key)
   - `SUPABASE_SERVICE_KEY=eyJhbGc...` (your service role key)
   - `JWT_SECRET=frZxXzaMgUVorcvomQu7+SOKavDRMyFj6g8GsikTGmQ=`
   - `FRONTEND_URL=https://student-health-platform.vercel.app`
   - `ADMIN_EMAIL=rajeshpulluri333@gmail.com`
   - `ADMIN_PASSWORD=Rajesh@123`
   - `ADMIN_NAME=DMHO`

### Option B: Manual Dashboard Deploy
1. Go to https://dashboard.render.com
2. Click "New +" → "Web Service"
3. Connect your GitHub repo
4. Set name: `student-health-backend`
5. Set root directory: `backend`
6. Set build command: `npm run build`
7. Set start command: `npm start`
8. Add all environment variables listed above
9. Click "Create Web Service"

## 3. After Deployment

### Update Frontend Environment
1. Get your Render backend URL from Render dashboard (format: `https://xxx.onrender.com`)
2. Go to Vercel project settings
3. Update environment variable: `VITE_API_URL=https://xxx.onrender.com/api`
4. Redeploy frontend

### Verify Health Endpoints
```bash
# Frontend
curl https://student-health-platform.vercel.app/

# Backend
curl https://student-health-backend.onrender.com/api/health
```

## 4. Test Application

### Admin Login
- URL: `https://student-health-platform.vercel.app/login/admin`
- Email: `rajeshpulluri333@gmail.com`
- Password: `Rajesh@123`

### Medical Officer Login
- URL: `https://student-health-platform.vercel.app/login/medical-officer`
- Email: `doctor@example.com`
- Password: `doctor123`

### Student Login
- URL: `https://student-health-platform.vercel.app/login/student`
- Health ID: `TG-01-1968-0001`

## Important Notes

- Backend auto-creates admin user from environment variables on startup
- Keep JWT_SECRET and API keys secure in production
- Monitor Render logs for any deployment errors
- Enable auto-deploy from GitHub for continuous updates
- Update Vercel API_URL after each backend redeploy
