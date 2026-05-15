import { NextResponse } from 'next/server'
import { getByRef } from '@/lib/store'

export async function POST(req: Request) {
  try {
    const { ref, email } = await req.json()

    if (!ref || !email) {
      return NextResponse.json({ error: 'Referência e email obrigatórios' }, { status: 400 })
    }

    const record = getByRef(ref.trim().toUpperCase())
    if (!record || record.email.toLowerCase() !== email.trim().toLowerCase()) {
      return NextResponse.json({ error: 'Referência ou email inválidos' }, { status: 401 })
    }

    const res = NextResponse.json({ ok: true, ref: record.ref })
    res.cookies.set('portal_ref', record.ref, {
      httpOnly: true,
      sameSite: 'lax',
      maxAge: 60 * 60 * 8, // 8 hours
      path: '/',
    })
    return res
  } catch (err) {
    console.error('POST /api/portal', err)
    return NextResponse.json({ error: 'Erro interno' }, { status: 500 })
  }
}
