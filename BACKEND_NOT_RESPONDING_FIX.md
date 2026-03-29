# 🚨 BACKEND CRASH DETECTED - Backend Not Responding

## The Problem

Your backend on Render is **completely unresponsive**:

```
SSL connection: ✅ SUCCESS (Render server is reachable)
API Response: ❌ TIMEOUT (0 responses after 30+ seconds)
```

Both endpoints timeout:
- ❌ `GET /api/health` → Timeout (should return instantly)
- ❌ `POST /api/auth/admin-login` → Timeout (hangs in network tab)

**Cause**: Backend process either crashed, hung, or failed to start.

---

## STEP 1: Check Render Deployment Status

1. Go to **Render Dashboard**: https://dashboard.render.com
2. Click on **student-health-backend** service
3. Look at the **Logs** section
4. What do you see?
   - ❌ Error messages?
   - ❌ "Exited with code 1"?
   - ✅ "Server running on port 3001"?

**Copy the last 20 lines of logs** and share them.

---

## STEP 2: Check if Service is Running

Click the service status in Render dashboard:

- 🟢 **Live** - Service is running (but unresponsive)
- 🔴 **Crashed** - Service crashed (needs restart)
- ⚪ **Initializing** - Service still starting up

**What status do you see?**

---

## STEP 3: Manual Restart (Quick Fix)

1. Go to Render Dashboard
2. Find **student-health-backend** service
3. Click the **3-dot menu** (top right)
4. Click **"Reboot instance"**
5. Wait 2-3 minutes for restart
6. Try the curl test again:

```bash
curl https://student-health-backend.onrender.com/api/health
```

**Should now return:**
```json
{"status":"ok","timestamp":"2026-03-29T..."}
```

---

## STEP 4: If Still Not Working - Check .env Variables

The backend might be crashing due to missing environment variables:

1. Go to Render Dashboard
2. Click **student-health-backend**
3. Go to **Settings** → **Environment**
4. Verify these exist:
   - ✅ `SUPABASE_URL` (from Supabase Settings)
   - ✅ `SUPABASE_KEY` (from Supabase Settings)
   - ✅ `JWT_SECRET` (any long random string)
   - ✅ `PORT` (should be 3001 or similar)

**If any are missing:**
1. Add them from your Supabase project
2. Render auto-redeploys on env var changes
3. Wait 2-3 minutes for restart

---

## STEP 5: Check Backend Logs for Errors

In Render dashboard logs, look for:

❌ **"Cannot find module"** - Missing dependency
❌ **"ECONNREFUSED"** - Can't connect to Supabase
❌ **"TypeError"** - Code error in backend
❌ **"Out of memory"** - Server ran out of RAM

Copy the EXACT error message and share it.

---

## STEP 6: Manual Redeploy

If restart doesn't work:

1. Go to Render Dashboard
2. Click **student-health-backend**
3. Go to **Deployments** tab
4. Find the latest deployment
5. Click the **3-dot menu**
6. Click **"Redeploy"**
7. Wait 5-10 minutes for full build and deploy

---

## STEP 7: Test Again

Once you see logs like:
```
🚀 Server running on http://0.0.0.0:3001
✅ Backend accessible at http://localhost:3001
```

Run this immediately:

```bash
curl https://student-health-backend.onrender.com/api/health
```

**Should respond with:**
```json
{"status":"ok","timestamp":"2026-03-29T..."}
```

If yes: ✅ Backend is alive! Now test login:

```bash
curl https://student-health-backend.onrender.com/api/auth/admin-login \
  -H "Content-Type: application/json" \
  -d '{"email":"rajeshpulluri333@gmail.com","password":"admin123"}'
```

---

## Troubleshooting

**"Still timing out after restart?"**
- Backend may be stuck in infinite loop
- Check backend code for: while(true), missing awaits, or database query hangs

**"Logs show connection error to Supabase?"**
- Verify `SUPABASE_URL` and `SUPABASE_KEY` are correct
- Test Supabase connection in backend/.env locally

**"Build failed during deploy?"**
- Check Node.js version matches (should be 18+)
- Verify package.json exists in backend/
- Run `npm install` locally to verify dependencies work

---

## What I Need From You

1. **Render deployment status** (Live/Crashed/Initializing)
2. **Last 20 lines of Render logs**
3. **Result of `curl /api/health` AFTER restart**
4. **Result of admin-login curl AFTER restart**

Once backend responds, **login will work immediately** ✅
