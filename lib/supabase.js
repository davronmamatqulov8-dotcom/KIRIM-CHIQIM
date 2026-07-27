import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://nfvxjgrodcohsrgfnmtz.supabase.co'
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || 'sb_publishable_VMvSalX2eCJEyThw04OQBw_GRBVy-Hp'

export const supabase = createClient(supabaseUrl, supabaseAnonKey)
