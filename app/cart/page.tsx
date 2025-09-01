'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { ArrowLeft, Plus, Minus, Trash2 } from 'lucide-react';

export default function CartPage() {
  const router = useRouter();
  const [cart, setCart] = useState<any[]>([]);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    loadCart();
  }, []);

  const loadCart = () => {
    if (typeof window !== 'undefined') {
      const cartData = JSON.parse(localStorage.getItem('cart') || '[]');
      setCart(cartData);
    }
  };

  const updateQuantity = (index: number, newQuantity: number) => {
    if (newQuantity <= 0) {
      removeFromCart(index);
      return;
    }
    
    const updatedCart = [...cart];
    updatedCart[index].quantity = newQuantity;
    setCart(updatedCart);
    
    if (typeof window !== 'undefined') {
      localStorage.setItem('cart', JSON.stringify(updatedCart));
      window.dispatchEvent(new Event('cartUpdated'));
    }
  };

  const removeFromCart = (index: number) => {
    const updatedCart = cart.filter((_, i) => i !== index);
    setCart(updatedCart);
    
    if (typeof window !== 'undefined') {
      localStorage.setItem('cart', JSON.stringify(updatedCart));
      window.dispatchEvent(new Event('cartUpdated'));
    }
  };

  const clearCart = () => {
    setCart([]);
    if (typeof window !== 'undefined') {
      localStorage.removeItem('cart');
      window.dispatchEvent(new Event('cartUpdated'));
    }
  };

  const getTotalPrice = () => {
    return cart.reduce((total, item) => total + (item.price * item.quantity), 0);
  };

  if (!mounted) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <div className="text-white text-xl">Chargement du panier...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-black text-white">
      {/* Header */}
      <header className="bg-gray-900 p-4 sticky top-0 z-50">
        <div className="max-w-6xl mx-auto flex items-center justify-between">
          <button 
            onClick={() => router.push('/')}
            className="flex items-center space-x-2 text-gray-400 hover:text-white transition-colors"
          >
            <ArrowLeft className="w-5 h-5" />
            <span>Retour</span>
          </button>
          
          <div className="text-center">
            <h1 className="text-xl font-bold">MON PANIER</h1>
            <p className="text-xs text-gray-400">{cart.length} article{cart.length > 1 ? 's' : ''}</p>
          </div>
          
          <div className="w-16"></div> {/* Spacer */}
        </div>
      </header>

      <div className="max-w-4xl mx-auto p-4">
        {cart.length === 0 ? (
          /* Panier vide */
          <div className="text-center py-12">
            <div className="text-6xl mb-4">🛒</div>
            <h2 className="text-2xl font-bold mb-4">Votre panier est vide</h2>
            <p className="text-gray-400 mb-8">Découvrez nos produits et ajoutez-les à votre panier</p>
            <button 
              onClick={() => router.push('/')}
              className="bg-blue-600 hover:bg-blue-700 px-6 py-3 rounded-lg font-bold"
            >
              Continuer mes achats
            </button>
          </div>
        ) : (
          /* Panier avec produits */
          <div className="space-y-6">
            {/* Articles */}
            <div className="space-y-4">
              {cart.map((item, index) => (
                <div key={index} className="bg-gray-900 rounded-lg p-4 flex items-center space-x-4">
                  {/* Image */}
                  <div className="w-16 h-16 bg-gray-800 rounded-lg overflow-hidden flex-shrink-0">
                    {item.image ? (
                      <img src={item.image} alt={item.name} className="w-full h-full object-cover" />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-gray-500">
                        📦
                      </div>
                    )}
                  </div>
                  
                  {/* Info */}
                  <div className="flex-1">
                    <h3 className="font-bold">{item.name}</h3>
                    <p className="text-sm text-gray-400">{item.weight}</p>
                    <p className="text-green-400 font-bold">{item.price}€</p>
                  </div>
                  
                  {/* Quantité */}
                  <div className="flex items-center space-x-2">
                    <button 
                      onClick={() => updateQuantity(index, item.quantity - 1)}
                      className="bg-gray-700 hover:bg-gray-600 w-8 h-8 rounded-full flex items-center justify-center"
                    >
                      <Minus size={16} />
                    </button>
                    <span className="w-8 text-center">{item.quantity}</span>
                    <button 
                      onClick={() => updateQuantity(index, item.quantity + 1)}
                      className="bg-gray-700 hover:bg-gray-600 w-8 h-8 rounded-full flex items-center justify-center"
                    >
                      <Plus size={16} />
                    </button>
                  </div>
                  
                  {/* Supprimer */}
                  <button 
                    onClick={() => removeFromCart(index)}
                    className="bg-red-600 hover:bg-red-700 w-8 h-8 rounded-full flex items-center justify-center"
                  >
                    <Trash2 size={16} />
                  </button>
                </div>
              ))}
            </div>

            {/* Total */}
            <div className="bg-gray-900 rounded-lg p-6">
              <div className="flex justify-between items-center mb-4">
                <span className="text-xl font-bold">Total</span>
                <span className="text-2xl font-bold text-green-400">{getTotalPrice()}€</span>
              </div>
              
              <div className="space-y-3">
                <button 
                  onClick={() => {
                    alert('🚀 Commande envoyée !');
                    clearCart();
                  }}
                  className="w-full bg-green-600 hover:bg-green-700 py-3 rounded-lg font-bold"
                >
                  🚀 Commander
                </button>
                
                <button 
                  onClick={clearCart}
                  className="w-full bg-red-600 hover:bg-red-700 py-2 rounded-lg font-bold"
                >
                  🗑️ Vider le panier
                </button>
                
                <button 
                  onClick={() => router.push('/')}
                  className="w-full bg-gray-700 hover:bg-gray-600 py-2 rounded-lg font-bold"
                >
                  ← Continuer mes achats
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}