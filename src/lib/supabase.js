import { createClient } from '@supabase/supabase-js';

const SUPABASE_URL = import.meta.env.VITE_SUPABASE_URL || 'https://wxvrycpdwhsevlgbuxip.supabase.co';
const SUPABASE_ANON_KEY = import.meta.env.VITE_SUPABASE_ANON_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Ind4dnJ5Y3Bkd2hzZXZsZ2J1eGlwIiwicm9sZSI6ImFub24iLCJpYXQiOjE3OTA3Nzc5NTMsImV4cCI6MjEwNjM1Mzk1M30.Okef_fxfGHUh7KLEuPY_eWvRR_IQpTfEfJ3fwQrZRPc';

export const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY, {
  auth: {
    persistSession: false,
    autoRefreshToken: false
  }
});
