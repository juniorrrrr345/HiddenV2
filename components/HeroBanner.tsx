'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

const banners = [
  {
    title: 'NEW RESTOCK CANADIENNE',
    emoji: '🇨🇦',
    tag: 'PREMIUM',
    image: '/hero-1.jpg'
  },
  {
    title: 'DROP! PREMIUM EXOTIC EXPERIENCE',
    emoji: '🌟',
    tag: 'EXOTIC',
    image: '/hero-2.jpg'
  },
  {
    title: 'HASH COLLECTION DISPONIBLE',
    emoji: '🍫',
    tag: 'NOUVEAU',
    image: '/hero-3.jpg'
  }
];

export default function HeroBanner() {
  const [currentBanner, setCurrentBanner] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentBanner((prev) => (prev + 1) % banners.length);
    }, 5000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="relative w-full h-[400px] md:h-[500px] overflow-hidden rounded-2xl mx-4 md:mx-8 mt-4">
      <div className="absolute inset-0 gradient-bg opacity-90"></div>
      
      <AnimatePresence mode="wait">
        <motion.div
          key={currentBanner}
          initial={{ opacity: 0, scale: 1.1 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.9 }}
          transition={{ duration: 0.5 }}
          className="absolute inset-0"
        >
          <div className="relative h-full flex flex-col items-center justify-center text-center px-4">
            <motion.h1 
              className="text-6xl md:text-8xl font-bold text-white mb-4"
              initial={{ y: 30, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.2 }}
            >
              HIDDEN SPINGFIELD
            </motion.h1>
            
            <motion.div 
              className="flex items-center gap-3 mb-8"
              initial={{ y: 30, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.4 }}
            >
              <span className="text-2xl md:text-3xl">{banners[currentBanner].emoji}</span>
              <h2 className="text-xl md:text-2xl text-gray-200">
                {banners[currentBanner].title}
              </h2>
              <span className="bg-black text-white px-3 py-1 rounded-full text-sm font-bold">
                {banners[currentBanner].tag}
              </span>
            </motion.div>

            <motion.div
              className="absolute inset-0 pointer-events-none"
              initial={{ opacity: 0 }}
              animate={{ opacity: 0.3 }}
              transition={{ delay: 0.6 }}
            >
              <div className="absolute right-0 top-1/2 -translate-y-1/2 w-96 h-96 animate-float opacity-50">
                <div className="w-full h-full bg-gradient-to-r from-purple-600 to-pink-600 rounded-full blur-3xl"></div>
              </div>
            </motion.div>
          </div>
        </motion.div>
      </AnimatePresence>

      {/* Carousel indicators */}
      <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2">
        {banners.map((_, index) => (
          <button
            key={index}
            onClick={() => setCurrentBanner(index)}
            className={`w-2 h-2 rounded-full transition-all ${
              index === currentBanner ? 'w-8 bg-white' : 'bg-white/50'
            }`}
          />
        ))}
      </div>
    </div>
  );
}