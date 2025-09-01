'use client';

import { useState } from 'react';
import HeroBanner from '@/components/HeroBanner';
import Categories from '@/components/Categories';
import ProductCard from '@/components/ProductCard';
import BottomNav from '@/components/BottomNav';
import { products } from '@/lib/products';
import { motion } from 'framer-motion';

export default function HomePage() {
  const [selectedCategory, setSelectedCategory] = useState<'all' | 'weed' | 'hash'>('all');

  const filteredProducts = selectedCategory === 'all' 
    ? products 
    : products.filter(p => p.category === selectedCategory);

  return (
    <main className="min-h-screen pb-20">
      {/* Header */}
      <motion.header 
        className="py-4 px-4 md:px-8"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <div className="flex justify-center">
          <h1 className="text-3xl font-bold text-gradient">HIDDEN SPINGFIELD</h1>
        </div>
      </motion.header>

      {/* Hero Banner */}
      <HeroBanner />

      {/* Categories */}
      <Categories 
        selectedCategory={selectedCategory}
        onCategoryChange={setSelectedCategory}
      />

      {/* Products Grid */}
      <div className="px-4 md:px-8 mt-8">
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {filteredProducts.map((product, index) => (
            <motion.div
              key={product.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
            >
              <ProductCard product={product} />
            </motion.div>
          ))}
        </div>
      </div>

      {/* Bottom Navigation */}
      <BottomNav />
    </main>
  );
}