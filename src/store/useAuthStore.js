import { create } from 'zustand';
import { onAuthStateChanged } from 'firebase/auth';
import { auth } from '../lib/firebase';
import { getUserProfile, authService } from '../services/authService';

export const useAuthStore = create((set, get) => ({
  user: null,           // Firestore profile: { uid, name, email, role, shopName, ... }
  firebaseUser: null,   // Raw Firebase user object
  isAuthenticated: false,
  isLoading: true,      // True until onAuthStateChanged fires for the first time

  // ─── Role helpers ──────────────────────────────────────────────────────
  isAdmin: () => get().user?.role === 'admin',
  isVendor: () => get().user?.role === 'vendor',
  isCustomer: () => {
    const role = get().user?.role;
    return role === 'customer' || (get().isAuthenticated && !role);
  },

  // ─── Actions ───────────────────────────────────────────────────────────

  /**
   * Called after a successful login or registration.
   * `firebaseUser` = Firebase Auth user object
   * `profile` = Firestore user document
   */
  login: (firebaseUser, profile) =>
    set({ firebaseUser, user: profile, isAuthenticated: true, isLoading: false }),

  logout: async () => {
    await authService.logout();
    set({ firebaseUser: null, user: null, isAuthenticated: false, isLoading: false });
  },

  updateUser: (updates) =>
    set((state) => ({ user: { ...state.user, ...updates } })),

  /**
   * Bootstrap the auth listener.
   * Call this ONCE from App.jsx on mount.
   * Firebase will immediately fire with the cached session or null.
   */
  initAuthListener: () => {
    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
      if (firebaseUser) {
        try {
          const profile = await getUserProfile(firebaseUser.uid);
          if (profile && !profile.isBanned) {
            set({ firebaseUser, user: profile, isAuthenticated: true, isLoading: false });
          } else {
            // Profile missing or user is banned — force sign out
            await authService.logout();
            set({ firebaseUser: null, user: null, isAuthenticated: false, isLoading: false });
          }
        } catch {
          set({ firebaseUser: null, user: null, isAuthenticated: false, isLoading: false });
        }
      } else {
        set({ firebaseUser: null, user: null, isAuthenticated: false, isLoading: false });
      }
    });
    return unsubscribe; // Call to clean up listener
  },
}));
