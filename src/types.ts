export type BuilderRole = string;

export type CardTheme = {
  id: string;
  name: string;
  layout: 'landscape' | 'square';
  cardBg: string;
  recessedBg: string;
  headerLogo: string;
  goaBadgeBg: string;
  goaBadgeText: string;
  bracketsColor: string;
  rolePillBg: string;
  rolePillText: string;
  chipBg: string;
  chipBorder: string;
  ticketBg: string;
  ticketText: string;
  accentColor: string;
  footerText: string;
};

export interface PhotoTransform {
  zoom: number; // 1 to 3
  panX: number; // -100 to 100
  panY: number; // -100 to 100
  rotation: number; // 0, 90, 180, 270
  filter: 'none' | 'contrast' | 'goa-warmth' | 'cyber-cyan' | 'mono';
}

export interface TeammateDetails {
  name: string;
  role: BuilderRole;
  photoUrl: string;
  photoTransform: PhotoTransform;
}

export interface BuilderDetails {
  id: string;
  name: string;
  stack: string; // Comma or space separated stack
  role: BuilderRole;
  builderTitle: string; // Quote / tagline e.g. "Neural Network Hacker & Prompt Sorcerer"
  cardNumber: string; // e.g., "HH26-4E90D7AC"
  photoUrl: string;
  photoTransform: PhotoTransform;
  themeId: string;
  qrCustomUrl?: string;
  createdAt: string;
  
  // Team support
  passType: 'single' | 'team';
  teammates?: TeammateDetails[];
}

export const CARD_THEMES: CardTheme[] = [
  {
    id: 'goa-boarding-pass',
    name: 'Goa Boarding Pass (Premium)',
    layout: 'landscape',
    cardBg: '#FAF8F5',
    recessedBg: '#F1ECE4',
    headerLogo: '#047857',
    goaBadgeBg: '#F97316',
    goaBadgeText: '#FFFFFF',
    bracketsColor: '#D97706',
    rolePillBg: '#047857',
    rolePillText: '#FFFFFF',
    chipBg: '#F5F5F4',
    chipBorder: '#E7E5E4',
    ticketBg: '#F5F5F4',
    ticketText: '#1C1917',
    accentColor: '#F97316',
    footerText: '#78716C',
  },
  {
    id: 'vintage-goa',
    name: 'Goa Boarding Pass (Emerald)',
    layout: 'landscape',
    cardBg: '#052A1A',
    recessedBg: '#02160e',
    headerLogo: '#FACC15',
    goaBadgeBg: '#047857',
    goaBadgeText: '#FFFFFF',
    bracketsColor: '#FACC15',
    rolePillBg: '#047857',
    rolePillText: '#FFFFFF',
    chipBg: 'rgba(255, 255, 255, 0.05)',
    chipBorder: 'rgba(255, 255, 255, 0.1)',
    ticketBg: '#02160e',
    ticketText: '#FFFFFF',
    accentColor: '#FACC15',
    footerText: '#34D399',
  },
  {
    id: 'forest-emerald',
    name: 'Forest Emerald (Original)',
    layout: 'landscape',
    cardBg: '#052A1A',
    recessedBg: '#021B10',
    headerLogo: '#FACC15',
    goaBadgeBg: '#FACC15',
    goaBadgeText: '#000000',
    bracketsColor: '#EC4899',
    rolePillBg: '#A855F7',
    rolePillText: '#FFFFFF',
    chipBg: 'rgba(255, 255, 255, 0.08)',
    chipBorder: 'rgba(255, 255, 255, 0.18)',
    ticketBg: '#FAF8F5',
    ticketText: '#0F172A',
    accentColor: '#EC4899',
    footerText: '#34D399',
  },
  {
    id: 'cyber-midnight',
    name: 'Cyber Midnight',
    layout: 'landscape',
    cardBg: '#0B132B',
    recessedBg: '#050A19',
    headerLogo: '#38BDF8',
    goaBadgeBg: '#38BDF8',
    goaBadgeText: '#0B132B',
    bracketsColor: '#F43F5E',
    rolePillBg: '#6366F1',
    rolePillText: '#FFFFFF',
    chipBg: 'rgba(255, 255, 255, 0.08)',
    chipBorder: 'rgba(56, 189, 248, 0.25)',
    ticketBg: '#F8FAFC',
    ticketText: '#020617',
    accentColor: '#E11D48',
    footerText: '#38BDF8',
  },
  {
    id: 'solar-terracotta',
    name: 'Solar Terracotta',
    layout: 'landscape',
    cardBg: '#1C0D07',
    recessedBg: '#120703',
    headerLogo: '#F97316',
    goaBadgeBg: '#F59E0B',
    goaBadgeText: '#1C0D07',
    bracketsColor: '#06B6D4',
    rolePillBg: '#E11D48',
    rolePillText: '#FFFFFF',
    chipBg: 'rgba(255, 255, 255, 0.08)',
    chipBorder: 'rgba(249, 115, 22, 0.25)',
    ticketBg: '#FFFBEB',
    ticketText: '#1C1917',
    accentColor: '#E11D48',
    footerText: '#F59E0B',
  },
  {
    id: 'sunset-purple',
    name: 'Sunset Magenta',
    layout: 'landscape',
    cardBg: '#190A28',
    recessedBg: '#0F041A',
    headerLogo: '#E879F9',
    goaBadgeBg: '#F472B6',
    goaBadgeText: '#190A28',
    bracketsColor: '#38BDF8',
    rolePillBg: '#8B5CF6',
    rolePillText: '#FFFFFF',
    chipBg: 'rgba(255, 255, 255, 0.08)',
    chipBorder: 'rgba(232, 121, 249, 0.25)',
    ticketBg: '#FAF5FF',
    ticketText: '#1E1B4B',
    accentColor: '#C084FC',
    footerText: '#F472B6',
  },
  {
    id: 'stealth-dark',
    name: 'Stealth Onyx',
    layout: 'landscape',
    cardBg: '#121212',
    recessedBg: '#090909',
    headerLogo: '#FFFFFF',
    goaBadgeBg: '#E2E8F0',
    goaBadgeText: '#000000',
    bracketsColor: '#FF4500',
    rolePillBg: '#334155',
    rolePillText: '#FFFFFF',
    chipBg: 'rgba(255, 255, 255, 0.06)',
    chipBorder: 'rgba(255, 255, 255, 0.2)',
    ticketBg: '#FFFFFF',
    ticketText: '#0F172A',
    accentColor: '#FF4500',
    footerText: '#94A3B8',
  }
];
