export default function Home() {
  return (
    <div className="min-h-screen bg-black text-white flex flex-col items-center justify-center p-4">
      <h1 className="text-4xl font-bold mb-8">HIDDEN SPINGFIELD</h1>
      <p className="text-xl mb-8">Boutique Premium</p>
      
      <div className="space-y-4">
        <a 
          href="/debug" 
          className="block bg-blue-600 hover:bg-blue-700 px-6 py-3 rounded-lg text-center"
        >
          🔍 Page Debug
        </a>
        <a 
          href="/admin/simple" 
          className="block bg-green-600 hover:bg-green-700 px-6 py-3 rounded-lg text-center"
        >
          🎛️ Admin Simple
        </a>
        <a 
          href="/admin/dashboard" 
          className="block bg-purple-600 hover:bg-purple-700 px-6 py-3 rounded-lg text-center"
        >
          🎯 Dashboard Complet
        </a>
      </div>
      
      <div className="mt-8 text-gray-400 text-center">
        <p>Version de test - Toutes les APIs Cloudflare D1 + R2</p>
        <p>Login admin: admin/admin123</p>
      </div>
    </div>
  );
}