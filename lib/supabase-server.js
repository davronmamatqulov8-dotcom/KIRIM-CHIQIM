import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://nfvxjgrodcohsrgfnmtz.supabase.co'
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im5mdnhqZ3JvZGNvaHNyZ2ZubXR6Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODUxNzE5MDAsImV4cCI6MjEwMDc0NzkwMH0.d_uuEMqT49lHKQzpguTalPL_6ZM6onx4ZLXGPzdrgOc'

export function createServerSupabase(accessToken) {
  if (accessToken) {
    return createClient(supabaseUrl, supabaseAnonKey, {
      auth: {
        persistSession: false,
        autoRefreshToken: false,
      },
      global: {
        headers: {
          Authorization: `Bearer ${accessToken}`
        }
      }
    })
  }
  return createClient(supabaseUrl, supabaseAnonKey, {
    auth: {
      persistSession: false,
      autoRefreshToken: false,
    }
  })
}
