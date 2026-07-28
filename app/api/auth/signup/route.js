import { NextResponse } from 'next/server'
import { createServerSupabase } from '@/lib/supabase-server'

// POST /api/auth/signup — Ro'yxatdan o'tish
export async function POST(request) {
  try {
    const { email, password } = await request.json()

    if (!email || !password) {
      return NextResponse.json({ error: 'Email va parol kerak' }, { status: 400 })
    }

    if (password.length < 6) {
      return NextResponse.json({ error: 'Parol kamida 6 ta belgi bo\'lishi kerak' }, { status: 400 })
    }

    const supabase = createServerSupabase()
    const { data, error } = await supabase.auth.signUp({ email, password })

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 400 })
    }

    // Agar session qaytsa — avtomatik login qilgan
    if (data.session) {
      return NextResponse.json({
        user: data.user,
        session: {
          access_token: data.session.access_token,
          refresh_token: data.session.refresh_token,
          expires_at: data.session.expires_at,
        }
      })
    }

    // Email tasdiqlash kerak bo'lsa
    return NextResponse.json({
      user: data.user,
      session: null,
      message: 'Ro\'yxatdan o\'tdingiz!'
    })
  } catch (err) {
    return NextResponse.json({ error: err.message }, { status: 500 })
  }
}
