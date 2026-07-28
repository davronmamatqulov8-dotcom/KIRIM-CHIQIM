import { NextResponse } from 'next/server'
import { createServerSupabase } from '@/lib/supabase-server'

// GET /api/auth/callback — Google OAuth callback
export async function GET(request) {
  try {
    const url = new URL(request.url)
    const code = url.searchParams.get('code')

    if (!code) {
      // Token fragmentli URL bo'lsa (hash-based), client sahifaga redirect
      return NextResponse.redirect(`${url.origin}/auth?error=no_code`)
    }

    const supabase = createServerSupabase()
    const { data, error } = await supabase.auth.exchangeCodeForSession(code)

    if (error) {
      return NextResponse.redirect(`${url.origin}/auth?error=${encodeURIComponent(error.message)}`)
    }

    // Sessionni query param sifatida uzatamiz (client tomonida saqlanadi)
    const sessionParam = encodeURIComponent(JSON.stringify({
      access_token: data.session.access_token,
      refresh_token: data.session.refresh_token,
      expires_at: data.session.expires_at,
      user: data.user,
    }))

    return NextResponse.redirect(`${url.origin}/?session=${sessionParam}`)
  } catch (err) {
    const url = new URL(request.url)
    return NextResponse.redirect(`${url.origin}/auth?error=${encodeURIComponent(err.message)}`)
  }
}
