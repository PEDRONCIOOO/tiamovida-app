'use client';

export default function HomePage() {
  return (
    <main className="min-h-screen flex flex-col items-center justify-center text-center p-8">
      <h1 className="text-4xl font-bold mb-4">Bem-vindo ao LoveYuu</h1>
      <p className="text-lg text-gray-600 mb-6">Crie cartas românticas e compartilhe momentos únicos ❤️</p>
      <a href="/create" className="px-4 py-2 bg-pink-500 text-white rounded-xl hover:bg-pink-600 transition">
        Criar Minha Carta
      </a>
    </main>
  );
}