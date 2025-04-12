'use client'

import { motion, AnimatePresence } from 'framer-motion';
import Link from 'next/link';
import { useState } from 'react';

interface FAQItem {
  question: string;
  answer: React.ReactNode;
}

export default function HeroFAQ() {
  const [openItem, setOpenItem] = useState<number | null>(null);
  
  const faqItems: FAQItem[] = [
    {
      question: "O que é o tiamovida?",
      answer: "tiamovida é uma plataforma que permite criar páginas personalizadas de relacionamento para casais. Você pode adicionar fotos, uma mensagem especial e um contador que mostra há quanto tempo vocês estão juntos. Perfeito para presentes surpresa."
    },
    {
      question: "Quanto tempo demora para ficar pronto?",
      answer: "O site fica pronto imediatamente após o pagamento."
    },
    {
      question: "Posso trocar as fotos depois?",
      answer: "No plano Premium você pode modificar as fotos a qualquer momento."
    },
    {
      question: "É um pagamento único?",
      answer: "Sim! Você paga apenas uma vez e tem acesso conforme o plano escolhido."
    },
    {
      question: "Quais os métodos de pagamento?",
      answer: <>Nós utilizamos a <Link href="https://stripe.com" target="_blank" className="text-pink-500 hover:text-pink-400 transition-colors font-medium">Stripe</Link>. Suportamos PIX e Cartões de Crédito.</>
    },
    {
      question: "A página personalizada tem validade?",
      answer: "No preço básico sim, 1 ano. No plano avançado é eterna (faça um chaveiro rsrs)."
    },
    {
      question: "Como posso entrar em contato com o suporte a cliente?",
      answer: <>Você pode nos encontrar em nosso <Link className="text-pink-500 hover:text-pink-400 transition-colors font-medium" href="https://telegram.com/tiamovida-app">Telegram.</Link></>
    }
  ];

  const toggleItem = (index: number) => {
    setOpenItem(openItem === index ? null : index);
  };

  // Background animations for decoration
  const floatingElements = [
    { emoji: "❓", top: "10%", left: "3%", size: "text-xl" },
    { emoji: "💡", top: "70%", left: "5%", size: "text-2xl" },
    { emoji: "❤️", top: "20%", left: "93%", size: "text-xl" },
    { emoji: "💬", top: "80%", left: "95%", size: "text-xl" }
  ];

  return (
    <section className="py-16 md:py-20 px-4 relative overflow-hidden">
      {/* Background decorations */}
      {floatingElements.map((element, i) => (
        <motion.div
          key={i}
          className={`absolute ${element.size} opacity-10`}
          style={{ top: element.top, left: element.left }}
          animate={{
            y: [0, -15, 0],
            x: [0, 5, 0],
            rotate: [0, i % 2 === 0 ? 10 : -10, 0],
            scale: [1, 1.1, 1],
          }}
          transition={{
            duration: 5 + i,
            repeat: Infinity,
            repeatType: "reverse",
          }}
        >
          {element.emoji}
        </motion.div>
      ))}

      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.7 }}
        className="text-center mb-12 max-w-3xl mx-auto"
      >
        <motion.span 
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.2, duration: 0.5 }}
          className="px-4 py-1.5 rounded-full bg-pink-500/20 text-pink-400 text-sm font-medium inline-block mb-4"
        >
          Tire suas dúvidas
        </motion.span>
        
        <motion.h2 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3, duration: 0.7 }}
          className="text-3xl md:text-4xl font-bold mb-4 bg-gradient-to-r from-white via-pink-200 to-white bg-clip-text text-transparent"
        >
          Perguntas Frequentes
        </motion.h2>
        
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.4, duration: 0.7 }}
          className="text-gray-300 max-w-2xl mx-auto"
        >
          Tudo que você precisa saber sobre o tiamovida e como ele pode criar momentos especiais para você e seu amor.
        </motion.p>
      </motion.div>

      {/* FAQ Items */}
      <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.5, duration: 0.7 }}
        className="max-w-3xl mx-auto"
      >
        {faqItems.map((item, index) => (
          <motion.div
            key={index}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 + index * 0.1, duration: 0.5 }}
            className="mb-4"
          >
            <motion.div
              className={`bg-gradient-to-br ${
                openItem === index
                  ? 'from-[#1a2b4d]/80 to-[#2a3c5d]/80 border-pink-500'
                  : 'from-[#1a2b4d]/40 to-[#1a2b4d]/20 border-gray-700/50'
              } backdrop-blur-sm rounded-xl border p-0.5 overflow-hidden transition-colors duration-300`}
              animate={{
                boxShadow: openItem === index 
                  ? '0 4px 20px rgba(236, 72, 153, 0.15)' 
                  : '0 0 0 rgba(0,0,0,0)'
              }}
            >
              <div className="p-4 rounded-xl bg-[#0e1b37]/80">
                {/* Question */}
                <button 
                  onClick={() => toggleItem(index)}
                  className="w-full flex justify-between items-center text-left"
                  aria-expanded={openItem === index}
                  aria-controls={`faq-answer-${index}`}
                >
                  <motion.span 
                    className="text-white font-medium text-lg flex-1"
                    animate={{
                      color: openItem === index ? '#ec4899' : '#ffffff'
                    }}
                    transition={{ duration: 0.3 }}
                  >
                    {item.question}
                  </motion.span>
                  <motion.div
                    animate={{ rotate: openItem === index ? 45 : 0 }}
                    transition={{ duration: 0.3, type: "spring" }}
                    className={`flex items-center justify-center w-7 h-7 rounded-full ${
                      openItem === index ? 'bg-pink-500/20 text-pink-400' : 'bg-white/10'
                    } transition-colors duration-300`}
                  >
                    <svg width="14" height="14" viewBox="0 0 14 14" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <path d="M7 1V13" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
                      <path d="M1 7H13" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
                    </svg>
                  </motion.div>
                </button>
                
                {/* Answer */}
                <AnimatePresence>
                  {openItem === index && (
                    <motion.div
                      id={`faq-answer-${index}`}
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: "auto", opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.3, ease: "easeInOut" }}
                      className="overflow-hidden"
                    >
                      <motion.div
                        initial={{ y: -10 }}
                        animate={{ y: 0 }}
                        exit={{ y: -10 }}
                        transition={{ duration: 0.3 }}
                        className="pt-4 mt-2 border-t border-gray-700/30 text-gray-300"
                      >
                        {item.answer}
                      </motion.div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </motion.div>
          </motion.div>
        ))}
      </motion.div>

      {/* Contact CTA */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 1.2, duration: 0.7 }}
        className="mt-12 text-center"
      >
        <p className="text-gray-400 mb-4">Ainda tem dúvidas? Fale com a gente!</p>
        <motion.a
          href="https://telegram.com/tiamovida-app"
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-pink-500 to-pink-600 hover:from-pink-400 hover:to-pink-500 rounded-full text-white font-semibold shadow-lg shadow-pink-500/30 transition-all duration-300"
          whileHover={{ scale: 1.03 }}
          whileTap={{ scale: 0.98 }}
        >
          <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" viewBox="0 0 16 16">
            <path d="M16 8A8 8 0 1 1 0 8a8 8 0 0 1 16 0zM8.287 5.906c-.778.324-2.334.994-4.666 2.01-.378.15-.577.298-.595.442-.03.243.275.339.69.47l.175.055c.408.133.958.288 1.243.294.26.006.549-.1.868-.32 2.179-1.471 3.304-2.214 3.374-2.23.05-.012.12-.026.166.016.047.041.042.12.037.141-.03.129-1.227 1.241-1.846 1.817-.193.18-.33.307-.358.336a8.154 8.154 0 0 1-.188.186c-.38.366-.664.64.015 1.088.327.216.589.393.85.571.284.194.568.387.936.629.093.06.183.125.27.187.331.236.63.448.997.414.214-.02.435-.22.547-.82.265-1.417.786-4.486.906-5.751a1.426 1.426 0 0 0-.013-.315.337.337 0 0 0-.114-.217.526.526 0 0 0-.31-.093c-.3.005-.763.166-2.984 1.09z"/>
          </svg>
          Conversar no Telegram
        </motion.a>
      </motion.div>
    </section>
  );
}