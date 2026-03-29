import { Request, Response } from 'express';
import { supabase } from '../utils/supabase.js';

export const getHealthRecords = async (req: Request, res: Response) => {
  try {
    if (!req.user) {
      return res.status(401).json({ error: 'Unauthorized' });
    }

    const studentId = req.query.studentId as string || req.user.userId;

    const { data: records, error } = await supabase
      .from('health_records')
      .select('*')
      .eq('student_id', studentId)
      .order('created_at', { ascending: false });

    if (error) {
      return res.status(400).json({ error: error.message });
    }

    res.status(200).json({ success: true, data: records });
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
};

export const createHealthRecord = async (req: Request, res: Response) => {
  try {
    if (!req.user) {
      return res.status(401).json({ error: 'Unauthorized' });
    }

    const { studentId, recordType, description, date } = req.body;

    if (!recordType || !description) {
      return res.status(400).json({ error: 'Missing required fields' });
    }

    const { data: record, error } = await supabase
      .from('health_records')
      .insert([
        {
          student_id: studentId || req.user.userId,
          record_type: recordType,
          description,
          date: date || new Date().toISOString(),
          medical_officer_id: req.user.role === 'medical_officer' ? req.user.userId : null,
        },
      ])
      .select()
      .single();

    if (error) {
      return res.status(400).json({ error: error.message });
    }

    res.status(201).json({ success: true, data: record });
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
};

export const updateHealthRecord = async (req: Request, res: Response) => {
  try {
    if (!req.user) {
      return res.status(401).json({ error: 'Unauthorized' });
    }

    const { id } = req.params;
    const updateData = req.body;

    const { data: record, error } = await supabase
      .from('health_records')
      .update(updateData)
      .eq('id', id)
      .select()
      .single();

    if (error) {
      return res.status(400).json({ error: error.message });
    }

    res.status(200).json({ success: true, data: record });
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
};

export const deleteHealthRecord = async (req: Request, res: Response) => {
  try {
    if (!req.user) {
      return res.status(401).json({ error: 'Unauthorized' });
    }

    const { id } = req.params;

    const { error } = await supabase.from('health_records').delete().eq('id', id);

    if (error) {
      return res.status(400).json({ error: error.message });
    }

    res.status(200).json({ success: true, message: 'Record deleted' });
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
};
