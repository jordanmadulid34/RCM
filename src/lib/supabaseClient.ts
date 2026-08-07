import { createClient } from '@supabase/supabase-js';

// Read Supabase environment variables safely
const rawUrl = (import.meta as any).env?.VITE_SUPABASE_URL || (typeof process !== 'undefined' ? process.env.VITE_SUPABASE_URL : '') || '';
const rawKey = (import.meta as any).env?.VITE_SUPABASE_ANON_KEY || (typeof process !== 'undefined' ? process.env.VITE_SUPABASE_ANON_KEY : '') || '';

export const isSupabaseConfigured = Boolean(rawUrl && rawKey);

// Provide valid fallback URL and key so createClient does not crash the app when env vars are missing
const supabaseUrl = rawUrl || 'https://placeholder.supabase.co';
const supabaseAnonKey = rawKey || 'placeholder-anon-key';

if (!isSupabaseConfigured) {
  console.warn('Supabase URL or Anon Key is missing in environment configuration. Using placeholder client.');
}

// Single client-side Supabase instance using anon public key
export const supabase = createClient(supabaseUrl, supabaseAnonKey);

