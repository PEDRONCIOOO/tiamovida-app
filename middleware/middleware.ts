// /middleware.ts
import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { getToken } from 'next-auth/jwt';

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  
  // Rotas públicas que não precisam de autenticação
  const publicRoutes = ['/', '/login', '/love/'];
  const isPublicRoute = publicRoutes.some(route => 
    pathname === route || pathname.startsWith('/love/')
  );
  
  if (isPublicRoute) {
    return NextResponse.next();
  }
  
  // Verificar token de autenticação
  const token = await getToken({ req: request, secret: process.env.NEXTAUTH_SECRET });
  
  // Se não estiver autenticado, redirecionar para login
  if (!token) {
    const url = new URL('/login', request.url);
    url.searchParams.set('callbackUrl', pathname);
    return NextResponse.redirect(url);
  }
  
  return NextResponse.next();
}

// Configurar quais rotas devem passar pelo middleware
export const config = {
  matcher: [
    '/((?!api|_next/static|_next/image|favicon.ico).*)',
  ],
};