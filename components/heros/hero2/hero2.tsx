'use client'

import { motion } from 'framer-motion'
import Image from 'next/image'
import Link from 'next/link';
import { useState } from 'react'

export default function Hero2() {
  const [activeStep, setActiveStep] = useState(0);
  
  // Predefined floating hearts with fixed positions to prevent hydration errors
  const floatingHearts = [
    { 
      left: "15%", 
      startX: "20%", 
      endX: "55%", 
      duration: 18, 
      delay: 0 
    },
    { 
      left: "25%", 
      startX: "30%", 
      endX: "65%", 
      duration: 22, 
      delay: 5 
    },
    { 
      left: "40%", 
      startX: "45%", 
      endX: "30%", 
      duration: 19, 
      delay: 8 
    },
    { 
      left: "60%", 
      startX: "65%", 
      endX: "45%", 
      duration: 23, 
      delay: 4 
    },
    { 
      left: "75%", 
      startX: "70%", 
      endX: "85%", 
      duration: 20, 
      delay: 7 
    },
    { 
      left: "85%", 
      startX: "90%", 
      endX: "75%", 
      duration: 21, 
      delay: 2 
    }
  ];
  
  const steps = [
    {
      title: "1. Preencha os dados",
      image: "/form.webp",
      alt: "Formulário",
      width: 250,
      height: 160,
      description: "Informe detalhes para personalizar sua surpresa"
    },
    {
      title: "2. Faça o pagamento",
      image: "/coin.webp",
      alt: "Pagamento",
      width: 100,
      height: 100,
      description: "Escolha a forma de pagamento que preferir"
    },
    {
      title: "3. Receba o seu site + QR Code",
      image: "/email-phone.webp",
      alt: "Email com QR Code",
      width: 140,
      height: 200,
      description: "Enviamos tudo diretamente para seu email"
    },
    {
      title: "4. Surpreenda seu amor",
      image: "/tela-final.png",
      alt: "Surpresa final",
      width: 150,
      height: 230,
      description: "Compartilhe e crie um momento especial"
    }
  ];

  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden px-4 py-24">
      <div className="absolute inset-0"></div>

      {/* Fixed floating hearts */}
      <div className="absolute inset-0 overflow-hidden">
        {floatingHearts.map((heart, i) => (
          <motion.div
            key={i}
            initial={{ y: '100%', opacity: 0 }}
            animate={{ 
              y: ['-100%'], 
              opacity: [0, 1, 0],
              x: [heart.startX, heart.endX]
            }}
            transition={{ 
              duration: heart.duration,
              repeat: Infinity,
              delay: heart.delay
            }}
            className="absolute"
            style={{ left: heart.left }}
          >
            <span className="text-pink-500 text-opacity-30 text-4xl">❤️</span>
          </motion.div>
        ))}
      </div>

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 1.5 }}
        className="max-w-6xl w-full z-10"
      >
        {/* Section title */}
        <motion.div 
          className="text-center mb-16"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
        >
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            <span className="bg-gradient-to-r from-pink-500 to-purple-500 bg-clip-text text-transparent">Como funciona</span>
          </h2>
          <p className="text-gray-300 max-w-2xl mx-auto">
            Crie momentos especiais em apenas 4 passos simples
          </p>
        </motion.div>

        {/* Connected step cards */}
        <div className="relative">
          {/* Connection lines */}
          <div className="hidden md:block absolute top-1/2 left-0 w-full h-1 bg-gradient-to-r from-pink-500/30 via-purple-500/30 to-pink-500/30 -translate-y-1/2 z-0"></div>
          
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 md:gap-4 relative z-10">
            {steps.map((step, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.2 }}
                whileHover={{ 
                  scale: 1.05,
                  boxShadow: "0 20px 25px -5px rgba(0, 0, 0, 0.2), 0 8px 10px -6px rgba(0, 0, 0, 0.2)"
                }}
                onClick={() => setActiveStep(index)}
                className={`relative flex flex-col items-center p-6 rounded-xl backdrop-blur-sm border transition-all duration-300 cursor-pointer ${
                  activeStep === index 
                    ? 'border-pink-500 bg-gradient-to-br from-pink-500/20 to-purple-500/20'
                    : 'border-gray-700/50 hover:border-pink-400/50 bg-black/20'
                }`}
              >
                {/* Step number indicator */}
                <motion.div 
                  className={`absolute -top-5 w-10 h-10 rounded-full flex items-center justify-center font-bold text-lg z-10 ${
                    activeStep === index 
                      ? 'bg-pink-500 text-white'
                      : 'bg-gray-800 text-gray-400'
                  }`}
                  animate={activeStep === index ? {
                    scale: [1, 1.2, 1],
                    boxShadow: [
                      "0 0 0 0 rgba(236, 72, 153, 0)",
                      "0 0 0 10px rgba(236, 72, 153, 0.3)",
                      "0 0 0 0 rgba(236, 72, 153, 0)"
                    ],
                  } : {}}
                  transition={{ repeat: activeStep === index ? Infinity : 0, duration: 2 }}
                >
                  {index + 1}
                </motion.div>

                {/* Connector dots on larger screens */}
                {index < steps.length - 1 && (
                  <div className="hidden md:block absolute -right-6 top-1/2 transform -translate-y-1/2 z-20">
                    <motion.div 
                      className="w-8 h-8 bg-gradient-to-r from-pink-500 to-purple-500 rounded-full flex items-center justify-center"
                      animate={{ scale: [0.8, 1, 0.8], rotate: [0, 180, 360] }}
                      transition={{ repeat: Infinity, duration: 5 }}
                    >
                      <svg className="w-4 h-4 text-white" fill="currentColor" viewBox="0 0 16 16">
                        <path fillRule="evenodd" d="M4.646 1.646a.5.5 0 0 1 .708 0l6 6a.5.5 0 0 1 0 .708l-6 6a.5.5 0 0 1-.708-.708L10.293 8 4.646 2.354a.5.5 0 0 1 0-.708z"/>
                      </svg>
                    </motion.div>
                  </div>
                )}
                
                {/* Image container with animation */}
                <motion.div 
                  className="h-[140px] flex items-center justify-center mb-4"
                  animate={activeStep === index ? {
                    y: [0, -10, 0],
                  } : {}}
                  transition={{ repeat: activeStep === index ? Infinity : 0, duration: 3 }}
                >
                  <Image
                    src={step.image}
                    alt={step.alt}
                    width={step.width}
                    height={step.height}
                    draggable="false"
                    className="object-contain max-h-full"
                    style={{
                      width: 'auto',
                      maxHeight: '100%'
                    }}
                  />
                </motion.div>
                
                {/* Text content */}
                <div className="text-center">
                  <h3 className="font-semibold mb-2">
                    {step.title.split('.')[1]}
                  </h3>
                  <p className="text-sm text-gray-400">{step.description}</p>
                </div>

                {/* Progress indicator */}
                {activeStep === index && (
                  <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: "100%" }}
                    transition={{ duration: 3, repeat: Infinity }}
                    className="absolute bottom-0 left-0 h-1 bg-gradient-to-r from-pink-500 to-purple-500"
                  />
                )}
              </motion.div>
            ))}
          </div>
        </div>

        {/* Call to action */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1.2, duration: 0.8 }}
          className="mt-16 text-center"
        >
          <Link
          href="/create"
          className="px-8 py-3 rounded-full bg-gradient-to-r from-pink-500 to-purple-600 text-white font-medium hover:shadow-lg hover:shadow-pink-500/30 transition-all duration-300 transform hover:-translate-y-1">
            Comece Agora
          </Link>
        </motion.div>
      </motion.div>
    </section>
  )
}
