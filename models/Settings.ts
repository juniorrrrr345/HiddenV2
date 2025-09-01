import mongoose from 'mongoose';

export interface ISettings {
  _id: string;
  shopName: string;
  bannerImage: string;
  bannerText: string;
  orderLink: string;
  burnsLink: string;
  apuLink: string;
  moeLink: string;
  backgroundType: 'color' | 'image' | 'gradient';
  backgroundColor: string;
  backgroundImage: string;
  gradientFrom: string;
  gradientTo: string;
  socialLinks: {
    instagram?: string;
    facebook?: string;
    twitter?: string;
    telegram?: string;
  };
  updatedAt: Date;
}

const SettingsSchema = new mongoose.Schema({
  shopName: {
    type: String,
    default: 'HIDDEN SPINGFIELD',
  },
  bannerImage: {
    type: String,
    default: '',
  },
  bannerText: {
    type: String,
    default: 'NOUVEAU DROP',
  },
  orderLink: {
    type: String,
    default: '',
    description: 'Lien pour envoyer les commandes (Telegram, WhatsApp, etc.)'
  },
  burnsLink: {
    type: String,
    default: '',
    description: 'Lien pour commander chez BURNS'
  },
  apuLink: {
    type: String,
    default: '',
    description: 'Lien pour commander chez APU'
  },
  moeLink: {
    type: String,
    default: '',
    description: 'Lien pour commander chez MOE'
  },
  backgroundType: {
    type: String,
    enum: ['color', 'image', 'gradient'],
    default: 'color'
  },
  backgroundColor: {
    type: String,
    default: 'black'
  },
  backgroundImage: {
    type: String,
    default: ''
  },
  gradientFrom: {
    type: String,
    default: '#000000'
  },
  gradientTo: {
    type: String,
    default: '#111111'
  },
  socialLinks: {
    instagram: { type: String, default: '' },
    facebook: { type: String, default: '' },
    twitter: { type: String, default: '' },
    telegram: { type: String, default: '' },
  }
}, {
  timestamps: true,
});

export default mongoose.models.Settings || mongoose.model('Settings', SettingsSchema);