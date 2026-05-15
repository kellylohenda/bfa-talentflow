import { NextResponse } from 'next/server'
import { updateStatus } from '@/lib/store'
import { sendApproval, sendRejection } from '@/lib/emails'

export async function PATCH(
  req: Request,
  { params }: { params: { ref: string } }
) {
  try {
    const { status } = await req.json()

    if (status !== 'aprovada' && status !== 'recusada') {
      return NextResponse.json({ error: 'Status inválido' }, { status: 400 })
    }

    const record = updateStatus(params.ref, status)
    if (!record) {
      return NextResponse.json({ error: 'Candidatura não encontrada' }, { status: 404 })
    }

    if (status === 'aprovada') {
      sendApproval(record.email, record.nome, record.ref, record.program).catch(console.error)
    } else {
      sendRejection(record.email, record.nome, record.ref, record.program).catch(console.error)
    }

    return NextResponse.json({ ok: true, status })
  } catch (err) {
    console.error('PATCH /api/candidaturas/[ref]/status', err)
    return NextResponse.json({ error: 'Erro interno' }, { status: 500 })
  }
}
