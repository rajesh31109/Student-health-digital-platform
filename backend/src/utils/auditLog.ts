// Audit Logging Utility
import { SupabaseClient } from '@supabase/supabase-js';

interface AuditLogPayload {
  user_id: string | null;
  user_role: string;
  action: string;
  table_name?: string;
  record_id?: string;
  changes?: Record<string, any>;
  ip_address?: string;
  user_agent?: string;
}

export const generateAuditLog = async (
  supabase: SupabaseClient,
  payload: AuditLogPayload
): Promise<void> => {
  try {
    const { error } = await supabase.from('audit_logs').insert([
      {
        user_id: payload.user_id,
        user_role: payload.user_role,
        action: payload.action,
        table_name: payload.table_name,
        record_id: payload.record_id,
        changes: payload.changes,
        ip_address: payload.ip_address,
        user_agent: payload.user_agent,
      },
    ]);

    if (error) {
      console.error('Failed to create audit log:', error);
    }
  } catch (err) {
    console.error('Error creating audit log:', err);
    // Don't throw - just log the error
  }
};

// Get audit logs for a specific user
export const getUserAuditLogs = async (
  supabase: SupabaseClient,
  userId: string,
  limit: number = 50
) => {
  const { data, error } = await supabase
    .from('audit_logs')
    .select('*')
    .eq('user_id', userId)
    .order('created_at', { ascending: false })
    .limit(limit);

  if (error) {
    throw error;
  }

  return data;
};

// Get audit logs for a specific action
export const getActionAuditLogs = async (
  supabase: SupabaseClient,
  action: string,
  limit: number = 50
) => {
  const { data, error } = await supabase
    .from('audit_logs')
    .select('*')
    .eq('action', action)
    .order('created_at', { ascending: false })
    .limit(limit);

  if (error) {
    throw error;
  }

  return data;
};
