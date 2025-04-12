'use client'

import { motion } from 'framer-motion'
import Image from 'next/image'
import Link from 'next/link';
import { useState } from 'react'

export default function Hero3() {
  const [hoveredPlan, setHoveredPlan] = useState<string | null>(null);

  // Floating elements for background
  const floatingElements = [
    { emoji: "💌", top: "15%", left: "5%" },
    { emoji: "✨", top: "70%", left: "8%" },
    { emoji: "❤️", top: "20%", left: "90%" },
    { emoji: "💕", top: "75%", left: "85%" },
    { emoji: "💘", top: "40%", left: "5%" },
    { emoji: "💝", top: "80%", left: "20%" }
  ];

  return (
    <section className="relative min-h-screen text-white px-6 py-20 flex flex-col items-center justify-center overflow-hidden">
      {/* Background decorations */}
      <div className="absolute inset-0 overflow-hidden">
        {/* Radial gradient */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full h-full max-w-[1000px] max-h-[1000px] bg-pink-500/5 rounded-full blur-3xl"></div>
        
        {/* Floating elements */}
        {floatingElements.map((element, i) => (
          <motion.div
            key={i}
            className="absolute text-2xl sm:text-3xl opacity-20"
            style={{ top: element.top, left: element.left }}
            animate={{
              y: [0, -20, 0],
              rotate: [0, 10, -10, 0],
              scale: [1, 1.1, 1],
            }}
            transition={{
              duration: 8,
              repeat: Infinity,
              repeatType: "reverse",
              delay: i * 0.7,
            }}
          >
            {element.emoji}
          </motion.div>
        ))}
      </div>

      {/* Content container */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="relative z-10 w-full max-w-6xl"
      >
        {/* Header Section */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="text-center mb-16"
        >
          <motion.span
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2, duration: 0.6 }}
            className="inline-block px-4 py-1.5 rounded-full bg-pink-500/20 text-pink-400 text-sm font-medium mb-4"
          >
            Preço Simbólico
          </motion.span>
          
          <motion.h2
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
            className="text-4xl md:text-6xl font-bold mb-6 bg-clip-text text-transparent bg-gradient-to-r from-white via-pink-200 to-white"
          >
            Escolha seu pacote
          </motion.h2>
          
          <motion.p 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5 }}
            className="text-gray-300 mb-10 max-w-xl mx-auto"
          >
            Crie momentos inesquecíveis com nossos pacotes personalizados.
          </motion.p>
        </motion.div>

        {/* Pricing Cards Container */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 lg:gap-12 max-w-5xl mx-auto">
          {/* Plano Básico */}
          <motion.div
            initial={{ opacity: 0, x: -30, y: 20 }}
            animate={{ opacity: 1, x: 0, y: 0 }}
            transition={{ duration: 0.7, delay: 0.2 }}
            onMouseEnter={() => setHoveredPlan('basic')}
            onMouseLeave={() => setHoveredPlan(null)}
            className="relative group"
          >
            {/* Card glow effect */}
            <motion.div
              animate={{
                boxShadow: hoveredPlan === 'basic' 
                  ? '0 0 25px 3px rgba(219, 39, 119, 0.3)' 
                  : '0 0 0px 0px rgba(219, 39, 119, 0)'
              }}
              className="absolute -inset-0.5 bg-gradient-to-br from-pink-500/40 to-purple-600/40 rounded-xl blur-lg group-hover:opacity-100 opacity-0 transition duration-300"
            ></motion.div>
            
            <div className="bg-gradient-to-br from-[#0e1b37] to-[#111e3c] border border-[#1a2b4d] rounded-xl p-8 relative z-10 h-full flex flex-col shadow-xl">
              <div className="flex justify-between items-start mb-6">
                <div>
                  <h3 className="text-xl font-bold text-white">Básico</h3>
                  <p className="text-pink-300/80 text-sm mt-1">Para momentos especiais</p>
                </div>
                <motion.div
                  whileHover={{ rotate: 10, scale: 1.1 }}
                  transition={{ type: "spring", stiffness: 400, damping: 10 }}
                >
                  <Image 
                    src="/bear.webp" 
                    alt="Plano básico" 
                    width={70} 
                    height={70}
                    className="drop-shadow-lg"
                  />
                </motion.div>
              </div>

              {/* Price */}
              <div className="mb-8">
                <motion.div
                  animate={{
                    scale: [1, hoveredPlan === 'basic' ? 1.05 : 1]
                  }}
                  transition={{ duration: 0.3 }}
                >
                  <div className="flex items-baseline">
                    <span className="text-5xl font-bold">
                      R$29
                    </span>
                    <span className="text-gray-400 ml-2">
                      pagamento único
                    </span>
                  </div>
                </motion.div>
              </div>

              {/* Features */}
              <div className="space-y-4 mb-8 flex-grow">
                <motion.div 
                  className="flex items-center gap-3 bg-[#1a2b4d]/30 px-4 py-3 rounded-lg"
                  animate={{ 
                    backgroundColor: hoveredPlan === 'basic' ? 'rgba(26, 43, 77, 0.5)' : 'rgba(26, 43, 77, 0.3)'
                  }}
                >
                  <span className="p-1 rounded-md bg-pink-500/20 text-pink-400">
                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" viewBox="0 0 16 16">
                      <path d="M16 8A8 8 0 1 1 0 8a8 8 0 0 1 16 0zm-3.97-3.03a.75.75 0 0 0-1.08.022L7.477 9.417 5.384 7.323a.75.75 0 0 0-1.06 1.06L6.97 11.03a.75.75 0 0 0 1.079-.02l3.992-4.99a.75.75 0 0 0-.01-1.05z"/>
                    </svg>
                  </span>
                  <span>1 ano de acesso</span>
                </motion.div>

                <motion.div 
                  className="flex items-center gap-3 bg-[#1a2b4d]/30 px-4 py-3 rounded-lg"
                  animate={{ 
                    backgroundColor: hoveredPlan === 'basic' ? 'rgba(26, 43, 77, 0.5)' : 'rgba(26, 43, 77, 0.3)'
                  }}
                >
                  <span className="p-1 rounded-md bg-pink-500/20 text-pink-400">
                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" viewBox="0 0 16 16">
                      <path d="M16 8A8 8 0 1 1 0 8a8 8 0 0 1 16 0zm-3.97-3.03a.75.75 0 0 0-1.08.022L7.477 9.417 5.384 7.323a.75.75 0 0 0-1.06 1.06L6.97 11.03a.75.75 0 0 0 1.079-.02l3.992-4.99a.75.75 0 0 0-.01-1.05z"/>
                    </svg>
                  </span>
                  <span>3 fotos personalizadas</span>
                </motion.div>

                <motion.div 
                  className="flex items-center gap-3 bg-[#1a2b4d]/30 px-4 py-3 rounded-lg opacity-60"
                  animate={{ 
                    backgroundColor: hoveredPlan === 'basic' ? 'rgba(26, 43, 77, 0.5)' : 'rgba(26, 43, 77, 0.3)'
                  }}
                >
                  <span className="p-1 rounded-md bg-gray-500/20 text-gray-400">
                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" viewBox="0 0 16 16">
                      <path d="M8 15A7 7 0 1 1 8 1a7 7 0 0 1 0 14zm0 1A8 8 0 1 0 8 0a8 8 0 0 0 0 16z"/>
                      <path d="M4 8a.5.5 0 0 1 .5-.5h7a.5.5 0 0 1 0 1h-7A.5.5 0 0 1 4 8z"/>
                    </svg>
                  </span>
                  <span className="line-through">Sem música personalizada</span>
                </motion.div>

                <motion.div 
                  className="flex items-center gap-3 bg-[#1a2b4d]/30 px-4 py-3 rounded-lg opacity-60"
                  animate={{ 
                    backgroundColor: hoveredPlan === 'basic' ? 'rgba(26, 43, 77, 0.5)' : 'rgba(26, 43, 77, 0.3)'
                  }}
                >
                  <span className="p-1 rounded-md bg-gray-500/20 text-gray-400">
                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" viewBox="0 0 16 16">
                      <path d="M8 15A7 7 0 1 1 8 1a7 7 0 0 1 0 14zm0 1A8 8 0 1 0 8 0a8 8 0 0 0 0 16z"/>
                      <path d="M4 8a.5.5 0 0 1 .5-.5h7a.5.5 0 0 1 0 1h-7A.5.5 0 0 1 4 8z"/>
                    </svg>
                  </span>
                  <span className="line-through">Sem efeitos visuais</span>
                </motion.div>
              </div>

              {/* Button */}
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className="w-full py-4 bg-gradient-to-r from-pink-500 to-pink-600 hover:from-pink-400 hover:to-pink-500 rounded-lg text-white font-semibold shadow-lg shadow-pink-500/30 transition-all duration-300"
              >
                <Link href="/create">Quero esse plano</Link>
              </motion.button>
            </div>
          </motion.div>

          {/* Plano Premium */}
          <motion.div
            initial={{ opacity: 0, x: 30, y: 20 }}
            animate={{ opacity: 1, x: 0, y: 0 }}
            transition={{ duration: 0.7, delay: 0.4 }}
            onMouseEnter={() => setHoveredPlan('premium')}
            onMouseLeave={() => setHoveredPlan(null)}
            className="relative group md:-mt-6"
          >
            {/* Highlight ribbon */}
            <motion.div 
              initial={{ y: -20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.8 }}
              className="absolute -top-6 inset-x-0 flex justify-center"
            >
              <div className="bg-gradient-to-r from-pink-500 to-purple-600 rounded-full px-6 py-2 text-sm font-semibold shadow-lg flex items-center gap-2">
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" viewBox="0 0 16 16" className="text-yellow-300">
                  <path d="M3.612 15.443c-.386.198-.824-.149-.746-.592l.83-4.73L.173 6.765c-.329-.314-.158-.888.283-.95l4.898-.696L7.538.792c.197-.39.73-.39.927 0l2.184 4.327 4.898.696c.441.062.612.636.282.95l-3.522 3.356.83 4.73c.078.443-.36.79-.746.592L8 13.187l-4.389 2.256z"/>
                </svg>
                <span>MAIS ESCOLHIDO</span>
              </div>
            </motion.div>

            {/* Card glow effect */}
            <motion.div
              animate={{
                boxShadow: hoveredPlan === 'premium' 
                  ? '0 0 30px 5px rgba(219, 39, 119, 0.4)' 
                  : '0 0 15px 2px rgba(219, 39, 119, 0.2)'
              }}
              className="absolute -inset-0.5 bg-gradient-to-br from-pink-500/60 to-purple-600/60 rounded-xl blur-lg transition duration-300"
            ></motion.div>
            
            <div className="bg-gradient-to-br from-[#141f3d] to-[#162044] border border-pink-500 rounded-xl p-8 relative z-10 h-full flex flex-col shadow-2xl">
              <div className="flex justify-between items-start mb-6">
                <div>
                  <h3 className="text-xl font-bold text-white">Premium</h3>
                  <p className="text-pink-300/80 text-sm mt-1">Para experiências inesquecíveis</p>
                </div>
                <motion.div
                  whileHover={{ rotate: -10, scale: 1.1 }}
                  transition={{ type: "spring", stiffness: 400, damping: 10 }}
                >
                  <Image 
                    src="/heart-fire.webp" 
                    alt="Plano premium" 
                    width={70} 
                    height={70}
                    className="drop-shadow-lg"
                  />
                </motion.div>
              </div>

              {/* Price */}
              <div className="mb-8">
                <motion.div
                  animate={{
                    scale: [1, hoveredPlan === 'premium' ? 1.05 : 1]
                  }}
                  transition={{ duration: 0.3 }}
                >
                  <div className="flex items-baseline">
                    <span className="text-5xl font-bold">
                      R$49
                    </span>
                    <span className="text-gray-400 ml-2">
                      pagamento único
                    </span>
                  </div>
                  <div className="flex items-center mt-1">
                    <span className="line-through text-gray-500 mr-2">
                      R$69
                    </span>
                    <span className="bg-pink-500 text-white px-2 py-0.5 rounded text-xs">ECONOMIZE 29%</span>
                  </div>
                </motion.div>
              </div>

              {/* Features */}
              <div className="space-y-4 mb-8 flex-grow">
                <motion.div 
                  className="flex items-center gap-3 bg-pink-500/10 px-4 py-3 rounded-lg"
                  animate={{ 
                    backgroundColor: hoveredPlan === 'premium' ? 'rgba(236, 72, 153, 0.2)' : 'rgba(236, 72, 153, 0.1)'
                  }}
                >
                  <span className="p-1 rounded-md bg-pink-500/20 text-pink-400">
                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" viewBox="0 0 16 16">
                      <path d="M16 8A8 8 0 1 1 0 8a8 8 0 0 1 16 0zm-3.97-3.03a.75.75 0 0 0-1.08.022L7.477 9.417 5.384 7.323a.75.75 0 0 0-1.06 1.06L6.97 11.03a.75.75 0 0 0 1.079-.02l3.992-4.99a.75.75 0 0 0-.01-1.05z"/>
                    </svg>
                  </span>
                  <span>Acesso para sempre</span>
                  <span className="ml-auto text-xs bg-pink-500/20 text-pink-300 px-2 py-0.5 rounded">Premium</span>
                </motion.div>

                <motion.div 
                  className="flex items-center gap-3 bg-pink-500/10 px-4 py-3 rounded-lg"
                  animate={{ 
                    backgroundColor: hoveredPlan === 'premium' ? 'rgba(236, 72, 153, 0.2)' : 'rgba(236, 72, 153, 0.1)'
                  }}
                >
                  <span className="p-1 rounded-md bg-pink-500/20 text-pink-400">
                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" viewBox="0 0 16 16">
                      <path d="M16 8A8 8 0 1 1 0 8a8 8 0 0 1 16 0zm-3.97-3.03a.75.75 0 0 0-1.08.022L7.477 9.417 5.384 7.323a.75.75 0 0 0-1.06 1.06L6.97 11.03a.75.75 0 0 0 1.079-.02l3.992-4.99a.75.75 0 0 0-.01-1.05z"/>
                    </svg>
                  </span>
                  <span>7 fotos personalizadas</span>
                  <span className="ml-auto text-xs bg-pink-500/20 text-pink-300 px-2 py-0.5 rounded">+4</span>
                </motion.div>

                <motion.div 
                  className="flex items-center gap-3 bg-pink-500/10 px-4 py-3 rounded-lg"
                  animate={{ 
                    backgroundColor: hoveredPlan === 'premium' ? 'rgba(236, 72, 153, 0.2)' : 'rgba(236, 72, 153, 0.1)'
                  }}
                >
                  <span className="p-1 rounded-md bg-pink-500/20 text-pink-400">
                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" viewBox="0 0 16 16">
                      <path d="M16 8A8 8 0 1 1 0 8a8 8 0 0 1 16 0zm-3.97-3.03a.75.75 0 0 0-1.08.022L7.477 9.417 5.384 7.323a.75.75 0 0 0-1.06 1.06L6.97 11.03a.75.75 0 0 0 1.079-.02l3.992-4.99a.75.75 0 0 0-.01-1.05z"/>
                    </svg>
                  </span>
                  <span>Música personalizada</span>
                </motion.div>

                <motion.div 
                  className="flex items-center gap-3 bg-pink-500/10 px-4 py-3 rounded-lg"
                  animate={{ 
                    backgroundColor: hoveredPlan === 'premium' ? 'rgba(236, 72, 153, 0.2)' : 'rgba(236, 72, 153, 0.1)'
                  }}
                >
                  <span className="p-1 rounded-md bg-pink-500/20 text-pink-400">
                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" viewBox="0 0 16 16">
                      <path d="M16 8A8 8 0 1 1 0 8a8 8 0 0 1 16 0zm-3.97-3.03a.75.75 0 0 0-1.08.022L7.477 9.417 5.384 7.323a.75.75 0 0 0-1.06 1.06L6.97 11.03a.75.75 0 0 0 1.079-.02l3.992-4.99a.75.75 0 0 0-.01-1.05z"/>
                    </svg>
                  </span>
                  <span>Efeitos visuais premium</span>
                </motion.div>
              </div>

              {/* Button */}
              <motion.button
                whileHover={{ scale: 1.03 }}
                whileTap={{ scale: 0.98 }}
                className="relative w-full py-4 rounded-lg text-white font-semibold shadow-lg shadow-pink-600/40 transition-all duration-300"
              >
                <div className="absolute inset-0 bg-gradient-to-r from-pink-500 to-purple-600 rounded-lg"></div>
                <div className="absolute inset-0 bg-gradient-to-r from-pink-400 to-purple-500 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                <Link href="/create" className="relative z-10 flex items-center justify-center gap-2">
                  Escolher premium
                  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" viewBox="0 0 16 16">
                    <path fillRule="evenodd" d="M4 8a.5.5 0 0 1 .5-.5h5.793L8.146 5.354a.5.5 0 1 1 .708-.708l3 3a.5.5 0 0 1 0 .708l-3 3a.5.5 0 0 1-.708-.708L10.293 8.5H4.5A.5.5 0 0 1 4 8z"/>
                  </svg>
                </Link>
              </motion.button>
            </div>

            {/* Floating particles */}
            <motion.div 
              className="absolute -right-6 -top-6 text-xl"
              animate={{ 
                y: [0, -10, 0],
                rotate: [0, -10, 0],
                opacity: [0.5, 1, 0.5]
              }}
              transition={{ duration: 5, repeat: Infinity }}
            >
              ✨
            </motion.div>
            <motion.div 
              className="absolute -left-4 -bottom-4 text-xl"
              animate={{ 
                y: [0, 10, 0],
                rotate: [0, 10, 0],
                opacity: [0.5, 1, 0.5]
              }}
              transition={{ duration: 4, repeat: Infinity, delay: 1 }}
            >
              💖
            </motion.div>
          </motion.div>
        </div>
      </motion.div>
    </section>
  )
}
