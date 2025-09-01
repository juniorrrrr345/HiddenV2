'use client';

import { useState, useEffect } from 'react';
import { ShoppingBag, Package } from 'lucide-react';

export default function StableShop() {
  const [mounted, setMounted] = useState(false);
  const [products, setProducts] = useState<any[]>([]);
  const [settings, setSettings] = useState<any>({ shopName: 'HIDDEN SPINGFIELD' });
  const [socials, setSocials] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [cartCount, setCartCount] = useState(0);

  useEffect(() => {
    setMounted(true);
    loadData();
    updateCartCount();
    
    // Écouter les mises à jour du panier
    const handleCartUpdate = () => updateCartCount();
    if (typeof window !== 'undefined') {
      window.addEventListener('cartUpdated', handleCartUpdate);
      return () => window.removeEventListener('cartUpdated', handleCartUpdate);
    }
  }, []);

  const updateCartCount = () => {
    if (typeof window !== 'undefined') {
      const cart = JSON.parse(localStorage.getItem('cart') || '[]');
      const totalItems = cart.reduce((sum: number, item: any) => sum + (item.quantity || 1), 0);
      setCartCount(totalItems);
    }
  };

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
          bannerImage: settingsData.banner_image,
          bannerText: settingsData.banner_text || '',
          presentationText: settingsData.scrolling_text || 'Découvrez nos produits premium de qualité exceptionnelle'
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
      {/* Header simple en haut */}
      <header className="bg-black/80 p-4">
        <div className="max-w-7xl mx-auto flex justify-between items-center">
          {/* Logo seulement si image uploadée */}
          {settings.backgroundImage && (
            <img 
              src={settings.backgroundImage} 
              alt="HIDDEN SPINGFIELD" 
              className="h-8 sm:h-10 md:h-12 w-auto object-contain rounded-lg"
              style={{ filter: 'drop-shadow(0 0 10px rgba(255,255,255,0.2))' }}
            />
          )}
          
          {/* Cart Button */}
          <a href="/cart" className="relative">
            <div className="flex items-center gap-2 bg-white/10 hover:bg-white/20 px-3 py-2 rounded-full transition-all">
              <ShoppingBag size={18} />
              <span className="hidden sm:inline font-medium">Panier</span>
              {cartCount > 0 && (
                <span className="bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center font-bold">
                  {cartCount}
                </span>
              )}
            </div>
          </a>
        </div>
      </header>

      {/* Bannière d'accueil */}
      <section className="pb-6 px-3 sm:px-4">
        <div className="max-w-7xl mx-auto">
          {/* Texte de présentation */}
          {settings.presentationText && (
            <div className="text-center mb-6">
              <h2 className="text-lg sm:text-xl md:text-2xl font-bold text-white mb-2">
                BANNIÈRE D'ACCUEIL
              </h2>
              <p className="text-gray-300 text-sm sm:text-base">
                {settings.presentationText}
              </p>
            </div>
          )}
          
          {/* Image de la bannière */}
          {settings.bannerImage && (
            <div className="relative rounded-xl sm:rounded-2xl overflow-hidden mb-6">
              <img 
                src={settings.bannerImage}
                alt="Bannière HIDDEN SPINGFIELD"
                className="w-full h-32 sm:h-40 md:h-48 lg:h-56 object-cover"
              />
              <div className="absolute inset-0 bg-black/20"></div>
            </div>
          )}
        </div>
      </section>

      {/* Catégories - maintenant bien visibles */}
      <section className="px-4 pb-6">
        <div className="max-w-7xl mx-auto">
          <h3 className="text-lg font-bold mb-4 text-gray-300 text-center">Catégories</h3>
          
          <div className="flex justify-center space-x-4 mb-8">
            {/* TOUT */}
            <div className="bg-gray-800/50 rounded-lg p-3 text-center min-w-[80px]">
              <div className="text-2xl mb-1">✨</div>
              <div className="text-xs font-bold text-white">TOUT</div>
              <div className="text-xs text-gray-400">{products.length}</div>
            </div>
            
            {/* HASH */}
            <div className="bg-gray-800/50 rounded-lg p-3 text-center min-w-[80px]">
              <div className="text-2xl mb-1">🍫</div>
              <div className="text-xs font-bold text-white">HASH</div>
              <div className="text-xs text-gray-400">{products.filter(p => p.category === 'hash').length}</div>
            </div>
            
            {/* WEED */}
            <div className="bg-gray-800/50 rounded-lg p-3 text-center min-w-[80px]">
              <div className="text-2xl mb-1">🥗</div>
              <div className="text-xs font-bold text-white">WEED</div>
              <div className="text-xs text-gray-400">{products.filter(p => p.category === 'weed').length}</div>
            </div>
          </div>
        </div>
      </section>

      {/* Products Section */}
      <section className="px-4 pb-32">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-8">
            <h3 className="text-xl md:text-2xl font-bold mb-2">Tous nos produits</h3>
            <p className="text-gray-400 text-sm">{products.length} disponibles</p>
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
                    
                    <div className="mb-2">
                      <span className="text-xs text-gray-400">
                        {product.countryFlag} {product.origin || product.country}
                      </span>
                    </div>

                    <div className="flex items-center justify-between">
                      <span className="text-green-400 font-bold text-lg">
                        {(() => {
                          if (product.price > 0) {
                            return `${product.price}€`;
                          }
                          // Si prix de base = 0, prendre le prix minimum des options
                          if (product.pricing) {
                            try {
                              const pricingOptions = JSON.parse(product.pricing);
                              if (pricingOptions.length > 0) {
                                const minPrice = Math.min(...pricingOptions.map((p: any) => p.price));
                                return `Dès ${minPrice}€`;
                              }
                            } catch (e) {}
                          }
                          return 'Prix sur demande';
                        })()}
                      </span>
                      <a 
                        href={`/products/${product.id}`}
                        className="bg-white/10 hover:bg-white/20 px-2 py-1 rounded text-xs transition-colors"
                      >
                        Voir
                      </a>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* Navigation Bottom fixe */}
      <nav className="fixed bottom-0 left-0 right-0 bg-black/90 backdrop-blur-xl border-t border-white/10 z-40">
        <div className="max-w-7xl mx-auto px-4 py-3">
          <div className="flex justify-center items-center space-x-12 sm:space-x-16 md:space-x-20">
            {/* Accueil */}
            <a 
              href="/"
              className="flex flex-col items-center space-y-1 text-gray-400 hover:text-white transition-colors"
            >
              <div className="w-8 h-8 bg-gray-700 hover:bg-gray-600 rounded-lg flex items-center justify-center">
                <span className="text-sm">🏠</span>
              </div>
              <span className="text-xs font-medium">Accueil</span>
            </a>
            
            {/* Instagram */}
            <a 
              href="https://instagram.com/" 
              target="_blank"
              className="flex flex-col items-center space-y-1 text-gray-400 hover:text-pink-400 transition-colors"
            >
              <div className="w-8 h-8 bg-gradient-to-r from-pink-500 to-purple-600 rounded-lg flex items-center justify-center">
                <span className="text-white text-sm">📸</span>
              </div>
              <span className="text-xs font-medium">Instagram</span>
            </a>
            
            {/* Telegram */}
            <a 
              href="https://t.me/" 
              target="_blank"
              className="flex flex-col items-center space-y-1 text-gray-400 hover:text-blue-400 transition-colors"
            >
              <div className="w-8 h-8 bg-blue-500 rounded-lg flex items-center justify-center">
                <span className="text-white text-sm">✈️</span>
              </div>
              <span className="text-xs font-medium">Telegram</span>
            </a>
          </div>
        </div>
      </nav>
    </div>
  );
}