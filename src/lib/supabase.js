import { createClient } from '@supabase/supabase-js';

const SUPABASE_URL = import.meta.env.VITE_SUPABASE_URL || 'https://hvyrfyhdverzzdhlliwc.supabase.co';
const SUPABASE_ANON_KEY = import.meta.env.VITE_SUPABASE_ANON_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imh2eXJmeWhkdmVyenpkaGxsaXdjIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzE4MzY1MjksImV4cCI6MjA4NzQxMjUyOX0.LI3OPru-eafRx-ubMM_JIAnANPDy4voVA8aINmmwUC0';

export const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY, {
  auth: {
    persistSession: false,
    autoRefreshToken: false
  }
});
