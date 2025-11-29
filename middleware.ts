import { jwtDecode } from 'jwt-decode';
import { NextResponse, type NextRequest } from 'next/server';

const REDIRECT_WHEN_NOT_AUTHENTICATED = '/login';

const PUBLIC_ROUTES = [
  { path: '/login', whenAuthenticated: 'redirect' },
  { path: '/register', whenAuthenticated: 'redirect' },
  { path: '/', whenAuthenticated: 'next', exact: true },
  { path: '/public', whenAuthenticated: 'next' },
] as const;

type PublicRoute = (typeof PUBLIC_ROUTES)[number];

function findPublicRoute(pathname: string): PublicRoute | undefined {
  return PUBLIC_ROUTES.find((route) =>
    'exact' in route && route.exact
      ? pathname === route.path
      : pathname === route.path || pathname.startsWith(`${route.path}/`),
  );
}

export function middleware(request: NextRequest) {
  const path = request.nextUrl.pathname;
  const publicRoute = findPublicRoute(path);
  const authToken = request.cookies.get('authToken')?.value;

  if (publicRoute && !authToken) {
    return NextResponse.next();
  }

  if (!publicRoute && !authToken) {
    const redirectUrl = request.nextUrl.clone();
    redirectUrl.pathname = REDIRECT_WHEN_NOT_AUTHENTICATED;
    return NextResponse.redirect(redirectUrl);
  }

  if (
    authToken &&
    publicRoute &&
    publicRoute.whenAuthenticated === 'redirect'
  ) {
    const decoded = jwtDecode(authToken);

    if (decoded.exp && decoded.exp * 1000 < Date.now()) {
      const response = NextResponse.next();
      response.cookies.delete('authToken');
      return response;
    }

    const redirectUrl = request.nextUrl.clone();
    redirectUrl.pathname = '/dashboard';
    return NextResponse.redirect(redirectUrl);
  }

  if (authToken && !publicRoute) {
    const decoded = jwtDecode(authToken);

    if (decoded.exp && decoded.exp * 1000 < Date.now()) {
      const redirectUrl = request.nextUrl.clone();
      redirectUrl.pathname = REDIRECT_WHEN_NOT_AUTHENTICATED;
      const response = NextResponse.redirect(redirectUrl);
      response.cookies.delete('authToken');
      return response;
    }

    return NextResponse.next();
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    // Exclude API routes, static files, image optimizations, and .png files
    '/((?!api|_next/static|_next/image|.*\\.png$).*)',
  ],
};
