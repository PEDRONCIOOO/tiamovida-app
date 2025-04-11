import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'tiS2vida - Contador para casais',
  description: 'Crie um contador personalizado para o seu relacionamento',
};

export default function RootLayout({ 
  children 
}: { 
  children: React.ReactNode 
}) {
  return (
    <html lang="pt-BR">
      <body className={inter.className}>
      <Header />
        {children}
      <Footer />
      </body>
    </html>
  );
}