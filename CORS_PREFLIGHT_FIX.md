# 🔴 CORS Preflight Error - Backend Server Not Responding

## The Error You're Seeing

```
CORS policy: Response to preflight request doesn't pass access control check
No 'Access-Control-Allow-Origin' header is present on the requested resource
Failed to load resource: net::ERR_FAILED
TypeError: Failed to fetch
```

## What This Means

Your frontend (Vercel) is trying to call your backend (Render), but:

1. ❌ Browser sends **OPTIONS preflight request** to check permissions
2. ❌ Backend doesn't respond or times out
3. ❌ Browser therefore shows CORS error
4. ❌ Login fails with "Failed to fetch"

**Root Cause**: Backend server on Render is **crashed, hung, or not running**.

---

## Quick Fix - Restart Backend on Render

### STEP 1: Go to Render Dashboard
https://dashboard.render.com

### STEP 2: Find Your Backend Service
Look for: **student-health-backend**

### STEP 3: Check Status
- 🟢 **Live** = Running (but likely hung/timeout issue)
- 🔴 **Crashed** = Process crashed, needs restart
- ⚪ **Initializing** = Still starting up

### STEP 4: Restart (IF Status is Live)
1. Click the service
2. Click **3-dot menu** (top right)
3. Click **"Reboot instance"**
4. ⏳ Wait 2-3 minutes for it to restart

### STEP 5: Check Service Status (IF Status is Crashed)
1. Click the service
2. Go to **Logs** tab
3. Look for error messages like:
   - `"Cannot find module"`
   - `"ECONNREFUSED"` (can't connect to Supabase)
   - `"Error at startup"`
4. Copy these errors

### STEP 6: Force Redeploy (IF restart doesn't work)
1. Go to **Deployments** tab
2. Find latest deployment
3. Click **3-dot menu**
4. Click **"Redeploy"**
5. Wait 10 minutes for full rebuild

---

## STEP 7: Verify Fixed With Curl

After restart, test the health endpoint:

```bash
curl https://student-health-backend.onrender.com/api/health
```

**Should respond with:**
```json
{"status":"ok","timestamp":"2026-03-29T..."}
```

**NOT a timeout or "CORS" error**

---

## STEP 8: Test Login

Once health endpoint responds, try login:

```bash
curl -X POST https://student-health-backend.onrender.com/api/auth/admin-login \
  -H "Content-Type: application/json" \
  -d '{"email":"rajeshpulluri333@gmail.com","password":"admin123"}'
```

**Should respond with:**
```json
{
  "success": true,
  "message": "Login successful",
  "data": {
    "token": "...",
    "adminId": "...",
    "name": "..."
  }
}
```

OR (if admin doesn't exist):
```json
{"success": false, "message": "Invalid email or password."}
```

**NOT a timeout or network error**

---

## What I Need From You

1. **Is backend service Live or Crashed?** (screenshot of Render dashboard)
2. **Did you restart it?** (Yes/No)
3. **Test curl `/api/health` - what response?**
4. **Test curl login - what response?**

---

## Why This Happens

- Render **free tier goes to sleep** after 15 min inactivity → restart needed
- Backend **runs out of memory** during startup
- Backend crashes on **Supabase connection** (bad env vars)
- Backend **stuck in infinite loop** or deadlock

Once the backend restarts and responds to requests, the CORS error will disappear and **login will work immediately**. ✅

---

## Environment Variables Checklist

If restart doesn't help, verify Render env vars are set:

1. Go to **student-health-backend** service
2. Go to **Settings** → **Environment**
3. Verify these exist:
   - ✅ `SUPABASE_URL`
   - ✅ `SUPABASE_KEY`  
   - ✅ `JWT_SECRET`
   - ✅ `PORT` (usually 3001 or similar)
   - ✅ `NODE_ENV` (production)

If any are missing, add them and Render will auto-redeploy.

---

## Common Error Messages in Render Logs

| Error | Fix |
|-------|-----|
| `Cannot find module 'express'` | Run `npm install` locally, `package-lock.json` conflict |
| `ECONNREFUSED` | SUPABASE_URL or SUPABASE_KEY is wrong |
| `TypeError: Cannot read property 'listen' of undefined` | App initialization error, check index.ts |
| `Out of memory` | Backend needs more RAM (upgrade Render plan) |
| `Port 3001 is already in use` | Port conflict, increase RAM or check config |

Share the exact error from logs and I'll fix it!
