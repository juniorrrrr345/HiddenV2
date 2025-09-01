'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  ShoppingBag, Home, Instagram, Send, MessageCircle, 
  Star, TrendingUp, Package, Clock, Shield, 
  Plus, Minus, X, Trash2, ChevronRight, Sparkles,
  ChevronLeft, ChevronDown, Video, Eye,
  Facebook, Twitter, Youtube, Music, Ghost, Gamepad2, Link, ArrowDown
} from 'lucide-react';

import { useRouter } from 'next/navigation';
import { useStore } from '@/lib/store';
import ClientOnly from './ClientOnly';

export default function ModernShop() {
  const router = useRouter();
  // Utilisation du store global au lieu de l'état local
  const { 
    cart, 
    addToCart, 
    removeFromCart, 
    updateQuantity, 
    getTotalItems, 
    getTotalPrice,
    themeSettings,
    loadThemeSettings 
  } = useStore();
  
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [currentSlide, setCurrentSlide] = useState(0);
  const [products, setProducts] = useState<any[]>([]);
  const [categories, setCategories] = useState<any[]>([]);
  const [socials, setSocials] = useState<any[]>([
    { id: '1', name: 'Instagram', icon: 'instagram', emoji: '📷', url: 'https://instagram.com/', enabled: true },
    { id: '2', name: 'Telegram', icon: 'telegram', emoji: '✈️', url: 'https://t.me/', enabled: true }
  ]);
  const [loading, setLoading] = useState(true);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    loadData();
    loadThemeSettings();
    // Charger les réseaux sociaux depuis localStorage (côté client uniquement)
    if (typeof window !== 'undefined') {
      const savedSocials = localStorage.getItem('shop-socials');
      if (savedSocials) {
        setSocials(JSON.parse(savedSocials));
      }
    }
  }, []);

  // Éviter les erreurs d'hydratation
  if (!mounted) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <div className="text-white text-xl">Chargement...</div>
      </div>
    );
  }

  const loadData = async () => {
    try {
      setLoading(true);
      
      // Créer des catégories par défaut
      setCategories([
        { _id: '1', name: 'WEED', slug: 'weed', icon: '🌿' },
        { _id: '2', name: 'HASH', slug: 'hash', icon: '🍫' }
      ]);
      
      // Produits par défaut
      setProducts([]);
      
      // Essayer de charger depuis l'API (optionnel)
      try {
        const productsRes = await fetch('/api/products');
        if (productsRes.ok) {
          const productsData = await productsRes.json();
          if (productsData && productsData.length > 0) {
            setProducts(productsData);
          }
        }

        const categoriesRes = await fetch('/api/categories');
        if (categoriesRes.ok) {
          const categoriesData = await categoriesRes.json();
          console.log('Categories loaded:', categoriesData); // Debug
          if (categoriesData && categoriesData.length > 0) {
            setCategories(categoriesData);
          }
        }
      } catch (apiError) {
        // Using static products data as fallback
        console.log('Using static data as fallback');
      }
    } catch (error) {
      console.error('Error loading data:', error);
    } finally {
      setLoading(false);
    }
  };

  const getBackgroundStyle = () => {
    const { backgroundType, backgroundColor, backgroundImage, gradientFrom, gradientTo } = themeSettings;
    
    switch (backgroundType) {
      case 'image':
        return backgroundImage ? {
          backgroundImage: `url(${backgroundImage})`,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          backgroundAttachment: 'fixed'
        } : { backgroundColor: '#0a0a0a' };
      case 'gradient':
        return {
          background: `linear-gradient(135deg, ${gradientFrom}, ${gradientTo})`
        };
      default:
        return { backgroundColor: backgroundColor || '#0a0a0a' };
    }
  };

  const filteredProducts = selectedCategory === 'all' 
    ? products 
    : products.filter(p => p.category && p.category.toLowerCase() === selectedCategory.toLowerCase());

  // Fonction pour ajouter au panier avec le bon format
  const handleAddToCart = (product: any) => {
    // Convertir le produit au bon format pour le store
    const productToAdd = {
      id: product.id || product._id,
      name: product.name,
      origin: product.origin || '',
      price: product.price,
      pricing: product.pricing,
      image: product.image || '',
      category: product.category || 'weed',
      tag: product.tag,
      tagColor: product.tagColor,
      country: product.country || product.origin || '',
      countryFlag: product.countryFlag || '',
      description: product.description
    };
    addToCart(productToAdd);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-black flex flex-col items-center justify-center">
        <img 
          src="https://i.imgur.com/D3wyuHP.jpeg" 
          alt="Loading" 
          className="w-64 h-64 object-contain mb-8 animate-pulse"
        />
        <div className="text-white text-2xl font-bold animate-pulse">
          Votre Menu Se Prépare 🍔
        </div>
      </div>
    );
  }

  return (
    <div 
      className="min-h-screen text-white relative"
      style={getBackgroundStyle()}
    >
      {/* Overlay léger avec flou pour la lisibilité */}
      {themeSettings.backgroundType === 'image' && themeSettings.backgroundImage && (
        <div className="absolute inset-0 backdrop-blur-[1px] bg-black/30 z-0"></div>
      )}

      <div className="relative z-10">
        {/* Header fixe et moderne */}
        <header className="fixed top-0 left-0 right-0 bg-black/60 backdrop-blur-xl z-50 border-b border-white/10">
          <div className="max-w-7xl mx-auto px-4 py-3">
            <div className="flex justify-between items-center">
              {themeSettings.backgroundImage ? (
                <img 
                  src={themeSettings.backgroundImage} 
                  alt="HIDDEN SPINGFIELD" 
                  className="h-8 md:h-12 w-auto rounded-lg"
                  style={{ filter: 'drop-shadow(0 0 10px rgba(255,255,255,0.2))' }}
                />
              ) : (
                <h1 className="text-xl md:text-2xl font-bold bg-gradient-to-r from-white to-gray-300 bg-clip-text text-transparent">
                  {themeSettings.shopName || 'HIDDEN SPINGFIELD'}
                </h1>
              )}
              
              {/* Cart Button moderne */}
              <button
                onClick={() => router.push('/cart')}
                className="relative group"
              >
                <div className="flex items-center gap-2 bg-white/10 hover:bg-white/20 px-4 py-2 rounded-full transition-all backdrop-blur">
                  <ShoppingBag size={20} />
                  <span className="text-sm font-medium">Panier</span>
                  {getTotalItems() > 0 && (
                    <span className="absolute -top-2 -right-2 bg-gradient-to-r from-red-500 to-pink-500 text-white text-xs rounded-full min-w-[20px] h-5 px-1.5 flex items-center justify-center font-bold">
                      {getTotalItems()}
                    </span>
                  )}
                </div>
              </button>
            </div>
          </div>
        </header>

        {/* Section principale avec bannière rectangulaire */}
        <section className="pt-20 pb-8 px-4">
          <div className="max-w-7xl mx-auto">
            {/* Titre et sous-titre */}
            <div className="text-center mb-8">
              <motion.h2 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6 }}
                className="text-3xl md:text-5xl font-black mb-3 bg-gradient-to-r from-white via-gray-200 to-white bg-clip-text text-transparent"
              >
                {themeSettings.shopName || 'MA BOUTIQUE'}
              </motion.h2>
              <motion.p 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.1 }}
                className="text-lg md:text-xl text-gray-200 font-medium"
              >
                {themeSettings.bannerSubtext || 'Découvrez nos produits premium de qualité exceptionnelle'}
              </motion.p>
            </div>

            {/* Bannière rectangulaire */}
            {themeSettings.bannerImage && (
              <motion.div 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.2 }}
                className="mb-8 rounded-xl overflow-hidden shadow-2xl bg-black/20"
              >
                <div className="relative w-full h-[200px] md:h-[300px] lg:h-[400px] flex items-center justify-center">
                  <img 
                    src={themeSettings.bannerImage}
                    alt="Bannière"
                    className="w-full h-full object-contain"
                  />
                </div>
              </motion.div>
            )}

            {/* Catégories - 3 par ligne */}
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.3 }}
              className="mb-8"
            >
              <h3 className="text-lg md:text-xl font-bold text-center mb-4 text-white/90">Catégories</h3>
              <div className="grid grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-2 md:gap-3">
                {/* Bouton Tout */}
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => setSelectedCategory('all')}
                  className={`relative overflow-hidden rounded-lg p-3 md:p-4 transition-all backdrop-blur-md ${
                    selectedCategory === 'all'
                      ? 'bg-gradient-to-br from-purple-600/70 to-blue-600/70 shadow-lg'
                      : 'bg-white/10 hover:bg-white/20'
                  }`}
                >
                  <div className="relative z-10 flex flex-col items-center">
                    <span className="text-xl md:text-2xl mb-1">✨</span>
                    <span className="font-bold text-[10px] md:text-xs">TOUT</span>
                    <span className="text-[9px] md:text-[10px] opacity-80">
                      {products.length}
                    </span>
                  </div>
                </motion.button>

                {/* Catégories dynamiques */}
                {categories.map((category: any) => {
                  const categoryProducts = products.filter(p => 
                    p.category && p.category.toLowerCase() === (category.slug || category.value || category.name.toLowerCase())
                  );
                  return (
                    <motion.button
                      key={category._id || category.id}
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      onClick={() => setSelectedCategory(category.slug || category.value || category.name.toLowerCase())}
                      className="flex flex-col items-center justify-center bg-black/40 backdrop-blur-sm rounded-xl p-3 md:p-4 hover:bg-black/60 transition-all border border-white/20 hover:border-white/40 min-w-[80px] md:min-w-[100px]"
                    >
                      {category.icon && (
                        <span className="text-xl md:text-2xl mb-1">{category.icon}</span>
                      )}
                      <span className="text-[10px] md:text-xs font-bold text-white/90 uppercase tracking-wider">
                        {category.name}
                      </span>
                      <span className="text-[9px] md:text-[10px] opacity-80">
                        {categoryProducts.length}
                      </span>
                    </motion.button>
                  );
                })}
              </div>
            </motion.div>
          </div>
        </section>

        {/* Products Section avec ÉNORME espace en bas pour éviter que la navigation cache les boutons */}
        <section className="px-4" style={{ paddingBottom: '220px' }}>
          <div className="max-w-7xl mx-auto">
            <div className="text-center mb-4">
              <h2 className="text-xl md:text-2xl font-bold">
                {selectedCategory === 'all' ? 'Tous nos produits' : `${selectedCategory.toUpperCase()}`}
              </h2>
              <p className="text-gray-400 text-xs md:text-sm">{filteredProducts.length} disponibles</p>
            </div>

            {/* Grille de produits 2 colonnes mobile */}
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-2 md:gap-3 lg:gap-4">
              {filteredProducts.map((product, index) => (
                <motion.div
                  key={product.id || product._id}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.4, delay: Math.min(index * 0.05, 0.2) }}
                  className="group"
                >
                  <div className="bg-black/40 backdrop-blur-md rounded-lg overflow-hidden hover:bg-black/50 transition-all duration-300 h-full flex flex-col border border-white/10">
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

                      {/* Badges compacts */}
                      {(product.tag || product.category) && (
                        <div className="absolute top-1 left-1 flex flex-wrap gap-1 max-w-[90%]">
                          {product.tag && (
                            <span className={`px-1.5 py-0.5 rounded text-[10px] font-bold text-white shadow-lg ${
                              product.tagColor === 'red' ? 'bg-red-500/90' : 
                              product.tagColor === 'blue' ? 'bg-blue-500/90' : 'bg-green-500/90'
                            } backdrop-blur`}>
                              {product.tag}
                            </span>
                          )}
                          {product.category && (
                            <span className="px-1.5 py-0.5 rounded text-[10px] font-bold bg-black/70 text-white backdrop-blur shadow-lg">
                              {product.category.toUpperCase()}
                            </span>
                          )}
                        </div>
                      )}
                    </div>

                    {/* Infos produit avec meilleure lisibilité */}
                    <div className="p-3 md:p-3.5 flex-1 flex flex-col">
                      <h3 className="text-sm md:text-base font-bold mb-1 line-clamp-1 text-white">
                        {product.name}
                      </h3>
                      <p className="text-xs md:text-sm text-gray-300 mb-2 line-clamp-1 font-medium">
                        {product.origin || 'Premium'}
                      </p>
                      
                      {/* Prix avec meilleure visibilité */}
                      <div className="mb-3 flex-1">
                        {product.pricing && product.pricing.length > 0 ? (
                          <div>
                            <span className="text-[11px] md:text-xs text-gray-300 font-medium">Dès</span>
                            <div className="text-xl md:text-2xl font-bold text-white">
                              {Math.min(...product.pricing.map((p: any) => p.price))}€
                            </div>
                          </div>
                        ) : (
                          <div className="text-xl md:text-2xl font-bold text-white">
                            {product.price}€
                          </div>
                        )}
                      </div>

                      {/* Boutons d'action plus visibles */}
                      <div className="space-y-2">
                        <button
                          onClick={() => handleAddToCart(product)}
                          className="w-full bg-gradient-to-r from-green-500 to-emerald-500 text-white py-2 px-2 rounded-md font-bold text-xs md:text-sm hover:from-green-600 hover:to-emerald-600 transition-all shadow-lg"
                        >
                          🛒 AJOUTER
                        </button>
                        
                        <button
                          onClick={() => router.push(`/products/${product.id || product._id}`)}
                          className="w-full bg-white/25 hover:bg-white/35 text-white py-2 px-2 rounded-md font-bold text-xs md:text-sm transition-all backdrop-blur shadow-lg"
                        >
                          👁️ DÉTAILS
                        </button>
                      </div>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>

            {filteredProducts.length === 0 && (
              <div className="text-center py-12">
                <Package size={48} className="mx-auto text-gray-600 mb-3" />
                <h3 className="text-lg font-bold mb-1">Aucun produit trouvé</h3>
                <p className="text-gray-400 text-sm">Essayez une autre catégorie</p>
              </div>
            )}
          </div>
        </section>

        {/* Bottom Navigation - Plus compact et moins intrusif */}
        <div className="fixed bottom-0 left-0 right-0 bg-black/80 backdrop-blur-lg z-30 border-t border-white/20">
          <div className="max-w-7xl mx-auto">
            <div className="flex justify-center items-center gap-3 md:gap-5 py-1.5 md:py-2">
              {/* Accueil */}
              <button
                onClick={() => router.push('/')}
                className="flex flex-col items-center justify-center text-white hover:text-gray-300 transition-all group p-0.5"
              >
                <span className="text-lg md:text-xl group-hover:scale-110 transition-transform">🏠</span>
                <span className="text-[10px] md:text-xs font-bold opacity-90 group-hover:opacity-100">Accueil</span>
              </button>

              {/* Réseaux sociaux */}
              {socials.filter(s => s.enabled && s.name && s.url).slice(0, 3).map(social => (
                <a
                  key={social.id}
                  href={social.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex flex-col items-center justify-center text-white hover:text-gray-300 transition-all group p-0.5"
                >
                  <span className="text-lg md:text-xl group-hover:scale-110 transition-transform">
                    {social.name === 'Instagram' ? '📸' : 
                     social.name === 'Telegram' ? '✈️' : 
                     social.name === 'Facebook' ? '👥' :
                     social.name === 'Twitter' ? '🐦' :
                     social.name === 'YouTube' ? '📺' :
                     social.name === 'TikTok' ? '🎵' :
                     social.name === 'Snapchat' ? '👻' :
                     social.name === 'Discord' ? '🎮' :
                     social.emoji || '🔗'}
                  </span>
                  <span className="text-[10px] md:text-xs font-bold opacity-90 group-hover:opacity-100">{social.name}</span>
                </a>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}