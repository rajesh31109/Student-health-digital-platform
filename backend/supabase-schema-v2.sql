-- ===================================================================
-- ENHANCED DATABASE SCHEMA FOR ROLE-BASED HEALTH MANAGEMENT SYSTEM
-- ===================================================================
-- Created: 2026-03-28
-- Features: Student unique IDs, role-based access, audit logs, notifications

-- ===================================================================
-- 1. ADMIN TABLE (DMHO - District Medical Health Officer)
-- ===================================================================
CREATE TABLE IF NOT EXISTS admins (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  email VARCHAR(255) UNIQUE NOT NULL,
  password_hash VARCHAR(255) NOT NULL,
  first_name VARCHAR(100) NOT NULL,
  last_name VARCHAR(100) NOT NULL,
  designation VARCHAR(100),
  phone VARCHAR(20),
  department VARCHAR(100),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- ===================================================================
-- 2. MEDICAL OFFICERS TABLE
-- ===================================================================
CREATE TABLE IF NOT EXISTS medical_officers (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  email VARCHAR(255) UNIQUE NOT NULL,
  password_hash VARCHAR(255) NOT NULL,
  first_name VARCHAR(100) NOT NULL,
  last_name VARCHAR(100) NOT NULL,
  license_number VARCHAR(100) UNIQUE,
  specialization VARCHAR(100),
  phc_name VARCHAR(255),
  phc_code VARCHAR(50),
  phone VARCHAR(20),
  address TEXT,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- ===================================================================
-- 3. STUDENTS TABLE (Enhanced with unique ID system)
-- ===================================================================
CREATE TABLE IF NOT EXISTS students (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  unique_student_id VARCHAR(50) UNIQUE NOT NULL,  -- Format: TG-01-1968-XXXX
  first_name VARCHAR(100) NOT NULL,
  last_name VARCHAR(100) NOT NULL,
  email VARCHAR(255),
  phone VARCHAR(20),
  roll_number VARCHAR(50) UNIQUE,
  department VARCHAR(100),
  date_of_birth DATE,
  address TEXT,
  phc_name VARCHAR(255),
  phc_code VARCHAR(50),
  school_code VARCHAR(50),
  district_code VARCHAR(50),
  state_code VARCHAR(50),
  parent_name VARCHAR(100),
  parent_phone VARCHAR(20),
  is_active BOOLEAN DEFAULT true,
  registered_by UUID REFERENCES medical_officers(id) ON DELETE SET NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- ===================================================================
-- 4. HEALTH RECORDS TABLE (Enhanced with all required fields)
-- ===================================================================
CREATE TABLE IF NOT EXISTS health_records (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  student_id UUID NOT NULL REFERENCES students(id) ON DELETE CASCADE,
  medical_officer_id UUID NOT NULL REFERENCES medical_officers(id) ON DELETE SET NULL,
  
  -- Consultation Details
  consultation_type VARCHAR(100),
  consultation_date TIMESTAMP NOT NULL,
  symptoms TEXT,
  diagnosis TEXT,
  description TEXT,
  
  -- Medical Details
  prescription TEXT,
  medications JSONB,  -- Array of {name, dosage, duration}
  lab_tests JSONB,    -- Array of {test_name, result, date}
  
  -- Additional Fields
  notes TEXT,
  follow_up_date DATE,
  follow_up_notes TEXT,
  
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- ===================================================================
-- 5. AUDIT LOGS TABLE (Track all changes)
-- ===================================================================
CREATE TABLE IF NOT EXISTS audit_logs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL,
  user_role VARCHAR(50) NOT NULL,  -- 'student', 'medical_officer', 'admin'
  action VARCHAR(100) NOT NULL,     -- 'create', 'update', 'delete', 'login', etc.
  table_name VARCHAR(100),
  record_id UUID,
  changes JSONB,  -- {field: {old_value, new_value}}
  ip_address VARCHAR(50),
  user_agent TEXT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- ===================================================================
-- 6. NOTIFICATIONS TABLE
-- ===================================================================
CREATE TABLE IF NOT EXISTS notifications (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  recipient_id UUID NOT NULL,  -- Can be student, MO, or admin UUID
  recipient_type VARCHAR(50) NOT NULL,  -- 'student', 'medical_officer', 'admin'
  title VARCHAR(255) NOT NULL,
  message TEXT NOT NULL,
  notification_type VARCHAR(50),  -- 'health_record', 'appointment', 'alert', etc.
  related_record_id UUID,
  is_read BOOLEAN DEFAULT false,
  read_at TIMESTAMP,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- ===================================================================
-- 7. STUDENT ATTENDANCE/VISITS TABLE (For tracking)
-- ===================================================================
CREATE TABLE IF NOT EXISTS student_visits (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  student_id UUID NOT NULL REFERENCES students(id) ON DELETE CASCADE,
  medical_officer_id UUID REFERENCES medical_officers(id) ON DELETE SET NULL,
  visit_date TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  visit_type VARCHAR(50),  -- 'checkup', 'sick_leave', 'vaccination', etc.
  remarks TEXT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- ===================================================================
-- 8. REPORTS TABLE (For tracking generated reports)
-- ===================================================================
CREATE TABLE IF NOT EXISTS reports (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  generated_by UUID NOT NULL REFERENCES admins(id) ON DELETE SET NULL,
  report_type VARCHAR(100) NOT NULL,  -- 'student_health_summary', 'attendance', 'disease_prevalence', etc.
  title VARCHAR(255),
  description TEXT,
  filters JSONB,  -- Store filter criteria
  file_path VARCHAR(500),
  status VARCHAR(50) DEFAULT 'pending',  -- 'pending', 'processing', 'completed', 'failed'
  generated_at TIMESTAMP,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- ===================================================================
-- 9. SESSION TOKENS TABLE (For tracking active sessions)
-- ===================================================================
CREATE TABLE IF NOT EXISTS session_tokens (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL,
  user_role VARCHAR(50) NOT NULL,  -- 'student', 'medical_officer', 'admin'
  token_hash VARCHAR(255) NOT NULL,
  device_info TEXT,
  ip_address VARCHAR(50),
  expires_at TIMESTAMP NOT NULL,
  is_revoked BOOLEAN DEFAULT false,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- ===================================================================
-- INDEXES FOR PERFORMANCE
-- ===================================================================
-- Admin indexes
CREATE INDEX idx_admin_email ON admins(email);

-- Medical Officer indexes
CREATE INDEX idx_medical_officer_email ON medical_officers(email);
CREATE INDEX idx_medical_officer_license ON medical_officers(license_number);
CREATE INDEX idx_medical_officer_phc_code ON medical_officers(phc_code);
CREATE INDEX idx_medical_officer_active ON medical_officers(is_active);

-- Student indexes
CREATE INDEX idx_student_unique_id ON students(unique_student_id);
CREATE INDEX idx_student_email ON students(email);
CREATE INDEX idx_student_roll_number ON students(roll_number);
CREATE INDEX idx_student_phc ON students(phc_code);
CREATE INDEX idx_student_school ON students(school_code);
CREATE INDEX idx_student_active ON students(is_active);
CREATE INDEX idx_student_registered_by ON students(registered_by);

-- Health Records indexes
CREATE INDEX idx_health_records_student ON health_records(student_id);
CREATE INDEX idx_health_records_medical_officer ON health_records(medical_officer_id);
CREATE INDEX idx_health_records_date ON health_records(consultation_date);

-- Audit Logs indexes
CREATE INDEX idx_audit_logs_user ON audit_logs(user_id);
CREATE INDEX idx_audit_logs_action ON audit_logs(action);
CREATE INDEX idx_audit_logs_created ON audit_logs(created_at);

-- Notifications indexes
CREATE INDEX idx_notifications_recipient ON notifications(recipient_id);
CREATE INDEX idx_notifications_type ON notifications(recipient_type);
CREATE INDEX idx_notifications_read ON notifications(is_read);
CREATE INDEX idx_notifications_created ON notifications(created_at);

-- Visits indexes
CREATE INDEX idx_visits_student ON student_visits(student_id);
CREATE INDEX idx_visits_date ON student_visits(visit_date);

-- Session indexes
CREATE INDEX idx_sessions_user ON session_tokens(user_id);
CREATE INDEX idx_sessions_expires ON session_tokens(expires_at);

-- ===================================================================
-- ROW LEVEL SECURITY (RLS) POLICIES
-- ===================================================================
ALTER TABLE admins ENABLE ROW LEVEL SECURITY;
ALTER TABLE medical_officers ENABLE ROW LEVEL SECURITY;
ALTER TABLE students ENABLE ROW LEVEL SECURITY;
ALTER TABLE health_records ENABLE ROW LEVEL SECURITY;
ALTER TABLE audit_logs ENABLE ROW LEVEL SECURITY;
ALTER TABLE notifications ENABLE ROW LEVEL SECURITY;
ALTER TABLE student_visits ENABLE ROW LEVEL SECURITY;

-- Admin policies (can see everything)
CREATE POLICY "Admin: View all admins" ON admins FOR SELECT USING (true);
CREATE POLICY "Admin: Update own profile" ON admins FOR UPDATE USING (true);

-- Student policies (can only see their own data)
CREATE POLICY "Student: View own profile" ON students FOR SELECT 
  USING (auth.uid()::text = id::text);

CREATE POLICY "Student: View own health records" ON health_records FOR SELECT 
  USING (student_id = (SELECT id FROM students WHERE auth.uid()::text = id::text));

CREATE POLICY "Student: View own notifications" ON notifications FOR SELECT 
  USING (recipient_id = auth.uid());

-- Medical Officer policies (can see students they registered and all health records for those students)
CREATE POLICY "MO: View all students at their PHC" ON students FOR SELECT 
  USING (phc_code = (SELECT phc_code FROM medical_officers WHERE auth.uid()::text = id::text));

CREATE POLICY "MO: View health records for their students" ON health_records FOR SELECT 
  USING (medical_officer_id = auth.uid());

CREATE POLICY "MO: View their notifications" ON notifications FOR SELECT 
  USING (recipient_id = auth.uid());

-- ===================================================================
-- VIEWS FOR COMMON QUERIES
-- ===================================================================

-- Student health summary view
CREATE OR REPLACE VIEW student_health_summary AS
SELECT 
  s.id,
  s.unique_student_id,
  s.first_name,
  s.last_name,
  s.email,
  COUNT(DISTINCT hr.id) as total_consultations,
  MAX(hr.consultation_date) as last_consultation,
  STRING_AGG(DISTINCT hr.consultation_type, ', ') as consultation_types
FROM students s
LEFT JOIN health_records hr ON s.id = hr.student_id
GROUP BY s.id;

-- PHC-wise student count
CREATE OR REPLACE VIEW phc_student_statistics AS
SELECT 
  phc_code,
  phc_name,
  COUNT(*) as total_students,
  COUNT(CASE WHEN is_active = true THEN 1 END) as active_students
FROM students
GROUP BY phc_code, phc_name;

-- Medical Officer workload view
CREATE OR REPLACE VIEW medical_officer_workload AS
SELECT 
  mo.id,
  mo.first_name,
  mo.last_name,
  mo.phc_code,
  COUNT(DISTINCT hr.id) as consultations_this_month,
  COUNT(DISTINCT s.id) as students_registered
FROM medical_officers mo
LEFT JOIN health_records hr ON mo.id = hr.medical_officer_id 
  AND EXTRACT(MONTH FROM hr.consultation_date) = EXTRACT(MONTH FROM CURRENT_DATE)
LEFT JOIN students s ON mo.id = s.registered_by
GROUP BY mo.id, mo.first_name, mo.last_name, mo.phc_code;
