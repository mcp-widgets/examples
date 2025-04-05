export interface Product {
  id: string;
  name: string;
  description: string;
  price: number;
  currency: string;
  imageUrl: string;
  category: string;
  rating: number;
  reviewCount: number;
  inStock: boolean;
  attributes?: Record<string, string>;
}

// Sample product data
export const products: Product[] = [
  {
    id: 'p1',
    name: 'Wireless Headphones',
    description:
      'Premium wireless headphones with noise cancellation and 20-hour battery life. Perfect for immersive music listening with deep bass and clear highs.',
    price: 249.99,
    currency: 'USD',
    imageUrl:
      'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=500&h=400&fit=crop',
    category: 'Electronics',
    rating: 4.7,
    reviewCount: 1254,
    inStock: true,
    attributes: {
      color: 'Black',
      connectivity: 'Bluetooth 5.0',
      batteryLife: '20 hours',
      noiseCancel: 'Active',
      soundQuality: 'Hi-Fi Audio',
      usageType: 'Music, Calls, Gaming',
    },
  },
  {
    id: 'p2',
    name: 'Smartwatch',
    description:
      'Fitness tracking smartwatch with heart rate monitor and GPS. Control your music playback with easy access controls.',
    price: 199.99,
    currency: 'USD',
    imageUrl:
      'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=500&h=400&fit=crop',
    category: 'Electronics',
    rating: 4.5,
    reviewCount: 856,
    inStock: true,
    attributes: {
      color: 'Silver',
      connectivity: 'Bluetooth 5.0',
      batteryLife: '5 days',
      waterResistant: 'Yes',
      features: 'Music control, Fitness tracking',
    },
  },
  {
    id: 'p3',
    name: 'Coffee Maker',
    description:
      'Programmable coffee maker with thermal carafe, keeps coffee hot for hours.',
    price: 79.99,
    currency: 'USD',
    imageUrl:
      'https://images.unsplash.com/photo-1572119865084-43c285814d63?w=500&h=400&fit=crop',
    category: 'Home & Kitchen',
    rating: 4.2,
    reviewCount: 532,
    inStock: true,
    attributes: {
      color: 'Stainless Steel',
      capacity: '12 cups',
      programmable: 'Yes',
    },
  },
  {
    id: 'p4',
    name: 'Yoga Mat',
    description: 'Non-slip yoga mat, perfect for home or studio practice.',
    price: 29.99,
    currency: 'USD',
    imageUrl:
      'https://images.unsplash.com/photo-1599447292625-11a508c23966?w=500&h=400&fit=crop',
    category: 'Sports & Outdoors',
    rating: 4.8,
    reviewCount: 302,
    inStock: false,
    attributes: {
      material: 'TPE',
      thickness: '6mm',
      color: 'Purple',
    },
  },
  {
    id: 'p5',
    name: 'Desk Lamp',
    description:
      'LED desk lamp with adjustable brightness and color temperature.',
    price: 49.99,
    currency: 'USD',
    imageUrl:
      'https://images.unsplash.com/photo-1507473885765-e6ed057f782c?w=500&h=400&fit=crop',
    category: 'Home & Office',
    rating: 4.4,
    reviewCount: 210,
    inStock: true,
    attributes: {
      color: 'White',
      lightSource: 'LED',
      adjustable: 'Yes',
    },
  },
  {
    id: 'p6',
    name: 'Portable Bluetooth Speaker',
    description:
      'Waterproof portable speaker with 360° sound and 12-hour battery life. Enjoy your music anywhere with deep bass and crystal clear sound quality.',
    price: 89.99,
    currency: 'USD',
    imageUrl:
      'https://images.unsplash.com/photo-1608043152269-423dbba4e7e1?w=500&h=400&fit=crop',
    category: 'Electronics',
    rating: 4.6,
    reviewCount: 428,
    inStock: true,
    attributes: {
      color: 'Blue',
      connectivity: 'Bluetooth 5.1',
      batteryLife: '12 hours',
      waterproof: 'IPX7',
      audioFeatures: 'Stereo, Bass boost, Music streaming',
      usage: 'Music, Podcasts, Outdoor',
    },
  },
  {
    id: 'p7',
    name: 'Stainless Steel Water Bottle',
    description:
      'Vacuum insulated water bottle keeps drinks cold for 24 hours or hot for 12 hours.',
    price: 34.99,
    currency: 'USD',
    imageUrl:
      'https://images.unsplash.com/photo-1602143407151-7111542de6e8?w=500&h=400&fit=crop',
    category: 'Sports & Outdoors',
    rating: 4.7,
    reviewCount: 621,
    inStock: true,
    attributes: {
      capacity: '24 oz',
      material: 'Stainless Steel',
      insulated: 'Yes',
      color: 'Matte Black',
    },
  },
  {
    id: 'p8',
    name: 'Plant Stand',
    description: 'Bamboo plant stand with 3 tiers for indoor or outdoor use.',
    price: 45.99,
    currency: 'USD',
    imageUrl:
      'https://images.unsplash.com/photo-1485955900006-10f4d324d411?w=500&h=400&fit=crop',
    category: 'Home & Garden',
    rating: 4.3,
    reviewCount: 187,
    inStock: true,
    attributes: {
      material: 'Bamboo',
      tiers: '3',
      width: '28 inches',
      height: '36 inches',
    },
  },
];
