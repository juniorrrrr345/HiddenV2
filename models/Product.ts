import mongoose from 'mongoose';

export interface IPricingOption {
  weight: string;
  price: number;
}

export interface IProduct {
  _id: string;
  name: string;
  origin: string;
  image: string; // Photo pour la carte produit
  video?: string; // Vidéo pour la page détail
  price: number; // Base price for compatibility
  pricing?: IPricingOption[]; // Multiple pricing options
  quantity: number;
  category: 'weed' | 'hash';
  tag?: string;
  tagColor?: 'red' | 'green';
  country: string;
  countryFlag: string;
  description?: string;
  available: boolean;
  createdAt: Date;
  updatedAt: Date;
}

const PricingOptionSchema = new mongoose.Schema({
  weight: {
    type: String,
    required: true,
  },
  price: {
    type: Number,
    required: true,
    min: 0,
  },
}, { _id: false });

const ProductSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true,
  },
  origin: {
    type: String,
    required: false,
    default: '',
    trim: true,
  },
  image: {
    type: String,
    default: '',
  },
  video: {
    type: String,
    default: '',
  },
  price: {
    type: Number,
    required: true,
    min: 0,
  },
  pricing: {
    type: [PricingOptionSchema],
    default: [],
  },
  quantity: {
    type: Number,
    required: true,
    min: 0,
    default: 0,
  },
  category: {
    type: String,
    required: true,
    enum: ['weed', 'hash'],
    default: 'weed',
  },
  tag: {
    type: String,
    default: '',
  },
  tagColor: {
    type: String,
    enum: ['red', 'green'],
    default: 'green',
  },
  country: {
    type: String,
    required: false,
    default: 'FR',
  },
  countryFlag: {
    type: String,
    required: false,
    default: '🇫🇷',
  },
  description: {
    type: String,
    default: '',
  },
  available: {
    type: Boolean,
    default: true,
  },
}, {
  timestamps: true,
});

// Index for better performance
ProductSchema.index({ category: 1, available: 1 });
ProductSchema.index({ name: 'text', description: 'text' });

export default mongoose.models.Product || mongoose.model('Product', ProductSchema);