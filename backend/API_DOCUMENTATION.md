# Student Health Digital Platform - API Documentation

## Overview

This is the REST API for the Student Health Digital Platform, supporting three main user roles:
- **Students** - View their own health records and data
- **Medical Officers** - Register students and enter health data
- **Admins (DMHO)** - View all data across schools and generate reports

## Base URL
```
http://localhost:3001/api  (development)
https://api.yourdomain.com/api  (production)
```

## Authentication

All endpoints (except login) require a JWT token in the Authorization header:
```bash
Authorization: Bearer {token}
```

Tokens are valid for 7 days.

---

## Authentication Endpoints

### 1. Student Login

**Endpoint:** `POST /api/auth/student-login`

**Description:** Login using unique Student Health ID (no password)

**Request:**
```json
{
  "healthId": "TG-01-1968-0001"
}
```

**Response:**
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

**Status Codes:**
- `200` - Login successful
- `400` - Invalid request format
- `401` - Invalid Health ID

---

### 2. Medical Officer Login

**Endpoint:** `POST /api/auth/mo-login`

**Description:** Login with email and password

**Request:**
```json
{
  "email": "mo@example.com",
  "password": "123456"
}
```

**Response:**
```json
{
  "success": true,
  "message": "Login successful",
  "data": {
    "token": "eyJhbGciOiJIUzI1NiIs...",
    "moId": "mo-uuid-123",
    "name": "Dr. Smith",
    "email": "mo@example.com"
  }
}
```

**Status Codes:**
- `200` - Login successful
- `400` - Invalid request format
- `401` - Invalid email or password

---

### 3. Admin Login

**Endpoint:** `POST /api/auth/admin-login`

**Description:** Login with email and password (DMHO)

**Request:**
```json
{
  "email": "admin@example.com",
  "password": "adminpass123"
}
```

**Response:**
```json
{
  "success": true,
  "message": "Login successful",
  "data": {
    "token": "eyJhbGciOiJIUzI1NiIs...",
    "adminId": "admin-uuid-123",
    "name": "DMHO",
    "email": "admin@example.com"
  }
}
```

**Status Codes:**
- `200` - Login successful
- `400` - Invalid request format
- `401` - Invalid email or password

---

### 4. Get Profile (Protected)

**Endpoint:** `GET /api/auth/profile`

**Description:** Get current user's profile (works for all roles)

**Headers:**
```bash
Authorization: Bearer {token}
```

**Response:**
```json
{
  "success": true,
  "data": {
    "id": "user-uuid",
    "name": "John Doe",
    "email": "john@example.com",
    "role": "student",
    ...
  }
}
```

**Status Codes:**
- `200` - Profile retrieved
- `401` - Unauthorized (no token or invalid token)
- `404` - User not found

---

### 5. Logout (Protected)

**Endpoint:** `POST /api/auth/logout`

**Description:** Logout user (optional - frontend typically just deletes the token)

**Headers:**
```bash
Authorization: Bearer {token}
```

**Response:**
```json
{
  "success": true,
  "message": "Logged out successfully"
}
```

---

## Student Dashboard Endpoints

All endpoints require: `Authorization: Bearer {token}`

### 1. Get Student Profile

**Endpoint:** `GET /api/student/profile`

**Description:** Get student's own profile and basic information

**Response:**
```json
{
  "success": true,
  "data": {
    "id": "student-uuid",
    "unique_student_id": "TG-01-1968-0001",
    "first_name": "John",
    "last_name": "Doe",
    "date_of_birth": "2010-05-15",
    "gender": "Male",
    "school_id": "school-uuid",
    "class": "8",
    "section": "A"
  }
}
```

---

### 2. Get Health Records (Checkup History)

**Endpoint:** `GET /api/student/health-records`

**Description:** Get list of all health checkups (for dashboard history)

**Query Parameters:**
- `limit` - Number of records (default: 10)
- `offset` - Skip N records (default: 0)

**Response:**
```json
{
  "success": true,
  "data": [
    {
      "id": "record-uuid",
      "date": "2024-01-15",
      "checkup_by": "Dr. Smith",
      "vitals": {
        "blood_pressure": "120/80",
        "heart_rate": 72,
        "temperature": 98.6,
        "weight": 45.5,
        "height": 160
      },
      "diagnosis": "Healthy"
    }
  ]
}
```

---

### 3. Get Health Summary

**Endpoint:** `GET /api/student/health-summary`

**Description:** Get medical conditions and health summary

**Response:**
```json
{
  "success": true,
  "data": {
    "blood_group": "O+",
    "chronic_conditions": ["Asthma"],
    "allergies": ["Peanuts"],
    "medications": ["Salbutamol inhaler"],
    "nutrition_advice": "Increase protein intake",
    "last_checkup": "2024-01-15"
  }
}
```

---

### 4. Get Notifications

**Endpoint:** `GET /api/student/notifications`

**Description:** Get student's notifications (health alerts, reminders)

**Response:**
```json
{
  "success": true,
  "data": [
    {
      "id": "notify-uuid",
      "title": "Health Checkup Due",
      "message": "Your yearly checkup is due soon",
      "type": "reminder",
      "read": false,
      "created_at": "2024-01-20"
    }
  ]
}
```

---

### 5. Get Student Visits

**Endpoint:** `GET /api/student/visits`

**Description:** Get history of visits to health center

**Response:**
```json
{
  "success": true,
  "data": [
    {
      "id": "visit-uuid",
      "date": "2024-01-15",
      "reason": "Regular checkup",
      "outcome": "Healthy"
    }
  ]
}
```

---

## Medical Officer Dashboard Endpoints

All endpoints require: `Authorization: Bearer {token}` and `role: medical_officer`

### 1. Get Students at PHC

**Endpoint:** `GET /api/mo/students`

**Description:** Get all students at this MO's Primary Health Center

**Query Parameters:**
- `search` - Search by name or Health ID
- `class` - Filter by class
- `page` - Page number (for pagination)

**Response:**
```json
{
  "success": true,
  "data": [
    {
      "id": "student-uuid",
      "unique_student_id": "TG-01-1968-0001",
      "name": "John Doe",
      "date_of_birth": "2010-05-15",
      "class": "8",
      "school_name": "ABC School",
      "last_checkup": "2024-01-15"
    }
  ]
}
```

---

### 2. Register Student

**Endpoint:** `POST /api/mo/students/register`

**Description:** Register a new student (generates unique Health ID automatically)

**Request:**
```json
{
  "first_name": "John",
  "last_name": "Doe",
  "date_of_birth": "2010-05-15",
  "gender": "Male",
  "school_id": "school-uuid",
  "class": "8",
  "section": "A",
  "parent_name": "Jane Doe",
  "parent_phone": "9876543210",
  "parent_email": "parent@example.com",
  "blood_group": "O+"
}
```

**Response:**
```json
{
  "success": true,
  "message": "Student registered successfully",
  "data": {
    "id": "student-uuid",
    "unique_student_id": "TG-01-1968-0042",
    "name": "John Doe"
  }
}
```

---

### 3. Create Health Record

**Endpoint:** `POST /api/mo/health-records`

**Description:** Enter health data for a student (vitals and observations)

**Request:**
```json
{
  "student_id": "student-uuid",
  "height": 160,
  "weight": 45.5,
  "blood_pressure": "120/80",
  "heart_rate": 72,
  "temperature": 98.6,
  "hemoglobin": 13.5,
  "vision": "6/6",
  "dental_status": "Healthy",
  "medical_conditions": ["Asthma"],
  "allergies": ["Peanuts"],
  "diagnosis": "Healthy with mild asthma",
  "prescription": "Continue asthma medications",
  "lab_tests": "Blood group confirmed O+"
}
```

**Response:**
```json
{
  "success": true,
  "message": "Health record created",
  "data": {
    "id": "record-uuid",
    "student_id": "student-uuid",
    "checkup_date": "2024-01-20"
  }
}
```

---

### 4. Get MO Statistics

**Endpoint:** `GET /api/mo/statistics`

**Description:** Get statistics for this MO's work

**Response:**
```json
{
  "success": true,
  "data": {
    "total_students_registered": 245,
    "students_checked_this_month": 42,
    "students_with_issues": 18,
    "most_common_condition": "Asthma",
    "pending_follow_ups": 5
  }
}
```

---

## Admin Dashboard Endpoints

All endpoints require: `Authorization: Bearer {token}` and `role: admin`

### 1. Get Dashboard Statistics

**Endpoint:** `GET /api/admin/dashboard/statistics`

**Description:** Get overview statistics for admin dashboard

**Query Parameters:**
- `district` - Filter by district code
- `mandal` - Filter by mandal code
- `school` - Filter by school code

**Response:**
```json
{
  "success": true,
  "data": {
    "total_students": 12500,
    "total_schools": 85,
    "checkups_this_month": 2340,
    "reports_generated": 125,
    "students_with_issues": 340,
    "health_alerts": 28
  }
}
```

---

### 2. Get All Students

**Endpoint:** `GET /api/admin/students`

**Description:** Get list of all students (with filtering and search)

**Query Parameters:**
- `district` - Filter by district
- `school` - Filter by school
- `class` - Filter by class
- `search` - Search by name or Health ID
- `page` - Page number for pagination
- `limit` - Records per page (default: 50)

**Response:**
```json
{
  "success": true,
  "data": [
    {
      "id": "student-uuid",
      "unique_student_id": "TG-01-1968-0001",
      "name": "John Doe",
      "school_name": "ABC School",
      "class": "8",
      "status": "active",
      "last_checkup": "2024-01-15"
    }
  ]
}
```

---

### 3. Get All Health Records

**Endpoint:** `GET /api/admin/health-records`

**Description:** Get all health records with filtering

**Query Parameters:**
- `from_date` - Start date (YYYY-MM-DD)
- `to_date` - End date (YYYY-MM-DD)
- `school` - Filter by school
- `district` - Filter by district
- `page` - Page number

**Response:**
```json
{
  "success": true,
  "data": [
    {
      "id": "record-uuid",
      "student_name": "John Doe",
      "school": "ABC School",
      "checkup_date": "2024-01-15",
      "diagnosis": "Healthy"
    }
  ]
}
```

---

### 4. Create Medical Officer

**Endpoint:** `POST /api/admin/medical-officers`

**Description:** Create a new Medical Officer account

**Request:**
```json
{
  "name": "Dr. Smith",
  "email": "doctor.smith@example.com",
  "password": "securepassword123",
  "phc_id": "phc-uuid",
  "specialization": "General Practitioner"
}
```

**Response:**
```json
{
  "success": true,
  "message": "Medical Officer created successfully",
  "data": {
    "id": "mo-uuid",
    "email": "doctor.smith@example.com"
  }
}
```

---

### 5. Get Audit Logs

**Endpoint:** `GET /api/admin/audit-logs`

**Description:** Get system activity logs (who did what and when)

**Query Parameters:**
- `user_role` - Filter by role (student, medical_officer, admin)
- `action` - Filter by action type
- `from_date` - Start date
- `to_date` - End date

**Response:**
```json
{
  "success": true,
  "data": [
    {
      "id": "log-uuid",
      "user_name": "Dr. Smith",
      "user_role": "medical_officer",
      "action": "create_health_record",
      "table_name": "health_records",
      "timestamp": "2024-01-20T10:30:00Z"
    }
  ]
}
```

---

### 6. Generate Report

**Endpoint:** `GET /api/admin/reports`

**Description:** Generate and export health reports

**Query Parameters:**
- `type` - Report type: health_status, attendance, conditions_summary
- `district` - District for report
- `from_date` - Report start date
- `to_date` - Report end date
- `format` - Output format: json, csv, pdf (default: json)

**Response:**
```json
{
  "success": true,
  "data": {
    "report_type": "health_status",
    "generated_at": "2024-01-20",
    "total_records": 1250,
    "download_url": "/api/admin/reports/report-123.csv"
  }
}
```

---

## Error Responses

All error responses follow this format:

```json
{
  "success": false,
  "message": "Error description"
}
```

### Common Status Codes
- `200` - Success
- `400` - Bad request (validation error)
- `401` - Unauthorized (missing or invalid token)
- `403` - Forbidden (insufficient permissions)
- `404` - Not found
- `500` - Server error

---

## Testing the API

### Using cURL

**Student Login:**
```bash
curl -X POST http://localhost:3001/api/auth/student-login \
  -H "Content-Type: application/json" \
  -d '{"healthId":"TG-01-1968-0001"}'
```

**Get Profile:**
```bash
curl -X GET http://localhost:3001/api/auth/profile \
  -H "Authorization: Bearer YOUR_TOKEN_HERE"
```

---

## Rate Limiting

Currently no rate limiting is implemented. Production deployment should add rate limiting to prevent abuse.

---

## CORS

The API accepts requests from origins specified in `FRONTEND_URL` environment variable.

---

## Support

For API issues or questions, contact the development team.
