import { createClient } from '@supabase/supabase-js';
import { env } from '../config.js';

if (!env.SUPABASE_URL || !env.SUPABASE_KEY) {
  throw new Error('Missing Supabase configuration');
}

export const supabase = createClient(env.SUPABASE_URL, env.SUPABASE_KEY);
