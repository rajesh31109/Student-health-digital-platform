# Database & Backend Verification Checklist

## ✅ Database Setup Verification

### Tables Created (9 total)
- [x] admins
- [x] medical_officers
- [x] students
- [x] health_records
- [x] audit_logs
- [x] notifications
- [x] student_visits
- [x] reports
- [x] session_tokens

### Indexes Created (18 total)
- [x] All performance indexes created
- [x] Foreign key relationships established
- [x] Constraints applied

### Views Created (3 total)
- [x] student_health_summary
- [x] phc_student_statistics
- [x] medical_officer_workload

### RLS Policies Enabled
- [x] Row-level security policies configured for student privacy
- [x] Admin access policies
- [x] Medical officer scope limitation

---

## 🔧 Backend Configuration Steps

### Step 1: Install Dependencies
```bash
cd backend
npm install
```

**Expected Output:** `added X packages` (no errors)

### Step 2: Create .env File
```bash
cp .env.example .env
```

Edit `.env` with:
```
SUPABASE_URL=https://your-project.supabase.co
SUPABASE_ANON_KEY=your_anon_key_here
SUPABASE_SERVICE_KEY=your_service_key_here
JWT_SECRET=your_random_32_char_secret_here
FRONTEND_URL=http://localhost:5173
NODE_ENV=development
PORT=3001
```

### Step 3: Start Backend Server
```bash
npm run dev
```

**Expected Output:**
```
🚀 Server running on http://localhost:3001
📦 Frontend URL: http://localhost:5173
```

---

## ✅ API Endpoint Testing

### Health Check (No Auth Required)
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

## 👤 Create Initial Test Users

### Method 1: Supabase SQL Editor (Recommended for Testing)

**Create Admin User:**
```sql
-- First, generate a password hash using bcrypt
-- You can use an online bcrypt tool or run in backend:
-- const hash = await hashPassword('admin123');
-- Then paste the hash below

INSERT INTO admins (email, password_hash, first_name, last_name, designation)
VALUES (
  'rajeshpulluri333@gmail.com',
  '$2b$10$YOUR_BCRYPT_HASH_HERE',  -- Replace with actual hash
  'Rajesh',
  'Pulluri',
  'DMHO'
);
```

**Create Test Medical Officer:**
```sql
INSERT INTO medical_officers (email, password_hash, first_name, last_name, phc_code, phc_name)
VALUES (
  'doctor@example.com',
  '$2b$10$YOUR_BCRYPT_HASH_HERE',  -- Replace with actual hash
  'Dr.',
  'Smith',
  'PHC-001',
  'Primary Health Center 001'
);
```

**Create Test Student with Unique ID:**
```sql
INSERT INTO students (unique_student_id, first_name, last_name, date_of_birth, school_code, phc_code)
VALUES (
  'TG-01-1968-0001',
  'John',
  'Doe',
  '2010-05-15',
  '1968',
  'PHC-001'
);
```

### Method 2: Using Backend Registration Endpoint (Once running)
```bash
curl -X POST http://localhost:3001/api/auth/mo-login \
  -H "Content-Type: application/json" \
  -d '{"email":"doctor@example.com","password":"123456"}'
```

---

## 🧪 Test All 3 Login Flows

### 1. Student Login (No Password)
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

### 2. Medical Officer Login
```bash
curl -X POST http://localhost:3001/api/auth/mo-login \
  -H "Content-Type: application/json" \
  -d '{"email":"doctor@example.com","password":"123456"}'
```

**Expected Response:**
```json
{
  "success": true,
  "message": "Login successful",
  "data": {
    "token": "eyJhbGciOiJIUzI1NiIs...",
    "moId": "??-??-??",
    "name": "Dr. Smith",
    "email": "doctor@example.com"
  }
}
```

### 3. Admin Login
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
    "adminId": "??-??-??",
    "name": "DMHO",
    "email": "rajeshpulluri333@gmail.com"
  }
}
```

---

## 🛡️ Test Protected Routes

Use token from login response:

```bash
curl -X GET http://localhost:3001/api/auth/profile \
  -H "Authorization: Bearer YOUR_TOKEN_HERE"
```

**Expected Response:**
```json
{
  "success": true,
  "data": {
    "id": "??-??-??",
    "email": "...",
    "name": "...",
    ...
  }
}
```

---

## 📊 Test Dashboard Endpoints

### Student Dashboard
```bash
curl -X GET http://localhost:3001/api/student/health-records \
  -H "Authorization: Bearer STUDENT_TOKEN"
```

### Medical Officer Dashboard
```bash
curl -X GET http://localhost:3001/api/mo/students \
  -H "Authorization: Bearer MO_TOKEN"
```

### Admin Dashboard
```bash
curl -X GET http://localhost:3001/api/admin/dashboard/statistics \
  -H "Authorization: Bearer ADMIN_TOKEN"
```

---

## ⚡ Common Issues & Solutions

### Issue: "SUPABASE_URL is not configured"
**Solution:** Make sure .env file exists and has correct values

### Issue: "Connection refused"
**Solution:** 
- Make sure backend is running: `npm run dev`
- Check PORT is 3001
- Firewall might be blocking - try opening on different port

### Issue: "Table does not exist"
**Solution:**
- Verify SQL script was run in Supabase
- Check database is selected in Supabase
- Try refreshing browser/dashboard

### Issue: "Invalid email or password" on valid credentials
**Solution:**
- Ensure password is hashed with bcrypt in database
- Check user exists in correct table
- Verify email is lowercase in .env

---

## 📞 Documentation References

- **Complete API Reference:** See `API_DOCUMENTATION.md`
- **Setup Instructions:** See `SETUP.md`
- **Database Schema:** See `src/database/supabase-schema-v2.sql`

---

## ✅ Sign-Off Checklist

Before moving to frontend integration, verify:

- [x] Database tables created in Supabase
- [ ] Environment variables configured (.env file)
- [ ] Backend dependencies installed (`npm install`)
- [ ] Backend server starts without errors (`npm run dev`)
- [ ] Health check endpoint responds
- [ ] At least one test user created (admin/MO/student)
- [ ] Student login works
- [ ] MO login works
- [ ] Admin login works
- [ ] Protected routes require valid token
- [ ] Dashboard endpoints return data

---

**Next:** Once backend is running and verified, integrate frontend → update login pages and dashboard components to call these endpoints.
