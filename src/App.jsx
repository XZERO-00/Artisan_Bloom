import React, { useState, useEffect, Suspense } from 'react';
import { BrowserRouter as Router, Routes, Route, useLocation, Navigate } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import { Layout } from './components/layout/Layout';
const Home = React.lazy(() => import('./pages/Home').then(m => ({ default: m.Home })));
const Collection = React.lazy(() => import('./pages/Collection').then(m => ({ default: m.Collection })));
const Cart = React.lazy(() => import('./pages/Cart').then(m => ({ default: m.Cart })));
const Checkout = React.lazy(() => import('./pages/Checkout').then(m => ({ default: m.Checkout })));
const Login = React.lazy(() => import('./pages/Login').then(m => ({ default: m.Login })));
const ForgotPassword = React.lazy(() => import('./pages/ForgotPassword').then(m => ({ default: m.ForgotPassword })));
const MyOrders = React.lazy(() => import('./pages/MyOrders').then(m => ({ default: m.MyOrders })));
const CustomerProfile = React.lazy(() => import('./pages/profiles/CustomerProfile').then(m => ({ default: m.CustomerProfile })));
const VendorProfile = React.lazy(() => import('./pages/profiles/VendorProfile').then(m => ({ default: m.VendorProfile })));
const AdminProfile = React.lazy(() => import('./pages/profiles/AdminProfile').then(m => ({ default: m.AdminProfile })));
import { AnimatePresence } from 'framer-motion';
import { PageTransition } from './components/layout/PageTransition';
import { Preloader } from './components/layout/Preloader';
import { ProtectedRoute } from './components/layout/ProtectedRoute';
import { useAuthStore } from './store/useAuthStore';
import { useThemeStore } from './store/useThemeStore';

const AnimatedRoutes = () => {
  const location = useLocation();
  
  return (
    <AnimatePresence mode="wait">
      <Suspense fallback={<div className="flex h-[60vh] items-center justify-center" role="status" aria-label="Loading page"><div className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin"></div></div>}>
        <Routes location={location} key={location.pathname}>
          <Route element={<Layout />}>
            <Route path="/" element={<PageTransition><Home /></PageTransition>} />
            <Route path="/collections" element={<PageTransition><Collection /></PageTransition>} />
            <Route path="/cart" element={<PageTransition><Cart /></PageTransition>} />
            <Route path="/checkout" element={<PageTransition><Checkout /></PageTransition>} />
            <Route path="/orders" element={<PageTransition><MyOrders /></PageTransition>} />
            <Route path="/login" element={<PageTransition><Login /></PageTransition>} />
            <Route path="/register" element={<Navigate to="/login" replace />} />
            <Route path="/forgot-password" element={<PageTransition><ForgotPassword /></PageTransition>} />
            {/* Role-based profile routes */}
            <Route path="/profile/customer" element={
              <ProtectedRoute allowedRoles={['customer', 'admin']}>
                <PageTransition><CustomerProfile /></PageTransition>
              </ProtectedRoute>
            } />
            <Route path="/profile/vendor" element={
              <ProtectedRoute allowedRoles={['vendor', 'admin']}>
                <PageTransition><VendorProfile /></PageTransition>
              </ProtectedRoute>
            } />
            <Route path="/profile/admin" element={
              <ProtectedRoute allowedRoles={['admin']}>
                <PageTransition><AdminProfile /></PageTransition>
              </ProtectedRoute>
            } />
          </Route>
        </Routes>
      </Suspense>
    </AnimatePresence>
  );
};

function App() {
  const [isPreloading, setIsPreloading] = useState(true);
  const { isLoading: isAuthLoading, initAuthListener } = useAuthStore();
  const initTheme = useThemeStore(state => state.initTheme);

  // Boot Firebase auth state listener once on mount
  useEffect(() => {
    initTheme();
    initAuthListener();
  }, [initAuthListener, initTheme]);

  return (
    <>
      <AnimatePresence mode="wait">
        {isPreloading && <Preloader key="preloader" onComplete={() => setIsPreloading(false)} />}
      </AnimatePresence>
      
      {!isPreloading && (
        <Router>
          <Toaster position="bottom-right" />
          <AnimatedRoutes />
        </Router>
      )}
    </>
  );
}

export default App;
