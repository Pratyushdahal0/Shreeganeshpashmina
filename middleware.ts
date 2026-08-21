import { NextResponse, type NextRequest } from 'next/server';

/** Fail closed until a verified, server-side AdminAuthService adapter is installed. */
export function middleware(request:NextRequest){const {pathname}=request.nextUrl;if(pathname.startsWith('/api/admin'))return NextResponse.json({error:'Admin authentication is not configured.'},{status:503});if(pathname.startsWith('/admin')){const url=request.nextUrl.clone();url.pathname='/admin-access-required';url.searchParams.set('from',pathname);return NextResponse.redirect(url)}return NextResponse.next()}
export const config={matcher:['/admin/:path*','/api/admin/:path*']};
