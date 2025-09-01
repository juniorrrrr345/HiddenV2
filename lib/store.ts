import { create } from 'zustand';

export interface ProductPricing {
  weight: string;
  price: number;
}

export interface Product {
  id: string;
  name: string;
  origin: string;
  price: number; // Base price for compatibility
  pricing?: ProductPricing[]; // Multiple pricing options
  image: string;
  category: 'weed' | 'hash';
  tag?: string;
  tagColor?: 'red' | 'green';
  country: string;
  countryFlag: string;
  description?: string;
}

export interface CartItem extends Product {
  quantity: number;
}

export interface ThemeSettings {
  backgroundType: 'color' | 'image' | 'gradient';
  backgroundColor: string;
  backgroundImage: string;
  gradientFrom: string;
  gradientTo: string;
  shopName: string;
  bannerText: string;
  bannerSubtext: string;
  bannerImage: string;
  bannerImageFit: 'contain' | 'cover';
  orderLink: string;
}

interface StoreState {
  cart: CartItem[];
  isAuthenticated: boolean;
  themeSettings: ThemeSettings;
  addToCart: (product: Product) => void;
  removeFromCart: (productId: string) => void;
  updateQuantity: (productId: string, quantity: number) => void;
  clearCart: () => void;
  getTotalItems: () => number;
  getTotalPrice: () => number;
  setAuthenticated: (value: boolean) => void;
  updateThemeSettings: (settings: Partial<ThemeSettings>) => void;
  loadThemeSettings: () => Promise<void>;
}

export const useStore = create<StoreState>((set, get) => ({
  cart: [],
  isAuthenticated: false,
  themeSettings: {
    backgroundType: 'color',
    backgroundColor: 'black',
    backgroundImage: '',
    gradientFrom: '#000000',
    gradientTo: '#111111',
    shopName: 'HIDDEN SPINGFIELD',
    bannerText: 'NOUVEAU DROP',
    bannerSubtext: 'Découvrez nos produits premium de qualité exceptionnelle',
    bannerImage: '',
    bannerImageFit: 'contain',
    orderLink: ''
  },
  
  addToCart: (product) => {
    set((state) => {
      const existingItem = state.cart.find((item) => item.id === product.id);
      
      if (existingItem) {
        return {
          cart: state.cart.map((item) =>
            item.id === product.id
              ? { ...item, quantity: item.quantity + 1 }
              : item
          ),
        };
      }
      
      return {
        cart: [...state.cart, { ...product, quantity: 1 }],
      };
    });
  },
  
  removeFromCart: (productId) => {
    set((state) => ({
      cart: state.cart.filter((item) => item.id !== productId),
    }));
  },
  
  updateQuantity: (productId, quantity) => {
    if (quantity <= 0) {
      get().removeFromCart(productId);
      return;
    }
    
    set((state) => ({
      cart: state.cart.map((item) =>
        item.id === productId ? { ...item, quantity } : item
      ),
    }));
  },
  
  clearCart: () => {
    set({ cart: [] });
  },
  
  getTotalItems: () => {
    return get().cart.reduce((total, item) => total + item.quantity, 0);
  },
  
  getTotalPrice: () => {
    return get().cart.reduce((total, item) => total + item.price * item.quantity, 0);
  },
  
  setAuthenticated: (value) => {
    set({ isAuthenticated: value });
  },

  updateThemeSettings: async (newSettings) => {
    set((state) => ({
      themeSettings: { ...state.themeSettings, ...newSettings }
    }));
    
    // Sauvegarder dans localStorage (côté client uniquement)
    const updatedSettings = { ...get().themeSettings, ...newSettings };
    if (typeof window !== 'undefined') {
      localStorage.setItem('theme-settings', JSON.stringify(updatedSettings));
    }
    
    // Sauvegarder aussi via l'API
    try {
      await fetch('/api/settings', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(updatedSettings)
      });
    } catch (error) {
      console.error('Error saving theme settings to API:', error);
    }
  },

  loadThemeSettings: async () => {
    try {
      // Charger depuis localStorage en premier (côté client uniquement)
      if (typeof window !== 'undefined') {
        const saved = localStorage.getItem('theme-settings');
        if (saved) {
          const parsedSettings = JSON.parse(saved);
          set((state) => ({
            themeSettings: { ...state.themeSettings, ...parsedSettings }
          }));
        }
      }
      
      // Puis essayer de charger depuis l'API
      const response = await fetch('/api/settings');
      if (response.ok) {
        const apiSettings = await response.json();
        const themeSettings = {
          backgroundType: apiSettings.backgroundType || 'color',
          backgroundColor: apiSettings.backgroundColor || 'black',
          backgroundImage: apiSettings.backgroundImage || '',
          gradientFrom: apiSettings.gradientFrom || '#000000',
          gradientTo: apiSettings.gradientTo || '#111111',
          shopName: apiSettings.shopName || 'HIDDEN SPINGFIELD',
          bannerText: apiSettings.bannerText || 'NOUVEAU DROP',
          bannerSubtext: apiSettings.bannerSubtext || 'Découvrez nos produits premium de qualité exceptionnelle',
          bannerImage: apiSettings.bannerImage || '',
          bannerImageFit: apiSettings.bannerImageFit || 'contain',
          orderLink: apiSettings.orderLink || ''
        };
        
        set({ themeSettings });
        if (typeof window !== 'undefined') {
          localStorage.setItem('theme-settings', JSON.stringify(themeSettings));
        }
      }
    } catch (error) {
      console.error('Error loading theme settings:', error);
    }
  },
}));