'use client';

import { useState, useEffect } from 'react';

export default function DebugPage() {
  const [mounted, setMounted] = useState(false);
  const [apiTests, setApiTests] = useState({
    products: { status: 'pending', data: null, error: null },
    categories: { status: 'pending', data: null, error: null },
    settings: { status: 'pending', data: null, error: null }
  });

  useEffect(() => {
    setMounted(true);
    testAllApis();
  }, []);

  const testAllApis = async () => {
    // Test API Products
    try {
      const response = await fetch('/api/products');
      const data = await response.json();
      setApiTests(prev => ({
        ...prev,
        products: { status: 'success', data, error: null }
      }));
    } catch (error: any) {
      setApiTests(prev => ({
        ...prev,
        products: { status: 'error', data: null, error: error.message }
      }));
    }

    // Test API Categories
    try {
      const response = await fetch('/api/categories');
      const data = await response.json();
      setApiTests(prev => ({
        ...prev,
        categories: { status: 'success', data, error: null }
      }));
    } catch (error: any) {
      setApiTests(prev => ({
        ...prev,
        categories: { status: 'error', data: null, error: error.message }
      }));
    }

    // Test API Settings
    try {
      const response = await fetch('/api/settings');
      const data = await response.json();
      setApiTests(prev => ({
        ...prev,
        settings: { status: 'success', data, error: null }
      }));
    } catch (error: any) {
      setApiTests(prev => ({
        ...prev,
        settings: { status: 'error', data: null, error: error.message }
      }));
    }
  };

  if (!mounted) {
    return <div>Chargement...</div>;
  }

  return (
    <div className="min-h-screen bg-black text-white p-4">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold mb-8">🔍 Debug HIDDEN SPINGFIELD</h1>
        
        <div className="space-y-6">
          <div className="bg-gray-900 rounded-lg p-6">
            <h2 className="text-xl font-bold mb-4">État du montage</h2>
            <p className="text-green-400">✅ Composant monté côté client</p>
          </div>

          <div className="bg-gray-900 rounded-lg p-6">
            <h2 className="text-xl font-bold mb-4">Test des APIs</h2>
            
            {Object.entries(apiTests).map(([apiName, test]) => (
              <div key={apiName} className="mb-4 p-4 bg-gray-800 rounded">
                <h3 className="font-bold mb-2">API {apiName}</h3>
                <div className="flex items-center space-x-2 mb-2">
                  <span className={`px-2 py-1 rounded text-sm ${
                    test.status === 'success' ? 'bg-green-600' : 
                    test.status === 'error' ? 'bg-red-600' : 'bg-yellow-600'
                  }`}>
                    {test.status}
                  </span>
                </div>
                
                {test.error && (
                  <div className="text-red-300 text-sm mb-2">
                    <strong>Erreur:</strong> {test.error}
                  </div>
                )}
                
                {test.data && (
                  <div className="text-gray-300 text-sm">
                    <strong>Données:</strong> {Array.isArray(test.data) ? `${(test.data as any[]).length} éléments` : 'Objet'}
                    <pre className="mt-2 bg-gray-700 p-2 rounded text-xs overflow-auto max-h-32">
                      {JSON.stringify(test.data, null, 2)}
                    </pre>
                  </div>
                )}
              </div>
            ))}
          </div>

          <div className="bg-gray-900 rounded-lg p-6">
            <h2 className="text-xl font-bold mb-4">Actions</h2>
            <div className="space-x-4">
              <button
                onClick={testAllApis}
                className="bg-blue-600 hover:bg-blue-700 px-4 py-2 rounded"
              >
                Retester APIs
              </button>
              <a
                href="/admin/simple"
                className="bg-green-600 hover:bg-green-700 px-4 py-2 rounded inline-block"
              >
                Admin Simple
              </a>
              <a
                href="/admin/dashboard"
                className="bg-purple-600 hover:bg-purple-700 px-4 py-2 rounded inline-block"
              >
                Dashboard Complet
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}