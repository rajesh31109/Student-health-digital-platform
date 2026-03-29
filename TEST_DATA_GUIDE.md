# 📊 INSERT TEST DATA - Complete Guide

## 🔑 Test User Credentials

### Admin Account
```
Email: rajeshpulluri333@gmail.com
Password: admin123
Role: DMHO (District Medical Health Officer)
```

### Medical Officer Account
```
Email: doctor@example.com
Password: doctor123
Role: Medical Officer
```

### Student Account
```
Health ID: TG-01-1968-0001
Name: John Doe
Role: Student
(No password required - only Health ID)
```

---

## 🔐 Generate Password Hashes

If you need to generate bcrypt hashes for new test users:

```bash
cd backend
node generate-hashes.js
```

Output example:
```
Password "admin123":
Hash: $2a$10$abc123def456...

Password "doctor123":
Hash: $2a$10$xyz789uvw012...
```

---

## 📝 SQL Script - Insert Test Data

### Step 1: Open Supabase SQL Editor
1. Go to [Supabase Dashboard](https://app.supabase.com)
2. Select your project
3. Click "SQL Editor" in the sidebar
4. Click "New Query"

### Step 2: Copy & Run This SQL

```sql
-- =====================================================================
-- INSERT TEST DATA FOR ALL ROLES
-- =====================================================================

-- 1. INSERT ADMIN USER
INSERT INTO admins (email, password_hash, first_name, last_name, designation, phone, department)
VALUES (
  'rajeshpulluri333@gmail.com',
  '$2a$10$abc... [full hash from generate-hashes.js]',
  'Rajesh',
  'Pulluri',
  'DMHO',
  '9876543200',
  'Health Department'
) ON CONFLICT (email) DO NOTHING;

-- 2. INSERT MEDICAL OFFICER
INSERT INTO medical_officers (email, password_hash, first_name, last_name, license_number, specialization, phc_code, phc_name, phone, is_active)
VALUES (
  'doctor@example.com',
  '$2a$10$xyz... [full hash from generate-hashes.js]',
  'Dr. John',
  'Smith',
  'LIC123456',
  'General Practitioner',
  'PHC-001',
  'Primary Health Center 001',
  '9876543210',
  true
) ON CONFLICT (email) DO NOTHING;

-- 3. INSERT STUDENT
INSERT INTO students (unique_student_id, first_name, last_name, email, phone, date_of_birth, school_code, phc_code, state_code, district_code, parent_name, parent_phone, is_active)
VALUES (
  'TG-01-1968-0001',
  'John',
  'Doe',
  'john.doe@example.com',
  '9876543211',
  '2010-05-15',
  '1968',
  'PHC-001',
  'TG',
  '01',
  'Jane Doe',
  '9876543212',
  true
) ON CONFLICT (unique_student_id) DO NOTHING;

-- 4. INSERT SAMPLE HEALTH RECORD (requires medical_officer id and student id)
-- First get the IDs:
-- SELECT id FROM medical_officers WHERE email = 'doctor@example.com';
-- SELECT id FROM students WHERE unique_student_id = 'TG-01-1968-0001';

-- Then insert health record:
INSERT INTO health_records (student_id, medical_officer_id, consultation_type, consultation_date, symptoms, diagnosis, prescription, notes)
VALUES (
  (SELECT id FROM students WHERE unique_student_id = 'TG-01-1968-0001'),
  (SELECT id FROM medical_officers WHERE email = 'doctor@example.com'),
  'Routine Checkup',
  NOW(),
  'No symptoms',
  'Healthy',
  'None',
  'Regular health checkup completed'
) ON CONFLICT DO NOTHING;
```

### Step 3: Execute Query
Click the "Run" button or press `Ctrl+Enter`

---

## ✅ Verify Test Data

### Check Admin User
```sql
SELECT email, first_name, last_name, designation FROM admins WHERE email = 'rajeshpulluri333@gmail.com';
```

### Check Medical Officer
```sql
SELECT email, first_name, last_name, specialization FROM medical_officers WHERE email = 'doctor@example.com';
```

### Check Student
```sql
SELECT unique_student_id, first_name, last_name FROM students WHERE unique_student_id = 'TG-01-1968-0001';
```

### Check Health Records
```sql
SELECT COUNT(*) as health_records FROM health_records WHERE student_id = (SELECT id FROM students WHERE unique_student_id = 'TG-01-1968-0001');
```

---

## 🧪 Test Login Flow

### Test 1: Student Login
```bash
curl -X POST http://localhost:3001/api/auth/student-login \
  -H "Content-Type: application/json" \
  -d '{
    "healthId": "TG-01-1968-0001"
  }'
```

**Expected Response** (Success):
```json
{
  "success": true,
  "message": "Login successful",
  "data": {
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
    "healthId": "TG-01-1968-0001",
    "name": "John Doe"
  }
}
```

**Expected Response** (Failure):
```json
{
  "success": false,
  "message": "Invalid Student ID. Please check your Health ID."
}
```

### Test 2: Medical Officer Login
```bash
curl -X POST http://localhost:3001/api/auth/mo-login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "doctor@example.com",
    "password": "doctor123"
  }'
```

**Expected Response** (Success):
```json
{
  "success": true,
  "message": "Login successful",
  "data": {
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
    "moId": "uuid-of-mo",
    "name": "Dr. John Smith",
    "email": "doctor@example.com"
  }
}
```

### Test 3: Admin Login
```bash
curl -X POST http://localhost:3001/api/auth/admin-login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "rajeshpulluri333@gmail.com",
    "password": "admin123"
  }'
```

**Expected Response** (Success):
```json
{
  "success": true,
  "message": "Login successful",
  "data": {
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
    "adminId": "uuid-of-admin",
    "name": "Rajesh Pulluri",
    "email": "rajeshpulluri333@gmail.com"
  }
}
```

---

## 🐛 Troubleshooting

### "JSON parse error" or SQL syntax error
**Solution**: 
- Copy-paste entire SQL statement carefully
- Check for special characters
- Ensure quotes are correct

### "Duplicate key value violates unique constraint"
**Solution**:
- User already exists in database
- Either delete existing user first:
  ```sql
  DELETE FROM admins WHERE email = 'rajeshpulluri333@gmail.com';
  DELETE FROM medical_officers WHERE email = 'doctor@example.com';
  DELETE FROM students WHERE unique_student_id = 'TG-01-1968-0001';
  ```
- Then insert test data again

### Login returns "Invalid credentials"
**Possible causes**:
1. User not in database - verify with SELECT queries
2. Password hash is incorrect - regenerate with `generate-hashes.js`
3. email doesn't match exactly (case-sensitive in some systems)
4. User is marked as inactive (is_active = false)

**Solution**:
```sql
-- Check if user is active
SELECT email, is_active FROM medical_officers WHERE email = 'doctor@example.com';

-- Update if inactive
UPDATE medical_officers SET is_active = true WHERE email = 'doctor@example.com';
```

---

## 📋 Creating Additional Test Users

### Create New Admin
```sql
INSERT INTO admins (email, password_hash, first_name, last_name, designation)
VALUES (
  'newadmin@example.com',
  '[bcrypt hash here]',
  'Admin',
  'Name',
  'Officer'
) ON CONFLICT (email) DO NOTHING;
```

### Create New Medical Officer
```sql
INSERT INTO medical_officers (email, password_hash, first_name, last_name, phc_code, is_active)
VALUES (
  'newdoctor@example.com',
  '[bcrypt hash here]',
  'Dr.',
  'Name',
  'PHC-002',
  true
) ON CONFLICT (email) DO NOTHING;
```

### Create New Student
```sql
INSERT INTO students (unique_student_id, first_name, last_name, state_code, district_code, school_code, is_active)
VALUES (
  'TG-01-1968-0002',
  'Jane',
  'Smith',
  'TG',
  '01',
  '1968',
  true
) ON CONFLICT (unique_student_id) DO NOTHING;
```

---

## 🔄 Frontend Testing

After inserting test data, test on frontend:

1. **Go to login page**:
   - http://studentdigitialhealthprofile.vercel.app/

2. **Test Student Login**:
   - Click "Student Login"
   - Enter Health ID: `TG-01-1968-0001`
   - Click "View My Health Records"
   - Should redirect to student dashboard

3. **Test Medical Officer Login**:
   - Click "Medical Officer Login"
   - Click "Email+Password" tab
   - Email: `doctor@example.com`
   - Password: `doctor123`
   - Click login
   - Should redirect to MO dashboard

4. **Test Admin Login**:
   - Click "Admin Login"
   - Email: `rajeshpulluri333@gmail.com`
   - Password: `admin123`
   - Click login
   - Should redirect to admin dashboard

---

## ✨ Verification Checklist

- [ ] Admin can login with email + password
- [ ] Medical Officer can login with email + password
- [ ] Student can login with Health ID only
- [ ] JWT token is generated and stored in localStorage
- [ ] Dashboard loads after successful login
- [ ] API calls from dashboard work correctly
- [ ] User is logged out when clicking logout
- [ ] Invalid credentials show error message

---

**Status**: ✅ Test Data Guide Complete
**Date**: March 29, 2026
