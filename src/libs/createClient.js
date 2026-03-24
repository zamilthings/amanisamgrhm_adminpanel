import { createClient } from '@supabase/supabase-js';

const apiUrl = import.meta.env.VITE_SUPABASE_API_URL;
const apiKey = import.meta.env.VITE_SUPABASE_API_KEY;

// export const supabase = createClient(apiUrl, apiKey);

// Configure client with proper headers for Unicode
export const supabase = createClient(apiUrl, apiKey, {
  auth: {
    persistSession: true,
    autoRefreshToken: true,
  },
  global: {
    headers: {
      'Content-Type': 'application/json',
      'Accept': 'application/json',
    },
  },
  db: {
    schema: 'public',
  },
})