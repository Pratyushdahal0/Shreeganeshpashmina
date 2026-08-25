import { NextResponse, type NextRequest } from 'next/server';
import { getToken } from 'next-auth/jwt';

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Allow health check endpoint without auth
  if (pathname === '/api/admin/health') {
    return NextResponse.next();
  }

  const secret = process.env.NEXTAUTH_SECRET || process.env.AUTH_SECRET;
  if (!secret) {
    if (pathname.startsWith('/api/admin')) {
      return NextResponse.json({ error: 'Admin authentication is not configured' }, { status: 503 });
    }
    return NextResponse.redirect(new URL('/admin-access-required', request.url));
  }
  const token = await getToken({ req: request, secret });

  if (!token) {
    if (pathname.startsWith('/api/admin')) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }
    
    const loginUrl = new URL('/login', request.url);
    loginUrl.searchParams.set('callbackUrl', pathname);
    return NextResponse.redirect(loginUrl);
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/admin/:path*', '/api/admin/:path*'],
};
