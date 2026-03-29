-- Create student_users table
CREATE TABLE IF NOT EXISTS student_users (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  email VARCHAR(255) UNIQUE NOT NULL,
  password_hash VARCHAR(255) NOT NULL,
  first_name VARCHAR(100) NOT NULL,
  last_name VARCHAR(100) NOT NULL,
  roll_number VARCHAR(50),
  department VARCHAR(100),
  phone VARCHAR(20),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Create medical_officers table
CREATE TABLE IF NOT EXISTS medical_officers (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  email VARCHAR(255) UNIQUE NOT NULL,
  password_hash VARCHAR(255) NOT NULL,
  first_name VARCHAR(100) NOT NULL,
  last_name VARCHAR(100) NOT NULL,
  license_number VARCHAR(100),
  specialization VARCHAR(100),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Create health_records table
CREATE TABLE IF NOT EXISTS health_records (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  student_id UUID NOT NULL REFERENCES student_users(id) ON DELETE CASCADE,
  record_type VARCHAR(100) NOT NULL,
  description TEXT NOT NULL,
  date TIMESTAMP NOT NULL,
  medical_officer_id UUID REFERENCES medical_officers(id) ON DELETE SET NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Create indexes for better query performance
CREATE INDEX idx_student_email ON student_users(email);
CREATE INDEX idx_medical_officer_email ON medical_officers(email);
CREATE INDEX idx_health_records_student ON health_records(student_id);
CREATE INDEX idx_health_records_medical_officer ON health_records(medical_officer_id);
CREATE INDEX idx_health_records_date ON health_records(date);

-- Enable Row Level Security (RLS) for security
ALTER TABLE student_users ENABLE ROW LEVEL SECURITY;
ALTER TABLE medical_officers ENABLE ROW LEVEL SECURITY;
ALTER TABLE health_records ENABLE ROW LEVEL SECURITY;

-- Create policies for student_users (students can only see their own data)
CREATE POLICY "Students can view own profile" ON student_users
  FOR SELECT USING (auth.uid()::text = id::text);

-- Create policies for health_records
CREATE POLICY "Students can view own health records" ON health_records
  FOR SELECT USING (auth.uid()::text = student_id::text);

CREATE POLICY "Medical officers can view all health records" ON health_records
  FOR SELECT USING (true);  -- For now, allow all. Restrict based on your permissions

-- Note: Adjust these policies based on your actual authentication setup
-- You may need to use JWT claims or custom claims for row level security
