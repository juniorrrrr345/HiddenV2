'use client';

import { useState } from 'react';
import { X, Plus, Minus, ShoppingCart } from 'lucide-react';

interface Product {
  _id: string;
  name: string;
  image: string;
  price: number;
  quantity: number;
  category: string;
  description?: string;
}

interface ProductModalProps {
  product: Product;
  onClose: () => void;
  onAddToCart: (product: Product, quantity: number) => void;
}

export default function ProductModal({ product, onClose, onAddToCart }: ProductModalProps) {
  const [quantity, setQuantity] = useState(1);

  const handleAddToCart = () => {
    onAddToCart(product, quantity);
    onClose();
  };

  const increaseQuantity = () => {
    if (quantity < product.quantity) {
      setQuantity(quantity + 1);
    }
  };

  const decreaseQuantity = () => {
    if (quantity > 1) {
      setQuantity(quantity - 1);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop */}
      <div 
        className="absolute inset-0 bg-black/80 backdrop-blur-sm"
        onClick={onClose}
      />
      
      {/* Modal */}
      <div className="relative bg-gray-900 rounded-2xl max-w-md w-full max-h-[90vh] overflow-y-auto">
        {/* Close button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 z-10 bg-black/50 p-2 rounded-full hover:bg-black/70 transition-colors"
        >
          <X size={20} />
        </button>

        {/* Product image */}
        <div className="aspect-square relative">
          <img
            src={product.image || '/placeholder.jpg'}
            alt={product.name}
            className="w-full h-full object-cover rounded-t-2xl"
          />
        </div>

        {/* Product details */}
        <div className="p-6 space-y-4">
          <div>
            <h2 className="text-2xl font-bold text-white">{product.name}</h2>
            {product.description && (
              <p className="text-gray-400 mt-2">{product.description}</p>
            )}
          </div>

          {/* Price */}
          <div className="text-3xl font-bold text-purple-400">
            {product.price}€
          </div>

          {/* Stock status */}
          <div className="text-sm">
            {product.quantity > 0 ? (
              <span className="text-green-400">✓ En stock ({product.quantity} disponibles)</span>
            ) : (
              <span className="text-red-400">✗ Rupture de stock</span>
            )}
          </div>

          {product.quantity > 0 && (
            <>
              {/* Quantity selector */}
              <div className="flex items-center justify-between bg-gray-800 rounded-lg p-2">
                <span className="text-gray-400 ml-2">Quantité:</span>
                <div className="flex items-center gap-3">
                  <button
                    onClick={decreaseQuantity}
                    className="w-8 h-8 bg-gray-700 hover:bg-gray-600 rounded-lg flex items-center justify-center transition-colors"
                    disabled={quantity <= 1}
                  >
                    <Minus size={16} />
                  </button>
                  <span className="text-xl font-semibold w-12 text-center">
                    {quantity}
                  </span>
                  <button
                    onClick={increaseQuantity}
                    className="w-8 h-8 bg-gray-700 hover:bg-gray-600 rounded-lg flex items-center justify-center transition-colors"
                    disabled={quantity >= product.quantity}
                  >
                    <Plus size={16} />
                  </button>
                </div>
              </div>

              {/* Total price */}
              <div className="flex justify-between items-center text-lg">
                <span className="text-gray-400">Total:</span>
                <span className="text-2xl font-bold text-white">
                  {(product.price * quantity).toFixed(2)}€
                </span>
              </div>

              {/* Add to cart button */}
              <button
                onClick={handleAddToCart}
                className="w-full bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white font-bold py-4 rounded-lg flex items-center justify-center gap-2 transition-all transform hover:scale-105"
              >
                <ShoppingCart size={20} />
                Ajouter au panier
              </button>
            </>
          )}
        </div>
      </div>
    </div>
  );
}