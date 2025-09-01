'use client';

import { useState, useEffect } from 'react';
import { ShoppingBag, Package } from 'lucide-react';

export default function StableShop() {
  const [mounted, setMounted] = useState(false);
  const [products, setProducts] = useState<any[]>([]);
  const [settings, setSettings] = useState<any>({ shopName: 'HIDDEN SPINGFIELD' });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setMounted(true);
    loadData();
  }, []);

  const loadData = async () => {
    try {
      // Charger les produits
      const productsRes = await fetch('/api/products');
      if (productsRes.ok) {
        const productsData = await productsRes.json();
        setProducts(productsData);
      }

      // Charger les settings
      const settingsRes = await fetch('/api/settings');
      if (settingsRes.ok) {
        const settingsData = await settingsRes.json();
        setSettings({
          shopName: settingsData.shop_title || 'HIDDEN SPINGFIELD',
          backgroundImage: settingsData.background_image,
          bannerText: settingsData.scrolling_text || 'NOUVEAU DROP'
        });
      }
    } catch (error) {
      console.error('Error loading data:', error);
    } finally {
      setLoading(false);
    }
  };

  if (!mounted) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <div className="text-white text-xl">Chargement HIDDEN SPINGFIELD...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-black text-white">
      {/* Header fixe avec logo */}
      <header className="fixed top-0 left-0 right-0 bg-black/60 backdrop-blur-xl z-50 border-b border-white/10">
        <div className="max-w-7xl mx-auto px-4 py-3">
          <div className="flex justify-between items-center">
            {/* Logo ou nom */}
            {settings.backgroundImage ? (
              <img 
                src={settings.backgroundImage} 
                alt="HIDDEN SPINGFIELD" 
                className="h-8 md:h-12 w-auto rounded-lg"
                style={{ filter: 'drop-shadow(0 0 10px rgba(255,255,255,0.2))' }}
              />
            ) : (
              <h1 className="text-xl md:text-2xl font-bold bg-gradient-to-r from-white to-gray-300 bg-clip-text text-transparent">
                {settings.shopName}
              </h1>
            )}
            
            {/* Cart Button */}
            <button className="relative group">
              <div className="flex items-center gap-2 bg-white/10 hover:bg-white/20 px-4 py-2 rounded-full transition-all backdrop-blur">
                <ShoppingBag size={20} />
                <span className="hidden md:inline font-medium">Panier</span>
              </div>
            </button>
          </div>
        </div>
      </header>

      {/* Hero Banner */}
      <section className="pt-20 pb-8 px-4">
        <div className="max-w-7xl mx-auto text-center">
          <div className="bg-gradient-to-r from-purple-600/20 to-blue-600/20 backdrop-blur-lg rounded-2xl p-8 border border-white/10">
            <h2 className="text-3xl md:text-5xl font-black mb-4 bg-gradient-to-r from-white via-gray-200 to-gray-400 bg-clip-text text-transparent">
              {settings.bannerText}
            </h2>
            <p className="text-gray-300 text-lg md:text-xl">
              Découvrez nos produits premium de qualité exceptionnelle
            </p>
          </div>
        </div>
      </section>

      {/* Products Section */}
      <section className="px-4 pb-24">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-8">
            <h3 className="text-xl md:text-2xl font-bold mb-2">Nos Produits</h3>
            <p className="text-gray-400 text-sm">{products.length} produits disponibles</p>
          </div>

          {loading ? (
            <div className="text-center py-12">
              <div className="text-xl">Chargement des produits...</div>
            </div>
          ) : products.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-gray-400 text-lg mb-4">Aucun produit disponible</p>
              <p className="text-gray-500">Les produits seront bientôt ajoutés</p>
            </div>
          ) : (
            /* Grid 2 colonnes mobile comme l'original */
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 md:gap-4">
              {products.map((product) => (
                <div 
                  key={product.id} 
                  className="bg-black/40 backdrop-blur-md rounded-lg overflow-hidden hover:bg-black/50 transition-all duration-300 border border-white/10 group"
                >
                  {/* Image produit */}
                  <div className="relative aspect-square overflow-hidden bg-gradient-to-br from-gray-800/30 to-gray-900/30">
                    {product.image ? (
                      <img 
                        src={product.image} 
                        alt={product.name}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center">
                        <Package size={32} className="text-gray-500" />
                      </div>
                    )}

                    {/* Badges */}
                    {product.tag && (
                      <div className="absolute top-1 left-1">
                        <span className={`px-1.5 py-0.5 rounded text-[10px] font-bold text-white shadow-lg ${
                          product.tagColor === 'red' ? 'bg-red-500/90' : 'bg-green-500/90'
                        } backdrop-blur`}>
                          {product.tag}
                        </span>
                      </div>
                    )}

                    {/* Indicateur vidéo */}
                    {product.video && (
                      <div className="absolute top-1 right-1">
                        <div className="bg-black/70 text-white p-1 rounded-full">
                          <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
                            <path d="M6.3 2.841A1.5 1.5 0 004 4.11V15.89a1.5 1.5 0 002.3 1.269l9.344-5.89a1.5 1.5 0 000-2.538L6.3 2.84z" />
                          </svg>
                        </div>
                      </div>
                    )}
                  </div>

                  {/* Contenu produit */}
                  <div className="p-3">
                    <h4 className="font-bold text-sm md:text-base mb-1 line-clamp-1">
                      {product.name}
                    </h4>
                    
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-xs text-gray-400">
                        {product.countryFlag} {product.origin || product.country}
                      </span>
                      <span className="text-xs text-gray-500">
                        Stock: {product.quantity}
                      </span>
                    </div>

                    <div className="flex items-center justify-between">
                      <span className="text-green-400 font-bold text-lg">
                        {product.price}€
                      </span>
                      <button className="bg-white/10 hover:bg-white/20 px-2 py-1 rounded text-xs transition-colors">
                        Voir
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900/50 backdrop-blur-lg border-t border-white/10 p-6">
        <div className="max-w-7xl mx-auto text-center">
          <h4 className="text-xl font-bold mb-2">{settings.shopName}</h4>
          <p className="text-gray-400 text-sm">Boutique Premium</p>
        </div>
      </footer>
    </div>
  );
}