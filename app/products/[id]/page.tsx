'use client';

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  ArrowLeft, ShoppingCart, Package, 
  Video, Image as ImageIcon, Tag, Info, ChevronLeft, ChevronRight, Play,
  X, Plus, Minus, Trash2, Send, ShoppingBag
} from 'lucide-react';
import { Product, ProductPricing } from '@/lib/store';
import { useStore } from '@/lib/store';

export default function ProductPage() {
  const params = useParams();
  const router = useRouter();
  const [product, setProduct] = useState<any | null>(null);
  const [selectedPricing, setSelectedPricing] = useState<ProductPricing | null>(null);
  const [quantities, setQuantities] = useState<{ [key: string]: number }>({});
  const [loading, setLoading] = useState(true);
  const [showVideo, setShowVideo] = useState(true); // Afficher la vidéo par défaut si elle existe
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [addedToCart, setAddedToCart] = useState<{ [key: string]: boolean }>({});
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

  useEffect(() => {
    loadThemeSettings();
    loadProduct();
  }, [params.id]);

  const loadProduct = async () => {
    try {
      setLoading(true);
      const productId = String(params.id);
      
      // Essayer l'API en premier
      try {
        const response = await fetch(`/api/products/${productId}`);
        if (response.ok) {
          const apiProduct = await response.json();
          setProduct(apiProduct);
          if (apiProduct.pricing && apiProduct.pricing.length > 0) {
            setSelectedPricing(apiProduct.pricing[0]);
          }
          return;
        }
      } catch (apiError) {
        // Silently fallback to static products
      }
      
      // Fallback: charger directement depuis les produits statiques
      const { products } = await import('@/lib/products');
      const foundProduct = products.find(p => String(p.id) === productId);
      
      if (foundProduct) {
        setProduct({ ...foundProduct, _id: foundProduct.id });
        if (foundProduct.pricing && foundProduct.pricing.length > 0) {
          setSelectedPricing(foundProduct.pricing[0]);
        }
      }
    } catch (error) {
      console.error('Error loading product:', error);
    } finally {
      setLoading(false);
    }
  };

  const getBackgroundStyle = () => {
    if (themeSettings.backgroundType === 'gradient') {
      return {
        background: `linear-gradient(135deg, ${themeSettings.gradientFrom || '#000000'} 0%, ${themeSettings.gradientTo || '#1a1a1a'} 100%)`
      };
    } else if (themeSettings.backgroundType === 'image' && themeSettings.backgroundImage) {
      return {
        backgroundImage: `url(${themeSettings.backgroundImage})`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        backgroundAttachment: 'fixed',
        backgroundColor: '#000000'
      };
    }
    return { backgroundColor: themeSettings.backgroundColor || '#000000' };
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-white mx-auto mb-4"></div>
          <p className="text-white text-xl font-bold">Chargement...</p>
        </div>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <div className="text-center">
          <Package size={80} className="text-gray-600 mx-auto mb-4" />
          <p className="text-white text-2xl font-bold mb-4">Produit non trouvé</p>
          <button
            onClick={() => router.push('/')}
            className="bg-white text-black px-8 py-3 rounded-xl font-bold hover:bg-gray-200 transition-colors"
          >
            Retour à l'accueil
          </button>
        </div>
      </div>
    );
  }

  const handleAddToCart = (pricing?: ProductPricing) => {
    const key = pricing ? pricing.weight : 'default';
    const quantity = quantities[key] || 1;
    
    // Créer le produit avec le bon format pour le store
    let productToAdd: any = {
      id: `${product.id || product._id}-${key}`, // ID unique pour chaque option
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
      description: product.description,
      selectedOption: key // Pour identifier l'option sélectionnée
    };
    
    if (pricing) {
      productToAdd = {
        ...productToAdd,
        price: pricing.price,
        name: `${product.name} - ${pricing.weight}`,
        basePrice: pricing.price,
        weight: pricing.weight
      };
    } else if (selectedPricing) {
      productToAdd = {
        ...productToAdd,
        price: selectedPricing.price,
        name: `${product.name} - ${selectedPricing.weight}`,
        basePrice: selectedPricing.price,
        weight: selectedPricing.weight
      };
    }
    
    // Ajouter plusieurs fois selon la quantité
    for (let i = 0; i < quantity; i++) {
      addToCart(productToAdd);
    }
    
    // Notification visuelle
    setAddedToCart({ ...addedToCart, [key]: true });
    setTimeout(() => {
      setAddedToCart({ ...addedToCart, [key]: false });
    }, 2000);
  };

  const updateQuantityForOption = (key: string, value: number) => {
    setQuantities({ ...quantities, [key]: Math.max(1, value) });
  };

  const allImages = product.images && product.images.length > 0 ? product.images : [product.image];
  const currentImage = allImages[currentImageIndex];

  const nextImage = () => {
    setCurrentImageIndex((prev) => (prev + 1) % allImages.length);
  };

  const prevImage = () => {
    setCurrentImageIndex((prev) => (prev - 1 + allImages.length) % allImages.length);
  };

  return (
    <div 
      className="min-h-screen text-white"
      style={getBackgroundStyle()}
    >
      {/* Overlay */}
      {themeSettings.backgroundType === 'image' && themeSettings.backgroundImage && (
        <div className="fixed inset-0 bg-black/70 z-0"></div>
      )}

      <div className="relative z-10">
        {/* Header simplifié */}
        <header className="bg-black/50 backdrop-blur-md border-b border-gray-800">
          <div className="max-w-7xl mx-auto px-4 py-4">
            <div className="flex items-center justify-between">
              <button
                onClick={() => router.push('/')}
                className="flex items-center gap-2 text-white hover:text-gray-300 transition-colors group"
              >
                <ArrowLeft size={24} className="group-hover:-translate-x-1 transition-transform" />
                <span className="font-semibold hidden sm:inline">Retour</span>
              </button>

              <h1 className="text-xl md:text-2xl font-bold text-white text-center flex-1 mx-4">
                {themeSettings.shopName || 'Ma Boutique'}
              </h1>

              <motion.button
                onClick={() => router.push('/cart')}
                className="flex items-center gap-2 bg-gradient-to-r from-green-500 to-emerald-600 text-white px-4 py-3 rounded-xl hover:from-green-600 hover:to-emerald-700 transition-all shadow-xl"
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                <ShoppingCart size={24} />
                <span className="font-bold">Voir le panier</span>
                {getTotalItems() > 0 && (
                  <span className="bg-white text-green-600 text-sm rounded-full min-w-[24px] h-6 px-2 flex items-center justify-center font-bold">
                    {getTotalItems()}
                  </span>
                )}
              </motion.button>
            </div>
          </div>
        </header>

        {/* Contenu principal - Layout responsive */}
        <div className="max-w-7xl mx-auto px-4 py-6 md:py-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 lg:gap-10">
            
            {/* Section Gauche - Images/Vidéo */}
            <div className="space-y-4">
              {/* Image/Vidéo principale */}
              <div className="relative bg-gray-900 rounded-2xl overflow-hidden aspect-square">
                <AnimatePresence mode="wait">
                  {showVideo && product.video ? (
                    <motion.div
                      key="video"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                      className="w-full h-full"
                    >
                      {product.video.includes('youtube') || product.video.includes('youtu.be') ? (
                        <iframe
                          src={`${product.video.replace('watch?v=', 'embed/').replace('youtu.be/', 'youtube.com/embed/')}?autoplay=1&mute=1&controls=1&rel=0`}
                          className="w-full h-full"
                          allowFullScreen
                          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                          title={`Vidéo de ${product.name}`}
                        />
                      ) : (
                        <video
                          src={product.video}
                          controls
                          className="w-full h-full object-cover"
                          autoPlay
                          muted
                          loop
                        />
                      )}
                    </motion.div>
                  ) : (
                    <motion.div
                      key={`image-${currentImageIndex}`}
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                      className="relative w-full h-full"
                    >
                      {currentImage ? (
                        <img 
                          src={currentImage} 
                          alt={product.name}
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-gray-800 to-gray-900">
                          <Package size={100} className="text-gray-600" />
                        </div>
                      )}
                    </motion.div>
                  )}
                </AnimatePresence>

                {/* Navigation images */}
                {!showVideo && allImages.length > 1 && (
                  <>
                    <button
                      onClick={prevImage}
                      className="absolute left-2 top-1/2 -translate-y-1/2 p-2 rounded-full bg-black/50 text-white hover:bg-black/70 transition-colors"
                    >
                      <ChevronLeft size={24} />
                    </button>
                    <button
                      onClick={nextImage}
                      className="absolute right-2 top-1/2 -translate-y-1/2 p-2 rounded-full bg-black/50 text-white hover:bg-black/70 transition-colors"
                    >
                      <ChevronRight size={24} />
                    </button>
                  </>
                )}

                {/* Badges */}
                <div className="absolute top-4 left-4 flex flex-wrap gap-2">
                  {product.tag && (
                    <span className={`px-3 py-1.5 rounded-lg text-sm font-bold text-white shadow-lg ${
                      product.tagColor === 'red' ? 'bg-red-500' : 
                      product.tagColor === 'blue' ? 'bg-blue-500' : 'bg-green-500'
                    }`}>
                      {product.tag}
                    </span>
                  )}
                  {product.countryFlag && (
                    <span className="px-3 py-1.5 rounded-lg text-sm font-bold bg-white/90 shadow-lg">
                      {product.countryFlag}
                    </span>
                  )}
                </div>

                {/* Switch Image/Vidéo - Seulement si on a les deux */}
                {product.video && allImages.length > 0 && (
                  <button
                    onClick={() => setShowVideo(!showVideo)}
                    className="absolute bottom-4 right-4 p-3 rounded-full bg-white/90 backdrop-blur text-black hover:bg-white transition-all group shadow-lg"
                    title={showVideo ? "Voir les photos" : "Voir la vidéo"}
                  >
                    {showVideo ? 
                      <ImageIcon size={24} className="group-hover:scale-110 transition-transform" /> : 
                      <Video size={24} className="group-hover:scale-110 transition-transform" />
                    }
                  </button>
                )}

                {/* Indicateur d'images */}
                {!showVideo && allImages.length > 1 && (
                  <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-1.5">
                    {allImages.map((_: any, idx: number) => (
                      <button
                        key={idx}
                        onClick={() => setCurrentImageIndex(idx)}
                        className={`w-2 h-2 rounded-full transition-all ${
                          idx === currentImageIndex ? 'bg-white w-6' : 'bg-white/50'
                        }`}
                      />
                    ))}
                  </div>
                )}
              </div>

              {/* Galerie miniatures avec vidéo - Desktop uniquement */}
              {(product.video || allImages.length > 1) && (
                <div className="hidden lg:flex gap-2 overflow-x-auto pb-2">
                  {/* Miniature vidéo si elle existe */}
                  {product.video && (
                    <button
                      onClick={() => setShowVideo(true)}
                      className={`flex-shrink-0 w-24 h-24 rounded-lg overflow-hidden border-2 transition-all relative group ${
                        showVideo ? 'border-white ring-2 ring-white' : 'border-gray-700 hover:border-gray-500'
                      }`}
                    >
                      <div className="w-full h-full bg-gradient-to-br from-red-600 to-red-800 flex items-center justify-center">
                        <Video size={32} className="text-white" />
                      </div>
                      <div className="absolute inset-0 bg-black/40 group-hover:bg-black/20 transition-colors flex items-center justify-center">
                        <Play size={24} className="text-white" />
                      </div>
                    </button>
                  )}
                  {/* Miniatures des images */}
                  {allImages.map((img: string, idx: number) => (
                    <button
                      key={idx}
                      onClick={() => {
                        setCurrentImageIndex(idx);
                        setShowVideo(false);
                      }}
                      className={`flex-shrink-0 w-24 h-24 rounded-lg overflow-hidden border-2 transition-all ${
                        !showVideo && idx === currentImageIndex ? 'border-white ring-2 ring-white' : 'border-gray-700 hover:border-gray-500'
                      }`}
                    >
                      <img src={img} alt={`${product.name} ${idx + 1}`} className="w-full h-full object-cover" />
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Section Droite - Informations */}
            <div className="space-y-6">
              {/* En-tête produit */}
              <div>
                <div className="flex items-center gap-3 mb-3">
                  {product.category && (
                    <span className="px-3 py-1 bg-gray-800 text-gray-300 rounded-lg text-sm">
                      {product.category}
                    </span>
                  )}
                  {product.origin && (
                    <span className="text-gray-400 text-sm">{product.origin}</span>
                  )}
                </div>
                
                <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold text-white mb-4">
                  {product.name}
                </h1>

                {/* Description */}
                {product.description && (
                  <p className="text-gray-300 text-lg leading-relaxed">
                    {product.description}
                  </p>
                )}
              </div>

              {/* Section Prix et Options */}
              <div className="bg-gray-900/50 backdrop-blur rounded-2xl p-6 border border-gray-800">
                <h3 className="text-xl font-bold mb-4 text-white flex items-center gap-2">
                  <Tag size={20} />
                  Prix et Options
                </h3>

                {product.pricing && product.pricing.length > 0 ? (
                  <div className="space-y-3">
                    {product.pricing.map((pricing: ProductPricing) => {
                      const key = pricing.weight;
                      const quantity = quantities[key] || 1;
                      const isAdded = addedToCart[key];
                      
                      return (
                        <motion.div
                          key={pricing.weight}
                          className="p-4 rounded-xl bg-black/50 border border-gray-700 hover:border-white/50 transition-all"
                          whileHover={{ scale: 1.01 }}
                        >
                          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                            <div className="flex items-center gap-4">
                              <span className="text-xl font-semibold text-white">
                                {pricing.weight}
                              </span>
                              <span className="text-2xl font-bold text-green-400">
                                {pricing.price}€
                              </span>
                            </div>
                            
                            <div className="flex items-center gap-3 w-full sm:w-auto">
                              {/* Sélecteur de quantité */}
                              <div className="flex items-center gap-2 bg-gray-800 rounded-lg">
                                <button
                                  onClick={() => updateQuantityForOption(key, quantity - 1)}
                                  className="p-2 hover:bg-gray-700 rounded-l-lg transition-colors"
                                >
                                  <Minus size={16} />
                                </button>
                                <span className="px-3 py-1 min-w-[40px] text-center font-bold">
                                  {quantity}
                                </span>
                                <button
                                  onClick={() => updateQuantityForOption(key, quantity + 1)}
                                  className="p-2 hover:bg-gray-700 rounded-r-lg transition-colors"
                                >
                                  <Plus size={16} />
                                </button>
                              </div>
                              
                              {/* Bouton ajouter au panier */}
                              <motion.button
                                onClick={() => handleAddToCart(pricing)}
                                className={`flex items-center gap-2 px-4 py-2.5 rounded-xl transition-all shadow-lg font-bold text-sm ${
                                  isAdded 
                                    ? 'bg-green-600 text-white' 
                                    : 'bg-gradient-to-r from-green-500 to-emerald-600 text-white hover:from-green-600 hover:to-emerald-700'
                                }`}
                                whileHover={{ scale: 1.05 }}
                                whileTap={{ scale: 0.95 }}
                              >
                                {isAdded ? (
                                  <>
                                    <span>✓</span>
                                    <span>AJOUTÉ!</span>
                                  </>
                                ) : (
                                  <>
                                    <ShoppingCart size={18} />
                                    <span>AJOUTER</span>
                                  </>
                                )}
                              </motion.button>
                            </div>
                          </div>
                          
                          {/* Total pour cette option */}
                          {quantity > 1 && (
                            <div className="mt-3 pt-3 border-t border-gray-700 text-right">
                              <span className="text-sm text-gray-400">Total: </span>
                              <span className="text-lg font-bold text-white">
                                {(pricing.price * quantity).toFixed(2)}€
                              </span>
                            </div>
                          )}
                        </motion.div>
                      );
                    })}
                  </div>
                ) : (
                  <motion.div
                    className="flex items-center justify-between p-5 rounded-xl bg-black/50 border border-gray-700"
                    whileHover={{ scale: 1.02 }}
                  >
                    <span className="text-3xl font-bold text-green-400">
                      {product.price}€
                    </span>
                    <motion.button
                      onClick={() => handleAddToCart()}
                      className="flex items-center gap-2 px-6 py-4 rounded-xl bg-gradient-to-r from-green-500 to-emerald-600 text-white hover:from-green-600 hover:to-emerald-700 transition-all shadow-lg font-bold text-lg"
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                    >
                      <ShoppingCart size={26} />
                      <span>AJOUTER AU PANIER</span>
                    </motion.button>
                  </motion.div>
                )}
              </div>

              {/* Informations supplémentaires */}
              {(product.stock || product.featured) && (
                <div className="flex flex-wrap gap-4">
                  {product.stock && (
                    <div className="flex items-center gap-2 text-gray-400">
                      <Package size={18} />
                      <span>Stock: {product.stock} disponibles</span>
                    </div>
                  )}
                  {product.featured && (
                    <div className="flex items-center gap-2 text-yellow-400">
                      <span>⭐ Produit vedette</span>
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Suppression du Cart Modal - on redirige vers /cart à la place */}
      </div>
    </div>
  );
}