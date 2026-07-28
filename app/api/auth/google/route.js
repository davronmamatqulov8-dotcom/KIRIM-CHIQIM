import { NextResponse } from 'next/server'
import { createServerSupabase } from '@/lib/supabase-server'

// GET /api/auth/google — Google OAuth redirect
export async function GET(request) {
  try {
    const url = new URL(request.url)
    const origin = url.origin

    const supabase = createServerSupabase()
    const { data, error } = await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: {
        redirectTo: `${origin}/`,
        skipBrowserRedirect: true,
      }
    })

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 400 })
    }

    return NextResponse.redirect(data.url)
  } catch (err) {
    return NextResponse.json({ error: err.message }, { status: 500 })
  }
}
