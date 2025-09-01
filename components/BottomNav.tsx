'use client';

import { Home, ShoppingCart, Send, Instagram } from 'lucide-react';
import { useStore } from '@/lib/store';
import { motion } from 'framer-motion';
import Link from 'next/link';

export default function BottomNav() {
  const totalItems = useStore((state) => state.getTotalItems());

  const navItems = [
    { icon: Home, label: 'Accueil', href: '/' },
    { icon: Instagram, label: 'Instagram', href: 'https://instagram.com', external: true },
    { icon: Send, label: 'Telegram', href: 'https://telegram.org', external: true },
    { icon: ShoppingCart, label: 'Panier', href: '/cart', badge: totalItems }
  ];

  return (
    <div className="fixed bottom-0 left-0 right-0 z-50">
      <div className="bg-gray-900/80 backdrop-blur-xl border-t border-gray-800">
        <div className="flex justify-around items-center py-2">
          {navItems.map((item) => {
            const Icon = item.icon;
            const content = (
              <motion.div
                className="flex flex-col items-center p-2 cursor-pointer relative"
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
              >
                <div className="relative">
                  <Icon size={24} className="text-gray-300" />
                  {item.badge && item.badge > 0 && (
                    <span className="absolute -top-2 -right-2 bg-purple-600 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center font-bold">
                      {item.badge}
                    </span>
                  )}
                </div>
                <span className="text-xs text-gray-400 mt-1">{item.label}</span>
              </motion.div>
            );

            if (item.external) {
              return (
                <a
                  key={item.label}
                  href={item.href}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  {content}
                </a>
              );
            }

            return (
              <Link key={item.label} href={item.href}>
                {content}
              </Link>
            );
          })}
        </div>
      </div>
    </div>
  );
}