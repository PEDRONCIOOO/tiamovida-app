"use client";

import { motion } from 'framer-motion';

export default function Footer() {
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2,
        delayChildren: 0.3
      }
    }
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: { y: 0, opacity: 1 }
  };

  const heartVariants = {
    pulse: {
      scale: [1, 1.2, 1],
      transition: { repeat: Infinity, duration: 1.5 }
    }
  };

  return (
    <motion.footer 
      className="py-12 bg-[#030D21] relative overflow-hidden"
      initial={{ opacity: 0, y: 50 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.8 }}
    >
      <div className="absolute inset-0 overflow-hidden">
        <motion.div 
          className="absolute w-64 h-64 rounded-full bg-pink-300 -bottom-32 -right-32 border-3 border-purple-300 opacity-40"
          animate={{ 
            scale: [1, 1.2, 1],
            rotate: [0, 10, 0]
          }}
          transition={{ duration: 10, repeat: Infinity }}
        />
        <motion.div 
          className="absolute w-40 h-40 rounded-full bg-purple-300 border-3 border-pink-300 top-10 -left-20 opacity-40"
          animate={{ 
            scale: [1, 1.3, 1],
            rotate: [0, -10, 0]
          }}
          transition={{ duration: 8, repeat: Infinity }}
        />
      </div>
      
      <div className="container mx-auto px-4 relative z-10">
        <motion.div 
          className="max-w-4xl mx-auto text-center"
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
        >
          <motion.div 
            className="flex justify-center mb-6"
            variants={itemVariants}
          >
            <motion.div 
              className="text-3xl font-bold bg-gradient-to-r from-pink-500 to-purple-500 bg-clip-text text-transparent"
              whileHover={{ scale: 1.05 }}
            >
              Ti
              <motion.span 
                className="text-red-500"
                variants={heartVariants}
                animate="pulse"
              >
                ❤️
              </motion.span>
              Vida
            </motion.div>
          </motion.div>
          
          <motion.div 
            className="flex justify-center space-x-6 mb-8"
            variants={itemVariants}
          >
            {['Instagram', 'Twitter', 'TikTok'].map((social) => (
              <motion.div 
                key={social}
                whileHover={{ scale: 1.2, rotate: 5 }}
                className="w-10 h-10 rounded-full bg-gradient-to-r from-pink-500 to-purple-500 flex items-center justify-center text-white cursor-pointer"
              >
                {social[0]}
              </motion.div>
            ))}
          </motion.div>
          
          <motion.div 
            className="text-gray-500 text-sm"
            variants={itemVariants}
          >
            © 2025 Ti❤️Vida - Todos os direitos reservados
          </motion.div>
          
          <motion.div 
            className="text-xs text-gray-400 mt-2"
            variants={itemVariants}
          >
            Criado com amor para celebrar relacionamentos
          </motion.div>
        </motion.div>
      </div>
    </motion.footer>
  );
}

