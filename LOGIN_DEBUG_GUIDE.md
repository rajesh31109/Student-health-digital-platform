# 🔍 LOGIN DEBUG GUIDE - Find The Exact Issue

## The Login Flow

```
1. User enters email + password on Admin Login page
   ↓
2. Frontend calls: POST /api/auth/admin-login
   ↓
3. Backend queries `admins` table in Supabase
   ↓
4. Backend checks if email exists AND password matches
   ↓
5. If both match → returns token ✅
   If not → returns "Invalid email or password" ❌
```

---

## Why Login Might Fail

### ❌ Scenario 1: Admin Account Doesn't Exist
Email `rajeshpulluri333@gmail.com` is NOT in the `admins` table

### ❌ Scenario 2: Password Hash is NULL
Admin exists but `password_hash` column is empty/NULL

### ❌ Scenario 3: Wrong Password
Admin exists but password doesn't match the hash

### ❌ Scenario 4: Backend Not Responding
API call fails completely (CORS, timeout, etc)

---

## STEP 1: Check If Admin Exists in Supabase

1. Go to **Supabase Dashboard**
2. Select your project
3. Go to **SQL Editor**
4. Run this query:

```sql
SELECT id, email, first_name, last_name, password_hash 
FROM admins 
WHERE email = 'rajeshpulluri333@gmail.com';
```

**What should you see?**

✅ **Good:** One row with:
- `id`: A UUID
- `email`: rajeshpulluri333@gmail.com
- `first_name`: Rajesh
- `last_name`: Pulluri  
- `password_hash`: A long string starting with `$2a$` or `$2b$`

❌ **Bad - No results needed, OR:**
- `password_hash` is NULL or empty

---

## STEP 2: If Admin Doesn't Exist - Create One

Run this SQL to CREATE an admin account:

```sql
INSERT INTO admins (email, password_hash, first_name, last_name, designation)
VALUES (
  'rajeshpulluri333@gmail.com',
  '$2a$10$nrKu62UzdywhQqEm/MzIveTbCqiE0M2pxKkbYjqpedO.fvZ2KywGO',  -- password: "admin123"
  'Rajesh',
  'Pulluri',
  'DMHO'
);
```

This creates account with:
- Email: `rajeshpulluri333@gmail.com`
- Password: `admin123`

---

## STEP 3: Test API Directly

Open a new terminal:

```bash
curl -X POST https://student-health-backend.onrender.com/api/auth/admin-login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "rajeshpulluri333@gmail.com",
    "password": "admin123"
  }'
```

**Expected response (success):**
```json
{
  "success": true,
  "message": "Login successful",
  "data": {
    "token": "eyJ0eXAiOiJKV1QiL...",
    "adminId": "some-uuid",
    "name": "Rajesh Pulluri",
    "email": "rajeshpulluri333@gmail.com"
  }
}
```

**Expected response (failure):**
```json
{
  "success": false,
  "message": "Invalid email or password."
}
```

---

## STEP 4: Check Browser Console

1. Press **F12** → **Console** tab
2. Try to login on your deployed website
3. Look for any red error messages

**Copy the EXACT error text if you see any.**

---

## STEP 5: Check Network Request

1. Press **F12** → **Network** tab
2. **Clear** requests
3. Try to login
4. Look for request to `admin-login`
5. Click on it
6. Check **Response** tab

**What do you see in Response?**
- `"Invalid email or password."` → Credentials wrong
- `"Login successful"` + `token` → Should redirect to dashboard
- Some other error → Copy it exactly

---

## What I Need You to Do

Answer these questions:

1. **Does admin account exist in Supabase?**
   - Run the SQL query above and tell me what you see

2. **What error message appears when you try to login?**
   - Check console (F12) for exact error text

3. **What's in the Network response?**
   - Check Network tab and copy the response body exactly

4. **Does this curl command work?**
   ```bash
   curl https://student-health-backend.onrender.com/api/health
   ```
   (Should return something, not connection error)

---

Once you provide this information, I can **immediately fix the exact issue!**

---

## Quick Checklist

- [ ] Admin account exists in Supabase admins table
- [ ] password_hash is NOT NULL
- [ ] Backend URL is correct in environment variable
- [ ] No JavaScript errors in browser console
- [ ] Network request is being made to backend
- [ ] Backend returns success or clear error message
