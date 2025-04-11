import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { getToken } from 'next-auth/jwt';

export async function middleware(request: NextRequest) {
  // Caminhos que requerem autenticação
  const protectedPaths = ['/dashboard', '/profile'];
  
  // Verificar se o caminho atual está protegido
  const isProtectedPath = protectedPaths.some(path => 
    request.nextUrl.pathname.startsWith(path)
  );
  
  if (isProtectedPath) {
    const token = await getToken({ req: request });
    
    // Se não estiver autenticado, redirecionar para login
    if (!token) {
      const url = new URL('/api/auth/signin', request.url);
      url.searchParams.set('callbackUrl', request.url);
      return NextResponse.redirect(url);
    }
  }
  
  return NextResponse.next();
}

// Configurar quais caminhos o middleware deve ser executado
export const config = {
  matcher: ['/dashboard/:path*', '/profile/:path*'],
};