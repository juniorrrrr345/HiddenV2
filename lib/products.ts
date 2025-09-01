import { Product } from './store';

export const products: Product[] = [
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
    description: 'Fleur premium importée d\'Espagne avec un profil terpénique exceptionnel.'
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
    description: 'Variété canadienne premium avec des notes d\'agrumes et de cerise.'
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
    description: 'Haze classique des Pays-Bas avec un effet énergisant.'
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
    description: 'Hash traditionnel marocain de qualité supérieure.'
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
    description: 'Hash noir afghan avec une texture crémeuse et un goût unique.'
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
    description: 'Variété exotique avec des notes fruitées et florales.'
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
    description: 'La légendaire OG Kush avec son profil terpénique unique.'
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
    description: 'Hash artisanal indien fait à la main selon la méthode traditionnelle.'
  },
  {
    id: '9',
    name: 'Fond De Haze',
    origin: 'Pays-Bas',
    price: 250, // Base price for 100g
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
    description: 'Haze premium des Pays-Bas avec un profil aromatique exceptionnel et des effets puissants.'
  }
];