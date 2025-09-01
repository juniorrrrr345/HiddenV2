'use client';

import { useState, useEffect } from 'react';
import { ShoppingBag, Home, Instagram, Send } from 'lucide-react';

export default function SimpleShop() {
  const [mounted, setMounted] = useState(false);
  const [products, setProducts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setMounted(true);
    loadProducts();
  }, []);

  const loadProducts = async () => {
    try {
      const response = await fetch('/api/products');
      if (response.ok) {
        const data = await response.json();
        setProducts(data);
      }
    } catch (error) {
      console.error('Error loading products:', error);
    } finally {
      setLoading(false);
    }
  };

  if (!mounted) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <div className="text-white text-xl">Chargement de HIDDEN SPINGFIELD...</div>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <div className="text-white text-xl">Chargement des produits...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-black text-white">
      {/* Header */}
      <header className="bg-gray-900 p-4">
        <div className="max-w-6xl mx-auto flex items-center justify-between">
          <h1 className="text-2xl font-bold">HIDDEN SPINGFIELD</h1>
          <div className="flex items-center space-x-4">
            <Home className="w-6 h-6" />
            <ShoppingBag className="w-6 h-6" />
          </div>
        </div>
      </header>

      {/* Banner */}
      <div className="bg-gradient-to-r from-purple-600 to-blue-600 p-8 text-center">
        <h2 className="text-3xl font-bold mb-2">NOUVEAU DROP</h2>
        <p className="text-lg">Découvrez nos produits premium de qualité exceptionnelle</p>
      </div>

      {/* Products Grid */}
      <main className="max-w-6xl mx-auto p-4">
        <h3 className="text-2xl font-bold mb-6">Nos Produits</h3>
        
        {products.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-gray-400 text-lg">Aucun produit disponible pour le moment</p>
            <p className="text-gray-500 mt-2">Les produits seront bientôt ajoutés</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {products.map((product) => (
              <div key={product.id} className="bg-gray-900 rounded-lg overflow-hidden shadow-lg">
                {/* Image */}
                <div className="aspect-square bg-gray-800 flex items-center justify-center">
                  {product.image ? (
                    <img 
                      src={product.image} 
                      alt={product.name}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="text-gray-400 text-4xl">📦</div>
                  )}
                </div>
                
                {/* Content */}
                <div className="p-4">
                  <h4 className="font-bold text-lg mb-2">{product.name}</h4>
                  <p className="text-gray-400 text-sm mb-2">{product.origin}</p>
                  <p className="text-green-400 font-bold text-xl">{product.price}€</p>
                  
                  {product.tag && (
                    <span className={`inline-block mt-2 px-2 py-1 text-xs rounded ${
                      product.tagColor === 'red' ? 'bg-red-600' : 'bg-green-600'
                    }`}>
                      {product.tag}
                    </span>
                  )}
                  
                  <div className="mt-3 flex items-center justify-between">
                    <span className="text-sm">{product.countryFlag} {product.country}</span>
                    <button className="bg-blue-600 hover:bg-blue-700 px-4 py-2 rounded text-sm">
                      Voir détails
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </main>

      {/* Footer */}
      <footer className="bg-gray-900 p-8 mt-12">
        <div className="max-w-6xl mx-auto text-center">
          <h4 className="text-xl font-bold mb-4">HIDDEN SPINGFIELD</h4>
          <div className="flex justify-center space-x-6">
            <a href="#" className="flex items-center space-x-2 text-gray-400 hover:text-white">
              <Instagram className="w-5 h-5" />
              <span>Instagram</span>
            </a>
            <a href="#" className="flex items-center space-x-2 text-gray-400 hover:text-white">
              <Send className="w-5 h-5" />
              <span>Telegram</span>
            </a>
          </div>
          <p className="text-gray-500 mt-4">© 2024 HIDDEN SPINGFIELD - Boutique Premium</p>
        </div>
      </footer>
    </div>
  );
}