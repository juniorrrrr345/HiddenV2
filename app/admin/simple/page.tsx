'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';

export default function SimpleAdmin() {
  const router = useRouter();
  const [products, setProducts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    loadProducts();
  }, []);

  const loadProducts = async () => {
    try {
      setLoading(true);
      setError('');
      
      const response = await fetch('/api/products');
      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: ${response.statusText}`);
      }
      
      const data = await response.json();
      setProducts(data);
      console.log('Products loaded:', data);
    } catch (err: any) {
      console.error('Error loading products:', err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const testCreateProduct = async () => {
    try {
      const response = await fetch('/api/products', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: 'Test Product',
          origin: 'Test',
          price: 50,
          category: 'weed',
          quantity: 10,
          country: 'FR',
          countryFlag: '🇫🇷',
          description: 'Produit de test'
        })
      });
      
      if (response.ok) {
        alert('✅ Produit créé avec succès');
        loadProducts();
      } else {
        const errorData = await response.json();
        alert(`❌ Erreur: ${errorData.error}`);
      }
    } catch (err: any) {
      alert(`❌ Erreur: ${err.message}`);
    }
  };

  const testDeleteProduct = async (id: number) => {
    if (!confirm('Supprimer ce produit ?')) return;
    
    try {
      const response = await fetch(`/api/products/${id}`, {
        method: 'DELETE'
      });
      
      if (response.ok) {
        alert('✅ Produit supprimé avec succès');
        loadProducts();
      } else {
        const errorData = await response.json();
        alert(`❌ Erreur: ${errorData.error}`);
      }
    } catch (err: any) {
      alert(`❌ Erreur: ${err.message}`);
    }
  };

  return (
    <div className="min-h-screen bg-black text-white p-4">
      <div className="max-w-6xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold">Admin Simple - HIDDEN SPINGFIELD</h1>
          <button
            onClick={() => router.push('/admin/dashboard')}
            className="bg-blue-600 hover:bg-blue-700 px-4 py-2 rounded"
          >
            Dashboard Complet
          </button>
        </div>

        {error && (
          <div className="bg-red-900 border border-red-500 rounded p-4 mb-4">
            <strong>Erreur:</strong> {error}
          </div>
        )}

        <div className="bg-gray-900 rounded-lg p-6 mb-6">
          <h2 className="text-xl font-bold mb-4">Test APIs</h2>
          <div className="space-x-4">
            <button
              onClick={loadProducts}
              className="bg-green-600 hover:bg-green-700 px-4 py-2 rounded"
              disabled={loading}
            >
              {loading ? 'Chargement...' : 'Recharger Produits'}
            </button>
            <button
              onClick={testCreateProduct}
              className="bg-blue-600 hover:bg-blue-700 px-4 py-2 rounded"
            >
              Créer Produit Test
            </button>
          </div>
        </div>

        <div className="bg-gray-900 rounded-lg p-6">
          <h2 className="text-xl font-bold mb-4">Produits ({products.length})</h2>
          
          {loading ? (
            <div className="text-center py-8">Chargement...</div>
          ) : products.length === 0 ? (
            <div className="text-center py-8 text-gray-400">Aucun produit trouvé</div>
          ) : (
            <div className="grid gap-4">
              {products.map((product) => (
                <div key={product.id} className="bg-gray-800 rounded-lg p-4 flex justify-between items-center">
                  <div>
                    <h3 className="font-bold">{product.name}</h3>
                    <p className="text-gray-400">ID: {product.id} | Prix: {product.price}€ | Catégorie: {product.category}</p>
                    <p className="text-gray-500 text-sm">Origine: {product.origin} | Stock: {product.quantity}</p>
                    {product.image && (
                      <div className="mt-2">
                        <img src={product.image} alt={product.name} className="w-16 h-16 object-cover rounded" />
                      </div>
                    )}
                  </div>
                  <div className="space-x-2">
                    <button
                      onClick={() => testDeleteProduct(product.id)}
                      className="bg-red-600 hover:bg-red-700 px-3 py-1 rounded text-sm"
                    >
                      Supprimer
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}