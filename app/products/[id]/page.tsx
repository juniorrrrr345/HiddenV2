'use client';

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { ArrowLeft, Package } from 'lucide-react';

export default function ProductPage() {
  const params = useParams();
  const router = useRouter();
  const [product, setProduct] = useState<any | null>(null);
  const [loading, setLoading] = useState(true);
  const [showVideo, setShowVideo] = useState(false);
  const [quantities, setQuantities] = useState<{ [key: string]: number }>({});
  const [cartCount, setCartCount] = useState(0);

  useEffect(() => {
    if (params.id) {
      loadProduct();
    }
    updateCartCount();
  }, [params.id]);

  const updateCartCount = () => {
    if (typeof window !== 'undefined') {
      const cart = JSON.parse(localStorage.getItem('cart') || '[]');
      const totalItems = cart.reduce((sum: number, item: any) => sum + (item.quantity || 1), 0);
      setCartCount(totalItems);
    }
  };

  const loadProduct = async () => {
    try {
      const response = await fetch(`/api/products/${params.id}`);
      if (response.ok) {
        const data = await response.json();
        setProduct(data);
        // Initialiser les quantités
        setQuantities({
          base: 1,
          ...Object.fromEntries(
            (JSON.parse(data.pricing || '[]')).map((_: any, index: number) => [`option_${index}`, 1])
          )
        });
      } else {
        console.error('Product not found');
      }
    } catch (error) {
      console.error('Error loading product:', error);
    } finally {
      setLoading(false);
    }
  };

  const updateQuantity = (key: string, delta: number) => {
    setQuantities(prev => ({
      ...prev,
      [key]: Math.max(1, (prev[key] || 1) + delta)
    }));
  };

  const addToCart = (productData: any, quantity: number, priceOption?: any) => {
    // Simulation d'ajout au panier
    const cartItem = {
      id: productData.id,
      name: productData.name,
      price: priceOption ? priceOption.price : productData.price,
      weight: priceOption ? priceOption.weight : 'base',
      image: productData.image,
      quantity,
      selectedPrice: priceOption || { weight: 'base', price: productData.price }
    };
    
    // Sauvegarder dans localStorage
    if (typeof window !== 'undefined') {
      const cart = JSON.parse(localStorage.getItem('cart') || '[]');
      cart.push(cartItem);
      localStorage.setItem('cart', JSON.stringify(cart));
      
      // Déclencher un événement pour mettre à jour le compteur
      window.dispatchEvent(new Event('cartUpdated'));
    }
    
    alert(`✅ ${quantity}x ${productData.name} ajouté au panier !`);
    updateCartCount();
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <div className="text-white text-xl">Chargement du produit...</div>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <div className="text-center text-white">
          <h1 className="text-2xl font-bold mb-4">Produit non trouvé</h1>
          <button 
            onClick={() => router.push('/')}
            className="bg-blue-600 hover:bg-blue-700 px-6 py-3 rounded-lg"
          >
            Retour à la boutique
          </button>
        </div>
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
          
          {/* Panier avec compteur */}
          <a href="/cart" className="relative">
            <div className="flex items-center gap-2 bg-white/10 hover:bg-white/20 px-3 py-2 rounded-full transition-all">
              <span className="text-sm">🛒</span>
              <span className="text-sm">Panier</span>
              {cartCount > 0 && (
                <span className="bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center font-bold">
                  {cartCount}
                </span>
              )}
            </div>
          </a>
        </div>
      </header>

      <div className="max-w-6xl mx-auto p-4">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Médias */}
          <div className="space-y-4">
            {/* Image principale ou vidéo */}
            <div className="aspect-square bg-gray-800 rounded-lg overflow-hidden">
              {showVideo && product.video ? (
                <video
                  src={product.video}
                  className="w-full h-full object-contain"
                  controls
                  autoPlay
                  muted
                  playsInline
                >
                  Votre navigateur ne supporte pas les vidéos.
                </video>
              ) : product.image ? (
                <img
                  src={product.image}
                  alt={product.name}
                  className="w-full h-full object-contain"
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center">
                  <Package size={64} className="text-gray-500" />
                </div>
              )}
            </div>

            {/* Boutons média */}
            {product.video && (
              <div className="flex gap-2">
                <button
                  onClick={() => setShowVideo(false)}
                  className={`flex-1 py-2 px-4 rounded-lg font-medium transition-colors ${
                    !showVideo 
                      ? 'bg-blue-600 text-white' 
                      : 'bg-gray-800 text-gray-400 hover:bg-gray-700'
                  }`}
                >
                  📷 Photo
                </button>
                <button
                  onClick={() => setShowVideo(true)}
                  className={`flex-1 py-2 px-4 rounded-lg font-medium transition-colors ${
                    showVideo 
                      ? 'bg-blue-600 text-white' 
                      : 'bg-gray-800 text-gray-400 hover:bg-gray-700'
                  }`}
                >
                  🎬 Vidéo
                </button>
              </div>
            )}
          </div>

          {/* Informations produit */}
          <div className="space-y-6">
            <div>
              <h1 className="text-3xl md:text-4xl font-bold mb-4">{product.name}</h1>
              
              <div className="flex items-center space-x-4 mb-4">
                <span className="text-2xl">{product.countryFlag}</span>
                <span className="text-gray-400">{product.origin || product.country}</span>
                {product.tag && (
                  <span className={`px-3 py-1 rounded-full text-sm font-bold ${
                    product.tagColor === 'red' ? 'bg-red-600' : 'bg-green-600'
                  }`}>
                    {product.tag}
                  </span>
                )}
              </div>

              {product.price > 0 && (
                <div className="text-3xl font-bold text-green-400 mb-6">
                  {product.price}€
                </div>
              )}
            </div>

            {/* Description */}
            {product.description && (
              <div className="bg-gray-900 rounded-lg p-6">
                <h3 className="text-xl font-bold mb-3">Description</h3>
                <p className="text-gray-300 leading-relaxed">{product.description}</p>
              </div>
            )}

            {/* Prix et Options */}
            <div className="bg-gray-900 rounded-lg p-6">
              <h3 className="text-xl font-bold mb-4">Prix et Options</h3>
              
              {/* Prix de base - seulement si > 0 */}
              {product.price > 0 && (
                <div className="mb-6">
                  <div className="flex justify-between items-center p-4 bg-gray-800 rounded-lg mb-3">
                    <span className="font-medium">Prix de base</span>
                    <span className="text-green-400 font-bold text-xl">{product.price}€</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      <button 
                        onClick={() => updateQuantity('base', -1)}
                        className="bg-gray-700 hover:bg-gray-600 w-8 h-8 rounded-full flex items-center justify-center"
                      >
                        -
                      </button>
                      <span className="w-8 text-center">{quantities.base || 1}</span>
                      <button 
                        onClick={() => updateQuantity('base', 1)}
                        className="bg-gray-700 hover:bg-gray-600 w-8 h-8 rounded-full flex items-center justify-center"
                      >
                        +
                      </button>
                    </div>
                    <button 
                      onClick={() => addToCart(product, quantities.base || 1)}
                      className="bg-green-600 hover:bg-green-700 px-6 py-2 rounded-lg font-bold"
                    >
                      AJOUTER
                    </button>
                  </div>
                </div>
              )}

              {/* Options de prix */}
              {product.pricing && JSON.parse(product.pricing || '[]').length > 0 && (
                <div className="space-y-3">
                  {JSON.parse(product.pricing || '[]').map((pricing: any, index: number) => (
                    <div key={index}>
                      <div className="flex justify-between items-center p-4 bg-gray-800 rounded-lg mb-3">
                        <span className="font-medium">{pricing.weight}</span>
                        <span className="text-green-400 font-bold text-xl">{pricing.price}€</span>
                      </div>
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-3">
                          <button 
                            onClick={() => updateQuantity(`option_${index}`, -1)}
                            className="bg-gray-700 hover:bg-gray-600 w-8 h-8 rounded-full flex items-center justify-center"
                          >
                            -
                          </button>
                          <span className="w-8 text-center">{quantities[`option_${index}`] || 1}</span>
                          <button 
                            onClick={() => updateQuantity(`option_${index}`, 1)}
                            className="bg-gray-700 hover:bg-gray-600 w-8 h-8 rounded-full flex items-center justify-center"
                          >
                            +
                          </button>
                        </div>
                        <button 
                          onClick={() => addToCart(product, quantities[`option_${index}`] || 1, pricing)}
                          className="bg-green-600 hover:bg-green-700 px-6 py-2 rounded-lg font-bold"
                        >
                          AJOUTER
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}