# Testing Instructions - Complete System

## Current Status

✅ **Backend:** Running on `http://localhost:3001/api`
✅ **Frontend:** Running on `http://localhost:8080`
✅ **Database:** Supabase PostgreSQL connected
✅ **All Components Updated:** Login pages and dashboards now call real APIs

---

## Step 1: Insert Test Data into Supabase

### Access Supabase SQL Editor

1. Go to: [Supabase Dashboard](https://app.supabase.com)
2. Project URL: `https://hnbuxvarpgwoqntehoev.supabase.co`
3. Click **SQL Editor** in the left sidebar
4. Create a new query

### Copy & Paste SQL Script

Copy the entire content of `/backend/INSERT_TEST_DATA.sql` and paste it into the Supabase SQL Editor.

**Quick Steps:**
```bash
# Read the SQL file locally
cat /workspaces/Student-health-digital-platform/backend/INSERT_TEST_DATA.sql
```

Then:
- Click **"Run"** in Supabase to execute the script
- You should see **"Success"** messages for each insert statement

### Expected Results

After running the script, you should have created:

✅ **Admin User**
```
Email: rajeshpulluri333@gmail.com
Password: admin123
```

✅ **Medical Officer**
```
Email: doctor@example.com
Password: doctor123
```

✅ **Student**
```
Health ID: TG-01-1968-0001
(No password required - Health ID login only)
```

---

## Step 2: Test Student Login

1. Navigate to: `http://localhost:8080/login/student`
2. Enter Health ID: `TG-01-1968-0001`
3. Click **Login**

### Expected Behavior

✅ Login succeeds
✅ Token stored in localStorage
✅ Redirected to Student Dashboard (`/student-dashboard`)
✅ Dashboard displays student information
✅ Health records are fetched from backend
✅ "Latest Health Vitals" card shows vitals from database

### If Login Fails

Check browser console (F12) for errors:
- Network tab: Verify request to `http://localhost:3001/api/auth/student-login`
- Console: Look for error messages

---

## Step 3: Test Medical Officer Login

1. Navigate to: `http://localhost:8080/login/medical-officer`
2. Enter credentials:
   - **Email:** `doctor@example.com`
   - **Password:** `doctor123`
3. Click **Login**

### Expected Behavior

✅ Login succeeds
✅ Token + user data stored in localStorage
✅ Redirected to Medical Officer Dashboard (`/mo-dashboard`)
✅ Dashboard stats card shows "Students Registered: X"
✅ Registration form is ready to accept new student data
✅ Health Entry tab accessible

### Test Medical Officer Features

**Register New Student:**
1. Click **Register Student** tab
2. Fill in form with sample data
3. Click Submit
4. Verify success message with new Health ID

**Record Health Data:**
1. Click **Health Entry** tab
2. Select a student health ID
3. Enter vitals (blood pressure, heart rate, etc.)
4. Click Submit
5. Verify data saved

---

## Step 4: Test Admin Login

1. Navigate to: `http://localhost:8080/login/admin`
2. Enter credentials:
   - **Email:** `rajeshpulluri333@gmail.com`
   - **Password:** `admin123`
3. Click **Login**

### Expected Behavior

✅ Login succeeds
✅ Token + admin data stored in localStorage
✅ Redirected to Admin Dashboard (`/admin-dashboard`)
✅ Dashboard shows statistics cards (Total Students, Schools Covered, etc.)
✅ Health alerts section visible
✅ Top schools ranking displayed

---

## Step 5: Verify Role-Based Access Control

### Student Dashboard Test

```bash
# Student can only see their own data
# Student should NOT see other students' health records
# If accessing /student-dashboard without token -> redirected to /login/student
```

### Medical Officer Dashboard Test

```bash
# MO can see all students in their PHC
# MO can register new students
# MO can record health data for students
# MO statistics update based on their records only
```

### Admin Dashboard Test

```bash
# Admin sees ALL district/mandal/school data
# Admin has unrestricted view across entire system
# Admin sees health alerts across all schools
```

---

## Step 6: Check Network Requests (Developer Tools)

### Using Browser DevTools (F12)

**Network Tab:**

1. Open DevTools → Network tab
2. Perform a login action
3. Look for `POST /api/auth/student-login` request
4. Check response: Should have `"success": true` and `"data"` containing token

**Sample Successful Response:**
```json
{
  "success": true,
  "data": {
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
    "healthId": "TG-01-1968-0001",
    "name": "John Doe"
  }
}
```

**Network Requests to Monitor:**
- `POST /api/auth/student-login` - Student login
- `POST /api/auth/medical-officer-login` - MO login  
- `POST /api/auth/admin-login` - Admin login
- `GET /api/student/health-records` - Fetch student data
- `GET /api/mo/statistics` - MO dashboard stats
- `GET /api/admin/dashboard/statistics` - Admin dashboard stats

---

## Step 7: Using Test API Script

A comprehensive test script is available at `/backend/test-api.sh`

### Run All Tests

```bash
cd /workspaces/Student-health-digital-platform/backend
chmod +x test-api.sh
./test-api.sh
```

### This will test:

✅ Health check endpoint
✅ Student login
✅ Medical Officer login
✅ Admin login
✅ Student dashboard endpoints
✅ Medical Officer endpoints
✅ Admin endpoints
✅ Token expiration

---

## Troubleshooting

### ❌ "Invalid credentials" on login

**Solution:**
1. Verify test data was inserted successfully in Supabase:
   ```sql
   SELECT * FROM admins;
   SELECT * FROM medical_officers;
   SELECT * FROM students;
   ```
2. Check email/password case sensitivity (emails auto-converted to lowercase)
3. Health ID format: `TG-01-1968-0001` (must be exact)

### ❌ "Network Error" / Connection refused

**Solution:**
```bash
# Verify backend is still running
curl -s http://localhost:3001/api/health

# Verify frontend is still running
curl -s http://localhost:8080 | head -5

# If not running, restart:
# Terminal 1 - Backend (from /backend folder)
npm run dev

# Terminal 2 - Frontend (from root folder)
npm run dev
```

### ❌ "Token expired" or "Unauthorized"

**Solution:**
1. Clear localStorage: `localStorage.clear()`
2. Log out and login again: `http://localhost:8080/login/student`
3. Check dev console for detailed error message

### ❌ Dashboard shows empty/no data

**Solution:**
1. Check browser console (F12) for API errors
2. Verify backend is responding: `curl http://localhost:3001/api/health`
3. Check that Authorization header is being sent with token
4. Verify Supabase database has records:
   ```sql
   SELECT COUNT(*) as student_count FROM students;
   SELECT COUNT(*) as record_count FROM health_records;
   ```

---

## Test Checklist

Use this checklist to verify everything works:

- [ ] Backend server running on :3001
- [ ] Frontend server running on :8080
- [ ] Test data inserted into Supabase
- [ ] Student login works with ID `TG-01-1968-0001`
- [ ] Student dashboard loads health records
- [ ] Medical Officer login works with `doctor@example.com`
- [ ] MO dashboard shows statistics
- [ ] Admin login works with `rajeshpulluri333@gmail.com`
- [ ] Admin dashboard shows system-wide statistics
- [ ] All dashboards show real data (not mock)
- [ ] Logout clears localStorage
- [ ] Re-login works after logout
- [ ] Network calls show proper JWT tokens in headers
- [ ] All 27 API endpoints respond correctly

---

## Important URLs

**Frontend:** `http://localhost:8080`
- Login (Student): `http://localhost:8080/login/student`
- Login (Medical Officer): `http://localhost:8080/login/medical-officer`
- Login (Admin): `http://localhost:8080/login/admin`
- Student Dashboard: `http://localhost:8080/student-dashboard`
- MO Dashboard: `http://localhost:8080/mo-dashboard`
- Admin Dashboard: `http://localhost:8080/admin-dashboard`

**Backend API:** `http://localhost:3001/api`
- Health: `http://localhost:3001/api/health`
- API Docs: `/backend/API_DOCUMENTATION.md`

**Database:** 
- Supabase: `https://app.supabase.com`
- Project URL: `https://hnbuxvarpgwoqntehoev.supabase.co`

---

## Environment Files

### Backend Configuration
Location: `/backend/.env`
Status: ✅ Fully configured with real Supabase credentials

### Frontend Configuration
Location: `/.env` (optional - API URL hardcoded for now)
Current API Base URL: `http://localhost:3001/api`

---

## Next Steps After Testing

Once all tests pass:

1. ✅ **Production Deployment**
   - Deploy backend to production server
   - Deploy frontend to production server
   - Update API URLs in frontend code

2. ✅ **Real Data Migration**
   - Migrate actual student health records from existing system
   - Set up automated data sync if applicable

3. ✅ **User Training**
   - Train Medical Officers on system
   - Train Admin on dashboard usage

4. ✅ **Monitoring & Logging**
   - Set up error tracking
   - Monitor API performance
   - Set up database backups

---

## Support

For API issues, detailed logs are in the backend console.
For frontend issues, check browser DevTools (F12).
For database issues, use Supabase dashboard SQL editor.

Good luck with testing! 🚀
