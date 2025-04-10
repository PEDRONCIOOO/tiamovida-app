'use client';
import { useState } from 'react';

export default function CreatePage() {
  const [message, setMessage] = useState('');

  const handleSubmit = async () => {
    // Aqui vai o Server Action para salvar a carta
    alert(`Mensagem enviada: ${message}`);
  };

  return (
    <div className="max-w-xl mx-auto py-10">
      <h2 className="text-2xl font-semibold mb-4">Crie sua mensagem ❤️</h2>
      <textarea
        value={message}
        onChange={(e) => setMessage(e.target.value)}
        className="w-full h-40 p-4 border border-gray-300 rounded-lg"
        placeholder="Escreva algo bonito..."
      />
      <button
        onClick={handleSubmit}
        className="mt-4 px-4 py-2 bg-pink-500 text-white rounded-xl hover:bg-pink-600 transition"
      >
        Enviar Carta
      </button>
    </div>
  );
}