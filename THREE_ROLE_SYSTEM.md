# 👥 THREE-ROLE SYSTEM - Complete Management Guide

## System Overview

The Student Health Digital Profile Platform is now a **THREE-ROLE MANAGEMENT SYSTEM** with no mock data, test accounts, or demo features.

```
┌─────────────────────────────────────────────────────────────┐
│                    SYSTEM ROLES                             │
├──────────────────┬──────────────────┬──────────────────────┤
│    STUDENTS      │ MEDICAL OFFICERS │      ADMINS (DMHO)   │
├──────────────────┼──────────────────┼──────────────────────┤
│ View own records │ Register students│ Manage all records   │
│ Track vitals     │ Create health    │ View statistics      │
│ Check history    │  records         │ Generate reports     │
│ No edits/deletes │ Update records   │ Manage users         │
│                  │ Search students  │ System settings      │
└──────────────────┴──────────────────┴──────────────────────┘
```

---

## 🎓 STUDENT ROLE

### What Students Can Do
✅ Login with Health ID only (no password)
✅ View their personal health records
✅ See vitals and checkup history
✅ Track medical conditions and allergies
✅ View prescriptions
✅ Check appointment dates

### What Students CANNOT Do
❌ Edit or modify records
❌ Delete records  
❌ See other students' data
❌ Create new records
❌ Access admin features

### Student Workflow

```
1. Student receives Health ID from PHC
   Format: TG-01-1968-0001
   
2. Goes to login page
   
3. Enters Health ID (no password)
   
4. Views personal dashboard
   
5. Sees only their health records
   
6. Can download/print records
```

### Student Dashboard Features
- **Personal Information**: Name, Health ID, Age, School
- **Latest Vitals**: All recent measurements
- **Checkup History**: Chronological health records
- **Medical Conditions**: List of any allergies/conditions
- **Prescriptions**: Current medications
- **Action**: Can logout, refresh data

---

## 🏥 MEDICAL OFFICER ROLE

### What Medical Officers Can Do
✅ Login with email + password
✅ Register new students
✅ Create health records for students
✅ Update student health data
✅ Search and view student records
✅ Generate health reports
✅ View statistics for their PHC

### What Medical Officers CANNOT Do
❌ Delete health records
❌ View all students (only their assigned PHC)
❌ Delete student accounts
❌ Change system settings
❌ Access admin features

### Medical Officer Workflow

```
1. MO logs in with credentials
   
2. Dashboard shows statistics
   - Total students registered
   - Checkups completed today
   - Pending checkups
   - Reports generated
   
3. MO can register new students
   - Enters student details
   - System generates Health ID
   - Student record saved
   
4. MO can record health data
   - Selects student
   - Enters vitals (BP, HR, etc.)
   - Adds medical conditions
   - Records prescriptions
   - Saves to database
   
5. MO can search students
   - Filter by name/ID
   - View complete history
   - Update records as needed
```

### Medical Officer Dashboard Features
- **Statistics Cards**: Students, checkups, reports
- **Registration Tab**: Add new students
- **Health Entry Tab**: Record vitals and data
- **Search Tab**: Find and manage students
- **Reports Tab**: Generate health summaries
- **Action**: Can logout, refresh data

---

## 👨‍💼 ADMIN (DMHO) ROLE

### What Admins Can Do
✅ Login with email + password
✅ View all students across all PHCs
✅ View all health records
✅ View comprehensive statistics
✅ Generate system-wide reports
✅ Manage Medical Officers
✅ Access system settings
✅ Generate analytics

### What Admins CANNOT Do
❌ Edit student basic info (created by MO)
❌ Create new students directly
❌ Modify medical records directly

### Admin Workflow

```
1. Admin logs in with credentials
   
2. Dashboard shows system-wide stats
   - Total students registered
   - Total checkups performed
   - Checkups this month
   - Reports generated
   
3. Admin can view health alerts
   - Anemia cases
   - Vision issues
   - Underweight students
   - Dental problems
   
4. Admin can manage students
   - Search across all schools
   - Filter by district/mandal/school
   - View complete health history
   
5. Admin can generate reports
   - School-wise statistics
   - Health condition analysis
   - Monthly/yearly trends
   - Export to PDF/Excel
   
6. Admin can manage users
   - View all Medical Officers
   - Manage permissions
   - View audit logs
```

### Admin Dashboard Features
- **Statistics**: System-wide metrics
- **Health Alerts**: Critical health issues
- **Top Schools**: Performance ranking
- **Student Management**: Search and filter
- **Reports**: Generate analytics
- **User Management**: MO and admin management
- **Settings**: System configuration
- **Action**: Can logout, refresh data

---

## 🔄 Complete Data Flow

```
INITIAL SETUP
──────────────
Admin creates Medical Officer account
    ↓
MO logs in with email+password
    ↓

ONGOING OPERATIONS
──────────────────
MO registers a new student
    ↓
System generates Health ID (TG-01-1968-0001)
    ↓
Student receives Health ID
    ↓
Student logs in with Health ID
    ↓
Dashboard loads student's data
    ↓
MO examines student, records vitals
    ↓
Data saved to database
    ↓
Student can now see updated records
    ↓
Admin views statistics (includes this student)
    ↓
Admin can generate reports including this student
```

---

## 📊 Data Access Matrix

| Operation | Student | Medical Officer | Admin |
|-----------|---------|-----------------|-------|
| **View own records** | ✅ | ✅ | ✅ |
| **View assigned patients** | N/A | ✅ | N/A |
| **View all students** | ❌ | ❌ | ✅ |
| **Create health record** | ❌ | ✅ | ❌ |
| **Edit health record** | ❌ | ✅ | ❌ |
| **Delete health record** | ❌ | ❌ | ❌ |
| **Register student** | ❌ | ✅ | ❌ |
| **Manage Medical Officers** | ❌ | ❌ | ✅ |
| **Generate reports** | ❌ | ✅ Limited | ✅ Full |
| **View statistics** | ❌ | ✅ PHC-only | ✅ System-wide |
| **Access settings** | ❌ | ❌ | ✅ |

---

## 🔐 Authentication & Authorization

### Login Process

**For Students:**
```
Health ID entered
    ↓
Backend checks database for matching student
    ↓
Student found & is_active = true
    ↓
JWT token generated
    ↓
Token stored in localStorage
    ↓
Student Dashboard loads
    ↓
API calls include token for verification
```

**For Medical Officers & Admins:**
```
Email + Password entered
    ↓
Backend checks database for matching user
    ↓
Password verified against bcrypt hash
    ↓
User found & is_active = true
    ↓
JWT token with role included
    ↓
Token stored in localStorage
    ↓
Dashboard loads based on role
    ↓
All API calls verified for role-based access
```

### Authorization Check

Every API request validates:
1. ✅ Is request authenticated? (JWT token present)
2. ✅ Is token valid? (Correct signature, not expired)
3. ✅ Does user have permission? (Role-based check)
4. ✅ Can user access this data? (Ownership check)

---

## 🚀 Setup Process

### Step 1: Initial System Setup (One-time)
1. Admin (DMHO) created manually in database by system administrator
2. Admin account details: email + bcrypt hashed password
3. Verified admin can login to dashboard

### Step 2: Add Medical Officers
1. Admin logs in to dashboard
2. Goes to "User Management"
3. Creates Medical Officers:
   - Email address
   - Temporary password (must change on first login)
   - PHC assignment
   - License information
4. MO receives credentials
5. MO logs in system and changes password

### Step 3: Students Register (Automatic)
1. MO logs in and goes to "Register Student"
2. MO enters student details
3. System auto-generates Health ID
4. Student record saved with `is_active = true`
5. Student gets Health ID (verbally or printed)
6. Student can now login with Health ID

### Step 4: Ongoing Operation
1. MO records student health data
2. Student logs in and views data
3. Admin monitors statistics and reports
4. System maintains data integrity

---

## 📋 User Management Checklist

### For System Administrators
- [ ] Create initial Admin (DMHO) account in Supabase
- [ ] Use bcrypt-hashed passwords for all users
- [ ] Test admin login and dashboard access

### For Admin (DMHO)
- [ ] Create Medical Officer accounts
- [ ] Assign Medical Officers to PHCs
- [ ] Monitor Medical Officer activity
- [ ] Generate system-wide reports
- [ ] Manage user permissions

### For Medical Officers
- [ ] Register students in system
- [ ] Record health examination data
- [ ] Update student records
- [ ] Generate health reports
- [ ] Communicate Health IDs to students

### For Students
- [ ] Receive Health ID from PHC
- [ ] Login to view health records
- [ ] Review recorded data
- [ ] No direct management needed

---

## 🎯 No Test Data, No Mock Features

The system is now completely dynamic with **ZERO test data**:

✅ No demo credentials displayed
✅ No placeholder Health IDs
✅ No sample student accounts
✅ No mock health records
✅ No test email addresses
✅ No demonstration passwords

All data must be **entered by real users** through their designated roles.

---

## 🔗 System Integration

```
FRONTEND (React)
├─ Student Login → Health ID only
├─ MO Dashboard → Register, Record, Search
└─ Admin Dashboard → Manage, Report, Analyze

↓ (JWT Token Authentication)

BACKEND (Express)
├─ Validates JWT token
├─ Checks user role
├─ Enforces data access control
└─ Returns role-appropriate data

↓ (Role-based queries)

DATABASE (Supabase)
├─ Students table
├─ Medical Officers table
├─ Admins table
├─ Health Records table
└─ Row-level security policies

↓ (Only authorized data)

FRONTEND (React)
└─ Displays user's permitted data only
```

---

## 📞 Support & Troubleshooting

**Issue**: "Health ID not found during login"
**Solution**: Medical Officer must register student first

**Issue**: "Invalid email or password" for MO
**Solution**: Ask system administrator to verify account exists and is active

**Issue**: "Access Denied" for certain operations
**Solution**: Your role doesn't have permission for that operation

**Issue**: "Student appears in search but MO can't record data"
**Solution**: Student might be assigned to different PHC - contact admin

---

**Status**: ✅ Three-Role System Fully Implemented
**Data Management**: ✅ By roles only
**Test Data**: ✅ Removed completely
**User Responsibilities**: ✅ Clearly defined
