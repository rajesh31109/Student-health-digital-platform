# ✅ Vercel Environment Variables for Frontend

## Required Environment Variables

Add these environment variables in your **Vercel Project Settings**:

### 1️⃣ Backend API URL (REQUIRED)

```
Key:   VITE_API_URL
Value: https://student-health-backend.onrender.com/api
```

> **Your Vercel Frontend**: https://studentdigitialhealthprofile.vercel.app/
> **Format**: Backend URL must end with `/api`

---

## 📋 How to Add in Vercel

### Step-by-Step:

1. **Go to Vercel Dashboard**
   - https://vercel.com/dashboard

2. **Select Your Project**
   - Click on "Student-health-digital-platform" (or your frontend project)

3. **Go to Settings**
   - Click "Settings" tab in the top menu

4. **Find Environment Variables**
   - Look for "Environment Variables" section
   - OR use search: Ctrl+F and search "Environment"

5. **Add Variable**
   - Click "Add" or "New Environment Variable"
   - **Name**: `VITE_API_URL`
   - **Value**: `https://student-health-backend.onrender.com/api`
   - Select Environment: Choose "Production" (or all)
   - Click "Save"

6. **Redeploy Frontend**
   - After adding variables, click "Deployments"
   - Find your latest deployment
   - Click the "..." (three dots) menu
   - Select "Redeploy"

---

## 🔍 What This Does

The `VITE_API_URL` environment variable tells the frontend React application where the backend API is located:

- **In Development** (localhost:8080): Uses `http://localhost:3001/api` (local backend)
- **In Production** (Vercel): Uses `https://student-health-backend.onrender.com/api` (Render backend)
- **In GitHub Codespaces**: Auto-detects Codespaces URL

---

## ✅ Verification Checklist

After adding the environment variable:

- [ ] Environment variable added to Vercel: `VITE_API_URL`
- [ ] Value set to your Render backend URL with `/api` at end
- [ ] Environment set to "Production"
- [ ] Frontend redeployed on Vercel

---

## 🧪 Testing After Deployment

Once redeployed, test with these steps:

1. **Open your Vercel frontend**
   - https://studentdigitialhealthprofile.vercel.app

2. **Try Admin Login**
   - Email: `rajeshpulluri333@gmail.com`
   - Password: `admin123`
   - Check browser console (F12) for API calls

3. **Check Network Tab**
   - Open DevTools (F12)
   - Go to "Network" tab
   - Try login and verify requests go to Render backend
   - Should see requests to: `https://student-health-backend.onrender.com/api/auth/...`

4. **Verify No Errors**
   - Console should show no CORS errors
   - Backend should respond with status 200
   - Login should work if credentials correct

---

## 🔐 Security Notes

- `VITE_API_URL` is a **public** variable (visible in frontend code)
- It's safe to expose because it only contains the API endpoint URL
- No sensitive keys go here (JWT tokens are sent in headers)
- Backend receives requests with proper authentication middleware

---

## 📝 Environment Variable Summary

**Total Variables for Vercel**: 1

```
┌─────────────────────────────────────────┐
│ VERCEL FRONTEND ENVIRONMENT VARIABLES   │
├─────────────────────────────────────────┤
│ VITE_API_URL = Render backend URL       │
└─────────────────────────────────────────┘
```

---

## 🚀 Timeline

1. ✅ Backend deployed to Render
2. ✅ Get Render backend URL (e.g., `https://student-health-backend.onrender.com`)
3. → **YOU ARE HERE**: Add to Vercel env vars
4. → Redeploy Vercel
5. → Test connectivity
6. → Done! 🎉

---

## 📞 Common Issues

### Frontend Still Calls localhost:3001
- **Issue**: `VITE_API_URL` not set or cached
- **Solution**: Clear browser cache, check Vercel settings, redeploy

### CORS Error
- **Issue**: Backend domain not matching
- **Solution**: Verify backend URL in `VITE_API_URL` is correct
- Check `FRONTEND_URL` in Render backend matches your Vercel domain

### Backend Returns 401/403
- **Issue**: Authentication failing
- **Solution**: Backend `/api/auth` endpoint is working, check credentials

---

**Status**: Ready to add to Vercel ✅  
**Date**: March 29, 2026  
**Next Step**: Add the environment variable listed above to Vercel
