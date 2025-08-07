import { NextResponse } from 'next/server';

const protectedRoutes = ['/planos', '/pedidos'];
const authRoutes = ['/login'];

export function middleware(request) {
  const authToken = request.cookies.get('auth_token')?.value;
  const { pathname } = request.nextUrl;

  const isProtectedRoute = protectedRoutes.some(route => pathname.startsWith(route));
  const isAuthRoute = authRoutes.some(route => pathname.startsWith(route));

  if (isProtectedRoute && !authToken) {
    // Si no está autenticado y trata de acceder a una ruta protegida, redirige a login
    return NextResponse.redirect(new URL('/login', request.url));
  }

  if (isAuthRoute && authToken) {
    // Si ya está autenticado y trata de acceder a login, redirige a planos
    return NextResponse.redirect(new URL('/planos', request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/((?!api|_next/static|_next/image|favicon.ico).*)'],
};