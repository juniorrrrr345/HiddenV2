'use client';

import { motion } from 'framer-motion';

interface CategoriesProps {
  selectedCategory: 'all' | 'weed' | 'hash';
  onCategoryChange: (category: 'all' | 'weed' | 'hash') => void;
}

export default function Categories({ selectedCategory, onCategoryChange }: CategoriesProps) {
  const categories = [
    { id: 'all', label: 'TOUT', emoji: '✨' },
    { id: 'weed', label: 'WEED', emoji: '🌲' },
    { id: 'hash', label: 'HASH', emoji: '🍫' }
  ];

  return (
    <div className="px-4 md:px-8 mt-8">
      <h2 className="text-2xl font-bold text-white mb-4">Catégorie</h2>
      <div className="flex gap-3 flex-wrap">
        {categories.map((category) => (
          <motion.button
            key={category.id}
            onClick={() => onCategoryChange(category.id as 'all' | 'weed' | 'hash')}
            className={`px-6 py-3 rounded-full font-medium transition-all ${
              selectedCategory === category.id
                ? 'bg-purple-600 text-white shadow-lg shadow-purple-600/30'
                : 'bg-gray-800/50 text-gray-300 hover:bg-gray-700/50'
            }`}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <span className="mr-2">{category.emoji}</span>
            {category.label}
          </motion.button>
        ))}
      </div>
    </div>
  );
}