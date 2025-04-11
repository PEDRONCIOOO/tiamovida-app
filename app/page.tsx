"use client";

import { motion } from 'framer-motion';
import Image from 'next/image';

export default function HomePage() {
  // State to control which image is in front

  // Fixed positions for floating elements to avoid hydration errors
  const floatingElements = [
    { emoji: "❤️", top: "10%", left: "75%" },
    { emoji: "💕", top: "65%", left: "80%" },
    { emoji: "💌", top: "30%", left: "40%" },
    { emoji: "✨", top: "20%", left: "15%" },
    { emoji: "❤️", top: "70%", left: "25%" },
    { emoji: "💕", top: "50%", left: "85%" },
  ];
  
  return (
    <main className="flex items-center justify-center bg-gray-800 text-white overflow-hidden min-h-screen">
      <div className="container mx-auto px-4 md:px-8 py-8 md:py-16 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 md:gap-12 items-center">
          {/* Left Content - Text section - Now ORDER 1 on mobile */}
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="order-1 lg:order-1 text-center lg:text-left px-4 mb-4 sm:mb-0"
          >
            <motion.div 
              className="mb-4 inline-block"
              animate={{ 
                y: [0, -10, 0], 
                rotate: [0, 5, 0] 
              }}
              transition={{ 
                duration: 3,
                repeat: Infinity, 
                ease: "easeInOut" 
              }}
            >
              <span className="text-6xl">💌</span>
            </motion.div>
            
            <motion.h1 
              className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-extrabold mb-4 md:mb-6"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.4 }}
            >
              <span className="bg-gradient-to-r from-pink-500 via-red-400 to-purple-500 bg-clip-text text-transparent">
                Ti<motion.span 
                  className="text-red-500 inline-block"
                  animate={{ 
                    scale: [1, 1.2, 1], 
                    rotate: [0, 5, 0] 
                  }}
                  transition={{ 
                    duration: 2, 
                    repeat: Infinity 
                  }}
                >
                  ❤️
                </motion.span>Vida
              </span>
            </motion.h1>
            
            <motion.p 
              className="text-lg lg:text-xl text-gray-300 mb-6 md:mb-8 max-w-xl mx-auto lg:mx-0"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.6 }}
            >
              Crie um contador dinâmico do tempo de relacionamento e ganhe uma imagem transformada em personagem de graça!
              <span className="bg-gradient-to-r from-pink-400 to-red-400 bg-clip-text text-transparent font-bold"> Surpreenda seu amor</span> só apontar para o QR Code.
            </motion.p>
            
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.8 }}
              className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start"
            >
              <motion.a
                href="/create"
                className="px-8 py-4 bg-gradient-to-r from-pink-500 to-red-500 text-white font-bold rounded-full shadow-lg flex items-center justify-center"
                whileHover={{ 
                  scale: 1.05,
                  boxShadow: "0 0 25px rgba(236, 72, 153, 0.6)"
                }}
                whileTap={{ scale: 0.98 }}
              >
                <span>Crie de Graça!</span>
                <motion.span 
                  className="ml-2"
                  animate={{ x: [0, 5, 0] }}
                  transition={{ repeat: Infinity, duration: 1 }}
                >
                  →
                </motion.span>
              </motion.a>
              
              <motion.a
                href="/exemplos"
                className="px-8 py-4 bg-gray-700 hover:bg-gray-600 text-white font-bold rounded-full border border-pink-500/30 flex items-center justify-center"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.98 }}
              >
                Ver Exemplos
              </motion.a>
            </motion.div>
          </motion.div>
          
          {/* Right Animation/Image - Now ORDER 2 on mobile */}
          <motion.div
            className="relative h-[400px] sm:h-[450px] md:h-[550px] lg:h-[650px] flex items-center justify-center order-2 lg:order-2 mt-2 sm:mt-0"
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8, delay: 0.4 }}
          >
            {/* Decorative elements */}
            <motion.div 
              className="absolute w-80 h-80 rounded-full bg-pink-500/10"
              animate={{ 
                scale: [1, 1.2, 1],
                rotate: [0, 45, 0]
              }}
              transition={{ duration: 8, repeat: Infinity }}
            />
            <motion.div 
              className="absolute w-96 h-96 rounded-full bg-purple-500/10"
              animate={{ 
                scale: [1.2, 1, 1.2],
                rotate: [0, -45, 0]
              }}
              transition={{ duration: 10, repeat: Infinity }}
            />
            
            {/* Central elements */}
            <motion.div 
              className="relative z-10 bg-gradient-to-br from-pink-500/20 to-purple-500/20 backdrop-blur-lg rounded-2xl p-4 sm:p-6 shadow-2xl border border-white/10"
              animate={{ 
                y: [0, -10, 0]
              }}
              transition={{ duration: 5, repeat: Infinity }}
            >
              {/* QR Code placed behind the main images */}
              <motion.div
                className="absolute top-3 sm:top-0 sm:left-0 -translate-x-1/2 -translate-y-1/2 w-full h-full flex items-center justify-center z-0"
                animate={{ 
                  opacity: [0.6, 0.8, 0.6],
                  scale: [0.9, 1, 0.9],
                  rotate: [0, 5, 0]
                }}
                transition={{ duration: 8, repeat: Infinity }}
              >
                <Image
                  src="/qr-code-love.png"
                  alt="Escaneie para compartilhar amor"
                  width={200}
                  height={200}
                  className="opacity-60 w-36 h-36 sm:w-48 sm:h-48 md:w-60 md:h-60"
                />
                <div className="absolute inset-0 bg-gradient-to-r from-pink-500/20 via-transparent to-purple-500/20 rounded-full mix-blend-overlay"></div>
              </motion.div>

              {/* Mobile-Optimized Image Display */}
              <div className="relative w-[350px] sm:w-[350px] md:w-[450px] h-80 sm:h-72 md:h-80 lg:h-96">
                {/* Side-by-side image display for larger screens, stacked for mobile */}
                <div className="relative w-full h-full flex flex-col sm:flex-row items-center justify-center sm:justify-between gap-6 sm:gap-0">
                  {/* Original image (TOP on mobile, LEFT on larger screens) */}
                  <motion.div 
                    className="w-[320px] sm:w-[170px] md:w-[210px] h-[370px] sm:h-full rounded-xl overflow-hidden flex items-center justify-center"
                    animate={{ 
                      y: [0, 5, 0],
                      rotate: [1, -1, 1],
                      scale: [0.98, 1, 0.98]
                    }}
                    transition={{ duration: 5.5, repeat: Infinity }}
                  >
                    <Image
                      src="/original-couple.png"
                      alt="Casal Original"
                      width={280}
                      height={370}
                      className="relative z-10 object-cover h-full w-full"
                    />
                    <motion.div 
                      className="absolute -top-3 -left-3"
                      animate={{ 
                        scale: [1, 1.2, 1],
                        rotate: [0, 10, 0],
                        y: [0, -5, 0]
                      }}
                      transition={{ duration: 3, repeat: Infinity }}
                    >
                      <span className="text-4xl sm:text-4xl">✨</span>
                    </motion.div>
                    <motion.div 
                      className="absolute bottom-3 left-3 z-30 bg-gray-800/80 px-3 py-1 rounded-full text-xs font-bold"
                      animate={{ y: [0, -2, 0] }}
                      transition={{ duration: 2.5, repeat: Infinity, delay: 0.5 }}
                    >
                      Original
                    </motion.div>
                  </motion.div>
                  
                  {/* Transformed image (BOTTOM on mobile, RIGHT on larger screens) */}
                  <motion.div 
                    className="w-[320px] sm:w-[170px] md:w-[210px] h-[370px] sm:h-full rounded-xl overflow-hidden flex items-center justify-center sm:mt-0 -mt-24"
                    animate={{ 
                      y: [0, -5, 0],
                      rotate: [-1, 1, -1],
                      scale: [0.98, 1, 0.98]
                    }}
                    transition={{ duration: 6, repeat: Infinity }}
                  >
                    <Image
                      src="/transformed.png"
                      alt="Casal Transformado"
                      width={280}
                      height={370}
                      className="relative z-10 object-cover h-full w-full"
                    />
                    <motion.div 
                      className="absolute inset-0 bg-gradient-to-tr from-pink-500/20 to-purple-500/20 z-20"
                      animate={{ 
                        opacity: [0.3, 0.5, 0.3] 
                      }}
                      transition={{ duration: 3, repeat: Infinity }}
                    />
                    <motion.div 
                      className="absolute -top-3 -right-3 z-30"
                      animate={{ 
                        scale: [1, 1.2, 1],
                        rotate: [0, -10, 0],
                        y: [0, -5, 0]
                      }}
                      transition={{ duration: 3, repeat: Infinity }}
                    >
                      <span className="text-4xl sm:text-4xl">✨</span>
                    </motion.div>
                    <motion.div 
                      className="absolute bottom-3 right-3 z-30 bg-pink-500/80 px-3 py-1 rounded-full text-xs font-bold"
                      animate={{ y: [0, -2, 0] }}
                      transition={{ duration: 2, repeat: Infinity }}
                    >
                      Transformado!
                    </motion.div>
                  </motion.div>
                </div>
                
                {/* QR code indicator - Adjusted position for larger images */}
                <motion.div
                  className="absolute bottom-0 left-1/2 -translate-x-1/2 translate-y-16 sm:translate-y-12 z-30 pointer-events-none"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1, y: [0, -5, 0] }}
                  transition={{ opacity: { delay: 1.5 }, y: { duration: 2, repeat: Infinity } }}
                >
                  <div className="bg-pink-500/70 backdrop-blur-sm px-3 py-1.5 sm:px-4 sm:py-2 rounded-full text-white text-xs sm:text-sm font-medium flex items-center gap-1 sm:gap-2 whitespace-nowrap">
                    <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" fill="currentColor" viewBox="0 0 16 16" className="hidden sm:block">
                      <path d="M2 2h2v2H2V2Z"/>
                      <path d="M6 0v6H0V0h6ZM5 1H1v4h4V1ZM4 12H2v2h2v-2Z"/>
                      <path d="M6 10v6H0v-6h6Zm-5 1v4h4v-4H1Zm11-9h2v2h-2V2Z"/>
                      <path d="M10 0v6h6V0h-6Zm5 1v4h-4V1h4ZM8 1V0h1v2H8v2H7V1h1Zm0 5V4h1v2H8ZM6 8V7h1V6h1v2h1V7h5v1h-4v1H7V8H6Zm0 0v1H2V8H1v1H0V7h3v1h3Zm10 1h-1V7h1v2Zm-1 0h-1v2h2v-1h-1V9Zm-4 0h2v1h-1v1h-1V9Zm2 3v-1h-1v1h-1v1h1v1h1v-2Zm1-1v1h1v1h-2v-2h1Zm-2-1h-1v1h1v-1Z"/>
                      <path d="M9 11H8v1h1v-1Zm3 0h1v1h-1v-1Z"/>
                    </svg>
                    <span className="block sm:hidden">📱</span>
                    Escaneie o QR Code
                  </div>
                </motion.div>
              </div>
            </motion.div>
            
            {/* Floating elements - Adjusted for mobile */}
            {floatingElements.map((element, i) => (
              <motion.div
                key={i}
                className="absolute text-xl sm:text-2xl"
                style={{ 
                  top: element.top, 
                  left: element.left,
                  // Make elements appear in smaller area on mobile
                  ...(typeof window !== 'undefined' && window.innerWidth < 640 ? {
                    top: `${parseInt(element.top) * 0.8}%`,
                    left: `${parseInt(element.left) * 0.8}%`,
                  } : {})
                }}
                animate={{
                  y: [-10, -30, -10],
                  opacity: [0, 1, 0],
                }}
                transition={{
                  duration: 3,
                  repeat: Infinity,
                  delay: i * 1.5,
                }}
              >
                {element.emoji}
              </motion.div>
            ))}
          </motion.div>
        </div>
      </div>
      
      {/* Background Elements */}
      <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none">
        <motion.div 
          className="absolute -top-20 -left-20 w-96 h-96 rounded-full bg-pink-500/5"
        />
        <motion.div 
          className="absolute -bottom-40 -right-20 w-96 h-96 rounded-full bg-purple-500/5"
        />
        <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSI1IiBoZWlnaHQ9IjUiPgo8cmVjdCB3aWR0aD0iNSIgaGVpZ2h0PSI1IiBmaWxsPSIjMjEyMTIxIj48L3JlY3Q+CjxwYXRoIGQ9Ik0wIDVMNSAwWk02IDRMNCA2Wk0tMSAxTDEgLTFaIiBzdHJva2U9IiMyYjJiMmIiIHN0cm9rZS13aWR0aD0iMSI+PC9wYXRoPgo8L3N2Zz4=')] opacity-10"></div>
      </div>
    </main>
  );
}