'use client';

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { 
  ArrowLeft, 
  Edit, 
  Trash2, 
  Eye,
  Package,
  DollarSign,
  Tag,
  MapPin,
  Clock,
  TrendingUp
} from 'lucide-react';

export default function AdminProductDetail() {
  const params = useParams();
  const router = useRouter();
  const [product, setProduct] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    checkAuth();
    fetchProduct();
  }, [params.id]);

  const checkAuth = () => {
    const token = localStorage.getItem('auth-token');
    if (!token) {
      router.push('/admin');
    }
  };

  const fetchProduct = async () => {
    try {
      const response = await fetch(`/api/products/${params.id}`);
      if (response.ok) {
        const data = await response.json();
        setProduct(data);
      } else {
        alert('Produit non trouvé');
        router.push('/admin/dashboard');
      }
    } catch (error) {
      console.error('Erreur:', error);
      alert('Erreur lors du chargement');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async () => {
    if (!confirm('Êtes-vous sûr de vouloir supprimer ce produit ?')) return;

    try {
      const response = await fetch(`/api/products/${params.id}`, {
        method: 'DELETE',
      });

      if (response.ok) {
        alert('Produit supprimé avec succès');
        router.push('/admin/dashboard');
      } else {
        alert('Erreur lors de la suppression');
      }
    } catch (error) {
      alert('Erreur lors de la suppression');
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <div className="text-white text-xl font-bold">Chargement...</div>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <div className="text-white text-xl font-bold">Produit non trouvé</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-black text-white">
      {/* Header */}
      <div className="bg-black border-b-4 border-white p-6">
        <div className="max-w-6xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-4">
            <button
              onClick={() => router.push('/admin/dashboard')}
              className="bg-white text-black p-3 rounded-full hover:bg-gray-200 transition-colors"
            >
              <ArrowLeft size={24} />
            </button>
            <div>
              <h1 className="text-3xl font-black">DÉTAIL PRODUIT</h1>
              <p className="text-gray-300">Panel Administrateur</p>
            </div>
          </div>

          <div className="flex gap-4">
            <button
              onClick={handleDelete}
              className="bg-red-600 text-white px-6 py-3 rounded-lg font-black hover:bg-red-700 transition-colors flex items-center gap-2"
            >
              <Trash2 size={20} />
              SUPPRIMER
            </button>
            <button
              onClick={() => {
                // Stocker l'ID du produit à éditer dans localStorage
                localStorage.setItem('editProductId', product._id || product.id);
                // Rediriger vers le dashboard
                router.push('/admin/dashboard?tab=products');
              }}
              className="bg-green-600 text-white px-6 py-3 rounded-lg font-black hover:bg-green-700 transition-colors flex items-center gap-2"
            >
              <Edit size={20} />
              MODIFIER
            </button>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-6xl mx-auto p-6">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Image Section */}
          <div>
            <div className="aspect-square bg-white rounded-2xl overflow-hidden border-4 border-white">
              {product.image ? (
                <img
                  src={product.image}
                  alt={product.name}
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center bg-gray-100">
                  <Package size={120} className="text-gray-400" />
                </div>
              )}
            </div>
          </div>

          {/* Product Info */}
          <div className="space-y-6">
            {/* Title and Flag */}
            <div className="border-4 border-white rounded-2xl p-6 bg-black">
              <div className="flex items-start justify-between mb-4">
                <h2 className="text-4xl font-black text-white">{product.name}</h2>
                <span className="text-5xl">{product.countryFlag}</span>
              </div>
              <div className="flex items-center gap-4">
                <span className={`px-4 py-2 rounded-full font-black text-white ${
                  product.tagColor === 'red' ? 'bg-red-500' : 'bg-green-500'
                }`}>
                  {product.tag}
                </span>
                <span className="text-white/80 text-lg font-bold">{product.origin}</span>
              </div>
            </div>

            {/* Stats Grid */}
            <div className="grid grid-cols-2 gap-4">
              <div className="border-4 border-white rounded-2xl p-4 bg-black text-center">
                <Package size={32} className="mx-auto mb-2 text-white" />
                <div className="text-2xl font-black text-white">{product.quantity}</div>
                <div className="text-sm text-gray-300">STOCK DISPONIBLE</div>
              </div>
              <div className="border-4 border-white rounded-2xl p-4 bg-black text-center">
                <Tag size={32} className="mx-auto mb-2 text-white" />
                <div className="text-2xl font-black text-white uppercase">{product.category}</div>
                <div className="text-sm text-gray-300">CATÉGORIE</div>
              </div>
            </div>

            {/* Pricing */}
            <div className="border-4 border-white rounded-2xl p-6 bg-black">
              <h3 className="text-2xl font-black text-white mb-4 flex items-center gap-2">
                <DollarSign size={28} />
                TARIFICATION
              </h3>
              
              {product.pricing && product.pricing.length > 0 ? (
                <div className="space-y-3">
                  {product.pricing.map((pricing: any, index: number) => (
                    <div key={index} className="flex justify-between items-center bg-white/10 rounded-lg p-4">
                      <div className="flex items-center gap-3">
                        <div className="bg-white text-black rounded-full w-8 h-8 flex items-center justify-center font-black">
                          {index + 1}
                        </div>
                        <span className="text-xl font-black text-white">{pricing.weight}</span>
                      </div>
                      <span className="text-2xl font-black text-white">{pricing.price}€</span>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="bg-white/10 rounded-lg p-4">
                  <span className="text-3xl font-black text-white">{product.price}€</span>
                  <span className="text-gray-300 ml-2">Prix unique</span>
                </div>
              )}
            </div>

            {/* Description */}
            {product.description && (
              <div className="border-4 border-white rounded-2xl p-6 bg-black">
                <h3 className="text-2xl font-black text-white mb-4">DESCRIPTION</h3>
                <p className="text-white/90 text-lg leading-relaxed">{product.description}</p>
              </div>
            )}

            {/* Technical Info */}
            <div className="border-4 border-white rounded-2xl p-6 bg-black">
              <h3 className="text-2xl font-black text-white mb-4">INFORMATIONS TECHNIQUES</h3>
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <span className="text-gray-300">ID Produit:</span>
                  <span className="text-white font-bold ml-2">{product._id}</span>
                </div>
                <div>
                  <span className="text-gray-300">Code Pays:</span>
                  <span className="text-white font-bold ml-2">{product.country}</span>
                </div>
                <div>
                  <span className="text-gray-300">Couleur Tag:</span>
                  <span className="text-white font-bold ml-2 capitalize">{product.tagColor}</span>
                </div>
                <div>
                  <span className="text-gray-300">Créé le:</span>
                  <span className="text-white font-bold ml-2">
                    {product.createdAt ? new Date(product.createdAt).toLocaleDateString('fr-FR') : 'N/A'}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}