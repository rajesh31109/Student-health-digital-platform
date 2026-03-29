# 🚀 Deployment & Production Setup Guide

## Environment Variables Configuration

### Vercel Dashboard Setup
All environment variables must be set in your **Vercel Project Settings**:

#### 1. Frontend (Vite) Environment Variables
Add these in **Settings → Environment Variables**:

| Variable | Value | Environments |
|----------|-------|--------------|
| `VITE_API_URL` | `https://your-backend-url.com/api` | Production, Preview, Development |

**Example values:**
- Production: `https://student-health-backend.onrender.com/api`
- Local/Dev: `http://localhost:3001/api`

#### 2. Backend Environment Variables
If you have a backend on Vercel/Render, configure:

| Variable | Value |
|----------|-------|
| `NODE_ENV` | `production` |
| `PORT` | `3001` |
| `SUPABASE_URL` | Your Supabase project URL |
| `SUPABASE_KEY` | Your Supabase anon key |
| `JWT_SECRET` | Your JWT signing secret |

---

## Deployment Steps

### Step 1: Update Backend URL
Edit `.env.production`:
```env
VITE_API_URL=https://your-actual-backend-url.com/api
```

### Step 2: Configure Vercel Environment Variables
1. Go to [Vercel Dashboard](https://vercel.com/dashboard)
2. Select your project
3. Go to **Settings → Environment Variables**
4. Add `VITE_API_URL` with your backend URL
5. Apply to all environments (Production, Preview, Development)

### Step 3: Push and Deploy
```bash
git add .env.production
git commit -m "config: Update production API URL for Vercel deployment"
git push
```

Vercel will automatically trigger a new deployment.

### Step 4: Verify Deployment
1. Check Vercel build logs for any errors
2. Test the deployment URL in your browser
3. Login with your credentials
4. Verify API calls are working (check browser Network tab)

---

## Build Process

### Local Build Testing
```bash
# Test build locally before pushing
npm run build

# Test build with environment variable
VITE_API_URL=https://your-backend.com/api npm run build
```

### What the Build Does
1. **Install dependencies** - npm install
2. **Build frontend** - vite build (outputs to `frontend/dist`)
3. **Generate static assets** - CSS, JS bundles
4. **Create optimized bundle** - Ready for production

---

## Troubleshooting

### Build Fails: "window is not defined"
- Ensure API configuration uses `typeof window` check ✓ (Fixed in latest)
- Never access `window` during import/initialization

### Build Fails: "VITE_API_URL is undefined"
- Add to Vercel Environment Variables
- Or add to `.env.production` file
- Vercel dashboard variables take precedence

### Frontend Can't Connect to Backend
- Check that `VITE_API_URL` is set correctly
- Verify backend is running and accessible
- Check browser Network tab for failed requests
- Ensure CORS is enabled on backend

### Package Manager Changed Warning
- This is normal when node_modules changes significantly
- Usually resolves on next deployment
- Force rebuild if issue persists: Settings → Deployments → Redeploy

---

## Production Architecture

```
┌─────────────────────────────────────────┐
│        User's Browser                   │
│    (Vercel Frontend Deployment)         │
└────────────────┬────────────────────────┘
                 │ VITE_API_URL
                 │ (https://backend.com/api)
                 ↓
┌─────────────────────────────────────────┐
│      Backend API Server                 │
│   (Render/AWS/DigitalOcean)             │
│                                         │
│  - Express/Node.js server               │
│  - Authentication & Authorization       │
│  - Database operations                  │
│  - Business logic                       │
└────────────────┬────────────────────────┘
                 │
                 ↓
        ┌────────────────┐
        │    Supabase    │
        │   PostgreSQL   │
        │   (Database)   │
        └────────────────┘
```

---

## Environment Variable Priority

Vite loads variables in this order (highest to lowest):

1. **Vercel Environment Variables** (Dashboard) - ⭐ Used for production
2. `.env.production` - Used for local production build testing  
3. `.env` - Used for development
4. Default fallback - `http://localhost:3001/api`

---

## Quick Deployment Checklist

- [ ] Backend is running and accessible
- [ ] `VITE_API_URL` is set in Vercel Dashboard
- [ ] `.env.production` has correct API URL
- [ ] No uncommitted changes in git
- [ ] Latest code is pushed to master branch
- [ ] Vercel build logs show no errors
- [ ] Deployed URL is accessible in browser
- [ ] Login works with valid credentials
- [ ] API calls show in Network tab

---

## Getting Help

1. **Check Vercel Logs**: Project → Deployments → Select deployment → Logs
2. **Debug Frontend**: Browser DevTools → Console & Network tabs
3. **Check Backend**: Backend server logs (Render/AWS/etc)
4. **Database**: Supabase Dashboard → SQL Editor to verify tables exist

