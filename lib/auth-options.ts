
import { NextAuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import { DefaultSession } from "next-auth";

// Estendendo os tipos da sessão
declare module "next-auth" {
  interface Session {
    user: {
      id: string;
    } & DefaultSession["user"]
  }
  
  interface User {
    id: string;
  }
}

/// Configurações do NextAuth
export const authOptions: NextAuthOptions = {
  providers: [
    CredentialsProvider({
      name: "Firebase",
      credentials: {
        token: { label: "Token", type: "text" }
      },
      async authorize(credentials) {
        if (!credentials?.token) return null;
        
        try {
          const userData = JSON.parse(credentials.token);
          // Verifica se o token é válido
          return {
            id: userData.uid,
            name: userData.displayName,
            email: userData.email,
            image: userData.photoURL
          };
        } catch (error) {
          console.error("Erro na autenticação:", error);
          return null;
        }
      }
    }),
  ],
  // Configuração de sessão
  session: {
    strategy: "jwt",
    maxAge: 30 * 24 * 60 * 60, // 30 dias
  },
  // Configuração de cookies
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id;
      }
      return token;
    },
    async session({ session, token }) {
      if (token && session.user) {
        session.user.id = token.id as string;
      }
      return session;
    },
  },
  // Redirecionamento após login/logout
  pages: {
    signIn: "/login",
    error: "/auth/error",
  },
  secret: process.env.NEXTAUTH_SECRET,
};