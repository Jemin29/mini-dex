import { createBrowserClient } from '@supabase/ssr'

export function createClient() {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
  const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
  
  // During SSR build prerender, these may not be available
  // Return a no-op client that will be replaced on the client side
  if (!supabaseUrl || !supabaseAnonKey) {
    if (typeof window === 'undefined') {
      // Server-side during build - return a mock that won't be used
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
    throw new Error('Supabase environment variables are not configured')
  }
  
  return createBrowserClient(supabaseUrl, supabaseAnonKey)
}
