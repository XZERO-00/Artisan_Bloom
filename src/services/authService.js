import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
  sendPasswordResetEmail,
} from 'firebase/auth';
import {
  doc,
  setDoc,
  getDoc,
  getDocs,
  updateDoc,
  collection,
  serverTimestamp,
} from 'firebase/firestore';
import { auth, db } from '../lib/firebase';

// ─── Helpers ────────────────────────────────────────────────────────────────

/** Fetch the public profile document for a given Firebase UID. */
export const getUserProfile = async (uid) => {
  const snap = await getDoc(doc(db, 'users', uid));
  return snap.exists() ? { uid, ...snap.data() } : null;
};

// ─── Auth Service ────────────────────────────────────────────────────────────

export const authService = {
  /**
   * Register a new user.
   * Creates a Firebase Auth account AND a Firestore `users/{uid}` document.
   */
  register: async (userData) => {
    const { email, password, fullName, phone, role = 'customer', shopName = '', shopBio = '' } = userData;

    // 1. Create account in Firebase Auth
    const credential = await createUserWithEmailAndPassword(auth, email, password);
    const uid = credential.user.uid;

    // 2. Write profile doc in Firestore
    const profileDoc = {
      name: fullName,
      email,
      phone,
      role,
      shopName: role === 'vendor' ? (shopName || `${fullName}'s Shop`) : null,
      shopBio: role === 'vendor' ? (shopBio || '') : null,
      avatar: null,
      isApproved: true,   // Auto-approve; flip to false for manual vendor review workflow
      isBanned: false,
      createdAt: serverTimestamp(),
    };

    await setDoc(doc(db, 'users', uid), profileDoc);

    return { success: true, message: 'Registration successful! Welcome to The CraftNest.' };
  },

  /**
   * Login an existing user.
   * Returns the Firebase auth credential + the Firestore profile.
   */
  login: async (email, password) => {
    const credential = await signInWithEmailAndPassword(auth, email, password);
    const profile = await getUserProfile(credential.user.uid);

    if (!profile) throw new Error('Account profile not found. Please contact support.');
    if (profile.isBanned) throw new Error('Your account has been suspended. Contact support.');

    return {
      success: true,
      firebaseUser: credential.user,
      profile,
    };
  },

  /** Sign the current user out of Firebase Auth. */
  logout: async () => {
    await signOut(auth);
  },

  /** Send a password reset email via Firebase Auth. */
  resetPassword: async (email) => {
    await sendPasswordResetEmail(auth, email);
    return { success: true, message: 'Password reset link sent to your email.' };
  },

  // ─── Admin-only helpers ─────────────────────────────────────────────────

  /** Fetch all users (should only be called from AdminProfile behind role check). */
  getAllUsers: async () => {
    const snap = await getDocs(collection(db, 'users'));
    return snap.docs.map(d => ({ uid: d.id, ...d.data() }));
  },

  /** Update arbitrary fields on a user document (ban, approve, etc.). */
  updateUserStatus: async (uid, updates) => {
    await updateDoc(doc(db, 'users', uid), updates);
    return { success: true };
  },
};
