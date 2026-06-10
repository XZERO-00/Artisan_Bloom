import { create } from 'zustand';
import {
  collection, doc, addDoc, setDoc, updateDoc,
  query, where, orderBy, onSnapshot, getDoc, getDocs,
  serverTimestamp, increment,
} from 'firebase/firestore';
import { db } from '../lib/firebase';

/**
 * Chat store backed by Firestore.
 *
 * Collections:
 *   threads/{threadId}           — thread metadata + unread counters
 *   threads/{threadId}/messages  — individual messages (ordered by timestamp)
 *
 * Listeners are stored in `_listeners` (not exposed to UI) and cleaned up
 * by calling the returned unsubscribe functions.
 */
export const useChatStore = create((set, get) => ({
  threads: [],
  activeThreadId: null,
  activeMessages: [],
  _unsubThreads: null,
  _unsubMessages: null,

  // ─── Thread management ──────────────────────────────────────────────────

  /**
   * Get an existing thread between this customer+vendor+product, or create one.
   * Returns the threadId.
   */
  getOrCreateThread: async ({ customerId, customerName, vendorId, vendorName, productId, productName }) => {
    // Deterministic ID so duplicates are impossible
    const threadId = `${customerId}_${vendorId}_${productId}`;
    const threadRef = doc(db, 'threads', threadId);
    const snap = await getDoc(threadRef);

    if (!snap.exists()) {
      await setDoc(threadRef, {
        customerId, customerName,
        vendorId, vendorName,
        productId, productName,
        unreadByVendor: 0,
        unreadByCustomer: 0,
        createdAt: serverTimestamp(),
        lastMessageAt: serverTimestamp(),
      });
    }

    set({ activeThreadId: threadId });
    return threadId;
  },

  setActiveThread: (threadId) => {
    set({ activeThreadId: threadId });
  },

  clearActiveThread: () => {
    // Clean up message listener
    get()._unsubMessages?.();
    set({ activeThreadId: null, activeMessages: [], _unsubMessages: null });
  },

  // ─── Real-time listeners ────────────────────────────────────────────────

  /**
   * Subscribe to all threads for a user (by role).
   * Updates `threads` in real-time.
   */
  subscribeToUserThreads: (userId, role) => {
    // Unsubscribe from any previous listener
    get()._unsubThreads?.();

    const field = role === 'vendor' ? 'vendorId' : 'customerId';
    const q = query(
      collection(db, 'threads'),
      where(field, '==', userId),
      orderBy('lastMessageAt', 'desc')
    );

    const unsub = onSnapshot(q, (snap) => {
      const threads = snap.docs.map(d => ({ threadId: d.id, ...d.data() }));
      set({ threads });
    });

    set({ _unsubThreads: unsub });
    return unsub;
  },

  /**
   * Subscribe to messages inside the active thread.
   * Updates `activeMessages` in real-time.
   */
  subscribeToMessages: (threadId) => {
    get()._unsubMessages?.();

    const q = query(
      collection(db, 'threads', threadId, 'messages'),
      orderBy('timestamp', 'asc')
    );

    const unsub = onSnapshot(q, (snap) => {
      const messages = snap.docs.map(d => ({ id: d.id, ...d.data() }));
      set({ activeMessages: messages });
    });

    set({ _unsubMessages: unsub });
    return unsub;
  },

  // ─── Messaging ──────────────────────────────────────────────────────────

  sendMessage: async (threadId, { senderId, senderName, text, senderRole }) => {
    if (!threadId || !text.trim()) return;

    const messagesRef = collection(db, 'threads', threadId, 'messages');
    await addDoc(messagesRef, {
      senderId,
      senderName,
      text: text.trim(),
      timestamp: serverTimestamp(),
    });

    // Update thread metadata and unread counter for the OTHER party
    const threadRef = doc(db, 'threads', threadId);
    await updateDoc(threadRef, {
      lastMessageAt: serverTimestamp(),
      ...(senderRole === 'customer'
        ? { unreadByVendor: increment(1) }
        : { unreadByCustomer: increment(1) }),
    });
  },

  markAsRead: async (threadId, role) => {
    if (!threadId) return;
    const threadRef = doc(db, 'threads', threadId);
    await updateDoc(threadRef, {
      ...(role === 'vendor'
        ? { unreadByVendor: 0 }
        : { unreadByCustomer: 0 }),
    });
  },

  // ─── Derived helpers ────────────────────────────────────────────────────

  getUnreadCount: (userId, role) => {
    return get().threads.reduce((acc, t) => {
      if (role === 'vendor' && t.vendorId === userId) return acc + (t.unreadByVendor || 0);
      if (role === 'customer' && t.customerId === userId) return acc + (t.unreadByCustomer || 0);
      return acc;
    }, 0);
  },

  getThreadsForUser: (userId, role) => {
    return get().threads; // Already filtered by subscribeToUserThreads
  },
}));
