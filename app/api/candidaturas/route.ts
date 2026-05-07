import { NextResponse } from 'next/server'
import { create, getAll } from '@/lib/store'
import { sendConfirmation } from '@/lib/emails'
import type { CandidaturaRecord } from '@/lib/store'

function genRef(): string {
  const n = Math.floor(Math.random() * 9000 + 1000)
  return `BFA-2026-${n}`
}

export async function POST(req: Request) {
  try {
    const body = await req.json()

    const record: CandidaturaRecord = {
      ref: genRef(),
      email: body.email,
      nome: body.nome,
      program: body.program,
      program2: body.program2 || undefined,
      status: 'pendente',
      submittedAt: new Date().toISOString(),
      bi: body.bi,
      dob: body.dob,
      genero: body.genero || '',
      tel: body.tel,
      morada: body.morada || '',
      provincia: body.provincia,
      grau: body.grau,
      curso: body.curso,
      uni: body.uni,
      anoFim: body.anoFim || undefined,
      media: body.media,
      ingles: body.ingles || undefined,
      motivacao: body.motivacao,
      futuro: body.futuro || undefined,
      cv: body.cv || undefined,
      historico: body.historico || undefined,
    }

    create(record)

    // Send confirmation email (non-blocking — don't fail the request if email fails)
    sendConfirmation(record.email, record.nome, record.ref, record.program).catch(console.error)

    return NextResponse.json({ ref: record.ref }, { status: 201 })
  } catch (err) {
    console.error('POST /api/candidaturas', err)
    return NextResponse.json({ error: 'Erro interno' }, { status: 500 })
  }
}

export async function GET() {
  try {
    const all = getAll()
    return NextResponse.json(all)
  } catch (err) {
    console.error('GET /api/candidaturas', err)
    return NextResponse.json({ error: 'Erro interno' }, { status: 500 })
  }
}
