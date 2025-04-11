"use client";

import { motion } from 'framer-motion';
import Image from 'next/image';
import { useState } from 'react';

export default function HomePage() {
  // State to control which image is in front
  const [showTransformed, setShowTransformed] = useState(true);

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
    <main className="flex items-center justify-center bg-gray-800 text-white overflow-hidden">
      <div className="container mx-auto px-4 md:px-8 py-16 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          {/* Left Content */}
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
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
              className="text-5xl md:text-6xl lg:text-7xl font-extrabold mb-6"
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
              className="text-xl md:text-2xl text-gray-300 mb-8 max-w-xl"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.6 }}
            >
              Descubra a magia de ser o protagonista de uma história de amor única. 
              <span className="bg-gradient-to-r from-pink-400 to-red-400 bg-clip-text text-transparent font-bold"> Surpreenda seu amor</span> com um presente que ficará para sempre em suas memórias.
            </motion.p>
            
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.8 }}
              className="flex flex-col sm:flex-row gap-4"
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
          
          {/* Right Animation/Image */}
          <motion.div
            className="relative h-[400px] md:h-[500px] lg:h-[600px] flex items-center justify-center"
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8, delay: 0.4 }}
          >
            {/* Decorative elements */}
            <motion.div 
              className="absolute w-64 h-64 rounded-full bg-pink-500/10"
              animate={{ 
                scale: [1, 1.2, 1],
                rotate: [0, 45, 0]
              }}
              transition={{ duration: 8, repeat: Infinity }}
            />
            <motion.div 
              className="absolute w-80 h-80 rounded-full bg-purple-500/10"
              animate={{ 
                scale: [1.2, 1, 1.2],
                rotate: [0, -45, 0]
              }}
              transition={{ duration: 10, repeat: Infinity }}
            />
            
            {/* Central elements */}
            <motion.div 
              className="relative z-10 bg-gradient-to-br from-pink-500/20 to-purple-500/20 backdrop-blur-lg rounded-2xl p-6 shadow-2xl border border-white/10"
              animate={{ 
                y: [0, -10, 0]
              }}
              transition={{ duration: 5, repeat: Infinity }}
            >
              <div className="relative w-64 h-64 md:w-80 md:h-80">
                {/* Interactive image selection */}
                <div className="relative w-full h-full">
                  {/* Original image */}
                  <motion.div 
                    className="absolute w-full h-full rounded-xl overflow-hidden bg-gradient-to-br from-pink-300/30 to-purple-300/30 flex items-center justify-center cursor-pointer"
                    initial={{ x: 0 }}
                    animate={{ 
                      x: showTransformed ? -60 : 0,
                      scale: showTransformed ? 0.9 : 1,
                      zIndex: showTransformed ? 0 : 1
                    }}
                    transition={{ duration: 0.5 }}
                    onClick={() => setShowTransformed(false)}
                    style={{ zIndex: showTransformed ? 0 : 1 }}
                  >
                    <Image
                      src="/casaltiamu.png"
                      alt="Casal Original"
                      width={300}
                      height={300}
                      className="relative z-10"
                    />
                    <motion.div 
                      className="absolute -top-3 -right-3"
                      animate={{ 
                        scale: [1, 1.2, 1],
                        rotate: [0, 10, 0],
                        y: [0, -5, 0]
                      }}
                      transition={{ duration: 3, repeat: Infinity }}
                    >
                      <span className="text-4xl">✨</span>
                    </motion.div>
                    {!showTransformed && (
                      <motion.div 
                        className="absolute bottom-3 left-3 z-30 bg-pink-500/80 px-3 py-1 rounded-full text-xs font-bold"
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.3 }}
                      >
                        Original
                      </motion.div>
                    )}
                  </motion.div>
                  
                  {/* Transformed image */}
                  <motion.div 
                    className="absolute w-full h-full rounded-xl overflow-hidden bg-gradient-to-br from-purple-400/30 to-pink-400/30 flex items-center justify-center cursor-pointer shadow-xl border border-white/20"
                    initial={{ x: 0 }}
                    animate={{ 
                      x: showTransformed ? 0 : 60,
                      scale: showTransformed ? 1 : 0.9,
                      zIndex: showTransformed ? 1 : 0
                    }}
                    transition={{ duration: 0.5 }}
                    onClick={() => setShowTransformed(true)}
                    style={{ zIndex: showTransformed ? 1 : 0 }}
                  >
                    <Image
                      src="/casaltiamutransformed.png"
                      alt="Casal Transformado"
                      width={300}
                      height={300}
                      className="relative z-10"
                    />
                    <motion.div 
                      className="absolute inset-0 bg-gradient-to-tr from-pink-500/20 to-purple-500/20 z-20"
                      animate={{ 
                        opacity: [0.3, 0.5, 0.3] 
                      }}
                      transition={{ duration: 3, repeat: Infinity }}
                    />
                    <motion.div 
                      className="absolute -top-3 -left-3 z-30"
                      animate={{ 
                        scale: [1, 1.2, 1],
                        rotate: [0, -10, 0],
                        y: [0, -5, 0]
                      }}
                      transition={{ duration: 3, repeat: Infinity }}
                    >
                      <span className="text-4xl">✨</span>
                    </motion.div>
                    {showTransformed && (
                      <motion.div 
                        className="absolute bottom-3 right-3 z-30 bg-pink-500/80 px-3 py-1 rounded-full text-xs font-bold"
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.3 }}
                      >
                        Transformado!
                      </motion.div>
                    )}
                  </motion.div>
                  
                  {/* Click indicator */}
                  <motion.div
                    className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 z-30 pointer-events-none"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: [0, 0.7, 0] }}
                    transition={{ duration: 2, repeat: Infinity, repeatDelay: 3 }}
                  >
                    <div className="bg-white/30 backdrop-blur-sm px-4 py-2 rounded-full text-white text-sm font-medium">
                      Clique para alternar
                    </div>
                  </motion.div>
                </div>
              </div>
            </motion.div>
            
            {/* Floating elements with fixed positions to avoid hydration errors */}
            {floatingElements.map((element, i) => (
              <motion.div
                key={i}
                className="absolute text-2xl"
                style={{ top: element.top, left: element.left }}
                animate={{
                  y: [-20, -60, -20],
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