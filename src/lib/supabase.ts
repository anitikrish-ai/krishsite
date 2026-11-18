import { createClient, type SupabaseClient } from "@supabase/supabase-js";

/**
 * Supabase configuration only. Add your project URL and anon key in `.env`
 * (see `.env.example`), then import `supabase` anywhere you need it.
 * Never put a service_role key in frontend code, and keep Row Level Security on.
 */
const url = import.meta.env.VITE_SUPABASE_URL;
const anonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

export const isSupabaseConfigured = Boolean(url && anonKey);

export const supabase: SupabaseClient | null = isSupabaseConfigured
  ? createClient(url as string, anonKey as string, {
      auth: { persistSession: true, autoRefreshToken: true, detectSessionInUrl: true },
    })
  : null;
