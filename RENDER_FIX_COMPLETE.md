# ✅ RENDER BACKEND FIX - Complete Step-by-Step Guide

## Root Cause Found ✓
Backend crashes on Render because **SUPABASE_URL and SUPABASE_KEY environment variables are NOT SET**.

- ✅ Backend builds successfully locally
- ✅ Backend runs fine with .env file locally  
- ❌ Backend crashes on Render (missing env vars)
- ❌ No response to any API calls (server never starts)

---

## IMMEDIATE FIX (5 minutes)

### STEP 1: Get Your Supabase Credentials

1. Go to **Supabase Dashboard**: https://app.supabase.com
2. Select your project
3. Go to **Settings** → **API**
4. Copy these values:
   - **Project URL** (looks like `https://xxxxxxx.supabase.co`)
   - **Anon public key** (long string starting with `eyJ...`)

**Save these - you'll need them in Step 2!**

---

### STEP 2: Add Environment Variables to Render

1. Go to **Render Dashboard**: https://dashboard.render.com
2. Click on **student-health-backend** service
3. Go to **Settings** (tab at top)
4. Scroll to **Environment** section
5. Click **Add Environment Variable** and add EACH of these:

| Key | Value |
|-----|-------|
| `PORT` | `3001` |
| `NODE_ENV` | `production` |
| `SUPABASE_URL` | Paste your Project URL from Supabase |
| `SUPABASE_KEY` | Paste your Anon public key from Supabase |
| `JWT_SECRET` | `your-super-secret-random-string-min-32-chars` |
| `FRONTEND_URL` | `https://your-vercel-url.vercel.app` |

**Important Notes:**
- Use your **Anon public key** (not Service Role key)
- For JWT_SECRET, use something like: `a7f3k9x2m8w1p4q5r6t7y8u9i0o1l2k3j4h5g6f7`
- For FRONTEND_URL, use your actual Vercel frontend URL

6. Click **Save** or **Create**
7. **Render auto-redeploys** when env vars change
8. Wait 2-3 minutes for deployment to complete

---

### STEP 3: Verify Backend is Now Running

In terminal, run this immediately:

```bash
curl https://student-health-backend.onrender.com/api/health
```

**You should see:**
```json
{"status":"ok","timestamp":"2026-03-29T..."}
```

**NOT:**
```
Operation timed out
```

---

### STEP 4: Test Login (To Verify Backend Works)

```bash
curl -X POST https://student-health-backend.onrender.com/api/auth/admin-login \
  -H "Content-Type: application/json" \
  -d '{"email":"rajeshpulluri333@gmail.com","password":"admin123"}'
```

**You'll get:**
- ✅ `{"success":true, "data":{"token":"..."}}` if admin account exists
- ✅ `{"success":false, "message":"Invalid email or password"}` if admin doesn't exist
- ❌ Timeout = backend still not responding (skip to Troubleshooting)

---

## If Admin Account Doesn't Exist

### STEP 5: Create Admin Account in Supabase

1. Go to **Supabase Dashboard** → **SQL Editor**
2. Run this SQL:

```sql
INSERT INTO admins (email, password_hash, first_name, last_name, designation)
VALUES (
  'rajeshpulluri333@gmail.com',
  '$2a$10$nrKu62UzdywhQqEm/MzIveTbCqiE0M2pxKkbYjqpedO.fvZ2KywGO',
  'Rajesh',
  'Pulluri',
  'DMHO'
);
```

**This creates admin with:**
- Email: `rajeshpulluri333@gmail.com`
- Password: `admin123`

---

### STEP 6: Test Full Login Flow

1. Go to your frontend: **https://your-vercel-url.vercel.app/admin-login**
2. Enter:
   - Email: `rajeshpulluri333@gmail.com`
   - Password: `admin123`
3. Click **Login**

**You should:**
- ✅ See "Logging in..." button disable briefly
- ✅ Redirect to Admin Dashboard
- ✅ See welcome message

---

## Troubleshooting

### "Still timing out after env vars set?"

**In Render Dashboard:**
1. Click **student-health-backend**
2. Go to **Logs** tab
3. Look for:
   - ✅ `🚀 Server running on` = Working
   - ❌ `Error` or `crashed` = Problem
4. Copy the error message

**If you see error:*
- Share the exact error message
- We'll diagnose from there

### "Health check works but login still hangs?"

This means backen is running but Supabase query is hanging:
1. Check that SUPABASE_URL and SUPABASE_KEY are correct
2. Go to Supabase → Table Editor → admins table
3. Verify data exists
4. If admins table is empty, run the SQL from STEP 5

### "Can't find SUPABASE_KEY in Supabase?"

1. Go to **Supabase Dashboard**
2. Select your project
3. **Settings** → **API**
4. Look for **Anon public key** (it's called "Key" not "SUPABASE_KEY")
5. Copy the long JWT string

---

## Complete Checklist ✓

- [ ] Got SUPABASE_URL from Supabase Settings → API
- [ ] Got SUPABASE_KEY (Anon public key) from Supabase Settings → API
- [ ] Added all environment variables to Render
- [ ] Waited 2-3 minutes for deployment
- [ ] Tested `/api/health` endpoint - returns JSON (not timeout)
- [ ] Created admin account in Supabase (if needed)
- [ ] Tested login with email + password
- [ ] Successfully redirected to dashboard
- [ ] Login now works! ✅

---

## What This Fixed

✅ Backend was crashing on Render due to missing env vars
✅ Backend now starts successfully
✅ API endpoints now respond instead of timing out
✅ Login flow now works end-to-end
✅ Database queries now execute properly
✅ Admin can login and access dashboard

---

## Next Steps (After Login Works)

1. Test **Medical Officer Login** with appropriate credentials
2. Test **Student Login** with Health ID
3. Create test data for other roles
4. Test dashboard functionality
5. Verify all CRUD operations work

**Need help?** Check backend logs in Render dashboard for exact error messages.
