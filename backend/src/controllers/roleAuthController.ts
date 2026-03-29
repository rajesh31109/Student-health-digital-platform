// Role-based Authentication Controllers - Simplified for Frontend
import { Request, Response } from 'express';
import { z } from 'zod';
import { supabase } from '../utils/supabase.js';
import { comparePassword } from '../utils/password.js';
import { generateToken } from '../utils/jwt.js';

// =====================================================================
// STUDENT LOGIN - Using Unique Student ID (No Password)
// Frontend sends: { healthId: "TG-01-1968-0001" }
// =====================================================================

const studentLoginSchema = z.object({
  healthId: z.string().min(1, 'Health ID is required'),
});

export const loginStudent = async (req: Request, res: Response) => {
  try {
    const { healthId } = studentLoginSchema.parse(req.body);

    // Find student by unique ID
    const { data: student, error } = await supabase
      .from('students')
      .select('*')
      .eq('unique_student_id', healthId)
      .eq('is_active', true)
      .single();

    if (error || !student) {
      return res.status(401).json({
        success: false,
        message: 'Invalid Student ID. Please check your Health ID.',
      });
    }

    // Generate JWT token
    const token = generateToken(student.id, 'student', {
      healthId: student.unique_student_id,
    });

    res.status(200).json({
      success: true,
      message: 'Login successful',
      data: {
        token,
        healthId: student.unique_student_id,
        name: `${student.first_name} ${student.last_name}`,
      },
    });
  } catch (err: any) {
    if (err instanceof z.ZodError) {
      return res.status(400).json({
        success: false,
        message: err.errors[0].message,
      });
    }

    res.status(500).json({
      success: false,
      message: 'Login failed. Please try again.',
    });
  }
};

// =====================================================================
// MEDICAL OFFICER LOGIN - Email + Password
// =====================================================================

const moLoginSchema = z.object({
  email: z.string().email('Invalid email format').transform(e => e.toLowerCase()),
  password: z.string().min(6, 'Password must be at least 6 characters'),
});

export const loginMedicalOfficer = async (req: Request, res: Response) => {
  try {
    const { email, password } = moLoginSchema.parse(req.body);

    // Find medical officer
    const { data: mo, error } = await supabase
      .from('medical_officers')
      .select('*')
      .eq('email', email.toLowerCase())
      .eq('is_active', true)
      .single();

    if (error || !mo) {
      return res.status(401).json({
        success: false,
        message: 'Invalid email or password.',
      });
    }

    // Verify password
    const passwordMatch = await comparePassword(password, mo.password_hash);
    if (!passwordMatch) {
      return res.status(401).json({
        success: false,
        message: 'Invalid email or password.',
      });
    }

    // Generate JWT token
    const token = generateToken(mo.id, 'medical_officer', {
      phcId: mo.phc_code,
    });

    res.status(200).json({
      success: true,
      message: 'Login successful',
      data: {
        token,
        moId: mo.id,
        name: `${mo.first_name} ${mo.last_name}`,
        email: mo.email,
      },
    });
  } catch (err: any) {
    if (err instanceof z.ZodError) {
      return res.status(400).json({
        success: false,
        message: err.errors[0].message,
      });
    }

    res.status(500).json({
      success: false,
      message: 'Login failed. Please try again.',
    });
  }
};

// =====================================================================
// ADMIN LOGIN - Email + Password (DMHO)
// =====================================================================

const adminLoginSchema = z.object({
  email: z.string().email('Invalid email format').transform(e => e.toLowerCase()),
  password: z.string().min(6, 'Password must be at least 6 characters'),
});

export const loginAdmin = async (req: Request, res: Response) => {
  try {
    const { email, password } = adminLoginSchema.parse(req.body);

    // Find admin
    const { data: admin, error } = await supabase
      .from('admins')
      .select('*')
      .eq('email', email.toLowerCase())
      .single();

    if (error || !admin) {
      return res.status(401).json({
        success: false,
        message: 'Invalid email or password.',
      });
    }

    // Verify password
    const passwordMatch = await comparePassword(password, admin.password_hash);
    if (!passwordMatch) {
      return res.status(401).json({
        success: false,
        message: 'Invalid email or password.',
      });
    }

    // Generate JWT token
    const token = generateToken(admin.id, 'admin', {});

    res.status(200).json({
      success: true,
      message: 'Login successful',
      data: {
        token,
        adminId: admin.id,
        name: `${admin.first_name} ${admin.last_name}`,
        email: admin.email,
      },
    });
  } catch (err: any) {
    if (err instanceof z.ZodError) {
      return res.status(400).json({
        success: false,
        message: err.errors[0].message,
      });
    }

    res.status(500).json({
      success: false,
      message: 'Login failed. Please try again.',
    });
  }
};

// =====================================================================
// GET PROFILE - Works for all roles (requires JWT token)
// =====================================================================

export const getProfile = async (req: Request, res: Response) => {
  try {
    if (!req.user) {
      return res.status(401).json({
        success: false,
        message: 'Unauthorized',
      });
    }

    const { userId, role } = req.user;
    let tableName = '';

    if (role === 'student') {
      tableName = 'students';
    } else if (role === 'medical_officer') {
      tableName = 'medical_officers';
    } else if (role === 'admin') {
      tableName = 'admins';
    } else {
      return res.status(400).json({
        success: false,
        message: 'Invalid role',
      });
    }

    const { data: user, error } = await supabase
      .from(tableName)
      .select('*')
      .eq('id', userId)
      .single();

    if (error || !user) {
      return res.status(404).json({
        success: false,
        message: 'User not found',
      });
    }

    // Remove sensitive data
    const userCopy = { ...user };
    delete userCopy.password_hash;

    res.status(200).json({
      success: true,
      data: userCopy,
    });
  } catch (err: any) {
    res.status(500).json({
      success: false,
      message: 'Failed to fetch profile',
    });
  }
};

// =====================================================================
// LOGOUT - Revoke session (optional - frontend just deletes token)
// =====================================================================

export const logout = async (req: Request, res: Response) => {
  try {
    if (!req.user) {
      return res.status(401).json({
        success: false,
        message: 'Unauthorized',
      });
    }

    res.status(200).json({
      success: true,
      message: 'Logged out successfully',
    });
  } catch (err: any) {
    res.status(500).json({
      success: false,
      message: 'Logout failed',
    });
  }
};

// =====================================================================
// PUBLIC HOMEPAGE STATISTICS - No authentication required
// =====================================================================

export const getHomepageStatistics = async (req: Request, res: Response) => {
  try {
    // Count total active students
    const { count: totalStudents } = await supabase
      .from('students')
      .select('*', { count: 'exact', head: true })
      .eq('is_active', true);

    // Count total active medical officers (PHCs)
    const { count: totalPHCs } = await supabase
      .from('medical_officers')
      .select('*', { count: 'exact', head: true })
      .eq('is_active', true);

    // Count unique schools from students
    const { data: schoolsData } = await supabase
      .from('students')
      .select('school_name')
      .eq('is_active', true);

    const uniqueSchools = new Set(
      schoolsData?.map((s: any) => s.school_name).filter(Boolean) || []
    ).size;

    // Count total health records
    const { count: totalHealthRecords } = await supabase
      .from('health_records')
      .select('*', { count: 'exact', head: true });

    res.status(200).json({
      success: true,
      data: {
        totalStudents: totalStudents || 0,
        totalSchools: uniqueSchools || 0,
        totalPHCs: totalPHCs || 0,
        totalHealthRecords: totalHealthRecords || 0,
      },
    });
  } catch (err: any) {
    console.error('Error fetching homepage statistics:', err);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch statistics',
    });
  }
};
