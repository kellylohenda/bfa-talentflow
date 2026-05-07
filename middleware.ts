import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

export function middleware(request: NextRequest) {
  const role = request.cookies.get('role')?.value
  const { pathname } = request.nextUrl

  const PUBLIC = ['/login', '/programa', '/candidatura', '/portal', '/api/candidaturas', '/api/portal']
  if (PUBLIC.some(p => pathname === p || pathname.startsWith(p + '/'))) return NextResponse.next()
  if (!role) {
    const url = request.nextUrl.clone()
    url.pathname = '/programa'
    return NextResponse.redirect(url)
  }
  return NextResponse.next()
}

export const config = {
  matcher: ['/((?!_next/static|_next/image|favicon.ico).*)'],
}
