'use client'

import Image from 'next/image'
import { motion } from 'framer-motion'

const cards = [
  {
    src: '/tiktok1.webp',
    username: '@zoemeireles',
    likes: '3.412',
    views: '44.9M'
  },
  {
    src: '/tiktok2.webp',
    username: '@luuscas.limaa',
    likes: '10.3M',
    views: '132.9M'
  },
  {
    src: '/tiktok3.webp',
    username: '@tata.coque',
    likes: '3.880',
    views: '104K'
  }
]

export default function Hero4() {
  return (
    <section className="bg-[#0A0A1F] text-white py-16 px-4">
      <div className="max-w-7xl mx-auto text-center">
        <motion.h2
          className="text-3xl sm:text-4xl md:text-5xl font-bold"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
        >
          Surpresas que <span className="text-pink-500">viralizaram</span>
        </motion.h2>

        <motion.div
          className="mt-12 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-8"
          initial="hidden"
          animate="visible"
          variants={{
            visible: {
              transition: {
                staggerChildren: 0.2
              }
            }
          }}
        >
          {cards.map((card, index) => (
            <motion.div
              key={index}
              className="bg-black/20 rounded-2xl overflow-hidden shadow-lg border border-white/10 backdrop-blur-sm"
              whileHover={{ scale: 1.05 }}
              transition={{ type: 'spring', stiffness: 200, damping: 20 }}
            >
              <Image
                src={card.src}
                alt={`TikTok ${index + 1}`}
                width={500}
                height={1000}
                className="w-full h-full object-cover"
              />
              <div className="p-4 text-left">
                <p className="text-sm text-white/70">{card.views} views · {card.likes} likes</p>
                <p className="text-base font-medium mt-1 text-white">{card.username}</p>
              </div>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  )
}
