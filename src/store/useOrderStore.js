/**
 * useOrderStore — Firestore backed
 * Replaces the old Zustand persist (localStorage) order store.
 *
 * Firestore schema:
 *   orders/{orderId}
 *     userId, userEmail, items[], total, shipping{}, paymentMethod, status, createdAt
 */
import { create } from 'zustand';
import {
  collection, addDoc, query, where,
  orderBy, onSnapshot, serverTimestamp, doc, updateDoc,
} from 'firebase/firestore';
import { db } from '../lib/firebase';

export const useOrderStore = create((set, get) => ({
  orders: [],
  _unsubscribe: null,

  /**
   * Place a new order — writes to Firestore.
   * Returns the newly created document ID.
   */
  addOrder: async (orderData) => {
    const ref = await addDoc(collection(db, 'orders'), {
      ...orderData,
      status: 'Processing',
      createdAt: serverTimestamp(),
    });
    return ref.id;
  },

  /**
   * Subscribe to all orders belonging to a user (by UID).
   * Updates `orders` in real-time via onSnapshot.
   * Returns the unsubscribe function.
   */
  subscribeToUserOrders: (userId) => {
    // Clean up any existing listener
    get()._unsubscribe?.();

    const q = query(
      collection(db, 'orders'),
      where('userId', '==', userId),
      orderBy('createdAt', 'desc')
    );

    const unsub = onSnapshot(q, (snap) => {
      const orders = snap.docs.map(d => ({
        id: d.id,
        ...d.data(),
        // Convert Firestore Timestamp → JS Date string for display
        date: d.data().createdAt?.toDate?.().toISOString() || new Date().toISOString(),
      }));
      set({ orders });
    });

    set({ _unsubscribe: unsub });
    return unsub;
  },

  /**
   * Admin only — subscribe to ALL orders across all users.
   */
  subscribeToAllOrders: () => {
    get()._unsubscribe?.();
    const q = query(collection(db, 'orders'), orderBy('createdAt', 'desc'));
    const unsub = onSnapshot(q, (snap) => {
      const orders = snap.docs.map(d => ({
        id: d.id,
        ...d.data(),
        date: d.data().createdAt?.toDate?.().toISOString() || new Date().toISOString(),
      }));
      set({ orders });
    });
    set({ _unsubscribe: unsub });
    return unsub;
  },

  updateOrderStatus: async (orderId, status) => {
    await updateDoc(doc(db, 'orders', orderId), { status });
  },

  cleanup: () => {
    get()._unsubscribe?.();
    set({ orders: [], _unsubscribe: null });
  },
}));
