import { NextResponse } from 'next/server';

const protectedPaths = ['/profile', '/bookmarks', '/search'];

export function middleware(req) {
  const { pathname, origin } = req.nextUrl;
  if (protectedPaths.some(path => pathname.startsWith(path))) {
    const token = req.cookies.get('auth_token');
    const loginPath = '/auth'
    const loginUrl = new URL(loginPath, origin);
    loginUrl.searchParams.append('redirect', pathname);

    if (!token) {
      return NextResponse.redirect(loginUrl);
    }

    return NextResponse.next();
  }

  return NextResponse.next();
}

// Specify the paths that should trigger this middleware
export const config = {
  matcher: ['/profile/:path*', '/bookmarks/:path*', '/search/:path*'],
};
