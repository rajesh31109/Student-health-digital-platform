# 🚀 Complete Setup & Launch Guide

## ✅ Backend Status: RUNNING ON http://localhost:3001

---

## Step 1️⃣: Create Test Data in Supabase (Required)

### What to do:
1. Go to: **https://app.supabase.com**
2. Select project: **hnbuxvarpgwoqntehoev**
3. Go to: **SQL Editor** > Click **New Query**
4. Copy-paste the entire content of: `/backend/INSERT_TEST_DATA.sql`
5. Click **Run**

### What gets created:
- ✅ Admin user: `rajeshpulluri333@gmail.com` / `admin123`
- ✅ Medical Officer: `doctor@example.com` / `doctor123`
- ✅ Student: Health ID `TG-01-1968-0001` (no password)
- ✅ Sample health records & notifications

### Expected Output:
```
admin_count: 1
medical_officer_count: 1
student_count: 1
health_record_count: 1
notification_count: 1
```

---

## Step 2️⃣: Test Backend APIs (Optional)

Run the comprehensive API test script:
```bash
cd backend
chmod +x test-api.sh
./test-api.sh
```

Or test manually:
```bash
# Student Login
curl -X POST http://localhost:3001/api/auth/student-login \
  -H "Content-Type: application/json" \
  -d '{"healthId":"TG-01-1968-0001"}'

# Admin Login
curl -X POST http://localhost:3001/api/auth/admin-login \
  -H "Content-Type: application/json" \
  -d '{"email":"rajeshpulluri333@gmail.com","password":"admin123"}'

# MO Login
curl -X POST http://localhost:3001/api/auth/mo-login \
  -H "Content-Type: application/json" \
  -d '{"email":"doctor@example.com","password":"doctor123"}'
```

---

## Step 3️⃣: Frontend - Switch from Mock Data to Real API

The frontend currently uses mock/hardcoded data. We need to replace it with real API calls.

### Files to Update:

#### 1️⃣ **src/pages/StudentLogin.tsx**
Replace login handler to call backend:

```typescript
const handleLogin = async (e: React.FormEvent) => {
  e.preventDefault();
  try {
    const response = await fetch('http://localhost:3001/api/auth/student-login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ healthId: healthId })
    });
    
    const data = await response.json();
    
    if (data.success) {
      // Store token
      localStorage.setItem('token', data.data.token);
      localStorage.setItem('healthId', data.data.healthId);
      localStorage.setItem('role', 'student');
      
      // Navigate to dashboard
      navigate('/student-dashboard');
    } else {
      alert(data.message);
    }
  } catch (error) {
    console.error('Login error:', error);
    alert('Login failed. Please try again.');
  }
};
```

#### 2️⃣ **src/pages/MedicalOfficerLogin.tsx**
Replace login handler for MO:

```typescript
const handleLogin = async (e: React.FormEvent) => {
  e.preventDefault();
  try {
    const response = await fetch('http://localhost:3001/api/auth/mo-login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password })
    });
    
    const data = await response.json();
    
    if (data.success) {
      localStorage.setItem('token', data.data.token);
      localStorage.setItem('moId', data.data.moId);
      localStorage.setItem('role', 'medical_officer');
      navigate('/mo-dashboard');
    } else {
      alert(data.message);
    }
  } catch (error) {
    alert('Login failed');
  }
};
```

#### 3️⃣ **src/pages/AdminLogin.tsx**
Replace login handler for Admin:

```typescript
const handleLogin = async (e: React.FormEvent) => {
  e.preventDefault();
  try {
    const response = await fetch('http://localhost:3001/api/auth/admin-login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password })
    });
    
    const data = await response.json();
    
    if (data.success) {
      localStorage.setItem('token', data.data.token);
      localStorage.setItem('adminId', data.data.adminId);
      localStorage.setItem('role', 'admin');
      navigate('/admin-dashboard');
    } else {
      alert(data.message);
    }
  } catch (error) {
    alert('Login failed');
  }
};
```

#### 4️⃣ **src/pages/StudentDashboard.tsx**
Replace mock data with real API:

```typescript
useEffect(() => {
  const fetchStudentData = async () => {
    const token = localStorage.getItem('token');
    
    try {
      // Get health records
      const response = await fetch('http://localhost:3001/api/student/health-records', {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      
      const data = await response.json();
      if (data.success) {
        setHealthRecords(data.data);
      }
    } catch (error) {
      console.error('Failed to fetch data:', error);
    }
  };
  
  fetchStudentData();
}, []);
```

#### 5️⃣ **src/pages/MedicalOfficerDashboard.tsx**
Replace mock student list with real API:

```typescript
useEffect(() => {
  const fetchStudents = async () => {
    const token = localStorage.getItem('token');
    
    try {
      const response = await fetch('http://localhost:3001/api/mo/students', {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      
      const data = await response.json();
      if (data.success) {
        setStudents(data.data);
      }
    } catch (error) {
      console.error('Failed to fetch students:', error);
    }
  };
  
  fetchStudents();
}, []);
```

#### 6️⃣ **src/pages/AdminDashboard.tsx**
Replace mock stats with real API:

```typescript
useEffect(() => {
  const fetchDashboardStats = async () => {
    const token = localStorage.getItem('token');
    
    try {
      const response = await fetch('http://localhost:3001/api/admin/dashboard/statistics', {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      
      const data = await response.json();
      if (data.success) {
        setStats(data.data);
      }
    } catch (error) {
      console.error('Failed to fetch statistics:', error);
    }
  };
  
  fetchDashboardStats();
}, []);
```

---

## Step 4️⃣: Create API Service Layer (Optional but Recommended)

Create `src/services/api.ts`:

```typescript
const API_BASE = 'http://localhost:3001/api';

export const apiCall = async (
  endpoint: string,
  options: RequestInit = {}
) => {
  const token = localStorage.getItem('token');
  
  const headers: HeadersInit = {
    'Content-Type': 'application/json',
    ...options.headers,
  };
  
  if (token && !endpoint.includes('login')) {
    headers['Authorization'] = `Bearer ${token}`;
  }
  
  const response = await fetch(`${API_BASE}${endpoint}`, {
    ...options,
    headers,
  });
  
  return response.json();
};

// Auth functions
export const auth = {
  studentLogin: (healthId: string) =>
    apiCall('/auth/student-login', {
      method: 'POST',
      body: JSON.stringify({ healthId })
    }),
  
  moLogin: (email: string, password: string) =>
    apiCall('/auth/mo-login', {
      method: 'POST',
      body: JSON.stringify({ email, password })
    }),
  
  adminLogin: (email: string, password: string) =>
    apiCall('/auth/admin-login', {
      method: 'POST',
      body: JSON.stringify({ email, password })
    }),
  
  logout: () => apiCall('/auth/logout', { method: 'POST' }),
};

// Student endpoints
export const student = {
  getProfile: () => apiCall('/student/profile'),
  getHealthRecords: () => apiCall('/student/health-records'),
  getHealthSummary: () => apiCall('/student/health-summary'),
  getNotifications: () => apiCall('/student/notifications'),
  getVisits: () => apiCall('/student/visits'),
};

// Medical Officer endpoints
export const medicalOfficer = {
  getStudents: () => apiCall('/mo/students'),
  getStatistics: () => apiCall('/mo/statistics'),
  registerStudent: (studentData: any) =>
    apiCall('/mo/students/register', {
      method: 'POST',
      body: JSON.stringify(studentData)
    }),
  createHealthRecord: (recordData: any) =>
    apiCall('/mo/health-records', {
      method: 'POST',
      body: JSON.stringify(recordData)
    }),
};

// Admin endpoints
export const admin = {
  getDashboardStats: () => apiCall('/admin/dashboard/statistics'),
  getStudents: (filters?: any) => 
    apiCall('/admin/students' + (filters ? '?...' : '')),
  getHealthRecords: () => apiCall('/admin/health-records'),
  getMedicalOfficers: () => apiCall('/admin/medical-officers'),
  getAuditLogs: () => apiCall('/admin/audit-logs'),
};
```

Then use in components:
```typescript
import { auth, student } from '../services/api';

// In login handler
const data = await auth.studentLogin(healthId);

// In dashboard
const records = await student.getHealthRecords();
```

---

## Step 5️⃣: Run Full Project

### Terminal 1 - Backend
```bash
cd backend
npm run dev
# Running on http://localhost:3001
```

### Terminal 2 - Frontend
```bash
cd /workspaces/Student-health-digital-platform
npm run dev
# Running on http://localhost:5173
```

### Access Application
```
http://localhost:5173
```

---

## 🧪 Test Credentials

### Admin Login
- **Email:** rajeshpulluri333@gmail.com
- **Password:** admin123

### Medical Officer Login
- **Email:** doctor@example.com
- **Password:** doctor123

### Student Login
- **Health ID:** TG-01-1968-0001
- **No password needed**

---

## ✅ Full API Endpoints Reference

| Role | Method | Endpoint | Purpose |
|------|--------|----------|---------|
| All | POST | `/auth/student-login` | Student login with Health ID |
| All | POST | `/auth/mo-login` | Medical Officer login |
| All | POST | `/auth/admin-login` | Admin login |
| All | GET | `/auth/profile` | Get current user profile |
| All | POST | `/auth/logout` | Logout user |
| Student | GET | `/student/profile` | Get student profile |
| Student | GET | `/student/health-records` | Get checkup history |
| Student | GET | `/student/health-summary` | Get medical summary |
| Student | GET | `/student/notifications` | Get notifications |
| Student | GET | `/student/visits` | Get visit history |
| MO | GET | `/mo/students` | Get students at PHC |
| MO | POST | `/mo/students/register` | Register new student |
| MO | POST | `/mo/health-records` | Enter health data |
| MO | GET | `/mo/statistics` | Get workload stats |
| Admin | GET | `/admin/dashboard/statistics` | Dashboard overview |
| Admin | GET | `/admin/students` | Get all students |
| Admin | GET | `/admin/health-records` | Get all records |
| Admin | GET | `/admin/medical-officers` | Get all MOs |
| Admin | GET | `/admin/audit-logs` | Get activity logs |

---

## 🔌 Backend Status Checks

```bash
# Health check
curl http://localhost:3001/api/health

# Student login
curl -X POST http://localhost:3001/api/auth/student-login \
  -H "Content-Type: application/json" \
  -d '{"healthId":"TG-01-1968-0001"}'
```

---

## 📝 Troubleshooting

### Backend won't start
- Check port 3001 is available: `lsof -i :3001`
- Verify .env file is in backend directory
- Check Node version: `node --version` (should be 18+)

### CORS errors
- Make sure `FRONTEND_URL` in backend `.env` matches frontend URL
- Typically: `http://localhost:5173`

### Database connection errors
- Verify Supabase credentials in `.env`
- Check test data was created via SQL script
- Verify database schema is deployed

### Login fails
- Ensure test data is created in Supabase
- Check password hash matches (use provided hashes)
- Try with exact credentials provided above

---

## 🎉 Next Steps

1. ✅ Backend running ← **YOU ARE HERE**
2. 📝 Run SQL script to create test data
3. 🧪 Test API endpoints
4. 🎨 Update frontend components
5. 🚀 Launch full project
6. ✨ Test all 3 login flows
7. 📊 Verify dashboards work

---

**Questions?** Check `backend/API_DOCUMENTATION.md` for complete API reference.

**Status:** Backend Ready ✅ | Frontend Needs Updates ⏳ | Tests Ready 🧪
