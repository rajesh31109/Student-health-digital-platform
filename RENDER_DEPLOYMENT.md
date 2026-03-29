# Render Deployment Guide for Backend

## Steps to Deploy Backend to Render

### 1. Create a Render Account
- Go to [render.com](https://render.com)
- Sign up with your GitHub account

### 2. Connect Your GitHub Repository
- In Render Dashboard, click "New +"
- Select "Web Service"
- Connect your GitHub repository
- Select the Student-health-digital-platform repository

### 3. Configure the Service
Fill in the following details:

**Name**: `student-health-backend`

**Environment**: Node

**Build Command**: 
```bash
cd backend && npm install && npm run build
```

**Start Command**: 
```bash
node dist/index.js
```

### 4. Set Environment Variables
Add these in the Render Dashboard:

```
PORT=3000
NODE_ENV=production
FRONTEND_URL=https://your-vercel-url.vercel.app
SUPABASE_URL=your_supabase_url
SUPABASE_KEY=your_supabase_key
JWT_SECRET=your-jwt-secret-key-change-this-to-something-secure
```

### 5. Deploy
- Click "Create Web Service"
- Render will automatically deploy when you push to main branch
- Your backend URL will be: `https://student-health-backend.onrender.com`

## Updating Environment Variables After Deployment
1. Go to your Service Dashboard
2. Click "Environment"
3. Update any variables as needed
4. Service will redeploy automatically

## Monitoring
- Check logs in the Render dashboard
- Monitor health with the `/api/health` endpoint
