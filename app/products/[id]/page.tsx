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

  useEffect(() => {
    if (params.id) {
      loadProduct();
    }
  }, [params.id]);

  const loadProduct = async () => {
    try {
      const response = await fetch(`/api/products/${params.id}`);
      if (response.ok) {
        const data = await response.json();
        setProduct(data);
      } else {
        console.error('Product not found');
      }
    } catch (error) {
      console.error('Error loading product:', error);
    } finally {
      setLoading(false);
    }
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
        <div className="max-w-6xl mx-auto flex items-center">
          <button 
            onClick={() => router.push('/')}
            className="flex items-center space-x-2 text-gray-400 hover:text-white transition-colors"
          >
            <ArrowLeft className="w-5 h-5" />
            <span>Retour</span>
          </button>
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

              <div className="text-3xl font-bold text-green-400 mb-6">
                {product.price}€
              </div>
            </div>

            {/* Description */}
            {product.description && (
              <div className="bg-gray-900 rounded-lg p-6">
                <h3 className="text-xl font-bold mb-3">Description</h3>
                <p className="text-gray-300 leading-relaxed">{product.description}</p>
              </div>
            )}

            {/* Options de prix */}
            {product.pricing && (
              <div className="bg-gray-900 rounded-lg p-6">
                <h3 className="text-xl font-bold mb-4">Options de prix</h3>
                <div className="space-y-2">
                  {JSON.parse(product.pricing || '[]').map((pricing: any, index: number) => (
                    <div key={index} className="flex justify-between items-center p-3 bg-gray-800 rounded-lg">
                      <span className="font-medium">{pricing.weight}</span>
                      <span className="text-green-400 font-bold">{pricing.price}€</span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Informations supplémentaires */}
            <div className="bg-gray-900 rounded-lg p-6">
              <h3 className="text-xl font-bold mb-4">Informations</h3>
              <div className="space-y-3">
                <div className="flex justify-between">
                  <span className="text-gray-400">Catégorie</span>
                  <span className="capitalize">{product.category}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-400">Stock disponible</span>
                  <span className={product.quantity > 0 ? 'text-green-400' : 'text-red-400'}>
                    {product.quantity > 0 ? `${product.quantity} unités` : 'Rupture de stock'}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-400">Disponibilité</span>
                  <span className={product.available ? 'text-green-400' : 'text-red-400'}>
                    {product.available ? 'Disponible' : 'Indisponible'}
                  </span>
                </div>
              </div>
            </div>

            {/* Bouton de commande */}
            <div className="sticky bottom-4">
              <button 
                className="w-full bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 py-4 rounded-lg font-bold text-lg transition-all"
                disabled={!product.available || product.quantity === 0}
              >
                {product.available && product.quantity > 0 
                  ? '🛒 Ajouter au panier' 
                  : '❌ Indisponible'
                }
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}