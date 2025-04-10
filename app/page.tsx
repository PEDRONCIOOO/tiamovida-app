export default function HomePage() {
  return (
    <main className="min-h-screen bg-gradient-to-br from-pink-100 via-pink-50 to-purple-100 text-gray-800">
      {/* Animação de corações */}
      <div className="absolute inset-0 pointer-events-none">
        {Array.from({ length: 20 }).map((_, i) => (
          <div
            key={i}
            className="absolute text-pink-500 opacity-10 animate-float-heart"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              fontSize: `${Math.random() * 2 + 1}rem`,
              animationDelay: `${Math.random() * 5}s`,
              animationDuration: `${Math.random() * 10 + 10}s`,
            }}
          >
            ❤️
          </div>
        ))}
      </div>

      <div className="container mx-auto px-4 py-16 relative z-10">
        {/* Cabeçalho */}
        <div className="text-center">
          <div className="text-5xl mb-6 animate-bounce">💌</div>
          <h1 className="text-4xl font-extrabold bg-gradient-to-r from-pink-500 to-purple-500 bg-clip-text text-transparent mb-4">
            Bem vindo ao Ti<span className="text-red-500">❤️</span>Vida
          </h1>
          <p className="text-lg text-gray-600 mb-6">
            Crie cartas românticas e compartilhe momentos únicos ❤️
          </p>
          <a
            href="/create"
            className="inline-block px-6 py-3 bg-gradient-to-r from-pink-500 to-red-500 text-white rounded-full shadow-lg hover:scale-105 transition-transform"
          >
            Criar Minha Carta
          </a>
        </div>

        {/* Destaque */}
        <div className="mt-16 flex items-center space-x-4">
          <div className="w-1 bg-pink-300 h-full rounded-full"></div>
          <div>
            <h2 className="text-2xl font-bold text-pink-500 mb-2">
              Expressando amor de forma única
            </h2>
            <p className="text-gray-600">
              Quando palavras comuns não são suficientes, deixe o Ti❤️Vida
              transformar seus sentimentos em algo inesquecível.
            </p>
          </div>
        </div>

        {/* Recursos */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-16">
          <div className="p-6 bg-white rounded-lg shadow-lg hover:shadow-xl transition-shadow">
            <div className="text-3xl mb-4">💌</div>
            <h3 className="text-xl font-bold text-pink-500 mb-2">
              Cartas Personalizadas
            </h3>
            <p className="text-gray-600">
              Crie mensagens únicas com templates exclusivos.
            </p>
          </div>
          <div className="p-6 bg-white rounded-lg shadow-lg hover:shadow-xl transition-shadow">
            <div className="text-3xl mb-4">🎁</div>
            <h3 className="text-xl font-bold text-pink-500 mb-2">
              Surpresas Especiais
            </h3>
            <p className="text-gray-600">
              Adicione elementos que tornarão sua mensagem inesquecível.
            </p>
          </div>
          <div className="p-6 bg-white rounded-lg shadow-lg hover:shadow-xl transition-shadow">
            <div className="text-3xl mb-4">💕</div>
            <h3 className="text-xl font-bold text-pink-500 mb-2">
              Compartilhe Amor
            </h3>
            <p className="text-gray-600">
              Envie facilmente por qualquer plataforma.
            </p>
          </div>
        </div>

        {/* Seção de demonstração */}
        <div className="mt-16 bg-white p-8 rounded-lg shadow-lg">
          <h2 className="text-2xl font-bold text-pink-500 mb-4">
            Como funciona?
          </h2>
          <ol className="list-decimal list-inside space-y-4 text-gray-600">
            <li>Escolha um template romântico.</li>
            <li>Personalize a mensagem com seus sentimentos.</li>
            <li>Adicione elementos especiais (fotos, músicas).</li>
            <li>Compartilhe com sua pessoa amada.</li>
          </ol>
        </div>

        {/* CTA final */}
        <div className="text-center mt-16">
          <h2 className="text-2xl font-bold text-gray-800 mb-4">
            Pronto para expressar seu amor?
          </h2>
          <a
            href="/create"
            className="inline-block px-6 py-3 bg-gradient-to-r from-pink-500 to-red-500 text-white rounded-full shadow-lg hover:scale-105 transition-transform"
          >
            Começar Agora
          </a>
        </div>
      </div>

      <footer className="text-center text-gray-500 mt-16">
        <p>© 2025 Ti❤️Vida. Todos os direitos reservados.</p>
      </footer>
    </main>
  );
}