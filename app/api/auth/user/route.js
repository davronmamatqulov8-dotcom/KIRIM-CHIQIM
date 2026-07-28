import { NextResponse } from 'next/server'
import { createServerSupabase } from '@/lib/supabase-server'

// GET /api/auth/user — Access token orqali foydalanuvchi ma'lumotlarini olish
export async function GET(request) {
  try {
    const authHeader = request.headers.get('authorization')
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return NextResponse.json({ error: 'Token mavjud emas' }, { status: 401 })
    }

    const token = authHeader.slice(7)
    const supabase = createServerSupabase(token)
    const { data: { user }, error } = await supabase.auth.getUser()

    if (error || !user) {
      return NextResponse.json({ error: error?.message || 'Foydalanuvchi topilmadi' }, { status: 401 })
    }

    return NextResponse.json({ user })
  } catch (err) {
    return NextResponse.json({ error: err.message }, { status: 500 })
  }
}
