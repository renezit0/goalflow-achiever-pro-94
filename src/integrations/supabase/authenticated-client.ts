import { createClient, SupabaseClient } from '@supabase/supabase-js';
import type { Database } from './types';

const SUPABASE_URL = "https://zzqlghoefcmuevtkvxum.supabase.co";
const SUPABASE_PUBLISHABLE_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Inp6cWxnaG9lZmNtdWV2dGt2eHVtIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTY1MTg2NzcsImV4cCI6MjA3MjA5NDY3N30.0PPrF8sKk5ZvscOH0WdTkddwEu7wRIXbCZaxVly7tYQ";

// Create a function to get an authenticated client
export function getAuthenticatedSupabaseClient(userLogin?: string): SupabaseClient<Database> {
  const client = createClient<Database>(SUPABASE_URL, SUPABASE_PUBLISHABLE_KEY, {
    auth: {
      storage: localStorage,
      persistSession: true,
      autoRefreshToken: true,
    },
    global: {
      headers: userLogin ? {
        'Authorization': `Bearer ${createMockJWT(userLogin)}`
      } : {}
    }
  });
  
  return client;
}

// Create a mock JWT for RLS policies
function createMockJWT(userLogin: string): string {
  const header = {
    alg: 'HS256',
    typ: 'JWT'
  };
  
  const payload = {
    iss: 'supabase',
    ref: 'zzqlghoefcmuevtkvxum',
    role: 'authenticated',
    login: userLogin,
    iat: Math.floor(Date.now() / 1000),
    exp: Math.floor(Date.now() / 1000) + (24 * 60 * 60) // 24 hours
  };
  
  const headerEncoded = btoa(JSON.stringify(header));
  const payloadEncoded = btoa(JSON.stringify(payload));
  
  // Simple mock signature (in production this would be properly signed)
  const signature = btoa('mock-signature');
  
  return `${headerEncoded}.${payloadEncoded}.${signature}`;
}