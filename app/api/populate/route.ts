import { NextResponse } from 'next/server';
import dbConnect from '@/lib/mongodb';
import Product from '@/models/Product';
import Category from '@/models/Category';

// Catégories à créer
const categories = [
  {
    name: 'Weed',
    slug: 'weed',
    order: 1,
    active: true
  },
  {
    name: 'Hash',
    slug: 'hash', 
    order: 2,
    active: true
  }
];

// Tous les produits actuels de la boutique
const products = [
  {
    id: '1',
    name: 'Cali Spain',
    origin: 'Espagne',
    price: 45,
    image: '/products/cali-spain.jpg',
    category: 'weed',
    tag: 'BON RAPPORT QUALITÉ',
    tagColor: 'green',
    country: 'ES',
    countryFlag: '🇪🇸',
    description: 'Fleur premium importée d\'Espagne avec un profil terpénique exceptionnel.',
    quantity: 50,
    available: true
  },
  {
    id: '2',
    name: 'Lemon Cherry Gelato',
    origin: 'Canadienne',
    price: 65,
    image: '/products/lemon-cherry.jpg',
    category: 'weed',
    tag: 'DE LA FRAPPE',
    tagColor: 'red',
    country: 'CA',
    countryFlag: '🇨🇦',
    description: 'Variété canadienne premium avec des notes d\'agrumes et de cerise.',
    quantity: 30,
    available: true
  },
  {
    id: '3',
    name: 'Liberty Haze',
    origin: 'Haze',
    price: 55,
    image: '/products/liberty-haze.jpg',
    category: 'weed',
    tag: 'NOUVEAUTÉ',
    tagColor: 'green',
    country: 'NL',
    countryFlag: '🇳🇱',
    description: 'Haze classique des Pays-Bas avec un effet énergisant.',
    quantity: 40,
    available: true
  },
  {
    id: '4',
    name: 'Moroccan Hash',
    origin: 'Maroc',
    price: 35,
    image: '/products/moroccan-hash.jpg',
    category: 'hash',
    tag: 'TRADITIONNEL',
    tagColor: 'green',
    country: 'MA',
    countryFlag: '🇲🇦',
    description: 'Hash traditionnel marocain de qualité supérieure.',
    quantity: 60,
    available: true
  },
  {
    id: '5',
    name: 'Afghan Black',
    origin: 'Afghanistan',
    price: 40,
    image: '/products/afghan-black.jpg',
    category: 'hash',
    tag: 'PREMIUM',
    tagColor: 'red',
    country: 'AF',
    countryFlag: '🇦🇫',
    description: 'Hash noir afghan avec une texture crémeuse et un goût unique.',
    quantity: 25,
    available: true
  },
  {
    id: '6',
    name: 'Purple Punch',
    origin: 'Canadienne',
    price: 70,
    image: '/products/purple-punch.jpg',
    category: 'weed',
    tag: 'EXOTIC',
    tagColor: 'red',
    country: 'CA',
    countryFlag: '🇨🇦',
    description: 'Variété exotique avec des notes fruitées et florales.',
    quantity: 20,
    available: true
  },
  {
    id: '7',
    name: 'OG Kush',
    origin: 'USA',
    price: 60,
    image: '/products/og-kush.jpg',
    category: 'weed',
    tag: 'CLASSIQUE',
    tagColor: 'green',
    country: 'US',
    countryFlag: '🇺🇸',
    description: 'La légendaire OG Kush avec son profil terpénique unique.',
    quantity: 35,
    available: true
  },
  {
    id: '8',
    name: 'Charas',
    origin: 'Inde',
    price: 50,
    image: '/products/charas.jpg',
    category: 'hash',
    tag: 'ARTISANAL',
    tagColor: 'green',
    country: 'IN',
    countryFlag: '🇮🇳',
    description: 'Hash artisanal indien fait à la main selon la méthode traditionnelle.',
    quantity: 15,
    available: true
  },
  {
    id: '9',
    name: 'Fond De Haze',
    origin: 'Pays-Bas',
    price: 250,
    pricing: [
      { weight: '100g', price: 250 },
      { weight: '200g', price: 450 }
    ],
    image: '/products/fond-de-haze.jpg',
    category: 'weed',
    tag: 'WEED',
    tagColor: 'green',
    country: 'NL',
    countryFlag: '🇳🇱',
    description: 'Haze premium des Pays-Bas avec un profil aromatique exceptionnel et des effets puissants.',
    quantity: 10,
    available: true
  }
];

export async function POST() {
  try {
    await dbConnect();
    
    const results = {
      categories: { created: 0, errors: 0 },
      products: { created: 0, errors: 0 }
    };

    // 1. Créer les catégories
    for (const categoryData of categories) {
      try {
        const existingCategory = await Category.findOne({ slug: categoryData.slug });
        if (!existingCategory) {
          await Category.create(categoryData);
          results.categories.created++;
        }
      } catch (error) {
        results.categories.errors++;
        console.error(`Error creating category ${categoryData.name}:`, error);
      }
    }

    // 2. Créer les produits
    for (const productData of products) {
      try {
        const existingProduct = await Product.findOne({ name: productData.name });
        if (!existingProduct) {
          await Product.create(productData);
          results.products.created++;
        }
      } catch (error) {
        results.products.errors++;
        console.error(`Error creating product ${productData.name}:`, error);
      }
    }

    return NextResponse.json({
      success: true,
      message: 'Base de données peuplée avec succès',
      results
    });

  } catch (error) {
    console.error('Error populating database:', error);
    return NextResponse.json(
      { error: 'Erreur lors du peuplement de la base de données' },
      { status: 500 }
    );
  }
}