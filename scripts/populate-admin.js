const API_BASE = 'http://localhost:3000/api';

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

async function populateDatabase() {
  try {
    console.log('🚀 Début de la population de la base de données...');

    // 1. Créer les catégories
    console.log('📁 Création des catégories...');
    for (const category of categories) {
      try {
        const response = await fetch(`${API_BASE}/categories`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(category),
        });
        
        if (response.ok) {
          const created = await response.json();
          console.log(`✅ Catégorie créée: ${created.name}`);
        } else {
          const error = await response.json();
          console.log(`⚠️ Catégorie "${category.name}" peut-être déjà existante:`, error.error);
        }
      } catch (error) {
        console.log(`❌ Erreur création catégorie "${category.name}":`, error.message);
      }
    }

    // 2. Créer les produits
    console.log('\n📦 Création des produits...');
    for (const product of products) {
      try {
        const response = await fetch(`${API_BASE}/products`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(product),
        });
        
        if (response.ok) {
          const created = await response.json();
          console.log(`✅ Produit créé: ${created.name}`);
        } else {
          const error = await response.json();
          console.log(`⚠️ Produit "${product.name}" peut-être déjà existant:`, error.error);
        }
      } catch (error) {
        console.log(`❌ Erreur création produit "${product.name}":`, error.message);
      }
    }

    console.log('\n🎉 Population terminée !');
    console.log(`📊 Résumé:`);
    console.log(`   - ${categories.length} catégories`);
    console.log(`   - ${products.length} produits`);

  } catch (error) {
    console.error('❌ Erreur générale:', error);
  }
}

// Exécuter le script si appelé directement
if (typeof window === 'undefined') {
  populateDatabase();
}

module.exports = { populateDatabase, categories, products };