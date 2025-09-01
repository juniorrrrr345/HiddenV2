'use client';

import { useState } from 'react';
import { ShoppingCart, Trash2, Minus, Plus, X, Send, Instagram, Facebook, Twitter } from 'lucide-react';

interface Product {
  _id: string;
  name: string;
  image: string;
  price: number;
  quantity: number;
  category: string;
  weight?: string;
  description?: string;
}

interface Category {
  _id: string;
  name: string;
  slug: string;
}

interface Settings {
  shopName: string;
  bannerImage: string;
  bannerText: string;
  orderLink?: string;
}

interface ShopPageProps {
  settings: Settings;
  categories: Category[];
  products: Product[];
}

export default function ShopPage({ settings, categories, products }: ShopPageProps) {
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [cart, setCart] = useState<any[]>([]);
  const [showCart, setShowCart] = useState(false);

  const filteredProducts = selectedCategory === 'all' 
    ? products.slice(0, 4) // Afficher seulement 4 produits
    : products.filter(p => p.category === selectedCategory).slice(0, 4);

  const addToCart = (product: Product) => {
    const existingItem = cart.find(item => item._id === product._id);
    
    if (existingItem) {
      setCart(cart.map(item => 
        item._id === product._id 
          ? { ...item, cartQuantity: item.cartQuantity + 1 }
          : item
      ));
    } else {
      setCart([...cart, { ...product, cartQuantity: 1, weight: product.weight || '1g' }]);
    }
  };

  const updateQuantity = (productId: string, change: number) => {
    setCart(cart.map(item => {
      if (item._id === productId) {
        const newQuantity = item.cartQuantity + change;
        return newQuantity > 0 ? { ...item, cartQuantity: newQuantity } : null;
      }
      return item;
    }).filter(Boolean));
  };

  const removeFromCart = (productId: string) => {
    setCart(cart.filter(item => item._id !== productId));
  };

  const clearCart = () => {
    setCart([]);
    setShowCart(false);
  };

  const getTotalItems = () => {
    return cart.reduce((total, item) => total + item.cartQuantity, 0);
  };

  const getTotalPrice = () => {
    return cart.reduce((total, item) => total + (item.price * item.cartQuantity), 0);
  };

  const sendOrder = () => {
    if (!settings.orderLink) {
      alert('Lien de commande non configuré');
      return;
    }

    // Créer le message de commande
    let message = `🛒 NOUVELLE COMMANDE\n\n`;
    message += `📦 Articles (${getTotalItems()}):\n`;
    message += `------------------------\n`;
    
    cart.forEach(item => {
      message += `• ${item.name}\n`;
      message += `  Catégorie: ${item.category}\n`;
      message += `  Quantité: ${item.cartQuantity}\n`;
      message += `  Prix: ${item.price}€\n\n`;
    });
    
    message += `------------------------\n`;
    message += `💰 TOTAL: ${getTotalPrice()}€`;

    // Encoder le message pour l'URL
    const encodedMessage = encodeURIComponent(message);
    
    // Rediriger vers le lien configuré (Telegram, WhatsApp, etc.)
    const orderUrl = settings.orderLink.replace('{message}', encodedMessage);
    window.open(orderUrl, '_blank');
  };

  return (
    <div className="min-h-screen bg-gray-900">
      {/* Header avec nom de boutique */}
      <header className="bg-black py-4 border-b border-gray-800">
        <div className="container mx-auto px-4">
          <h1 className="text-3xl font-bold text-center text-white">
            {settings.shopName}
          </h1>
        </div>
      </header>

      {/* Bannière avec image et texte "NOUVEAU DROP" */}
      <section className="relative h-64 bg-purple-900 overflow-hidden">
        {settings.bannerImage && (
          <img 
            src={settings.bannerImage} 
            alt={settings.bannerText}
            className="absolute inset-0 w-full h-full object-cover opacity-50"
          />
        )}
        <div className="absolute inset-0 flex items-center justify-center">
          <h2 className="text-4xl md:text-5xl font-bold text-white drop-shadow-lg">
            {settings.bannerText || 'NOUVEAU DROP'}
          </h2>
        </div>
      </section>

      {/* Section Catégories */}
      <section className="container mx-auto px-4 py-8">
        <h3 className="text-xl font-bold text-white mb-4">Catégories</h3>
        <div className="flex gap-4">
          <button
            onClick={() => setSelectedCategory('all')}
            className={`px-6 py-3 rounded-lg font-medium border-2 transition-all ${
              selectedCategory === 'all'
                ? 'bg-purple-600 text-white border-purple-600'
                : 'bg-transparent text-gray-300 border-gray-600 hover:border-purple-600'
            }`}
          >
            Tout
          </button>
          <button
            onClick={() => setSelectedCategory('weed')}
            className={`px-6 py-3 rounded-lg font-medium border-2 transition-all ${
              selectedCategory === 'weed'
                ? 'bg-purple-600 text-white border-purple-600'
                : 'bg-transparent text-gray-300 border-gray-600 hover:border-purple-600'
            }`}
          >
            🌿 Weed
          </button>
          <button
            onClick={() => setSelectedCategory('hash')}
            className={`px-6 py-3 rounded-lg font-medium border-2 transition-all ${
              selectedCategory === 'hash'
                ? 'bg-purple-600 text-white border-purple-600'
                : 'bg-transparent text-gray-300 border-gray-600 hover:border-purple-600'
            }`}
          >
            🍫 Hash
          </button>
        </div>
      </section>

      {/* Grille de produits (2x2) */}
      <section className="container mx-auto px-4 pb-8">
        <h3 className="text-xl font-bold text-white mb-6">Produits disponibles</h3>
        <div className="grid grid-cols-2 gap-4 max-w-4xl mx-auto">
          {filteredProducts.map((product) => (
            <div
              key={product._id}
              className="bg-gray-800 rounded-lg overflow-hidden border border-gray-700"
            >
              <div className="aspect-square relative">
                <img
                  src={product.image || '/placeholder.jpg'}
                  alt={product.name}
                  className="w-full h-full object-cover"
                />
                {/* Badge catégorie */}
                <span className="absolute top-2 left-2 px-3 py-1 bg-black/70 text-white text-xs rounded-full">
                  {product.category === 'weed' ? '🌿 Weed' : '🍫 Hash'}
                </span>
              </div>
              <div className="p-4">
                <h4 className="font-bold text-white text-lg mb-2">{product.name}</h4>
                <div className="flex justify-between items-center">
                  <span className="text-2xl font-bold text-purple-400">{product.price}€</span>
                  <button
                    onClick={() => addToCart(product)}
                    className="bg-purple-600 hover:bg-purple-700 text-white px-4 py-2 rounded-lg transition-colors"
                  >
                    Ajouter
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Footer avec réseaux sociaux et panier */}
      <footer className="fixed bottom-0 left-0 right-0 bg-black border-t border-gray-800">
        <div className="container mx-auto px-4 py-3">
          <div className="flex justify-between items-center">
            {/* Réseaux sociaux */}
            <div className="flex gap-4">
              <a href="#" className="text-gray-400 hover:text-white transition-colors">
                <Instagram size={24} />
              </a>
              <a href="#" className="text-gray-400 hover:text-white transition-colors">
                <Facebook size={24} />
              </a>
              <a href="#" className="text-gray-400 hover:text-white transition-colors">
                <Twitter size={24} />
              </a>
            </div>

            {/* Bouton panier */}
            <button
              onClick={() => setShowCart(!showCart)}
              className="flex items-center gap-2 bg-purple-600 hover:bg-purple-700 text-white px-4 py-2 rounded-lg transition-colors"
            >
              <ShoppingCart size={20} />
              <span>Votre panier ({getTotalItems()})</span>
            </button>
          </div>
        </div>
      </footer>

      {/* Panneau Panier */}
      {showCart && (
        <div className="fixed inset-0 z-50 flex justify-end">
          {/* Backdrop */}
          <div 
            className="absolute inset-0 bg-black/50"
            onClick={() => setShowCart(false)}
          />
          
          {/* Panier */}
          <div className="relative bg-gray-900 w-full max-w-md h-full overflow-y-auto border-l border-gray-800">
            {/* Header du panier */}
            <div className="sticky top-0 bg-gray-900 border-b border-gray-800 p-4">
              <div className="flex justify-between items-center">
                <h3 className="text-xl font-bold text-white">Votre panier</h3>
                <div className="flex gap-2">
                  <button
                    onClick={clearCart}
                    className="p-2 text-red-400 hover:text-red-300 transition-colors"
                    title="Vider le panier"
                  >
                    <Trash2 size={20} />
                  </button>
                  <button
                    onClick={() => setShowCart(false)}
                    className="p-2 text-gray-400 hover:text-white transition-colors"
                    title="Fermer"
                  >
                    <X size={20} />
                  </button>
                </div>
              </div>
            </div>

            {/* Contenu du panier */}
            <div className="p-4">
              {cart.length === 0 ? (
                <p className="text-gray-400 text-center py-8">Votre panier est vide</p>
              ) : (
                <>
                  {/* Liste des produits */}
                  <div className="space-y-4 mb-6">
                    {cart.map((item) => (
                      <div key={item._id} className="bg-gray-800 rounded-lg p-4">
                        <div className="flex gap-4">
                          {/* Image produit */}
                          <img
                            src={item.image || '/placeholder.jpg'}
                            alt={item.name}
                            className="w-20 h-20 object-cover rounded-lg"
                          />
                          
                          {/* Infos produit */}
                          <div className="flex-1">
                            <h4 className="font-bold text-white">{item.name}</h4>
                            <p className="text-gray-400 text-sm">
                              Catégorie: {item.category === 'weed' ? '🌿 Weed' : '🍫 Hash'}
                            </p>
                            <p className="text-gray-400 text-sm">
                              Poids: {item.weight || '1g'}
                            </p>
                            
                            {/* Quantité et prix */}
                            <div className="flex justify-between items-center mt-2">
                              <div className="flex items-center gap-2">
                                <button
                                  onClick={() => updateQuantity(item._id, -1)}
                                  className="w-6 h-6 bg-gray-700 hover:bg-gray-600 rounded flex items-center justify-center"
                                >
                                  <Minus size={14} />
                                </button>
                                <span className="text-white font-medium w-8 text-center">
                                  {item.cartQuantity}
                                </span>
                                <button
                                  onClick={() => updateQuantity(item._id, 1)}
                                  className="w-6 h-6 bg-gray-700 hover:bg-gray-600 rounded flex items-center justify-center"
                                >
                                  <Plus size={14} />
                                </button>
                              </div>
                              <span className="text-purple-400 font-bold">
                                {(item.price * item.cartQuantity)}€
                              </span>
                            </div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>

                  {/* Total et commande */}
                  <div className="border-t border-gray-800 pt-4">
                    <div className="flex justify-between mb-2">
                      <span className="text-gray-400">Nombre total d'articles:</span>
                      <span className="text-white font-bold">{getTotalItems()}</span>
                    </div>
                    <div className="flex justify-between mb-4">
                      <span className="text-gray-400">Prix total:</span>
                      <span className="text-2xl font-bold text-purple-400">{getTotalPrice()}€</span>
                    </div>
                    
                    <button
                      onClick={sendOrder}
                      className="w-full bg-green-600 hover:bg-green-700 text-white font-bold py-3 rounded-lg transition-colors flex items-center justify-center gap-2"
                    >
                      <Send size={20} />
                      Commander
                    </button>
                  </div>
                </>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}