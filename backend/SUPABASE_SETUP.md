# 🚀 Backend Configuration Guide - Your Supabase Project

## Your Supabase Project Details
- **Project URL:** https://hnbuxvarpgwoqntehoev.supabase.co
- **Status:** ✅ Ready to configure

---

## Step 1️⃣: Get Your Supabase API Keys

1. Go to [Supabase Dashboard](https://app.supabase.com)
2. Select your project: **hnbuxvarpgwoqntehoev**
3. Navigate to **Settings > API**
4. You'll see:
   - **Project URL** (already provided: `https://hnbuxvarpgwoqntehoev.supabase.co`)
   - **Anon public key** - Copy this
   - **Service role key** - Copy this (keep this secret!)

---

## Step 2️⃣: Create `.env` File

In your backend directory, create a `.env` file with your Supabase credentials:

```bash
# Student Health Digital Platform - Backend Environment
NODE_ENV=development
PORT=3001

# Supabase Configuration
SUPABASE_URL=https://hnbuxvarpgwoqntehoev.supabase.co
SUPABASE_ANON_KEY=your_anon_key_here
SUPABASE_SERVICE_KEY=your_service_role_key_here

# JWT Configuration (generate random 32+ character string)
JWT_SECRET=your_random_jwt_secret_here_min_32_chars

# Frontend Configuration
FRONTEND_URL=http://localhost:5173

# Admin Credentials
ADMIN_EMAIL=rajeshpulluri333@gmail.com
ADMIN_PASSWORD=admin123
ADMIN_NAME=DMHO

# School Configuration
DEFAULT_STATE_CODE=TG
DEFAULT_DISTRICT_CODE=01
DEFAULT_SCHOOL_CODE=1968
```

### Generate JWT_SECRET
Run this command to generate a strong secret:
```bash
openssl rand -base64 32
```

Copy the output and paste into `JWT_SECRET` in your `.env` file.

---

## Step 3️⃣: Install Backend Dependencies

```bash
cd backend
npm install
```

---

## Step 4️⃣: Verify Connection

Start the backend server:
```bash
npm run dev
```

You should see:
```
🚀 Server running on http://localhost:3001
📦 Frontend URL: http://localhost:5173
```

### Test Connection with Health Check
```bash
curl http://localhost:3001/api/health
```

**Expected Response:**
```json
{
  "status": "ok",
  "timestamp": "2024-01-20T10:30:45.123Z"
}
```

---

## Step 5️⃣: Create Test Users in Supabase

### Option A: Using Supabase SQL Editor (Recommended)

1. Go to **Supabase Dashboard > SQL Editor**
2. Click **New Query**
3. Paste the following SQL:

```sql
-- Generate bcrypt hashes for passwords
-- For testing: 'admin123' = $2b$10$5ZuaKvLpvFt2Vk9y7xB8dOj.VQ1LQ7H1Q7Y1Q7Z1Q7Z1Q7Z1Q7
-- For testing: 'doctor123' = $2b$10$7xB8dOj.VQ1LQ7H1Q7Y1Q7Z1Q7Z1Q7Z1Q7Z1Q7Z1Q7Z1Q7Z1Q7Y

-- Create Admin User
INSERT INTO admins (email, password_hash, first_name, last_name, designation)
VALUES (
  'rajeshpulluri333@gmail.com',
  '$2b$10$5ZuaKvLpvFt2Vk9y7xB8dOj.VQ1LQ7H1Q7Y1Q7Z1Q7Z1Q7Z1Q7Z1Q7',
  'Rajesh',
  'Pulluri',
  'DMHO'
);

-- Create Test Medical Officer
INSERT INTO medical_officers (email, password_hash, first_name, last_name, phc_code, phc_name, is_active)
VALUES (
  'doctor@example.com',
  '$2b$10$7xB8dOj.VQ1LQ7H1Q7Y1Q7Z1Q7Z1Q7Z1Q7Z1Q7Z1Q7Z1Q7Z1Q7Y',
  'Dr.',
  'Smith',
  'PHC-001',
  'Primary Health Center 001',
  true
);

-- Create Test Student with Unique Health ID
INSERT INTO students (unique_student_id, first_name, last_name, date_of_birth, school_code, phc_code, state_code, district_code, is_active)
VALUES (
  'TG-01-1968-0001',
  'John',
  'Doe',
  '2010-05-15',
  '1968',
  'PHC-001',
  'TG',
  '01',
  true
);

-- Verify data was inserted
SELECT COUNT(*) as admin_count FROM admins;
SELECT COUNT(*) as doctor_count FROM medical_officers;
SELECT COUNT(*) as student_count FROM students;
```

4. Click **Run**
5. Should see output: `admin_count: 1`, `doctor_count: 1`, `student_count: 1`

---

## Step 6️⃣: Test All 3 Login Flows

### 1️⃣ Student Login (No Password - Health ID Only)
```bash
curl -X POST http://localhost:3001/api/auth/student-login \
  -H "Content-Type: application/json" \
  -d '{"healthId":"TG-01-1968-0001"}'
```

**Expected Response:**
```json
{
  "success": true,
  "message": "Login successful",
  "data": {
    "token": "eyJhbGciOiJIUzI1NiIs...",
    "healthId": "TG-01-1968-0001",
    "name": "John Doe"
  }
}
```

---

### 2️⃣ Medical Officer Login
```bash
curl -X POST http://localhost:3001/api/auth/mo-login \
  -H "Content-Type: application/json" \
  -d '{"email":"doctor@example.com","password":"doctor123"}'
```

**Expected Response:**
```json
{
  "success": true,
  "message": "Login successful",
  "data": {
    "token": "eyJhbGciOiJIUzI1NiIs...",
    "moId": "uuid-here",
    "name": "Dr. Smith",
    "email": "doctor@example.com"
  }
}
```

---

### 3️⃣ Admin Login
```bash
curl -X POST http://localhost:3001/api/auth/admin-login \
  -H "Content-Type: application/json" \
  -d '{"email":"rajeshpulluri333@gmail.com","password":"admin123"}'
```

**Expected Response:**
```json
{
  "success": true,
  "message": "Login successful",
  "data": {
    "token": "eyJhbGciOiJIUzI1NiIs...",
    "adminId": "uuid-here",
    "name": "DMHO",
    "email": "rajeshpulluri333@gmail.com"
  }
}
```

---

## Step 7️⃣: Save Your Token & Test Protected Routes

Use the token from any login above:

```bash
# Save token from login response
TOKEN="eyJhbGciOiJIUzI1NiIs..."

# Get user profile
curl -X GET http://localhost:3001/api/auth/profile \
  -H "Authorization: Bearer $TOKEN"
```

**Expected Response:**
```json
{
  "success": true,
  "data": {
    "id": "uuid",
    "email": "...",
    "first_name": "...",
    "last_name": "...",
    ...
  }
}
```

---

## Step 8️⃣: Test Dashboard Endpoints

### Student Dashboard
```bash
# Using student token from login
curl -X GET http://localhost:3001/api/student/health-records \
  -H "Authorization: Bearer STUDENT_TOKEN"
```

### Medical Officer Dashboard
```bash
# Using MO token from login
curl -X GET http://localhost:3001/api/mo/students \
  -H "Authorization: Bearer MO_TOKEN"
```

### Admin Dashboard
```bash
# Using admin token from login
curl -X GET http://localhost:3001/api/admin/dashboard/statistics \
  -H "Authorization: Bearer ADMIN_TOKEN"
```

---

## ✅ Verification Checklist

After completing setup, verify:

- [ ] `.env` file created with Supabase credentials
- [ ] `npm install` completed successfully
- [ ] `npm run dev` starts without errors
- [ ] Health check endpoint responds: `/api/health`
- [ ] Test users created in Supabase (Admin, MO, Student)
- [ ] Student login works with Health ID
- [ ] Medical Officer login works with email + password
- [ ] Admin login works with email + password
- [ ] Protected routes require valid JWT token
- [ ] Dashboard endpoints return data

---

## 🔧 Environment Variables Summary

| Variable | Value | Required |
|----------|-------|----------|
| `SUPABASE_URL` | `https://hnbuxvarpgwoqntehoev.supabase.co` | ✅ Yes |
| `SUPABASE_ANON_KEY` | Copy from Supabase Settings > API | ✅ Yes |
| `SUPABASE_SERVICE_KEY` | Copy from Supabase Settings > API | ✅ Yes |
| `JWT_SECRET` | Generate with `openssl rand -base64 32` | ✅ Yes |
| `FRONTEND_URL` | `http://localhost:5173` | ✅ Yes |
| `NODE_ENV` | `development` | ✅ Yes |
| `PORT` | `3001` | ✅ Yes |

---

## 📞 Troubleshooting

### ❌ "SUPABASE_URL is not configured"
- Make sure `.env` file exists in `/backend` directory
- Check URL is exactly: `https://hnbuxvarpgwoqntehoev.supabase.co`

### ❌ "Connection refused"
- Backend might not be running - run `npm run dev`
- Check PORT 3001 is available
- Try a different port by changing `PORT=3002` in `.env`

### ❌ "Table does not exist"
- Schema SQL might not have been executed
- Verify in Supabase: SQL Editor > Check for tables

### ❌ "Invalid credentials"
- Check email case (should be lowercase)
- Verify password hash in database
- Try with test credentials first

### ❌ "CORS error"
- Make sure `FRONTEND_URL` matches your frontend address
- Check if running on correct port

---

## 📚 Additional Resources

- **Complete API Docs:** See `API_DOCUMENTATION.md` in backend folder
- **Setup Guide:** See `SETUP.md`
- **Database Schema:** See `supabase-schema-v2.sql`

---

**Next Step:** Once backend is verified and running, update your frontend login pages to use these APIs!

🎯 **Target URL:** `http://localhost:3001/api`
