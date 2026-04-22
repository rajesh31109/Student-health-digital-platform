import { createClient } from '@supabase/supabase-js';
import { env } from '../config.js';

const supabaseKey = env.SUPABASE_SERVICE_KEY || env.SUPABASE_KEY;
if (!env.SUPABASE_URL || !supabaseKey) {
  throw new Error('Missing Supabase configuration: SUPABASE_URL and SUPABASE_KEY or SUPABASE_SERVICE_KEY are required.');
}

export const supabase = createClient(env.SUPABASE_URL, supabaseKey);
