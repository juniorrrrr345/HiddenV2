// D1 Database connection for HIDDEN SPINGFIELD
import { executeSqlOnD1 } from './cloudflare-d1';

export interface IProduct {
  id: number;
  name: string;
  origin: string;
  image: string;
  video?: string;
  price: number;
  pricing?: string; // JSON string of pricing options
  quantity: number;
  category: 'weed' | 'hash';
  tag?: string;
  tagColor?: 'red' | 'green';
  country: string;
  countryFlag: string;
  description?: string;
  available: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface ICategory {
  id: number;
  name: string;
  icon: string;
  color: string;
  createdAt: string;
}

export interface ISettings {
  id: number;
  shopTitle: string;
  backgroundImage?: string;
  backgroundOpacity: number;
  backgroundBlur: number;
  infoContent?: string;
  contactContent?: string;
  whatsappLink?: string;
  whatsappNumber?: string;
  scrollingText?: string;
  themeColor: string;
  createdAt: string;
}

// Products functions
export async function getProducts() {
  const result = await executeSqlOnD1('SELECT * FROM products WHERE available = 1 ORDER BY createdAt DESC');
  return result.result?.[0]?.results || [];
}

export async function getProductById(id: number) {
  const result = await executeSqlOnD1('SELECT * FROM products WHERE id = ?', [id]);
  return result.result?.[0]?.results?.[0] || null;
}

export async function createProduct(product: Omit<IProduct, 'id' | 'createdAt' | 'updatedAt'>) {
  const result = await executeSqlOnD1(
    'INSERT INTO products (name, origin, image, video, price, pricing, quantity, category, tag, tagColor, country, countryFlag, description, available) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)',
    [product.name, product.origin, product.image, product.video, product.price, product.pricing, product.quantity, product.category, product.tag, product.tagColor, product.country, product.countryFlag, product.description, product.available]
  );
  return result.result?.[0]?.meta?.last_row_id;
}

export async function updateProduct(id: number, product: Partial<IProduct>) {
  const fields = [];
  const values = [];
  
  if (product.name !== undefined) { fields.push('name = ?'); values.push(product.name); }
  if (product.origin !== undefined) { fields.push('origin = ?'); values.push(product.origin); }
  if (product.image !== undefined) { fields.push('image = ?'); values.push(product.image); }
  if (product.video !== undefined) { fields.push('video = ?'); values.push(product.video); }
  if (product.price !== undefined) { fields.push('price = ?'); values.push(product.price); }
  if (product.pricing !== undefined) { fields.push('pricing = ?'); values.push(product.pricing); }
  if (product.quantity !== undefined) { fields.push('quantity = ?'); values.push(product.quantity); }
  if (product.category !== undefined) { fields.push('category = ?'); values.push(product.category); }
  if (product.tag !== undefined) { fields.push('tag = ?'); values.push(product.tag); }
  if (product.tagColor !== undefined) { fields.push('tagColor = ?'); values.push(product.tagColor); }
  if (product.country !== undefined) { fields.push('country = ?'); values.push(product.country); }
  if (product.countryFlag !== undefined) { fields.push('countryFlag = ?'); values.push(product.countryFlag); }
  if (product.description !== undefined) { fields.push('description = ?'); values.push(product.description); }
  if (product.available !== undefined) { fields.push('available = ?'); values.push(product.available); }
  
  values.push(id);
  
  const result = await executeSqlOnD1(
    `UPDATE products SET ${fields.join(', ')} WHERE id = ?`,
    values
  );
  return result.success;
}

export async function deleteProduct(id: number) {
  const result = await executeSqlOnD1('DELETE FROM products WHERE id = ?', [id]);
  return result.success;
}

// Categories functions
export async function getCategories() {
  const result = await executeSqlOnD1('SELECT * FROM categories ORDER BY name');
  return result.result?.[0]?.results || [];
}

export async function createCategory(category: Omit<ICategory, 'id' | 'createdAt'>) {
  const result = await executeSqlOnD1(
    'INSERT INTO categories (name, icon, color) VALUES (?, ?, ?)',
    [category.name, category.icon, category.color]
  );
  return result.result?.[0]?.meta?.last_row_id;
}

// Settings functions
export async function getSettings() {
  const result = await executeSqlOnD1('SELECT * FROM settings WHERE id = 1');
  return result.result?.[0]?.results?.[0] || null;
}

export async function updateSettings(settings: Partial<ISettings>) {
  const fields = [];
  const values = [];
  
  if (settings.shopTitle !== undefined) { fields.push('shopTitle = ?'); values.push(settings.shopTitle); }
  if (settings.backgroundImage !== undefined) { fields.push('backgroundImage = ?'); values.push(settings.backgroundImage); }
  if (settings.backgroundOpacity !== undefined) { fields.push('backgroundOpacity = ?'); values.push(settings.backgroundOpacity); }
  if (settings.backgroundBlur !== undefined) { fields.push('backgroundBlur = ?'); values.push(settings.backgroundBlur); }
  if (settings.infoContent !== undefined) { fields.push('infoContent = ?'); values.push(settings.infoContent); }
  if (settings.contactContent !== undefined) { fields.push('contactContent = ?'); values.push(settings.contactContent); }
  if (settings.whatsappLink !== undefined) { fields.push('whatsappLink = ?'); values.push(settings.whatsappLink); }
  if (settings.whatsappNumber !== undefined) { fields.push('whatsappNumber = ?'); values.push(settings.whatsappNumber); }
  if (settings.scrollingText !== undefined) { fields.push('scrollingText = ?'); values.push(settings.scrollingText); }
  if (settings.themeColor !== undefined) { fields.push('themeColor = ?'); values.push(settings.themeColor); }
  
  const result = await executeSqlOnD1(
    `UPDATE settings SET ${fields.join(', ')} WHERE id = 1`,
    values
  );
  return result.success;
}

// Compatibility function for existing code
export default async function dbConnect() {
  // D1 doesn't need connection, return true for compatibility
  return true;
}