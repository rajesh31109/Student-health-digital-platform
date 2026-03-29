# ⚠️ URGENT: SET VERCEL ENVIRONMENT VARIABLE

## Your Production Deployment Needs This

**Frontend is deployed but can't reach your backend because the environment variable isn't set in Vercel.**

---

## 🚨 DO THIS NOW (Takes 2 minutes)

### Step 1: Open Vercel Dashboard
https://vercel.com/dashboard

### Step 2: Select Your Project
Click: **student-health-platform**

### Step 3: Go to Environment Variables
1. Click **Settings** (top menu)
2. Click **Environment Variables** (left sidebar)

### Step 4: Add the Variable
Click **Add New**

Fill in:
- **Name:** `VITE_API_URL`
- **Value:** `https://student-health-backend.onrender.com/api`
- **Environments:** Choose ALL three:
  - ✅ Production
  - ✅ Preview  
  - ✅ Development

### Step 5: Save
Click **Save**

### Step 6: Redeploy
1. Go to **Deployments** tab
2. Click the three dots on latest deployment
3. Click **Redeploy**

---

## What This Does

After you save and redeploy:
- ✅ Frontend connects to your Render backend
- ✅ Login will work
- ✅ Data operations work
- ✅ No more "Logging in..." stuck loading

---

## How It Works

```
User → Login Form (Vercel)
         ↓
  VITE_API_URL (environment variable)
         ↓
  https://student-health-backend.onrender.com/api
         ↓
  Backend (Render) validates credentials
         ↓
  Login Success ✅
```

---

## After You Set It

1. Wait for Vercel to redeploy (check Deployments tab)
2. Refresh your deployed frontend URL
3. Try to login with valid credentials
4. Should work immediately!

---

## Backend Credentials

Make sure your backend has:
- ✅ A valid Admin account created in Supabase
- ✅ Medical Officer accounts (if needed)
- ✅ CORS enabled (should be by default)

---

## Test It Works

After setting the variable and redeploying:

1. Open browser DevTools (F12)
2. Go to **Network** tab
3. Try to login
4. Look for a request to `https://student-health-backend.onrender.com/api/login`
5. If you see it and it has a response → **Working!** ✅

---

## Questions?

If login still doesn't work after setting this:
1. Check browser console (F12 → Console) for errors
2. Check Network tab for failed API requests
3. Verify backend is running: https://student-health-backend.onrender.com/api/health

