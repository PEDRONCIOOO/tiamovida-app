// /app/layout.tsx
import { SessionProvider } from 'next-auth/react';
import { FirebaseAuthProvider } from '@/components/auth/FirebaseAuthProvider';

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="pt-BR">
      <body>
        <SessionProvider>
          <FirebaseAuthProvider>
            {children}
          </FirebaseAuthProvider>
        </SessionProvider>
      </body>
    </html>
  );
}