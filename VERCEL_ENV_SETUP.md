# 🌐 Vercel Deployment - Environment Variables Guide

**Frontend Deployment Status**: Already Deployed ✅

---

## 📦 Current Vercel Configuration

**Project**: student-health-platform
**Framework**: Vite + React
**Build Output**: dist/
**Node Version**: 18.x (recommended)

---

## 🔑 Environment Variables Setup for Vercel

### Step 1: Access Vercel Dashboard
1. Go to https://vercel.com
2. Click on your project: **student-health-platform**
3. Navigate to **Settings** → **Environment Variables**

### Step 2: Add/Update Environment Variables

Add the following variable:

| Variable Name | Value | Environment |
|---|---|---|
| `VITE_API_URL` | `http://localhost:3001` (dev) or `https://student-health-backend.onrender.com` (prod) | Production |

### Production Configuration

Once your backend is deployed on Render, update Vercel with:

```
VITE_API_URL=https://student-health-backend.onrender.com
```

### Development Configuration (Local)

Local `.env` file already has:
```
VITE_API_URL=http://localhost:3001
```

---

## 📋 Vercel Settings Summary

### Build Settings
```
Build Command: npm run build --legacy-peer-deps
Output Directory: dist
Install Command: npm install --legacy-peer-deps
Node.js Version: 18.x
```

### Framework
```
Framework Preset: Vite
Framework: React
```

### Domains
- Primary: [Your Vercel domain]
- Custom: (Configure if you have one)

---

## 🔄 Redeployment Steps

After Backend Deployment on Render:

1. **Update Vercel Env Var**
   - Go to Settings → Environment Variables
   - Update `VITE_API_URL` to backend Render URL
   - Save

2. **Redeploy Frontend**
   - Go to Deployments
   - Click "Redeploy" or push to main branch
   - Wait for build completion

3. **Verify**
   - Open your Vercel URL
   - Check browser DevTools Network tab
   - Confirm API calls going to Render backend

---

## 🔍 Debugging Connection Issues

### If API calls are failing:

1. **Check Network Tab**
   - Open DevTools → Network tab
   - Look for API requests
   - Check response status and error messages

2. **Verify Environment Variable**
   - Vercel Settings → Environment Variables
   - Confirm `VITE_API_URL` is set correctly

3. **Check CORS**
   - Backend must have correct FRONTEND_URL set
   - For Vercel: `FRONTEND_URL=https://yourdomain.vercel.app`

4. **Test Backend Endpoint**
   - Visit: `https://student-health-backend.onrender.com/api/health`
   - Should return: `{"status":"ok","timestamp":"..."}`

---

## 📝 Vercel Build & Deployment Log

Every deployment shows:
- Build logs
- Environment variables (redacted passwords)
- Deployment URL
- Build time

Access via: **Deployments** tab in Vercel

---

## ⚠️ Common Issues & Solutions

### Issue 1: "Cannot GET /api/..."
**Solution**: Backend not running or URL incorrect
- Check `VITE_API_URL` in Vercel settings
- Verify backend deployed on Render

### Issue 2: CORS Error
**Solution**: Update backend `FRONTEND_URL` environment variable
```
FRONTEND_URL=https://your-vercel-domain.vercel.app
```

### Issue 3: Build Fails
**Solution**: 
- Use `--legacy-peer-deps` flag
- Clear Vercel cache and redeploy

---

## 🚀 Quick Deployment Checklist

- [ ] Backend deployed on Render
- [ ] Backend URL noted (e.g., https://student-health-backend.onrender.com)
- [ ] Vercel `VITE_API_URL` updated to backend URL
- [ ] Vercel redeployed
- [ ] Backend health endpoint responding
- [ ] Frontend can make API calls
- [ ] Login pages working
- [ ] Dashboards displaying data

---

## 📞 Useful Commands

### Test Backend from Vercel
```bash
curl https://student-health-backend.onrender.com/api/health
```

### View Vercel Logs
```
Vercel Dashboard → Functions → Logs
```

### Check Env Variables (Local)
```bash
grep VITE_API_URL .env
```

---

## 🎯 Final Frontend URL

Once deployed:
```
https://your-vercel-domain.vercel.app
```

Example API call structure:
```
https://your-vercel-domain.vercel.app  → Frontend
     ↓ makes API calls to ↓
https://student-health-backend.onrender.com/api/auth/login
```

---

**Status**: Ready for production updates ✅
