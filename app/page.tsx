'use client';

import { useState, useEffect } from 'react';

export default function Home() {
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
        <div className="text-white text-xl">Chargement...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-black text-white">
      {/* Header */}
      <header className="bg-gray-900 p-4">
        <div className="max-w-6xl mx-auto flex items-center justify-between">
          <h1 className="text-3xl font-bold">HIDDEN SPINGFIELD</h1>
          <div className="flex space-x-4">
            <a href="/admin" className="bg-gray-700 hover:bg-gray-600 px-4 py-2 rounded">
              Admin
            </a>
            <a href="/debug" className="bg-blue-600 hover:bg-blue-700 px-4 py-2 rounded">
              Debug
            </a>
          </div>
        </div>
      </header>

      {/* Hero */}
      <div className="bg-gradient-to-r from-purple-600 to-blue-600 p-12 text-center">
        <h2 className="text-4xl font-bold mb-4">NOUVEAU DROP</h2>
        <p className="text-xl">Découvrez nos produits premium de qualité exceptionnelle</p>
      </div>

      {/* Products */}
      <main className="max-w-6xl mx-auto p-6">
        <h3 className="text-2xl font-bold mb-8">Nos Produits</h3>
        
        {loading ? (
          <div className="text-center py-12">
            <div className="text-xl">Chargement des produits...</div>
          </div>
        ) : products.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-gray-400 text-lg mb-4">Aucun produit disponible</p>
            <a href="/admin" className="bg-blue-600 hover:bg-blue-700 px-6 py-3 rounded-lg">
              Ajouter des produits
            </a>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {products.map((product) => (
              <div key={product.id} className="bg-gray-900 rounded-lg overflow-hidden shadow-lg hover:shadow-xl transition-shadow">
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
                  <p className="text-gray-400 text-sm mb-2">
                    {product.countryFlag} {product.origin || product.country}
                  </p>
                  <p className="text-green-400 font-bold text-xl mb-3">{product.price}€</p>
                  
                  {product.tag && (
                    <span className={`inline-block px-2 py-1 text-xs rounded font-bold ${
                      product.tagColor === 'red' ? 'bg-red-600' : 'bg-green-600'
                    }`}>
                      {product.tag}
                    </span>
                  )}
                  
                  <div className="mt-4 flex justify-between items-center">
                    <span className="text-sm text-gray-400">Stock: {product.quantity}</span>
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
          <h4 className="text-2xl font-bold mb-4">HIDDEN SPINGFIELD</h4>
          <p className="text-gray-400">Boutique Premium de Cannabis</p>
          <div className="mt-4 text-sm text-gray-500">
            © 2024 HIDDEN SPINGFIELD - Tous droits réservés
          </div>
        </div>
      </footer>
    </div>
  );
}