'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { 
  ArrowLeft, 
  Plus, 
  Minus, 
  Trash2, 
  ShoppingCart,
  Send,
  Home,
  Instagram,
  MessageCircle
} from 'lucide-react';
import { useStore } from '@/lib/store';

export default function CartPage() {
  const router = useRouter();
  const { cart, updateQuantity, removeFromCart, clearCart, getTotalItems, getTotalPrice } = useStore();
  const [settings, setSettings] = useState<any>(null);

  useEffect(() => {
    fetchSettings();
  }, []);

  const fetchSettings = async () => {
    try {
      const response = await fetch('/api/settings');
      if (response.ok) {
        const data = await response.json();
        setSettings(data);
      }
    } catch (error) {
      console.error('Erreur chargement settings:', error);
    }
  };

  const handleOrder = () => {
    if (cart.length === 0) {
      alert('Votre panier est vide');
      return;
    }

    if (!settings?.orderLink) {
      alert('Lien de commande non configuré');
      return;
    }

    // Créer le message de commande
    let message = `🛒 NOUVELLE COMMANDE\\n\\n`;
    message += `📦 Articles (${getTotalItems()}):\\n`;
    message += `------------------------\\n`;
    
    cart.forEach(item => {
      message += `• ${item.name}\\n`;
      message += `  Quantité: ${item.quantity}\\n`;
      message += `  Prix: ${item.price}€\\n\\n`;
    });
    
    message += `------------------------\\n`;
    message += `💰 TOTAL: ${getTotalPrice()}€`;

    // Remplacer le placeholder dans le lien
    const orderUrl = settings.orderLink.replace('{message}', encodeURIComponent(message));
    window.open(orderUrl, '_blank');
  };

  const increaseQuantity = (productId: string) => {
    const item = cart.find(item => item.id === productId);
    if (item) {
      updateQuantity(productId, item.quantity + 1);
    }
  };

  const decreaseQuantity = (productId: string) => {
    const item = cart.find(item => item.id === productId);
    if (item && item.quantity > 1) {
      updateQuantity(productId, item.quantity - 1);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-900 to-black text-white">
      {/* Header moderne et minimaliste */}
      <div className="sticky top-0 z-10 bg-black/50 backdrop-blur-lg border-b border-gray-800">
        <div className="max-w-6xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <button
              onClick={() => router.back()}
              className="p-2 hover:bg-white/10 rounded-lg transition-all"
            >
              <ArrowLeft size={20} />
            </button>
            
            <div className="text-center">
              <h1 className="text-xl font-bold">MON PANIER</h1>
              <p className="text-xs text-gray-400 mt-1">{getTotalItems()} article{getTotalItems() > 1 ? 's' : ''}</p>
            </div>

            <button
              onClick={() => router.push('/')}
              className="p-2 hover:bg-white/10 rounded-lg transition-all"
            >
              <Home size={20} />
            </button>
          </div>
        </div>
      </div>

      {/* Contenu principal */}
      <div className="max-w-6xl mx-auto px-4 py-8">
        <div className="grid lg:grid-cols-3 gap-8">
          {/* Liste des produits */}
          <div className="lg:col-span-2 space-y-4">
            {cart.length === 0 ? (
              <motion.div 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="text-center py-20"
              >
                <ShoppingCart size={64} className="mx-auto text-gray-600 mb-4" />
                <h2 className="text-2xl font-bold mb-2">Votre panier est vide</h2>
                <p className="text-gray-400 mb-6">Découvrez nos produits et ajoutez-les à votre panier</p>
                <button
                  onClick={() => router.push('/')}
                  className="bg-white text-black px-6 py-3 rounded-lg font-bold hover:bg-gray-200 transition-all"
                >
                  Continuer mes achats
                </button>
              </motion.div>
            ) : (
              <>
                {cart.map((item, index) => (
                  <motion.div
                    key={item.id}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.1 }}
                    className="bg-gray-900/50 backdrop-blur rounded-xl p-4 hover:bg-gray-900/70 transition-all"
                  >
                    <div className="flex gap-4">
                      {/* Image produit */}
                      <div className="w-24 h-24 bg-gray-800 rounded-lg overflow-hidden flex-shrink-0">
                        {item.image ? (
                          <img 
                            src={item.image} 
                            alt={item.name}
                            className="w-full h-full object-cover"
                          />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center">
                            <ShoppingCart size={32} className="text-gray-600" />
                          </div>
                        )}
                      </div>

                      {/* Infos produit */}
                      <div className="flex-1">
                        <div className="flex justify-between items-start mb-2">
                          <div>
                            <h3 className="font-bold text-lg">{item.name}</h3>
                            {item.origin && (
                              <p className="text-sm text-gray-400">{item.origin}</p>
                            )}
                          </div>
                          <button
                            onClick={() => removeFromCart(item.id)}
                            className="text-red-400 hover:text-red-300 p-1 hover:bg-red-500/10 rounded transition-all"
                          >
                            <Trash2 size={18} />
                          </button>
                        </div>

                        <div className="flex justify-between items-center">
                          {/* Contrôles de quantité */}
                          <div className="flex items-center gap-2">
                            <button
                              onClick={() => decreaseQuantity(item.id)}
                              className="w-8 h-8 rounded-lg bg-gray-800 hover:bg-gray-700 flex items-center justify-center transition-all"
                            >
                              <Minus size={16} />
                            </button>
                            <span className="w-12 text-center font-bold">{item.quantity}</span>
                            <button
                              onClick={() => increaseQuantity(item.id)}
                              className="w-8 h-8 rounded-lg bg-gray-800 hover:bg-gray-700 flex items-center justify-center transition-all"
                            >
                              <Plus size={16} />
                            </button>
                          </div>

                          {/* Prix */}
                          <div className="text-right">
                            <p className="text-xl font-bold">{(item.price * item.quantity).toFixed(2)}€</p>
                            <p className="text-xs text-gray-400">{item.price}€ / unité</p>
                          </div>
                        </div>
                      </div>
                    </div>
                  </motion.div>
                ))}

                {/* Bouton vider le panier */}
                <div className="text-center pt-4">
                  <button
                    onClick={() => {
                      if (confirm('Êtes-vous sûr de vouloir vider votre panier ?')) {
                        clearCart();
                      }
                    }}
                    className="text-gray-400 hover:text-red-400 text-sm transition-all"
                  >
                    Vider le panier
                  </button>
                </div>
              </>
            )}
          </div>

          {/* Résumé de commande */}
          {cart.length > 0 && (
            <div className="lg:col-span-1">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-gray-900/50 backdrop-blur rounded-xl p-6 sticky top-24"
              >
                <h2 className="text-xl font-bold mb-6">Résumé de la commande</h2>
                
                <div className="space-y-3 mb-6">
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-400">Sous-total</span>
                    <span>{getTotalPrice()}€</span>
                  </div>
                  <div className="h-px bg-gray-700"></div>
                  <div className="flex justify-between items-center">
                    <span className="text-lg font-bold">TOTAL</span>
                    <span className="text-2xl font-bold text-green-400">{getTotalPrice()}€</span>
                  </div>
                </div>

                <div className="text-xs text-gray-400 text-center mb-6">
                  {getTotalItems()} article{getTotalItems() > 1 ? 's' : ''} dans votre panier
                </div>

                {/* Trois boutons de commande modernes */}
                <div className="space-y-3">
                  <p className="text-center text-sm text-gray-400 font-medium mb-4">
                    CHOISISSEZ VOTRE VENDEUR
                  </p>
                  
                  {/* Bouton BURNS */}
                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={() => {
                      if (cart.length === 0) {
                        alert('Votre panier est vide');
                        return;
                      }

                      // Créer le message de commande
                      let message = `🛒 NOUVELLE COMMANDE\n\n`;
                      message += `📦 Détails de la commande:\n`;
                      message += `━━━━━━━━━━━━━━━━━━━━\n\n`;
                      
                      // Grouper les produits par nom de base
                      const groupedItems: { [key: string]: any[] } = {};
                      cart.forEach(item => {
                        const baseName = item.name.split(' - ')[0];
                        if (!groupedItems[baseName]) {
                          groupedItems[baseName] = [];
                        }
                        groupedItems[baseName].push(item);
                      });
                      
                      // Afficher les produits groupés
                      Object.keys(groupedItems).forEach(baseName => {
                        message += `📌 ${baseName}\n`;
                        groupedItems[baseName].forEach(item => {
                          const option = item.name.includes(' - ') ? item.name.split(' - ')[1] : '';
                          if (option) {
                            message += `   • ${option}: ${item.quantity}x ${item.price}€ = ${(item.quantity * item.price).toFixed(2)}€\n`;
                          } else {
                            message += `   • Quantité: ${item.quantity}x ${item.price}€ = ${(item.quantity * item.price).toFixed(2)}€\n`;
                          }
                        });
                        message += `\n`;
                      });
                      
                      message += `━━━━━━━━━━━━━━━━━━━━\n`;
                      message += `💰 TOTAL: ${getTotalPrice()}€\n`;
                      message += `━━━━━━━━━━━━━━━━━━━━\n\n`;
                      message += `📍 Êtes-vous disponible ?`;

                      if (settings?.burnsLink) {
                        let orderUrl = settings.burnsLink;
                        
                        // Gérer différents types de liens
                        if (orderUrl.includes('t.me') || orderUrl.includes('telegram')) {
                          // Lien Telegram - utiliser l'API pour pré-remplir le message
                          if (!orderUrl.includes('?text=')) {
                            orderUrl += `?text=${encodeURIComponent(message)}`;
                          } else {
                            orderUrl = orderUrl.replace('{message}', encodeURIComponent(message));
                          }
                        } else if (orderUrl.includes('wa.me') || orderUrl.includes('whatsapp')) {
                          // WhatsApp
                          if (!orderUrl.includes('?text=')) {
                            orderUrl += `?text=${encodeURIComponent(message)}`;
                          } else {
                            orderUrl = orderUrl.replace('{message}', encodeURIComponent(message));
                          }
                        } else if (orderUrl.includes('instagram') || orderUrl.includes('facebook')) {
                          // Pour Instagram/Facebook, on copie le message dans le presse-papier
                          navigator.clipboard.writeText(message).then(() => {
                            alert('Message copié ! Collez-le dans votre conversation.');
                          });
                        } else if (orderUrl.includes('{message}')) {
                          // Lien générique avec placeholder
                          orderUrl = orderUrl.replace('{message}', encodeURIComponent(message));
                        }
                        
                        window.open(orderUrl, '_blank');
                      } else {
                        alert('Le lien pour BURNS n\'est pas encore configuré. Contactez l\'administrateur.');
                      }
                    }}
                    className="w-full bg-gradient-to-r from-orange-500 to-orange-600 text-white py-3 rounded-lg font-bold hover:from-orange-600 hover:to-orange-700 transition-all shadow-lg"
                  >
                    🔥 COMMANDER CHEZ BURNS
                  </motion.button>

                  {/* Bouton APU */}
                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={() => {
                      if (cart.length === 0) {
                        alert('Votre panier est vide');
                        return;
                      }

                      // Créer le message de commande
                      let message = `🛒 NOUVELLE COMMANDE\n\n`;
                      message += `📦 Détails de la commande:\n`;
                      message += `━━━━━━━━━━━━━━━━━━━━\n\n`;
                      
                      // Grouper les produits par nom de base
                      const groupedItems: { [key: string]: any[] } = {};
                      cart.forEach(item => {
                        const baseName = item.name.split(' - ')[0];
                        if (!groupedItems[baseName]) {
                          groupedItems[baseName] = [];
                        }
                        groupedItems[baseName].push(item);
                      });
                      
                      // Afficher les produits groupés
                      Object.keys(groupedItems).forEach(baseName => {
                        message += `📌 ${baseName}\n`;
                        groupedItems[baseName].forEach(item => {
                          const option = item.name.includes(' - ') ? item.name.split(' - ')[1] : '';
                          if (option) {
                            message += `   • ${option}: ${item.quantity}x ${item.price}€ = ${(item.quantity * item.price).toFixed(2)}€\n`;
                          } else {
                            message += `   • Quantité: ${item.quantity}x ${item.price}€ = ${(item.quantity * item.price).toFixed(2)}€\n`;
                          }
                        });
                        message += `\n`;
                      });
                      
                      message += `━━━━━━━━━━━━━━━━━━━━\n`;
                      message += `💰 TOTAL: ${getTotalPrice()}€\n`;
                      message += `━━━━━━━━━━━━━━━━━━━━\n\n`;
                      message += `📍 Êtes-vous disponible ?`;

                      if (settings?.apuLink) {
                        let orderUrl = settings.apuLink;
                        
                        // Gérer différents types de liens
                        if (orderUrl.includes('t.me') || orderUrl.includes('telegram')) {
                          // Lien Telegram - utiliser l'API pour pré-remplir le message
                          if (!orderUrl.includes('?text=')) {
                            orderUrl += `?text=${encodeURIComponent(message)}`;
                          } else {
                            orderUrl = orderUrl.replace('{message}', encodeURIComponent(message));
                          }
                        } else if (orderUrl.includes('wa.me') || orderUrl.includes('whatsapp')) {
                          // WhatsApp
                          if (!orderUrl.includes('?text=')) {
                            orderUrl += `?text=${encodeURIComponent(message)}`;
                          } else {
                            orderUrl = orderUrl.replace('{message}', encodeURIComponent(message));
                          }
                        } else if (orderUrl.includes('instagram') || orderUrl.includes('facebook')) {
                          // Pour Instagram/Facebook, on copie le message dans le presse-papier
                          navigator.clipboard.writeText(message).then(() => {
                            alert('Message copié ! Collez-le dans votre conversation.');
                          });
                        } else if (orderUrl.includes('{message}')) {
                          // Lien générique avec placeholder
                          orderUrl = orderUrl.replace('{message}', encodeURIComponent(message));
                        }
                        
                        window.open(orderUrl, '_blank');
                      } else {
                        alert('Le lien pour APU n\'est pas encore configuré. Contactez l\'administrateur.');
                      }
                    }}
                    className="w-full bg-gradient-to-r from-green-500 to-green-600 text-white py-3 rounded-lg font-bold hover:from-green-600 hover:to-green-700 transition-all shadow-lg"
                  >
                    🍀 COMMANDER CHEZ APU
                  </motion.button>

                  {/* Bouton MOE */}
                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={() => {
                      if (cart.length === 0) {
                        alert('Votre panier est vide');
                        return;
                      }

                      // Créer le message de commande
                      let message = `🛒 NOUVELLE COMMANDE\n\n`;
                      message += `📦 Détails de la commande:\n`;
                      message += `━━━━━━━━━━━━━━━━━━━━\n\n`;
                      
                      // Grouper les produits par nom de base
                      const groupedItems: { [key: string]: any[] } = {};
                      cart.forEach(item => {
                        const baseName = item.name.split(' - ')[0];
                        if (!groupedItems[baseName]) {
                          groupedItems[baseName] = [];
                        }
                        groupedItems[baseName].push(item);
                      });
                      
                      // Afficher les produits groupés
                      Object.keys(groupedItems).forEach(baseName => {
                        message += `📌 ${baseName}\n`;
                        groupedItems[baseName].forEach(item => {
                          const option = item.name.includes(' - ') ? item.name.split(' - ')[1] : '';
                          if (option) {
                            message += `   • ${option}: ${item.quantity}x ${item.price}€ = ${(item.quantity * item.price).toFixed(2)}€\n`;
                          } else {
                            message += `   • Quantité: ${item.quantity}x ${item.price}€ = ${(item.quantity * item.price).toFixed(2)}€\n`;
                          }
                        });
                        message += `\n`;
                      });
                      
                      message += `━━━━━━━━━━━━━━━━━━━━\n`;
                      message += `💰 TOTAL: ${getTotalPrice()}€\n`;
                      message += `━━━━━━━━━━━━━━━━━━━━\n\n`;
                      message += `📍 Êtes-vous disponible ?`;

                      if (settings?.moeLink) {
                        let orderUrl = settings.moeLink;
                        
                        // Gérer différents types de liens
                        if (orderUrl.includes('t.me') || orderUrl.includes('telegram')) {
                          // Lien Telegram - utiliser l'API pour pré-remplir le message
                          if (!orderUrl.includes('?text=')) {
                            orderUrl += `?text=${encodeURIComponent(message)}`;
                          } else {
                            orderUrl = orderUrl.replace('{message}', encodeURIComponent(message));
                          }
                        } else if (orderUrl.includes('wa.me') || orderUrl.includes('whatsapp')) {
                          // WhatsApp
                          if (!orderUrl.includes('?text=')) {
                            orderUrl += `?text=${encodeURIComponent(message)}`;
                          } else {
                            orderUrl = orderUrl.replace('{message}', encodeURIComponent(message));
                          }
                        } else if (orderUrl.includes('instagram') || orderUrl.includes('facebook')) {
                          // Pour Instagram/Facebook, on copie le message dans le presse-papier
                          navigator.clipboard.writeText(message).then(() => {
                            alert('Message copié ! Collez-le dans votre conversation.');
                          });
                        } else if (orderUrl.includes('{message}')) {
                          // Lien générique avec placeholder
                          orderUrl = orderUrl.replace('{message}', encodeURIComponent(message));
                        }
                        
                        window.open(orderUrl, '_blank');
                      } else {
                        alert('Le lien pour MOE n\'est pas encore configuré. Contactez l\'administrateur.');
                      }
                    }}
                    className="w-full bg-gradient-to-r from-purple-500 to-purple-600 text-white py-3 rounded-lg font-bold hover:from-purple-600 hover:to-purple-700 transition-all shadow-lg"
                  >
                    💜 COMMANDER CHEZ MOE
                  </motion.button>
                </div>
              </motion.div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}