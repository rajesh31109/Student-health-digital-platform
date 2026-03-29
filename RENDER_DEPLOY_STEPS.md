# 🚀 RENDER BACKEND DEPLOYMENT - STEP BY STEP

**Date**: March 29, 2026  
**Project**: Student Health Digital Platform  
**Backend Status**: ✅ READY TO DEPLOY  

---

## ✅ PRE-DEPLOYMENT VERIFICATION

### Backend Readiness Check ✅
- ✅ Backend code in `backend/src/`
- ✅ TypeScript configs in place
- ✅ Build script: `npm run build` → outputs to `backend/dist/`
- ✅ Start command: `node dist/index.js`
- ✅ Environment variables configured in `backend/.env`
- ✅ Database (Supabase) connected
- ✅ All dependencies in `backend/package.json`

### Current Environment Variables
```
SUPABASE_URL=https://hnbuxvarpgwoqntehoev.supabase.co
SUPABASE_ANON_KEY=eyJhbGc... (configured)
SUPABASE_SERVICE_KEY=eyJhbGc... (configured)
JWT_SECRET=frZxXz... (configured)
```

**Status**: ✅ READY

---

## 🎯 DEPLOYMENT STEPS

### STEP 1: Go to Render Website
```
1. Open: https://render.com
2. Click "Get Started" button
3. Sign up with GitHub account OR login if you already have account
4. Authorize Render to access your GitHub repositories
```

### STEP 2: Create New Web Service
```
1. In Render Dashboard, click "New +" button (top right)
2. Select "Web Service"
3. You'll see a list of your GitHub repositories
```

### STEP 3: Connect Repository
```
1. Find and click: "Student-health-digital-platform"
2. Click "Connect" button
3. Render will now fetch repository details
```

### STEP 4: Configure Service Settings

Fill in these exact values:

**Service Name:**
```
student-health-backend
```

**Environment:**
```
Node
(should be auto-selected)
```

**Region:**
```
Choose based on where your users are:
- United States (default)
- Europe
- Singapore
(For India-based users, choose Singapore)
```

**Branch:**
```
master
(should be auto-selected)
```

**Root Directory:**
```
Leave EMPTY (do not fill)
```

**Build Command:**
```
cd backend && npm install && npm run build
```

**Start Command:**
```
cd backend && node dist/index.js
```

---

## 🔐 STEP 5: Set Environment Variables

⚠️ **IMPORTANT**: Copy each value exactly including all characters

### How to Add Variables:
1. Look for "Environment" section in Render form
2. Click "Add Environment Variable" 
3. For each variable below, enter the **Key** and **Value**

### Variables to Add:

#### 1. Node Environment
```
Key:   NODE_ENV
Value: production
```

#### 2. Port
```
Key:   PORT
Value: 3000
```

#### 3. Supabase URL
```
Key:   SUPABASE_URL
Value: https://hnbuxvarpgwoqntehoev.supabase.co
```

#### 4. Supabase Anon Key
```
Key:   SUPABASE_ANON_KEY
Value: eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImhuYnV4dmFycGd3b3FudGVob2V2Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzQ3MTkyNDcsImV4cCI6MjA5MDI5NTI0N30.HprpU4ACIx6ybJpjqce46roPXu1Sk4nEU10rlOH4Sbc
```

#### 5. Supabase Service Key (Private - Keep Secret!)
```
Key:   SUPABASE_SERVICE_KEY
Value: eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImhuYnV4dmFycGd3b3FudGVob2V2Iiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc3NDcxOTI0NywiZXhwIjoyMDkwMjk1MjQ3fQ.OmLjEcXaYyy5X8vBO6H-IwRZkH9nFwvRmiKAvLmV4sY
```

#### 6. JWT Secret
```
Key:   JWT_SECRET
Value: frZxXzaMgUVorcvomQu7+SOKavDRMyFj6g8GsikTGmQ=
```

#### 7. Frontend URL (for CORS)
```
Key:   FRONTEND_URL
Value: https://your-vercel-domain.vercel.app
Note: Replace with your actual Vercel domain
```

#### 8. Admin Email
```
Key:   ADMIN_EMAIL
Value: rajeshpulluri333@gmail.com
```

#### 9. Admin Password
```
Key:   ADMIN_PASSWORD
Value: admin123
```

#### 10. Admin Name
```
Key:   ADMIN_NAME
Value: DMHO
```

---

## ✅ STEP 6: Review & Deploy

```
1. Review all settings and variables
2. Scroll down to bottom
3. Click "Create Web Service" button
4. 🎊 Deployment started!
```

### What Happens Next:
- Render builds your backend (2-5 minutes)
- Shows live deployment logs
- Backend starts automatically
- You get a URL: `https://student-health-backend.onrender.com`

---

## 🔍 STEP 7: Verify Deployment

### After Deployment (Wait 2-3 minutes):

#### Check Backend URL
1. In Render Dashboard
2. Your service: "student-health-backend"
3. Copy the URL shown (looks like `https://student-health-backend.onrender.com`)

#### Test Health Endpoint
```bash
curl https://student-health-backend.onrender.com/api/health
```

Expected response:
```json
{"status":"ok","timestamp":"2026-03-29T..."}
```

#### View Logs
1. In Render Dashboard
2. Click on "student-health-backend" service
3. Go to "Logs" tab
4. Watch real-time server logs

---

## 📋 ENVIRONMENT VARIABLES CHECKLIST

Copy this and verify ALL are set:

```
☐ NODE_ENV = production
☐ PORT = 3000
☐ SUPABASE_URL = https://hnbuxvarpgwoqntehoev.supabase.co
☐ SUPABASE_ANON_KEY = eyJhbGc...
☐ SUPABASE_SERVICE_KEY = eyJhbGc...
☐ JWT_SECRET = frZxXz...
☐ FRONTEND_URL = https://your-vercel-domain.vercel.app
☐ ADMIN_EMAIL = rajeshpulluri333@gmail.com
☐ ADMIN_PASSWORD = admin123
☐ ADMIN_NAME = DMHO
```

**Count**: Should be 10 total variables

---

## 🔗 NEXT STEP: Update Vercel Frontend

After backend is deployed:

1. Get backend URL from Render: `https://student-health-backend.onrender.com`
2. Go to Vercel project settings
3. Add environment variable:
   ```
   Key:   VITE_API_URL
   Value: https://student-health-backend.onrender.com
   ```
4. Redeploy Vercel frontend
5. Test connectivity!

---

## 📞 TROUBLESHOOTING

### Build Fails
**Error**: `npm: command not found`
- Check that Build Command is: `cd backend && npm install && npm run build`

### Service Won't Start  
**Error**: `node: command not found`
- Check that Start Command is: `node dist/index.js`

### Health Check Fails
**Error**: 502 Bad Gateway
- Wait 5 minutes for service to fully start
- Check Logs tab for errors
- Verify all environment variables set

### Connection Refused
**Error**: Cannot connect to backend
- Verify Render service is running (check status)
- Check backend logs for errors
- Make sure FRONTEND_URL is set in env vars

---

## 🎊 DEPLOYMENT SUCCESS INDICATORS

✅ Backend deployed successfully when:
1. Render shows "Live" status (green)
2. Service URL is available
3. `/api/health` endpoint returns status
4. Logs show "🚀 Server running"
5. No errors in logs

---

## 📊 YOUR DEPLOYMENT INFO

**Service Name**: student-health-backend  
**Build Command**: `cd backend && npm install && npm run build`  
**Start Command**: `node dist/index.js`  
**Environment Variables**: 10  
**Expected URL**: `https://student-health-backend.onrender.com`  

---

## 📱 QUICK REFERENCE - COMMANDS FOR TESTING

After deployment gets live:

```bash
# Test health endpoint
curl https://student-health-backend.onrender.com/api/health

# Test admin login
curl -X POST https://student-health-backend.onrender.com/api/auth/admin-login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "rajeshpulluri333@gmail.com",
    "password": "admin123"
  }'

# Test student login
curl -X POST https://student-health-backend.onrender.com/api/auth/student-login \
  -H "Content-Type: application/json" \
  -d '{
    "healthId": "DEMO123"
  }'
```

---

## 🔐 IMPORTANT SECURITY NOTES

1. **SUPABASE_SERVICE_KEY**: Private key - Keep it secret!
   - Never share with frontend
   - Only in Render environment
   - Never commit to GitHub

2. **JWT_SECRET**: Signing secret - Keep it secret!
   - Use strong random string
   - Same across deployments
   - Never share publicly

3. **Database**: Supabase is secured
   - Only backend can write to database
   - Frontend reads through API only
   - Row-level security rules apply

---

## ✨ FINAL CHECKLIST

Before clicking "Create Web Service":

- [x] Service Name: `student-health-backend`
- [x] Build Command: `cd backend && npm install && npm run build`
- [x] Start Command: `node dist/index.js`
- [x] All 10 Environment Variables added
- [x] FRONTEND_URL set to your Vercel domain
- [x] Branch: `master`
- [x] Region: Selected
- [x] Reviewed all settings

**Ready?** → Click "Create Web Service"! 🚀

---

**Status**: Ready for deployment  
**Next**: Deploy to Render using instructions above  
**Then**: Update Vercel with backend URL
