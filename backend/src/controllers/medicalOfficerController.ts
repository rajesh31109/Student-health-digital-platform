// Medical Officer Controller
import { Request, Response } from 'express';
import { z } from 'zod';
import { supabase } from '../utils/supabase.js';
import { generateStudentID } from '../utils/studentID.js';
import { hashPassword } from '../utils/password.js';
import { generateAuditLog } from '../utils/auditLog.js';

// =====================================================================
// GET ALL STUDENTS AT MEDICAL OFFICER'S PHC
// =====================================================================
export const getAllStudentsAtPHC = async (req: Request, res: Response) => {
  try {
    if (!req.user || req.user.role !== 'medical_officer') {
      return res.status(403).json({ error: 'Unauthorized - Medical Officer access only' });
    }

    const { phc_code } = req.user;
    const { search, department, is_active } = req.query;

    let query = supabase
      .from('students')
      .select(
        `
        *,
        health_records (count)
      `,
        { count: 'exact' }
      )
      .eq('phc_code', phc_code);

    // Apply filters
    if (is_active !== undefined) {
      query = query.eq('is_active', is_active === 'true');
    }

    if (department) {
      query = query.eq('department', department);
    }

    if (search) {
      query = query.or(
        `first_name.ilike.%${search}%,last_name.ilike.%${search}%,unique_student_id.ilike.%${search}%`
      );
    }

    const { data: students, error, count } = await query.order('created_at', {
      ascending: false,
    });

    if (error) {
      return res.status(400).json({ error: error.message });
    }

    res.status(200).json({
      success: true,
      data: students,
      count,
    });
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
};

// =====================================================================
// CREATE HEALTH RECORD FOR STUDENT
// =====================================================================

const createHealthRecordSchema = z.object({
  student_id: z.string().uuid(),
  consultation_type: z.string(),
  symptoms: z.string().optional(),
  diagnosis: z.string().optional(),
  description: z.string(),
  prescription: z.string().optional(),
  medications: z.array(z.object({
    name: z.string(),
    dosage: z.string(),
    duration: z.string(),
  })).optional(),
  lab_tests: z.array(z.object({
    test_name: z.string(),
    result: z.string(),
  })).optional(),
  follow_up_date: z.string().datetime().optional(),
  follow_up_notes: z.string().optional(),
});

export const createHealthRecord = async (req: Request, res: Response) => {
  try {
    if (!req.user || req.user.role !== 'medical_officer') {
      return res.status(403).json({ error: 'Unauthorized - Medical Officer access only' });
    }

    const validated = createHealthRecordSchema.parse(req.body);

    const { data: record, error } = await supabase
      .from('health_records')
      .insert([
        {
          student_id: validated.student_id,
          medical_officer_id: req.user.userId,
          consultation_type: validated.consultation_type,
          consultation_date: new Date().toISOString(),
          symptoms: validated.symptoms,
          diagnosis: validated.diagnosis,
          description: validated.description,
          prescription: validated.prescription,
          medications: validated.medications,
          lab_tests: validated.lab_tests,
          follow_up_date: validated.follow_up_date,
          follow_up_notes: validated.follow_up_notes,
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
      user_role: 'medical_officer',
      action: 'create_health_record',
      table_name: 'health_records',
      record_id: record.id,
    });

    // Create notification for student
    await supabase.from('notifications').insert([
      {
        recipient_id: validated.student_id,
        recipient_type: 'student',
        title: 'New Health Record',
        message: `New health record created: ${validated.consultation_type}`,
        notification_type: 'health_record',
        related_record_id: record.id,
      },
    ]);

    res.status(201).json({
      success: true,
      message: 'Health record created successfully',
      data: record,
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
// UPDATE HEALTH RECORD
// =====================================================================
export const updateHealthRecord = async (req: Request, res: Response) => {
  try {
    if (!req.user || req.user.role !== 'medical_officer') {
      return res.status(403).json({ error: 'Unauthorized - Medical Officer access only' });
    }

    const { recordId } = req.params;

    // Check if this MO created the record
    const { data: record, error: fetchError } = await supabase
      .from('health_records')
      .select('*')
      .eq('id', recordId)
      .eq('medical_officer_id', req.user.userId)
      .single();

    if (fetchError || !record) {
      return res.status(403).json({ error: 'You do not have permission to update this record' });
    }

    // Update the record
    const { data: updatedRecord, error: updateError } = await supabase
      .from('health_records')
      .update(req.body)
      .eq('id', recordId)
      .select()
      .single();

    if (updateError) {
      return res.status(400).json({ error: updateError.message });
    }

    // Log the action
    await generateAuditLog(supabase, {
      user_id: req.user.userId,
      user_role: 'medical_officer',
      action: 'update_health_record',
      table_name: 'health_records',
      record_id: recordId,
      changes: req.body,
    });

    res.status(200).json({
      success: true,
      message: 'Health record updated successfully',
      data: updatedRecord,
    });
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
};

// =====================================================================
// REGISTER SINGLE STUDENT
// =====================================================================

const registerStudentSchema = z.object({
  first_name: z.string().min(2),
  last_name: z.string().min(2),
  email: z.string().email().optional(),
  phone: z.string().optional(),
  roll_number: z.string(),
  department: z.string(),
  date_of_birth: z.string().optional(),
  address: z.string().optional(),
  parent_name: z.string().optional(),
  parent_phone: z.string().optional(),
});

export const registerStudent = async (req: Request, res: Response) => {
  try {
    if (!req.user || req.user.role !== 'medical_officer') {
      return res.status(403).json({ error: 'Unauthorized - Medical Officer access only' });
    }

    const validated = registerStudentSchema.parse(req.body);
    
    // Get medical officer's PHC info
    const { data: mo, error: moError } = await supabase
      .from('medical_officers')
      .select('phc_code, phc_name, id')
      .eq('id', req.user.userId)
      .single();

    if (moError || !mo) {
      return res.status(400).json({ error: 'Medical officer not found' });
    }

    // Generate unique student ID (TG-01-1968-XXXX)
    const uniqueStudentId = await generateStudentID(supabase, {
      stateCode: 'TG',
      districtCode: '01',
      schoolCode: '1968',
    });

    // Check if roll number already exists
    const { data: existingStudent } = await supabase
      .from('students')
      .select('id')
      .eq('roll_number', validated.roll_number)
      .single();

    if (existingStudent) {
      return res.status(409).json({ error: 'Student with this roll number already exists' });
    }

    // Create student record
    const { data: student, error } = await supabase
      .from('students')
      .insert([
        {
          unique_student_id: uniqueStudentId,
          first_name: validated.first_name,
          last_name: validated.last_name,
          email: validated.email,
          phone: validated.phone,
          roll_number: validated.roll_number,
          department: validated.department,
          date_of_birth: validated.date_of_birth,
          address: validated.address,
          parent_name: validated.parent_name,
          parent_phone: validated.parent_phone,
          phc_code: mo.phc_code,
          phc_name: mo.phc_name,
          school_code: '1968',
          district_code: '01',
          state_code: 'TG',
          registered_by: req.user.userId,
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
      user_role: 'medical_officer',
      action: 'register_student',
      table_name: 'students',
      record_id: student.id,
    });

    res.status(201).json({
      success: true,
      message: 'Student registered successfully',
      data: {
        ...student,
        unique_student_id: uniqueStudentId,
      },
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
// BULK REGISTER STUDENTS (CSV Upload)
// =====================================================================
export const bulkRegisterStudents = async (req: Request, res: Response) => {
  try {
    if (!req.user || req.user.role !== 'medical_officer') {
      return res.status(403).json({ error: 'Unauthorized - Medical Officer access only' });
    }

    const { students: studentsData } = req.body;

    if (!Array.isArray(studentsData) || studentsData.length === 0) {
      return res.status(400).json({ error: 'No student data provided' });
    }

    // Get medical officer's PHC info
    const { data: mo } = await supabase
      .from('medical_officers')
      .select('phc_code, phc_name')
      .eq('id', req.user.userId)
      .single();

    if (!mo) {
      return res.status(400).json({ error: 'Medical officer not found' });
    }

    const createdStudents = [];
    const errors = [];

    for (let i = 0; i < studentsData.length; i++) {
      try {
        const s = studentsData[i];
        
        // Generate unique student ID
        const uniqueStudentId = await generateStudentID(supabase, {
          stateCode: 'TG',
          districtCode: '01',
          schoolCode: '1968',
        });

        const { data: student, error } = await supabase
          .from('students')
          .insert([
            {
              unique_student_id: uniqueStudentId,
              first_name: s.first_name,
              last_name: s.last_name,
              email: s.email,
              roll_number: s.roll_number,
              department: s.department,
              date_of_birth: s.date_of_birth,
              phc_code: mo.phc_code,
              phc_name: mo.phc_name,
              school_code: '1968',
              district_code: '01',
              state_code: 'TG',
              registered_by: req.user.userId,
            },
          ])
          .select()
          .single();

        if (error) {
          errors.push({ row: i + 1, error: error.message });
        } else {
          createdStudents.push(student);
        }
      } catch (err: any) {
        errors.push({ row: i + 1, error: err.message });
      }
    }

    // Log bulk action
    await generateAuditLog(supabase, {
      user_id: req.user.userId,
      user_role: 'medical_officer',
      action: 'bulk_register_students',
      table_name: 'students',
      changes: { total: studentsData.length, created: createdStudents.length, failed: errors.length },
    });

    res.status(200).json({
      success: true,
      message: `Registered ${createdStudents.length} students`,
      data: {
        created: createdStudents.length,
        failed: errors.length,
        students: createdStudents,
        errors,
      },
    });
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
};

// =====================================================================
// GET MEDICAL OFFICER'S WORKLOAD STATISTICS
// =====================================================================
export const getMOStatistics = async (req: Request, res: Response) => {
  try {
    if (!req.user || req.user.role !== 'medical_officer') {
      return res.status(403).json({ error: 'Unauthorized - Medical Officer access only' });
    }

    const { phc_code } = req.user;

    // Total students at PHC
    const { data: allStudents } = await supabase
      .from('students')
      .select('id', { count: 'exact' })
      .eq('phc_code', phc_code)
      .eq('is_active', true);

    // Checkups today
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const { data: todayRecords } = await supabase
      .from('health_records')
      .select('id', { count: 'exact' })
      .eq('medical_officer_id', req.user.userId)
      .gte('consultation_date', today.toISOString());

    // Pending checkups (no report yet)
    const { data: pendingCheckups } = await supabase
      .from('health_records')
      .select('id', { count: 'exact' })
      .eq('medical_officer_id', req.user.userId)
      .is('report_generated', false);

    // Reports generated this month
    const monthStart = new Date(today.getFullYear(), today.getMonth(), 1);
    const { data: reportsGenerated } = await supabase
      .from('health_records')
      .select('id', { count: 'exact' })
      .eq('medical_officer_id', req.user.userId)
      .eq('report_generated', true)
      .gte('created_at', monthStart.toISOString());

    res.status(200).json({
      success: true,
      data: {
        totalStudents: allStudents?.length || 0,
        checkupsToday: todayRecords?.length || 0,
        pendingCheckups: pendingCheckups?.length || 0,
        reportsGenerated: reportsGenerated?.length || 0,
      },
    });
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
};
