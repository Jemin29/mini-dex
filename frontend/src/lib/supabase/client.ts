import { createBrowserClient } from '@supabase/ssr'

export function createClient() {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
  const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
  
  // If env vars are missing (dev without Supabase connection), return a no-op mock
  if (!supabaseUrl || !supabaseAnonKey) {
    console.warn('[v0] Supabase environment variables not configured - using mock client')
    return {
      auth: {
        getSession: async () => ({ data: { session: null }, error: null }),
        getUser: async () => ({ data: { user: null }, error: null }),
        signInWithPassword: async () => ({ data: null, error: { message: 'Not initialized' } }),
        signUp: async () => ({ data: null, error: { message: 'Not initialized' } }),
        signOut: async () => ({ error: null }),
        resetPasswordForEmail: async () => ({ data: null, error: { message: 'Not initialized' } }),
        updateUser: async () => ({ data: null, error: { message: 'Not initialized' } }),
        onAuthStateChange: () => ({ data: { subscription: { unsubscribe: () => {} } } }),
      },
      from: () => ({
        select: () => ({ eq: () => ({ single: async () => ({ data: null, error: null }) }) }),
        update: () => ({ eq: async () => ({ data: null, error: null }) }),
      }),
    } as any
  }
  
  return createBrowserClient(supabaseUrl, supabaseAnonKey)
}
