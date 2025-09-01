'use client';

import { motion } from 'framer-motion';
import { useRouter } from 'next/navigation';
import { Product } from '@/lib/store';
import { useStore } from '@/lib/store';
import { ShoppingCart } from 'lucide-react';

interface ProductCardProps {
  product: Product;
}

export default function ProductCard({ product }: ProductCardProps) {
  const addToCart = useStore((state) => state.addToCart);
  const router = useRouter();

  const handleAddToCart = (e: React.MouseEvent) => {
    e.stopPropagation(); // Prevent card click
    addToCart(product);
  };

  const handleCardClick = () => {
    router.push(`/products/${product.id}`);
  };

  return (
    <motion.div
      onClick={handleCardClick}
      className="relative bg-gray-900/50 rounded-2xl overflow-hidden glass-effect group cursor-pointer"
      whileHover={{ y: -5 }}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
    >
      {/* Product Image */}
      <div className="relative h-48 md:h-56 bg-gradient-to-br from-purple-900/20 to-purple-600/20 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-t from-gray-900 to-transparent opacity-60"></div>
        
        {/* Tag */}
        {product.tag && (
          <div className={`absolute top-3 left-3 px-3 py-1 rounded-full text-xs font-bold text-white z-10 ${
            product.tagColor === 'red' ? 'bg-red-500' : 'bg-green-500'
          }`}>
            {product.tag}
          </div>
        )}
        
        {/* Country Flag */}
        <div className="absolute top-3 right-3 text-2xl z-10">
          {product.countryFlag}
        </div>

        {/* Placeholder for product image */}
        <div className="w-full h-full flex items-center justify-center">
          <div className="text-6xl opacity-30">🌿</div>
        </div>
      </div>

      {/* Product Info */}
      <div className="p-4">
        <h3 className="text-lg font-bold text-white mb-1">{product.name}</h3>
        <p className="text-sm text-gray-400 mb-3">{product.origin}</p>
        
        <div className="flex items-center justify-center">
          <motion.button
            onClick={handleCardClick}
            className="w-full bg-white text-black font-black py-3 rounded-lg hover:bg-gray-200 transition-colors"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            VOIR DÉTAILS
          </motion.button>
        </div>
      </div>
    </motion.div>
  );
}