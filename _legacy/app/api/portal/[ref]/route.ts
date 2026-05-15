import { NextResponse } from 'next/server'
import { getByRef } from '@/lib/store'
import { cookies } from 'next/headers'

export async function GET(
  _req: Request,
  { params }: { params: { ref: string } }
) {
  const portalRef = cookies().get('portal_ref')?.value

  if (!portalRef || portalRef !== params.ref) {
    return NextResponse.json({ error: 'Não autenticado' }, { status: 401 })
  }

  const record = getByRef(params.ref)
  if (!record) {
    return NextResponse.json({ error: 'Candidatura não encontrada' }, { status: 404 })
  }

  // Return only the fields the candidate needs to see
  const { email, nome, ref, program, program2, status, submittedAt, curso, uni, media } = record
  return NextResponse.json({ email, nome, ref, program, program2, status, submittedAt, curso, uni, media })
}
