import { createClient } from '@supabase/supabase-js'

// Server-side Supabase client — faqat API route'larda ishlatiladi
// Bu server-dan server-ga ulanish, ISP blok qilolmaydi
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

export function createServerSupabase(accessToken) {
  if (accessToken) {
    return createClient(supabaseUrl, supabaseAnonKey, {
      global: {
        headers: {
          Authorization: `Bearer ${accessToken}`
        }
      }
    })
  }
  return createClient(supabaseUrl, supabaseAnonKey)
}
