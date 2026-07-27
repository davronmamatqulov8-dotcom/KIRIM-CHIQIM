import { createClient } from '@supabase/supabase-js'

// Brauzerda Netlify proxy orqali (supabase.co bloklanganda ham ishlaydi)
// Serverdagi build paytida to'g'ridan Supabase'ga
const getSupabaseUrl = () => {
  if (typeof window !== 'undefined') {
    // Brauzer: Netlify proxy ishlatamiz
    return `${window.location.origin}/api/supabase`
  }
  // Server (build time): to'g'ridan
  return process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://nfvxjgrodcohsrgfnmtz.supabase.co'
}

const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || 'sb_publishable_VMvSalX2eCJEyThw04OQBw_GRBVy-Hp'

export const supabase = createClient(getSupabaseUrl(), supabaseAnonKey)
