import { createBrowserClient } from '@supabase/ssr'

let _client = null

export function getSupabase() {
  if (_client) return _client

  const url = process.env.NEXT_PUBLIC_SUPABASE_URL
  const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

  if (!url || !key || url === 'your_supabase_project_url') {
    throw new Error(
      '⚠️ Supabase kalitlari topilmadi!\n\n' +
      'expense-tracker papkasida .env.local fayl yarating:\n\n' +
      'NEXT_PUBLIC_SUPABASE_URL=https://xxxx.supabase.co\n' +
      'NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJ...\n\n' +
      'Kalitlarni supabase.com/dashboard → Settings → API dan oling.'
    )
  }

  _client = createBrowserClient(url, key)
  return _client
}

export const supabase = {
  get auth() { return getSupabase().auth },
  from: (...args) => getSupabase().from(...args),
}
