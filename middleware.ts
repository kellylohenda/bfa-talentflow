import { NextRequest, NextResponse } from 'next/server';
import { verifyToken } from './lib/auth';

const publicRoutes = ['/', '/login', '/programa', '/inscricao', '/api/auth', '/api/seed'];

export function middleware(request: NextRequest) {
  const path = request.nextUrl.pathname;

  // Check if route is public
  const isPublicRoute = publicRoutes.some(publicRoute => 
    path === publicRoute || path.startsWith(publicRoute)
  );

  if (isPublicRoute) {
    return NextResponse.next();
  }

  // Check for auth token
  const token = request.cookies.get('auth_token')?.value;

  if (!token) {
    return NextResponse.redirect(new URL('/login', request.url));
  }

  // Verify token
  const decoded = verifyToken(token);
  if (!decoded) {
    return NextResponse.redirect(new URL('/login', request.url));
  }

  // Add user info to headers for access in server components
  const requestHeaders = new Headers(request.headers);
  requestHeaders.set('x-user-id', decoded.id);
  requestHeaders.set('x-user-email', decoded.email);
  requestHeaders.set('x-user-role', decoded.role);

  return NextResponse.next({
    request: {
      headers: requestHeaders,
    },
  });
}

export const config = {
  matcher: ['/((?!_next/static|_next/image|favicon.ico).*)'],
};
