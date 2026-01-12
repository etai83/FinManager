import { createClient } from '@supabase/supabase-js';

// Fallback for missing env vars to prevent immediate crash, though auth won't work without them.
const supabaseUrl = process.env.SUPABASE_URL || 'https://placeholder.supabase.co';
const supabaseKey = process.env.SUPABASE_ANON_KEY || 'placeholder-key';

export const supabase = createClient(supabaseUrl, supabaseKey);

export const isSupabaseConfigured = () => {
  return process.env.SUPABASE_URL && process.env.SUPABASE_ANON_KEY;
};
