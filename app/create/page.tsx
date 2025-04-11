
'use client';

import { useState } from 'react';
import { ChevronDown, Camera } from 'lucide-react';

export default function Home() {
  const [selectedPlan, setSelectedPlan] = useState<'basic' | 'premium'>('basic');

  return (
    <div className="min-h-screen bg-[#050510] text-white">
      {/* Language selector */}
      <div className="absolute top-5 right-5 bg-white/10 px-4 py-2 rounded-full text-sm flex items-center cursor-pointer">
        PT <ChevronDown className="ml-2 h-4 w-4" />
      </div>

      <div className="container mx-auto px-4 py-8 flex flex-col lg:flex-row lg:gap-10">
        {/* Left panel - Form */}
        <div className="flex-grow lg:w-2/3">
         
          <h1 className="text-4xl md:text-5xl font-bold mb-2">Quase lá!</h1>
          <h2 className="text-lg md:text-xl opacity-80 mb-8">
            Preencha os dados para criar seu contador
          </h2>

          {/* Plans */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
            <div 
              className={`p-4 rounded-lg cursor-pointer transition-all border ${
                selectedPlan === 'basic' 
                  ? 'border-pink-500 bg-pink-500/10' 
                  : 'border-white/10 bg-white/5 hover:border-pink-500/50'
              }`}
              onClick={() => setSelectedPlan('basic')}
            >
              1 ano, 3 fotos e sem música - R$29
            </div>
            <div 
              className={`p-4 rounded-lg cursor-pointer transition-all border ${
                selectedPlan === 'premium' 
                  ? 'border-pink-500 bg-pink-500/10' 
                  : 'border-white/10 bg-white/5 hover:border-pink-500/50'
              }`}
              onClick={() => setSelectedPlan('premium')}
            >
              Pra sempre, 7 fotos e com música - R$49
            </div>
          </div>

          {/* Form */}
          <div className="space-y-6">
            <div>
              <label className="block mb-2 text-white/80">Nome do casal:</label>
              <input 
                type="text" 
                placeholder="André e Carol (Não use emoji)" 
                className="w-full p-4 bg-white/5 border border-white/10 rounded-lg focus:outline-none focus:border-pink-500 transition-colors"
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="md:col-span-2">
                <label className="block mb-2 text-white/80">Início do relacionamento:</label>
                <input 
                  type="text" 
                  placeholder="dd/mm/aaaa" 
                  className="w-full p-4 bg-white/5 border border-white/10 rounded-lg focus:outline-none focus:border-pink-500 transition-colors"
                />
              </div>
              <div>
                <label className="block mb-2 text-white/80">Horário:</label>
                <input 
                  type="text" 
                  placeholder="--:--" 
                  className="w-full p-4 bg-white/5 border border-white/10 rounded-lg focus:outline-none focus:border-pink-500 transition-colors"
                />
              </div>
            </div>

            <div>
              <label className="block mb-2 text-white/80">Mensagem:</label>
              <textarea 
                placeholder="Escreva sua linda mensagem aqui. Capricha hein! ❤️" 
                className="w-full p-4 bg-white/5 border border-white/10 rounded-lg focus:outline-none focus:border-pink-500 transition-colors min-h-[150px]"
              ></textarea>
            </div>

            <div>
              <div className="border border-dashed border-white/20 rounded-lg p-5 flex flex-col items-center justify-center cursor-pointer hover:border-pink-500 hover:bg-pink-500/10 transition-all">
                <Camera className="w-6 h-6 mb-2" />
                <span>Escolher fotos do casal (Máximo {selectedPlan === 'basic' ? '3' : '7'})</span>
              </div>
            </div>
          </div>
        </div>

        {/* Right panel - Preview */}
        <div className="mt-10 lg:mt-29 lg:w-1/3">          
          <div className="bg-[#191927] rounded-xl overflow-hidden">
            {/* Browser dots */}
            <div className="bg-[#111] p-3 flex justify-center">
              <div className="flex space-x-2">
                <div className="w-3 h-3 rounded-full bg-[#ff5f57]"></div>
                <div className="w-3 h-3 rounded-full bg-[#ffbd2e]"></div>
                <div className="w-3 h-3 rounded-full bg-[#28ca41]"></div>
              </div>
            </div>

            {/* URL bar */}
            <div className="bg-white text-gray-800 mx-2 my-3 px-3 py-2 rounded text-center text-sm">
              tiamovida.com/
            </div>

            {/* Preview content */}
            <div className="p-4 h-[425px] flex items-center justify-center">
              <div className="w-full h-full border-2 border-pink-500 rounded-lg flex items-center justify-center">
                <svg 
                  xmlns="http://www.w3.org/2000/svg" 
                  width="48" 
                  height="48" 
                  viewBox="0 0 24 24" 
                  fill="none" 
                  stroke="currentColor" 
                  strokeWidth="1.5" 
                  strokeLinecap="round" 
                  strokeLinejoin="round"
                >
                  <rect x="3" y="3" width="18" height="18" rx="2" ry="2"></rect>
                  <circle cx="8.5" cy="8.5" r="1.5"></circle>
                  <polyline points="21 15 16 10 5 21"></polyline>
                </svg>
              </div>
            </div>
          </div>

          {/* Create button */}
          <button className="w-full mt-6 bg-gradient-to-r from-pink-500 to-purple-600 text-white font-bold py-4 px-6 rounded-lg transition-all hover:translate-y-[-3px] hover:shadow-lg hover:shadow-pink-500/30">
            <div className="text-lg">Criar nosso site</div>
            <div className="text-sm font-normal mt-1">Preencha os dados faltantes</div>
          </button>
        </div>
      </div>
    </div>
  );
}