"use client";

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Link from 'next/link';

export default function Header() {
  const [language, setLanguage] = useState('PT');
  const [isLangMenuOpen, setIsLangMenuOpen] = useState(false);
  
  const languages = ['PT', 'EN', 'ES'];

  const logoVariants = {
    initial: { opacity: 0, x: -20 },
    animate: { opacity: 1, x: 0, transition: { duration: 0.6 } },
    hover: { 
      scale: 1.05,
      transition: { 
        type: "spring", 
        stiffness: 400, 
        damping: 10 
      } 
    }
  };

  const heartVariants = {
    pulse: {
      scale: [1, 1.2, 1],
      rotate: [0, 5, 0],
      transition: { repeat: Infinity, duration: 1.8 }
    }
  };
  
  const languageMenuVariants = {
    closed: { 
      opacity: 0, 
      height: 0,
      transition: { 
        duration: 0.3, 
        when: "afterChildren" 
      } 
    },
    open: { 
      opacity: 1, 
      height: 'auto',
      transition: { 
        duration: 0.3, 
        when: "beforeChildren",
        staggerChildren: 0.1 
      } 
    }
  };
  
  const langItemVariants = {
    closed: { opacity: 0, y: -5 },
    open: { opacity: 1, y: 0 }
  };

  return (
    <motion.header 
      className="py-4 px-6 md:px-10 bg-gray-800 backdrop-blur-md sticky top-0 z-50 shadow-sm"
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
    >
      <div className="container mx-auto flex justify-between items-center">
        {/* Logo */}
        <Link href="/">
          <motion.div 
            className="flex items-center"
            variants={logoVariants}
            initial="initial"
            animate="animate"
            whileHover="hover"
          >
            <motion.div className="text-2xl font-bold bg-gradient-to-r from-pink-500 to-purple-500 bg-clip-text text-transparent">
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
        </Link>
        
        {/* Language Selector */}
        <div className="relative">
          <motion.div
            className="flex items-center cursor-pointer bg-gradient-to-r from-pink-100 to-purple-100 px-4 py-2 rounded-full"
            whileHover={{ scale: 1.05 }}
            onClick={() => setIsLangMenuOpen(!isLangMenuOpen)}
          >
            <span className="mr-2 text-gray-700 font-medium">{language}</span>
            <motion.div
              animate={{ rotate: isLangMenuOpen ? 180 : 0 }}
              transition={{ duration: 0.3 }}
            >
              <svg 
                xmlns="http://www.w3.org/2000/svg" 
                width="16" 
                height="16" 
                viewBox="0 0 24 24" 
                fill="none" 
                stroke="currentColor" 
                strokeWidth="2" 
                strokeLinecap="round" 
                strokeLinejoin="round"
              >
                <path d="m6 9 6 6 6-6"/>
              </svg>
            </motion.div>
          </motion.div>
          
          <AnimatePresence>
            {isLangMenuOpen && (
              <motion.div
                className="absolute top-full right-0 mt-2 bg-white rounded-lg shadow-lg overflow-hidden w-24"
                variants={languageMenuVariants}
                initial="closed"
                animate="open"
                exit="closed"
              >
                {languages.map(lang => (
                  <motion.div
                    key={lang}
                    className={`py-2 px-4 cursor-pointer hover:bg-pink-50 transition-colors ${language === lang ? 'text-pink-500 font-medium' : 'text-gray-700'}`}
                    onClick={() => {
                      setLanguage(lang);
                      setIsLangMenuOpen(false);
                    }}
                    variants={langItemVariants}
                  >
                    {lang}
                  </motion.div>
                ))}
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </motion.header>
  );
}