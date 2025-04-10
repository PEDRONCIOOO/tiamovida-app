import { createContext, useContext } from 'react';

// Autenticação com Firebase
interface AuthContextType {
  loginWithGoogle: () => Promise<void>;
  logout: () => Promise<void>;
}

/// Contexto de autenticação
export const AuthContext = createContext<AuthContextType | null>(null);

/// Provider de autenticação
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth deve ser usado dentro de um FirebaseAuthProvider');
  }
  return context;
};