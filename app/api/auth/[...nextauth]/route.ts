import NextAuth from "next-auth";
import { authOptions } from "@/lib/auth-options";

// Exportando o manipulador de autenticação para as rotas GET e POST
// Isso permite que o NextAuth trate as requisições de autenticação corretamente
const handler = NextAuth(authOptions);
export { handler as GET, handler as POST };