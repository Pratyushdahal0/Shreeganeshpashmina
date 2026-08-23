import { NextResponse, type NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
  // Allow all requests through for development purposes. 
  // In a production app, you would implement authentication logic here.
  return NextResponse.next();
}

export const config = {
  matcher: ['/admin/:path*', '/api/admin/:path*'],
};
