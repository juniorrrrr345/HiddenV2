// Cache management system for real-time sync between admin and shop

interface CacheItem<T> {
  data: T;
  timestamp: number;
  expiry: number;
}

class CacheManager {
  private cache = new Map<string, CacheItem<any>>();
  private readonly DEFAULT_TTL = 5 * 60 * 1000; // 5 minutes

  set<T>(key: string, data: T, ttl: number = this.DEFAULT_TTL): void {
    const item: CacheItem<T> = {
      data,
      timestamp: Date.now(),
      expiry: Date.now() + ttl,
    };
    this.cache.set(key, item);
  }

  get<T>(key: string): T | null {
    const item = this.cache.get(key);
    if (!item) return null;

    // Check if expired
    if (Date.now() > item.expiry) {
      this.cache.delete(key);
      return null;
    }

    return item.data;
  }

  delete(key: string): void {
    this.cache.delete(key);
  }

  clear(): void {
    this.cache.clear();
  }

  // Invalidate related cache entries
  invalidatePattern(pattern: string): void {
    const regex = new RegExp(pattern);
    for (const [key] of this.cache) {
      if (regex.test(key)) {
        this.cache.delete(key);
      }
    }
  }

  // Get cache stats
  getStats() {
    const now = Date.now();
    const total = this.cache.size;
    const expired = Array.from(this.cache.values()).filter(item => now > item.expiry).length;
    
    return {
      total,
      expired,
      active: total - expired,
    };
  }
}

// Global cache instance
export const cache = new CacheManager();

// Cache keys constants
export const CACHE_KEYS = {
  PRODUCTS: 'products',
  PRODUCT: (id: string) => `product:${id}`,
  CATEGORIES: 'categories',
  CATEGORY: (id: string) => `category:${id}`,
  SETTINGS: 'settings',
} as const;

// Helper functions for common operations
export const cacheHelpers = {
  // Products
  setProducts: (products: any[]) => cache.set(CACHE_KEYS.PRODUCTS, products),
  getProducts: () => cache.get(CACHE_KEYS.PRODUCTS),
  setProduct: (id: string, product: any) => cache.set(CACHE_KEYS.PRODUCT(id), product),
  getProduct: (id: string) => cache.get(CACHE_KEYS.PRODUCT(id)),
  invalidateProducts: () => {
    cache.delete(CACHE_KEYS.PRODUCTS);
    cache.invalidatePattern('^product:');
  },

  // Categories  
  setCategories: (categories: any[]) => cache.set(CACHE_KEYS.CATEGORIES, categories),
  getCategories: () => cache.get(CACHE_KEYS.CATEGORIES),
  setCategory: (id: string, category: any) => cache.set(CACHE_KEYS.CATEGORY(id), category),
  getCategory: (id: string) => cache.get(CACHE_KEYS.CATEGORY(id)),
  invalidateCategories: () => {
    cache.delete(CACHE_KEYS.CATEGORIES);
    cache.invalidatePattern('^category:');
  },

  // Settings
  setSettings: (settings: any) => cache.set(CACHE_KEYS.SETTINGS, settings),
  getSettings: () => cache.get(CACHE_KEYS.SETTINGS),
  invalidateSettings: () => cache.delete(CACHE_KEYS.SETTINGS),

  // Clear all
  clearAll: () => cache.clear(),
};

// Client-side cache for browser
export const clientCache = {
  set: (key: string, data: any, ttl: number = 5 * 60 * 1000) => {
    if (typeof window === 'undefined') return;
    
    const item = {
      data,
      expiry: Date.now() + ttl,
    };
    
    try {
      localStorage.setItem(`cache:${key}`, JSON.stringify(item));
    } catch (error) {
      console.warn('Failed to set client cache:', error);
    }
  },

  get: (key: string) => {
    if (typeof window === 'undefined') return null;
    
    try {
      const item = localStorage.getItem(`cache:${key}`);
      if (!item) return null;
      
      const parsed = JSON.parse(item);
      if (Date.now() > parsed.expiry) {
        localStorage.removeItem(`cache:${key}`);
        return null;
      }
      
      return parsed.data;
    } catch (error) {
      console.warn('Failed to get client cache:', error);
      return null;
    }
  },

  delete: (key: string) => {
    if (typeof window === 'undefined') return;
    localStorage.removeItem(`cache:${key}`);
  },

  clear: () => {
    if (typeof window === 'undefined') return;
    
    const keys = Object.keys(localStorage);
    keys.forEach(key => {
      if (key.startsWith('cache:')) {
        localStorage.removeItem(key);
      }
    });
  },
};