export interface StudentUser {
  id: string;
  email: string;
  password_hash: string;
  first_name: string;
  last_name: string;
  roll_number?: string;
  department?: string;
  phone?: string;
  created_at: string;
  updated_at: string;
}

export interface MedicalOfficer {
  id: string;
  email: string;
  password_hash: string;
  first_name: string;
  last_name: string;
  license_number?: string;
  specialization?: string;
  created_at: string;
  updated_at: string;
}

export interface HealthRecord {
  id: string;
  student_id: string;
  record_type: string;
  description: string;
  date: string;
  medical_officer_id?: string;
  created_at: string;
  updated_at: string;
}

export interface AuthResponse {
  success: boolean;
  message: string;
  data?: {
    user: Partial<StudentUser | MedicalOfficer>;
    token: string;
  };
  error?: string;
}
