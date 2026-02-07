import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

// Public routes that don't require authentication
const publicRoutes = ['/login', '/register', '/forgot-password'];

// Routes that authenticated users should be redirected away from
const authRoutes = ['/login', '/register'];

export function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Check for refresh token cookie (indicates potential auth)
  // Note: We can only check existence, not validity - that's done by backend
  const hasRefreshToken = request.cookies.has('refreshToken');

  // If accessing auth routes (login/register) while having refresh token,
  // redirect to POS (they're likely already logged in)
  if (authRoutes.includes(pathname) && hasRefreshToken) {
    return NextResponse.redirect(new URL('/pos', request.url));
  }

  // If accessing protected routes without refresh token, redirect to login
  const isPublicRoute = publicRoutes.includes(pathname);
  const isStaticAsset = pathname.startsWith('/_next') || pathname.includes('.');

  if (!isPublicRoute && !isStaticAsset && !hasRefreshToken) {
    const loginUrl = new URL('/login', request.url);
    // Preserve the original destination for redirect after login
    if (pathname !== '/') {
      loginUrl.searchParams.set('redirect', pathname);
    }
    return NextResponse.redirect(loginUrl);
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    /*
     * Match all request paths except:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - public folder files (images, etc.)
     */
    '/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp|ico)$).*)',
  ],
};
