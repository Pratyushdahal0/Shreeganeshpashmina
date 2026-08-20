import { withAuth } from "next-auth/middleware";
import { NextResponse } from "next/server";

export default withAuth((request) => {
  if (request.nextUrl.pathname === "/admin/login") return NextResponse.next();
  if (!request.nextauth.token) return NextResponse.redirect(new URL("/admin/login", request.url));
  if (!['OWNER','ADMIN','MANAGER','SALES','INVENTORY','CONTENT','SUPPORT','VIEWER'].includes(String(request.nextauth.token?.role))) return NextResponse.redirect(new URL("/", request.url));
}, { callbacks: { authorized: () => true } });
export const config = { matcher: ["/admin/:path*"] };
