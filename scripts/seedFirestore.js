/**
 * Firestore Seed Script — The CraftNest
 * =====================================
 * Run this ONE TIME in your browser console (or as a Node script)
 * to populate the `products` collection in Firestore with the
 * existing mock products from /api/products.json
 *
 * HOW TO USE (Browser Console):
 * 1. Open the app with your Firebase config live (npm run dev)
 * 2. Open DevTools Console (F12)
 * 3. Paste and run this script
 *
 * HOW TO USE (Node):
 * npm install firebase-admin
 * node scripts/seedFirestore.js
 */

// ─── Browser version (uses the app's existing Firebase instance) ─────────────

import { db } from '../src/lib/firebase.js';
import { collection, doc, setDoc } from 'firebase/firestore';

const products = [
  {
    id: 'prod-1',
    name: 'Ocean Blue Coaster Set',
    price: 45,
    image: 'https://picsum.photos/seed/resin1/500/500',
    category: 'resin',
    tags: ['blue', 'coaster', 'ocean', 'home'],
    vendorId: 'vendor-seed',
    vendorName: "Priya's Resin Studio",
    rating: 4.5,
    reviewCount: 12,
    stock: 10,
  },
  {
    id: 'prod-2',
    name: 'Geometric Display Tray',
    price: 68,
    image: 'https://picsum.photos/seed/resin2/500/500',
    category: 'resin',
    tags: ['geometric', 'tray', 'display', 'modern'],
    vendorId: 'vendor-seed',
    vendorName: "Priya's Resin Studio",
    rating: 5.0,
    reviewCount: 8,
    stock: 5,
  },
  {
    id: 'prod-3',
    name: 'Initial Keychains',
    price: 45,
    image: 'https://picsum.photos/seed/keychain/500/500',
    category: 'keychains',
    tags: ['keychain', 'initial', 'personal', 'glitter'],
    vendorId: 'vendor-seed',
    vendorName: "Priya's Resin Studio",
    rating: 4.2,
    reviewCount: 24,
    stock: 20,
  },
  {
    id: 'prod-4',
    name: 'Decorite Wall Hanging',
    price: 60,
    image: 'https://picsum.photos/seed/wallart/500/500',
    category: 'wall-hangings',
    tags: ['wall', 'hanging', 'decor', 'floral'],
    vendorId: 'vendor-seed',
    vendorName: "Priya's Resin Studio",
    rating: 4.8,
    reviewCount: 15,
    stock: 8,
  },
  {
    id: 'prod-5',
    name: 'Rose Bouquet',
    price: 55,
    image: 'https://picsum.photos/seed/bouquet1/500/500',
    category: 'bouquets',
    tags: ['rose', 'bouquet', 'floral', 'red'],
    vendorId: 'vendor-seed',
    vendorName: "Priya's Resin Studio",
    rating: 4.9,
    reviewCount: 30,
    stock: 15,
  },
  {
    id: 'prod-6',
    name: 'Dried Flower Bouquet',
    price: 40,
    image: 'https://picsum.photos/seed/bouquet2/500/500',
    category: 'bouquets',
    tags: ['dried', 'flower', 'rustic', 'boho'],
    vendorId: 'vendor-seed',
    vendorName: "Priya's Resin Studio",
    rating: 4.6,
    reviewCount: 18,
    stock: 12,
  },
  {
    id: 'prod-7',
    name: 'Custom 3D Figurine',
    price: 85,
    image: 'https://picsum.photos/seed/3dtoy/500/500',
    category: '3d',
    tags: ['3d', 'figurine', 'custom', 'toy'],
    vendorId: 'vendor-seed',
    vendorName: "Priya's Resin Studio",
    rating: 4.7,
    reviewCount: 22,
    stock: 6,
  },
  {
    id: 'prod-8',
    name: 'Wooden LED Nameplate',
    price: 95,
    image: 'https://picsum.photos/seed/nameplate/500/500',
    category: 'nameplates',
    tags: ['wooden', 'led', 'nameplate', 'office'],
    vendorId: 'vendor-seed',
    vendorName: "Priya's Resin Studio",
    rating: 4.9,
    reviewCount: 40,
    stock: 3,
  },
];

async function seedProducts() {
  console.log('Seeding products to Firestore...');
  const productsRef = collection(db, 'products');
  
  for (const product of products) {
    const { id, ...data } = product;
    await setDoc(doc(productsRef, id), data);
    console.log(`✓ Seeded: ${product.name}`);
  }
  
  console.log('✅ All products seeded!');
}

seedProducts().catch(console.error);
