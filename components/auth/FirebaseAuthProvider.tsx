'use client';

import { useEffect, useState } from 'react';
import { signInWithPopup, GoogleAuthProvider } from 'firebase/auth';
import { auth } from '@/lib/firebase';
import { signIn, signOut, useSession } from 'next-auth/react';
import { AuthContext } from '@/lib/auth-context';

export const FirebaseAuthProvider = ({ children }: { children: React.ReactNode }) => {
  const { data: session } = useSession();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged(async (firebaseUser) => {
      try {
        // Se não há usuário no Firebase e há sessão no Next Auth, fazer logout
        if (!firebaseUser && session) {
          await signOut({ redirect: false });
        } 
        // Se há usuário no Firebase mas não há sessão no Next Auth, fazer login
        else if (firebaseUser && !session) {
          // Criar objeto com dados do usuário
          const userData = {
            uid: firebaseUser.uid,
            email: firebaseUser.email,
            displayName: firebaseUser.displayName,
            photoURL: firebaseUser.photoURL
          };
          
          // Fazer login no Next Auth com esses dados
          await signIn('credentials', {
            token: JSON.stringify(userData),
            redirect: false
          });
        }
      } catch (error) {
        console.error('Erro ao sincronizar autenticação:', error);
      } finally {
        setLoading(false);
      }
    });

    return () => unsubscribe();
  }, [session]);

  // Função de login apenas com Google
  const loginWithGoogle = async () => {
    try {
      const provider = new GoogleAuthProvider();
      await signInWithPopup(auth, provider);
    } catch (error) {
      console.error('Erro ao fazer login com Google:', error);
      throw error;
    }
  };

  const logout = async () => {
    try {
      await auth.signOut();
      await signOut({ redirect: false });
    } catch (error) {
      console.error('Erro ao fazer logout:', error);
      throw error;
    }
  };

  // Contexto de autenticação atualizado (sem Apple)
  const authContextValue = {
    loginWithGoogle,
    logout
  };

  if (loading) {
    return <div className="flex items-center justify-center min-h-screen">
      <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-pink-500"></div>
    </div>;
  }

  // Se o usuário não estiver autenticado, renderiza os filhos normalmente
  return (
    <AuthContext.Provider value={authContextValue}>
      {children}
    </AuthContext.Provider>
  );
};