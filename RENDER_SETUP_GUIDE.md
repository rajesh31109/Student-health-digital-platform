# 🖥️ Render Deployment - Backend Setup Guide

**Backend Status**: Ready for Deployment to Render ✅

---

## 📋 Pre-Deployment Checklist

- [x] Backend code in `backend/` directory
- [x] TypeScript compiled to JavaScript
- [x] Dependencies listed in `backend/package.json`
- [x] Environment variables configured
- [x] Database (Supabase) ready
- [x] Build script configured

---

## 🚀 Step-by-Step Render Deployment

### Step 1: Create Render Account
1. Go to https://render.com
2. Click "Get Started"
3. Sign up with GitHub account
4. Authorize GitHub access

### Step 2: Create New Web Service
1. Click "New +" button
2. Select "Web Service"
3. Search for your GitHub repo: `Student-health-digital-platform`
4. Click "Connect"

### Step 3: Configure Service Settings

**Name**:
```
student-health-backend
```

**Environment**:
```
Node
```

**Region**:
```
Choose closest to your users
Example: Singapore, Europe, US
```

**Branch**:
```
master
```

**Build Command**:
```bash
cd backend && npm install && npm run build
```

**Start Command**:
```bash
node dist/index.js
```

**Root Directory**:
```
Leave empty (default)
```

### Step 4: Set Environment Variables

Add these in the "Environment" section:

| Variable | Value | Notes |
|---|---|---|
| `NODE_ENV` | `production` | Production environment |
| `PORT` | `3000` | Render assigns port automatically |
| `SUPABASE_URL` | `https://hnbuxvarpgwoqntehoev.supabase.co` | From Supabase dashboard |
| `SUPABASE_ANON_KEY` | `eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...` | From Supabase |
| `SUPABASE_SERVICE_KEY` | `eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...` | From Supabase (keep secret) |
| `JWT_SECRET` | `frZxXzaMgUVorcvomQu7+SOKavDRMyFj6g8GsikTGmQ=` | JWT signing secret |
| `FRONTEND_URL` | `https://studentdigitialhealthprofile.vercel.app` | Your Vercel frontend URL |
| `ADMIN_EMAIL` | `rajeshpulluri333@gmail.com` | Admin user email |
| `ADMIN_PASSWORD` | `admin123` | Admin user password |
| `ADMIN_NAME` | `DMHO` | Admin user name |

### Step 5: Create & Deploy

1. Click "Create Web Service"
2. Render will start building automatically
3. Watch the build logs in real-time
4. Deployment takes 2-5 minutes

Once deployed, your backend URL will be:
```
https://student-health-backend.onrender.com
```

---

## 📊 Backend Architecture

```
Your Vercel Frontend
       ↓ (HTTPS)
GitHub Codespaces (Dev)
       ↓
Your Render Backend
       ↓ (HTTPS)
Supabase Database
```

---

## 🔐 Environment Variables Explained

### Required for Production

**`NODE_ENV=production`**
- Enables production optimizations
- Disables debug logging

**`PORT=3000`**
- Render auto-assigns port
- Backend listens on this port

**`FRONTEND_URL=https://studentdigitialhealthprofile.vercel.app`**
- Used for CORS configuration
- Allows frontend to make API calls
- Must match Vercel domain exactly

**`SUPABASE_URL`** & **`SUPABASE_ANON_KEY`**
- For database connection
- Get from Supabase dashboard
- Project Settings → API

**`JWT_SECRET`**
- For signing authentication tokens
- Keep secure and unique per environment
- Use strong 32+ character string

### Optional but Recommended

**`ADMIN_EMAIL`, `ADMIN_PASSWORD`, `ADMIN_NAME`**
- Initial admin user credentials
- Created on first server start
- Can be created via API later

---

## ✅ Deployment Verification

### After Deployment

1. **Check Health Endpoint**
   ```bash
   curl https://student-health-backend.onrender.com/api/health
   ```
   
   Expected response:
   ```json
   {"status":"ok","timestamp":"2026-03-29T..."}
   ```

2. **Monitor Logs**
   - In Render dashboard
   - Go to "Logs" tab
   - Watch for startup messages

3. **Test API Endpoints**
   ```bash
   # Test admin login
   curl -X POST https://student-health-backend.onrender.com/api/auth/admin-login \
     -H "Content-Type: application/json" \
     -d '{
       "email": "rajeshpulluri333@gmail.com",
       "password": "admin123"
     }'
   ```

4. **Update Frontend**
   - Set Vercel `VITE_API_URL` to your Render URL
   - Redeploy Vercel
   - Test from Vercel frontend

---

## 🔄 Continuous Deployment

### Automatic Redeploy
- Every push to `master` branch triggers redeploy
- Takes 2-5 minutes
- Check logs in Render dashboard

### Manual Redeploy
1. Go to Render dashboard
2. Click "Deployments"
3. Find latest deployment
4. Click "Redeploy"

---

## 📈 Monitoring & Logs

### View Logs
1. Dashboard → Your Service → "Logs" tab
2. See real-time server output
3. Check for errors

### Common Log Messages

**Startup**:
```
🚀 Server running on http://0.0.0.0:3000
📦 Frontend URL: https://studentdigitialhealthprofile.vercel.app
✅ Backend accessible at http://localhost:3000
```

**Error Connection**:
```
⚠️ Missing environment variable: SUPABASE_URL
```

---

## 💾 Database Connection

Backend connects to Supabase using:
- `SUPABASE_URL`: Project URL
- `SUPABASE_ANON_KEY`: Public key

Connection pooling happens automatically.

---

## 🚨 Troubleshooting

### Build Fails
**Error**: `npm ERR! ERESOLVE unable to resolve dependency tree`

**Solution**: 
- Check `backend/package.json`
- Run locally: `npm install` to test
- Push fix to GitHub
- Render will retry build automatically

### Service Crashes After Deploy
**Check**:
1. Environment variables set correctly
2. Supabase credentials valid
3. JWT_SECRET configured
4. Database migrations completed

**View logs** in Render dashboard

### Frontend Cannot Connect
**Verify**:
1. Backend health endpoint: `curl https://student-health-backend.onrender.com/api/health`
2. `FRONTEND_URL` set in backend env vars
3. `VITE_API_URL` set in Vercel env vars
4. Both URLs are HTTPS

---

## 🔗 Backend Routes Available After Deployment

```
Authentication:
POST    https://student-health-backend.onrender.com/api/auth/student-login
POST    https://student-health-backend.onrender.com/api/auth/mo-login
POST    https://student-health-backend.onrender.com/api/auth/admin-login
GET     https://student-health-backend.onrender.com/api/auth/profile (with JWT)
POST    https://student-health-backend.onrender.com/api/auth/logout

Admin:
GET     https://student-health-backend.onrender.com/api/admin/dashboard/statistics
GET     https://student-health-backend.onrender.com/api/admin/students
...and more

Health Check:
GET     https://student-health-backend.onrender.com/api/health
```

---

## 📞 Support Resources

- **Render Docs**: https://render.com/docs
- **Node.js Support**: https://nodejs.org/en/docs/
- **Supabase Support**: https://supabase.com/docs
- **Express.js**: https://expressjs.com

---

## 🎯 Next Steps After Deployment

1. ✅ Render backend running
   - URL: `https://student-health-backend.onrender.com`

2. Update Vercel environment
   - Set `VITE_API_URL` to your Render URL
   
3. Redeploy Vercel frontend
   - Changes apply immediately

4. Test end-to-end
   - Login from frontend
   - Verify data flows from backend
   - Check dashboards

5. Monitor production
   - Check Render logs periodically
   - Set up alerts if needed

---

## 📝 Environment Variables Template

Use this when setting up on Render:

```
NODE_ENV=production
PORT=3000
SUPABASE_URL=https://hnbuxvarpgwoqntehoev.supabase.co
SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImhuYnV4dmFycGd3b3FudGVob2V2Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzQ3MTkyNDcsImV4cCI6MjA5MDI5NTI0N30.HprpU4ACIx6ybJpjqce46roPXu1Sk4nEU10rlOH4Sbc
SUPABASE_SERVICE_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImhuYnV4dmFycGd3b3FudGVob2V2Iiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc3NDcxOTI0NywiZXhwIjoyMDkwMjk1MjQ3fQ.OmLjEcXaYyy5X8vBO6H-IwRZkH9nFwvRmiKAvLmV4sY
JWT_SECRET=frZxXzaMgUVorcvomQu7+SOKavDRMyFj6g8GsikTGmQ=
FRONTEND_URL=https://studentdigitialhealthprofile.vercel.app
ADMIN_EMAIL=rajeshpulluri333@gmail.com
ADMIN_PASSWORD=admin123
ADMIN_NAME=DMHO
```

---

**Status**: Backend ready for Render deployment ✅
