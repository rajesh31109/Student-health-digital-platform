// Student Controller - Student-specific operations
import { Request, Response } from 'express';
import { supabase } from '../utils/supabase.js';
import { generateAuditLog } from '../utils/auditLog.js';

// =====================================================================
// GET STUDENT'S OWN PROFILE
// =====================================================================
export const getStudentProfile = async (req: Request, res: Response) => {
  try {
    if (!req.user || req.user.role !== 'student') {
      return res.status(403).json({ error: 'Unauthorized - Student access only' });
    }

    const { data: student, error } = await supabase
      .from('students')
      .select('*')
      .eq('id', req.user.userId)
      .single();

    if (error || !student) {
      return res.status(404).json({ error: 'Student profile not found' });
    }

    res.status(200).json({
      success: true,
      data: student,
    });
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
};

// =====================================================================
// GET STUDENT'S OWN HEALTH RECORDS
// =====================================================================
export const getStudentHealthRecords = async (req: Request, res: Response) => {
  try {
    if (!req.user || req.user.role !== 'student') {
      return res.status(403).json({ error: 'Unauthorized - Student access only' });
    }

    const { data: records, error } = await supabase
      .from('health_records')
      .select(`
        *,
        medical_officers (
          id,
          first_name,
          last_name,
          specialization,
          phc_name
        )
      `)
      .eq('student_id', req.user.userId)
      .order('consultation_date', { ascending: false });

    if (error) {
      return res.status(400).json({ error: error.message });
    }

    res.status(200).json({
      success: true,
      data: records,
      count: records?.length || 0,
    });
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
};

// =====================================================================
// GET SINGLE HEALTH RECORD (STUDENT'S OWN ONLY)
// =====================================================================
export const getStudentHealthRecord = async (req: Request, res: Response) => {
  try {
    if (!req.user || req.user.role !== 'student') {
      return res.status(403).json({ error: 'Unauthorized - Student access only' });
    }

    const { recordId } = req.params;

    const { data: record, error } = await supabase
      .from('health_records')
      .select(`
        *,
        medical_officers (
          id,
          first_name,
          last_name,
          specialization
        )
      `)
      .eq('id', recordId)
      .eq('student_id', req.user.userId)
      .single();

    if (error || !record) {
      return res.status(404).json({ error: 'Health record not found' });
    }

    res.status(200).json({
      success: true,
      data: record,
    });
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
};

// =====================================================================
// GET STUDENT HEALTH SUMMARY STATISTICS
// =====================================================================
export const getStudentHealthSummary = async (req: Request, res: Response) => {
  try {
    if (!req.user || req.user.role !== 'student') {
      return res.status(403).json({ error: 'Unauthorized - Student access only' });
    }

    // Get health records count
    const { data: records, error: recordsError } = await supabase
      .from('health_records')
      .select('id, consultation_date, consultation_type')
      .eq('student_id', req.user.userId);

    if (recordsError) {
      return res.status(400).json({ error: recordsError.message });
    }

    // Get visits count
    const { data: visits, error: visitsError } = await supabase
      .from('student_visits')
      .select('id, visit_date')
      .eq('student_id', req.user.userId);

    if (visitsError) {
      return res.status(400).json({ error: visitsError.message });
    }

    // Calculate statistics
    const totalConsultations = records?.length || 0;
    const lastConsultation = records && records.length > 0 
      ? records[0].consultation_date 
      : null;

    const consultationTypes = records
      ? records.reduce((acc: any, r: any) => {
          acc[r.consultation_type] = (acc[r.consultation_type] || 0) + 1;
          return acc;
        }, {})
      : {};

    res.status(200).json({
      success: true,
      data: {
        totalConsultations,
        lastConsultation,
        totalVisits: visits?.length || 0,
        consultationTypes,
      },
    });
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
};

// =====================================================================
// GET STUDENT NOTIFICATIONS
// =====================================================================
export const getStudentNotifications = async (req: Request, res: Response) => {
  try {
    if (!req.user || req.user.role !== 'student') {
      return res.status(403).json({ error: 'Unauthorized - Student access only' });
    }

    const { unread_only } = req.query;

    let query = supabase
      .from('notifications')
      .select('*')
      .eq('recipient_id', req.user.userId)
      .eq('recipient_type', 'student')
      .order('created_at', { ascending: false })
      .limit(50);

    if (unread_only === 'true') {
      query = query.eq('is_read', false);
    }

    const { data: notifications, error } = await query;

    if (error) {
      return res.status(400).json({ error: error.message });
    }

    res.status(200).json({
      success: true,
      data: notifications,
      count: notifications?.length || 0,
    });
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
};

// =====================================================================
// MARK NOTIFICATION AS READ
// =====================================================================
export const markNotificationAsRead = async (req: Request, res: Response) => {
  try {
    if (!req.user || req.user.role !== 'student') {
      return res.status(403).json({ error: 'Unauthorized - Student access only' });
    }

    const { notificationId } = req.params;

    const { data: notification, error } = await supabase
      .from('notifications')
      .update({
        is_read: true,
        read_at: new Date().toISOString(),
      })
      .eq('id', notificationId)
      .eq('recipient_id', req.user.userId)
      .select()
      .single();

    if (error || !notification) {
      return res.status(404).json({ error: 'Notification not found' });
    }

    res.status(200).json({
      success: true,
      message: 'Notification marked as read',
      data: notification,
    });
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
};

// =====================================================================
// GET STUDENT VISITS/ATTENDANCE
// =====================================================================
export const getStudentVisits = async (req: Request, res: Response) => {
  try {
    if (!req.user || req.user.role !== 'student') {
      return res.status(403).json({ error: 'Unauthorized - Student access only' });
    }

    const { data: visits, error } = await supabase
      .from('student_visits')
      .select(`
        *,
        medical_officers (
          first_name,
          last_name
        )
      `)
      .eq('student_id', req.user.userId)
      .order('visit_date', { ascending: false });

    if (error) {
      return res.status(400).json({ error: error.message });
    }

    res.status(200).json({
      success: true,
      data: visits,
      count: visits?.length || 0,
    });
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
};
