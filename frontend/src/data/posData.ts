/**
 * POS System Mock Data
 * This file contains mock data for the restaurant POS system.
 * In production, this data would come from the backend API.
 */

// ═══════════════════════════════════════════════════════════════════════════════
// TYPE DEFINITIONS
// ═══════════════════════════════════════════════════════════════════════════════

export type TableStatus = 'empty' | 'occupied' | 'reserved';

export type ZoneId = 'salon' | 'ust-kat' | 'bahce' | 'paket';

export interface Table {
  id: number;
  name: string;
  capacity: number;
  zone: ZoneId;
  status: TableStatus;
  orderId?: string;
  openTime?: string;
  waiter?: string;
  currentAmount?: number;
}

export interface Zone {
  id: ZoneId;
  name: string;
  tableCount: number;
}

export interface Category {
  id: string;
  name: string;
  icon: string;
  color: string;
  productCount: number;
}

export interface Portion {
  id: string;
  name: string;
  description: string;
  priceMultiplier: number;
  icon: string;
}

export interface Extra {
  id: string;
  name: string;
  price: number;
}

export interface Product {
  id: number;
  name: string;
  category: string;
  basePrice: number;
  description?: string;
  image?: string;
  portions: Portion[];
  extras: Extra[];
  isAvailable: boolean;
}

export interface CartItem {
  id: string;
  productId: number;
  productName: string;
  portion: Portion;
  extras: Extra[];
  quantity: number;
  unitPrice: number;
  note?: string;
}

// ═══════════════════════════════════════════════════════════════════════════════
// ZONES DATA
// ═══════════════════════════════════════════════════════════════════════════════

export const zones: Zone[] = [
  { id: 'salon', name: 'Salon', tableCount: 8 },
  { id: 'ust-kat', name: 'Üst Kat', tableCount: 4 },
  { id: 'bahce', name: 'Bahçe', tableCount: 4 },
  { id: 'paket', name: 'Paket', tableCount: 2 },
];

// ═══════════════════════════════════════════════════════════════════════════════
// TABLES DATA
// ═══════════════════════════════════════════════════════════════════════════════

// Static table data - deterministic to prevent hydration errors
export const initialTables: Table[] = [
  // Salon - 8 tables (3 occupied, 1 reserved, 4 empty)
  {
    id: 1,
    name: 'Masa 1',
    capacity: 2,
    zone: 'salon',
    status: 'occupied',
    orderId: 'ORD-2025-001',
    openTime: '1s 23dk',
    waiter: 'Ahmet Y.',
    currentAmount: 580,
  },
  { id: 2, name: 'Masa 2', capacity: 4, zone: 'salon', status: 'empty' },
  {
    id: 3,
    name: 'Masa 3',
    capacity: 2,
    zone: 'salon',
    status: 'occupied',
    orderId: 'ORD-2025-003',
    openTime: '0s 45dk',
    waiter: 'Ayşe K.',
    currentAmount: 320,
  },
  { id: 4, name: 'Masa 4', capacity: 4, zone: 'salon', status: 'empty' },
  {
    id: 5,
    name: 'Masa 5',
    capacity: 6,
    zone: 'salon',
    status: 'reserved',
    openTime: '20:00',
  },
  {
    id: 6,
    name: 'Masa 6',
    capacity: 4,
    zone: 'salon',
    status: 'occupied',
    orderId: 'ORD-2025-006',
    openTime: '2s 10dk',
    waiter: 'Mehmet D.',
    currentAmount: 1250,
  },
  { id: 7, name: 'Masa 7', capacity: 2, zone: 'salon', status: 'empty' },
  { id: 8, name: 'Masa 8', capacity: 4, zone: 'salon', status: 'empty' },
  // Üst Kat - 4 tables (2 occupied, 2 empty)
  {
    id: 9,
    name: 'Masa 9',
    capacity: 4,
    zone: 'ust-kat',
    status: 'occupied',
    orderId: 'ORD-2025-009',
    openTime: '0s 30dk',
    waiter: 'Fatma S.',
    currentAmount: 450,
  },
  { id: 10, name: 'Masa 10', capacity: 4, zone: 'ust-kat', status: 'empty' },
  {
    id: 11,
    name: 'Masa 11',
    capacity: 2,
    zone: 'ust-kat',
    status: 'occupied',
    orderId: 'ORD-2025-011',
    openTime: '1s 15dk',
    waiter: 'Ali R.',
    currentAmount: 280,
  },
  { id: 12, name: 'Masa 12', capacity: 6, zone: 'ust-kat', status: 'empty' },
  // Bahçe - 4 tables (1 occupied, 1 reserved, 2 empty)
  { id: 13, name: 'Masa 13', capacity: 4, zone: 'bahce', status: 'empty' },
  {
    id: 14,
    name: 'Masa 14',
    capacity: 6,
    zone: 'bahce',
    status: 'occupied',
    orderId: 'ORD-2025-014',
    openTime: '0s 55dk',
    waiter: 'Ahmet Y.',
    currentAmount: 890,
  },
  {
    id: 15,
    name: 'Masa 15',
    capacity: 4,
    zone: 'bahce',
    status: 'reserved',
    openTime: '21:00',
  },
  { id: 16, name: 'Masa 16', capacity: 8, zone: 'bahce', status: 'empty' },
  // Paket - 2 tables (1 occupied, 1 empty)
  {
    id: 17,
    name: 'Paket 1',
    capacity: 0,
    zone: 'paket',
    status: 'occupied',
    orderId: 'ORD-2025-017',
    openTime: '0s 15dk',
    waiter: 'Ayşe K.',
    currentAmount: 210,
  },
  { id: 18, name: 'Paket 2', capacity: 0, zone: 'paket', status: 'empty' },
];

// ═══════════════════════════════════════════════════════════════════════════════
// CATEGORIES DATA
// ═══════════════════════════════════════════════════════════════════════════════

export const categories: Category[] = [
  {
    id: 'kokorec',
    name: 'Kokoreç',
    icon: '🔥',
    color: 'from-orange-400 to-red-500',
    productCount: 8,
  },
  {
    id: 'kofte',
    name: 'Köfte',
    icon: '🍔',
    color: 'from-red-500 to-rose-600',
    productCount: 6,
  },
  {
    id: 'sucuk',
    name: 'Sucuk',
    icon: '🥩',
    color: 'from-red-600 to-red-800',
    productCount: 5,
  },
  {
    id: 'midye',
    name: 'Midye',
    icon: '🦪',
    color: 'from-yellow-400 to-orange-500',
    productCount: 4,
  },
  {
    id: 'icecek',
    name: 'İçecekler',
    icon: '🥤',
    color: 'from-blue-400 to-cyan-500',
    productCount: 12,
  },
  {
    id: 'tatli',
    name: 'Tatlılar',
    icon: '🍰',
    color: 'from-pink-400 to-purple-500',
    productCount: 6,
  },
];

// ═══════════════════════════════════════════════════════════════════════════════
// DEFAULT PORTIONS & EXTRAS
// ═══════════════════════════════════════════════════════════════════════════════

export const defaultPortions: Portion[] = [
  {
    id: 'standart',
    name: 'Standart',
    description: 'Normal Porsiyon',
    priceMultiplier: 1,
    icon: '🍽️',
  },
  {
    id: 'buyuk',
    name: 'Büyük',
    description: '1.5 Porsiyon',
    priceMultiplier: 1.4,
    icon: '🍽️',
  },
];

export const kokorecPortions: Portion[] = [
  {
    id: 'porsiyon',
    name: 'Porsiyon',
    description: 'Standart Tabak',
    priceMultiplier: 1,
    icon: '🍽️',
  },
  {
    id: 'ekmek-arasi',
    name: 'Ekmek Arası',
    description: 'Yarım Ekmek',
    priceMultiplier: 0.54,
    icon: '🥖',
  },
  {
    id: 'durum',
    name: 'Dürüm',
    description: 'Lavaş Ekmeğine',
    priceMultiplier: 0.61,
    icon: '🌯',
  },
  {
    id: 'ceyrek',
    name: 'Çeyrek',
    description: 'Çeyrek Ekmek',
    priceMultiplier: 0.32,
    icon: '🍞',
  },
];

export const defaultExtras: Extra[] = [
  { id: 'aci-sos', name: 'Acı Sos', price: 10 },
  { id: 'tursu', name: 'Turşu', price: 15 },
  { id: 'domates', name: 'Domates', price: 5 },
  { id: 'sogan', name: 'Soğan', price: 5 },
];

// ═══════════════════════════════════════════════════════════════════════════════
// PRODUCTS DATA
// ═══════════════════════════════════════════════════════════════════════════════

export const products: Product[] = [
  // Kokoreç
  {
    id: 1,
    name: 'Porsiyonlu Kokoreç',
    category: 'kokorec',
    basePrice: 280,
    description: 'Özel baharatlarla hazırlanmış klasik kokoreç',
    portions: kokorecPortions,
    extras: defaultExtras,
    isAvailable: true,
  },
  {
    id: 2,
    name: 'Kaşarlı Kokoreç',
    category: 'kokorec',
    basePrice: 320,
    description: 'Eritilmiş kaşar peynirli',
    portions: kokorecPortions,
    extras: [
      ...defaultExtras,
      { id: 'ekstra-kasar', name: 'Ekstra Kaşar', price: 25 },
    ],
    isAvailable: true,
  },
  {
    id: 3,
    name: 'Karışık Kokoreç',
    category: 'kokorec',
    basePrice: 350,
    description: 'Ciğer ve dalak ile zenginleştirilmiş',
    portions: kokorecPortions,
    extras: defaultExtras,
    isAvailable: true,
  },
  {
    id: 4,
    name: 'Acılı Kokoreç',
    category: 'kokorec',
    basePrice: 290,
    description: 'Biber ve baharatlarla acılandırılmış',
    portions: kokorecPortions,
    extras: defaultExtras,
    isAvailable: true,
  },

  // Köfte
  {
    id: 10,
    name: 'Izgara Köfte',
    category: 'kofte',
    basePrice: 220,
    description: 'Odun ateşinde pişirilmiş',
    portions: defaultPortions,
    extras: [
      { id: 'pilav', name: 'Pilav', price: 30 },
      { id: 'salata', name: 'Salata', price: 20 },
      { id: 'piyaz', name: 'Piyaz', price: 25 },
    ],
    isAvailable: true,
  },
  {
    id: 11,
    name: 'Kasap Köfte',
    category: 'kofte',
    basePrice: 250,
    description: 'Özel harman et ile hazırlanmış',
    portions: defaultPortions,
    extras: [
      { id: 'pilav', name: 'Pilav', price: 30 },
      { id: 'patates', name: 'Patates Kızartması', price: 35 },
    ],
    isAvailable: true,
  },
  {
    id: 12,
    name: 'İnegöl Köfte',
    category: 'kofte',
    basePrice: 240,
    description: 'Otantik İnegöl tarifi',
    portions: defaultPortions,
    extras: [{ id: 'pide', name: 'Pide Ekmek', price: 15 }],
    isAvailable: true,
  },

  // Sucuk
  {
    id: 20,
    name: 'Sucuk Izgara',
    category: 'sucuk',
    basePrice: 180,
    description: 'Kangal sucuk, ızgarada',
    portions: defaultPortions,
    extras: [
      { id: 'yumurta', name: 'Yumurta', price: 15 },
      { id: 'peynir', name: 'Beyaz Peynir', price: 20 },
    ],
    isAvailable: true,
  },
  {
    id: 21,
    name: 'Sucuklu Yumurta',
    category: 'sucuk',
    basePrice: 150,
    description: '2 yumurta ile servis',
    portions: defaultPortions,
    extras: [{ id: 'ekstra-yumurta', name: 'Ekstra Yumurta', price: 15 }],
    isAvailable: true,
  },

  // Midye
  {
    id: 30,
    name: 'Midye Tava',
    category: 'midye',
    basePrice: 180,
    description: '15 adet kızartılmış midye',
    portions: [
      {
        id: '15-adet',
        name: '15 Adet',
        description: 'Standart',
        priceMultiplier: 1,
        icon: '🦪',
      },
      {
        id: '25-adet',
        name: '25 Adet',
        description: 'Büyük',
        priceMultiplier: 1.5,
        icon: '🦪',
      },
    ],
    extras: [
      { id: 'limon', name: 'Ekstra Limon', price: 5 },
      { id: 'tarator', name: 'Tarator', price: 15 },
    ],
    isAvailable: true,
  },
  {
    id: 31,
    name: 'Midye Dolma',
    category: 'midye',
    basePrice: 120,
    description: '10 adet pirinç dolgulu',
    portions: [
      {
        id: '10-adet',
        name: '10 Adet',
        description: 'Standart',
        priceMultiplier: 1,
        icon: '🦪',
      },
      {
        id: '20-adet',
        name: '20 Adet',
        description: 'Büyük',
        priceMultiplier: 1.8,
        icon: '🦪',
      },
    ],
    extras: [{ id: 'limon', name: 'Ekstra Limon', price: 5 }],
    isAvailable: true,
  },

  // İçecekler
  {
    id: 40,
    name: 'Ayran',
    category: 'icecek',
    basePrice: 30,
    description: 'Taze günlük ayran',
    portions: [
      {
        id: 'kucuk',
        name: 'Küçük',
        description: '200ml',
        priceMultiplier: 1,
        icon: '🥛',
      },
      {
        id: 'buyuk',
        name: 'Büyük',
        description: '400ml',
        priceMultiplier: 1.5,
        icon: '🥛',
      },
    ],
    extras: [],
    isAvailable: true,
  },
  {
    id: 41,
    name: 'Şalgam',
    category: 'icecek',
    basePrice: 35,
    description: 'Acılı veya acısız',
    portions: [
      {
        id: 'kucuk',
        name: 'Küçük',
        description: '200ml',
        priceMultiplier: 1,
        icon: '🧃',
      },
      {
        id: 'buyuk',
        name: 'Büyük',
        description: '400ml',
        priceMultiplier: 1.4,
        icon: '🧃',
      },
    ],
    extras: [],
    isAvailable: true,
  },
  {
    id: 42,
    name: 'Kola',
    category: 'icecek',
    basePrice: 40,
    portions: [
      {
        id: 'kutu',
        name: 'Kutu',
        description: '330ml',
        priceMultiplier: 1,
        icon: '🥫',
      },
      {
        id: 'sise',
        name: 'Şişe',
        description: '1L',
        priceMultiplier: 2,
        icon: '🍾',
      },
    ],
    extras: [],
    isAvailable: true,
  },
  {
    id: 43,
    name: 'Su',
    category: 'icecek',
    basePrice: 15,
    portions: [
      {
        id: 'kucuk',
        name: 'Küçük',
        description: '0.5L',
        priceMultiplier: 1,
        icon: '💧',
      },
      {
        id: 'buyuk',
        name: 'Büyük',
        description: '1L',
        priceMultiplier: 1.5,
        icon: '💧',
      },
    ],
    extras: [],
    isAvailable: true,
  },

  // Tatlılar
  {
    id: 50,
    name: 'Künefe',
    category: 'tatli',
    basePrice: 150,
    description: 'Antep usulü tel kadayıf',
    portions: defaultPortions,
    extras: [
      { id: 'dondurma', name: 'Dondurma', price: 25 },
      { id: 'kaymak', name: 'Kaymak', price: 30 },
    ],
    isAvailable: true,
  },
  {
    id: 51,
    name: 'Sütlaç',
    category: 'tatli',
    basePrice: 80,
    description: 'Fırında pişirilmiş',
    portions: defaultPortions,
    extras: [{ id: 'tarçin', name: 'Ekstra Tarçın', price: 0 }],
    isAvailable: true,
  },
  {
    id: 52,
    name: 'Profiterol',
    category: 'tatli',
    basePrice: 120,
    description: 'Çikolata soslu',
    portions: defaultPortions,
    extras: [{ id: 'dondurma', name: 'Dondurma', price: 25 }],
    isAvailable: true,
  },
];

// ═══════════════════════════════════════════════════════════════════════════════
// HELPER FUNCTIONS
// ═══════════════════════════════════════════════════════════════════════════════

export function getProductsByCategory(categoryId: string): Product[] {
  return products.filter((p) => p.category === categoryId && p.isAvailable);
}

export function getProductById(productId: number): Product | undefined {
  return products.find((p) => p.id === productId);
}

export function getTablesByZone(zoneId: ZoneId): Table[] {
  return initialTables.filter((t) => t.zone === zoneId);
}

export function formatCurrency(amount: number): string {
  return new Intl.NumberFormat('tr-TR', {
    style: 'currency',
    currency: 'TRY',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(amount);
}

export function calculateItemTotal(item: CartItem): number {
  const extrasTotal = item.extras.reduce((sum, e) => sum + e.price, 0);
  return (item.unitPrice + extrasTotal) * item.quantity;
}

// Tax rate (KDV)
export const TAX_RATE = 0.1; // 10%
