// Admin Controller (DMHO) - Administrative operations
import { Request, Response } from 'express';
import { z } from 'zod';
import { supabase } from '../utils/supabase.js';
import { hashPassword } from '../utils/password.js';
import { generateAuditLog } from '../utils/auditLog.js';

// =====================================================================
// GET ALL STUDENTS (ADMIN VIEW)
// =====================================================================
export const getAllStudents = async (req: Request, res: Response) => {
  try {
    if (!req.user || req.user.role !== 'admin') {
      return res.status(403).json({ error: 'Unauthorized - Admin access only' });
    }

    const { search, phc_code, department, is_active } = req.query;
    const limit = parseInt(req.query.limit as string) || 100;
    const offset = parseInt(req.query.offset as string) || 0;

    let query = supabase
      .from('students')
      .select(
        `
        *,
        health_records (count),
        medical_officers (first_name, last_name)
      `,
        { count: 'exact' }
      );

    // Apply filters
    if (phc_code) {
      query = query.eq('phc_code', phc_code);
    }

    if (department) {
      query = query.eq('department', department);
    }

    if (is_active !== undefined) {
      query = query.eq('is_active', is_active === 'true');
    }

    if (search) {
      query = query.or(
        `unique_student_id.ilike.%${search}%,first_name.ilike.%${search}%,roll_number.ilike.%${search}%`
      );
    }

    const { data: students, error, count } = await query
      .range(offset, offset + limit - 1)
      .order('created_at', { ascending: false });

    if (error) {
      return res.status(400).json({ error: error.message });
    }

    res.status(200).json({
      success: true,
      data: students,
      count,
      limit,
      offset,
    });
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
};

// =====================================================================
// GET ALL HEALTH RECORDS (ADMIN VIEW)
// =====================================================================
export const getAllHealthRecords = async (req: Request, res: Response) => {
  try {
    if (!req.user || req.user.role !== 'admin') {
      return res.status(403).json({ error: 'Unauthorized - Admin access only' });
    }

    const { student_id, phc_code, start_date, end_date } = req.query;
    const limit = parseInt(req.query.limit as string) || 100;
    const offset = parseInt(req.query.offset as string) || 0;

    let query = supabase
      .from('health_records')
      .select(
        `
        *,
        students (unique_student_id, first_name, last_name, phc_code),
        medical_officers (first_name, last_name)
      `,
        { count: 'exact' }
      );

    // Apply filters
    if (student_id) {
      query = query.eq('student_id', student_id);
    }

    if (phc_code) {
      // Filter by student's PHC
      query = query.in('students.phc_code', [phc_code]);
    }

    if (start_date) {
      query = query.gte('consultation_date', start_date);
    }

    if (end_date) {
      query = query.lte('consultation_date', end_date);
    }

    const { data: records, error, count } = await query
      .range(offset, offset + limit - 1)
      .order('consultation_date', { ascending: false });

    if (error) {
      return res.status(400).json({ error: error.message });
    }

    res.status(200).json({
      success: true,
      data: records,
      count,
      limit,
      offset,
    });
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
};

// =====================================================================
// GET ALL MEDICAL OFFICERS
// =====================================================================
export const getAllMedicalOfficers = async (req: Request, res: Response) => {
  try {
    if (!req.user || req.user.role !== 'admin') {
      return res.status(403).json({ error: 'Unauthorized - Admin access only' });
    }

    const { phc_code, is_active } = req.query;

    let query = supabase
      .from('medical_officers')
      .select(
        `
        id,
        first_name,
        last_name,
        email,
        license_number,
        specialization,
        phc_code,
        phc_name,
        is_active,
        created_at
      `,
        { count: 'exact' }
      );

    if (phc_code) {
      query = query.eq('phc_code', phc_code);
    }

    if (is_active !== undefined) {
      query = query.eq('is_active', is_active === 'true');
    }

    const { data: officers, error, count } = await query.order('created_at', {
      ascending: false,
    });

    if (error) {
      return res.status(400).json({ error: error.message });
    }

    res.status(200).json({
      success: true,
      data: officers,
      count,
    });
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
};

// =====================================================================
// CREATE MEDICAL OFFICER (ADMIN ONLY)
// =====================================================================

const createMOSchema = z.object({
  first_name: z.string().min(2),
  last_name: z.string().min(2),
  email: z.string().email(),
  password: z.string().min(6),
  license_number: z.string(),
  specialization: z.string(),
  phc_code: z.string(),
  phc_name: z.string(),
});

export const createMedicalOfficer = async (req: Request, res: Response) => {
  try {
    if (!req.user || req.user.role !== 'admin') {
      return res.status(403).json({ error: 'Unauthorized - Admin access only' });
    }

    const validated = createMOSchema.parse(req.body);

    // Check if email already exists
    const { data: existingMO } = await supabase
      .from('medical_officers')
      .select('id')
      .eq('email', validated.email)
      .single();

    if (existingMO) {
      return res.status(409).json({ error: 'Email already registered' });
    }

    // Hash password
    const passwordHash = await hashPassword(validated.password);

    // Create medical officer
    const { data: mo, error } = await supabase
      .from('medical_officers')
      .insert([
        {
          first_name: validated.first_name,
          last_name: validated.last_name,
          email: validated.email,
          password_hash: passwordHash,
          license_number: validated.license_number,
          specialization: validated.specialization,
          phc_code: validated.phc_code,
          phc_name: validated.phc_name,
        },
      ])
      .select()
      .single();

    if (error) {
      return res.status(400).json({ error: error.message });
    }

    // Log the action
    await generateAuditLog(supabase, {
      user_id: req.user.userId,
      user_role: 'admin',
      action: 'create_medical_officer',
      table_name: 'medical_officers',
      record_id: mo.id,
    });

    // Remove password from response
    const { password_hash, ...moWithoutPassword } = mo;

    res.status(201).json({
      success: true,
      message: 'Medical officer created successfully',
      data: moWithoutPassword,
    });
  } catch (err: any) {
    if (err instanceof z.ZodError) {
      return res.status(400).json({
        success: false,
        error: 'Validation error',
        details: err.errors,
      });
    }

    res.status(500).json({ error: err.message });
  }
};

// =====================================================================
// GET DASHBOARD STATISTICS
// =====================================================================
export const getDashboardStatistics = async (req: Request, res: Response) => {
  try {
    if (!req.user || req.user.role !== 'admin') {
      return res.status(403).json({ error: 'Unauthorized - Admin access only' });
    }

    // Total students
    const { data: allStudents, error: studentsError } = await supabase
      .from('students')
      .select('id', { count: 'exact' })
      .eq('is_active', true);

    // Total medical officers
    const { data: allMOs, error: mosError } = await supabase
      .from('medical_officers')
      .select('id', { count: 'exact' })
      .eq('is_active', true);

    // Total health records
    const { data: allRecords, error: recordsError } = await supabase
      .from('health_records')
      .select('id', { count: 'exact' });

    // Students with consultations this month
    const thisMonthStart = new Date(new Date().getFullYear(), new Date().getMonth(), 1);
    const { data: thisMonthRecords } = await supabase
      .from('health_records')
      .select('student_id', { count: 'exact' })
      .gte('consultation_date', thisMonthStart.toISOString());

    // PHC-wise statistics
    const { data: phcStats } = await supabase
      .from('phc_student_statistics')
      .select('*');

    // Top consultation types
    const { data: recordsData } = await supabase
      .from('health_records')
      .select('consultation_type');

    const consultationTypes: any = {};
    recordsData?.forEach((r: any) => {
      if (r.consultation_type) {
        consultationTypes[r.consultation_type] = (consultationTypes[r.consultation_type] || 0) + 1;
      }
    });

    res.status(200).json({
      success: true,
      data: {
        total_students: allStudents?.length || 0,
        total_medical_officers: allMOs?.length || 0,
        total_health_records: allRecords?.length || 0,
        consultations_this_month: thisMonthRecords?.length || 0,
        phc_statistics: phcStats,
        consultation_types: consultationTypes,
      },
    });
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
};

// =====================================================================
// GET AUDIT LOGS
// =====================================================================
export const getAuditLogs = async (req: Request, res: Response) => {
  try {
    if (!req.user || req.user.role !== 'admin') {
      return res.status(403).json({ error: 'Unauthorized - Admin access only' });
    }

    const { user_role, action, start_date, end_date } = req.query;
    const limit = parseInt(req.query.limit as string) || 100;
    const offset = parseInt(req.query.offset as string) || 0;

    let query = supabase
      .from('audit_logs')
      .select('*', { count: 'exact' });

    if (user_role) {
      query = query.eq('user_role', user_role);
    }

    if (action) {
      query = query.eq('action', action);
    }

    if (start_date) {
      query = query.gte('created_at', start_date);
    }

    if (end_date) {
      query = query.lte('created_at', end_date);
    }

    const { data: logs, error, count } = await query
      .range(offset, offset + limit - 1)
      .order('created_at', { ascending: false });

    if (error) {
      return res.status(400).json({ error: error.message });
    }

    res.status(200).json({
      success: true,
      data: logs,
      count,
      limit,
      offset,
    });
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
};

// =====================================================================
// EXPORT REPORT (CSV/PDF)
// =====================================================================
export const generateReport = async (req: Request, res: Response) => {
  try {
    if (!req.user || req.user.role !== 'admin') {
      return res.status(403).json({ error: 'Unauthorized - Admin access only' });
    }

    const { report_type, filters, format } = req.body;

    // Store report request
    const { data: report, error } = await supabase
      .from('reports')
      .insert([
        {
          generated_by: req.user.userId,
          report_type,
          filters,
          status: 'processing',
        },
      ])
      .select()
      .single();

    if (error) {
      return res.status(400).json({ error: error.message });
    }

    // Log the action
    await generateAuditLog(supabase, {
      user_id: req.user.userId,
      user_role: 'admin',
      action: 'generate_report',
      table_name: 'reports',
      record_id: report.id,
    });

    res.status(200).json({
      success: true,
      message: 'Report generation started',
      data: report,
    });
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
};

// =====================================================================
// ACTIVATE/DEACTIVATE MEDICAL OFFICER
// =====================================================================
export const toggleMOStatus = async (req: Request, res: Response) => {
  try {
    if (!req.user || req.user.role !== 'admin') {
      return res.status(403).json({ error: 'Unauthorized - Admin access only' });
    }

    const { moId } = req.params;
    const { is_active } = req.body;

    const { data: mo, error } = await supabase
      .from('medical_officers')
      .update({ is_active })
      .eq('id', moId)
      .select()
      .single();

    if (error || !mo) {
      return res.status(404).json({ error: 'Medical officer not found' });
    }

    // Log the action
    await generateAuditLog(supabase, {
      user_id: req.user.userId,
      user_role: 'admin',
      action: is_active ? 'activate_medical_officer' : 'deactivate_medical_officer',
      table_name: 'medical_officers',
      record_id: moId,
    });

    res.status(200).json({
      success: true,
      message: `Medical officer ${is_active ? 'activated' : 'deactivated'}`,
      data: mo,
    });
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
};

// =====================================================================
// ACTIVATE/DEACTIVATE STUDENT
// =====================================================================
export const toggleStudentStatus = async (req: Request, res: Response) => {
  try {
    if (!req.user || req.user.role !== 'admin') {
      return res.status(403).json({ error: 'Unauthorized - Admin access only' });
    }

    const { studentId } = req.params;
    const { is_active } = req.body;

    const { data: student, error } = await supabase
      .from('students')
      .update({ is_active })
      .eq('id', studentId)
      .select()
      .single();

    if (error || !student) {
      return res.status(404).json({ error: 'Student not found' });
    }

    res.status(200).json({
      success: true,
      message: `Student ${is_active ? 'activated' : 'deactivated'}`,
      data: student,
    });
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
};
